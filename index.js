// file: index.js
const https = require('https');
// const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
require('dotenv').config();

// import routes
const apiRoutes = require('./routes/apiRoutes');

app.use(express.json());
app.use(cors());

// use your routes
app.use('/api', apiRoutes);

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/server.shawnweb.site/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/server.shawnweb.site/fullchain.pem'),
};

const server = https.createServer(options, app);
// const server = http.createServer(app);

// socket.io
const { createSocketIOServer } = require('./socketIO/socketIO');
createSocketIOServer(server);

server.listen(443, () => {
  console.log('Express server listening on port 443');
});

// server.listen(5000, () => {
//   console.log('Express server listening on port 5000');
// });
