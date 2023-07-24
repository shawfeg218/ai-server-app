// file: routes\apiRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const audioChatController = require('../controllers/audioChatController');
const esp32Function = require('../mqtt/esp32Function');

router.post('/video-translate', videoController.translateVideo);

router.post('/content-learning', videoController.contentLearning);

router.post('/audio-chat', audioChatController.audioChat);

router.post('/reset-wifi', esp32Function.resetWifi);
router.post('/set-axis-angle', esp32Function.setAxisAngle);
router.post('/correct-act', esp32Function.correctAct);
router.post('/wrong-act', esp32Function.wrongAct);
router.post('/grab-act', esp32Function.grabAct);
router.post('/reset-arm', esp32Function.resetArm);
router.post('/unsubscribe-topic', esp32Function.unsubscribeTopic);
router.post('/get-angles', esp32Function.getAngles);
router.post('/get-esp32Status', esp32Function.getEsp32Status);

module.exports = router;
