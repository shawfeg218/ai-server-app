// file: controllers/videoController.js
const videoService = require('../services/videoService');
// const util = require('util');
// const fs = require('fs');
// const unlinkFile = util.promisify(fs.unlink);

exports.translateVideo = async (req, res) => {
  const apiKey = req.body.apiKey;
  const videoUrl = req.body.videoUrl;

  try {
    // const videoPath = await videoService.downloadVideo(videoUrl);
    // console.log('Video downloaded to: ', videoPath);

    const transcription = await videoService.transcribeVideo(apiKey, videoUrl);
    console.log('Transcription completed!');

    const translation = await videoService.translateTranscription(apiKey, transcription);
    console.log('Translation completed!');

    // await unlinkFile(videoPath);
    // console.log('Video deleted from: ', videoPath);

    const data = {
      transcription: transcription,
      translation: translation,
    };

    res.json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
};
