// file: routes\apiRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const audioChatController = require('../controllers/audioChatController');
const esp32Function = require('../mqtt/esp32Function');
const multer = require('multer');
const upload = multer();

router.post('/transcript-audio', upload.single('file'), audioChatController.transcriptAudio);

router.post('/audio-chat', audioChatController.audioChat);

router.post('/video-translate', videoController.translateVideo);

router.post('/content-learning', videoController.contentLearning);

// mqtt
router.post('/reset-wifi', esp32Function.resetWifi);

router.post('/set-axis-angle', esp32Function.setAxisAngle);
router.post('/T-set-axis-angle', esp32Function.TsetAxisAngle);

router.post('/correct-act', esp32Function.correctAct);
router.post('/T-correct-act', esp32Function.TcorrectAct);

router.post('/wrong-act', esp32Function.wrongAct);
router.post('/T-wrong-act', esp32Function.TwrongAct);

router.post('/grab-act', esp32Function.grabAct);
router.post('/T-grab-act', esp32Function.TgrabAct);

router.post('/reset-arm', esp32Function.resetArm);
router.post('/T-reset-arm', esp32Function.TresetArm);

router.post('/speak-act', esp32Function.speakAct);
router.post('/T-speak-act', esp32Function.TspeakAct);

router.post('/unsubscribe-topic', esp32Function.unsubscribeTopic);
router.post('/get-angles', esp32Function.getAngles);
router.post('/get-esp32Status', esp32Function.getEsp32Status);

module.exports = router;
