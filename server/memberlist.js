/* eslint-disable */
module.exports = class MembersList {
  constructor(roomID, Redis) {
    this.roomID = roomID;
    this.Redis = Redis;
  }
  join(username){}
  leave(username){}
  upvote(username){}
  downvote(username){}
  getSorted(){}
}

