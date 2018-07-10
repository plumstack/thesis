const Queue = require('./Queue');
const UserList = require('./UserList');

const roomList = {};

class Room {
  constructor(roomID, Spotify, Redis, io) {
    this.roomID = roomID;
    this.Queue = new Queue(this.roomID);
    this.UserList = new UserList(this.roomID);
    this.Queue.Redis = Redis;
    this.UserList.Redis = Redis;
    this.hostSessionID = 'TODO';
    this.Redis = Redis;
    this.SpotifyConstructor = Spotify;
    this.io = io;
    this.skipVotes = 0;
  }

  async updateAll() {
    const updatedQueue = this.updateQueue();
    const updatedUserList = this.updateUserList();
    const updatedCurrentlyPlaying = this.updateCurrentlyPlaying();

    Promise.all([updatedQueue, updatedUserList, updatedCurrentlyPlaying])
      .then(([newQueue, newUserList, currentlyPlaying], skipVotes = this.skipVotes) =>
        this.io.to(this.roomID).emit('updateAll', {
          newQueue, newUserList, currentlyPlaying, skipVotes,
        }));
  }

  async updateQueue() {
    const newQueue = await this.Queue.get();
    return newQueue.map((track) => JSON.parse(track));
  }

  async updateUserList() {
    const newUserList = await this.UserList.get();
    return newUserList;
  }

  async updateCurrentlyPlaying() {
    if (!this.Spotify) await this.spotifyInit();
    const currentlyPlaying = await this.Spotify.getPlayerInfo();
    if (currentlyPlaying) this.setTimer(currentlyPlaying.item.duration_ms, currentlyPlaying.progress_ms);
    return currentlyPlaying;
  }

  async spotifyInit() {
    const tokens = await this.Redis.hmgetAsync(this.roomID, ['accesstoken', 'refreshtoken']);
    const [accesstoken, refreshtoken] = tokens;
    this.Spotify = new this.SpotifyConstructor(accesstoken, refreshtoken);
    this.Queue.Spotify = this.Spotify;
    this.currentlyPlaying = this.Spotify.getPlayerInfo();
  }

  setTimer(duration, elapsed) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      await this.Queue.playNext();
      setTimeout(this.updateAll.bind(this), 2000);
    }, duration - elapsed);
  }
}

module.exports = (io, Spotify, Redis) => { //eslint-disable-line 
  io.on('connection', (socket) => {
    // HOST
    socket.on('createRoom', async (newRoomInfo) => {
      const { roomID, username } = newRoomInfo;

      socket.join(roomID);
      socket.username = username;
      socket.roomID = roomID;

      roomList[roomID] = new Room(roomID, Spotify, Redis, io);
      await roomList[roomID].UserList.join(username);
      roomList[roomID].updateAll();
    });

    // socket.on('forceSkip');
    // socket.on('forcePlay');
    // socket.on('forceInfo');

    // MEMBER
    socket.on('joinRoom', (joinedRoomInfo) => {
      const { roomID, username } = joinedRoomInfo;

      socket.join(roomID);
      socket.username = username;
      socket.roomID = roomID;

      roomList[roomID].UserList.join(username);

      roomList[roomID].updateAll();
    });

    socket.on('onQueueSong', async (addedToQueueInfo) => {
      const { roomID, username, songInfo } = addedToQueueInfo;
      if (roomList[roomID].Queue.songIsUnique(songInfo)) {
        songInfo.addedBy = username;

        await roomList[roomID].Queue.addSong(songInfo);

        roomList[roomID].updateAll();
      }
    });

    socket.on('queueVote', async (queueVoteInfo) => {
      const { roomID, songInfo, vote } = queueVoteInfo;

      await roomList[roomID].Queue.vote(songInfo, vote);

      roomList[roomID].updateAll();
    });

    socket.on('skipVote', async (skipVoteInfo) => {
      const { roomID, userCount } = skipVoteInfo;
      const skipVotes = await roomList[roomID].Queue.skipVote();

      if (skipVotes >= userCount * 0.6) await roomList[roomID].Queue.playNext();

      roomList[roomID].skipVotes = skipVotes;

      setTimeout(roomList[roomID].updateAll.bind(roomList[roomID]), 2000);
    });

    socket.on('songSearch', async (searchSongInfo) => {
      const { roomID, query } = searchSongInfo;
      const result = await roomList[roomID].Spotify.search(query);
      socket.emit('songSearchResponse', result);
    });

    socket.on('getInfo', async (roomInfo) => {
      const { roomID } = roomInfo;

      roomList[roomID].updateAll();
    });

    socket.on('getUserList', async (roomInfo) => {
      const { roomID } = roomInfo;

      roomList[roomID].updateUserList()
        .then((newUserList) => socket.emit('updateUserList', newUserList));
    });

    socket.on('disconnect', async () => {
      const { roomID } = socket;
      if (roomList[roomID]) {
        roomList[roomID].UserList.leave(socket.username);
        roomList[roomID].updateAll();
      }
    });

    socket.on('reconnect', (roomInfo) => {
      const { roomID } = roomInfo;
      roomList[roomID].updateAll();
    }); // ???
    // socket.on('checkUsername');
  });
};
