/**
 * Interact with smartgame objects.
 * @param {object} smartgame A JS Object representing a smartgame
 * @see http://www.red-bean.com/sgf/sgf4.html
 * @return {object} An object with methods for navigating and manipulating a
 * smartgame
 */
module.exports = function (smartgame) {
	'use strict';

	if (typeof smartgame !== 'object') {
		throw new Error('the smartgame navigator needs a smartgame to navigate');
	}

	var sequence;
	var node;

	var Smartgamer = function () {
		this.init();
	};

	Smartgamer.prototype = {
		init: function () {
			this.game = smartgame.gameTrees[0];
			this.reset();
		},

		// Having multiple games in a collection is not common, but it's part of
		// the spec
		games: function () {
			return smartgame.gameTrees;
		},

		selectGame: function (i) {
			if (i < smartgame.gameTrees.length) {
				this.game = smartgame.gameTrees[i];
				this.reset();
			} else {
				throw new Error('the collection doesn\'t contain that many games');
			}
		},

		reset: function () {
			sequence = this.game;
			node = sequence.nodes[0];
			this.path = { m: 0 };
		},

		getSmartgame: function () {
			return smartgame;
		},

		/**
		 * Return any variations available at the current move
		 **/
		variations: function () {
			if (sequence) {
				var localNodes = sequence.nodes;
				var localIndex = (localNodes) ? localNodes.indexOf(node) : null;

				if (localNodes) {
					if (localIndex === (localNodes.length - 1)) {
						return sequence.sequences || [];
					} else {
						return [];
					}
				}
			}
		},

		/**
		 * Go to the next move
		 **/
		next: function (variation) {
			variation = variation || 0;

			var localNodes = sequence.nodes;
			var localIndex = (localNodes) ? localNodes.indexOf(node) : null;

			// If there are no additional nodes in this sequence,
			// advance to the next one
			if (localIndex === null || localIndex >= (localNodes.length - 1)) {
				if (sequence.sequences) {
					if (sequence.sequences[variation]) {
						sequence = sequence.sequences[variation];
					} else {
						sequence = sequence.sequences[0];
					}

					node = sequence.nodes[0];

					// Note the fork chosen for this variation in the path
					this.path[this.path.m] = variation;
					this.path.m += 1;
				} else {
					// End of sequence / game
					return;
				}
			} else {
				node = localNodes[localIndex + 1];
				this.path.m += 1;
			}

			if (node) {
				return node;
			}
		},

		/**
		 * Go to the previous move
		 **/
		previous: function () {
			var localNodes = sequence.nodes;
			var localIndex = (localNodes) ? localNodes.indexOf(node) : null;

			// Delete any variation forks at this point
			// TODO: Make this configurable... we should keep this if we're
			// remembering chosen paths
			delete this.path[this.path.m];

			if (!localIndex || localIndex === 0) {
				if (sequence.parent && !sequence.parent.gameTrees) {
					sequence = sequence.parent;
					if (sequence.nodes) {
						node = sequence.nodes[sequence.nodes.length - 1];
						this.path.m -= 1;
					} else {
						node = null;
					}
				} else {
					// Already at the beginning
					return;
				}
			} else {
				node = localNodes[localIndex - 1];
				this.path.m -= 1;
			}

			if (node) {
				return node;
			}
		},

		// Go to the last move of the game
		last: function () {
			var n = node;

			while(n) {
				n = this.next();
			}

			return node;
		},

		// Go to the first move of the game
		first: function () {
			this.reset();
			return node;
		},

		/**
		 * Go to a particular move, specified as a
		 * a) number
		 * b) path string
		 * c) path object
		 **/
		goTo: function (path) {
			if (typeof path === 'string') {
				path = this.path(path, 'object');
			} else if (typeof path === 'number') {
				path = { m: path };
			}

			this.reset();

			var n = node;

			for (var i = 0; i < path.m && n; i += 1) {
				var variation = path[i] || 0;
				n = this.next(variation);
			}

			return node;
		},

		getGameInfo: function () {
			return this.game.nodes[0];
		},

		// Provide the current node
		node: function () {
			return node;
		},

		// Get or set a comment on the current node
		comment: function (text) {
			if (!text) {
				return node.C || '';
			} else {
				node.C = text;
			}
		},

		/**
		 * Translate alpha coordinates into an array
		 * @param string alphaCoordinates
		 * @return array [x, y]
		 **/
		translateCoordinates: function (alphaCoordinates) {
			var coordinateLabels = 'abcdefghijklmnopqrst';
			var intersection = [];

			intersection[0] = coordinateLabels.indexOf(alphaCoordinates.substring(0, 1));
			intersection[1] = coordinateLabels.indexOf(alphaCoordinates.substring(1, 2));

			return intersection;
		},

		/**
		 * Convert path objects to strings and path strings to objects
		 **/
		path: function (input, outputType, verbose) {
			var output;

			// If no output type has been specified, try to set it to the
			// opposite of the input
			if (typeof outputType === 'undefined') {
				outputType = (typeof input === 'string') ? 'object' : 'string';
			}

			/**
			 * Turn a path object into a string.
			 */
			function stringify(input) {
				if (typeof input === 'string') {
					return input;
				}

				if (!input) {
					return '';
				}

				output = input.m;

				var variations = [];
				for (var key in input) {
					if (input.hasOwnProperty(key) && key !== 'm') {
						// Only show variations that are not the primary one, since
						// primary variations are chosen by default
						if (input[key] > 0) {
							if (verbose) {
								variations.push(', variation ' + input[key] + ' at move ' + key);
							} else {
								variations.push('-' + key + ':' + input[key]);
							}
						}
					}
				}

				output += variations.join('');
				return output;
			}

			/**
			 * Turn a path string into an object.
			 */
			function parse(input) {
				if (typeof input === 'object') {
					input = stringify(input);
				}

				if (!input) {
					return { m: 0 };
				}

				var path = input.split('-');
				output = {
					m: Number(path.shift())
				};

				if (path.length) {
					path.forEach(function (variation, i) {
						variation = variation.split(':');
						output[Number(variation[0])] = variation[1];
					});
				}

				return output;
			}

			if (outputType === 'string') {
				output = stringify(input);
			} else if (outputType === 'object') {
				output = parse(input);
			} else {
				output = undefined;
			}

			return output;
		}
	};

	return new Smartgamer();
};
