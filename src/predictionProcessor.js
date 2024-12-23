const tf = require('@tensorflow/tfjs-node');

const labels = [
  'exposed anus', 'exposed armpits', 'belly', 'exposed belly', 'buttocks', 'exposed buttocks',
  'female face', 'male face', 'feet', 'exposed feet', 'breast', 'exposed breast', 'vagina',
  'exposed vagina', 'male breast', 'exposed male breast',
];

const composite = {
  person: [6, 7],
  sexy: [1, 2, 3, 4, 8, 9, 10, 15],
  nude: [0, 5, 11, 12, 13],
};

async function processPrediction(boxesTensor, scoresTensor, classesTensor) {
  const boxes = await boxesTensor.array();
  const scores = await scoresTensor.data();
  const classes = await classesTensor.data();
  const nmsT = await tf.image.nonMaxSuppressionAsync(boxes[0], scores, 50, 0.5, 0.3);
  const nms = await nmsT.data();
  tf.dispose(nmsT);

  const parts = [];
  for (const i of nms) {
    const id = parseInt(i);
    parts.push({
      score: scores[i],
      id: classes[id],
      class: labels[classes[id]],
      box: [
        Math.trunc(boxes[0][id][0]),
        Math.trunc(boxes[0][id][1]),
        Math.trunc((boxes[0][id][3] - boxes[0][id][1])),
        Math.trunc((boxes[0][id][2] - boxes[0][id][0])),
      ],
    });
  }

  return {
    person: parts.filter((a) => composite.person.includes(a.id)).length > 0,
    sexy: parts.filter((a) => composite.sexy.includes(a.id)).length > 0,
    nude: parts.filter((a) => composite.nude.includes(a.id)).length > 0,
    parts,
  };
}

module.exports = {
  processPrediction,
};
