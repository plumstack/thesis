const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ silent: true });

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log('Successful Connection'))
  .catch(console.error);

const SongSchema = new mongoose.Schema({
  roomid: String,
  members: Array,
});

const Song = mongoose.model('Song', SongSchema);

Song.create = function create(roomId, userName) {
  const newRoom = new Song({
    roomid: roomId,
    members: [userName],
  });

  newRoom.save();
};

module.exports = Song;
