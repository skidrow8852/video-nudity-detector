const ffmpeg = require('fluent-ffmpeg');

function blurVideo(inputVideo, outputVideo, parts) {
  const [x, y, w, h] = parts;

  ffmpeg(inputVideo)
    .videoFilter([
      'boxblur=luma_radius=10:luma_power=1', // Apply blur
      `drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=black@0.5:t=fill`, // Draw box over the region
    ])
    .videoCodec('libx264') // Set video codec
    .preset('fast') // Set preset for faster processing
    .output(outputVideo) 
    .on('error', (err) => {
      console.error('FFmpeg error:', err.message);
    })
    .on('end', () => {
      console.log('Blurring completed and output saved to:', outputVideo);
    })
    .run(); 
}

module.exports = {
  blurVideo,
};
