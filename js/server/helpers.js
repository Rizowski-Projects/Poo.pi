Array.prototype.contains = function(b){
  return!!~this.indexOf(b)
};
Array.prototype.remove = function(item){
  var location = this.indexOf(item);
  if(location> -1){
    this.splice(location, 1)
  }
};
