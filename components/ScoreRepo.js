import React from "react";
import { Mutation } from "react-apollo";
import { repoQuery, addRepoScore } from "../lib/graphQueries";
import { getSentimentAnalysis } from "../lib/predict";

export default class RepoInput extends React.Component {
  constructor() {
    super();
    this.state = {
      textboxValue: ""
    };
  }
  
  handleTextboxValueChange = e => {
    this.setState({
      textboxValue: e.target.value
    });
  };

  handleTextboxKeyPress = async (e, addRepo) => {
    if (e.key === "Enter") {
      const repoUrl = this.state.textboxValue;
      const results = await getSentimentAnalysis(repoUrl)
      console.log(results)
      const [...sentiment_output] = results;
      addRepo({
        variables: {
          objects: [
            Object.assign(
              {
                url: repoUrl
              },
              sentiment_output
            )
          ]
        },
        update: (store, { data: { insert_repo } }) => {
          const data = store.readQuery({ query: repoQuery });
          const insertedRepo = insert_repo.returning;
          data.repo.splice(0, 0, insertedRepo[0]);
          store.writeQuery({
            query: repoQuery,
            data
          });
          this.setState({
            textboxValue: ""
          });
        }
      });
    }
  };

  render() {
    return (
      <Mutation mutation={addRepoScore}>
        {(addRepo, { data, loading, called, error }) => {
          return (
            <div className="parentContainer">
              <input
                className="input"
                placeholder="Add a repo"
                value={this.state.textboxValue}
                onChange={this.handleTextboxValueChange}
                onKeyPress={e => {
                  this.handleTextboxKeyPress(e, addRepo);
                }}
              />
              <br />
            </div>
          );
        }}
      </Mutation>
    );
  }
}
