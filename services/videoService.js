// file: services/videoService.js
const fetch = require('node-fetch');
const FormData = require('form-data');
const ytdl = require('ytdl-core');
const { OpenAIApi, Configuration } = require('openai');
const { getContents, delMarks, checkRes } = require('../utils/getContents');

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
      const { error } = await response.json();
      throw {
        name: 'Whisper APIError',
        message: error?.message || 'Unknown error',
      };
    }

    const responseText = await response.text();
    return responseText;
  } catch (error) {
    // console.error('Error in transcribeVideo:', error);
    throw error;
  }
};

exports.translateTranscription = async (apiKey, transcription) => {
  try {
    const prompt =
      'You are going to be a good translator, capable of judging the situation to derive the most suitable meaning, and translating it into traditional Chinese.';
    const sentencesFor16k = 450;
    let result = '';

    const configuration = new Configuration({ apiKey: apiKey });
    const openai = new OpenAIApi(configuration);

    if (transcription.length > 1850) {
      const transcriptionArray = getContents(transcription);
      const contentArray = [];
      let item = '';
      let index = 0;

      for (let i = 0; i < transcriptionArray.length; i++) {
        item += transcriptionArray[i];
        index++;

        if (index === sentencesFor16k) {
          contentArray.push(item);
          item = '';
          index = 0;
        }
      }

      if (item !== '') {
        contentArray.push(item);
      }

      for (let item of contentArray) {
        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo-16k',
          messages: [
            {
              role: 'system',
              content: prompt,
            },
            {
              role: 'user',
              content: `請將[START]與[END]標記中的內容為繁體中文，若已經是繁體中文就不用翻譯，請保留所有編號與換行符號: [START]${item}[END]`,
            },
          ],
        });
        const { data } = response;
        // console.log('Data: ', data);
        // console.log(data.choices[0].message);

        console.log('gpt-3.5-turbo-16k', data.usage);

        let contentDM = delMarks(data.choices[0].message.content);

        if (!contentDM.endsWith('\n\n')) {
          contentDM += '\n\n';
        }

        result += contentDM;
      }
    } else {
      const transcriptionArray = getContents(transcription);
      let item = '';

      for (let i = 0; i < transcriptionArray.length; i++) {
        item += transcriptionArray[i];
      }

      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: `請將[START]標記與[END]標記中的內容翻譯為繁體中文，若已經是繁體中文就不用翻譯，請保留所有編號與換行符號: [START]${item}[END]`,
          },
        ],
      });

      const { data } = response;
      // console.log('Data: ', data);
      // console.log(data.choices[0].message);

      console.log('gpt-3.5-turbo: ', data.usage);

      const contentDM = delMarks(data.choices[0].message.content);
      result += contentDM;
    }

    return checkRes(result);
  } catch (error) {
    if (error.response) {
      throw {
        name: 'APIError',
        message: error.response.data.error.message,
      };
    } else {
      throw {
        name: 'UnknownError',
        message: error.message,
      };
    }
  }
};
