const dotenv = require('dotenv');
const request = require('request-promise-native');

dotenv.config({ silent: true });

class Spotify {
  constructor() {
    this.key = process.env.SPOTIFY_ID;
    this.secret = process.env.SPOTIFY_SECRET;
    this.oauth = 'BQAdYXq7ey3a1BKKMhwRfE-TbU7_WBkYib-d9YA53TzSm2aYrJN1CdkXDSgggr-wPj5Y-LwNDhm1bKV6uGDgpTACZH_OzX0pgm4GcDAzV-4uM42gRDrRqUiCZcse_t9UwBABs8XZX6OZiSkcXV92iZOREKjyDAvdnkYB8OewCn1_Z_BfLQs';
    this.spotifyurl = 'https://api.spotify.com/v1/me/player';
    this.auth_token = '';
    this.refresh_token = '';
    this.success = { ok: true };
    this.failure = { ok: false };
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.oauth}`,
    };
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

  async modifyPlayer(mod) {
    const reqMethod = {
      play: 'PUT',
      pause: 'PUT',
      next: 'POST',
      previous: 'POST',
    };

    const options = {
      method: reqMethod[mod],
      url: `${this.spotifyurl}/${mod}`,
      headers: this.headers,
    };
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
      url: `${this.spotifyurl}/?market=ES`,
      headers: this.headers,
    };

    const playerInfoData = await request(options).catch(console.error);
    const data = playerInfoData ? JSON.parse(playerInfoData) : null;
    const playerInfo = data
      ? {
          ok: true,
          title: data.item.name,
          albumTitle: data.item.album.name,
          albumArt: data.item.album.images[0].url,
          artist: data.item.artists[0].name,
          artistFeature: data.item.artists.slice(1).map((item) => item.name),
          device: data.device.name,
          url: data.context.href,
          shuffle: data.shuffle_state,
        }
      : null;
    if (playerInfo) return playerInfo;
    return this.failure;
  }
}

module.exports = Spotify;
