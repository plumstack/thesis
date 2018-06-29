const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const redis = require('redis');
const bluebird = require('bluebird');
const Spotify = require('../spotify/index.js');

const app = (module.exports = express()); //eslint-disable-line
const server = require('http').Server(app);
const io = require('socket.io')(server);

bluebird.promisifyAll(redis);
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  auth_pass: process.env.REDIS_PASS,
});

(require('./auth'))(client);
(require('./sockets')(io, Spotify, client));

// router
const spotifyNext = require('./routes/spotify/player/next');
const spotifyPrev = require('./routes/spotify/player/prev');
const spotifyPlay = require('./routes/spotify/player/play');
const spotifyPause = require('./routes/spotify/player/pause');
const spotifyPlayerInfo = require('./routes/spotify/player/info');

const roomCreate = require('./routes/dash/room/create');
const roomJoin = require('./routes/dash/room/join');
const roomInfo = require('./routes/dash/room/info');
const roomMembers = require('./routes/dash/room/members');

dotenv.config({ silent: true });

const port = process.env.PORT || 8082;

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.use((req, res, next) => {
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

app.use('/dash/room/create', roomCreate);
app.use('/dash/room/join', roomJoin);
app.use('/dash/room/info', roomInfo);
app.use('/dash/room/members', roomMembers);

server.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
