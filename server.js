'use strict';

const socketIO = require('socket.io');

const uuid = require('uuid');

const port = process.env.PORT || 3001;
const server = socketIO(PORT);

server.listen(port, () => console.log(`Server up on ${port}`) );



server.on('connection', (socket) => {
  console.log(`connected!`, socket.id);
  });
  
  socket.on('error', error => {
    console.error('error!', error);
  });
  const dbServer = server.of('/database');
  dbServer.on('connection', socket => {
    console.log('DB connection', socket.id);

    socket.on('save', payload => {
      console.log('received save', payload);
    });
  });
});




