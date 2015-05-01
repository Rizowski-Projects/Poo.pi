/// <reference path="../typings/mocha/mocha.d.ts"/>
'use-strict';
var proxy = require('proxyquire'),
  chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe("Array Manager", function () {
  var manager, items;
  beforeEach(function () {
    var mock = {
      'bunyan': {
        createLogger: function () {
          return { info: function () { } };
        }
      }
    };
    items = [{
        name: "jaun"
      },{
        name: "doe"
      },{
        name: "trey"
      }];
    manager = proxy('../js/server/array-manager', mock);
  });
  
  describe("removeAll()", function(){
    beforeEach(function(){
      manager.add(items);
    });

    it("resets the array", function(){
      var array = manager.removeAll();
      expect(array.length).to.equal(0);
    });
  });

  describe("getAll()", function(){
    beforeEach(function(){
      manager.add(items);
    });
    
    afterEach(function(){
      manager.removeAll();
    });
    
    it('returns everything in the manager', function(){
      var arr = manager.getAll();
      expect(arr.length).to.equal(3);
      expect(arr[0]).to.equal(items[0]);
      expect(arr[1]).to.equal(items[1]);
      expect(arr[2]).to.equal(items[2]);
    });
  });

  describe("getIndex()", function(){
    var searchItem;
    beforeEach(function(){
      searchItem = {name: "hello"};
      manager.add([{name: "bob"}, searchItem]);
    });

    afterEach(function(){
      manager.removeAll();
    });

    it("returns the index of an item", function(){
      var index = manager.getIndex(searchItem);
      expect(index).to.equal(1);
    });
  });

  describe("update()", function(){
    beforeEach(function(){
      manager.add(items);
    });

    afterEach(function(){
      manager.removeAll();
    });

    it("returns the array", function(){
      var array = manager.update();
      expect(array).to.not.be.undefined;
    });

    it("replaces the item at an index", function(){
      var first = items[0];
      first.id = 5;
      manager.update({name: first.name}, first);
      var arr = manager.getAll();
      expect(arr[0].id).to.not.be.undefined;
    });
  });

  describe("get()", function(){
    beforeEach(function(){
      manager.add(items);
    });
    
    afterEach(function(){
      manager.removeAll();
    });

    it('gets an item from the array', function(){
      var found = manager.get("name", items[0].name);
      expect(found).to.exist;
      expect(found).to.deep.equal(items[0]);
    });
  });

  describe("remove()", function(){
    beforeEach(function(){
      manager.add(items);
    });
    
    it('removes an element from the array', function(){
      var juan = items[0];
      var arr = manager.remove(juan);
      var managerArray = manager.getAll(); 
      expect(managerArray).to.deep.equal(arr);
      expect(managerArray).to.not.contain(juan);
    });
  });

  describe("add()", function(){
    afterEach(function(){
      manager.removeAll();
    });

    it('adds an Item to the array', function () {
      var item = { name: "hello" };
      manager.add(item);
      expect(manager.getAll()[0]).to.deep.equal(item);
    });

    it('adds an array of items', function(){
      manager.add([{},{},{},{}]);
      expect(manager.getAll().length).to.equal(4);
    });
  });
});