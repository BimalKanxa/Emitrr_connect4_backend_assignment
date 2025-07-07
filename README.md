
# Connect 4 - Backend Starter

This is a starter backend project for a real-time Connect 4 game using Node.js, Express, and Socket.io.

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Setup
1. Clone this repo
2. Create a `.env` file (see example)
3. Run `npm install`
4. Start the server: `npm start`

### Project Structure
- `controllers/`: Game and player controllers
- `models/`: Sequelize models
- `services/`: Game logic, bot logic, matchmaking
- `sockets/`: WebSocket handlers
- `kafka/`: Kafka producers (optional)
- `utils/`: Helpers like win checking
- `config/`: Database config

### Game Features:-

✅ Real-time multiplayer game logic
✅ Player vs Bot fallback with strategic AI
✅ WebSocket communication
✅ PostgreSQL integration
✅ Kafka setup (local)
✅ Game analytics like game id, winner etc.
✅ Frontend UI for gameplay & leaderboard