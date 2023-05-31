// file: services/videoService.js

const fs = require('fs');
const ytdl = require('ytdl-core');

exports.downloadVideo = async (videoUrl) => {
  const videoId = new URL(videoUrl).searchParams.get('v');

  if (!videoId) {
    throw new Error('Invalid video url');
  }

  const stream = ytdl(videoUrl, { quality: 'highest', format: 'mp4' });

  const writeStream = fs.createWriteStream(`./tmp/${videoId}.mp4`);

  stream.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(`./tmp/${videoId}.mp4`));
    writeStream.on('error', reject);
  });
};

exports.transcribeVideo = async (videoUrl) => {
  // 你的影片轉錄的程式碼在這裡
};

exports.translateTranscription = async (transcription) => {
  // 你的翻譯轉錄的程式碼在這裡
};
