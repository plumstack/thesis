const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const dotenv = require('dotenv');

dotenv.config({ silent: true });

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log('successful connection'))
  .catch(console.error);

const UserSchema = new mongoose.Schema({
  username: String,
  session: String,
  accessToken: String,
  refreshToken: String,
  expiresIn: String,
});
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('SpotifyUser', UserSchema);

User.findOrCreate = function findCreate(info, cb) {
  User.findOne({ username: info.spotifyId }, (err, user) => {
    if (err) return cb(err, null);
    if (!user) {
      const newUser = new User({
        username: info.spotifyId,
        session: '',
        accessToken: info.accessToken,
        refreshToken: info.refreshToken,
        expiresIn: info.expiresIn,
      });

      return newUser.save((error) => {
        if (error) return cb(error, null);
        return cb(null, newUser);
      });
    }
    const updateUser = user;
    updateUser.accessToken = info.accessToken;
    updateUser.refreshToken = info.refreshToken;
    updateUser.expiresIn = info.expiresIn;

    return updateUser.save((error) => {
      if (error) return console.error(error);
      return cb(null, updateUser);
    });
  });
};

User.sessionAdd = (username, session) => {
  User.findOne({ username }, (err, user) => {
    if (err) return console.log(err);
    const newUser = user;
    newUser.session = session;
    return newUser.save((error) => {
      if (error) return console.error(error);
      return { ok: true };
    });
  });
};

User.sessionCheck = async function sessionCheck(session) {
  try {
    const result = await User.findOne({ session });
    return result;
  } catch (error) {
    return console.error(error);
  }
};
module.exports = User;
