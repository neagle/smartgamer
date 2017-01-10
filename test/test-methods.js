/*global describe, beforeEach, it*/
'use strict';
var assert = require('assert');

var fs = require('fs');
var smartgamer = require('..');
var sgf = require('smartgame');
var simpleExample = fs.readFileSync('./example/sgf/simple_example.sgf', { encoding: 'utf8' });
var example = fs.readFileSync('./example/sgf/example.sgf', { encoding: 'utf8' });

describe('totalMoves()', function () {
	it('returns the total number of moves', function () {
		var gamer = smartgamer(sgf.parse(example));
		var simpleGamer = smartgamer(sgf.parse(simpleExample));

		assert(gamer.totalMoves() === 13);
		assert(simpleGamer.totalMoves() === 4);
	});
});

describe('goto()', function () {
	it('can to to a move given as a number', function () {
		var gamer = smartgamer(sgf.parse(example));
		var simpleGamer = smartgamer(sgf.parse(simpleExample));

		var node1 = gamer.goTo(3).node();
		var node2 = simpleGamer.goTo(3).node();

		assert.deepEqual(node1, {
			B: 'pp',
			GB: '2',
			C: 'Marked as "Very good for Black"'
		});
		assert.deepEqual(node2, { B: 'pp' });
	});

	it('can to to a move given as a path', function () {
		var simpleGamer = smartgamer(sgf.parse(simpleExample));

		var node1 = simpleGamer.goTo('7-4:1-7:1').node();
		var node2 = simpleGamer.goTo({ '4': 1, '7': 1, m: 7 }).node();

		assert.deepEqual(node1, { B: 'ci' });
		assert.deepEqual(node2, { B: 'ci' });
	});
});

describe('next()', function () {
	it('can go to the next move', function () {
		var gamer = smartgamer(sgf.parse(example));
		var simpleGamer = smartgamer(sgf.parse(simpleExample));

		var node1 = gamer.next().node();
		var node2 = simpleGamer.next().node();

		assert.deepEqual(node1, {
			B: 'pd',
			N: 'Moves, comments, annotations',
			C: 'Nodename set to: "Moves, comments, annotations"' }
		);
		assert.deepEqual(node2, {
			B: 'pd'
		});
	});
});

describe('previous()', function () {
	it('can go to the next move', function () {
		var gamer = smartgamer(sgf.parse(example));
		var simpleGamer = smartgamer(sgf.parse(simpleExample));

		var node1 = gamer.last().previous().node();
		var node2 = simpleGamer.last().previous().node();

		assert.deepEqual(node1, { C: 'White "Pass" move', W: '' });
		assert.deepEqual(node2, { B: 'pp' });
	});
});

describe('last()', function () {
	it('can go to the end of a game', function () {
		var gamer = smartgamer(sgf.parse(example));
		var simpleGamer = smartgamer(sgf.parse(simpleExample));

		var node1 = gamer.last().node();
		var node2 = simpleGamer.last().node();

		assert.deepEqual(node1, { C: 'Black "Pass" move', B: 'tt' });
		assert.deepEqual(node2, { W: 'dd' });
	});
});

describe('first()', function () {
	it('can go to the first move', function () {
		var gamer = smartgamer(sgf.parse(example));
		var simpleGamer = smartgamer(sgf.parse(simpleExample));

		var node1 = gamer.last().first().node();
		var node2 = simpleGamer.last().first().node();

		assert.deepEqual(node1, {
			FF: '4',
			AP: 'Primiview:3.1',
			GM: '1',
			SZ: '19',
			GN: 'Gametree 1: properties',
			US: 'Arno Hollosi'
		});
		assert.deepEqual(node2, {
			GM: '1',
			FF: '4',
			CA: 'UTF-8',
			SZ: '19'
		});
	});
});

describe('pathTransform()', function () {
	it('can transform path strings to objects', function () {
		var gamer = smartgamer();

		// Simple move strings can be turned into objects
		assert.deepEqual(gamer.pathTransform('35'), {
			m: 35
		});

		// Simple objects can be turned into move strings
		assert(gamer.pathTransform({ m: 35 }) === '35');

		// Strings with variations can be turned into objects
		assert.deepEqual(gamer.pathTransform('35-10:1'), {
			m: 35,
			10: 1
		});

		// Objects with variations can be turned into move strings
		assert(gamer.pathTransform({ m: 35, 10: 1 }) === '35-10:1');
	});
});

describe('comment()', function () {
	it('can get comment text', function () {
		var gamer = smartgamer(sgf.parse(example));

		gamer.next().next();

		assert(gamer.comment() === 'Marked as "Good for White"');

		gamer.comment('foo');
		assert(gamer.comment() === 'foo');
	});
});

describe('comment()', function () {
	it('can set comment text', function () {
		var gamer = smartgamer(sgf.parse(example));

		gamer.next().next().comment('foo');

		assert(gamer.comment() === 'foo');
	});
});

describe('comment()', function () {
	it('properly escapes comment text', function () {
		var gamer = smartgamer(sgf.parse(example));

		var str = 'cloudbrows: I _love_ my [markdown]' +
			'(http://daringfireball.net/projects/markdown/syntax), yes I do! \\o/';
		var escapedStr = 'cloudbrows\\: I _love_ my [markdown\\]' +
			'(http\\://daringfireball.net/projects/markdown/syntax), yes I do! \\\\o/';
		gamer.next().next().comment(str);

		assert(gamer.node().C === escapedStr);
	});
});
