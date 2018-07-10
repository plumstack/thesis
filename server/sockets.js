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
    const updatedScores = this.updateScores();

    Promise.all([updatedQueue, updatedUserList, updatedCurrentlyPlaying, updatedScores])
      .then(([newQueue, newUserList, currentlyPlaying, newScores], skipVotes = this.skipVotes) =>
        this.io.to(this.roomID).emit('updateAll', {
          newQueue, newUserList, currentlyPlaying, newScores, skipVotes,
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

  async updateScores() {
    const allScores = await this.UserList.getScores();
    return allScores;
  }

  async updateCurrentlyPlaying() {
    if (!this.Spotify) await this.spotifyInit();
    const currentlyPlaying = await this.Spotify.getPlayerInfo();
    this.setTimer(currentlyPlaying.item.duration_ms, currentlyPlaying.progress_ms);
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
      await roomList[roomID].UserList.changePoints(songInfo.addedBy, vote * 10);

      roomList[roomID].updateAll();
    });

    socket.on('skipVote', async (skipVoteInfo) => {
      const { roomID, userCount } = skipVoteInfo;
      const skipVotes = await roomList[roomID].Queue.skipVote();

      if (skipVotes >= userCount * 0.6) {
        const nextSelector = await roomList[roomID].Queue.playNext();
        const room = await roomList[roomID].UserList.get();
        const roomSize = room.length;
        await roomList[roomID].UserList.changePoints(nextSelector, roomSize * 20);
      }

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

    socket.on('getScores', async (roomInfo) => {
      const { roomID } = roomInfo;
      roomList[roomID].updateScores()
        .then((newScores) => socket.emit('updateScores', newScores));
    });
    // socket.on('checkUsername');
    // socket.on('reconnect'); // ???
  });
};
