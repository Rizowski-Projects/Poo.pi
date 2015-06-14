'use strict';
var queueManager = require('queue-manager');
var log = require('bunyan').createLogger({ name: 'socket-manager' });

var socketManager = function (http) {
  var io = require('socket.io')(http),
    sessionManager = require('session-manager')(io);
  io.use(function (socket, next) {
    var handshake = socket.request,
      cookie = handshake.headers.cookie;
    if (cookie) {
      var item = cookie.split('pooper=');
      console.log(item[1]);
      console.log();
    }
    next();
  });

  io.on('connection', function (socketClient) {
    var serverUser = {
      id: socketClient.id,
      username: ''
    };
    //  console.log(socketClient)

    log.info('A user connected with the socket id: %s', socketClient.id);

    io.emit('welcome', serverUser);

    sessionManager.add(serverUser);

    // client.on('data', function(response){
    //   var status = response.toString('utf8');
    //   var closed = status.toLowerCase() == 'true';
    //   socket.emit('statusUpdate', closed);
    // });

    socketClient.emit('statusUpdate', true); // stall status

    socketClient.on('disconnect', function () {
      log.info('A user disconnected');
      sessionManager.remove(socketClient.id);
    });

    socketClient.on('queue-me', function () {
      queueManager.add(serverUser);
      //    arrayManager.addQ(id);
    });

    socketClient.on('dq-me', function (id) {
      queueManager.remove(socketClient.id);
      //    arrayManager.removeQ(id);
    });
  });
};

module.exports = socketManager;