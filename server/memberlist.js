module.exports = class MembersList {
  constructor(roomID) {
    this.roomID = roomID;
  }
  async join(username) {
    await this.Redis.zadd(`${this.roomID}:memberlist`, 0, username);
  }
  // leave(username) { return username; }
  // vote(username) { return username; }
  async get() {
    const result = await this.Redis.zrevrangeAsync(`${this.roomID}:memberlist`, 0, -1);
    return result;
  }
};

