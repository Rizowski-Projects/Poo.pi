var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = 0;

app.use('/html', express.static('html'));
app.use('/style', express.static('style'));
app.use('/js', express.static('js'));

app.get('/', function(req, res){
  res.sendFile('html/index.html');
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
