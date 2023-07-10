// file: controllers/audioChatController.js
const chatService = require('../services/chatService');

exports.audioChat = async (req, res) => {
  const messages = req.body.messages;

  try {
    const answer = await chatService.chat(messages);
    console.log('Answer completed!');

    const answerAudio = await chatService.textToSpeech(answer);
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
