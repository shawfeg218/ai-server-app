// file: routes\videoTranslate.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/video-translate', videoController.translateVideo);

module.exports = router;
