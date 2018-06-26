const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ silent: true });

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log('Successful Connection'))
  .catch(console.error);

const RoomSchema = new mongoose.Schema({
  roomid: String,
  members: Array,
});

const Room = mongoose.model('Room', RoomSchema);

Room.create = function create(roomId, userName) {
  const newRoom = new Room({
    roomid: roomId,
    members: [userName],
  });

  newRoom.save();
};

Room.join = async function join(roomId, userName) {
  try {
    await Room.findOneAndUpdate({ roomid: roomId }, { $push: { members: userName } });
    console.log('Success');
    return;
  } catch (err) {
    console.log('Error adding member');
  }
};

module.exports = Room;
