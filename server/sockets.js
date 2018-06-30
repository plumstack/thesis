const Tock = require('tocktimer');

module.exports = (io, Spotify, redis) => {
  const rooms = {};
  const timers = {};

  const playNextSong = async (roomID) => {
    const nextSong = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 1);
    redis.zrem(`${roomID}:queue`, nextSong[0]);
    rooms[roomID].Spotify.playSpecific(JSON.parse(nextSong[0]).uri);
    rooms[roomID].skip = 0;
    const result = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);
    io.sockets.in(roomID).emit('queueUpdate', result);
  };

  const setTimer = (roomId, duration, elapsed) => {
    timers[roomId] = new Tock({
      countdown: true,
      complete: () => {
        playNextSong(roomId);
      },
    });
    timers[roomId].start(duration - elapsed - 500);
  };

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
      setTimer(roomID, result.item.duration_ms, result.progress_ms, redis);
    });

    socket.on('queue', async (roomInfo) => {
      const roomID = roomInfo.room;
      redis.zadd(`${roomID}:queue`, 0, JSON.stringify(roomInfo.song));
      const result = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);
      io.sockets.in(roomID).emit('queueUpdate', result);
    });

    socket.on('getQueue', async (roomInfo) => {
      const roomID = roomInfo.room;
      const result = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);
      io.sockets.in(roomID).emit('queueUpdate', result);
    });

    socket.on('skipVote', async (roomInfo) => {
      const roomID = roomInfo.room;
      const currentMembers = await redis.getAsync(`${roomID}:members`);
      const memberLength = Object.keys(JSON.parse(currentMembers)).length;

      if (rooms[roomID].skip) rooms[roomID].skip += 1;
      else rooms[roomID].skip = 1;

      if (rooms[roomID].skip >= Math.floor(memberLength / 2)) {
        playNextSong(roomID);
      }
    });

    socket.on('queueUpvote', async (roomInfo) => {
      const roomID = roomInfo.room;
      await redis
        .zincrbyAsync(`${roomID}:queue`, 1, JSON.stringify(roomInfo.song))
        .catch(console.error);

      const newQueue = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);

      io.sockets.in(roomID).emit('queueUpdate', newQueue);
    });
  });
};
