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
    inArray = function(a,b){return!!~a.indexOf(b)};

app.use(morgan());
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'style')));
app.use(express.static(path.join(__dirname, 'js')));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

// client.connect(localport, localHost);

io.on('connection', function(socket){
  console.log(socket.client.id + " connected")
  io.emit('welcome', {id: socket.client.id, connected: []});
  // client.on('data', function(response){
  //   var status = response.toString('utf8');
  //   var closed = status.toLowerCase() == 'true';
  //   socket.emit('statusUpdate', closed);
  // });
  socket.emit('statusUpdate', true);
  socket.on('disconnect', function(){
    //timed removal? Instant removal?
    io.emit('disconnected', socket.client.id);
    console.log(socket.client.id + " User disconnected");
  });

  socket.on('queue-me', function(id){
    console.log(id);
    console.log(queue);
    var result = inArray(queue, id);
    console.log(result);
    if(!result){// In coffee convert, item in array check can be used
      queue.push(id);
      console.log(id + " has been queued");
      io.emit('queued', id);
    }
  });

});
http.listen(port, function(){
  console.log("Listening on *:" + port);
});
