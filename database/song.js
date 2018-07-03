const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ silent: true });

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log('Successful Connection'))
  .catch(console.error);

const SongSchema = new mongoose.Schema({
  roomid: String,
  songid: String,
  songtitle: String,
  songartist: String,
  songalbum: String,
  albumurl: String,
  nomsocket: String,
  nomuser: String,
});

const Song = mongoose.model('Song', SongSchema);

Song.add = function create(roomID, songInfo) {
  const newSong = new Song({
    roomid: roomID,
    songid: songInfo.id,
    songtitle: songInfo.name,
    songartist: songInfo.artists[0].name,
    songalbum: songInfo.album.name,
    albumurl: songInfo.album.images[2].url,
    nomsocket: songInfo.clientInfo.id,
    nomuser: songInfo.clientInfo.user,
  });

  newSong.save();
};

Song.fetch = async function fetch(roomID, songID) {
  const res = await Song.findOneAndRemove({
    roomid: roomID,
    songid: songID,
  });
  return res;
};

module.exports = Song;
