const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session');
const dotenv = require('dotenv');
const User = require('../database/user.js');
const app = require('./index');

dotenv.config({ silent: true });

app.use(session({ secret: 'tampa vice', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    callbackURL: 'http://localhost:8082/auth/spotify/callback',
  },
  (accessToken, refreshToken, expiresIn, profile, done) => {
    User.findOrCreate(
      {
        spotifyId: profile.id,
        accessToken,
        refreshToken,
        expiresIn,
      },
      (err, user) => done(err, user),
    );
  },
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/auth/loggedin', (req, res) => {
  if (req.isAuthenticated()) {
    User.sessionCheck(req.sessionID)
      .then((user) => {
        res.send({ loggedIn: true, history: user.history });
      })
      .catch(console.error);
  } else res.send({ loggedIn: false });
});

app.get('/auth/spotify', passport.authenticate('spotify', { scope: ['user-read-email'], showDialog: true }), (req) => req);

app.get(
  '/auth/spotify/callback*',
  passport.authenticate('spotify', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    console.log('---');
    const { user } = req._passport.session; //eslint-disable-line
    User.sessionAdd(user, req.sessionID);
    res.redirect('/');
  },
);
