/* eslint-disable */
module.exports = class Queue {
  constructor(roomID, Spotify, Redis) {
    this.roomID = roomID;
    this.Spotify = Spotify;
    this.Redis = Redis;
  }

  playNext(songID) {
  }

  upvote(songID) {}
  
  downvote(songID) {}


  async addSong(songInfo) {
    await this.Redis.zadd(`${this.roomID}:queue`, 0, JSON.stringify(songInfo));
  }

  async get() {
    const result = await this.Redis.zrevrangeAsync(`${this.roomID}:queue`, 0, 10);
    return result;
  }

  songIsUnique(songInfo) {
    return true;
  }
};
