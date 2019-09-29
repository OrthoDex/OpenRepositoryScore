import * as map from "lodash.map";
import * as isEmpty from "lodash.isempty";

const fetchLastFewItemsBody = async (repo, user, item) => {
  const result = await fetch(
    `https://api.github.com/repos/${user}/${repo}/${item}/comments`
  )
    .then(res => res.json())
    .then(results => map(results, comment => comment.body))
    .then(results => results.join(". "))
    .catch(err => console.error(err));

  return result;
};

const fetchPullRequestComments = (repo, user) =>
  fetchLastFewItemsBody(repo, user, "pulls");

const fetchIssueComments = (repo, user) =>
  fetchLastFewItemsBody(repo, user, "issues");

const getCommunityProfile = async (repo, user) => {
  const result = await fetch(
    `https://api.github.com/repos/${user}/${repo}/community/profile`,
    {
      headers: {
        Accept: "application/vnd.github.black-panther-preview+json"
      }
    }
  ).then(resp => resp.json());
  const { health_percentage: health_percent, files } = result;

  const fileContentHash = await Promise.all(
    map(files, async (v, k) => {
      let content;
      if (v && v.url) {
        if (k === "code_of_conduct") {
          content = await fetch(v.url, {
            headers: {
              Accept: "application/vnd.github.scarlet-witch-preview+json"
            }
          })
            .then(response => response.json())
            .then(json => json.body)
            .then(btoa)
            .catch(err => {
              console.error(err);
              return null;
            });
        } else {
          content = await fetch(v.url)
            .then(response => response.json())
            .then(json => json.content)
            .catch(err => {
              console.error(err);
              return null;
            });
        }
      }

      return {
        name: k,
        content: content,
        missing: isEmpty(content) ? true : false
      };
    })
  );

  const issueComments = await fetchIssueComments(repo, user);
  const prComments = await fetchPullRequestComments(repo, user);
  return {
    health_percent,
    issueComments,
    prComments,
    fileContentHash
  };
};

const getTextValueForRepo = async repoUrl => {
  const split = repoUrl.split("/");
  return getCommunityProfile(split[split.length - 1], split[split.length - 2]);
};

export { getTextValueForRepo };
