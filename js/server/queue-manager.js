'use strict';

var manager = require('./array-manager');
var _ = require('lodash');
var log = require('bunyan').createLogger({ name: 'queue-manager' });

module.exports = function (io) {
  return {
    add: function (user) {
      if (_.isUndefined(user) || _.isUndefined(user.id) || manager.get('id', user.id)) { return; }
      log.info('Queue::Add: user: %s', user.id);
      manager.add(user);

      var arrs = manager.getAll();
      io.emit('update:queue', arrs);
    },
    remove: function (id) {
      if (_.isUndefined(id)) { return; }
      log.info('Queue::Remove: %s', id);

      var user = manager.get('id', id);

      if (_.isUndefined(user)) {
        log.warn('Queue::Remove: user was undefined');
        return;
      }

      manager.remove(user);
      log.info('Queue::Remove: Removing user: %s', id);
      io.emit('update:queue', manager.getAll());
    }
  };
};
