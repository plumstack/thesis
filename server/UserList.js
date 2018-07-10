const chunk = require('lodash.chunk');

module.exports = class UserList {
  constructor(roomID) {
    this.roomID = roomID;
    this.RedisKey = `${this.roomID}:UserList`;
  }
  async join(username) {
    await this.Redis.zadd(this.RedisKey, 100, username);
  }
  leave(username) {
    this.Redis.zrem(this.RedisKey, username);
  }
  // vote(username) { return username; }
  async get() {
    const result = await this.Redis.zrevrangeAsync(this.RedisKey, 0, -1);
    return result;
  }
  async getScores() {
    const allScores = await this.Redis.zrevrangeAsync(this.RedisKey, 0, -1, 'withscores');
    const chunked = chunk(allScores, 2);
    return chunked;
  }
  async changePoints(username, points) {
    console.log('Change Points: ', username, 'Points: ', points);
    await this.Redis.zincrbyAsync(this.RedisKey, points, username);
  }
};

