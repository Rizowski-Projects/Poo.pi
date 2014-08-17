var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    morgan = require('morgan'),
    helpers = require('./js/server/helpers'),
    qManager = require('./js/server/queueManager').import(io),
    session = require('cookie-session'),
    route = require('./js/server/routes').import(app),
    port = 8080,
    net = require('net'),
    localHost = '127.0.0.1',
    localport = 8000,
    client = new net.Socket(),
    user = {};

app.use(morgan());
app.use(session({
    keys: ['meincookie', 'meinOther'],
    path: '/',
    cookie: {
      maxAge: 360000,
      expires: 360000
    }
    // maxAge: 360000,
}));
app.get('/', function(req, res, next){
  console.log(req);
  user.id = req.sessionID;
  // res.cookie('wtf', new Date(), {maxAge: 3600000})
  // console.log(res)
  // res.sendfile('index.html');
  next();
});
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'style')));
app.use(express.static(path.join(__dirname, 'js')));


client.connect(localport, localHost);

io.on('connection', function(socket){

  io.emit('welcome', {id: socket.client.id});
  qManager.addConnected(socket.client.id);
  qManager.updateQd();

  client.on('data', function(response){
    var status = response.toString('utf8');
    var closed = status.toLowerCase() == 'true';
    socket.emit('statusUpdate', closed);
  });

  // socket.emit('statusUpdate', true);
  socket.on('disconnect', function(){
    //timed removal? Instant removal?
    qManager.removeConnected(socket.client.id);
  });

  socket.on('queue-me', function(id){
    qManager.addQ(id);
  });
  
  socket.on('dq-me', function(id){
    qManager.removeQ(id);
  });
});

http.listen(port, "localhost", function(){
  console.log("Listening on *:" + port);
});
