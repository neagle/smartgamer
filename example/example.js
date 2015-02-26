// Reference SGFs: http://eidogo.com/#uc2URg7G
var repl = require('repl').start({
	useGlobal: true
});

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

var simpleGamer = smartgamer(sgf.parse(simpleExample));
var gamer = smartgamer(sgf.parse(example));
var nogamer = smartgamer();

//console.log('A simple example:', util.inspect(simpleGamer, false, null));

repl.context.sgf = sgf;
repl.context.simpleExample = simpleExample;
repl.context.example = example;
repl.context.gamer = gamer;
repl.context.simpleGamer = simpleGamer;
repl.context.nogamer = nogamer;
