const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Game = sequelize.define('Game', {
  gameId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  player1: DataTypes.STRING,
  player2: DataTypes.STRING,
  winner: DataTypes.STRING,
  draw: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'completed'
  }
}, {
  timestamps: true 
});

module.exports = Game;
