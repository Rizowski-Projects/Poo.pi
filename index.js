var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    morgan = require('morgan'),
    port = 8080;

app.use(morgan());
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'style')));
app.use(express.static(path.join(__dirname, 'js')));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.emit('welcome', {});

  socket.on('disconnect', function(){
    //User disconnected
  });

  socket.emit('update', function(){
    // Update the status
  });
});



http.listen(port, function(){
  console.log("Listening on *:" + port);
});
