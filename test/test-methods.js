/*global describe, beforeEach, it*/
'use strict';
var assert = require('assert');

describe('last()', function () {
	it('can go to the end of a game', function () {
		var fs = require('fs');
		var smartgamer = require('..');
		var sgf = require('smartgame');
		var simpleExample = fs.readFileSync('./example/sgf/simple_example.sgf', { encoding: 'utf8' });
		var example = fs.readFileSync('./example/sgf/example.sgf', { encoding: 'utf8' });

		var gamer1 = smartgamer(sgf.parse(simpleExample));
		var gamer2 = smartgamer(sgf.parse(example));

		var node1 = gamer1.last();
		var node2 = gamer2.last();

		assert.deepEqual(node1, { W: 'dd' });
		assert.deepEqual(node2, { C: 'Black "Pass" move', B: 'tt' });
	});
});
