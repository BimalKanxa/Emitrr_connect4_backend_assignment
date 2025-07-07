const { getGame, activeGames } = require('./matchmakingService');
const { checkWinner } = require('../utils/winChecker');

function botPlay(gameId, io) {
  const game = getGame(gameId);
  if (!game) return;

  const board = game.board;
//   const botSymbol = game.players.find(p => p.username === 'BOT') ? 'O' : 'X';
const botPlayer = game.players.find(p => p.username === 'BOT');
const botSymbol = game.players.indexOf(botPlayer) === 0 ? 'X' : 'O';
const playerSymbol = botSymbol === 'X' ? 'O' : 'X';

//   const playerSymbol = botSymbol === 'X' ? 'O' : 'X';

  const validMoves = getValidColumns(board);

  // 1. Try to win
  for (const col of validMoves) {
    const row = getRow(board, col);
    if (row === -1) continue;

    board[row][col] = botSymbol;
    if (checkWinner(board, row, col, botSymbol)) {
      return finalizeMove(io, game, board, game.players[1].username, row, col);
    }
    board[row][col] = null; // Undo
  }

  // 2. Block opponent's win
  for (const col of validMoves) {
    const row = getRow(board, col);
    if (row === -1) continue;

    board[row][col] = playerSymbol;
    if (checkWinner(board, row, col, playerSymbol)) {
      board[row][col] = botSymbol;
      return finalizeMove(io, game, board, game.players[1].username, row, col);
    }
    board[row][col] = null; // Undo
  }

  // 3. Fallback: play center, then outward
  const preferredCols = [3, 2, 4, 1, 5, 0, 6];
  for (const col of preferredCols) {
    if (validMoves.includes(col)) {
      const row = getRow(board, col);
      board[row][col] = botSymbol;
      return finalizeMove(io, game, board, game.players[1].username, row, col);
    }
  }
}

function finalizeMove(io, game, board, botUsername, row, col) {

    // board[row][col] = botSymbol;

  if (checkWinner(board, row, col, board[row][col])) {
    io.to(game.gameId).emit('game_result', {
      winner: botUsername,
      board
    });
    activeGames.delete(game.gameId);
  } else {
    const isDraw = board.every(r => r.every(cell => cell !== null));
    if (isDraw) {
      io.to(game.gameId).emit('game_result', {
        winner: null,
        board,
        draw: true
      });
      activeGames.delete(game.gameId);
    } else {
      game.currentTurn = game.players[0].username;
      io.to(game.gameId).emit('update_board', {
        board,
        currentTurn: game.currentTurn
      });
    }
  }
}

function getRow(board, col) {
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === null) return row;
  }
  return -1;
}

function getValidColumns(board) {
  return [...Array(7).keys()].filter(col => board[0][col] === null);
}

module.exports = { botPlay };
