import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import MusicCard from '../components/MusicCard';
import { ArrowLeft, Play, Trash2 } from 'lucide-react';

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useMusic();

  const playlist = state.playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="min-h-screen pb-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Playlist introuvable</h2>
          <button
            onClick={() => navigate('/playlists')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold transition-colors"
          >
            Retour aux playlists
          </button>
        </div>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      dispatch({ type: 'SET_QUEUE', payload: playlist.tracks });
      dispatch({ type: 'SET_CURRENT_TRACK', payload: playlist.tracks[0] });
      dispatch({ type: 'PLAY' });
    }
  };

  const handleRemoveTrack = (trackId) => {
    const updatedTracks = playlist.tracks.filter(t => t.id !== trackId);
    dispatch({
      type: 'UPDATE_PLAYLIST',
      payload: { ...playlist, tracks: updatedTracks },
    });
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/playlists')}
          className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            {playlist.tracks.length > 0 ? (
              <img
                src={playlist.tracks[0].cover || playlist.tracks[0].coverSmall}
                alt={playlist.name}
                className="w-48 h-48 rounded-2xl object-cover shadow-2xl"
              />
            ) : (
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                <span className="text-6xl">🎵</span>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                {playlist.name}
              </h1>
              <p className="text-gray-400 mb-4">
                {playlist.tracks.length} {playlist.tracks.length === 1 ? 'morceau' : 'morceaux'}
              </p>
              <button
                onClick={handlePlayAll}
                disabled={playlist.tracks.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={20} fill="white" />
                Tout lire
              </button>
            </div>
          </div>
        </div>

        {playlist.tracks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl font-bold mb-2">Cette playlist est vide</p>
            <p className="text-gray-400">
              Ajoutez des morceaux depuis la page de découverte
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlist.tracks.map((track) => (
              <div key={track.id} className="relative group">
                <MusicCard track={track} />
                <button
                  onClick={() => handleRemoveTrack(track.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;

