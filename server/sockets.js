module.exports = (io, Spotify, redis) => {
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

  io.on('connection', (socket) => {
    socket.on('createRoom', async (roomInfo) => {
      try {
        const roomID = roomInfo.room;
        rooms[roomID] = {};

        socket.join(roomID);

        const spotifyInfo = await redis.hmgetAsync(roomID, ['accesstoken', 'refreshtoken']);
        rooms[roomID].Spotify = new Spotify(spotifyInfo[0], spotifyInfo[1]);

        const membersSetup = {};
        membersSetup[socket.id] = roomInfo.user;
        socket.emit('memberListUpdate', membersSetup);
        redis.setAsync(`${roomID}:members`, JSON.stringify(membersSetup));
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('joinRoom', async (roomInfo) => {
      const roomID = roomInfo.room;

      socket.join(roomID);

      const currentMembers = await redis.getAsync(`${roomID}:members`);

      const newMembers = JSON.parse(currentMembers);
      newMembers[socket.id] = roomInfo.user;

      io.sockets.in(roomID).emit('memberListUpdate', newMembers);
      redis.setAsync(`${roomID}:members`, JSON.stringify(newMembers));
    });
  });
};
