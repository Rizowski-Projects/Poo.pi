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
  log = bunyan.createLogger({
    name: 'poo.pi'
  }),
  uid = require('node-uuid'),

  port = 8080,
  net = require('net'),
  localHost = '127.0.0.1',
  localport = 8000,
  client = new net.Socket();

app.use(cookieParser());

app.get('*', function (req, res, next) {
  log.info('Request came in for %s', req.path);
  //  if (req.cookies.pooper) {

  //  }
  //  console.log(req);
  next();
});

//app.set('trust proxy', 'loopback');

app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'style')));
app.use(express.static(path.join(__dirname, 'js')));

// client.connect(localport, localHost);

http.listen(port, "localhost", function () {
  log.info("Listening on localhost:" + port);
});
