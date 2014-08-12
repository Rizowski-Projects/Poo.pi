var socket = io(),
    $status = $('#status'),
    $statusMsg = $('#status-msg'),
    theClient = null,
    populateOnline = function(connected){
      var $online = $('#online');
      $online.html("");
      for(loc in connected)
        $online.append("<li id="+connected[loc]+">"+connected[loc]+"</li>");
    }

  socket.on("welcome", function(client){
    console.log(client);
    if(!theClient)
      theClient = client;
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
  // Connected event to loop over new connected array
  socket.on('connected', function(connected){
    populateOnline(connected);
  });
  socket.on('disconnected', function(connected){
    populateOnline(connected);
  });

  socket.on('queued', function(id){
    $('#queue-list').append('<li id="'+id+'">'+id+'</li>');
  });

  $('#queue').click(function(){
    socket.emit("queue-me", theClient.id);
  });
  $('#dq').click(function(){
    socket.emit("dq-me", theClient.id);
  });
