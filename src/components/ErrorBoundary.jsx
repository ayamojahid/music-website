import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          background: '#1a1a1a', 
          color: 'white', 
          minHeight: '100vh',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ff4444' }}>Erreur</h1>
          <p>Quelque chose sest mal passé : {this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#1DB954',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Rafraîchir la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;