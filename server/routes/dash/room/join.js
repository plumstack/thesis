const express = require('express');
const Room = require('../../../../database/room');

const router = express.Router();

router.post('/', async (req, res) => {
  await Room.join(req.body.roomId, req.body.userName);
  res.send();
});

module.exports = router;
