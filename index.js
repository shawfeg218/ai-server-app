// file: index.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// import routes
const videoTranslateRoutes = require('./routes/videoTranslate');

app.use(express.json());
app.use(cors());

// use your routes
app.use('/api', videoTranslateRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
