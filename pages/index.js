import App from "../components/App";
import Header from "../components/Header";
import RepoList from "../components/RepoList";
import RepoInput from "../components/ScoreRepo";
import { Icon, Container } from "semantic-ui-react";

export default () => (
  <App>
    <Header />
    <RepoInput />
    <RepoList />
    <Container textAlign="center">
      <p>
        Made with <Icon name="heart" color="red" />
        and respect in Berkeley and Mumbai.
        <Icon name="copyright" /> Ishaan Malhi 2019
      </p>
    </Container>
  </App>
);
