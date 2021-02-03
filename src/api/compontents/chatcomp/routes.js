//api routs for chat history 


exports.chat = async function chat(app, io) {
  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      socket.broadcast.emit('msg', msg);
    });
  });
};