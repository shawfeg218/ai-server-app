// file: services/videoService.js
const fetch = require('node-fetch');
const FormData = require('form-data');
const ytdl = require('ytdl-core');
const { OpenAIApi, Configuration } = require('openai');

// exports.downloadVideo = async (videoUrl) => {
//   try {
//     const videoId = new URL(videoUrl).searchParams.get('v');

//     if (!videoId) {
//       throw new Error('Invalid video url');
//     }

//     const stream = ytdl(videoUrl, { quality: 'highest', format: 'mp4' });

//     const writeStream = fs.createWriteStream(`./tmp/${videoId}.mp4`);

//     stream.pipe(writeStream);

//     return new Promise((resolve, reject) => {
//       writeStream.on('finish', () => resolve(`./tmp/${videoId}.mp4`));
//       writeStream.on('error', reject);
//     });
//   } catch (error) {

//     console.error('Error in downloadVideo:', error);
//     throw error;
//   }
// };

exports.transcribeVideo = async (apiKey, videoUrl) => {
  try {
    const stream = ytdl(videoUrl, { quality: 'highestaudio', format: 'mp4' });
    const formData = new FormData();
    formData.append('file', stream, 'video.mp4');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'srt');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const responseText = await response.text();
    return responseText;
  } catch (error) {
    console.error('Error in transcribeVideo:', error);
    throw error;
  }
};

exports.translateTranscription = async (apiKey, transcription) => {
  try {
    const prompt =
      'You are going to be a good translator, capable of judging the situation to derive the most suitable meaning, and translating it into traditional Chinese.';
    const configuration = new Configuration({ apiKey: apiKey });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `翻譯以下內容為繁體中文，但請保留句子的編號與時間的標示: "${JSON.stringify(
            transcription
          )}"`,
        },
      ],
    });

    const { data } = response;
    console.log('Data: ', data);
    console.log(data.choices[0].message);

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in translateTranscription:', error);
    throw error;
  }
};
