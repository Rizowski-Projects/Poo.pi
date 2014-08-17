var socket = io(),
    $status = $('#status'),
    $statusMsg = $('#status-msg'),
    theClient = null,
    popUl = function(selectorStr, arr){
      var $ul = $("#"+selectorStr);
      $ul.html("");
      for(loc in arr)
        $ul.append("<li id="+arr[loc]+">"+arr[loc]+"</li>");
    };

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
    popUl("online", connected);
  });
  socket.on('disconnected', function(connected){
    popUl("online", connected);
  });

  socket.on('queued', function(queued){
    popUl("queue-list", queued);
  });

  socket.on('dqd', function(queued){
    popUl("queue-list", queued);
  });

  $('#queue').click(function(){
    socket.emit("queue-me", theClient.id);
  });
  $('#dq').click(function(){
    socket.emit("dq-me", theClient.id);
  });
