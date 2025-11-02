import React, { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Music, Search, Home, Heart, Play, Pause, SkipBack, SkipForward, 
  Volume2, Plus, Upload, X, Repeat, Shuffle, User, 
  ListMusic, Clock, TrendingUp, Mic2, Album, Users,
  MoreHorizontal, Download, Share2, Edit3, Trash2, BarChart3, Sun, Moon,
  LogIn, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import firebaseUtils from './firebase';

// Helper function
const formatPlays = (plays) => {
  if (plays >= 1000000000) return `${(plays / 1000000000).toFixed(1)}B`;
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
  return plays;
};

// Données mock améliorées avec plus de variété
const mockSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    cover: "🌟",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    genre: "Pop",
    popularity: 95,
    album: "After Hours",
    releaseYear: 2020,
    plays: 2850000000,
    bpm: 120,
    explicit: false
  },
  {
    id: 2,
    title: "Save Your Tears",
    artist: "The Weeknd",
    duration: "3:35",
    cover: "💧",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    genre: "Pop",
    popularity: 88,
    album: "After Hours",
    releaseYear: 2020,
    plays: 1800000000,
    bpm: 118,
    explicit: false
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa",
    duration: "3:23",
    cover: "🚀",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    genre: "Pop",
    popularity: 92,
    album: "Future Nostalgia",
    releaseYear: 2020,
    plays: 2200000000,
    bpm: 103,
    explicit: false
  },
  {
    id: 4,
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    duration: "2:21",
    cover: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    genre: "Hip-Hop",
    popularity: 85,
    album: "F*CK LOVE 3",
    releaseYear: 2021,
    plays: 2600000000,
    bpm: 140,
    explicit: true
  },
  {
    id: 5,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    duration: "2:58",
    cover: "🎤",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    genre: "Rock",
    popularity: 90,
    album: "SOUR",
    releaseYear: 2021,
    plays: 1900000000,
    bpm: 166,
    explicit: false
  },
  {
    id: 6,
    title: "Montero",
    artist: "Lil Nas X",
    duration: "2:50",
    cover: "🔥",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    genre: "Hip-Hop",
    popularity: 87,
    album: "Montero",
    releaseYear: 2021,
    plays: 1600000000,
    bpm: 179,
    explicit: true
  },
  {
    id: 7,
    title: "Heat Waves",
    artist: "Glass Animals",
    duration: "3:58",
    cover: "🌊",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    genre: "Electronic",
    popularity: 82,
    album: "Dreamland",
    releaseYear: 2020,
    plays: 2100000000,
    bpm: 81,
    explicit: false
  },
  {
    id: 8,
    title: "Peaches",
    artist: "Justin Bieber",
    duration: "3:18",
    cover: "🍑",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    genre: "R&B",
    popularity: 80,
    album: "Justice",
    releaseYear: 2021,
    plays: 1500000000,
    bpm: 90,
    explicit: false
  },
  {
    id: 9,
    title: "Flowers",
    artist: "Miley Cyrus",
    duration: "3:20",
    cover: "💐",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    genre: "Pop",
    popularity: 94,
    album: "Endless Summer Vacation",
    releaseYear: 2023,
    plays: 1800000000,
    bpm: 118,
    explicit: false
  },
  {
    id: 10,
    title: "Kill Bill",
    artist: "SZA",
    duration: "2:33",
    cover: "🗡️",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    genre: "R&B",
    popularity: 91,
    album: "SOS",
    releaseYear: 2022,
    plays: 1700000000,
    bpm: 87,
    explicit: true
  }
];

const genres = ["All", "Pop", "Hip-Hop", "Rock", "Electronic", "R&B", "Rap Français", "Variété"];
const moods = ["Happy", "Chill", "Energetic", "Romantic", "Focus", "Workout"];

// Context pour la gestion de la musique
const MusicContext = createContext();

