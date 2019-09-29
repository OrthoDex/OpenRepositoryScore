import gql from "graphql-tag";

const repoQuery = gql`
  query repo($skip: Int!) {
    repo(offset: $skip, limit: 5, order_by: { created_at: desc }) {
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
  mutation insert_repo($objects: [repo_insert_input!]!) {
    insert_repo(objects: $objects) {
      affected_rows
      returning {
        id
        name
        url
        sentiment_score
        sentiment_description
        updated_at
        sentiment_labels
      }
    }
  }
`;

export { addRepoScore, repoQuery };
