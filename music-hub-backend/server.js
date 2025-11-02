// AJOUTE CES ROUTES DANS server.js APRÈS LES AUTRES ROUTES

// Google OAuth simulation (pour le moment)
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    
    // Simuler la création d'un utilisateur Google
    const user = {
      id: googleId || Date.now(),
      email: email,
      username: name,
      avatar: '👤',
      isGoogleUser: true
    };

    // Générer un token
    const token = `google_token_${Date.now()}`;

    res.json({
      success: true,
      message: 'Google login successful',
      user: user,
      token: token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Sauvegarder les données utilisateur
app.post('/api/user/save-data', async (req, res) => {
  try {
    const { userId, favorites, playlists, history, settings } = req.body;
    
    console.log('💾 Sauvegarde des données pour user:', userId);
    console.log('❤️ Favoris:', favorites?.length);
    console.log('📝 Playlists:', playlists?.length);
    console.log('⏰ Historique:', history?.length);
    
    // Ici tu sauvegarderais dans la base de données
    // Pour l'instant on simule
    
    res.json({
      success: true,
      message: 'Data saved successfully',
      savedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Charger les données utilisateur
app.get('/api/user/data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('📥 Chargement des données pour user:', userId);
    
    // Données simulées (dans un vrai app, tu les chargerais depuis la DB)
    const userData = {
      favorites: [],
      playlists: [],
      history: [],
      settings: { theme: 'dark', language: 'fr' }
    };
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});