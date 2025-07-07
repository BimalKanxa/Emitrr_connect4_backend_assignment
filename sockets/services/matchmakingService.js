const { v4: uuidv4 } = require('uuid');

const waitingPlayers = [];
const activeGames = new Map();

function addPlayer(socket, username, io) {
  const player = { socket, username, joinedAt: Date.now() };
  console.log(`${username} added to matchmaking queue`);
  if (waitingPlayers.length > 0) {
    const opponent = waitingPlayers.shift();

    const gameId = uuidv4();
    const game = {
      gameId,
      players: [player, opponent],
      board: Array(6).fill().map(() => Array(7).fill(null)),
      currentTurn: player.username,
      isBot: false
    };

    activeGames.set(gameId, game);

    player.socket.join(gameId);
    opponent.socket.join(gameId);

    player.socket.emit('match_found', { gameId, opponent: opponent.username });
    opponent.socket.emit('match_found', { gameId, opponent: player.username });

    io.to(gameId).emit('update_board', {
  board: game.board,
  currentTurn: game.currentTurn
});


    return;
  }

  waitingPlayers.push(player);

  // Start 10s bot timer
  setTimeout(() => {
    const index = waitingPlayers.findIndex(p => p.username === username);
    if (index !== -1) {
      waitingPlayers.splice(index, 1); // Remove from queue

      const bot = { username: 'BOT', socket: null };

      const gameId = uuidv4();
      const game = {
        gameId,
        players: [player, bot],
        board: Array(6).fill().map(() => Array(7).fill(null)),
        currentTurn: player.username,
        isBot: true
      };

      activeGames.set(gameId, game);
      player.socket.join(gameId);
      player.socket.emit('match_found', { gameId, opponent: 'BOT' });
      io.to(gameId).emit('update_board', {
  board: game.board,
  currentTurn: game.currentTurn
});

      // Bot will play automatically after player
    }
  }, 10000);
}

function getGame(gameId) {
  return activeGames.get(gameId);
}

module.exports = {
  addPlayer,
  getGame,
  activeGames
};
