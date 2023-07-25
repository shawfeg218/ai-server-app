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

exports.transcriptAudio = async (req, res) => {
  const audioPath = req.file.path;
  try {
    const transcript = await chatService.speechToText(audioPath);
    console.log('Transcript completed!');

    const data = {
      text: transcript,
    };

    // Delete the audio file after transcription
    fs.unlink(audioPath, (err) => {
      if (err) {
        console.error(`Error deleting file ${audioPath}:`, err);
      } else {
        console.log(`File ${audioPath} deleted successfully.`);
      }
    });

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
