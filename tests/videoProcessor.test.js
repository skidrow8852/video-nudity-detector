const { detectNudityInVideo } = require('../src/videoProcessor');

test('detectNudityInVideo detects nudity correctly', async () => {
  const result = await detectNudityInVideo('/media/video.mp4', '/media/output_video.mp4');
  expect(result).toBe(true); // or false 
});
