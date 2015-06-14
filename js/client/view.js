/* global io, $ */

'use strict';

var socket = io(),
  $status = $('#status'),
  $statusMsg = $('#status-msg'),
  theClient = null,
  $online = $('#online'),
  $que = $('#queue-list'),
  popUl = function (selector, arr) {
    var $ul = $('#' + selector);
    $ul.html('');
    console.log(arr);
    for (var loc in arr) {
      var display = !!arr[loc].username ? arr[loc].username : arr[loc].id;
      console.log(selector + '-' + arr[loc].id);
      $ul.append('<li id="' + selector + '-' + arr[loc].id + '">' + display + '</li>');
    }
  },
  createCookie = function (name, value, days) {
    var expires;

    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
  },
  readCookie = function (name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
  },
  eraseCookie = function (name) {
    createCookie(name, "", -1);
  };

socket.on("welcome", function (client) {
  var cookie;
  if (client.id === undefined) {
    console.error("broken");
    window.location.reload();
  }
  if (!theClient) {
    theClient = client;
  }
  cookie = readCookie("pooper");
  if (cookie === null) {
    createCookie("pooper", client.id, 1);
  }
  //toastr notification
});

socket.on('statusUpdate', function (open) {
  if (!open) {
    $statusMsg.html("Closed");
    $status.addClass('not-avail');
    $status.removeClass('avail');
  } else {
    $statusMsg.html("Open");
    $status.addClass('avail');
    $status.removeClass('not-avail');
  }
});

socket.on('update:connected', function (connected) {
  popUl("online", connected);
});

socket.on('update:queue', function (queued) {
  popUl("queued", queued);
});

$('#queue').click(function () {
  socket.emit("queue-me", theClient.id);
});

$('#dq').click(function () {
  if (!theClient.id) {
    socket.emit('getSession');

    return; // on callback emit dq
  }
  socket.emit("dq-me", theClient.id);
});
