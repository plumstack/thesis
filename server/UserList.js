module.exports = class UserList {
  constructor(roomID) {
    this.roomID = roomID;
    this.RedisKey = `${this.roomID}:UserList`;
  }
  join(username) {
    this.Redis.zadd(this.RedisKey, 0, username);
  }
  leave(username) {
    this.Redis.zrem(this.RedisKey, username);
  }
  // vote(username) { return username; }
  async get() {
    const result = await this.Redis.zrevrangeAsync(this.RedisKey, 0, -1);
    return result;
  }
};

