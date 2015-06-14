'use strict';
var manager = require('./array-manager');
var _ = require('underscore');
var log = require('bunyan').createLogger({ name: 'session-manager' });

var sessionManager = function (io) {
  var session = {
    add: function (user) {
      if (_.isUndefined(user) || _.isUndefined(user.id) || manager.get('id', user.id)) { return; }
      log.info('Session::Add: adding user: %s', user.id);
      manager.add(user);
      var arrs = manager.getAll();
      io.emit('update:connected', arrs);
    },
    remove: function (id) {
      log.info('attempting to remove %s', id);
      if (_.isUndefined(id)) { return; }
      var user = manager.get('id', id);
      if (_.isUndefined(user)) {
        log.warn('Session::Remove: user was undefined');
        return;
      }
      manager.remove(user);
      log.info('Session::Remove: Removing user: %s', id);
      io.emit('update:connected', manager.getAll());
    }
  };

  io.on('session:disconnected', function (id) {
    session.remove(id);
  });

  io.on('session:add', function (user) {
    log.info('new session: %s', user.id);
    session.add(user);
  });

  return session;
};

module.exports = sessionManager;
