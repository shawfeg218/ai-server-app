// file: services/videoService.js
const fetch = require('node-fetch');
const FormData = require('form-data');
const ytdl = require('ytdl-core');
const { OpenAIApi, Configuration } = require('openai');

exports.transcribeVideo = async (apiKey, videoUrl) => {
  try {
    if (!ytdl.validateURL(videoUrl)) {
      throw new Error('Invalid video URL');
    }
    // download audio from youtube
    const stream = ytdl(videoUrl, { quality: 'lowestaudio', format: 'mp4' });

    // Check audio size
    let audioSizeMB = 0;
    stream.on('data', (chunk) => {
      audioSizeMB += chunk.length / (1024 * 1024);
      if (audioSizeMB > 24.5) {
        stream.destroy(new Error('Audio size exceeds 25MB limit'));
      }
    });

    const formData = new FormData();
    formData.append('file', stream, 'audio.mp4');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'srt');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw {
        name: 'Whisper APIError',
        message: errorResponse.error.message,
      };
    }

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
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `翻譯以下內容為繁體中文，但請保留句子的編號與時間的標示: "${transcription}"`,
        },
      ],
    });

    const { data } = response;
    // console.log('Data: ', data);
    // console.log(data.choices[0].message);

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in translateTranscription:', error);
    throw {
      name: 'TranslationError',
      message: error.message,
    };
  }
};
