import App from "../components/App";
import Header from "../components/Header";

export default () => (
  <App>
    <Header />
    <article>Vote for Us in React Riot 2019!</article>
    <div id="vote-div"></div>
    <article>
      <h1>Open Source Community Sentiment</h1>
      <h2>Tech Used: </h2>
      <ul>
        <li>
          <p>
            <a href="https://www.apollographql.com/client/">Apollo</a> is a
            GraphQL client that allows you to easily query the exact data you
            need from a GraphQL server. In addition to fetching and mutating
            data, Apollo analyzes your queries and their results to construct a
            client-side cache of your data, which is kept up to date as further
            queries and mutations are run, fetching more results from the
            server.
          </p>
        </li>
      </ul>
      <ul>
        <p>
          In this simple example, we integrate Apollo seamlessly with{" "}
          <a href="https://github.com/zeit/next.js">Next</a> by wrapping our
          pages inside a{" "}
          <a href="https://facebook.github.io/react/docs/higher-order-components.html">
            higher-order component (HOC)
          </a>
          . Using the HOC pattern we're able to pass down a central store of
          query result data created by Apollo into our React component hierarchy
          defined inside each page of our Next application.
        </p>
      </ul>
      <ul>
        <p>
          We use <a href="https://hasura.io/">Hasura's</a> excellent graphql as
          a service platform to store the data we generate.
        </p>
      </ul>
      <ul>
        We use <a href="https://github.com/tensorflow/tfjs">Tensorflow js</a>{" "}
        with pretrained toxicity and LSTM based sentiment analysis models to
        score text.
      </ul>
      <ul>
        We fetch a repositories data, including code of conduct, readme,
        license, PR and issue comments via GitHub's REST v3 api.
      </ul>
    </article>
  </App>
);
