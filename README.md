# 🎵 MusicVerse Pro

Un site web moderne et interactif pour découvrir, écouter et organiser votre musique préférée.

## ✨ Fonctionnalités

- 🎧 **Player audio interactif** - Lecture, pause, avance/retour, contrôle du volume
- 📋 **Playlists personnelles** - Créez et gérez vos propres playlists
- 🔍 **Recherche avancée** - Trouvez des chansons, artistes et albums
- 🌟 **Découverte musicale** - Explorez les charts, genres et recommandations
- ❤️ **Système de favoris** - Sauvegardez vos morceaux préférés
- 📱 **Design responsive** - Interface optimisée mobile et desktop
- 🎨 **Animations fluides** - Expérience utilisateur moderne avec Framer Motion
- 💾 **Sauvegarde locale** - Vos données sont sauvegardées automatiquement

## 🚀 Installation

1. **Installer les dépendances :**
```bash
npm install
```

2. **Lancer le serveur de développement :**
```bash
npm run dev
```

3. **Ouvrir dans le navigateur :**
Le site sera disponible à l'adresse `http://localhost:3000`

## 🛠️ Technologies utilisées

- **React 18** - Framework JavaScript
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Framework CSS utility-first
- **Framer Motion** - Animations et transitions
- **React Router** - Navigation SPA
- **Deezer API** - Intégration musicale
- **Axios** - Requêtes HTTP
- **Lucide React** - Icônes modernes

## 📁 Structure du projet

```
MusicVerse Pro/
├── public/            # Fichiers statiques
├── src/
│   ├── api/          # Intégration API Deezer
│   ├── components/   # Composants réutilisables
│   ├── context/      # Gestion d'état globale
│   ├── pages/        # Pages de l'application
│   ├── App.jsx       # Composant principal
│   └── main.jsx      # Point d'entrée
├── package.json
└── README.md
```

## 🎯 Utilisation

### Navigation
- **Accueil** : Découvrez les charts et artistes populaires
- **Découvrir** : Explorez par genre musical
- **Favoris** : Consultez vos morceaux favoris
- **Playlists** : Gérez vos playlists personnalisées

### Fonctionnalités principales

1. **Écouter de la musique**
   - Cliquez sur une carte de musique pour la lancer
   - Utilisez les contrôles du player en bas de l'écran

2. **Créer une playlist**
   - Allez dans "Playlists"
   - Cliquez sur "Créer une playlist"
   - Nommez votre playlist

3. **Ajouter des morceaux à une playlist**
   - Cliquez sur le menu (⋮) d'une carte de musique
   - Sélectionnez la playlist de destination

4. **Ajouter aux favoris**
   - Cliquez sur l'icône ❤️ sur une carte de musique
   - Ou depuis le player en cours de lecture

## 🎨 Personnalisation

Les couleurs et le thème peuvent être modifiés dans `tailwind.config.js` :

```js
colors: {
  primary: {
    // Vos couleurs personnalisées
  }
}
```

## 📝 Notes importantes

- L'API Deezer est utilisée pour la recherche et la découverte
- Les previews audio sont limitées à 30 secondes (limitation de l'API Deezer)
- Les données sont sauvegardées localement dans le navigateur (localStorage)

## 🔮 Fonctionnalités futures

- [ ] Système de recommandations IA
- [ ] Chat/commentaires sur les morceaux
- [ ] Système de notation par morceau
- [ ] Synchronisation cloud (Firebase)
- [ ] Mode sombre/clair
# MusicVerse Pro (music-website)

A modern React + Vite music app demo with Tailwind CSS and Firebase integration for authentication, per-user song persistence and simple profile management. It's designed as a learning / prototype project — resembling a small Spotify-like UI for personal music uploads, favorites and playlists.

## Key features

- React 18 + Vite frontend
- Tailwind CSS UI + framer-motion micro-interactions
- Firebase Auth (Google + Email) with popup → redirect fallback
- Firestore: per-user document and songs subcollection
- Firebase Storage: save uploaded audio and profile images
- LocalStorage fallback when Firebase not configured
- Simple profile page, upload modal, favorites, playlists and player

## Quick start (local)

1. Install dependencies

```powershell
npm install
```

2. Add environment variables

Create a file called `.env.local` at the project root (do NOT commit it). Fill it with your Firebase config values (replace the placeholders):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

If you don't configure Firebase, the app will still run using localStorage-only fallbacks, but Google sign-in, upload persistence and profile storage will not work.

3. Start dev server

```powershell
npm run dev
```

Open the Local URL printed by Vite (e.g., `http://localhost:5173`).

## Firebase checklist

To enable full functionality, make sure you do the following in the Firebase console:

1. Authentication → Sign-in method → enable Google and Email/Password.
2. Authentication → Authorized domains → add your dev origin (e.g., `localhost:5173` or the exact URL Vite prints).
3. Firestore → Create a database in test or locked mode depending on your needs.
4. Storage → Create a default Storage bucket.
5. Apply security rules — see `FIREBASE_RULES.md` in the project root for recommended development rules that restrict each user to their own `users/{uid}` doc and `users/{uid}/songs` storage paths. Review & tighten before production.

## How auth works in this project

- The app initializes Firebase during bootstrap (`src/main.jsx` calls `firebaseUtils.initFirebase()`).
- `AuthModal` will try `signInWithGooglePopup()` first and, if the popup fails (blocked), falls back to `signInWithGoogleRedirect()`.
- `src/firebase.js` exposes helpers: `initFirebase`, `onAuthState`, `signInWithGooglePopup`, `signInWithGoogleRedirect`, `signUpWithEmail`, `signInWithEmail`, `signOut`, `uploadSongForUser`, `saveSongMetadata`, `getUserSongs`, `getUserDoc`, `setUserDoc`, `updateUserProfile`.
- On redirect sign-in, Firebase returns to the app and `onAuthState` will run — the app listens to that and loads the user's Firestore doc and songs subcollection.

## Common issues & troubleshooting

- auth/unauthorized-domain: add the dev origin (including port) to Firebase Authorized Domains.
- Popup blocked: the app falls back to redirect sign-in, which requires the same authorized domain config.
- Upload / Firestore errors: ensure Firestore and Storage are enabled and the service account rules permit authenticated users to write to their own paths.
- If the initial "Connectez-vous" overlay remains after sign-in, refresh the page or ensure your redirect returns to the same origin. The app emits an `authSuccess` event when it detects login and the gate listens for it.

Check browser console (DevTools) for errors — they usually show exact Firebase error codes.

## Recommended next steps

- Add upload progress UI and user-friendly error toasts.
- Move playlists to a `users/{uid}/playlists` subcollection to reduce race conditions on concurrent writes.
- Harden Firestore & Storage rules; add server-side validation or Cloud Functions for complex operations.

## Contributing

Feel free to open PRs. If you want me to add CI, deploy scripts or a GitHub Actions workflow to deploy to Firebase Hosting or Vercel, tell me and I can add a simple workflow.

## Credits

- Built with React, Vite, Tailwind CSS, framer-motion and Firebase.

---
If you want, I can now:
- Commit & push this README to the repo (I can run the commands here), or
- Add a short CONTRIBUTING.md and a `.gitignore` suited for Node/Tailwind projects.

Which would you like me to do?






