// file: controllers/videoController.js
const videoService = require('../services/videoService');

exports.translateVideo = async (req, res) => {
  const apiKey = req.body.apiKey;
  const videoUrl = req.body.videoUrl;

  try {
    const transcription = await videoService.transcribeVideo(apiKey, videoUrl);
    console.log('Transcription completed!');

    const translation = await videoService.translateTranscription(apiKey, transcription);
    console.log('Translation completed!');

    const data = {
      transcription: transcription,
      translation: translation,
    };

    res.json(data);
  } catch (error) {
    // console.log(error);
    const errorResponse = {
      name: error.name,
      message: error.message,
    };

    res.status(500).json(errorResponse);
  }
};
