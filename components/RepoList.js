import { Query } from "react-apollo";
import { repoQuery } from "../lib/graphQueries";
import {
  Rating,
  Label,
  Button,
  Header,
  Item,
  Modal,
  Container,
  Divider
} from "semantic-ui-react";
import isEmpty from "lodash.isempty";

export const repoQueryVars = {
  skip: 0
};

const colorMap = {
  //UGH
  "really bad": "red",
  bad: "orange",
  poor: "yellow",
  okay: "violet",
  good: "blue",
  great: "green",
  "beginner friendly": "green"
};

export default function RepoList() {
  return (
    <Query query={repoQuery} variables={repoQueryVars}>
      {({ loading, error, data: { repo, repo_aggregate }, fetchMore }) => {
        if (error) return <ErrorMessage message="Error loading repos." />;
        if (loading) return <div>Loading</div>;

        const areMorerepos = repo.length < repo_aggregate.aggregate.count;
        return (
          <section>
            <ul>
              {repo.map((a, index) => (
                <section>
                  <li key={a.id}>
                    <div>
                      <span>{index + 1}. </span>
                      <a>{a.name}</a>
                      <a href={a.url}>Link</a>
                      {a.sentiment_labels.map((label, index) => (
                        <Label key={index.id} color={colorMap[label]}>
                          {label}
                        </Label>
                      ))}
                    </div>
                    <div>
                      <p>
                        Sentiment Score:
                        <Rating
                          icon="star"
                          defaultRating={a.sentiment_score}
                          maxRating={10}
                          disabled="true"
                        />
                      </p>
                    </div>
                    <div>
                      <p>Sentiment Description: {a.sentiment_description}</p>
                    </div>
                    <div>
                      <p>
                        Last Updated at: {new Date(a.updated_at).toDateString()}
                      </p>
                    </div>
                    <div>
                      <Modal
                        size="large"
                        trigger={<Button>Show Details</Button>}
                      >
                        <Modal.Content>
                          <Modal.Description>
                            <Header>Details for {a.name}</Header>
                            <p>
                              Here's our analysis for the following parts of the
                              repository.
                            </p>
                            <p>
                              Please remember this is a best effort analysis. We
                              would recommend checking out a repository if you
                              are really interested regardless. :)
                            </p>
                            <p>
                              If you are the maintainer of a repository and you
                              want to voice a concern, please feel free to reach
                              out to us!
                            </p>
                            <div>
                              <section>
                                {!a.sentiment_details
                                  ? ""
                                  : a.sentiment_details
                                      .filter(value => !isEmpty(value))
                                      .map((details, index) => (
                                        <Container>
                                          <Item.Group key={index.id}>
                                            <Item.Content>
                                              <Item.Header>
                                                <h2>
                                                  {details
                                                    ? details.name
                                                    : "details pending"}
                                                </h2>
                                              </Item.Header>
                                              <Item.Meta>
                                                <span className="date">
                                                  Last analysis run at{" "}
                                                  {new Date(
                                                    a.updated_at
                                                  ).toTimeString()}
                                                </span>
                                              </Item.Meta>
                                              <Item.Description>
                                                <h4>Score</h4>
                                                {details
                                                  ? details.sentiment_score
                                                  : "details pending"}
                                              </Item.Description>
                                            </Item.Content>
                                          </Item.Group>
                                          <Divider horizontal> </Divider>
                                        </Container>
                                      ))}
                              </section>
                            </div>
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                    </div>
                  </li>
                </section>
              ))}
            </ul>
            {areMorerepos ? (
              <button onClick={() => loadMorerepos(repo, fetchMore)}>
                {" "}
                {loading ? "Loading..." : "Show More"}{" "}
              </button>
            ) : (
              ""
            )}
            <style jsx>{`
              section {
                padding-bottom: 20px;
              }
              li {
                display: block;
                margin-bottom: 20px;
              }
              div {
                align-items: center;
                display: flex;
              }
              a {
                font-size: 14px;
                margin-right: 10px;
                text-decoration: none;
                padding-bottom: 0;
                border: 0;
              }
              span {
                font-size: 14px;
                margin-right: 5px;
              }
              ul {
                margin: 0;
                padding: 0;
              }
              button:before {
                align-self: center;
                border-style: solid;
                border-width: 6px 4px 0 4px;
                border-color: #ffffff transparent transparent transparent;
                content: "";
                height: 0;
                margin-right: 5px;
                width: 0;
              }
            `}</style>
          </section>
        );
      }}
    </Query>
  );
}

function loadMorerepos(repo, fetchMore) {
  fetchMore({
    variables: {
      skip: repo.length
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return previousResult;
      }
      return Object.assign({}, previousResult, {
        // Append the new results to the old one
        repo: [...previousResult.repo, ...fetchMoreResult.repo]
      });
    }
  });
}
