/* global module, require */
'use strict';

var _ = require('lodash'),
  log = require('bunyan').createLogger({ name: '[]manager' }),
  array = [],
  validItem;

// TODO: reconfigure this to be the manager only
// TODO: make connection/queue manager do its own stuff using this library

validItem = function (item) {
  return !_.isUndefined(item) && !_.isNull(item);
};

var manager = {
  add: function (item) {
    if (!validItem(item)) return;
    log.info("Adding %s", item);
    if (item instanceof Array) {
      array = _.union(array, item);
    } else {
      array.push(item);
    }
    return array;
  },
  remove: function (item) {
    if (!validItem(item)) return;
    array = _.without(array, item);
    return array;
  },
  get: function (ident, search) {
    return _.find(array, function (item) {
      return item[ident] === search;
    });
  },
  getAll: function () {
    return array;
  },
  removeAll: function () {
    return array = [];
  },
  getIndex: function(context){
    return _.findIndex(array, context);
  },
  update: function (context, item) {
    var found = manager.getIndex(context);
    if (found > 0) {
      array[found] = item;
    }
    return array;
  }
};

module.exports = manager;
