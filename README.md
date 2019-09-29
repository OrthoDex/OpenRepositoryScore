# CommunityScoreApp!

# About

Welcome! CommunityScoreApp (title WIP) is a react app that analyzes the sentiment within a GitHub project interaction.

Open Source can get quite overwhelming if one is just starting out, especially choosing where to begin since the list of projects and technology are endless. An uncomfortable first experience could discourage one from contributing again. It would make it easier to choose once you know you are welcome at the community.

Our app helps developers and open source maintainers understand the quality of interactions on their project and community by a “community score”. This score is assigned based on the sentiment analysis of various documents like the Code of Conduct, GitHub Templates, Readme as well as Pull Request and Issue conversations. We hope this encourages everyone in open source to maintain a high standard of community health and help maintainers ensure their project is welcoming as it starts to grow.

# Contributing & Feedback

You are very welcome to open an issue or pull request on this repository! This project is a Work in Progress, and we don't have everything right,
if you feel we need improvement in any way, please reach out!

# Details

CommunityScoreApp scrapes data from GitHub’s [community APIs](https://developer.github.com/v3/repos/community/) (experimental) as well as Pull request and Issue comments RESTful apis to fetch text data of the code of conduct, readme, pull request and issue comments. This text is then sent to a pre-trained Tensorflow.js Sentiment Analyzer and Toxicity Model built on an LSTM and Universal Sentence Encoder, to obtain sentiment scores on a scale of 1 to 10. The models are fetched from Google Cloud Storage and cached in IndexedDb for better load performance. The sentiment scoring happens entirely in the browser and does not use a backend. These scores are then computed in a weighted average, with a higher weight given to GitHub health percentage. All this data, including “sentiment labels” such as “beginner friendly”, is stored in a Hasura.io backend service. Hasura provides the GraphQL service on top of PostgreSQL that stores the repository analysis data.

We then use [Shields.io](https://shields.io/) to generate repository badges that maintainers can add to their repository.

The main app uses [Next.js](https://nextjs.org/) by Zeit and is deployed on [Zeit Now](https://zeit.co/home) using Serverless SSR. The Hasura backend service is hosted on Heroku.

# Tutorial

- Deploy Postgres and GraphQL Engine on Heroku:

  [![Deploy to heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/hasura/graphql-engine-heroku)

  Please checkout our [docs](https://docs.hasura.io/1.0/graphql/manual/deployment/index.html) for other deployment methods

- Get the Heroku app URL (say `my-app.herokuapp.com`)

- Run the app:
  ```bash
  npm run dev
  ```
- Test the app
  Visit [http://localhost:3000](http://localhost:3000) to view the app

# Serverless Mode

With Next.js 8, each page in the `pages` directory becomes a serverless lambda. To enable `serverless` mode, we add the `serverless` build `target` in `next.config.js`.

```
module.exports = {
  target: "serverless",
};
```

That's it! Now build the serverless app by running the following command:

```
npm run build
```

In the `.next` folder, you will see a `serverless` folder generated after the build. Inside that there is a `pages` folder, which will have outputs of lambda per page.

```
pages/index.js => .next/serverless/pages/index.js
pages/about.js => .next/serverless/pages/about.js
```

# Deploy to now.sh

Deploy it to the cloud with [now](https://zeit.co/now) ([download](https://zeit.co/download)):

```bash
npm install -g now
now
```

Note: Older versions of now-cli doesn't support serverless mode.
Once the deployment is successful, you will be able to navigate to pages `/` and `/about`, with each one internally being a lambda function which `now` manages.
