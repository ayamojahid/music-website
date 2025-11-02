import axios from 'axios';

const DEEZER_API_BASE = 'https://api.deezer.com';

export const deezerApi = {
  // Recherche de musique
  search: async (query, limit = 25) => {
    try {
      const response = await axios.get(`${DEEZER_API_BASE}/search`, {
        params: {
          q: query,
          limit,
        },
      });
      return response.data.data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        artistId: track.artist.id,
        album: track.album.title,
        albumId: track.album.id,
        duration: track.duration,
        preview: track.preview,
        cover: track.album.cover_medium || track.album.cover,
        coverSmall: track.album.cover_small,
        coverLarge: track.album.cover_big || track.album.cover_large,
        link: track.link,
      }));
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  },

  // Obtenir les charts (top tracks)
  getCharts: async (limit = 50) => {
    try {
      const response = await axios.get(`${DEEZER_API_BASE}/chart/0/tracks`, {
        params: { limit },
      });
      return response.data.data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        artistId: track.artist.id,
        album: track.album.title,
        albumId: track.album.id,
        duration: track.duration,
        preview: track.preview,
        cover: track.album.cover_medium || track.album.cover,
        coverSmall: track.album.cover_small,
        coverLarge: track.album.cover_big || track.album.cover_large,
        link: track.link,
      }));
    } catch (error) {
      console.error('Error fetching charts:', error);
      return [];
    }
  },

  // Obtenir les artistes populaires
  getTopArtists: async (limit = 20) => {
    try {
      const response = await axios.get(`${DEEZER_API_BASE}/chart/0/artists`, {
        params: { limit },
      });
      return response.data.data.map(artist => ({
        id: artist.id,
        name: artist.name,
        picture: artist.picture_medium || artist.picture,
        pictureSmall: artist.picture_small,
        pictureLarge: artist.picture_big || artist.picture_xl,
        link: artist.link,
      }));
    } catch (error) {
      console.error('Error fetching top artists:', error);
      return [];
    }
  },

  // Obtenir les albums populaires
  getTopAlbums: async (limit = 20) => {
    try {
      const response = await axios.get(`${DEEZER_API_BASE}/chart/0/albums`, {
        params: { limit },
      });
      return response.data.data.map(album => ({
        id: album.id,
        title: album.title,
        artist: album.artist.name,
        cover: album.cover_medium || album.cover,
        coverSmall: album.cover_small,
        coverLarge: album.cover_big || album.cover_xl,
        link: album.link,
      }));
    } catch (error) {
      console.error('Error fetching top albums:', error);
      return [];
    }
  },

  // Obtenir les genres
  getGenres: async () => {
    try {
      const response = await axios.get(`${DEEZER_API_BASE}/genre`);
      return response.data.data.map(genre => ({
        id: genre.id,
        name: genre.name,
        picture: genre.picture_medium || genre.picture,
      }));
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  },

  // Obtenir les tracks par genre
  getTracksByGenre: async (genreId, limit = 25) => {
    try {
      const response = await axios.get(`${DEEZER_API_BASE}/genre/${genreId}/tracks`, {
        params: { limit },
      });
      return response.data.data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        artistId: track.artist.id,
        album: track.album.title,
        albumId: track.album.id,
        duration: track.duration,
        preview: track.preview,
        cover: track.album.cover_medium || track.album.cover,
        coverSmall: track.album.cover_small,
        coverLarge: track.album.cover_big || track.album.cover_large,
        link: track.link,
      }));
    } catch (error) {
      console.error('Error fetching tracks by genre:', error);
      return [];
    }
  },

  // Obtenir les tracks d'un artiste
  getArtistTracks: async (artistId, limit = 25) => {
    try {
      const response = await axios.get(`${DEEZER_API_BASE}/artist/${artistId}/top`, {
        params: { limit },
      });
      return response.data.data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        artistId: track.artist.id,
        album: track.album.title,
        albumId: track.album.id,
        duration: track.duration,
        preview: track.preview,
        cover: track.album.cover_medium || track.album.cover,
        coverSmall: track.album.cover_small,
        coverLarge: track.album.cover_big || track.album.cover_large,
        link: track.link,
      }));
    } catch (error) {
      console.error('Error fetching artist tracks:', error);
      return [];
    }
  },
};

