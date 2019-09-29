/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from "@tensorflow/tfjs";

/**
 * Test whether a given URL is retrievable.
 */
export async function urlExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (err) {
    bugsnagClient.notify(err);
    return false;
  }
}

/**
 * Load pretrained model stored at a remote URL.
 *
 * @return An instance of `tf.Model` with model topology and weights loaded.
 */
export async function loadHostedPretrainedModel(url) {
  console.log("Loading pretrained model from " + url);
  try {
    const model = await tf.loadLayersModel(url);
    console.log("Done loading pretrained model.");
    return model;
  } catch (err) {
    console.error(err);
    bugsnagClient.notify(err);
    console.error("Loading pretrained model failed.");
  }
}

/**
 * Load metadata file stored at a remote URL.
 *
 * @return An object containing metadata as key-value pairs.
 */
export async function loadHostedMetadata(url) {
  console.log("Loading metadata from " + url);
  try {
    const metadataJson = await fetch(url);
    const metadata = await metadataJson.json();
    console.log("Done loading metadata.");
    return metadata;
  } catch (err) {
    console.error(err);
    bugsnagClient.notify(err);
    console.error("Loading metadata failed.");
  }
}
