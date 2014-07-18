var socket = io(),
    $status = $('#status');
  socket.on("welcome", function(msg){
      
  });

  socket.on('status', function(state){
    if ( state ){
      $status.addClass('avail');
      $status.removeClass('not-avail');
    }else{
      $status.addClass('not-avail');
      $status.removeClass('avail');
    }
  });
