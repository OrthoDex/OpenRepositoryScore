import React from "react";
import { Mutation } from "react-apollo";
import { addRepoScore, repoQuery } from "../lib/graphQueries";
import { setupModel } from "../lib/predict";
import { getRepoScore } from "../lib/score";
import { Input, Dimmer, Loader } from "semantic-ui-react";

export default class RepoInput extends React.Component {
  constructor() {
    super();
    this.state = {
      textboxValue: "",
      model: null,
      predictor: null,
      enableText: false,
      processing: false
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
    const sentiment_output = await getRepoScore(
      repoUrl,
      this.state.model,
      this.state.predictor
    );
    console.debug(sentiment_output);
    this.setState({
      processing: false,
      enableText: true,
      textboxValue: ""
    });
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
      refetchQueries: ({ data: insert_repo }) => [
        { query: repoQuery, variables: { skip: 0 } }
      ]
    });
  };

  handleTextboxKeyPress = (e, addRepo) => {
    if (e.key === "Enter") {
      this.setState({
        processing: true
      });
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
              <section>
                <Input
                  disabled={!this.state.enableText}
                  className="input"
                  placeholder="Add a repo"
                  value={this.state.textboxValue}
                  onChange={this.handleTextboxValueChange}
                  onKeyPress={e => {
                    this.handleTextboxKeyPress(e, addRepo);
                  }}
                />
                <Dimmer active={this.state.processing}>
                  <Loader indeterminate>
                    Preparing analysis. This might take a while.
                  </Loader>
                </Dimmer>
                <p>{this.state.processing ? "processing your request" : ""}</p>
              </section>
              <br />
            </div>
          );
        }}
      </Mutation>
    );
  }
}
