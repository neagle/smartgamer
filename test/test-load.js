/*global describe, beforeEach, it*/
'use strict';
var assert = require('assert');

describe('smartgamer', function () {
  it('can be imported without blowing up', function () {
    var smartgamer= require('..');
    assert(smartgamer !== undefined);
  });
});

describe('init', function () {
	it('can be initialized with a smartgame', function () {
		var fs = require('fs');
		var smartgamer = require('..');
		var sgf = require('smartgame');
		var simpleExample = fs.readFileSync('./example/sgf/simple_example.sgf', { encoding: 'utf8' });

		var gamer = smartgamer(sgf.parse(simpleExample));

		assert(typeof gamer === 'object');
	});
});
