// file: services\audioChatService.js

const { OpenAIApi, Configuration } = require('openai');
const textToSpeech = require('@google-cloud/text-to-speech');
const speechClient = new textToSpeech.TextToSpeechClient({
  keyFilename: './esp32-webapp-382008-0ad25a0baf41.json',
});
const openaiKey = process.env.OPENAI_API_KEY;

exports.chat = async (question) => {
  // console.log(openaiKey);
  try {
    const prompt =
      'You are going to be a good chatbot, capable of judging the situation to derive the most suitable answer to the question asked by the child.';
    const configuration = new Configuration({ apiKey: openaiKey });
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
          content: `${JSON.stringify(question)}`,
        },
      ],
    });

    const { data } = response;
    // console.log('Data: ', data);
    // console.log(data.choices[0].message);

    return data.choices[0].message.content;
  } catch (error) {
    console.log('Error in chat:', error);
    throw error;
  }
};

exports.textToSpeech = async (answer) => {
  const text = `${answer}`;
  try {
    const response = await speechClient.synthesizeSpeech({
      audioConfig: {
        audioEncoding: 'MP3',
        effectsProfileId: ['small-bluetooth-speaker-class-device'],
        pitch: 0,
        speakingRate: 1,
      },
      input: {
        text: text,
      },
      voice: {
        languageCode: 'cmn-TW',
        name: 'cmn-TW-Standard-C',
      },
    });

    const audioContent = response[0].audioContent;
    const audioContentBase64 = audioContent.toString('base64');

    return audioContentBase64;
  } catch (error) {
    console.log('Error in textToSpeech:', error);
    throw error;
  }
};
