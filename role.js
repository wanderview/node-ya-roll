'use strict';

module.exports = Roll;

var MAX_INT = 0x7fffffff;

// Roll(4).orAbove().onDice(3).withSides(6).result();

function Roll(val) {
  var self = (this instanceof Roll)
           ? this
           : Object.create(Roll.prototype);

  if (typeof val !== 'number') {
    throw new Error('Cannot roll "' + val + '" because its not a number.');
  }

  self._limit = ~~val;
  self._compare = _compareEqual;
  self._numDice = 1;
  self._numSides = 6;

  return self;
}

Roll.prototype.orAbove = function() {
  this._compare = _compareEqualOrAbove;
  return this;
};

Roll.prototype.orBelow = function() {
  this._compare = _compareEqualOrBelow;
  return this;
};

Roll.prototype.onDice = function(val) {
  if (typeof val !== 'number') {
    throw new Error('Cannot roll "' + val + '" dice since its not a number.');
  } else if (val < 1) {
    throw new Error('Cannot roll "' + val + '" dice; need at least one.');
  }

  this._numDice = ~~val;
  return this;
};

Roll.prototype.withSides = function(val) {
  if (typeof val !== 'number') {
    throw new Error('Cannot have "' + val + '" sides since its not a number.');
  } else if (val < 2) {
    throw new Error('Cannot have "' + val + '" sides; need at least two.');
  }

  this._numSides = ~~val;
  return this;
};

Roll.prototype.result = function() {
  var total = 0;
  var rolls = [];
  for (var i = 0; i < this._numDice; ++i) {
    var single = ~~(Math.random() * (this._numSides + 1));
    total += single;
    rolls.push(single);
  }
  return this._compare(total, this._limit) ? rolls : null;
};

Roll.prototype.results = function(val) {
  if (typeof val !== 'number') {
    throw new Error('Cannot get "' + val + '" results; not a number.');
  } else if (val < 1) {
    throw new Error('Cannot get "' + val + '" results; need at least one.');
  }
  val = ~~val;
  var rtn = [];
  for (var i = 0; i < val; ++i) {
    rtn.push(this.result());
  }
  return rtn;
};

Roll.prototype.chance = function() {
  // There is probably a fancy equation to do this, but it was not immediately
  // google'able, so implement using by creating a histogram of every possible
  // result.
  var histogram = this._buildHistogram();

  var numMatching = 0;
  for (var result in histogram) {
    if (this._compare(~~result, this._limit)) {
      numMatching += histogram[result];
    }
  }

  var total = Math.pow(this._numSides, this._numDice);

  return numMatching / total;
};

Roll.prototype._buildHistogram = function() {
  var histogram = {};

  var stack = [];

  var die = this._numDice;
  var side = this._numSides;
  var result = 0;

  while (true) {
    while (side < 1) {
      var back = stack.pop();
      if (!back) {
        return histogram;
      }
      result = back.result;
      die = back.die;
      side = back.side;
    }

    var lastResult = result;
    result += side;

    if (die === 1) {
      histogram[result] = ~~histogram[result] + 1;
    }

    if (die === 1) {
      result = lastResult;
      side -= 1;
      continue;
    }

    stack.push({die: die, side: (side - 1), result: lastResult});
    die -= 1;
    side = this._numSides;
  }
}

function _compareEqual(val, limit) {
  return val === limit;
};

function _compareEqualOrAbove(val, limit) {
  return val >= limit;
};

function _compareEqualOrBelow(val, limit) {
  return val <= limit;
};
