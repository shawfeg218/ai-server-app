// file: index.js
const express = require('express');
const app = express();
require('dotenv').config();

// import routes
const videoTranslateRoutes = require('./routes/videoTranslate');

app.use(express.json());

// use your routes
app.use('/api', videoTranslateRoutes);

module.exports = app;
