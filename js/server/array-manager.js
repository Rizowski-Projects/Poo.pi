/* jshint undef: true, unused: true, globalstrict: true*/
/* global module, require */
'use strict';

var _ = require('underscore'),
    log = require('bunyan').createLogger({name: '[]manager'});

// TODO: reconfigure this to be the manager only
// TODO: make connection/queue manager do its own stuff using this library
module.exports = function () {
  var validItem = function (item) {
      return !_.isUndefined(item) && !_.isNull(item);
    },
    array = [];
  return {
    add: function (item) {
      if (!validItem(item)) return;
      log.info("adding %s", item.id);
      array.push(item);
      log.info(array);
    },
    remove: function (item) {
      if (!validItem(item)) return;
      array = _.without(array, item);
    },
    get: function (ident, search) {
      return _.find(array, function (item) {
        return item[ident] === search;
      });
    },
    getAll: function(){
      return array;
    },
    getIndex: function (item) {
      return _.indexOf(array, item);
    },
    update: function (item, updated) {
      var found = _.indexOf(array, item);
      if (found > 0) {
        array[found] = updated;
      }
    }
  };
};
