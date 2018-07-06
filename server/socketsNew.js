const Queue = require('./queue');
const MemberList = require('./memberlist');

const roomList = {};

class Room {
  constructor(roomID, Spotify, Redis) {
    this.roomID = roomID;
    this.Spotify = Redis.hmgetAsync(this.roomID, ['accesstoken', 'refreshtoken'])
      .then((data) => new Spotify(data[0], data[1]));
    this.Queue = new Queue(this.roomID, Spotify, Redis);
    this.MemberList = new MemberList(this.roomID, Redis);
    this.hostSessionID = 'TODO';
  }
}

module.exports = (io, Spotify, Redis) => { //eslint-disable-line 
  io.on('connection', (socket) => {
    // HOST
    socket.on('createRoom', (newRoomInfo) => {
      const { roomID, username } = newRoomInfo;
      roomList[roomID] = new Room(roomID, Spotify, Redis);
      roomList[roomID].MemberList.join(username);

      socket.join(roomID);
      socket.username = username;

      roomList[roomID].updateAll(socket);
    });
    socket.on('forceSkip');
    socket.on('forcePlay');
    socket.on('forceInfo');

    // MEMBER
    socket.on('joinRoom');
    socket.on('queueUpvote');
    socket.on('queueDownvote');
    socket.on('skipVote');
    socket.on('searchSong');
    socket.on('addToQueue');
    socket.on('checkUsername');
    socket.on('reconnect'); // ???
  });
};
