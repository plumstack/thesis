const Queue = require('./queue');
const MemberList = require('./memberlist');

const roomList = {};

class Room {
  constructor(roomID, Spotify, Redis) {
    this.roomID = roomID;
    this.Queue = new Queue(this.roomID, Spotify, Redis);
    this.MemberList = new MemberList(this.roomID, Redis);
    this.hostSessionID = 'TODO';
    this.spotifyInit(Redis, Spotify);
  }

  async updateAll() {
    const newQueue = this.updateQueue();
    const newMemberList = this.updateMemberList();
    return Promise.all([newQueue, newMemberList]);
  }

  async updateQueue() {
    const newQueue = await this.Queue.get();
    return newQueue.map((track) => JSON.parse(track));
  }

  async updateMemberList() {
    const newMemberList = await this.MemberList.get();
    return newMemberList;
  }

  async spotifyInit(Redis, Spotify) {
    const tokens = await Redis.hmgetAsync(this.roomID, ['accesstoken', 'refreshtoken']);
    const [accesstoken, refreshtoken] = tokens;
    this.Spotify = new Spotify(accesstoken, refreshtoken);
  }
}

module.exports = (io, Spotify, Redis) => { //eslint-disable-line 
  io.on('connection', (socket) => {
    // HOST
    socket.on('createRoom', async (newRoomInfo) => {
      const { roomID, username } = newRoomInfo;

      socket.join(roomID);
      socket.username = username;

      roomList[roomID] = new Room(roomID, Spotify, Redis);
      await roomList[roomID].MemberList.join(username);

      roomList[roomID].updateAll()
        .then(([newQueue, newMemberList]) => socket.emit('updateAll', { newQueue, newMemberList }));
    });

    // socket.on('forceSkip');
    // socket.on('forcePlay');
    // socket.on('forceInfo');

    // MEMBER
    socket.on('joinRoom', (joinedRoomInfo) => {
      const { roomID, username } = joinedRoomInfo;

      socket.join(roomID);
      socket.username = username;

      roomList[roomID].MemberList.join(username);

      roomList[roomID].updateAll()
        .then(([newQueue, newMemberList]) => io.to(roomID).emit('updateAll', { newQueue, newMemberList }));
    });

    socket.on('onQueueSong', async (addedToQueueInfo) => {
      const { roomID, username, songInfo } = addedToQueueInfo;
      if (roomList[roomID].Queue.songIsUnique(songInfo)) {
        songInfo.addedBy = username;

        await roomList[roomID].Queue.addSong(songInfo);

        roomList[roomID].updateQueue()
          .then((newQueue) => io.to(roomID).emit('updateQueue', newQueue));
      }
    });

    socket.on('queueUpvote', async (queueUpvoteInfo) => {
      const { roomID, songInfo } = queueUpvoteInfo;

      await roomList[roomID].Queue.upvote(songInfo);

      roomList[roomID].updateQueue()
        .then((newQueue) => io.to(roomID).emit('updateQueue', newQueue));
    });

    socket.on('queueDownvote', async (queueDownvoteInfo) => {
      const { roomID, songInfo } = queueDownvoteInfo;

      await roomList[roomID].Queue.downvote(songInfo);

      roomList[roomID].updateQueue()
        .then((newQueue) => io.to(roomID).emit('updateQueue', newQueue));
    });

    socket.on('skipVote', async (skipVoteInfo) => {
      const { roomID } = skipVoteInfo;
      await roomList[roomID].skipVote();
    });

    socket.on('songSearch', async (searchSongInfo) => {
      const { roomID, query } = searchSongInfo;
      const result = await roomList[roomID].Spotify.search(query);
      socket.emit('songSearchResponse', result);
    });
    // socket.on('checkUsername');
    // socket.on('reconnect'); // ???
  });
};
