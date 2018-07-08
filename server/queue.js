module.exports = class Queue {
  constructor(roomID) {
    this.roomID = roomID;
    this.skipVotes = 0;
  }

  // playNext(songID) {}

  async vote(songInfo, vote) {
    await this.Redis.zincrbyAsync(`${this.roomID}:queue`, vote, JSON.stringify(songInfo));
  }

  async addSong(songInfo) {
    await this.Redis.zadd(`${this.roomID}:queue`, 0, JSON.stringify(songInfo));
  }

  async get() {
    const result = await this.Redis.zrevrangeAsync(`${this.roomID}:queue`, 0, 10);
    return result;
  }

  songIsUnique(songInfo) { // eslint-disable-line
    return true;
  }
  skipVote() {
    this.skipVotes += 1;
    return this.skipVotes;
  }

  async playNext() {
    const nextSong = await this.Redis.zrevrangeAsync(`${this.roomID}:queue`, 0, 0);
    this.Spotify.playSpecific(JSON.parse(nextSong[0]).uri);
    this.Redis.zremAsync(`${this.roomID}:queue`, nextSong[0]);
  }
};
