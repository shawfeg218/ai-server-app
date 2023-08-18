// file: services\chatService.js

const { OpenAIApi, Configuration } = require('openai');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);
const { Readable } = require('stream');
const { v4: uuidv4 } = require('uuid');
// const textToSpeech = require('@google-cloud/text-to-speech');
// const speechClient = new textToSpeech.TextToSpeechClient({
//   keyFilename: './meme-bot-391406-47b18ce0fb21.json',
// });
const MicrosoftSpeech = require('microsoft-cognitiveservices-speech-sdk');
const openaiKey = process.env.OPENAI_API_KEY;

function convertAudio(audioStream, uuid) {
  return new Promise((resolve, reject) => {
    const tempFile = `temp/tempFile-${uuid}`;
    const outputFile = `temp/outputFile-${uuid}.mp3`;
    audioStream.pipe(fs.createWriteStream(tempFile));
    ffmpeg(tempFile)
      .outputFormat('mp3')
      .save(outputFile)
      .on('end', () => {
        fs.unlinkSync(tempFile, (err) => {
          if (err) {
            console.log('Error in delete temp file');
          }
        });
        resolve(outputFile);
      })
      .on('error', () => {
        console.log('Error in convertAudio');
        reject();
      });
  });
}

const bufferToStream = (buffer) => {
  return Readable.from(buffer);
};

exports.speechToText = async (audioFile) => {
  try {
    const audioStream = bufferToStream(audioFile.buffer);
    const uuid = uuidv4();
    await convertAudio(audioStream, uuid);
    const convertedAudioStream = fs.createReadStream(`temp/outputFile-${uuid}.mp3`);
    const formData = new FormData();
    formData.append('file', convertedAudioStream, {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg',
    });
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${openaiKey}`,
      },
      body: formData,
    });

    fs.unlink(`temp/outputFile-${uuid}.mp3`, (err) => {
      if (err) {
        console.log(`Error in delete outputFile-${uuid}.mp3`);
      }
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw {
        name: 'Whisper APIError',
        message: error?.message || 'Unknown error',
      };
    }
    const responseJson = await response.json();
    const responseText = responseJson.text;
    console.log(responseText);
    return responseText;
  } catch (error) {
    // console.error('Error in transcribeVideo:', error);
    throw error;
  }
};

exports.chat = async (prompt, messages) => {
  // console.log(openaiKey);
  try {
    const configuration = new Configuration({ apiKey: openaiKey });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        ...messages,
      ],
    });

    const { data } = response;
    // console.log('Data: ', data);
    // console.log(data.choices[0].message);

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

exports.textToSpeech = async (answer, voiceLang, voiceName) => {
  try {
    const uniqueFileName = `output-${uuidv4()}.mp3`;

    const speechConfig = MicrosoftSpeech.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      'eastus'
    );

    speechConfig.speechSynthesisOutputFormat = 5; //audio-16khz-64kbitrate-mono-mp3

    const audioConfig = MicrosoftSpeech.AudioConfig.fromAudioFileOutput(uniqueFileName);

    const voice = {
      languageCode: voiceLang,
      name: voiceName,
    };

    const synthesizer = new MicrosoftSpeech.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.properties.setProperty(
      MicrosoftSpeech.PropertyId.SpeechServiceConnection_RecoLanguage,
      voice.languageCode
    );
    synthesizer.properties.setProperty(
      MicrosoftSpeech.PropertyId.SpeechServiceConnection_SynthVoice,
      voice.name
    );

    return new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        answer,
        (result) => {
          if (result) {
            const audioContent = fs.readFileSync(uniqueFileName);
            const audioContentBase64 = audioContent.toString('base64');

            fs.unlinkSync(uniqueFileName);

            resolve(audioContentBase64);
          }
          synthesizer.close();
        },
        (error) => {
          // console.log(`Error in textToSpeechMicrosoft: ${error}`);
          synthesizer.close();
          reject(error);
        }
      );
    });
  } catch (error) {
    console.log('Error in textToSpeech:', error);
    throw error;
  }
};

// // google text to speech
// exports.textToSpeech = async (answer) => {
//   const text = `${answer}`;
//   try {
//     const response = await speechClient.synthesizeSpeech({
//       audioConfig: {
//         audioEncoding: 'MP3',
//         effectsProfileId: ['small-bluetooth-speaker-class-device'],
//         pitch: 0,
//         speakingRate: 1,
//       },
//       input: {
//         text: text,
//       },
//       voice: {
//         languageCode: 'cmn-TW',
//         name: 'cmn-TW-Standard-C',
//       },
//     });

//     const audioContent = response[0].audioContent;
//     const audioContentBase64 = audioContent.toString('base64');

//     return audioContentBase64;
//   } catch (error) {
//     console.log('Error in textToSpeech:', error);
//     throw error;
//   }
// };
