import { getSentimentAnalysis } from "./predict";
import { getTextValueForRepo } from "./githubClient";
import * as map from "lodash.map";
import * as mean from "lodash.mean";

const calculateScore = (health_percent, scores) => {
  return Number((0.7 * health_percent) / 10 + 0.3 * mean(scores));
};

const getClass = score => {
  switch (Math.ceil(score / 2)) {
    case 0:
      return "really bad"; // WHY DO I EVEN CODE FOR A LIVING
    case 1:
      return "bad";
    case 2:
      return "poor";
    case 3:
      return "okay";
    case 4:
      return "good";
    case 5:
      return "great";
  }
};

const getSentimentDescriptionAndLabels = (results, sentiment_score) => {
  // LOL please make this better
  const sentiment_description = `This repository has a score of ${sentiment_score}. It's a ${getClass(
    sentiment_score
  )} place to start contributing to open source`;
  const sentiment_labels = [];

  map(results, (value, key) => {
    if (!value) {
      return;
    }
    if (value.missing) {
      sentiment_labels.push([`${value.name} missing`]);
    }
    if (value.sentiment_labels && value.sentiment_labels.length > 0) {
      sentiment_labels.push(...value.sentiment_labels);
    }
  });
  if (sentiment_score >= 8) {
    sentiment_labels.push("beginner friendly");
  } else {
    sentiment_labels.push("needs work/improvement on community behaviour");
  }

  return {
    sentiment_description,
    sentiment_labels
  };
};

const getRepoScore = async (repoUrl, model, predictor) => {
  const {
    health_percent,
    fileContentHash,
    prComments,
    issueComments
  } = await getTextValueForRepo(repoUrl);
  const results = await Promise.all([
    ...map(fileContentHash, async values => {
      if (values.missing) {
        return;
      }
      let content;
      try {
        content = atob(values.content);
      } catch (error) {
        console.error(values);
        console.error(error);
      }
      const sentAnalysis = await getSentimentAnalysis(
        model,
        predictor,
        content ? content : values.content
      );
      return Object.assign(values, sentAnalysis);
    }),
    Promise.resolve(prComments)
      .then(comments => getSentimentAnalysis(model, predictor, comments))
      .then(result =>
        Object.assign({ name: "PR comments", missing: false }, result)
      ),
    Promise.resolve(issueComments)
      .then(comments => getSentimentAnalysis(model, predictor, comments))
      .then(result =>
        Object.assign({ name: "issue comments", missing: false }, result)
      )
  ]);

  console.log(results);

  const sentiment_score = calculateScore(
    health_percent,
    map(results, (v, k) => {
      return v && v.sentiment_score ? v.sentiment_score : -1;
    }).filter(x => x !== -1)
  );

  const {
    sentiment_description,
    sentiment_labels
  } = getSentimentDescriptionAndLabels(
    map(results, (v, k) => {
      if (!v) {
        return;
      }
      return {
        name: v.name,
        missing: v.missing
      };
    }),
    sentiment_score
  );

  const split = repoUrl.split("/");
  return {
    sentiment_score,
    name: `${split[split.length - 2]}/${split[split.length - 1]}`,
    sentiment_description,
    sentiment_labels,
    sentiment_details: results
  };
};

export { getRepoScore, getClass };
