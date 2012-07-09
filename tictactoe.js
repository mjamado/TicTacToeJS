var tictactoe = (function ($) {
	var board = [[null, null, null], [null, null, null], [null, null, null]], // [x][y]
		container,
		translations = {
			me: "Me",
			you: "You",
			ties: "Ties",
			iwon: "I won!",
			youwon: "You won!",
			tie: "It's a Tie!"
		},
		victories = 0,
		losses = 0,
		ties = 0,
		lastStarter = 0,
		move = 0,
		myLastPlay,
		yourLastPlay,
		figures = ['col', 'row', 'backDiag', 'forwDiag'],
		players = {me: 2, you: 1, none: null};

	function drawBoard() {
		var msg = '';

		board = [[null, null, null], [null, null, null], [null, null, null]];

		if (container !== undefined) {
			msg += '<div class="ticTacToeBoard">';
			msg += '<div class="ticTacToeSquare available firstCol" data-ttt-coord-x="0" data-ttt-coord-y="0"></div>';
			msg += '<div class="ticTacToeSquare available" data-ttt-coord-x="1" data-ttt-coord-y="0"></div>';
			msg += '<div class="ticTacToeSquare available lastCol" data-ttt-coord-x="2" data-ttt-coord-y="0"></div>';
			msg += '<div class="ticTacToeSquare available firstCol" data-ttt-coord-x="0" data-ttt-coord-y="1"></div>';
			msg += '<div class="ticTacToeSquare available" data-ttt-coord-x="1" data-ttt-coord-y="1"></div>';
			msg += '<div class="ticTacToeSquare available lastCol" data-ttt-coord-x="2" data-ttt-coord-y="1"></div>';
			msg += '<div class="ticTacToeSquare available firstCol lastRow" data-ttt-coord-x="0" data-ttt-coord-y="2"></div>';
			msg += '<div class="ticTacToeSquare available lastRow" data-ttt-coord-x="1" data-ttt-coord-y="2"></div>';
			msg += '<div class="ticTacToeSquare available lastCol lastRow" data-ttt-coord-x="2" data-ttt-coord-y="2"></div>';
			msg += '</div>';
			msg += '<ul class="ticTacToeScore">';
			msg += '<li><label>' + translations.me + ':</label><span id="ticTacToeScoreMe">' + victories.toString(10) + '</span></li>';
			msg += '<li><label>' + translations.you + ':</label><span id="ticTacToeScoreYou">' + losses.toString(10) + '</span></li>';
			msg += '<li><label>' + translations.ties + ':</label><span id="ticTacToeScoreTies">' + ties.toString(10) + '</span></li>';
			msg += '</ul>';
			msg += '<div class="ticTacToeEndGame"></div>';

			container.html(msg);

			$('.ticTacToeEndGame').hide();

			initCallbacks();

			move = 0;
			if (lastStarter === 1) {
				lastStarter = 0;
				play();
			} else {
				lastStarter = 1;
			}
		}
	}

	function initCallbacks() {
		$('.ticTacToeSquare.available').one("click", function () {
			var x = $(this).data('tttCoordX'), y = $(this).data('tttCoordY'), winningFigure;
			board[x][y] = 1;
			$(this).html('X');
			$(this).removeClass('available');
			yourLastPlay = {x: x, y: y};

			winningFigure = hasWon();
			if (winningFigure) {
				onWinning(winningFigure, 'youwon');
			} else if (!isTied()) {
				play();
			}
		});
	}

	function play() {
		var winningFigure;

		if (!playChoose(undefined, {what: "anything", me: 2})) {
			if (!playChoose(undefined, {what: "anything", you: 2})) {
				strategicPlay();
			}
		}

		move++;

		winningFigure = hasWon();
		if (winningFigure) {
			onWinning(winningFigure, 'iwon');
		} else {
			isTied();
		}
	}

	function countPlays(x, y, where, who) {
		if (where === 'row') {
			return ((board[(x - 1).mod(3)][y] === who) ? 1 : 0) + ((board[(x - 2).mod(3)][y] === who) ? 1 : 0);
		} else if (where === 'col') {
			return ((board[x][(y - 1).mod(3)] === who) ? 1 : 0) + ((board[x][(y - 2).mod(3)] === who) ? 1 : 0);
		} else if (where === 'backDiag') {
			if (x === y) {
				return ((board[(x - 1).mod(3)][(y - 1).mod(3)] === who) ? 1 : 0) + ((board[(x - 2).mod(3)][(y - 2).mod(3)] === who) ? 1 : 0);
			} else {
				return null;
			}
		} else if (where === 'forwDiag') {
			if (x === Math.abs(y - 2)) {
				return ((board[(x + 1).mod(3)][(y - 1).mod(3)] === who) ? 1 : 0) + ((board[(x + 2).mod(3)][(y - 2).mod(3)] === who) ? 1 : 0);
			} else {
				return null;
			}
		}

		return null;
	}

	function playStats(x, y) {
		var i, player, plays = {};

		for (i = 0; i < 4; i++) {
			plays[figures[i]] = {};
			for (player in players) {
				if (players.hasOwnProperty(player)) {
					plays[figures[i]][player] = countPlays(x, y, figures[i], players[player]);
				}
			}
		}

		return plays;
	}

	function validPlay(plays, where) {
		var player, i, res = [];

		if (where !== undefined) {
			switch (where.what) {
			case 'anything':
				for (player in players) {
					if (players.hasOwnProperty(player) && where[player] !== undefined) {
						for (i = 0; i < 4; i++) {
							if (plays[figures[i]][player] === where[player]) {
								res.push(true);
							}
						}
					}
				}

				break;

			case 'rowOrCol':
				var inRow = [], inCol = [], finalRow = true, finalCol = true;
				for (player in players) {
					if (players.hasOwnProperty(player) && where[player] !== undefined) {
						if (plays.row[player] === where[player]) {
							inRow.push(true);
						} else {
							inRow.push(false);
						}

						if (plays.col[player] === where[player]) {
							inCol.push(true);
						} else {
							inCol.push(false);
						}
					}
				}

				for (i = 0; i < inRow.length; i++) {
					if (!inRow[i]) {
						finalRow = false;
						break;
					}
				}

				for (i = 0; i < inCol.length; i++) {
					if (!inCol[i]) {
						finalCol = false;
						break;
					}
				}

				res.push(finalRow || finalCol);

				break;

			case 'rowAndCol':
				for (player in players) {
					if (players.hasOwnProperty(player) && where[player] !== undefined) {
						if ((plays.row[player] === where[player]) && (plays.col[player] === where[player])) {
							res.push(true);
						} else {
							res.push(false);
						}
					}
				}

				break;
			}

			if (res.length > 0) {
				for (i = 0; i < res.length; i++) {
					if (!res[i]) {
						return false;
					}
				}

				return true;
			} else {
				return false;
			}
		}

		return true;
	}

	function playChoose(what, where) {
		var rotate, i, sinRotate, cosRotate, x, y, candidates = [], myPlay;

		if (((what === undefined) || (what.center !== undefined)) && (board[1][1] === null) && (validPlay(playStats(1, 1), where))) {
			candidates.push({x: 1, y: 1});
		}

		for (rotate = 0; rotate < 4; rotate++) {
			sinRotate = ((rotate + 1).mod(2)) * ((rotate > 1) ? -1 : 1);
			cosRotate = (rotate.mod(2)) * ((rotate > 1) ? 1 : -1);

			for (i = 0; i < 2; i++) {
				x = (i * cosRotate - 2 * sinRotate + 1).mod(3);
				y = (i * sinRotate + 2 * cosRotate + 1).mod(3);

				if ((board[x][y] === null) && ((what === undefined) || (((what.corner !== undefined) && isCorner(x, y)) || ((what.wall !== undefined) && isWall(x, y)))) && validPlay(playStats(x, y), where)) {
					candidates.push({x: x, y: y});
				}
			}
		}

		if (candidates.length > 0) {
			myPlay = candidates[Math.floor(Math.random() * candidates.length)];
			doMyPlay(myPlay.x, myPlay.y);

			return true;
		} else {
			return false;
		}
	}

	function isCorner(x, y) {
		return (x !== 1) && (y !== 1);
	}

	function isWall(x, y) {
		return (x === 1) || (y === 1);
	}

	function strategicPlay() {
		if (lastStarter === 0) {
			switch (move) {
			case 0:
				playChoose({corner: true, center: true});
				break;

			case 1:
				if ((myLastPlay.x === 1) && (myLastPlay.y === 1)) {
					if ((yourLastPlay.x === yourLastPlay.y) || (yourLastPlay.x === Math.abs(yourLastPlay.y - 2))) {
						doMyPlay(Math.abs(yourLastPlay.x - 2), Math.abs(yourLastPlay.y - 2));
					} else {
						if (yourLastPlay.x !== 1) {
							doMyPlay(Math.abs(yourLastPlay.x - 2), Math.floor(Math.random() * 2) * 2);
						} else {
							doMyPlay(Math.floor(Math.random() * 2) * 2, Math.abs(yourLastPlay.y - 2));
						}
					}
				} else {
					if ((yourLastPlay.x === 1) && (yourLastPlay.y === 1)) {
						doMyPlay(Math.abs(myLastPlay.x - 2), Math.abs(myLastPlay.y - 2));
					} else {
						if ((board[Math.abs(myLastPlay.x - 2)][myLastPlay.y] === null) && (board[Math.abs(myLastPlay.x - 1)][myLastPlay.y] === null)) {
							doMyPlay(Math.abs(myLastPlay.x - 2), myLastPlay.y);
						} else {
							doMyPlay(myLastPlay.x, Math.abs(myLastPlay.y - 2));
						}
					}
				}
				break;

			case 2:
				playChoose({corner: true}, {what: "rowOrCol", me: 1, you: 0});
				break;

			case 3:
			case 4:
				playChoose();
				break;
			}
		} else {
			switch (move) {
			case 0:
				if (board[1][1] === 1) {
					doMyPlay(Math.floor(Math.random() * 2) * 2, Math.floor(Math.random() * 2) * 2);
				} else {
					doMyPlay(1, 1);
				}
				break;

			case 1:
				if ((myLastPlay.x !== 1) || (myLastPlay.y !== 1)) {
					if ((yourLastPlay.x === Math.abs(myLastPlay.x - 2)) && (yourLastPlay.y === Math.abs(myLastPlay.y - 2))) {
						playChoose({corner: true});
					}
				} else {
					if ((board[Math.abs(yourLastPlay.x - 2)][Math.abs(yourLastPlay.y - 2)] === 1) && (yourLastPlay.x !== 1) && (yourLastPlay.y !== 1)) {
						playChoose({wall: true});
					} else {
						if (!playChoose({corner: true}, {what: "rowAndCol", you: 1})) {
							playChoose({corner: true}, {what: "rowOrCol", you: 1});
						}
					}
				}
				break;
			case 2:
			case 3:
				playChoose();
				break;
			}
		}
	}

	function doMyPlay(x, y) {
		board[x][y] = 2;
		$('[data-ttt-coord-x="' + x + '"][data-ttt-coord-y="' + y + '"]').html('O').removeClass('available').off("click");
		myLastPlay = {x: x, y: y};
	}

	function isTied() {
		if ($('.ticTacToeSquare.available').length === 0) {
			ties++;

			$('.ticTacToeEndGame').html(translations.tie).fadeIn().delay(2000).fadeOut(function () {
				drawBoard();
			});

			return true;
		} else {
			return false;
		}
	}

	function hasWon() {
		var i;

		for (i = 0; i < 3; i++) {
			if ((board[0][i] === board[1][i]) && (board[0][i] === board[2][i]) && (board[0][i] !== null)) {
				return {what: 'row', which: i};
			}
		}

		for (i = 0; i < 3; i++) {
			if ((board[i][0] === board[i][1]) && (board[i][0] === board[i][2]) && (board[i][0] !== null)) {
				return {what: 'col', which: i};
			}
		}

		if (board[1][1] !== null) {
			if ((board[0][0] === board[1][1]) && (board[0][0] === board[2][2])) {
				return {what: 'dia', which: 0};
			} else if ((board[2][0] === board[1][1]) && (board[2][0] === board[0][2])) {
				return {what: 'dia', which: 1};
			}
		}

		return false;
	}

	function onWinning(winningFigure, who) {
		var i;

		$('.ticTacToeSquare').removeClass('available');
		$('.ticTacToeSquare').off("click");

		switch (winningFigure.what) {
		case 'row':
			$('[data-ttt-coord-y="' + winningFigure.which + '"]').addClass('winning');
			break;

		case 'col':
			$('[data-ttt-coord-x="' + winningFigure.which + '"]').addClass('winning');
			break;

		case 'dia':
			if (winningFigure.which === 0) {
				for (i = 0; i < 3; i++) {
					$('[data-ttt-coord-x="' + i + '"][data-ttt-coord-y="' + i + '"]').addClass('winning');
				}
			} else {
				for (i = 0; i < 3; i++) {
					$('[data-ttt-coord-x="' + (2 - i) + '"][data-ttt-coord-y="' + i + '"]').addClass('winning');
				}
			}
			break;
		}

		if (who === 'iwon') {
			victories++;
		} else {
			losses++;
		}

		$('.ticTacToeEndGame').html(translations[who]).fadeIn().delay(2000).fadeOut(function () {
			drawBoard();
		});
	}

	return {
		init: function (containerId, trObject) {
			var key;

			container = $('#' + containerId);

			if (trObject !== undefined) {
				for (key in trObject) {
					if (trObject.hasOwnProperty(key) && translations.hasOwnProperty(key)) {
						translations[key] = trObject[key];
					}
				}
			}

			drawBoard();
		}
	};
}(jQuery));