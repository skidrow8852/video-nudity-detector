# Nudity Detector
A package for detecting and blurring nudity in videos, that uses @tensorflow/tfjs-node for video processing.

![DALL·E 2024-12-23 11 17 36 - A sleek and modern 'nudity-detector' interface displayed on a futuristic screen  The interface shows a digital, high-tech panel with various sensors, ](https://github.com/user-attachments/assets/c08c1202-a833-47a1-bda5-e430f51bd246)


## Installation
1. Install the ```video-nudity-detector``` package

```bash
npm install video-nudity-detector
```
2. Install FFmpeg, This package requires **FFmpeg** to be installed on your system. Follow the instructions below based on your operating system:

##### For Windows:
1. Download FFmpeg from the official website: [FFmpeg Download](https://ffmpeg.org/download.html)
2. Choose the Windows version and download the zip file.
3. Extract the zip file to this directory ```(C:\ffmpeg)```.

##### For Linux:
On Ubuntu/Debian-based systems, install FFmpeg via APT:

```bash
sudo apt update
sudo apt install ffmpeg
```

# Usage

```js
const { detectNudityInVideo } = require('video-nudity-detector');

async function main() {
  
  try {
      const videoPath = '/path/to/video.mp4';
      const outputPath = '/path/to/output_video.mp4'; // Optional - if you don't want to blur the video
      const blurVideo = true; // blur the nudity detected on the video 

      // Returns a bool (True) if nudity exists or (False) if it doesn't
      const nudityDetected = await detectNudityInVideo(videoPath, outputPath, blurVideo);

      if (nudityDetected) {
        console.log('Nudity detected and video blurred.');
      } else {
        console.log('No nudity detected.');
      }
  }catch (err) {
    console.error('An error occurred while detecting nudity:', err.message);
  }

}

main();
```
