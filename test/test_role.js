'use strict';

var Role = require('../role.js');

var realRandom = null;
var mockRandomValue = 0;
var mockRandom = function() {
  return mockRandomValue;
};

module.exports.setUp = function(done) {
  realRandom = Math.random;
  Math.random = mockRandom;
  mockRandomValue = 0;
  done();
};

module.exports.tearDown = function(done) {
  Math.random = realRandom;
  done();
};

module.exports.equal = function(test) {
  test.expect(3);

  var r = Role(4);

  mockRandomValue = 3 / 6;
  test.ok(!r.result());

  mockRandomValue = 4 / 6;
  test.ok(r.result());

  mockRandomValue = 5 / 6;
  test.ok(!r.result());

  test.done();
};

module.exports.above = function(test) {
  test.expect(3);

  var r = Role(4).orAbove();

  mockRandomValue = 3 / 6;
  test.ok(!r.result());

  mockRandomValue = 4 / 6;
  test.ok(r.result());

  mockRandomValue = 5 / 6;
  test.ok(r.result());

  test.done();
};

module.exports.below = function(test) {
  test.expect(3);

  var r = Role(4).orBelow();

  mockRandomValue = 3 / 6;
  test.ok(r.result());

  mockRandomValue = 4 / 6;
  test.ok(r.result());

  mockRandomValue = 5 / 6;
  test.ok(!r.result());

  test.done();
};

module.exports.dice = function(test) {
  test.expect(3);

  var r = Role(12).onDice(3);

  mockRandomValue = 3 / 6;
  test.ok(!r.result());

  mockRandomValue = 4 / 6;
  test.ok(r.result());

  mockRandomValue = 5 / 6;
  test.ok(!r.result());

  test.done();
};

module.exports.sides = function(test) {
  test.expect(3);

  var r = Role(8).withSides(12);

  mockRandomValue = 7 / 12;
  test.ok(!r.result());

  mockRandomValue = 8 / 12;
  test.ok(r.result());

  mockRandomValue = 9 / 12;
  test.ok(!r.result());

  test.done();
};

module.exports.results = function(test) {
  test.expect(3);

  Math.random = realRandom;

  var r = Role(50).orBelow().onDice(10).withSides(10);
  var results = r.results(100);
  test.equal(100, results.length);
  var numTrue = 0;
  for (var i = 0; i < results.length; ++i) {
    if (results[i]) {
      numTrue += 1;
    }
  }
  test.notEqual(0, numTrue);
  test.notEqual(100, numTrue);
  test.done();
};

module.exports.chance = function(test) {
  test.expect(1);
  var r = Role(4).orAbove().onDice(1).withSides(6);
  var c = r.chance();
  test.equal(0.5, c);
  test.done();
};
