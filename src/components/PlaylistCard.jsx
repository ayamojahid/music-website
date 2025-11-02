import React from 'react';
import { Play, MoreVertical, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
  const { dispatch } = useMusic();
  const navigate = useNavigate();

  const handlePlay = () => {
    if (playlist.tracks.length > 0) {
      dispatch({ type: 'SET_QUEUE', payload: playlist.tracks });
      dispatch({ type: 'SET_CURRENT_TRACK', payload: playlist.tracks[0] });
      dispatch({ type: 'PLAY' });
    }
  };

  const getCoverImage = () => {
    if (playlist.tracks.length > 0) {
      return playlist.tracks[0].cover || playlist.tracks[0].coverSmall;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
      onClick={() => navigate(`/playlists/${playlist.id}`)}
    >
      <div className="relative mb-3">
        {getCoverImage() ? (
          <img
            src={getCoverImage()}
            alt={playlist.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
            <Music size={48} className="text-white/50" />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            className="p-3 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors"
          >
            <Play size={24} fill="white" />
          </motion.button>
        </motion.div>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{playlist.name}</h3>
          <p className="text-sm text-gray-400">
            {playlist.tracks.length} {playlist.tracks.length === 1 ? 'morceau' : 'morceaux'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistCard;

