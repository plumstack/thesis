const express = require('express');

const router = express.Router();

const Spotify = require('../../../../spotify/index.js');

router.get('/', async (req, res) => {
  const newSpot = new Spotify();
  const result = await newSpot.playPlayer();
  res.send(result);
});

module.exports = router;
