import axios from 'axios';
import moment from 'moment';
import keys from '../../config/keys';
import Users from './user';

export default class Albums {
  static async getRecent(userId, max = 100) {
    let result = [];
    const accessToken = await Users.checkValidToken(userId);
    let url = `${keys.spotifyRoot}/v1/me/albums?limit=50`;

    while (url) {
      const spotifyRes = await axios({
        method: 'get',
        url,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      url = spotifyRes.data.next;
      const nextSet = spotifyRes.data.items.map(Albums.toAlbum);
      result = result.concat(nextSet);
    }

    result = result.sort((x, y) => moment(y.addedAt) - moment(x.addedAt));
    return result.slice(0, max);
  }

  static toAlbum(resAlbum) {
    return {
      id: resAlbum.album.id,
      addedAt: resAlbum.added_at,
      albumType: resAlbum.album.album_type,
      artists: resAlbum.album.artists.map(x => x.name),
      label: resAlbum.album.label,
      name: resAlbum.album.name,
      tracks: resAlbum.album.tracks.items.map(x => ({
        name: x.name,
        id: x.id,
      })),
    };
  }
}
