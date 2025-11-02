import React from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import MusicCard from '../components/MusicCard';
import { Heart, Music } from 'lucide-react';

const Favorites = () => {
  const { state } = useMusic();

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-red-500" size={32} fill="currentColor" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Mes Favoris
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            {state.favorites.length} {state.favorites.length === 1 ? 'morceau' : 'morceaux'} favori{state.favorites.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {state.favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Music className="mx-auto text-gray-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-2">Aucun favori pour le moment</h2>
            <p className="text-gray-400 mb-6">
              Commencez à ajouter des morceaux à vos favoris en cliquant sur l'icône ❤️
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {state.favorites.map((track) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

