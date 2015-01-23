/* jshint undef: true, unused: true, globalstrict: true*/
/* global module, require, __dirname */
'use strict';

var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  path = require('path'),
  arrayManager = require('./js/server/array-manager'),
  sessionManager = require('./js/server/session-manager')(io),
  queueManager = require('./js/server/queue-manager')(io),
  cookieSession = require('cookie-session'),
  cookieParser = require('cookie-parser'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({name: 'poo.pi'}),
  uid = require('node-uuid'),

  port = 8080,
  net = require('net'),
  localHost = '127.0.0.1',
  localport = 8000,
  client = new net.Socket();

app.use(cookieParser());
app.use(cookieSession({
  name: "PooCookie",
  secret: "ImAsecret",
  cookie: {
    maxAge: new Date() * 3600000
  },
  overwrite: false
}));

io.use(function(socket, next){
  var handshake = socket.request,
    cookie = handshake.headers.cookie;
  next();
});

app.get('*', function (req, res, next) {
  log.info('Request came in for %s', req.path);
  next();
});

//app.set('trust proxy', 'loopback');

app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'style')));
app.use(express.static(path.join(__dirname, 'js')));

// client.connect(localport, localHost);

io.on('connection', function (socketClient) {
  log.info('A user connected with the socket id: %s', socketClient.id);

  var serverUser = {
    id: socketClient.id,
    username: ""
  };

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
    queueManager.add(serverUser)
//    arrayManager.addQ(id);
  });

  socketClient.on('dq-me', function (id) {
    queueManager.remove(socketClient.id);
//    arrayManager.removeQ(id);
  });
});

http.listen(port, "localhost", function () {
  log.info("Listening on localhost:" + port);
});


