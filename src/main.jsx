import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import firebaseUtils from './firebase'

// main bundle loaded

// Initialize Firebase early so auth/storage are ready when UI needs them.
try {
  firebaseUtils.initFirebase();
} catch (err) {
  // initFirebase logs a warning when env vars are missing; swallow here
  console.warn('Firebase init skipped or failed:', err?.message || err);
}
// expose helper for other modules (and for App fallback)
try { window.firebaseUtils = firebaseUtils; } catch (e) {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)