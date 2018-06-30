module.exports = (io, Spotify, redis) => {
  const rooms = {};

  io.on('connection', (socket) => {
    socket.on('createRoom', async (roomInfo) => {
      try {
        const roomID = roomInfo.room;
        rooms[roomID] = {};
        socket.join(roomID);
        socket.room = roomID; // eslint-disable-line

        const spotifyInfo = await redis.hmgetAsync(roomID, ['accesstoken', 'refreshtoken']);
        rooms[roomID].Spotify = new Spotify(spotifyInfo[0], spotifyInfo[1]);
        const membersSetup = {};
        membersSetup[socket.id] = roomInfo.user;
        io.to(roomID).emit('memberListUpdate', membersSetup);
        redis.set(`${roomID}:members`, JSON.stringify(membersSetup));
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('joinRoom', async (roomInfo) => {
      const roomID = roomInfo.room;

      socket.join(roomID);
      socket.room = roomID; // eslint-disable-line

      const currentMembers = await redis.getAsync(`${roomID}:members`);

      const newMembers = JSON.parse(currentMembers);
      newMembers[socket.id] = roomInfo.user;

      io.sockets.in(roomID).emit('memberListUpdate', newMembers);
      redis.setAsync(`${roomID}:members`, JSON.stringify(newMembers));
    });

    socket.on('disconnect', async () => {
      if (!socket.room) return;

      const roomID = socket.room;
      const currentMembers = await redis.getAsync(`${roomID}:members`);
      const newMembers = JSON.parse(currentMembers);

      socket.leave(roomID);
      delete newMembers[socket.id];

      io.sockets.in(roomID).emit('memberListUpdate', newMembers);

      redis.setAsync(`${roomID}:members`, JSON.stringify(newMembers));
    });

    socket.on('searchInput', async (searchInfo) => {
      const result = await rooms[searchInfo.room].Spotify.search(searchInfo.search);
      socket.emit('searchResponse', result);
    });

    socket.on('getInfo', async () => {
      const roomID = socket.room;
      const result = await rooms[roomID].Spotify.getPlayerInfo();
      io.sockets.in(roomID).emit('infoResponse', result);
    });

    socket.on('queue', async (roomInfo) => {
      const roomID = roomInfo.room;
      redis.zadd(`${roomID}:queue`, 0, JSON.stringify(roomInfo.song));

      const result = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);

      io.sockets.in(roomID).emit('queueUpdate', result);
    });
  });
};
