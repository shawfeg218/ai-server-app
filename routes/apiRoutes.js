// file: routes\apiRoutes.js
const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const audioChatController = require("../controllers/audioChatController");
const esp32Function = require("../mqtt/esp32Function");
const multer = require("multer");
const upload = multer();

router.post("/v1/transcript-audio", upload.single("file"), audioChatController.transcriptAudio);

router.post("/v1/audio-chat", audioChatController.audioChat);

router.post("/v1/tti", audioChatController.tti);

router.post("/v1/tts", audioChatController.tts);

router.post("/v1/video-translate", videoController.translateVideo);

router.post("/v1/content-learning", videoController.contentLearning);

// mqtt
router.post("/v1/reset-wifi", esp32Function.resetWifi);

router.post("/v1/set-axis-angle", esp32Function.setAxisAngle);
router.post("/v1/T-set-axis-angle", esp32Function.TsetAxisAngle);

router.post("/v1/correct-act", esp32Function.correctAct);
router.post("/v1/T-correct-act", esp32Function.TcorrectAct);

router.post("/v1/wrong-act", esp32Function.wrongAct);
router.post("/v1/T-wrong-act", esp32Function.TwrongAct);

router.post("/v1/grab-act", esp32Function.grabAct);
router.post("/v1/T-grab-act", esp32Function.TgrabAct);

router.post("/v1/reset-arm", esp32Function.resetArm);
router.post("/v1/T-reset-arm", esp32Function.TresetArm);

router.post("/v1/speak-act", esp32Function.speakAct);
router.post("/v1/T-speak-act", esp32Function.TspeakAct);

router.post("/v1/unsubscribe-topic", esp32Function.unsubscribeTopic);
router.post("/v1/get-angles", esp32Function.getAngles);
router.post("/v1/get-esp32Status", esp32Function.getEsp32Status);

module.exports = router;
