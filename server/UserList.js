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
    const result = await this.Redis.zrevrangeAsync(this.RedisKey, 0, -1, 'withscores');
    return chunk(result, 2);
  }
  async changePoints(username, points) {
    await this.Redis.zincrbyAsync(this.RedisKey, points, username);
  }
};

