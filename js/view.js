var socket = io(),
    $status = $('#status');
  socket.on("welcome", function(msg){
      
  });

  socket.on('status', function(open){
    if ( !open ){
      $status.addClass('avail');
      $status.removeClass('not-avail');
    }else{
      $status.addClass('not-avail');
      $status.removeClass('avail');
    }
  });
