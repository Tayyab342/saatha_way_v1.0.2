import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import towTruckLogo from '@/assets/tow-truck-logo.png';

interface SplashProps {
  onComplete: () => void;
}

const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 800);
    const timer2 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-hero flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="text-center">
        {/* Logo Animation */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.2
          }}
        >
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-ios-lg p-2">
            <img src={towTruckLogo} alt="Saatha Way" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        {/* Text Animation */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t('heroTitle')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('heroSubtitle')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Splash;