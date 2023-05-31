// file: controllers/videoController.js
const videoService = require('../services/videoService');
const util = require('util');
const fs = require('fs');
const unlinkFile = util.promisify(fs.unlink);

exports.translateVideo = async (req, res) => {
  const videoUrl = req.body.videoUrl;

  try {
    const videoPath = await videoService.downloadVideo(videoUrl);
    console.log('Video downloaded to: ', videoPath);

    // 請求 OpenAI API 進行影片轉錄
    const transcription = await videoService.transcribeVideo(videoPath);

    // // 請求 OpenAI API 進行翻譯
    // const translation = await videoService.translateTranscription(
    //   transcription
    // );

    await unlinkFile(videoPath);
    console.log('Video deleted from: ', videoPath);
  } catch (error) {
    console.log(error);
  }

  // 將結果返回給前端
  // res.json({ transcription, translation });
};
