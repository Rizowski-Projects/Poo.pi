/* jshint undef: true, unused: true, globalstrict: true*/
/* global module, require */
'use strict';

var manager = require('./array-manager')(),
    _ = require('underscore'),
    log = require('bunyan').createLogger({name: 'queue'});

module.exports = function (io) {
  return {
    add: function(user){
      if(_.isUndefined(user) || _.isUndefined(user.id)) return;
      if(manager.get('id', user.id)) return;
      manager.add(user);
      log.info('Queue::Add: user: %s', user.id);
      var arrs = manager.getAll();
      io.emit('update:queue', arrs);
    },
    remove: function(id){
      log.info('Queue::Remove: %s',id);
      if (_.isUndefined(id)) return;
      var user = manager.get("id", id);
      if(_.isUndefined(user)){
        log.warn("Queue::Remove: user was undefined");
        return;
      }
      manager.remove(user);
      log.info('Queue::Remove: Removing user: %s', id);
      io.emit('update:queue', manager.getAll());
    }
  }
}
