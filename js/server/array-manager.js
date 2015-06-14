'use strict';

var _ = require('lodash');
var log = require('bunyan').createLogger({ name: 'array-manager' });
var array = [];
var validItem;

// TODO: reconfigure this to be the manager only
// TODO: make connection/queue manager do its own stuff using this library

validItem = function (item) {
  return !_.isUndefined(item) && !_.isNull(item);
};

var manager = {};

manager.add = function (item) {
  if (!validItem(item)) { return; }
  log.info('Adding %s', item);
  if (item instanceof Array) {
    array = _.union(array, item);
  } else {
    array.push(item);
  }
  return array;
};

manager.remove = function (item) {
  if (!validItem(item)) { return; }
  array = _.without(array, item);
  return array;
};

manager.get = function (ident, search) {
  return _.find(array, function (item) {
    return item[ident] === search;
  });
};

manager.getAll = function () {
  return array;
};

manager.removeAll = function () {
  array = [];
  return array;
};

manager.getIndex = function (context) {
  return _.findIndex(array, context);
};

manager.update = function (context, item) {
  var found = manager.getIndex(context);
  if (found > 0) {
    array[found] = item;
  }
  return array;
};

module.exports = manager;
