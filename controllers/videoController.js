// file: controllers/videoController.js
const videoService = require('../services/videoService');
// const util = require('util');
// const fs = require('fs');
// const unlinkFile = util.promisify(fs.unlink);

exports.translateVideo = async (req, res) => {
  const videoUrl = req.body.videoUrl;
  let interval;

  try {
    interval = setInterval(() => {
      res.write('Processing...\n');
    }, 5000);

    // const videoPath = await videoService.downloadVideo(videoUrl);
    // console.log('Video downloaded to: ', videoPath);

    const transcription = await videoService.transcribeVideo(videoUrl);
    console.log('Transcription completed!');

    const translation = await videoService.translateTranscription(
      transcription
    );
    console.log('Translation completed!');

    // await unlinkFile(videoPath);
    // console.log('Video deleted from: ', videoPath);

    const data = {
      transcription: transcription,
      translation: translation,
    };

    clearInterval(interval);
    res.write(JSON.stringify(data));
    res.end();
  } catch (error) {
    console.log(error);
    clearInterval(interval);

    res.write(JSON.stringify({ error: error.toString() }));
    res.end();
  }
};
