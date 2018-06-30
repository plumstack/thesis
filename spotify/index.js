const dotenv = require('dotenv');
const request = require('request-promise-native');
const btoa = require('btoa');

dotenv.config({ silent: true });

class Spotify {
  constructor(oauth, refresh) {
    this.key = process.env.SPOTIFY_ID;
    this.secret = process.env.SPOTIFY_SECRET;
    this.oauth = oauth;
    this.spotifyurl = 'https://api.spotify.com/v1';
    this.refresh_token = refresh;
    this.success = { ok: true };
    this.failure = { ok: false };
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.oauth}`,
    };
    // this.getUserInfo().then(() => this.newPlaylist());
  }

  async refreshToken() {
    const encode = btoa(`${this.key}:${this.secret}`);
    const dataString = `?grant_type=refresh_token&refresh_token=${process.env.REFRESH}`;
    const options = {
      method: 'POST',
      url: `https://accounts.spotify.com/api/token${dataString}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encode}`,
      },
      params: dataString,
    };

    try {
      const result = await request(options);
      this.oauth = JSON.parse(result).access_token;
    } catch (error) {
      console.log('ERROR LINE 43');
    }
  }

  playPlayer() {
    return this.modifyPlayer('play');
  }
  pausePlayer() {
    return this.modifyPlayer('pause');
  }

  nextPlayer() {
    return this.modifyPlayer('next');
  }

  prevPlayer() {
    return this.modifyPlayer('previous');
  }

  playSpecific(trackid) {
    return this.modifyPlayer('play', trackid);
  }

  async search(q) {
    const options = {
      method: 'GET',
      url: `${this.spotifyurl}/search`,
      headers: this.headers,
      qs: {
        q,
        type: 'track',
        limit: 5,
      },
    };

    try {
      const result = await request(options);
      return result;
    } catch (error) {
      return console.error('SEARCH ERROR');
    }
  }

  async newPlaylist() {
    const options = {
      method: 'POST',
      url: `${this.spotifyurl}/users/${this.userInfo.id}/playlists`,
      headers: this.headers,
      body: JSON.stringify({
        name: 'party playlist',
        description: 'social night playlist',
        public: true,
      }),
    };

    try {
      const result = await request(options);
      this.playlist = JSON.parse(result);
      return result;
    } catch (error) {
      console.error('MODIFY PLAYER ERROR');
      return this.failure;
    }
  }

  async getUserInfo() {
    const options = {
      method: 'GET',
      url: `${this.spotifyurl}/me`,
      headers: this.headers,
    };

    try {
      const results = await request(options);
      this.userInfo = JSON.parse(results);
      return results;
    } catch (error) {
      console.error('USERINFOERROR');
      return this.failure;
    }
  }

  async modifyPlayer(mod, trackid) {
    const reqMethod = {
      play: 'PUT',
      pause: 'PUT',
      next: 'POST',
      previous: 'POST',
    };

    const options = {
      method: reqMethod[mod],
      url: `${this.spotifyurl}/me/player/${mod}`,
      headers: this.headers,
    };
    if (trackid) options.body = JSON.stringify({ context_uri: trackid });
    try {
      await request(options);
      return this.success;
    } catch (error) {
      console.error(error);
      return this.failure;
    }
  }

  async getPlayerInfo() {
    const options = {
      method: 'GET',
      url: `${this.spotifyurl}/me/player/currently-playing`,
      headers: this.headers,
    };
    try {
      const playerInfoData = await request(options);
      const data = playerInfoData ? JSON.parse(playerInfoData) : null;
      console.log(data);
      return data;
    } catch (error) {
      console.log('error AHHHHH');
      return error;
    }
  }
}
const testSpot = new Spotify();
testSpot.refreshToken();
// setTimeout(() => testSpot.playSpecific('spotify:album:5b3tupDh9sl0Mf9ZjR989N'));
module.exports = Spotify;
