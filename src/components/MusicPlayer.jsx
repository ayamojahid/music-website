import React, { useRef, useEffect, useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Maximize2,
  Heart,
  MoreVertical,
  Repeat,
  Shuffle,
  Music
} from 'lucide-react';
import { motion } from 'framer-motion';

const MusicPlayer = () => {
  const { state, dispatch } = useMusic();
  const audioRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.currentTrack) {
      if (state.isPlaying) {
        audio.play().catch(err => console.error('Play error:', err));
      } else {
        audio.pause();
      }
    }

    const updateTime = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    const updateDuration = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration || 0 });
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [state.currentTrack, state.isPlaying, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = state.volume;
    }
  }, [state.volume]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = newTime;
      dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
    }
  };

  const togglePlay = () => {
    if (state.currentTrack) {
      dispatch({ type: state.isPlaying ? 'PAUSE' : 'PLAY' });
    }
  };

  const handleNext = () => {
    if (state.repeatMode === 'one' && state.currentTrack) {
      // Repeat current track
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    } else {
      dispatch({ type: 'NEXT_TRACK' });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_TRACK' });
  };

  const handleTrackEnd = () => {
    if (state.repeatMode === 'one') {
      // Repeat current track
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    } else if (state.repeatMode === 'all') {
      // Repeat all - go to next (which will loop back to start if at end)
      if (state.currentIndex === state.queue.length - 1) {
        // Last track, go to first
        dispatch({ type: 'SET_CURRENT_TRACK', payload: state.queue[0] });
        dispatch({ type: 'SET_QUEUE', payload: state.queue });
        dispatch({ type: 'PLAY' });
      } else {
        handleNext();
      }
    } else {
      // No repeat - go to next track
      handleNext();
    }
  };

  const toggleRepeat = () => {
    const modes = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    dispatch({ type: 'SET_REPEAT_MODE', payload: modes[nextIndex] });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const toggleMute = () => {
    dispatch({ type: 'SET_VOLUME', payload: state.volume > 0 ? 0 : 1 });
  };

  const handleVolumeChange = (e) => {
    dispatch({ type: 'SET_VOLUME', payload: parseFloat(e.target.value) });
  };

  const toggleFavorite = () => {
    if (state.currentTrack) {
      dispatch({ type: 'TOGGLE_FAVORITE', payload: state.currentTrack });
    }
  };

  const isFavorite = state.currentTrack && state.favorites.some(fav => fav.id === state.currentTrack.id);
  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  // Always render, but show empty state if no track
  if (!state.currentTrack && !isExpanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20 z-50 h-0 transition-all duration-300" />
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={state.currentTrack?.preview || state.currentTrack?.blobUrl}
        onEnded={handleTrackEnd}
      />
      
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20 z-50 ${
          isExpanded ? 'h-screen' : 'h-24'
        } transition-all duration-300`}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          {state.currentTrack ? (
            <div className="w-full flex items-center gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {state.currentTrack.cover || state.currentTrack.coverSmall ? (
                  <motion.img
                    src={state.currentTrack.cover || state.currentTrack.coverSmall}
                    alt={state.currentTrack.title}
                    className="w-16 h-16 rounded-lg object-cover"
                    whileHover={{ scale: 1.05 }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                    <Music size={24} className="text-white/50" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{state.currentTrack.title}</p>
                  <p className="text-sm text-gray-400 truncate">{state.currentTrack.artist}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleShuffle}
                    className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
                      state.shuffleMode ? 'text-primary-500' : 'text-gray-400'
                    }`}
                    title="Mode aléatoire"
                  >
                    <Shuffle size={18} fill={state.shuffleMode ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handlePrev}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <SkipBack size={20} />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="p-3 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors"
                  >
                    {state.isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </motion.button>
                  <button
                    onClick={handleNext}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <SkipForward size={20} />
                  </button>
                  <button
                    onClick={toggleRepeat}
                    className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
                      state.repeatMode !== 'off' ? 'text-primary-500' : 'text-gray-400'
                    }`}
                    title={
                      state.repeatMode === 'off' ? 'Répéter désactivé' :
                      state.repeatMode === 'one' ? 'Répéter ce morceau' :
                      'Répéter toute la playlist'
                    }
                  >
                    <Repeat size={18} fill={state.repeatMode !== 'off' ? 'currentColor' : 'none'} />
                    {state.repeatMode === 'one' && (
                      <span className="absolute text-xs">1</span>
                    )}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md flex items-center gap-2">
                  <span className="text-xs text-gray-400">{formatTime(state.currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-xs text-gray-400">{formatTime(state.duration)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-1 justify-end">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
                    isFavorite ? 'text-red-500' : ''
                  }`}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {state.volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={state.volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Maximize2 size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full text-center text-gray-400">
              Sélectionnez une musique pour commencer
            </div>
          )}
        </div>

        {/* Expanded View */}
        {isExpanded && state.currentTrack && (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <motion.img
              src={state.currentTrack.coverLarge || state.currentTrack.cover}
              alt={state.currentTrack.title}
              className="w-80 h-80 rounded-2xl object-cover mb-8 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            />
            <h2 className="text-3xl font-bold mb-2">{state.currentTrack.title}</h2>
            <p className="text-xl text-gray-400 mb-8">{state.currentTrack.artist}</p>
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default MusicPlayer;

