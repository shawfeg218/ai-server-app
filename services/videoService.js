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
      "You are a highly skilled translator specializing in subtitle translation. Your task is to translate the subtitle content between the [START] and [END] markers into traditional Chinese. Each subtitle, marked by its own number and separated by line breaks, should be translated individually. Do not combine or merge subtitles. For example, '1\nHello!\n\n2\nHow can I help you?\n\n' should be translated as '1\n你好!\n\n2\n我能如何幫你?\n\n'. It should not be translated as '1\n你好!我能如何幫你?\n\n'. Please retain all the numbers of the subtitles and all the line break symbols, maintaining the original format of the text.";

    // const sentencesFor16k = 250;
    const sentencesOneTime = 50;
    let result = '';

    const configuration = new Configuration({ apiKey: apiKey });
    const openai = new OpenAIApi(configuration);

    // if (transcription.length > 1850) {
    if (transcription.length > 3850) {
      const transcriptionArray = getContents(transcription);
      const contentArray = [];
      let item = '';
      let index = 0;

      for (let i = 0; i < transcriptionArray.length; i++) {
        item += transcriptionArray[i];
        index++;

        // if (index === sentencesFor16k) {
        if (index === sentencesOneTime) {
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
          // model: 'gpt-3.5-turbo-16k',
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: prompt,
            },
            {
              role: 'user',
              content: `[START]${item}[END]`,
            },
          ],
        });
        const { data } = response;
        // console.log('Data: ', data);
        // console.log(data.choices[0].message);

        // console.log('gpt-3.5-turbo-16k', data.usage);
        console.log('gpt-4 separated: ', data.usage);

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
        // model: 'gpt-3.5-turbo',
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: `[START]${item}[END]`,
          },
        ],
      });

      const { data } = response;
      // console.log('Data: ', data);
      // console.log(data.choices[0].message);

      // console.log('gpt-3.5-turbo: ', data.usage);
      console.log('gpt-4 one time: ', data.usage);

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

exports.contentChat = async (apiKey, content) => {
  try {
    const prompt =
      '你是一個幫助學習語言的教師。當給你任何語言的內容時，你將會在內容中找出常用的詞語或句型，然後以繁體中文生成教學內容。';

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
          content: `請你從以下內容中找出10個該語言常用詞語: "${content}"`,
        },
      ],
    });

    const { data } = response;
    // console.log('Data: ', data);
    // console.log(data.choices[0].message);
    console.log('gpt-3.5-turbo: ', data.usage);
    return data.choices[0].message.content;
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
