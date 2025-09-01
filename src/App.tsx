import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

// Context
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import Navigation from './components/Navigation';

// Pages
import Splash from './pages/Splash';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import DriverApplication from './pages/DriverApplication';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Services from './pages/Services';
import EmergencyTowing from './pages/services/EmergencyTowing';
import RoadsideAssistance from './pages/services/RoadsideAssistance';
import VehicleRecovery from './pages/services/VehicleRecovery';
import FlatbedTowing from './pages/services/FlatbedTowing';
import MotorcycleTowing from './pages/services/MotorcycleTowing';
import NotFound from "./pages/NotFound";
import FuturisticBackground from './components/FuturisticBackground';

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              {showSplash ? (
                <Splash key="splash" onComplete={handleSplashComplete} />
              ) : (
                <div key="app" className="min-h-screen bg-background relative">
                  <FuturisticBackground />
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/driver-application" element={<DriverApplication />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/emergency-towing" element={<EmergencyTowing />} />
                    <Route path="/services/roadside-assistance" element={<RoadsideAssistance />} />
                    <Route path="/services/vehicle-recovery" element={<VehicleRecovery />} />
                    <Route path="/services/flatbed-towing" element={<FlatbedTowing />} />
                    <Route path="/services/motorcycle-towing" element={<MotorcycleTowing />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              )}
            </AnimatePresence>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
