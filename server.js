// file: server.js
const express = require('express');
const app = express();
require('dotenv').config();

// import routes
const videoTranslateRoutes = require('./routes/videoTranslate');

app.use(express.json());

// use your routes
app.use('/api', videoTranslateRoutes);

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
