import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Home, Info, Phone, Users, Settings, User, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import GoogleTranslate from './GoogleTranslate';
import towTruckLogo from '@/assets/tow-truck-logo.png';

const Navigation = () => {
  const { t, dir } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check current session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/about', label: t('about'), icon: Info },
    { path: '/contact', label: t('contact'), icon: Phone },
    { path: '/driver-application', label: t('driverApp'), icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-glass backdrop-blur-md border-b border-white/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <img src={towTruckLogo} alt="Saatha Way Logo" className="w-10 h-10" />
              <span className="text-xl font-bold text-foreground">
                Saatha Way
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <GoogleTranslate />
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <motion.button
                    className="btn-secondary px-3 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <User className="w-4 h-4" />
                  </motion.button>
                </Link>
                <motion.button
                  onClick={handleSignOut}
                  className="btn-secondary px-3 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
                {user.email === 'admin@saathaway.com' && (
                  <Link to="/admin">
                    <motion.button
                      className="btn-secondary px-3 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Settings className="w-4 h-4" />
                    </motion.button>
                  </Link>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <motion.button
                  className="btn-primary px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 p-4 bg-card/95 backdrop-blur-md rounded-2xl border border-border"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary/50'
                  }`}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
              
              <div className="border-t border-border pt-3 space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <ThemeToggle />
                  <GoogleTranslate />
                </div>
                
                {user ? (
                  <div className="space-y-3">
                    <div className="text-center text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50">
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </div>
                    </Link>
                    {user.email === 'admin@saathaway.com' && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50">
                          <Settings className="w-5 h-5" />
                          <span className="font-medium">Admin Panel</span>
                        </div>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 text-destructive"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary text-primary-foreground">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Sign In</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;