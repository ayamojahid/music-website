import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { deezerApi } from '../api/deezerApi';
import MusicCard from '../components/MusicCard';
import SearchBar from '../components/SearchBar';
import { Music2, Sparkles } from 'lucide-react';

const Discover = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreTracks, setGenreTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await deezerApi.getGenres();
        setGenres(genresData.slice(0, 12)); // Top 12 genres
      } catch (error) {
        console.error('Error loading genres:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      const loadGenreTracks = async () => {
        setLoading(true);
        try {
          const tracks = await deezerApi.getTracksByGenre(selectedGenre.id);
          setGenreTracks(tracks);
        } catch (error) {
          console.error('Error loading genre tracks:', error);
        } finally {
          setLoading(false);
        }
      };

      loadGenreTracks();
    }
  }, [selectedGenre]);

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Découvrir
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Explorez de nouveaux genres et trouvez votre prochaine découverte musicale
          </p>
          <SearchBar />
        </motion.div>

        {/* Genres */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Music2 className="text-primary-500" size={28} />
            <h2 className="text-3xl font-bold">Genres</h2>
          </div>

          {loading && !selectedGenre ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full aspect-video bg-white/10 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genres.map((genre) => (
                <motion.div
                  key={genre.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedGenre(genre)}
                  className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer ${
                    selectedGenre?.id === genre.id
                      ? 'ring-4 ring-primary-500'
                      : ''
                  }`}
                >
                  <img
                    src={genre.picture}
                    alt={genre.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <h3 className="text-xl font-bold">{genre.name}</h3>
                  </div>
                  {selectedGenre?.id === genre.id && (
                    <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                      <Sparkles className="text-white" size={32} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Genre Tracks */}
        {selectedGenre && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">{selectedGenre.name}</h2>
                <p className="text-gray-400">Meilleurs morceaux du genre</p>
              </div>
              <button
                onClick={() => setSelectedGenre(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Voir tous les genres
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full aspect-square bg-white/10 rounded-lg mb-3" />
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genreTracks.map((track) => (
                  <MusicCard key={track.id} track={track} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Discover;

