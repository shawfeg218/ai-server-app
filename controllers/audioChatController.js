// file: controllers/audioChatController.js

const chatService = require('../services/chatService');

exports.audioChat = async (req, res) => {
  const questionStream = req.body.questionStream;

  try {
    const transcription = await chatService.transcribeQustion(questionStream);
    console.log('Transcription completed!');

    const answer = await chatService.chat(transcription);
    console.log('Answer completed!');

    const answerAudio = await chatService.textToSpeech(answer);
    console.log('Answer audio completed!');

    const data = {
      transcription: transcription,
      answer: answer,
      answerAudio: answerAudio,
    };

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
};
