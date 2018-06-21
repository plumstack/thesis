const express = require('express');

const router = express.Router();

const Spotify = require('../../../../spotify/index.js');

console.log(Spotify);
router.get('/', async (req, res) => {
  const newSpot = new Spotify();
  const result = await newSpot.nextPlayer();
  res.send(result);
});

module.exports = router;
