var helpers = require('./helpers'),
  _io = null,
  queued = [],
  connected = [];

function imports(io){
  _io = io;
  return this;
}



var addQ = function (item){
  if (!queued.contains(item)) {
    queued.push(item);
    console.log(item + " has queued");
    updateQd();
  }
},
addConnected = function (item){
  if (!connected.contains(item)) {
    connected.push(item);
    console.log(item + " has connected");
    updateConnected();
  }
},
removeQ = function (item){
  queued.remove(item);
  console.log(item + " has dqd");
  updateDqd();
},
removeConnected = function (item){
  connected.remove(item);
  console.log(item + " has disconnected");
  updateDisconnected();
},
updateConnected = function(){
  _io.emit('connected', connected);
},
updateDisconnected = function(){
  _io.emit('disconnected', connected);
},
updateQd = function(){
  _io.emit('queued', queued);
},
updateDqd = function(){
  _io.emit('dqd', queued);
};

exports.import = imports;
exports.addQ = addQ;
exports.addConnected = addConnected;
exports.removeQ = removeQ;
exports.removeConnected = removeConnected;
exports.updateConnected = updateConnected;
exports.updateDisconnected = updateDisconnected;
exports.updateQd = updateQd;
exports.updateDqd = updateDqd;
