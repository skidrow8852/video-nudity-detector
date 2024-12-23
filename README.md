# Nudity Detector

A package for detecting and blurring nudity in videos, that uses @tensorflow/tfjs-node for video processing.

## Installation

```bash
npm install nudity-detector
```

# Usage

```js
const { detectNudityInVideo } = require('video-nudity-detector');

async function main() {
  const videoPath = '/path/to/video.mp4';
  const outputPath = '/path/to/output_video.mp4';
  const blurVideo = true; // blur the nudity detected on the video 

   // Returns a bool (True) if nudity exists or (False) if it doesn't
  const nudityDetected = await detectNudityInVideo(videoPath, outputPath, blurVideo);

  if (nudityDetected) {
    console.log('Nudity detected and video blurred.');
  } else {
    console.log('No nudity detected.');
  }
}

main();
```