import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Music, Upload } from 'lucide-react';
import { MusicContext } from '../context/MusicContext';
import SongCard from '../components/SongCard';
import UploadModal from '../components/UploadModal';

const MyMusicPage = () => {
  const { userSongs, setCurrentSong, setIsPlaying, removeUserSong } = React.useContext(MusicContext);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = userSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleUpload = (file, title, artist, genre) => {
    // Cette fonction sera passée au modal
    // Elle appelle addUserSong du context
    const { addUserSong } = React.useContext(MusicContext);
    addUserSong(file, title, artist, genre);
  };

  const handleDelete = (songId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette musique ?')) {
      removeUserSong(songId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ma Musique</h1>
          <p className="text-textMuted">
            {userSongs.length} musique{userSongs.length > 1 ? 's' : ''} personnelle{userSongs.length > 1 ? 's' : ''}
          </p>
        </div>

        <motion.button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-accent transition-all flex items-center space-x-2 mt-4 lg:mt-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload size={20} />
          <span>Ajouter ma musique</span>
        </motion.button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher dans ma musique..."
            className="w-full bg-dark-100 border border-gray-700 rounded-full py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Songs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredSongs.map((song, index) => (
              <SongCard
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
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🎵</div>
            <h4 className="text-xl font-semibold text-white mb-2">
              {userSongs.length === 0 ? 'Aucune musique personnelle' : 'Aucun résultat'}
            </h4>
            <p className="text-textMuted mb-6">
              {userSongs.length === 0 
                ? 'Commencez par uploader vos premières musiques !' 
                : 'Essayez de modifier votre recherche'}
            </p>
            {userSongs.length === 0 && (
              <motion.button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-accent transition-all flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
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

export default MyMusicPage;