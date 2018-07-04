const Song = require('../database/song');

module.exports = (io, Spotify, redis) => {
  const rooms = {};
  const timers = {};

  const playNextSong = async (roomID) => {
    const nextSong = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 1);
    if (nextSong.length) {
      redis.zrem(`${roomID}:queue`, nextSong[0]);
      rooms[roomID].Spotify.playSpecific(JSON.parse(nextSong[0]).uri);
      rooms[roomID].skip = 0;
      const result = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);
      io.sockets.in(roomID).emit('queueUpdate', result);
    }
  };

  const setTimer = (roomID, duration, elapsed) => {
    if (timers[roomID]) { clearTimeout(timers[roomID]); }
    timers[roomID] = setTimeout(() => playNextSong(roomID), duration - elapsed);
  };

  io.on('connection', (socket) => {
    socket.on('createRoom', async (roomInfo) => {
      try {
        const roomID = roomInfo.room;
        rooms[roomID] = {};
        socket.join(roomID);
        socket.room = roomID; // eslint-disable-line
        const queue = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);

        const spotifyInfo = await redis.hmgetAsync(roomID, ['accesstoken', 'refreshtoken']);
        rooms[roomID].Spotify = new Spotify(spotifyInfo[0], spotifyInfo[1]);

        const newMember = JSON.stringify(roomInfo.user);
        await redis.zadd(`${roomID}:members`, 0, newMember);

        const allMembers = [];
        const currentMembers = await redis.zrevrangeAsync(`${roomID}:members`, 0, -1, 'withscores');
        allMembers.push(currentMembers);

        io.to(roomID).emit('memberListUpdate', { members: allMembers, queue });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('joinRoom', async (roomInfo) => {
      const roomID = roomInfo.room;

      socket.join(roomID);
      socket.room = roomID; // eslint-disable-line

      const newMember = JSON.stringify(roomInfo.user);
      await redis.zadd(`${roomID}:members`, 0, newMember);

      const allMembers = await redis.zrevrangeAsync(`${roomID}:members`, 0, -1, 'withscores');
      const formattedMembers = [];
      for (let i = 0; i < allMembers.length; i += 2) {
        formattedMembers.push([allMembers[i], allMembers[i + 1]]);
      }

      const queue = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);

      io.sockets.in(roomID).emit('memberListUpdate', { members: formattedMembers, queue });
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
      setTimer(roomID, result.item.duration_ms, result.progress_ms);
    });

    socket.on('queue', async (roomInfo) => {
      const songInfo = roomInfo.song;
      songInfo.clientInfo = { id: socket.id, user: roomInfo.user };
      const roomID = roomInfo.room;
      Song.add(roomID, songInfo);
      redis.zadd(`${roomID}:queue`, 0, JSON.stringify(songInfo));
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

      io.sockets.in(roomID).emit('skip', { skips: rooms[roomID].skip, members: memberLength });
      if (rooms[roomID].skip > Math.floor(memberLength / 2)) {
        playNextSong(roomID);
      }
    });

    socket.on('queueUpvote', async (roomInfo) => {
      const roomID = roomInfo.room;

      const songUser = JSON.stringify(roomInfo.song.clientInfo.user);
      await redis
        .zincrbyAsync(`${roomID}:members`, 1, songUser)
        .catch(console.error);

      const allMembers = await redis.zrevrangeAsync(`${roomID}:members`, 0, -1, 'withscores');
      const formattedMembers = [];
      for (let i = 0; i < allMembers.length; i += 2) {
        formattedMembers.push([allMembers[i], allMembers[i + 1]]);
      }

      await redis
        .zincrbyAsync(`${roomID}:queue`, 1, JSON.stringify(roomInfo.song))
        .catch(console.error);

      const newQueue = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);

      io.sockets.in(roomID).emit('queueUpdate', newQueue);
      io.sockets.in(roomID).emit('memberListUpdate', { members: formattedMembers, newQueue });
    });

    socket.on('queueDownvote', async (roomInfo) => {
      const roomID = roomInfo.room;
      await redis
        .zincrbyAsync(`${roomID}:queue`, -1, JSON.stringify(roomInfo.song))
        .catch(console.error);

      const newQueue = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);

      io.sockets.in(roomID).emit('queueUpdate', newQueue);
    });
  });
};
