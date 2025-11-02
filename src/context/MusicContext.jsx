import React, { createContext, useState, useEffect } from 'react';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [userSongs, setUserSongs] = useState([]); // NOUVEAU: Tes musiques uploadées

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('musicHub-favorites');
    const savedPlaylists = localStorage.getItem('musicHub-playlists');
    const savedUserSongs = localStorage.getItem('musicHub-userSongs'); // NOUVEAU
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    if (savedUserSongs) setUserSongs(JSON.parse(savedUserSongs)); // NOUVEAU
  }, []);

  // Sauvegarder les données dans localStorage
  useEffect(() => {
    localStorage.setItem('musicHub-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('musicHub-playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('musicHub-userSongs', JSON.stringify(userSongs)); // NOUVEAU
  }, [userSongs]);

  // NOUVEAU: Fonction pour ajouter une musique uploadée
  const addUserSong = (file, title, artist, genre = "Personnalisé") => {
    const audioUrl = URL.createObjectURL(file);
    
    const newSong = {
      id: Date.now(),
      title: title || file.name.replace(/\.[^/.]+$/, ""), // Enlève l'extension
      artist: artist || "Artiste inconnu",
      duration: "0:00", // Tu peux calculer ça plus tard
      cover: "🎵",
      audioUrl: audioUrl,
      genre: genre,
      popularity: 0,
      isUserUploaded: true // Pour identifier les musiques uploadées
    };

    setUserSongs(prev => [...prev, newSong]);
    return newSong;
  };

  // NOUVEAU: Fonction pour supprimer une musique uploadée
  const removeUserSong = (songId) => {
    setUserSongs(prev => prev.filter(song => {
      if (song.id === songId && song.isUserUploaded) {
        // Libérer l'URL de l'audio
        if (song.audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(song.audioUrl);
        }
        return false;
      }
      return true;
    }));
  };

  const toggleFavorite = (songId) => {
    setFavorites(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
      createdAt: new Date().toISOString()
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const addToPlaylist = (playlistId, songId) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, songs: [...playlist.songs, songId] }
          : playlist
      )
    );
  };

  const value = {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    progress,
    setProgress,
    favorites,
    toggleFavorite,
    playlists,
    createPlaylist,
    addToPlaylist,
    userSongs, // NOUVEAU
    addUserSong, // NOUVEAU
    removeUserSong // NOUVEAU
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};