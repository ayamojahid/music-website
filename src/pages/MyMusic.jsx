import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import MusicCard from '../components/MusicCard';
import { Upload, Music, Trash2, FolderOpen } from 'lucide-react';

const MyMusic = () => {
  const { state, dispatch } = useMusic();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Function to extract metadata from filename
  const parseFileName = (fileName) => {
    // Remove extension
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    // Try to split by common separators
    const parts = nameWithoutExt.split(/[-–—]| - /);
    if (parts.length >= 2) {
      return {
        title: parts[1].trim(),
        artist: parts[0].trim(),
      };
    }
    return {
      title: nameWithoutExt,
      artist: 'Unknown Artist',
    };
  };

  // Convert File to Audio File format and store in IndexedDB
  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const newTracks = [];

    for (const file of files) {
      // Check if file already exists
      const existingFile = state.localFiles.find(
        f => f.title === parseFileName(file.name).title && 
        f.artist === parseFileName(file.name).artist &&
        f.size === file.size
      );

      if (existingFile) continue;

      // Create blob URL
      const blobUrl = URL.createObjectURL(file);
      const metadata = parseFileName(file.name);

      // Get audio duration
      let duration = 0;
      try {
        const audio = new Audio(blobUrl);
        await new Promise((resolve, reject) => {
          audio.onloadedmetadata = () => {
            duration = audio.duration;
            resolve();
          };
          audio.onerror = reject;
        });
      } catch (error) {
        console.error('Error loading audio metadata:', error);
      }

      const track = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: metadata.title,
        artist: metadata.artist,
        album: 'Local Files',
        duration: Math.floor(duration),
        preview: blobUrl, // Use blob URL for local files
        cover: null,
        coverSmall: null,
        coverLarge: null,
        isLocal: true,
        file: file, // Keep reference to File object
        blobUrl: blobUrl,
        size: file.size,
        type: file.type,
        addedAt: new Date().toISOString(),
      };

      // Store file in IndexedDB
      try {
        await storeFileInIndexedDB(track);
      } catch (error) {
        console.error('Error storing file:', error);
      }

      newTracks.push(track);
    }

    if (newTracks.length > 0) {
      dispatch({ type: 'ADD_LOCAL_FILES', payload: newTracks });
    }

    setIsUploading(false);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Store file in IndexedDB
  const storeFileInIndexedDB = async (track) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MusicHubFiles', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');

        // Read file as ArrayBuffer
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = {
            id: track.id,
            data: reader.result,
            metadata: {
              title: track.title,
              artist: track.artist,
              duration: track.duration,
              size: track.size,
              type: track.type,
              addedAt: track.addedAt,
            },
          };

          const putRequest = store.put(fileData);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(track.file);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' });
        }
      };
    });
  };

  // Load files from IndexedDB on mount
  useEffect(() => {
    if (typeof indexedDB === 'undefined') {
      return;
    }
    
    const loadFilesFromIndexedDB = async () => {
      return new Promise((resolve) => {
        try {
          const request = indexedDB.open('MusicHubFiles', 1);

          request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            resolve([]);
          };
          
          request.onsuccess = () => {
            try {
              const db = request.result;
              if (!db.objectStoreNames.contains('files')) {
                resolve([]);
                return;
              }

              const transaction = db.transaction(['files'], 'readonly');
              const store = transaction.objectStore('files');
              const getAllRequest = store.getAll();

              getAllRequest.onsuccess = () => {
                try {
                  const files = getAllRequest.result.map(fileData => {
                    const blob = new Blob([fileData.data], { type: fileData.metadata.type });
                    const blobUrl = URL.createObjectURL(blob);

                    return {
                      id: fileData.id,
                      title: fileData.metadata.title,
                      artist: fileData.metadata.artist,
                      album: 'Local Files',
                      duration: fileData.metadata.duration,
                      preview: blobUrl,
                      cover: null,
                      coverSmall: null,
                      coverLarge: null,
                      isLocal: true,
                      blobUrl: blobUrl,
                      size: fileData.metadata.size,
                      type: fileData.metadata.type,
                      addedAt: fileData.metadata.addedAt,
                    };
                  });

                  if (files.length > 0 && state.localFiles.length === 0) {
                    dispatch({ type: 'ADD_LOCAL_FILES', payload: files });
                  }
                  resolve(files);
                } catch (err) {
                  console.error('Error processing files:', err);
                  resolve([]);
                }
              };

              getAllRequest.onerror = () => {
                console.error('Error getting files:', getAllRequest.error);
                resolve([]);
              };
            } catch (err) {
              console.error('Error accessing IndexedDB:', err);
              resolve([]);
            }
          };

          request.onupgradeneeded = (event) => {
            try {
              const db = event.target.result;
              if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'id' });
              }
            } catch (err) {
              console.error('Error upgrading IndexedDB:', err);
            }
          };
        } catch (error) {
          console.error('Error opening IndexedDB:', error);
          resolve([]);
        }
      });
    };

    loadFilesFromIndexedDB().catch((err) => {
      console.error('Error loading files from IndexedDB:', err);
    });
  }, [state.localFiles.length, dispatch]);

  const handleDeleteFile = async (fileId) => {
    // Remove from IndexedDB
    const request = indexedDB.open('MusicHubFiles', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      store.delete(fileId);
    };

    // Revoke blob URL
    const file = state.localFiles.find(f => f.id === fileId);
    if (file && file.blobUrl) {
      URL.revokeObjectURL(file.blobUrl);
    }

    dispatch({ type: 'REMOVE_LOCAL_FILE', payload: fileId });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Ma Musique
              </h1>
              <p className="text-xl text-gray-400">
                {state.localFiles.length} {state.localFiles.length === 1 ? 'fichier' : 'fichiers'} local{state.localFiles.length > 1 ? 'aux' : ''}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              <Upload size={20} />
              {isUploading ? 'Ajout...' : 'Ajouter des fichiers'}
            </motion.button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="glass-effect rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FolderOpen className="text-primary-500" size={24} />
              <h2 className="text-xl font-semibold">Ajouter vos fichiers audio</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Cliquez sur le bouton ci-dessus pour sélectionner des fichiers audio depuis votre ordinateur.
              Les fichiers seront sauvegardés et disponibles à chaque ouverture du site.
            </p>
            <p className="text-sm text-gray-500">
              Formats supportés: MP3, WAV, OGG, M4A, FLAC, etc.
            </p>
          </div>
        </motion.div>

        {state.localFiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Music className="mx-auto text-gray-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-2">Aucun fichier audio</h2>
            <p className="text-gray-400 mb-6">
              Commencez par ajouter vos fichiers audio locaux
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold transition-colors"
            >
              Ajouter des fichiers
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {state.localFiles.map((track) => (
              <div key={track.id} className="relative group">
                <MusicCard track={track} />
                <button
                  onClick={() => handleDeleteFile(track.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 size={16} />
                </button>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatFileSize(track.size)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMusic;

