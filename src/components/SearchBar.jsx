import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { deezerApi } from '../api/deezerApi';

const SearchBar = ({ onSelectTrack }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { state, dispatch } = useMusic();

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const tracks = await deezerApi.search(searchQuery, 10);
      setResults(tracks);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: tracks });
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleSelect = (track) => {
    if (onSelectTrack) {
      onSelectTrack(track);
    } else {
      dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
      dispatch({ type: 'PLAY' });
      dispatch({ type: 'ADD_TO_HISTORY', payload: track });
      if (!state.queue.length) {
        dispatch({ type: 'SET_QUEUE', payload: [track] });
      }
    }
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Rechercher des artistes, chansons, albums..."
          className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full glass-effect rounded-2xl p-4 max-h-96 overflow-y-auto z-50"
          >
            {isSearching ? (
              <div className="text-center py-4 text-gray-400">Recherche en cours...</div>
            ) : (
              <div className="space-y-2">
                {results.map((track) => (
                  <motion.div
                    key={track.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => handleSelect(track)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <img
                      src={track.coverSmall || track.cover}
                      alt={track.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{track.title}</p>
                      <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

