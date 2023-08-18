// file: controllers/audioChatController.js
const chatService = require('../services/chatService');

exports.transcriptAudio = async (req, res) => {
  const audioFile = req.file;
  try {
    const transcript = await chatService.speechToText(audioFile);
    console.log('Transcript completed!');

    const data = {
      text: transcript,
    };

    res.json(data);
  } catch (error) {
    console.log(error);
    const errorResponse = {
      name: error.name,
      message: error.message,
    };

    res.status(500).json(errorResponse);
  }
};

exports.audioChat = async (req, res) => {
  const prompt = req.body.prompt;
  const messages = req.body.messages;

  const voiceLang = req.body.voiceLang;
  const voiceName = req.body.voiceName;

  try {
    const answer = await chatService.chat(prompt, messages);
    console.log('Answer completed!');

    const answerAudio = await chatService.textToSpeech(answer, voiceLang, voiceName);
    console.log('Answer audio completed!');

    const data = {
      answer: answer,
      answerAudio: answerAudio,
    };

    res.json(data);
  } catch (error) {
    // console.log(error);
    const errorResponse = {
      name: error.name,
      message: error.message,
    };

    res.status(500).json(errorResponse);
  }
};
