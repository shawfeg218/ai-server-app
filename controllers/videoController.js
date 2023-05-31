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
    console.log('Transcription completed!');

    // 請求 OpenAI API 進行翻譯
    const translation = await videoService.translateTranscription(
      transcription
    );
    console.log('Translation completed!');

    await unlinkFile(videoPath);
    console.log('Video deleted from: ', videoPath);

    // 創建一個 JSON 物件包含 transcription 和 translation
    const data = {
      transcription: transcription,
      translation: translation,
    };

    // 將資料以 JSON 格式回傳給前端
    res.json(data);
  } catch (error) {
    console.log(error);

    // 如果有錯誤，返回錯誤訊息給前端
    res.status(500).json({ error: error.toString() });
  }
};
