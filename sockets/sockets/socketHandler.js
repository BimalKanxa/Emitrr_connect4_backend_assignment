const { addPlayer, getGame, activeGames } = require('../services/matchmakingService');
const { checkWinner } = require('../utils/winChecker');
const botService = require('../services/botService');
const Game = require('../models/Game');
const { sendGameEvent } = require('../services/kafkaProducer');



const disconnectedPlayers = {};

function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join_game', ({ username }) => {
            console.log(`${username} joined`);
            addPlayer(socket, username, io);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);

            for (const [gameId, game] of activeGames.entries()) {
                const player = game.players.find(p => p.socket?.id === socket.id);
                if (!player) continue;

                disconnectedPlayers[player.username] = {
                    gameId,
                    timeout: setTimeout(() => {
                        const opponent = game.players.find(p => p.username !== player.username);
                        io.to(gameId).emit('game_result', {
                            winner: opponent.username === 'BOT' ? 'BOT' : opponent.username,
                            reason: 'opponent disconnected'
                        });
                        activeGames.delete(gameId);
                        delete disconnectedPlayers[player.username];
                    }, 15000)
                };

                console.log(`Waiting 15s for ${player.username} to reconnect...`);
                break;
            }
        });

        socket.on('make_move', async ({ gameId, username, column }) => {
            const game = getGame(gameId);
            if (!game) return;


            if (game.currentTurn !== username) return;

            const symbol = game.players[0].username === username ? 'X' : 'O';
            const row = findAvailableRow(game.board, column);
            if (row === -1) return; // column full

            game.board[row][column] = symbol;

          

            if (checkWinner(game.board, row, column, symbol)) {
  console.log('Saving game to DB:', {
    gameId,
    winner: username,
    player1: game.players[0].username,
    player2: game.players[1].username
  });

  try {
    await Game.create({
      gameId,
      player1: game.players[0].username,
      player2: game.players[1].username,
      winner: username
    });

    await sendGameEvent("game_ended", {
      gameId,
      winner: username,
      player1: game.players[0].username,
      player2: game.players[1].username
    });

  } catch (err) {
    console.error("❌ DB insert failed:", err);
  }

  io.to(gameId).emit('game_result', {
    winner: username,
    board: game.board
  });

  activeGames.delete(gameId);
  return;
}


            // Check for draw
            const isDraw = game.board.every(r => r.every(cell => cell !== null));
        
            if (isDraw) {
  try {
    await Game.create({
      gameId,
      player1: game.players[0].username,
      player2: game.players[1].username,
      winner: null
    });

    await sendGameEvent("game_draw", {
      gameId,
      player1: game.players[0].username,
      player2: game.players[1].username,
      winner: null
    });

  } catch (error) {
    console.log("❌ Error saving draw:", error);
  }

  io.to(gameId).emit('game_result', {
    winner: null,
    board: game.board,
    draw: true
  });

  activeGames.delete(gameId);
  return;
}


            // Switch turn
            const nextPlayer = game.players.find(p => p.username !== username).username;
            game.currentTurn = nextPlayer;

            io.to(gameId).emit('update_board', {
                board: game.board,
                currentTurn: nextPlayer
            });

            // If it's bot's turn
            if (game.isBot && nextPlayer === 'BOT') {
                setTimeout(() => {
                    require('../services/botService').botPlay(gameId, io);
                }, 500);
            }
        });
    });
}

function findAvailableRow(board, column) {
    for (let row = 5; row >= 0; row--) {
        if (board[row][column] === null) {
            return row;
        }
    }
    return -1;
}

module.exports = { setupSocketHandlers };
