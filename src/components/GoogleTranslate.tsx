import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslate = () => {
  const googleTranslateRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    // Load Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (googleTranslateRef.current && !googleTranslateRef.current.hasChildNodes()) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: language === 'ar' ? 'ar' : 'en', // Use current language as page language
            includedLanguages: 'en,ar,ur,hi,es,fr,de,it,pt,ru,ja,ko,zh,tr,fa,sw',
            layout: window.google.translate.TranslateElement.InlineLayout.DROPDOWN,
            autoDisplay: false,
            multilanguagePage: true,
            gaTrack: true,
            gaId: 'UA-XXXXX-Y'
          },
          googleTranslateRef.current
        );
      }
    };

    // Initialize if Google Translate is already loaded
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, [language]);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="btn-glass px-4 py-2 flex items-center gap-2 cursor-pointer">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Translate</span>
        <div 
          ref={googleTranslateRef}
          className="google-translate-element absolute top-full left-0 mt-2 z-[9999]"
          style={{ 
            background: 'transparent'
          }}
        />
      </div>
      
      <style>{`
        .google-translate-element {
          position: absolute !important;
          z-index: 9999 !important;
        }
        
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 12px !important;
          background: rgba(0, 0, 0, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 12px !important;
          padding: 8px 12px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
          color: white !important;
        }
        
        .goog-te-gadget-simple {
          background: rgba(0, 0, 0, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 12px !important;
          font-size: 12px !important;
          line-height: 20px !important;
          padding: 8px 12px !important;
          color: white !important;
        }
        
        .goog-te-gadget-simple .goog-te-menu-value {
          color: white !important;
          font-family: inherit !important;
        }
        
        .goog-te-gadget-simple .goog-te-menu-value:before {
          color: white !important;
        }
        
        .goog-te-gadget .goog-te-combo {
          background: rgba(0, 0, 0, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          color: white !important;
          font-family: inherit !important;
          font-size: 12px !important;
          padding: 4px 8px !important;
          min-width: 120px !important;
        }
        
        .goog-te-gadget .goog-te-combo option {
          background: rgba(0, 0, 0, 0.95) !important;
          color: white !important;
          font-family: inherit !important;
        }
        
        .goog-te-menu-frame {
          background: rgba(0, 0, 0, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border-radius: 12px !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
          z-index: 9999 !important;
        }
        
        .goog-te-menu2 {
          background: transparent !important;
          border: none !important;
          max-height: 300px !important;
          overflow-y: auto !important;
        }
        
        .goog-te-menu2-item {
          color: white !important;
          font-family: inherit !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          margin: 2px !important;
        }
        
        .goog-te-menu2-item:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        
        .goog-te-menu2-item-selected {
          background: rgba(59, 130, 246, 0.3) !important;
        }
        
        /* Hide the Google Translate banner */
        .goog-te-banner-frame {
          display: none !important;
        }
        
        /* Hide the Google Translate top frame */
        .goog-te-ftab {
          display: none !important;
        }
        
        body {
          top: 0 !important;
        }
      `}</style>
    </motion.div>
  );
};

export default GoogleTranslate;