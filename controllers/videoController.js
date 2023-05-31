// file: controllers/videoController.js
const videoService = require('../services/videoService');

exports.translateVideo = async (req, res) => {
  const videoUrl = req.body.videoUrl;

  try {
    const videoPath = await videoService.downloadVideo(videoUrl);
    console.log('Video downloaded to: ', videoPath);
  } catch (error) {
    console.log('Error downloading the video: ', error);
  }

  // // 請求 OpenAI API 進行影片轉錄
  // const transcription = await videoService.transcribeVideo();

  // // 請求 OpenAI API 進行翻譯
  // const translation = await videoService.translateTranscription(transcription);

  // // 將結果返回給前端
  // res.json({ transcription, translation });
};
