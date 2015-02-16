# smartgamer [![Build Status](https://api.travis-ci.org/neagle/smartgamer.svg?branch=master)](https://travis-ci.org/neagle/smartgamer)

So you've used [smartgame](https://www.npmjs.com/package/smartgame) to turn your [SGF](http://www.red-bean.com/sgf/index.html) file into a friendly JavaScript object, have you? Now you need a smartgamer to let you navigate and manipulate that smartgame.

Installation
============

For most projects, you'll just want to install smartgamer locally and add it to your project's dependencies in `package.json`:

```
$ npm install --save smartgamer
```

If you want (for whatever reason) to use smartgame anywhere, you can install it globally.

```
$ npm install -g smartgamer
```

Usage
=====

	var sgf = require('smartgame');
	var smartgamer = require('smartgamer');
	var fs = require('fs');

	// Grab an SGF file from somewhere
	var example = fs.readFileSync('sgf/example.sgf', { encoding: 'utf8' });

	var gamer = smartgamer(sgf.parse(example));

	// Go to a specific move
	gamer.goTo(4);

	// Navigate between moves
	gamer.next();
	gamer.previous();

	// Chain navigation together
	gamer.next().next();
	gamer.last().previous();
	gamer.goTo(4).next(1);

	// Get / set comments
	gamer.comment();
	gamer.comment('Losing move!');

	// Get the current node
	gamer.node();

	// Get the modified smartgame
	var newSGF = smartgame.generate(gamer.getSmartgame());
	fs.writeFileSync('new-example.sgf', newSGF, { encoding: 'utf8' });

Methods
=======

Coming soon! Until then, just checkout index.js. If you care about having this documented, please let me know and I'll make it happen.


License
=======

MIT
