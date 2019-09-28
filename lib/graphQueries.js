import gql from "graphql-tag";

const repoQuery = gql`
  query repo($skip: Int!) {
    repo(offset: $skip, limit: 5) {
      id
      name
      url
      sentiment_score
      sentiment_description
      updated_at
      sentiment_labels
    }
    repo_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const addRepoScore = gql`
  mutation {
    insert_repo(objects: [{ url: "https://github.com/ml5js/ml5-examples1" }]) {
      affected_rows
      returning {
        id
        name
        url
      }
    }
  }
`;

export { addRepoScore, repoQuery };
