var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    morgan = require('morgan'),
    port = 8080,
    net = require('net'),
    localHost = '127.0.0.1',
    localport = 8000,
    client = new net.Socket(),
    queue = [],
    connected = [],
    inArray = function(a,b){return!!~a.indexOf(b)},
    removeInArray = function(array, item){ var location = array.indexOf(item); if(location> -1){array.splice(location, 1)}};

app.use(morgan());
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'style')));
app.use(express.static(path.join(__dirname, 'js')));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

// client.connect(localport, localHost);

io.on('connection', function(socket){
  console.log(socket.client.id + " connected");
  connected.push(socket.client.id);
  io.emit('welcome', {id: socket.client.id});
  io.emit('connected', connected);
  // client.on('data', function(response){
  //   var status = response.toString('utf8');
  //   var closed = status.toLowerCase() == 'true';
  //   socket.emit('statusUpdate', closed);
  // });
  socket.emit('statusUpdate', true);
  socket.on('disconnect', function(){
    //timed removal? Instant removal?
    removeInArray(connected, socket.client.id);
    io.emit('disconnected', connected);
    console.log(socket.client.id + " User disconnected");
  });

  socket.on('queue-me', function(id){
    if(!inArray(queue, id)){// In coffee convert, item in array check can be used
      queue.push(id);
      console.log(id + " has been queued");
      io.emit('queued', queue);
    }
  });
  socket.on('dq-me', function(id){
    removeInArray(queue, id);
    console.log(id + " has been dqd");
    io.emit("dqd", queue);
  });

});
http.listen(port, function(){
  console.log("Listening on *:" + port);
});
