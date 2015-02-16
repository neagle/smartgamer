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
	it('can be initialized without a smartgame', function () {
    var smartgamer= require('..');
		var gamer = smartgamer();

		assert(typeof gamer === 'object');
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

describe('load', function () {
	it('can load a smartgame after init', function () {
		var fs = require('fs');
		var smartgamer = require('..');
		var sgf = require('smartgame');
		var simpleExample = fs.readFileSync('./example/sgf/simple_example.sgf', { encoding: 'utf8' });

		var gamer = smartgamer();

		gamer.load(sgf.parse(simpleExample));

		assert(typeof gamer.getSmartgame() === 'object');
	});
});
