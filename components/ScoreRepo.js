import React from "react";
import { Mutation } from "react-apollo";
import { repoQuery, addRepoScore } from "../lib/graphQueries";
import { getSentimentAnalysis, setupModel } from "../lib/predict";

export default class RepoInput extends React.Component {
  constructor() {
    super();
    this.state = {
      textboxValue: "",
      model: null,
      predictor: null,
      enableText: false
    };
  }

  async componentDidMount() {
    const { model, predictor } = await setupModel();
    this.setState({
      model,
      predictor,
      enableText: true
    });
  }

  handleTextboxValueChange = e => {
    this.setState({
      textboxValue: e.target.value
    });
  };

  getSentimentAndUpdate = async (addRepo, repoUrl) => {
    const sentiment_output = await getSentimentAnalysis(
      repoUrl,
      this.state.model,
      this.state.predictor
    );
    console.debug(sentiment_output);
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
  };

  handleTextboxKeyPress = (e, addRepo) => {
    if (e.key === "Enter") {
      const repoUrl = this.state.textboxValue;
      this.getSentimentAndUpdate(addRepo, repoUrl);
    }
  };

  render() {
    return (
      <Mutation mutation={addRepoScore}>
        {(addRepo, { data, loading, called, error }) => {
          return (
            <div className="parentContainer">
              <input
                disabled={!this.state.enableText}
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
