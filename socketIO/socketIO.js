// socketIo.js
const { Server } = require('socket.io');

module.exports.createSocketIOServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
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
};
