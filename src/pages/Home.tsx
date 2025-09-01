import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Shield, Star, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingModal from '@/components/BookingModal';
import RideTrackingModal from '@/components/RideTrackingModal';
import Footer from '@/components/Footer';

const Home = () => {
  const { t } = useLanguage();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const features = [
    {
      icon: MapPin,
      title: t('gpsTracking'),
      description: t('gpsDescription'),
    },
    {
      icon: Clock,
      title: t('serviceTitle'),
      description: t('serviceDescription'),
    },
    {
      icon: Shield,
      title: t('safeSecure'),
      description: t('safeDescription'),
    },
    {
      icon: Star,
      title: t('topRated'),
      description: t('topDescription'),
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {t('heroTitle')}
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              {t('heroSubtitle')}
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <motion.button
                onClick={() => setShowBookingModal(true)}
                className="btn-primary px-12 py-4 text-lg font-semibold"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('bookRide')}
              </motion.button>
              
              <motion.button
                onClick={() => setShowTrackingModal(true)}
                className="btn-secondary px-12 py-4 text-lg font-semibold flex items-center gap-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
                Track Ride
              </motion.button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Saatha Way?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide reliable, professional towing services with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card-glass p-8 text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-ios group-hover:shadow-ios-lg transition-shadow">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Need Immediate Assistance?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our professional drivers are standing by to help you get back on the road safely
            </p>
            <motion.button
              onClick={() => setShowBookingModal(true)}
              className="btn-primary px-10 py-3 text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('bookRide')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
      
      {/* Ride Tracking Modal */}
      <RideTrackingModal
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;