const SongCard = ({ song, onPlay, showDeleteButton = false, onDelete }) => {
  const { favorites, toggleFavorite, playlists, addToPlaylist, createPlaylist } = React.useContext(MusicContext);
  const isFavorite = favorites.includes(song.id);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  // ... ton code existant ...

  return (
    <motion.div
      className="music-card group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-2xl">
            {song.cover}
          </div>
          <motion.button
            onClick={() => onPlay(song)}
            className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
          >
            <Play size={24} className="text-white" fill="white" />
          </motion.button>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{song.title}</h4>
          <p className="text-textMuted text-sm">{song.artist}</p>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-xs text-textMuted">{song.duration}</span>
            <span className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded-full">
              {song.genre}
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-textMuted">{song.popularity}%</span>
            </div>
            {song.isUserUploaded && (
              <span className="text-xs px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full">
                Ma musique
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* NOUVEAU: Bouton supprimer pour les musiques uploadées */}
          {showDeleteButton && song.isUserUploaded && (
            <motion.button
              onClick={() => onDelete(song.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-full transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Supprimer cette musique"
            >
              <X size={18} />
            </motion.button>
          )}

          {/* ... reste de tes boutons existants ... */}
        </div>
      </div>
    </motion.div>
  );
};