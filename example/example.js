var sgf = require('smartgame');
var smartgamer = require('..');
var fs = require('fs');
var util = require('util');

console.log('smartgamer', typeof smartgamer);

// Grab example SGF files
var simpleExample = fs.readFileSync('sgf/simple_example.sgf', { encoding: 'utf8' });
var example = fs.readFileSync('sgf/example.sgf', { encoding: 'utf8' });

// Parse them into JS Game Records
//var parsedSimpleExample = sgf.parse(simpleExample);
//var parsedExample = sgf.parse(example);

//var game = smartgamer(sgf.parse(simpleExample));
var game = smartgamer(sgf.parse(example));

console.log('A simple example:', util.inspect(game, false, null));

module.exports = game;
