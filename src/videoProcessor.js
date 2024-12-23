const ffmpeg = require('fluent-ffmpeg');
const Pipe2Jpeg = require('pipe2jpeg');
const { processPrediction } = require('./predictionProcessor');
const { blurVideo } = require('./utils');

async function detectNudityInVideo(videoPath, outputPath, blur) {
  const pipe2jpeg = new Pipe2Jpeg();
  let nudityDetected = false;

  pipe2jpeg.on('data', async (jpegBuffer) => {
    const t = {};
    t.buffer = tf.node.decodeJpeg(jpegBuffer, 3);
    t.cast = tf.cast(t.buffer, 'float32');
    t.input = tf.expandDims(t.cast, 0);
    const model = await loadModel();
    const [boxes, scores, classes] = await model.executeAsync(t.input, ['output1', 'output2', 'output3']);
    const prediction = await processPrediction(boxes, scores, classes);

    if (prediction.nude) {
      nudityDetected = true;
      if (blur) {
        blurVideo(videoPath, outputPath, prediction.parts[0].box);
      }
    }

    tf.dispose([boxes, scores, classes]);
  });

  // Use fluent-ffmpeg to process the video and pipe frames to pipe2jpeg
  ffmpeg(videoPath)
    .outputOptions([
      '-loglevel quiet',
      '-an', // Remove audio
      '-c:v mjpeg', // Output as MJPEG
      '-pix_fmt yuvj422p', // Set pixel format
      '-f image2pipe', // Output as image stream
    ])
    .pipe(pipe2jpeg, { end: true })
    .on('error', (err) => console.error('ffmpeg error:', err))
    .on('end', () => console.log('ffmpeg processing finished'));

  return nudityDetected;
}

module.exports = {
  detectNudityInVideo,
};
