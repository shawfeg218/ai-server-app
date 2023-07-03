// file: routes\videoTranslate.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const audioChatController = require('../controllers/audioChatController');

router.post('/video-translate', videoController.translateVideo);

router.post('/content-learning', videoController.contentLearning);

router.post('/audio-chat', audioChatController.audioChat);

module.exports = router;
