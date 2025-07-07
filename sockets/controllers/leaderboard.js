const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { Sequelize } = require('sequelize');

router.get('/leaderboard', async (req, res) => {
  const data = await Game.findAll({
    attributes: [
      'winner',
      [Sequelize.fn('COUNT', Sequelize.col('winner')), 'wins']
    ],
    group: ['winner'],
    order: [[Sequelize.literal('wins'), 'DESC']],
    limit: 10
  });

  res.json(data);
});

module.exports = router;
