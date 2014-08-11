var socket = io(),
    $status = $('#status'),
    theClient = null;
  socket.on("welcome", function(client){
    console.log(client);
    theClient = client;
    //toastr notification
  });

  socket.on('statusUpdate', function(open){
    if ( !open ){
      $status.addClass('not-avail');
      $status.removeClass('avail');
    }else{
      $status.addClass('avail');
      $status.removeClass('not-avail');
    }
  });

  socket.on('queued', function(id){
    $('#queue-list').append('<li id="'+id+'">'+id+'</li>');
  });

  $('#queue').click(function(){
    socket.emit("queue-me", theClient.id);
  });
