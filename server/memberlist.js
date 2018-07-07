/* eslint-disable */
module.exports = class MembersList {
  constructor(roomID, Redis) {
    this.roomID = roomID;
    this.Redis = Redis;
  }
  async join(username){
    await this.Redis.zadd(`${this.roomID}:memberlist`, 0, username);
  }

  leave(username){}
  upvote(username){}
  downvote(username){}
  async get(){
    const result = await this.Redis.zrevrangeAsync(`${this.roomID}:memberlist`, 0, -1);
    return result;
  }
}

