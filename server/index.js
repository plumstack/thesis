const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const methodOverride = require('method-override');
const	session = require('express-session');
const swig = require('swig');
const consolidate = require('consolidate');
const SpotifyStrategy = require('../lib/passport-spotify/index').Strategy;


// router
const spotifyNext = require('./routes/spotify/player/next');
const spotifyPrev = require('./routes/spotify/player/prev');
const spotifyPlay = require('./routes/spotify/player/play');
const spotifyPause = require('./routes/spotify/player/pause');
const spotifyPlayerInfo = require('./routes/spotify/player/info');

dotenv.config({ silent: true });

const app = express();
const port = process.env.PORT || 8082;

app.use((req, _res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});


app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());


app.use('/spotify/player/next', spotifyNext);
app.use('/spotify/player/prev', spotifyPrev);
app.use('/spotify/player/play', spotifyPlay);
app.use('/spotify/player/pause', spotifyPause);
app.use('/spotify/player/info', spotifyPlayerInfo);


// =============
// AUTH
// ============

const appKey = '4a86fb700d44486f9be0320ef79ea53b';
const appSecret = 'c74e086282a44f3295c65041d229539c';

app.use(passport.initialize());
app.use(passport.session());


passport.use(new SpotifyStrategy(
  {
    clientID: appKey,
    clientSecret: appSecret,
    callbackURL: 'http://localhost:3000/callback',
  },
  ((_accessToken, _refreshToken, expires_in, profile, done) => {
    process.nextTick(() =>
      // Right now, the user's spotify profile is returned to
      // represent the logged-in user. In the future, we'll want to
      // associate the account with a user record in the database instead.
      done(null, profile));
  }),
));

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
app.get('/auth/spotify',
  passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'], showDialog: true }),
  (req, res) => {
    console.log('app get auth spot', req);
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  },
);

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the request.
app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => {
    // Send user to dashboard (new room, join room, history, etc)
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

