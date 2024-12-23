const { processPrediction } = require('../src/predictionProcessor');

test('processPrediction identifies nudity correctly', async () => {
  const dummyBoxes = [[0, 0, 100, 100]];
  const dummyScores = [0.9];
  const dummyClasses = [0]; 
  const result = await processPrediction(dummyBoxes, dummyScores, dummyClasses);
  expect(result.nude).toBe(true); 
});

