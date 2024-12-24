const tf = require('@tensorflow/tfjs-node');
const path = require('path');

let model;

const options = { 
  modelPath: path.join(__dirname, 'src', 'model', 'default-f16', 'model.json'),
};
async function loadModel() {
  await tf.ready();
  model = await tf.loadGraphModel(options.modelPath);
  return model;
}

function getModel() {
  if (!model) {
    throw new Error('Model has not been loaded yet. Call loadModel() first.');
  }
  return model;
}

module.exports = {
  loadModel,
  getModel,
};