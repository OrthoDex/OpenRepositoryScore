import * as tf from "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";
import * as loader from "./loader";
import { OOV_INDEX, padSequences } from "./seq_utils";

// The minimum prediction confidence.
const threshold = 0.9;

const HOSTED_URLS = {
  model:
    "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json",
  metadata:
    "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json"
};

class SentimentPredictor {
  /**
   * Initializes the Sentiment demo.
   */
  async init(urls, model = null) {
    this.urls = urls;
    if (model) {
      this.model = model;
    } else {
      this.model = await loader.loadHostedPretrainedModel(urls.model);
    }
    await this.loadMetadata();
    return this;
  }

  async loadMetadata() {
    const sentimentMetadata = await loader.loadHostedMetadata(
      this.urls.metadata
    );
    console.log(sentimentMetadata);
    this.indexFrom = sentimentMetadata["index_from"];
    this.maxLen = sentimentMetadata["max_len"];
    console.log("indexFrom = " + this.indexFrom);
    console.log("maxLen = " + this.maxLen);

    this.wordIndex = sentimentMetadata["word_index"];
    this.vocabularySize = sentimentMetadata["vocabulary_size"];
    console.log("vocabularySize = ", this.vocabularySize);
  }

  predict(text) {
    // Convert to lower case and remove all punctuations.
    const inputText = text
      .trim()
      .toLowerCase()
      .replace(/(\.|\,|\!)/g, "")
      .split(" ");
    // Convert the words to a sequence of word indices.
    const sequence = inputText.map(word => {
      let wordIndex = this.wordIndex[word] + this.indexFrom;
      if (wordIndex > this.vocabularySize) {
        wordIndex = OOV_INDEX;
      }
      return wordIndex;
    });
    // Perform truncation and padding.
    const paddedSequence = padSequences([sequence], this.maxLen);
    const input = tf.tensor2d(paddedSequence, [1, this.maxLen]);

    const beginMs = performance.now();
    const predictOut = this.model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();
    const endMs = performance.now();

    return { score: score, elapsed: endMs - beginMs };
  }
}

const storeModel = async (model, path) => {
  try {
    await model.model.save(path);
  } catch (err) {
    console.error(err);
    bugsnagClient.notify(err);
    return Promise.resolve();
  }
};

/**
 * Loads the pretrained model and metadata, and registers the predict
 * function with the UI.
 */
async function setupSentiment() {
  let predictor;
  let isStored = false;
  try {
    predictor = await tf.loadLayersModel("indexeddb://tf-sentiment-predictor");
    console.log("Loading saved model from indexed db");
    isStored = true;
  } catch (err) {
    bugsnagClient.notify(err);
    console.error(err);
    // refetch model
  }
  if (await loader.urlExists(HOSTED_URLS.model)) {
    console.log("Model available: " + HOSTED_URLS.model);
    predictor = await new SentimentPredictor().init(HOSTED_URLS, predictor);
  }
  if (isStored) {
    return predictor;
  }
  try {
    await storeModel(predictor, "indexeddb://tf-sentiment-predictor");
    console.log("saved sentiment model to indexeddb");
  } catch (err) {
    bugsnagClient.notify(err);
    console.log("Couldn't save model");
    console.error(err);
  }

  return predictor;
}

const loadToxicityModel = async () => {
  const model = await toxicity.load(threshold);
  return model;
};

const setupModel = () => {
  return setupSentiment().then(predictor => {
    return loadToxicityModel()
      .then(model => {
        console.log("loaded model");
        return model;
      })
      .then(model => {
        return {
          model,
          predictor
        };
      });
  });
};

const getSentimentAnalysis = (model, predictor, sampleText) => {
  return model
    .classify(sampleText)
    .then(predictions => {
      let labels = [];
      predictions.map(pred => {
        if (pred.results[0].match === true) {
          labels.push(pred.label);
        }
      });
      return {
        labels
      };
    })
    .then(({ labels }) => {
      // predict on text
      const prediction = predictor.predict(sampleText);
      console.log(prediction);
      return {
        sentiment_score: prediction.score * 10,
        labels
      };
    })
    .then(({ sentiment_score, labels }) => {
      return {
        sentiment_score,
        sentiment_labels: labels
      };
    });
};

export { getSentimentAnalysis, setupModel, SentimentPredictor };
