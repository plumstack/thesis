/* eslint-disable */
module.exports = class Queue {
  constructor(roomID, Spotify, Redis) {
    this.roomID = roomID;
    this.Spotify = Spotify;
    this.Redis = Redis;
  }

  playNext(songID) {}

  downvote(songID) {}

  upvote(songID) {}

  addSong(songID) {}

  get() {}

  songIsUnique() {}
};
