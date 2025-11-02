import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Music } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Personnalisé');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const genres = ["Personnalisé", "Pop", "Hip-Hop", "Rock", "Electronic", "R&B", "Rap Français", "Variété"];

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      // Auto-remplir le titre avec le nom du fichier
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

  const handleSubmit = () => {
    if (!file) {
      alert('Veuillez sélectionner un fichier audio');
      return;
    }

    if (!title.trim()) {
      alert('Veuillez entrer un titre pour la musique');
      return;
    }

    onUpload(file, title, artist, genre);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setArtist('');
    setGenre('Personnalisé');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-dark-100 rounded-2xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Ajouter ma musique</h3>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-textMuted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Zone de drag & drop */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-all ${
            isDragging 
              ? 'border-primary bg-primary bg-opacity-10' 
              : 'border-gray-600 hover:border-primary'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          
          <Upload size={48} className="mx-auto mb-4 text-textMuted" />
          <p className="text-white font-medium mb-2">
            {file ? 'Fichier sélectionné' : 'Glissez votre musique ici'}
          </p>
          <p className="text-textMuted text-sm">
            {file ? file.name : 'ou cliquez pour parcourir'}
          </p>
          <p className="text-textMuted text-xs mt-2">
            MP3, WAV, FLAC, etc.
          </p>
        </div>

        {/* Formulaire */}
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dark-200 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Titre de la chanson"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Artiste
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-dark-200 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nom de l'artiste"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-dark-200 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex-1 bg-dark-200 text-white px-4 py-3 rounded-lg font-medium hover:bg-dark-300 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-accent transition-colors flex items-center justify-center space-x-2"
          >
            <Upload size={20} />
            <span>Uploader</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UploadModal;