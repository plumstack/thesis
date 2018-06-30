module.exports = (io, Spotify) => {
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

  io.sockets.on('connection', (socket) => {
    socket.on('join room', (data) => {
      console.log('joining room ', data);
      // if room is new:
      if (!rooms[data.room]) {
        rooms[data.room] = {
          users: {},
          totalVotes() {
            return Object.keys(this.users).reduce((acc, el) => acc + this.users[el], 0);
          },
          Spotify: new Spotify(),
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
      console.log(socket);
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
};
