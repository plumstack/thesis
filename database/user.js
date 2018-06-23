const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  session: String,
  accessToken: String,
  refreshToken: String,
  expiresIn: String,
});
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

User.findOrCreate = function findCreate(info, cb) {
  User.findOne({ username: info.twitterId }, (err, user) => {
    if (err) return cb(err, null);
    if (!user) {
      const newUser = new User({
        username: info.twitterId,
        session: '',
        accessToken: info.accessToken,
        refreshToken: info.refreshToken,
        expiresIn: info.expiresIn,
      });
      return newUser.save((error) => {
        if (err) return cb(error, null);
        return cb(null, newUser);
      });
    }
    return cb(null, user);
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

User.sessionCheck = (session) =>
  new Promise((res, rej) => {
    User.findOne({ session }, (err, user) => {
      if (err) rej(err);
      res(user);
    });
  });
module.exports = User;
