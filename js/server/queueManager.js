var helpers = require('./helpers');

function imports(io){
  this.io = io;
  return this;
}
exports.import = imports;
var queued = [],
    connected = [];

exports.addQ = function (item){
  if (!queued.contains(item)) {
    queued.push(item);
    console.log(item + " has queued");
    this.io.emit('queued', queued);
  }
};
exports.addConnected = function (item){
  if (!connected.contains(item)) {
    connected.push(item);
    console.log(item + " has connected");
    this.io.emit('connected', connected);
  }
};
exports.removeQ = function (item){
  queued.remove(item);
  console.log(item + " has dqd");
  this.io.emit('dqd', queued);
};
exports.removeConnected = function (item){
  connected.remove(item);
  console.log(item + " has disconnected");
  this.io.emit('disconnected', connected);
};