const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [userSongs, setUserSongs] = useState([]);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [queue, setQueue] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [listenTime, setListenTime] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalPlays: 0,
    topGenres: [],
    listeningHours: 0
  });

  const audioRef = useRef(null);
  const listenTimerRef = useRef(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowAuthModal(false);
    try { window.dispatchEvent(new CustomEvent('userChanged')); } catch (e) {}
    // Notify any global UI (InitialGate) that auth succeeded so overlays can close
    try { window.dispatchEvent(new CustomEvent('authSuccess')); } catch (e) {}
  };

  const logout = () => {
    // Sign out from Firebase if available
    (async () => {
      try {
        if (window.firebaseUtils && window.firebaseUtils.signOut) {
          await window.firebaseUtils.signOut();
        }
      } catch (err) {
        console.warn('Firebase signOut failed:', err);
      }
      setIsLoggedIn(false);
      setUser(null);
      try { window.dispatchEvent(new CustomEvent('userChanged')); } catch (e) {}
    })();
  };

  // Persist user in localStorage so session can be restored and other components can read it
  useEffect(() => {
    if (user) {
      try { localStorage.setItem('musicHub-user', JSON.stringify(user)); } catch (e) {}
    } else {
      try { localStorage.removeItem('musicHub-user'); } catch (e) {}
    }
  }, [user]);

  // When user logs in, try to load their saved songs from Firestore
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (user && window.firebaseUtils && window.firebaseUtils.getUserSongs) {
          const songs = await window.firebaseUtils.getUserSongs(user.id || user.uid);
          if (!cancelled && songs && Array.isArray(songs)) {
            setUserSongs(songs);
          }
        }
      } catch (err) {
        console.error('Failed loading user songs from Firebase:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Profile modal component (inside App so it can access context functions)
  const ProfileModal = ({ isOpen, onClose }) => {
    const [displayName, setDisplayName] = useState(user?.username || user?.displayName || '');
    const [photoFile, setPhotoFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setDisplayName(user?.username || user?.displayName || '');
    }, [user]);

    if (!isOpen) return null;

    const handlePhotoChange = (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) setPhotoFile(f);
    };

    const handleSave = async () => {
      setLoading(true);
      try {
        let photoURL = user?.photoURL || null;
        if (photoFile && window.firebaseUtils && window.firebaseUtils.uploadSongForUser) {
          // reuse upload helper to put file in Storage; store under profile pictures
          const fileUrl = await window.firebaseUtils.uploadSongForUser(photoFile, user.id || user.uid);
          photoURL = fileUrl;
        }

        if (window.firebaseUtils && window.firebaseUtils.updateUserProfile) {
          await window.firebaseUtils.updateUserProfile({ uid: user.id || user.uid }, { displayName, photoURL });
        } else if (window.firebaseUtils && window.firebaseUtils.setUserDoc) {
          await window.firebaseUtils.setUserDoc(user.id || user.uid, { displayName, photoURL });
        }

        // update local user state
        const newUser = { ...(user || {}), username: displayName, displayName, photoURL };
        setUser(newUser);
        window.dispatchEvent(new CustomEvent('userChanged'));
        onClose();
      } catch (err) {
        console.error('Failed updating profile', err);
        alert('Erreur lors de la mise à jour du profil: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Mon compte</h3>
            <button onClick={onClose} className="text-gray-400">✕</button>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl">{(user?.username || user?.displayName || user?.email || 'U')[0]?.toUpperCase()}</div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Nom affiché</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white" />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Photo de profil</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 bg-gray-800 text-white rounded">Annuler</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-primary text-white rounded">{loading ? 'Sauvegarde...' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Restore user on mount if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('musicHub-user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          setUser(parsed);
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Listen to global logout events from UI (Navbar)
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('logout', handler);
    return () => window.removeEventListener('logout', handler);
  }, []);

  // Listen to openProfile requests from UI
  useEffect(() => {
    const openHandler = () => setShowProfileModal(true);
    window.addEventListener('openProfile', openHandler);
    return () => window.removeEventListener('openProfile', openHandler);
  }, []);

  // If Firebase is configured, subscribe to auth state changes to auto-login users
  useEffect(() => {
    // Subscribe to Firebase auth state and, when a user is present, load their Firestore doc and songs.
    let unsub = null;
    try {
      const fb = (typeof window !== 'undefined' && window.firebaseUtils) ? window.firebaseUtils : firebaseUtils;
      if (fb && fb.onAuthState) {
        unsub = fb.onAuthState(async (u) => {
          if (u) {
            // load user document and songs
            try {
              const [userDoc, songs] = await Promise.all([
                fb.getUserDoc ? fb.getUserDoc(u.uid) : null,
                fb.getUserSongs ? fb.getUserSongs(u.uid) : []
              ]);

              const mergedUser = {
                id: u.uid,
                uid: u.uid,
                displayName: u.displayName || (userDoc && (userDoc.displayName || userDoc.username)) || '',
                username: (userDoc && userDoc.username) || u.displayName || u.email || '',
                email: u.email,
                photoURL: u.photoURL || (userDoc && userDoc.photoURL) || null,
                ...(userDoc || {})
              };

              setUser(mergedUser);
              setIsLoggedIn(true);
              // Close auth modal if it was open (login completed)
              try { setShowAuthModal(false); } catch (e) {}
              // notify global UI that auth completed (useful when redirect flow returns)
              try { window.dispatchEvent(new CustomEvent('authSuccess')); } catch (e) {}

              if (userDoc && Array.isArray(userDoc.favorites)) setFavorites(userDoc.favorites);
              if (userDoc && Array.isArray(userDoc.playlists)) setPlaylists(userDoc.playlists);
              if (songs && Array.isArray(songs)) setUserSongs(songs);
            } catch (err) {
              console.error('Failed loading user data after auth change', err);
              // fallback: set minimal user
              setUser({ id: u.uid, uid: u.uid, username: u.displayName || u.email, email: u.email, displayName: u.displayName, photoURL: u.photoURL });
              setIsLoggedIn(true);
            }
          } else {
            // user signed out
            logout();
          }
        });
      }
    } catch (e) {
      console.error('onAuthState subscription error', e);
    }

    return () => { if (unsub) unsub(); };
  }, []);

  const toggleAuthModal = () => {
    setShowAuthModal(!showAuthModal);
  };

  // Allow other components to open the auth modal by dispatching a custom event
  useEffect(() => {
    const handler = () => setShowAuthModal(true);
    window.addEventListener('openAuth', handler);
    return () => window.removeEventListener('openAuth', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'KeyM':
          e.preventDefault();
          setVolume(prev => prev === 0 ? 80 : 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Initialiser la playlist actuelle
  useEffect(() => {
    const allSongs = [...mockSongs, ...userSongs];
    setCurrentPlaylist(allSongs);
  }, [userSongs]);

  // Effet pour gérer la lecture audio
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.log("Erreur de lecture:", error);
          setIsPlaying(false);
        });
        // Start listening timer
        listenTimerRef.current = setInterval(() => {
          setListenTime(prev => prev + 1);
        }, 1000);
      } else {
        audioRef.current.pause();
        // Clear listening timer
        if (listenTimerRef.current) {
          clearInterval(listenTimerRef.current);
        }
      }
    }

    return () => {
      if (listenTimerRef.current) {
        clearInterval(listenTimerRef.current);
      }
    };
  }, [isPlaying, currentSong]);

  // Effet pour le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Effet pour la progression
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      handleSongEnd();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, repeatMode]);

  // Gérer la fin d'une chanson
  const handleSongEnd = () => {
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      totalPlays: prev.totalPlays + 1,
      listeningHours: prev.listeningHours + (currentSong?.duration ? 
        parseInt(currentSong.duration.split(':')[0]) / 60 : 0)
    }));

    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      skipForward();
    }
  };

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('musicHub-favorites');
    const savedPlaylists = localStorage.getItem('musicHub-playlists');
    const savedUserSongs = localStorage.getItem('musicHub-userSongs');
    const savedRecentlyPlayed = localStorage.getItem('musicHub-recentlyPlayed');
    const savedQueue = localStorage.getItem('musicHub-queue');
    const savedDarkMode = localStorage.getItem('musicHub-darkMode');
    const savedAnalytics = localStorage.getItem('musicHub-analytics');
    const savedListenTime = localStorage.getItem('musicHub-listenTime');
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    if (savedUserSongs) setUserSongs(JSON.parse(savedUserSongs));
    if (savedRecentlyPlayed) setRecentlyPlayed(JSON.parse(savedRecentlyPlayed));
    if (savedQueue) setQueue(JSON.parse(savedQueue));
    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));
    if (savedAnalytics) setAnalytics(JSON.parse(savedAnalytics));
    if (savedListenTime) setListenTime(JSON.parse(savedListenTime));
  }, []);

  // Sauvegarder les données dans localStorage
  useEffect(() => {
    localStorage.setItem('musicHub-favorites', JSON.stringify(favorites));
    // If user is logged in, persist favorites to Firestore/user doc as well
    (async () => {
      try {
        if (user && window.firebaseUtils && window.firebaseUtils.setUserDoc) {
          await window.firebaseUtils.setUserDoc(user.id || user.uid, { favorites });
        }
      } catch (err) {
        // ignore storage errors
      }
    })();
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('musicHub-playlists', JSON.stringify(playlists));
    (async () => {
      try {
        if (user && window.firebaseUtils && window.firebaseUtils.setUserDoc) {
          await window.firebaseUtils.setUserDoc(user.id || user.uid, { playlists });
        }
      } catch (err) {
        // ignore
      }
    })();
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('musicHub-userSongs', JSON.stringify(userSongs));
  }, [userSongs]);

  useEffect(() => {
    localStorage.setItem('musicHub-recentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem('musicHub-queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('musicHub-darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('musicHub-analytics', JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    localStorage.setItem('musicHub-listenTime', JSON.stringify(listenTime));
  }, [listenTime]);

  // Fonction pour ajouter une musique uploadée
  const addUserSong = (file, title, artist, genre = "Personnalisé") => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const durationFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        const newSong = {
          id: Date.now(),
          title: title || file.name.replace(/\.[^/.]+$/, ""),
          artist: artist || "Artiste inconnu",
          duration: durationFormatted,
          cover: "🎵",
          audioUrl: audio.src,
          genre: genre,
          popularity: 0,
          isUserUploaded: true,
          uploadDate: new Date().toISOString(),
          bpm: Math.floor(Math.random() * 60) + 80,
          explicit: false
        };

        // If user is logged in, try uploading to Firebase Storage and saving metadata
        (async () => {
          try {
            if (user && firebaseUtils && firebaseUtils.uploadSongForUser && firebaseUtils.saveSongMetadata) {
              const fileUrl = await firebaseUtils.uploadSongForUser(file, user.id || user.uid);
              const meta = { ...newSong, audioUrl: fileUrl };
              await firebaseUtils.saveSongMetadata(user.id || user.uid, meta);
              setUserSongs(prev => [...prev, meta]);
              resolve(meta);
              return;
            }
          } catch (err) {
            console.error('Upload to Firebase failed, falling back to local blob', err);
          }

          setUserSongs(prev => [...prev, newSong]);
          resolve(newSong);
        })();
      });

      audio.addEventListener('error', () => {
        const newSong = {
          id: Date.now(),
          title: title || file.name.replace(/\.[^/.]+$/, ""),
          artist: artist || "Artiste inconnu",
          duration: "0:00",
          cover: "🎵",
          audioUrl: URL.createObjectURL(file),
          genre: genre,
          popularity: 0,
          isUserUploaded: true,
          uploadDate: new Date().toISOString(),
          bpm: Math.floor(Math.random() * 60) + 80,
          explicit: false
        };

        setUserSongs(prev => [...prev, newSong]);
        resolve(newSong);
      });
    });
  };

  // Fonction pour supprimer une musique uploadée
  const removeUserSong = (songId) => {
    setUserSongs(prev => prev.filter(song => {
      if (song.id === songId && song.isUserUploaded) {
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

  const createPlaylist = (name, description = "") => {
    const newPlaylist = {
      id: Date.now(),
      name,
      description,
      songs: [],
      createdAt: new Date().toISOString(),
      cover: "📝"
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  const addToPlaylist = (playlistId, songId) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId && !playlist.songs.includes(songId)
          ? { ...playlist, songs: [...playlist.songs, songId] }
          : playlist
      )
    );
  };

  const removeFromPlaylist = (playlistId, songId) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId
          ? { ...playlist, songs: playlist.songs.filter(id => id !== songId) }
          : playlist
      )
    );
  };

  const playSong = useCallback((song, playlist = null) => {
    const allSongs = [...mockSongs, ...userSongs];
    const songsToPlay = playlist || allSongs;
    const index = songsToPlay.findIndex(s => s.id === song.id);
    
    setCurrentIndex(index);
    setCurrentSong(song);
    setIsPlaying(true);
    
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      totalPlays: prev.totalPlays + 1
    }));
    
    // Ajouter à l'historique récent
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 10);
    });
  }, [userSongs]);

  const addToQueue = (song) => {
    setQueue(prev => [...prev, song]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue(prev => prev.slice(1));
      playSong(nextSong);
    } else {
      skipForward();
    }
  };

  const skipForward = () => {
    if (currentPlaylist.length === 0) return;

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
      nextIndex = (currentIndex + 1) % currentPlaylist.length;
    }

    setCurrentIndex(nextIndex);
    setCurrentSong(currentPlaylist[nextIndex]);
    setIsPlaying(true);
    setProgress(0);
  };

  const skipBackward = () => {
    if (currentPlaylist.length === 0) return;

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
      prevIndex = currentIndex > 0 ? currentIndex - 1 : currentPlaylist.length - 1;
    }

    setCurrentIndex(prevIndex);
    setCurrentSong(currentPlaylist[prevIndex]);
    setIsPlaying(true);
    setProgress(0);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return { icon: Repeat, color: 'text-blue-400' };
      case 'all':
        return { icon: Repeat, color: 'text-blue-400' };
      default:
        return { icon: Repeat, color: 'text-gray-400' };
    }
  };

  const getShuffleIcon = () => {
    return {
      icon: Shuffle,
      color: isShuffled ? 'text-blue-400' : 'text-gray-400'
    };
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
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    userSongs,
    addUserSong,
    removeUserSong,
    playSong,
    skipForward,
    skipBackward,
    audioRef,
    repeatMode,
    toggleRepeat,
    isShuffled,
    toggleShuffle,
    getRepeatIcon,
    getShuffleIcon,
    recentlyPlayed,
    queue,
    addToQueue,
    clearQueue,
    playNext,
    isDarkMode,
    toggleDarkMode,
    listenTime,
    analytics,
    isLoggedIn,
    user,
    showAuthModal,
    login,
    logout,
    toggleAuthModal
  };

  return (
    <MusicContext.Provider value={value}>
      <div className={isDarkMode ? 'dark' : ''}>
        {children}
        {/* Render initial gate overlay here so it's available inside the provider */}
        <InitialGate />
      </div>
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl}
        onTimeUpdate={(e) => {
          const audio = e.target;
          if (audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        }}
        onEnded={handleSongEnd}
        loop={repeatMode === 'one'}
      />
      {/* Profile modal rendered at root of provider */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </MusicContext.Provider>
  );
};

