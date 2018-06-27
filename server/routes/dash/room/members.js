const express = require('express');
const Room = require('../../../../database/room');

const router = express.Router();

router.post('/', async (req, res) => {
  const members = await Room.getMembers(req.body.roomId);
  res.send(members.members);
});

module.exports = router;
