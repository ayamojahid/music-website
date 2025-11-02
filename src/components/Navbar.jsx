
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Library, Music, Folder, User } from 'lucide-react';
import { motion } from 'framer-motion';

// Small auth widget shows Connexion button or user info when logged in
function AuthWidget() {
  const [user, setUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('musicHub-user');
        if (raw) setUser(JSON.parse(raw));
        else setUser(null);
      } catch (e) {
        setUser(null);
      }
    };

    load();
    const onStorage = () => load();
    window.addEventListener('storage', onStorage);
    // also listen to custom events
    window.addEventListener('userChanged', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('userChanged', onStorage);
    };
  }, []);

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-200 hover:text-white hover:bg-white/10"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">{(user.username || user.displayName || user.email || 'U')[0].toUpperCase()}</div>
          <div className="hidden sm:block text-left">
            <div className="text-sm">Bonjour,</div>
            <div className="font-medium">{user.username || user.displayName || user.email}</div>
          </div>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-md shadow-lg p-3 z-50">
            <div className="mb-2">
              <div className="text-xs text-gray-400">Connecté en tant que</div>
              <div className="font-semibold">{user.displayName || user.username || user.email}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { window.dispatchEvent(new CustomEvent('logout')); setOpen(false); }}
                className="flex-1 px-3 py-2 bg-red-600 rounded text-white text-sm"
              >
                Se déconnecter
              </button>
              <button
                onClick={() => { window.dispatchEvent(new CustomEvent('openProfile')); setOpen(false); }}
                className="flex-1 px-3 py-2 bg-gray-800 rounded text-white text-sm border border-gray-700"
              >
                Mon compte
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('openAuth'))}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-200 hover:text-white hover:bg-white/10"
    >
      <User size={18} />
      <span className="font-medium">Connexion</span>
    </button>
  );
}

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/discover', icon: Search, label: 'Découvrir' },
  { path: '/my-music', icon: Folder, label: 'Ma Musique' },
    { path: '/favorites', icon: Heart, label: 'Favoris' },
    { path: '/playlists', icon: Library, label: 'Playlists' },
  ];

  return (
    <nav className="glass-effect border-b border-white/20 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Music className="text-primary-500" size={28} />
            <span className="text-xl font-bold gradient-text">Music Hub</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
            {/* Connexion / Mon compte */}
            <AuthWidget />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