// Composant UploadModal amélioré
const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Personnalisé');
  const [album, setAlbum] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExplicit, setIsExplicit] = useState(false);
  const fileInputRef = useRef(null);

  const uploadGenres = ["Personnalisé", "Pop", "Hip-Hop", "Rock", "Electronic", "R&B", "Rap Français", "Variété"];

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale: 50MB');
        return;
      }
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    } else {
      alert('Veuillez sélectionner un fichier audio valide (MP3, WAV, etc.)');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Veuillez sélectionner un fichier audio');
      return;
    }

    if (!title.trim()) {
      alert('Veuillez entrer un titre pour la musique');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file, title, artist, genre);
      resetForm();
      onClose();
    } catch (error) {
      alert('Erreur lors de l\'upload: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setArtist('');
    setGenre('Personnalisé');
    setAlbum('');
    setIsExplicit(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Ajouter ma musique</h3>
            <p className="text-gray-400 text-sm mt-1">Partagez votre musique avec la communauté</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-all cursor-pointer ${
            isDragging 
              ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
              : 'border-gray-600 hover:border-blue-500'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*,.mp3,.wav,.flac,.aac,.ogg"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            disabled={isUploading}
          />
          
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-white font-medium mb-2">
            {file ? 'Fichier sélectionné' : 'Glissez votre musique ici'}
          </p>
          <p className="text-gray-400 text-sm">
            {file ? file.name : 'ou cliquez pour parcourir'}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            MP3, WAV, FLAC, AAC, OGG (max 50MB)
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Titre de la chanson"
              disabled={isUploading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Artiste
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nom de l'artiste"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isUploading}
              >
                {uploadGenres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Album (optionnel)
            </label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nom de l'album"
              disabled={isUploading}
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="explicit"
              checked={isExplicit}
              onChange={(e) => setIsExplicit(e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              disabled={isUploading}
            />
            <label htmlFor="explicit" className="text-white text-sm">
              Contenu explicite
            </label>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 border border-gray-600"
            disabled={isUploading}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Upload en cours...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Publier</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Composant Navbar amélioré avec Dark Mode
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode, isLoggedIn, toggleAuthModal } = useContext(MusicContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home, path: '/' },
    { id: 'discover', label: 'Découvrir', icon: Music, path: '/discover' },
    { id: 'my-music', label: 'Ma Musique', icon: Upload, path: '/my-music' },
    { id: 'favorites', label: 'Favoris', icon: Heart, path: '/favorites' },
    { id: 'playlists', label: 'Playlists', icon: ListMusic, path: '/playlists' },
    { id: 'analytics', label: 'Stats', icon: BarChart3, path: '/analytics' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 shadow-xl' 
          : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <Music className="text-blue-400" size={32} />
              <motion.div 
                className="absolute inset-0 bg-blue-400 rounded-full opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MusicHub Pro
            </h1>
          </motion.div>

          <div className="flex items-center space-x-6">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all relative ${
                  isActive(tab.path)
                    ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                onClick={() => navigate(tab.path)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
                {isActive(tab.path) && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                    layoutId="navbar-indicator"
                  />
                )}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* User area: show avatar + dropdown when logged in, otherwise show Connexion button */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    const ev = new CustomEvent('toggleUserMenu');
                    window.dispatchEvent(ev);
                  }}
                  className="flex items-center space-x-2 bg-gray-800/30 hover:bg-gray-700/50 px-3 py-1 rounded-full"
                >
                  <img src={user.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full object-cover" onError={(e)=>{e.target.style.display='none'}} />
                  <span className="text-white text-sm">{user.displayName || user.username || user.email}</span>
                </button>

                {/* Dropdown (simple global toggle handled below) */}
                <UserDropdown user={user} logout={logout} />
              </div>
            ) : (
              <motion.button
                onClick={toggleAuthModal}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={18} />
                <span>Connexion</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Simple user dropdown component
const UserDropdown = ({ user, logout }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = () => setOpen(o => !o);
    window.addEventListener('toggleUserMenu', handler);
    return () => window.removeEventListener('toggleUserMenu', handler);
  }, []);

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-44 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl z-40">
      <div className="p-3 border-b border-gray-700">
        <div className="font-semibold text-white truncate">{user.displayName || user.username || user.email}</div>
        <div className="text-xs text-gray-400 truncate">{user.email}</div>
      </div>
      <button onClick={() => window.location.href = '/profile'} className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700">Mon compte</button>
      <button onClick={() => { logout(); }} className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700">Se déconnecter</button>
    </div>
  );
};

// Composant MusicPlayer amélioré avec Queue Display
const MusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    setIsPlaying, 
    volume, 
    setVolume, 
    progress, 
    skipForward, 
    skipBackward,
    audioRef,
    repeatMode,
    toggleRepeat,
    isShuffled,
    toggleShuffle,
    getRepeatIcon,
    getShuffleIcon,
    queue,
    listenTime
  } = useContext(MusicContext);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, [currentSong]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !currentSong) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(percent * 100);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.round(percent * 100);
    setVolume(newVolume);
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatListenTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const RepeatIcon = getRepeatIcon().icon;
  const repeatColor = getRepeatIcon().color;
  const ShuffleIcon = getShuffleIcon().icon;
  const shuffleColor = getShuffleIcon().color;

  if (!currentSong) {
    return (
      <motion.footer 
        className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 shadow-2xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center text-gray-400">
            <Music size={20} className="mr-3" />
            <span>Sélectionnez une musique pour commencer</span>
          </div>
        </div>
      </motion.footer>
    );
  }

  return (
    <>
      <motion.footer 
        className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 shadow-2xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Song Info */}
            <div className="flex items-center space-x-4 w-80">
              <motion.div 
                className="relative"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 20, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
                  {currentSong.cover}
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-20 blur-sm" />
                {currentSong.explicit && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
                    E
                  </div>
                )}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">{currentSong.title}</h4>
                <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
                {currentSong.bpm && (
                  <p className="text-gray-500 text-xs">BPM: {currentSong.bpm}</p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-3 flex-1 max-w-2xl">
              <div className="flex items-center space-x-6">
                <motion.button 
                  className={`${repeatColor} hover:text-white transition-colors relative p-2 rounded-lg hover:bg-gray-800`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleRepeat}
                  title={`Répétition: ${repeatMode === 'off' ? 'Désactivée' : repeatMode === 'one' ? 'Une chanson' : 'Toutes'}`}
                >
                  <RepeatIcon size={20} />
                  {repeatMode === 'one' && (
                    <span className="absolute -top-1 -right-1 text-xs bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">1</span>
                  )}
                </motion.button>

                <motion.button 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={skipBackward}
                >
                  <SkipBack size={24} />
                </motion.button>
                
                <motion.button
                  onClick={togglePlay}
                  className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-blue-500/25"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? 
                    <Pause size={24} className="text-white" /> : 
                    <Play size={24} className="text-white ml-1" />
                  }
                </motion.button>
                
                <motion.button 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={skipForward}
                >
                  <SkipForward size={24} />
                </motion.button>

                <motion.button 
                  className={`${shuffleColor} hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleShuffle}
                  title={`Aléatoire: ${isShuffled ? 'Activé' : 'Désactivé'}`}
                >
                  <ShuffleIcon size={20} />
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="w-full flex items-center space-x-4">
                <span className="text-xs text-gray-400 font-mono w-12 text-right">
                  {formatTime(currentTime)}
                </span>
                <div 
                  className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer group"
                  onClick={handleProgressClick}
                >
                  <div className="relative h-full">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-600 opacity-20" />
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-mono w-12">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume & Queue */}
            <div className="flex items-center space-x-4 w-80 justify-end">
              <div className="flex items-center space-x-3">
                <Volume2 size={20} className="text-gray-400" />
                <div 
                  className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer group"
                  onClick={handleVolumeChange}
                >
                  <div 
                    className="h-full bg-gray-400 rounded-full transition-all group-hover:bg-blue-400"
                    style={{ width: `${volume}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {queue.length > 0 && (
                  <motion.button 
                    className="flex items-center space-x-2 text-gray-400 text-sm bg-gray-800 px-3 py-1 rounded-full hover:text-white hover:bg-gray-700 transition-all"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setShowQueue(!showQueue)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <ListMusic size={16} />
                    <span>{queue.length}</span>
                  </motion.button>
                )}
                
                <div className="flex items-center space-x-1 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                  <Clock size={12} />
                  <span>{formatListenTime(listenTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Queue Panel */}
      <AnimatePresence>
        {showQueue && queue.length > 0 && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 bg-gray-800/95 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-2xl z-40"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">File d'attente</h4>
                <button
                  onClick={() => setShowQueue(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {queue.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 last:border-b-0"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm">
                    {song.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{song.title}</p>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{song.duration}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Composant MusicCard amélioré avec React.memo
const MusicCard = React.memo(({ song, onPlay, showDeleteButton = false, onDelete, variant = "default" }) => {
  const { favorites, toggleFavorite, playlists, addToPlaylist, createPlaylist, addToQueue } = useContext(MusicContext);
  const isFavorite = favorites.includes(song.id);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleAddToPlaylist = (playlistId) => {
    addToPlaylist(playlistId, song.id);
    setShowPlaylistMenu(false);
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const playlist = createPlaylist(newPlaylistName);
      addToPlaylist(playlist.id, song.id);
      setNewPlaylistName('');
      setShowPlaylistMenu(false);
    }
  };

  if (variant === "compact") {
    return (
      <motion.div
        className="group bg-gray-800/50 rounded-xl p-3 hover:bg-gray-700/50 transition-all cursor-pointer border border-gray-700/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, backgroundColor: "rgba(55, 65, 81, 0.5)" }}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-lg">
              {song.cover}
            </div>
            {song.explicit && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded text-[10px]">
                E
              </div>
            )}
            <motion.button
              onClick={() => onPlay(song)}
              className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <Play size={16} className="text-white" fill="white" />
            </motion.button>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate text-sm">{song.title}</h4>
            <p className="text-gray-400 text-xs truncate">{song.artist}</p>
          </div>

          <div className="flex items-center space-x-1">
            {song.bpm && (
              <span className="text-xs text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">
                {song.bpm} BPM
              </span>
            )}
            <span className="text-xs text-gray-500">{song.duration}</span>
            <motion.button
              onClick={() => toggleFavorite(song.id)}
              className={`p-1 rounded-lg transition-all ${
                isFavorite
                  ? 'text-red-500 bg-red-500 bg-opacity-20'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-500 hover:bg-opacity-20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="group bg-gray-800/30 rounded-2xl p-5 hover:bg-gray-700/30 transition-all cursor-pointer border border-gray-700/30 backdrop-blur-sm relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, backgroundColor: "rgba(55, 65, 81, 0.4)" }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            {song.cover}
          </div>
          {song.explicit && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
              E
            </div>
          )}
          <motion.button
            onClick={() => onPlay(song)}
            className="absolute inset-0 bg-black bg-opacity-70 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <Play size={24} className="text-white" fill="white" />
          </motion.button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white truncate text-lg">{song.title}</h4>
              <p className="text-gray-300 text-sm">{song.artist}</p>
              
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                  {song.duration}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                  {song.genre}
                </span>
                {song.bpm && (
                  <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                    {song.bpm} BPM
                  </span>
                )}
                {song.album && (
                  <span className="text-xs text-gray-400 truncate" title={song.album}>
                    💿 {song.album}
                  </span>
                )}
                {song.plays && (
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <TrendingUp size={12} />
                    <span>{formatPlays(song.plays)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {showDeleteButton && song.isUserUploaded && (
                <motion.button
                  onClick={() => onDelete(song.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-xl transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Supprimer cette musique"
                >
                  <Trash2 size={18} />
                </motion.button>
              )}

              <motion.button
                onClick={() => addToQueue(song)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Ajouter à la file d'attente"
              >
                <Plus size={18} />
              </motion.button>

              <motion.button
                onClick={() => toggleFavorite(song.id)}
                className={`p-2 rounded-xl transition-all ${
                  isFavorite
                    ? 'text-red-500 bg-red-500 bg-opacity-20'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-500 hover:bg-opacity-20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </motion.button>

              <div className="relative">
                <motion.button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MoreHorizontal size={18} />
                </motion.button>

                <AnimatePresence>
                  {showMoreMenu && (
                    <motion.div
                      className="absolute right-0 top-full mt-1 w-48 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-20"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    >
                      <button
                        onClick={() => {
                          addToQueue(song);
                          setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus size={16} />
                        <span>Ajouter à la file</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPlaylistMenu(true);
                          setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <ListMusic size={16} />
                        <span>Ajouter à une playlist</span>
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = song.audioUrl;
                          link.download = `${song.title} - ${song.artist}.mp3`;
                          link.click();
                          setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <Download size={16} />
                        <span>Télécharger</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${song.title} - ${song.artist}`);
                          setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <Share2 size={16} />
                        <span>Partager</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {song.isUserUploaded && (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                Ma musique
              </span>
              <span className="text-xs text-gray-400">
                Ajouté le {new Date(song.uploadDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Playlist */}
      <AnimatePresence>
        {showPlaylistMenu && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="p-4 border-b border-gray-700">
              <h5 className="text-white font-semibold">Ajouter à une playlist</h5>
            </div>
            
            <div className="max-h-48 overflow-y-auto">
              {playlists.map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center justify-between"
                >
                  <span>{playlist.name}</span>
                  <span className="text-gray-500 text-xs">({playlist.songs.length})</span>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Nouvelle playlist..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                />
                <button
                  onClick={handleCreatePlaylist}
                  className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Créer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Composant PlaylistCard
const PlaylistCard = ({ playlist, onPlay }) => {
  const { playlists, deletePlaylist, userSongs } = useContext(MusicContext);
  const allSongs = [...mockSongs, ...userSongs];
  const playlistSongs = allSongs.filter(song => playlist.songs.includes(song.id));
  const totalDuration = playlistSongs.reduce((total, song) => {
    const [min, sec] = song.duration.split(':').map(Number);
    return total + min * 60 + sec;
  }, 0);
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes} min`;
  };

  return (
    <motion.div
      className="bg-gray-800/30 rounded-2xl p-6 hover:bg-gray-700/30 transition-all cursor-pointer border border-gray-700/30 backdrop-blur-sm group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            {playlist.cover}
          </div>
          <motion.button
            onClick={() => playlistSongs.length > 0 && onPlay(playlistSongs[0], playlistSongs)}
            className="absolute inset-0 bg-black bg-opacity-70 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <Play size={24} className="text-white" fill="white" />
          </motion.button>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg mb-1">{playlist.name}</h3>
          {playlist.description && (
            <p className="text-gray-400 text-sm mb-2">{playlist.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{playlist.songs.length} titres</span>
            <span>•</span>
            <span>{formatDuration(totalDuration)}</span>
            <span>•</span>
            <span>Créé le {new Date(playlist.createdAt).toLocaleDateString()}</span>
          </div>
          
          {playlistSongs.length > 0 && (
            <div className="flex items-center space-x-2 mt-3">
              {playlistSongs.slice(0, 3).map((song, index) => (
                <div key={song.id} className="flex items-center space-x-1 text-xs text-gray-400">
                  <span>{song.title}</span>
                  {index < 2 && <span>•</span>}
                </div>
              ))}
              {playlistSongs.length > 3 && (
                <span className="text-xs text-gray-500">+{playlistSongs.length - 3} plus</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <motion.button
            onClick={() => deletePlaylist(playlist.id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Nouvelle Page Analytics
const AnalyticsPage = () => {
  const { analytics, listenTime, favorites, userSongs, recentlyPlayed } = useContext(MusicContext);
  const allSongs = [...mockSongs, ...userSongs];
  
  const favoriteSongs = allSongs.filter(song => favorites.includes(song.id));
  const topGenres = favoriteSongs.reduce((acc, song) => {
    acc[song.genre] = (acc[song.genre] || 0) + 1;
    return acc;
  }, {});

  const sortedGenres = Object.entries(topGenres)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Vos Statistiques</h1>
          <p className="text-gray-400">Analysez vos habitudes d'écoute</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-bold mb-2">{formatTime(listenTime)}</div>
            <div className="text-blue-100">Temps d'écoute total</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-bold mb-2">{analytics.totalPlays}</div>
            <div className="text-green-100">Chansons jouées</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-3xl font-bold mb-2">{favorites.length}</div>
            <div className="text-orange-100">Favoris</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-3xl font-bold mb-2">{userSongs.length}</div>
            <div className="text-purple-100">Musiques uploadées</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Genres */}
          <motion.section
            className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">Genres Préférés</h2>
            <div className="space-y-4">
              {sortedGenres.map(([genre, count], index) => (
                <div key={genre} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{genre}</span>
                  </div>
                  <div className="text-gray-400">{count} chansons</div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Recent Activity */}
          <motion.section
            className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">Activité Récente</h2>
            <div className="space-y-4">
              {recentlyPlayed.slice(0, 5).map((song, index) => (
                <div key={song.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm">
                    {song.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{song.title}</p>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {song.duration}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Listening Hours */}
        <motion.section
          className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Heures d'Écoute</h2>
          <div className="text-center py-8">
            <div className="text-5xl font-bold text-white mb-2">
              {Math.round(analytics.listeningHours * 10) / 10}h
            </div>
            <p className="text-gray-400">Temps total passé à écouter de la musique</p>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

// Page Accueil améliorée
const HomePage = () => {
  const { playSong, userSongs, recentlyPlayed, playlists, analytics } = useContext(MusicContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeTab, setActiveTab] = useState('all');

  const allSongs = [...mockSongs, ...userSongs];
  const filteredSongs = allSongs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const popularSongs = [...allSongs].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const recentSongs = recentlyPlayed.slice(0, 6);
  const userPlaylists = playlists.slice(0, 4);

  const tabs = [
    { id: 'all', label: 'Tout', count: filteredSongs.length },
    { id: 'popular', label: 'Tendances', count: popularSongs.length },
    { id: 'recent', label: 'Récent', count: recentSongs.length },
    { id: 'playlists', label: 'Playlists', count: userPlaylists.length }
  ];

  const getDisplaySongs = () => {
    switch (activeTab) {
      case 'popular': return popularSongs;
      case 'recent': return recentSongs;
      case 'playlists': return [];
      default: return filteredSongs;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <motion.section 
        className="relative rounded-3xl p-8 mb-12 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <motion.h2 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            La musique sans limites
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Découvrez des millions de chansons, créez vos playlists et partagez votre musique. 
            Tout cela, sans aucune interruption.
          </motion.p>
          <div className="flex items-center space-x-4">
            <motion.button 
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} fill="currentColor" />
              <span>Commencer l'écoute</span>
            </motion.button>
            <motion.button 
              className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorer la bibliothèque
            </motion.button>
          </div>
        </div>
        <motion.div 
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-9xl opacity-10"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          🎵
        </motion.div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {[
          { icon: Music, label: "Chansons", value: allSongs.length, color: "blue" },
          { icon: Heart, label: "Favoris", value: recentlyPlayed.length, color: "red" },
          { icon: ListMusic, label: "Playlists", value: playlists.length, color: "purple" },
          { icon: BarChart3, label: "Écoutes", value: analytics.totalPlays, color: "green" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ y: -2, backgroundColor: "rgba(55, 65, 81, 0.4)" }}
          >
            <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`text-${stat.color}-400`} size={24} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* Search and Filters */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher des chansons, artistes, albums..."
              className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl py-4 px-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800/50 rounded-2xl p-1 backdrop-blur-sm">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`px-4 py-2 rounded-xl transition-all relative ${
                  activeTab === tab.id
                    ? 'text-white bg-gray-700/50'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-medium">{tab.label}</span>
                <span className="ml-2 text-xs bg-gray-600 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <motion.button
              key={genre}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedGenre === genre
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 backdrop-blur-sm'
              }`}
              onClick={() => setSelectedGenre(genre)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {genre}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Content based on active tab */}
      {activeTab === 'playlists' ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Vos Playlists</h3>
          {userPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPlaylists.map((playlist, index) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onPlay={playSong}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h4 className="text-xl font-semibold text-white mb-2">Aucune playlist</h4>
              <p className="text-gray-400">Créez votre première playlist pour organiser votre musique</p>
            </div>
          )}
        </motion.section>
      ) : (
        <>
          {/* Featured Sections */}
          {(activeTab === 'all' || activeTab === 'popular') && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Tendances du moment</h3>
                <div className="flex items-center space-x-2 text-gray-400">
                  <TrendingUp size={20} />
                  <span className="text-sm">Les plus populaires</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    className="bg-gray-800/30 rounded-2xl p-6 hover:bg-gray-700/30 transition-all cursor-pointer group border border-gray-700/30 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => playSong(song)}
                  >
                    <div className="relative mb-4">
                      <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-4xl shadow-lg">
                        {song.cover}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={40} className="text-white" fill="white" />
                      </div>
                      <div className="absolute top-3 right-3 bg-black/50 rounded-full px-2 py-1 text-xs text-white backdrop-blur-sm">
                        #{index + 1}
                      </div>
                    </div>
                    <h4 className="font-bold text-white truncate text-lg mb-1">{song.title}</h4>
                    <p className="text-gray-300 text-sm mb-2">{song.artist}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{song.duration}</span>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <TrendingUp size={12} />
                        <span>{formatPlays(song.plays)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Recent Plays */}
          {(activeTab === 'all' || activeTab === 'recent') && recentSongs.length > 0 && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Récemment joué</h3>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock size={20} />
                  <span className="text-sm">Votre historique</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentSongs.map((song, index) => (
                  <MusicCard
                    key={song.id}
                    song={song}
                    onPlay={playSong}
                    variant="compact"
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* All Songs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {selectedGenre === "All" ? "Toutes les chansons" : selectedGenre}
                <span className="text-gray-400 text-lg ml-2">({getDisplaySongs().length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {getDisplaySongs().map((song) => (
                  <MusicCard
                    key={song.id}
                    song={song}
                    onPlay={playSong}
                  />
                ))}
              </AnimatePresence>
            </div>

            {getDisplaySongs().length === 0 && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-7xl mb-4">🎵</div>
                <h4 className="text-2xl font-semibold text-white mb-3">Aucune chanson trouvée</h4>
                <p className="text-gray-400 text-lg mb-6">Essayez de modifier votre recherche ou filtre</p>
                <motion.button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('All');
                    setActiveTab('all');
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tout afficher
                </motion.button>
              </motion.div>
            )}
          </motion.section>
        </>
      )}
    </div>
  );
};

// Page Découvrir améliorée
const DiscoverPage = () => {
  const { playSong, userSongs } = useContext(MusicContext);
  const [selectedMood, setSelectedMood] = useState(null);

  const allSongs = [...mockSongs, ...userSongs];
  
  const moodPlaylists = {
    Happy: allSongs.filter(song => ['Pop', 'Electronic'].includes(song.genre)).slice(0, 8),
    Chill: allSongs.filter(song => ['R&B', 'Electronic'].includes(song.genre)).slice(0, 8),
    Energetic: allSongs.filter(song => ['Rock', 'Hip-Hop'].includes(song.genre)).slice(0, 8),
    Romantic: allSongs.filter(song => ['Pop', 'R&B'].includes(song.genre)).slice(0, 8),
    Focus: allSongs.filter(song => song.popularity > 85).slice(0, 8),
    Workout: allSongs.filter(song => ['Rock', 'Hip-Hop', 'Electronic'].includes(song.genre)).slice(0, 8)
  };

  const featuredArtists = [
    { name: "The Weeknd", songs: 2, genre: "Pop/R&B", color: "from-red-500 to-pink-500" },
    { name: "Dua Lipa", songs: 1, genre: "Pop", color: "from-blue-500 to-purple-500" },
    { name: "Olivia Rodrigo", songs: 1, genre: "Pop/Rock", color: "from-green-500 to-teal-500" },
    { name: "Glass Animals", songs: 1, genre: "Electronic", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Découvrir</h1>
            <p className="text-gray-400">Trouvez de nouvelles musiques selon votre humeur</p>
          </div>
        </div>

        {/* Mood Selection */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Choisissez votre humeur</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {moods.map((mood, index) => (
              <motion.button
                key={mood}
                className={`p-6 rounded-2xl text-center transition-all backdrop-blur-sm border-2 ${
                  selectedMood === mood
                    ? 'bg-blue-500/20 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:bg-gray-700/30 hover:text-white'
                }`}
                onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-2">
                  {mood === 'Happy' && '😊'}
                  {mood === 'Chill' && '😌'}
                  {mood === 'Energetic' && '⚡'}
                  {mood === 'Romantic' && '❤️'}
                  {mood === 'Focus' && '🎯'}
                  {mood === 'Workout' && '💪'}
                </div>
                <div className="font-semibold">{mood}</div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Featured Artists */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Artistes en vedette</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtists.map((artist, index) => (
              <motion.div
                key={artist.name}
                className={`bg-gradient-to-br ${artist.color} rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">{artist.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{artist.genre}</p>
                  <div className="flex items-center space-x-1 text-sm">
                    <Music size={14} />
                    <span>{artist.songs} chansons</span>
                  </div>
                </div>
                <div className="absolute right-4 bottom-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                  <Mic2 />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Mood Playlists */}
        {(selectedMood ? [selectedMood] : moods).map((mood) => (
          <motion.section
            key={mood}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedMood ? `Playlist ${mood}` : `Pour être ${mood.toLowerCase()}`}
              </h2>
              {!selectedMood && (
                <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                  Voir tout
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {moodPlaylists[mood]?.map((song, index) => (
                <motion.div
                  key={song.id}
                  className="bg-gray-800/30 rounded-2xl p-4 hover:bg-gray-700/30 transition-all cursor-pointer group border border-gray-700/30 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  onClick={() => playSong(song)}
                >
                  <div className="relative mb-3">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                      {song.cover}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} className="text-white" fill="white" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-white truncate text-sm">{song.title}</h4>
                  <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </motion.div>
    </div>
  );
};

// Page Ma Musique améliorée
const MyMusicPage = () => {
  const { userSongs, playSong, removeUserSong, addUserSong } = useContext(MusicContext);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredSongs = userSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSongs = [...filteredSongs].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'date':
      default:
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  const handleUpload = async (file, title, artist, genre) => {
    await addUserSong(file, title, artist, genre);
  };

  const handleDelete = (songId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette musique ?')) {
      removeUserSong(songId);
    }
  };

  const stats = {
    totalSongs: userSongs.length,
    totalDuration: userSongs.reduce((total, song) => {
      const [min, sec] = song.duration.split(':').map(Number);
      return total + min * 60 + sec;
    }, 0),
    genres: [...new Set(userSongs.map(song => song.genre))].length
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes} min`;
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Ma Musique</h1>
            <p className="text-gray-400">
              Votre collection personnelle de {userSongs.length} musique{userSongs.length > 1 ? 's' : ''}
            </p>
          </div>

          <motion.button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2 mt-4 lg:mt-0"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload size={20} />
            <span>Ajouter ma musique</span>
          </motion.button>
        </div>

        {/* Stats */}
        {userSongs.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{stats.totalSongs}</div>
              <div className="text-gray-400 text-sm">Chansons</div>
            </div>
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{formatDuration(stats.totalDuration)}</div>
              <div className="text-gray-400 text-sm">Durée totale</div>
            </div>
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{stats.genres}</div>
              <div className="text-gray-400 text-sm">Genres</div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Search and Sort */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher dans ma musique..."
              className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl py-3 px-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="date">Date d'ajout</option>
              <option value="name">Nom</option>
              <option value="artist">Artiste</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Songs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {sortedSongs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {sortedSongs.map((song, index) => (
              <MusicCard
                key={song.id}
                song={song}
                onPlay={playSong}
                showDeleteButton={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-7xl mb-4">🎵</div>
            <h4 className="text-2xl font-semibold text-white mb-3">
              {userSongs.length === 0 ? 'Aucune musique personnelle' : 'Aucun résultat'}
            </h4>
            <p className="text-gray-400 text-lg mb-6 max-w-md mx-auto">
              {userSongs.length === 0 
                ? 'Commencez par uploader vos premières musiques et construisez votre bibliothèque personnelle !' 
                : 'Essayez de modifier votre recherche ou vos filtres'}
            </p>
            {userSongs.length === 0 && (
              <motion.button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload size={20} />
                <span>Uploader ma première musique</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // If Firebase configured, attempt real auth
    (async () => {
      try {
        if (isLogin) {
          if (firebaseUtils && firebaseUtils.signInWithEmail) {
            const user = await firebaseUtils.signInWithEmail(formData.email, formData.password);
            onLogin({ id: user.uid, username: user.displayName || user.email, email: user.email });
          } else {
            // fallback simulation
            onLogin({ id: Date.now(), username: formData.username || 'Utilisateur', email: formData.email });
          }
        } else {
          if (firebaseUtils && firebaseUtils.signUpWithEmail) {
            const user = await firebaseUtils.signUpWithEmail(formData.email, formData.password);
            onLogin({ id: user.uid, username: user.displayName || formData.username || user.email, email: user.email });
          } else {
            onLogin({ id: Date.now(), username: formData.username || 'Utilisateur', email: formData.email });
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        alert('Erreur d\u2019authentification: ' + (err.message || err));
      }
    })();
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center mb-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  if (firebaseUtils && firebaseUtils.signInWithGooglePopup) {
                    const user = await firebaseUtils.signInWithGooglePopup();
                    onLogin({ id: user.uid, username: user.displayName || user.email, email: user.email });
                    return;
                  }
                } catch (err) {
                  console.warn('Google popup failed:', err?.code || err?.message || err);
                  // If popup was blocked or popup failed, try redirect fallback
                  try {
                    if (firebaseUtils && firebaseUtils.signInWithGoogleRedirect) {
                      alert('Popup bloquée ou erreur. Vous allez être redirigé pour vous connecter.');
                      await firebaseUtils.signInWithGoogleRedirect();
                      return;
                    }
                  } catch (err2) {
                    console.error('Redirect fallback failed', err2);
                    alert('Erreur lors de la tentative de connexion: ' + (err2?.message || err2));
                    return;
                  }

                  alert('Erreur Google sign-in: ' + (err?.message || err));
                }
                alert('Google sign-in non configuré.');
              }}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium mr-2"
            >
              Se connecter avec Google
            </button>
          </div>
          {!isLogin && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom d'utilisateur"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            <span>{isLogin ? 'Se connecter' : 'Créer un compte'}</span>
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Page Favoris améliorée
const FavoritesPage = () => {
  const { favorites, playSong, userSongs, playlists } = useContext(MusicContext);
  const allSongs = [...mockSongs, ...userSongs];
  const favoriteSongs = allSongs.filter(song => favorites.includes(song.id));
  const favoritePlaylists = playlists.filter(playlist => 
    playlist.songs.some(songId => favorites.includes(songId))
  );

  const stats = {
    totalSongs: favoriteSongs.length,
    totalDuration: favoriteSongs.reduce((total, song) => {
      const [min, sec] = song.duration.split(':').map(Number);
      return total + min * 60 + sec;
    }, 0),
    topGenre: favoriteSongs.length > 0 
      ? Object.entries(
          favoriteSongs.reduce((acc, song) => {
            acc[song.genre] = (acc[song.genre] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0][0]
      : 'Aucun'
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes} min`;
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Vos favoris</h1>
            <p className="text-gray-400">{favoriteSongs.length} chansons aimées</p>
          </div>
        </div>

        {/* Stats */}
        {favoriteSongs.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{stats.totalSongs}</div>
              <div className="text-gray-400 text-sm">Chansons favorites</div>
            </div>
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{formatDuration(stats.totalDuration)}</div>
              <div className="text-gray-400 text-sm">Durée totale</div>
            </div>
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{stats.topGenre}</div>
              <div className="text-gray-400 text-sm">Genre préféré</div>
            </div>
          </motion.div>
        )}

        {/* Favorite Playlists */}
        {favoritePlaylists.length > 0 && (
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Playlists avec des favoris</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoritePlaylists.map((playlist, index) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onPlay={playSong}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Favorite Songs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {favoriteSongs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {favoriteSongs.map((song, index) => (
                <MusicCard
                  key={song.id}
                  song={song}
                  onPlay={playSong}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-7xl mb-4">❤️</div>
              <h4 className="text-2xl font-semibold text-white mb-3">Aucun favori</h4>
              <p className="text-gray-400 text-lg mb-6">
                Commencez à ajouter des chansons à vos favoris en cliquant sur l'icône cœur !
              </p>
              <motion.button
                onClick={() => window.scrollTo(0, 0)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explorer la musique
              </motion.button>
            </motion.div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
};

// Page Mon Compte / Profil
const ProfilePage = () => {
  const { user, isLoggedIn, toggleAuthModal, isDarkMode, toggleDarkMode } = useContext(MusicContext);
  const [displayName, setDisplayName] = useState(user?.displayName || user?.username || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDisplayName(user?.displayName || user?.username || '');
  }, [user]);

  const save = async () => {
    setLoading(true);
    try {
      if (window.firebaseUtils && window.firebaseUtils.updateUserProfile) {
        await window.firebaseUtils.updateUserProfile({ uid: user.id || user.uid }, { displayName });
      } else if (window.firebaseUtils && window.firebaseUtils.setUserDoc) {
        await window.firebaseUtils.setUserDoc(user.id || user.uid, { displayName });
      }
      // update local storage/state
      const newUser = { ...(user || {}), displayName };
      window.dispatchEvent(new CustomEvent('userChanged'));
      try { localStorage.setItem('musicHub-user', JSON.stringify(newUser)); } catch(e){}
      alert('Profil mis à jour');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    } finally { setLoading(false); }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-xl text-white">Veuillez vous connecter pour accéder à votre profil.</h2>
        <button onClick={toggleAuthModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Se connecter</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30">
        <h2 className="text-2xl font-bold text-white mb-4">Mon compte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center text-3xl text-white">{(user?.displayName||user?.username||user?.email||'U')[0]?.toUpperCase()}</div>
          </div>
          <div className="col-span-2">
            <div className="mb-4">
              <label className="block text-sm text-gray-300">Nom affiché</label>
              <input value={displayName} onChange={(e)=>setDisplayName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 mt-1 text-white" />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-300">Email</label>
              <div className="text-gray-400 mt-1">{user?.email}</div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={save} disabled={loading} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded">
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button onClick={toggleDarkMode} className="bg-gray-800 text-white px-4 py-2 rounded">Mode: {isDarkMode ? 'Sombre' : 'Clair'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page Playlists
const PlaylistsPage = () => {
  const { playlists, createPlaylist, playSong } = useContext(MusicContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName, newPlaylistDescription);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Vos Playlists</h1>
            <p className="text-gray-400">{playlists.length} playlist{playlists.length > 1 ? 's' : ''} créée{playlists.length > 1 ? 's' : ''}</p>
          </div>

          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>Nouvelle playlist</span>
          </motion.button>
        </div>

        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist, index) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onPlay={playSong}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-7xl mb-4">📝</div>
            <h4 className="text-2xl font-semibold text-white mb-3">Aucune playlist</h4>
            <p className="text-gray-400 text-lg mb-6">
              Créez votre première playlist pour organiser votre musique préférée
            </p>
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Créer une playlist
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Nouvelle playlist</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Nom de la playlist *
                  </label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ma super playlist..."
                    onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description (optionnelle)
                  </label>
                  <textarea
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Décrivez votre playlist..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Créer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant principal App
function App() {
  return (
    <MusicProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-40 transition-colors duration-300">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/my-music" element={<MyMusicPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
          
          <MusicPlayer />

          {/* Auth modal rendered via wrapper so it consumes context inside the provider */}
          <AuthModalWrapper />
        </div>
      </Router>
    </MusicProvider>
  );
}

  // Initial gate shown when user is not logged in (prompts to connect)
  const InitialGate = () => {
    const { isLoggedIn, toggleAuthModal } = React.useContext(MusicContext);
    const [skipped, setSkipped] = React.useState(false);

    useEffect(() => {
      const onAuth = () => setSkipped(true);
      window.addEventListener('authSuccess', onAuth);
      return () => window.removeEventListener('authSuccess', onAuth);
    }, []);
    if (isLoggedIn || skipped) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full border border-gray-700 shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connectez-vous</h2>
          <p className="text-gray-400 mb-6">Pour sauvegarder vos favoris, accéder à votre profil et retrouver vos musiques depuis n'importe quel appareil.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => toggleAuthModal()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Se connecter / Créer un compte
            </button>
            <button
              onClick={() => setSkipped(true)}
              className="bg-gray-800 text-white px-6 py-3 rounded-full border border-gray-700"
            >
              Continuer sans me connecter
            </button>
          </div>
        </div>
      </div>
    );
  };

// Small wrapper component that consumes MusicContext inside the provider
function AuthModalWrapper() {
  const { showAuthModal, toggleAuthModal, login } = React.useContext(MusicContext);
  return <AuthModal isOpen={showAuthModal} onClose={toggleAuthModal} onLogin={login} />;
}

export default App;