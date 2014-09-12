var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    morgan = require('morgan'),
    helpers = require('./js/server/helpers'),
    qManager = require('./js/server/queueManager').import(io),
    cookieSession = require('cookie-session'),
    cookieParser = require('cookie-parser'),
    uid = require('node-uuid'),
    // route = require('./js/server/routes').import(app),
    port = 8080,
    net = require('net'),
    localHost = '127.0.0.1',
    localport = 8000,
    client = new net.Socket(),
    user = {};

app.use(morgan());
app.use(cookieParser());
app.use(cookieSession({
  name: "PooCookie",
  secret: "secret",
  cookie: {
    maxAge: new Date() * 3600000
  },
  overwrite: false
}));

app.get('/', function(req, res, next){
  if(!req.cookies.pooper){
    user.id = uid.v1();
    res.cookie("pooper", user.id);
  }else{
    user.id = req.cookies.pooper;
  }

  next();
});
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'style')));
app.use(express.static(path.join(__dirname, 'js')));


// client.connect(localport, localHost);

io.on('connection', function(socket){

  io.emit('welcome', {id: user.id});
  qManager.addConnected(user.id);
  qManager.updateQd();

  // client.on('data', function(response){
  //   var status = response.toString('utf8');
  //   var closed = status.toLowerCase() == 'true';
  //   socket.emit('statusUpdate', closed);
  // });

  // socket.emit('statusUpdate', true);
  socket.on('disconnect', function(){
    //timed removal? Instant removal?
    qManager.removeConnected(user.id);
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
