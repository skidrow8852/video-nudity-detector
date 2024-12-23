# Nudity Detector
A package for detecting and blurring nudity in videos, that uses @tensorflow/tfjs-node for video processing.

![DALL·E 2024-12-23 11 17 36 - A sleek and modern 'nudity-detector' interface displayed on a futuristic screen  The interface shows a digital, high-tech panel with various sensors, ](https://github.com/user-attachments/assets/c08c1202-a833-47a1-bda5-e430f51bd246)


## Installation

```bash
npm install video-nudity-detector
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
