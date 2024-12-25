const ffmpeg = require('fluent-ffmpeg');
const Pipe2Jpeg = require('pipe2jpeg');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node'); 
const { processPrediction } = require('./predictionProcessor');
const { blurVideo } = require('./utils');
const { loadModel } = require('./modelLoader'); 
const os = require('os');
/**
 * Detect nudity in a video and optionally blur the detected nudity.
 * @param {string} videoPath - The path to the input video.
 * @param {string} outputPath - The path to the output video.
 * @param {boolean} [blur=false] - Whether to blur nudity in the video. Defaults to false.
 * @returns {Promise<boolean>} - Returns true if nudity is detected, otherwise false.
 */

// Set FFmpeg path for Windows
if (os.platform() === 'win32') {
  ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');
}

async function detectNudityInVideo(videoPath, outputPath='', blur = false) {
  try {
    // Validate input paths
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Input video path does not exist: ${videoPath}`);
    }

    const pipe2jpeg = new Pipe2Jpeg();
    let nudityDetected = false;

    pipe2jpeg.on('data', async (jpegBuffer) => {
      try {
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
            if (!fs.existsSync(outputPath)) {
              throw new Error(`Output path does not exist: ${outputPath}`);
            }
             blurVideo(videoPath, outputPath, prediction.parts[0].box);
          }
        }

        tf.dispose([boxes, scores, classes]);
      } catch (err) {
        console.error('Error processing JPEG buffer:', err);
      }
    });

    pipe2jpeg.on('error', (err) => {
      console.error('pipe2jpeg error:', err);
    });

    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          '-loglevel quiet',
          '-an', // Remove audio
          '-c:v mjpeg', // Output as MJPEG
          '-pix_fmt yuvj422p', // Set pixel format
          '-f image2pipe',
        ])
        .pipe(pipe2jpeg, { end: true })
        .on('error', (err) => {
          console.error('ffmpeg error:', err);
          reject(err); 
        })
        .on('end', () => {
          console.log('ffmpeg processing finished');
          resolve(); 
        });
    });

    return nudityDetected;
  } catch (err) {
    console.error('Error in detectNudityInVideo:', err);
    throw err;
  }
}

module.exports = {
  detectNudityInVideo,
};
