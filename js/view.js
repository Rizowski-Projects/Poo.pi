var socket = io(),
    $status = $('#status'),
    $statusMsg = $('#status-msg'),
    theClient = null;

  socket.on("welcome", function(client){
    console.log(client);
    theClient = client;
    $('#online').append("<li id="+client.id+">"+client.id+"</li>");
    //toastr notification
  });

  socket.on('statusUpdate', function(open){
    if ( !open ){
      $statusMsg.html("Closed");
      $status.addClass('not-avail');
      $status.removeClass('avail');
    }else{
      $statusMsg.html("Open");
      $status.addClass('avail');
      $status.removeClass('not-avail');
    }
  });

  socket.on('disconnected', function(id){
    $('#'+id).remove();
  });

  socket.on('queued', function(id){
    $('#queue-list').append('<li id="'+id+'">'+id+'</li>');
  });

  $('#queue').click(function(){
    socket.emit("queue-me", theClient.id);
  });
