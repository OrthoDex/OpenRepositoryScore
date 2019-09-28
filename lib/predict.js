import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

// The minimum prediction confidence.
const threshold = 0.9;

const getTextValueForRepo = repoUrl => {
  // TODO: implement this
  return "This is an amazing project!";
};

const getSentimentAnalysis = repoUrl => {
  // TODO: Implement this
  return toxicity.load(threshold).then(model => {
    return model.classify(getTextValueForRepo(repoUrl))
  }).then(
    predictions => {
      let labels = [];
      let sentiment_score = 10;
      predictions.map(pred => {
        if (pred.results[0].match === true) {
          labels.push(pred.label);
          sentiment_score -= 1;
        }
      })
      return {
        sentiment_score,
        labels
      }
    }
  ).then(({sentiment_score, labels}) => {
    return {
      sentiment_score,
      sentiment_description: "Looks good!",
      sentiment_labels: labels,
      name: "some repo"
    };
  })
};

export {
  getSentimentAnalysis
}