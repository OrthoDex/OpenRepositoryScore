import gql from "graphql-tag";

const repoQuery = gql`
  query repo($skip: Int!, $param: String!) {
    repo(
      where: { name: { _like: $param } }
      offset: $skip
      limit: 5
      order_by: { created_at: desc }
    ) {
      id
      name
      url
      sentiment_score
      sentiment_description
      updated_at
      sentiment_labels
      sentiment_details
    }
    repo_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const searchRepo = gql`
  query repo($param: String!) {
    repo(where: { name: { _like: $param } }, limit: 5) {
      id
      name
      sentiment_score
      sentiment_description
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

export { addRepoScore, repoQuery, searchRepo };
