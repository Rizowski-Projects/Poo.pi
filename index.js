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
    client = new net.Socket();

app.use(morgan());
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'style')));
app.use(express.static(path.join(__dirname, 'js')));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

client.connect(localport, localHost);

io.on('connection', function(socket){
  socket.emit('welcome', {});
  client.on('data', function(data){
    var status = data.toString('utf8');
    var bool = status.toLowerCase() == 'true';
    socket.emit('status', bool);
  });
  //socket.emit('status', false);
  socket.on('disconnect', function(){
    console.log("User disconnected");
  });

});
http.listen(port, function(){
  console.log("Listening on *:" + port);
});
