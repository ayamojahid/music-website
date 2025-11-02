// src/App-simple.js
import React from 'react';

function AppSimple() {
  return (
    <div style={{ padding: '20px', background: 'lightblue' }}>
      <h1>🚀 TEST REACT - Ça marche !</h1>
      <p>Si vous voyez ce texte, React fonctionne</p>
      <button onClick={() => alert('Test réussi!')}>
        Cliquez-moi
      </button>
    </div>
  );
}

export default AppSimple;