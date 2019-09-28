import React from "react";
import { Mutation } from "react-apollo";
import { repoQuery, addRepoScore } from "../lib/graphQueries";
import { setupModel } from "../lib/predict";
import { getRepoScore } from "../lib/score";

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
                <input
                  disabled={!this.state.enableText}
                  className="input"
                  placeholder={
                    this.state.enableText
                      ? "Add a repo"
                      : "Loading Machine Learning Models"
                  }
                  value={this.state.textboxValue}
                  onChange={this.handleTextboxValueChange}
                  onKeyPress={e => {
                    this.handleTextboxKeyPress(e, addRepo);
                  }}
                />
                <p>{this.state.processing ? "processing your request" : ""}</p>
              </section>
              <style jsx>{`
                section {
                  padding-bottom: 20px;
                }
                li {
                  display: block;
                  margin-bottom: 10px;
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
                input:before {
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
              <br />
            </div>
          );
        }}
      </Mutation>
    );
  }
}
