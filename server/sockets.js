const Song = require('../database/song');
const chunk = require('lodash.chunk');

module.exports = (io, Spotify, redis) => {
  const rooms = {};
  const timers = {};


  const getScores = async (roomID) => {
    const allMembers = await redis.zrevrangeAsync(`${roomID}:members`, 0, -1, 'withscores');
    const chunked = chunk(allMembers, 2);
    return chunked;
  };

  const getMembers = async (roomID) => redis.zrevrangeAsync(`${roomID}:members`, 0, -1);

  const changePoints = async (roomID, username, points) => {
    await redis
      .zincrbyAsync(`${roomID}:members`, points, username)
      .catch(console.error);
  };

  const updateQueue = async (roomID) => {
    const result = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);
    io.sockets.in(roomID).emit('queueUpdate', result);
  };

  const moveSongQueue = async (roomID, song, amount) => {
    await redis
      .zincrbyAsync(`${roomID}:queue`, amount, JSON.stringify(song))
      .catch(console.error);
  };

  const playNextSong = async (roomID) => {
    const nextSong = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 1);
    if (nextSong.length) {
      // Points:
      const selector = nextSong.clientInfo.user;
      console.log(selector);
      const award = await getMembers(roomID).length * 10;
      console.log(award);
      await changePoints(roomID, selector, award);
      await getScores(roomID);

      // Queue Update:
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
        socket.username = roomInfo.user; // eslint-disable-line
        const queue = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);

        const spotifyInfo = await redis.hmgetAsync(roomID, ['accesstoken', 'refreshtoken']);
        rooms[roomID].Spotify = new Spotify(spotifyInfo[0], spotifyInfo[1]);

        const newMember = JSON.stringify(roomInfo.user);
        await redis.zadd(`${roomID}:members`, 100, newMember);
        const allMembers = await getScores(roomID);

        io.to(roomID).emit('memberListUpdate', { members: allMembers, queue });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('joinRoom', async (roomInfo) => {
      const roomID = roomInfo.room;
      socket.join(roomID);
      socket.room = roomID; // eslint-disable-line
      socket.username = roomInfo.user; // eslint-disable-line

      const queue = await redis.zrevrangeAsync(`${roomID}:queue`, 0, 10);

      const newMember = JSON.stringify(roomInfo.user);
      await redis.zadd(`${roomID}:members`, 100, newMember);

      const allMembers = await getScores(roomID);

      io.sockets.in(roomID).emit('memberListUpdate', { members: allMembers, queue });
    });

    socket.on('disconnect', async () => {
      if (!socket.room) return;

      const roomID = socket.room;

      socket.leave(roomID);

      const removedUser = JSON.stringify(socket.username);
      await redis.zremAsync(`${roomID}:members`, removedUser);

      const allMembers = await getScores(roomID);

      io.sockets.in(roomID).emit('memberListUpdate', { members: allMembers });
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
      await updateQueue(roomID);
    });

    socket.on('getQueue', async (roomInfo) => {
      const roomID = roomInfo.room;
      await updateQueue(roomID);
    });

    socket.on('skipVote', async (roomInfo) => {
      const roomID = roomInfo.room;
      const currentMembers = await redis.zrevrangeAsync(`${roomID}:members`, 0, -1);
      const memberLength = currentMembers.length;

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
      const currentMembers = await getMembers(roomID);
      const inRoom = currentMembers.indexOf(songUser);

      if (inRoom > -1) {
        await changePoints(roomID, songUser, 10);
      }

      const allScores = await getScores(roomID);
      io.sockets.in(roomID).emit('memberListUpdate', { members: allScores });

      await moveSongQueue(roomID, roomInfo.song, 1);
      await updateQueue(roomID);
    });

    socket.on('queueDownvote', async (roomInfo) => {
      const roomID = roomInfo.room;
      const songUser = JSON.stringify(roomInfo.song.clientInfo.user);
      const currentMembers = await getMembers(roomID);
      const inRoom = currentMembers.indexOf(songUser);

      if (inRoom > -1) {
        await changePoints(roomID, songUser, -10);
      }
      const allScores = await getScores(roomID);
      io.sockets.in(roomID).emit('memberListUpdate', { members: allScores });

      await moveSongQueue(roomID, roomInfo.song, -1);
      await updateQueue(roomID);
    });
  });
};
