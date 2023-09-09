// file: index.js
const https = require('https');
const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { Server } = require('socket.io');
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

const io = new Server(server, {
  cors: {
    origin: '*', // 允許所有源
    methods: ['GET', 'POST'], // 允許的請求方式
  },
});

let clientsCount = 0;

io.on('connection', (socket) => {
  clientsCount++;
  console.log('Number of clients connected: ', clientsCount);

  socket.on('lock_page', (path) => {
    console.log('lock_page event received with path:', path);
    socket.broadcast.emit('lock_page_student', path);
  });

  socket.on('unlock_page', () => {
    console.log('unlock_page event received');
    socket.broadcast.emit('unlock_page_student');
  });

  socket.on('set_controlMode', (mode) => {
    console.log('set_controlMode event received with controlMode:', mode);
    socket.broadcast.emit('set_controlMode_student', mode);
  });

  socket.on('teacher_mood', (mood) => {
    console.log('teacher_mood event received with mood: ', mood);
    socket.broadcast.emit('set_mood_student', mood);
  });

  socket.on('disconnect', () => {
    clientsCount--;
    console.log('Number of clients connected: ', clientsCount);
  });


});

server.listen(443, () => {
  console.log('Express server listening on port 443');
});

// server.listen(5000, () => {
//   console.log('Express server listening on port 5000');
// });
