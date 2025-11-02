// Version minimale pour test
import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      background: 'linear-gradient(to bottom right, #18181b, #27272a)', 
      color: 'white', 
      minHeight: '100vh' 
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎵 Music Hub</h1>
      <p>Version minimale - Test en cours...</p>
      <p style={{ marginTop: '1rem', color: '#9ca3af' }}>
        Si vous voyez ce message, le problème vient d'un composant spécifique.
      </p>
    </div>
  );
}

export default App;

