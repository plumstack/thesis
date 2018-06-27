const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const app = (module.exports = express());
const http = require('http').Server(app);
const io = require('socket.io').listen(8083);

//eslint-disable-line
(require('./auth'));

// router
const spotifyNext = require('./routes/spotify/player/next');
const spotifyPrev = require('./routes/spotify/player/prev');
const spotifyPlay = require('./routes/spotify/player/play');
const spotifyPause = require('./routes/spotify/player/pause');
const spotifyPlayerInfo = require('./routes/spotify/player/info');

const roomCreate = require('./routes/dash/room/create');
const roomJoin = require('./routes/dash/room/join');
const roomInfo = require('./routes/dash/room/info');

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


// ========
// Sockets
// ========

// Temporary room obj for persistent data
// as users come in and out of rooms
// will refactor into db later:.
// User[username]: vote 1 = up, -1 = down
const rooms = {
  // Example:
  roomName: {
    users: {
      name1: 1,
      name2: -1,
    },
    totalVotes() {
      const total = 0;
      for (const user in this.users) {
        total += this.users[user];
      }
      return total;
    },
  },
};


io.sockets.on('connection', (socket) => {
  console.log('A socket connection happened my dude');
  socket.on('join room', (data) => {
    console.log('joining room ', data.room, 'user: ', data.user);

    // if room is new:
    if (!rooms[data.room]) {
      rooms[data.room] = {
        users: {},
        totalVotes() {
          let total = 0;
          // eslint-disable-next-line
          for (const user in this.users) {
            total += this.users[user];
            console.log('Calculating new tot: ', total);
          }
          return total;
        },
      };
      rooms[data.room].users[data.user] = 0;
      console.log('New Room Created: ', rooms[data.room]);
    } else {
      rooms[data.room].users[data.user] = 0;
      console.log('New User in Room: ', rooms[data.room]);
      socket.room = data.room;
      // Having trouble with broadcast.emit, using emit for now:
      io.sockets.in(socket.room).emit('newComer', data.user);
    }
    socket.room = data.room;
    socket.join(data.room);
  });
  socket.on('get count', (roomNum) => {
    console.log('Socket get count for room: ', roomNum);
    socket.room = roomNum;
    const votes = rooms[roomNum].totalVotes();
    io.sockets.in(socket.room).emit('voteUpdate', { vote: votes });
  });
  socket.on('vote', (vote) => {
    rooms[vote.room].users[vote.user] = 1;
    socket.room = vote.room;
    const votes = rooms[vote.room].totalVotes();
    console.log('Upvote, state of room: ', rooms[vote.room]);
    io.sockets.in(socket.room).emit('voteUpdate', { vote: votes });
  });
  socket.on('down', (vote) => {
    rooms[vote.room].users[vote.user] = -1;
    socket.room = vote.room;
    const votes = rooms[vote.room].totalVotes();
    console.log('Downvote, state of room: ', rooms[vote.room]);
    io.sockets.in(socket.room).emit('voteUpdate', { vote: votes });
    const totalUsers = Object.keys(rooms[vote.room].users).length;
    if (votes === totalUsers * -1) {
      io.sockets.in(socket.room).emit('weak');
    }
  });
});

// ========
// End Sockets
// ========

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
