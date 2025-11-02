import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { deezerApi } from '../api/deezerApi';
import SearchBar from '../components/SearchBar';
import MusicCard from '../components/MusicCard';
import { TrendingUp, Music, Radio } from 'lucide-react';

const Home = () => {
  const { state } = useMusic();
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [tracks, artists] = await Promise.all([
          deezerApi.getCharts(20),
          deezerApi.getTopArtists(10),
        ]);
        setTopTracks(tracks);
        setTopArtists(artists);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Découvrez votre prochaine
            <br />
            <span className="text-white">chanson favorite</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Explorez des millions de morceaux et créez vos playlists personnalisées
          </p>
          <SearchBar />
        </motion.div>
      </section>

      {/* Top Charts */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 mb-6"
        >
          <TrendingUp className="text-primary-500" size={28} />
          <h2 className="text-3xl font-bold">Top Charts</h2>
        </motion.div>

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
            {topTracks.map((track, index) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </section>

      {/* Top Artists */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 mb-6"
        >
          <Radio className="text-primary-500" size={28} />
          <h2 className="text-3xl font-bold">Artistes Populaires</h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-square bg-white/10 rounded-full mb-3" />
                <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {topArtists.map((artist) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="group text-center cursor-pointer"
                onClick={async () => {
                  const tracks = await deezerApi.getArtistTracks(artist.id);
                  // TODO: Navigate to artist page or show tracks
                }}
              >
                <div className="relative mb-3">
                  <img
                    src={artist.picture || artist.pictureSmall}
                    alt={artist.name}
                    className="w-full aspect-square object-cover rounded-full group-hover:ring-4 ring-primary-500 transition-all"
                  />
                </div>
                <h3 className="font-semibold truncate">{artist.name}</h3>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Recently Played */}
      {state.history.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 mb-6"
          >
            <Music className="text-primary-500" size={28} />
            <h2 className="text-3xl font-bold">Récemment écouté</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {state.history.slice(0, 10).map((track) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

