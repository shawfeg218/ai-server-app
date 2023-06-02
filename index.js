// file: index.js
const https = require('https')
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
require('dotenv').config();

// import routes
const videoTranslateRoutes = require('./routes/videoTranslate');

app.use(express.json());
app.use(cors());

// use your routes
app.use('/api', videoTranslateRoutes);

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/server.shawnweb.site/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/server.shawnweb.site/fullchain.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('Express server listening on port 443');
});

