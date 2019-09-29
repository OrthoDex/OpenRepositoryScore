import App from "next/app";
import React from "react";
import withApolloClient from "../lib/with-apollo-client";
import { ApolloProvider } from "react-apollo";
import bugsnag from "@bugsnag/js";
import bugsnagReact from "@bugsnag/plugin-react";
const bugsnagClient = bugsnag("60aef36435f3a3fff4389ed7cf41c1c4");
bugsnagClient.use(bugsnagReact, React);
global.bugsnagClient = bugsnagClient;
const ErrorBoundary = bugsnagClient.getPlugin("react");
class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ErrorBoundary>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ErrorBoundary>
    );
  }
}

export default withApolloClient(MyApp);
