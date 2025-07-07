
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { setupSocketHandlers } = require('./sockets/sockets/socketHandler');
const leaderboardRouter = require('./sockets/controllers/leaderboard');
const Game = require('./sockets/models/Game');
const sequelize = require('./sockets/config/sequelize');

const { initKafka } = require('./sockets/services/kafkaProducer');
initKafka();

// const PORT = process.env.PORT || 4000;

 

// sequelize.sync();
sequelize.sync() 
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: { 
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupSocketHandlers(io);
app.use('/api', leaderboardRouter);

app.get('/', (req, res) => {
  res.send('Connect 4 backend running...');
});


sequelize.authenticate()
  .then(() => console.log("✅ Connected to Postgres"))
  .catch(err => console.error("❌ DB connection failed:", err));
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
