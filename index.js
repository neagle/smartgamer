/**
 * Convert SGF files to a JS object
 * @param {object} smartgame A JS Object representing a smartgame
 * @see http://www.red-bean.com/sgf/sgf4.html
 * @return {object} An object with methods for navigating and analyzing a smartgame
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

		selectGame: function (i) {
			if (i < smartgame.gameTrees.length) {
				this.game = smartgame.gameTrees[i];
			} else {
				throw new Error('the collection doesn\'t contain that many games');
			}
		},

		reset: function () {
			sequence = this.game;
			this.move = 0;
		},

		getSmartgame: function () {
			return smartgame;
		},

		rootNodes: function () {
			return this.game.nodes[0];
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

		next: function (variation) {
			variation = variation || 0;

			var localNodes = sequence.nodes;
			var localIndex = (localNodes) ? localNodes.indexOf(node) : null;

			var variations = this.variations();
			console.log('variations?', variations);

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
					this.move += 1;
				} else {
					// TODO: Isn't this just the end of a sequence? Could be a variation.
					console.log('end of game');
				}
			} else {
				node = localNodes[localIndex + 1];
				this.move += 1;
			}

			if (node) {
				return node;
			}
		},

		previous: function () {
			var localNodes = sequence.nodes;
			var localIndex = (localNodes) ? localNodes.indexOf(node) : null;

			if (!localIndex || localIndex === 0) {
				if (sequence.parent) {
					sequence = sequence.parent;
					if (sequence.nodes) {
						node = sequence.nodes[sequence.nodes.length - 1];
						this.move -= 1;
					} else {
						node = null;
					}
				} else {
					console.log('Already at the beginning of the game.');
				}
			} else {
				node = localNodes[localIndex - 1];
				this.move -= 1;
			}

			if (node) {
				return node;
			}
		},

		last: function () {
		},

		first: function () {
		},

		goTo: function (path) {
		},

		getGameInfo: function () {
			return this.rootNodes();
		}
	};

var playerTerms = {
	'black': 'Black',
	'white': 'White',
	'DT': 'Date',
	'KM': 'Komi',
	'HA': 'Handicap',
	'AN': 'Annotations',
	'CP': 'Copyright',
	'GC': 'Game comments',
	'GN': 'Game name',
	'ON': 'Fuseki',
	'OT': 'Overtime',
	'TM': 'Basic time',
	'RE': 'Result',
	'RO': 'Round',
	'RU': 'Rules',
	'US': 'Recorder',
	'PC': 'Place',
	'EV': 'Event',
	'SO': 'Source',
	'none': 'none',
	'bpass': 'Black passed.',
	'wpass': 'White passed.',
};

	return new Smartgamer();
};
