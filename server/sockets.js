const Queue = require('./queue');
const MemberList = require('./memberlist');

const roomList = {};

class Room {
  constructor(roomID, Spotify, Redis) {
    this.roomID = roomID;
    this.Queue = new Queue(this.roomID);
    this.MemberList = new MemberList(this.roomID);
    this.Queue.Redis = Redis;
    this.MemberList.Redis = Redis;
    this.hostSessionID = 'TODO';
    this.Redis = Redis;
    this.SpotifyConstructor = Spotify;
  }

  async updateAll() {
    const newQueue = this.updateQueue();
    const newMemberList = this.updateMemberList();
    const newCurrentlyPlaying = this.updateCurrentlyPlaying();
    return Promise.all([newQueue, newMemberList, newCurrentlyPlaying]);
  }

  async updateQueue() {
    const newQueue = await this.Queue.get();
    return newQueue.map((track) => JSON.parse(track));
  }

  async updateMemberList() {
    const newMemberList = await this.MemberList.get();
    return newMemberList;
  }

  async updateCurrentlyPlaying() {
    if (!this.Spotify) await this.spotifyInit();
    const currentlyPlaying = await this.Spotify.getPlayerInfo();
    return currentlyPlaying;
  }

  async spotifyInit() {
    const tokens = await this.Redis.hmgetAsync(this.roomID, ['accesstoken', 'refreshtoken']);
    const [accesstoken, refreshtoken] = tokens;
    this.Spotify = new this.SpotifyConstructor(accesstoken, refreshtoken);
    this.Queue.Spotify = this.Spotify;
    this.currentlyPlaying = this.Spotify.getPlayerInfo();
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
        .then(([newQueue, newMemberList, currentlyPlaying]) =>
          socket.emit('updateAll', { newQueue, newMemberList, currentlyPlaying }));
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
        .then(([newQueue, newMemberList, currentlyPlaying]) =>
          io.to(roomID).emit('updateAll', { newQueue, newMemberList, currentlyPlaying }));
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

    socket.on('queueVote', async (queueVoteInfo) => {
      const { roomID, songInfo, vote } = queueVoteInfo;

      await roomList[roomID].Queue.vote(songInfo, vote);
      roomList[roomID].updateQueue()
        .then((newQueue) => io.to(roomID).emit('updateQueue', newQueue));
    });

    socket.on('skipVote', async (skipVoteInfo) => {
      const { roomID, memberCount } = skipVoteInfo;
      const skipVotes = await roomList[roomID].Queue.skipVote();
      if (skipVotes >= memberCount * 0.6) await roomList[roomID].Queue.playNext();

      roomList[roomID].updateAll()
        .then(([newQueue, newMemberList, currentlyPlaying]) =>
          io.to(roomID).emit('updateAll', {
            newQueue,
            newMemberList,
            currentlyPlaying,
            skipVotes,
          }));
    });

    socket.on('songSearch', async (searchSongInfo) => {
      const { roomID, query } = searchSongInfo;
      const result = await roomList[roomID].Spotify.search(query);
      socket.emit('songSearchResponse', result);
    });

    socket.on('getInfo', async (roomInfo) => {
      const { roomID } = roomInfo;

      roomList[roomID].updateAll()
        .then(([newQueue, newMemberList, currentlyPlaying]) =>
          io.to(roomID).emit('updateAll', { newQueue, newMemberList, currentlyPlaying }));
    });
    // socket.on('checkUsername');
    // socket.on('reconnect'); // ???
  });
};
