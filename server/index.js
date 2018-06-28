const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const Spotify = require('../spotify/index.js');

const app = (module.exports = express()); //eslint-disable-line
const io = require('socket.io').listen(8083);

(require('./auth'));
(require('http').Server(app));

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


// ========
// Sockets
// ========

// Temporary room obj for persistent data
// as users come in and out of rooms
// will refactor into cache (Redis) later.
// Upon end of song, should log data to DB.

const rooms = {
  /*
  Example:
  roomName: {
    users: {
      name1: 1,
      name2: -1,
    },
    totalVotes() {
      return Object.keys(this.users).reduce((acc, el) => acc += this.users[el], 0)
    },
    host: 'name1'
  },
  */
};

/* eslint-disable no-param-reassign */
io.sockets.on('connection', (socket) => {
  console.log('zocket connection happened my dudez ID#: ', socket.id);
  socket.on('join room', (data) => {
    console.log('joining room ', data);
    // if room is new:
    if (!rooms[data.room]) {
      rooms[data.room] = {
        users: {},
        totalVotes() {
          return Object.keys(this.users).reduce((acc, el) => acc + this.users[el], 0);
        },
      };
      rooms[data.room].users[data.user] = 0;
      if (data.host) {
        rooms[data.room].host = data.user;
      } else {
        rooms[data.room].host = undefined;
      }
      console.log('New Room Created: ', rooms[data.room]);
    } else {
      rooms[data.room].users[data.user] = 0;
      if (data.host) {
        rooms[data.room].host = data.user;
      }
      console.log('New User in Room: ', data.room, '\n State: ', rooms[data.room]);
      // Having trouble with broadcast.emit, using emit for now:
      io.sockets.in(data.room).emit('newComer', data.user);
    }
    socket.user = data.user; //eslint-disable-line
    socket.tempRoom = data.room; //eslint-disable-line
    socket.join(data.room);
  });
  socket.on('get count', (roomNum) => {
    console.log('Socket get count for room: ', roomNum);
    const votes = rooms[roomNum].totalVotes();
    io.sockets.in(roomNum).emit('voteUpdate', { vote: votes });
  });
  socket.on('vote', (vote) => {
    rooms[vote.room].users[vote.user] = 1;
    const votes = rooms[vote.room].totalVotes();
    console.log('Upvote, state of room: ', rooms[vote.room]);
    // console.log('Total Votes: ', votes);
    io.sockets.in(vote.room).emit('voteUpdate', { vote: votes });
  });
  socket.on('down', (vote) => {
    rooms[vote.room].users[vote.user] = -1;
    const votes = rooms[vote.room].totalVotes();
    console.log('Downvote, state of room: ', rooms[vote.room]);
    // console.log('Total Votes: ', votes);
    io.sockets.in(vote.room).emit('voteUpdate', { vote: votes });
    const totalUsers = Object.keys(rooms[vote.room].users).length;
    if (votes === totalUsers * -1) {
      io.sockets.in(vote.room).emit('weak');

      // Skip Song, not currently working:
      const newSpot = new Spotify();
      newSpot.nextPlayer();
    }
  });
  socket.on('check data', () => {
    console.log(' === Temp Server Data === \n', rooms);
  });
  socket.on('disconnect', () => {
    console.log('Disconnect triggered', socket.tempRoom);
    if (rooms[socket.tempRoom]) {
      delete rooms[socket.tempRoom].users[socket.user];
      console.log('Updated room', rooms[socket.tempRoom]);
    }
  });
});
/* eslint-enable no-param-reassign */

// ========
// End Sockets
// ========

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
