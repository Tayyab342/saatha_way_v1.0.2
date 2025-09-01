import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Car, FileText, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import RideTrackingModal from './RideTrackingModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    issueDescription: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [submittedRideId, setSubmittedRideId] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-detect location
      detectLocation();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          toast({
            title: "Location detected",
            description: "Your current location has been set automatically.",
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = "Could not detect location. Please enter manually.";
          
          switch(error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = "Location access denied. Please enable location services and try again.";
              break;
            case 2: // POSITION_UNAVAILABLE  
              errorMessage = "Location information unavailable. Please enter manually.";
              break;
            case 3: // TIMEOUT
              errorMessage = "Location request timed out. Please try again.";
              break;
          }
          
          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser. Please enter your location manually.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to book a ride.",
        variant: "destructive",
      });
      navigate('/auth');
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse location coordinates
      const [lat, lng] = formData.location.split(',').map(coord => parseFloat(coord.trim()));
      
      // Submit to Supabase and get the created ride ID
      const { data: rideData, error } = await supabase
        .from('rides')
        .insert({
          user_id: user.id,
          name: formData.name,
          contact: formData.phone,
          vehicle_type: formData.vehicleType,
          issue_description: formData.issueDescription,
          location_lat: lat || null,
          location_lng: lng || null,
          location_address: formData.location,
        })
        .select()
        .single();

      if (error) throw error;

      // Send secure email notification via edge function
      const emailData = {
        subject: `New Ride Booking Request - ${formData.vehicleType}`,
        from_name: formData.name,
        name: formData.name,
        phone: formData.phone,
        vehicle_type: formData.vehicleType,
        issue_description: formData.issueDescription,
        location: formData.location,
        user_email: user.email || '',
      };

      const emailResponse = await supabase.functions.invoke('send-form-email', {
        body: { formData: emailData }
      });

      if (emailResponse.error) {
        throw new Error(emailResponse.error.message || 'Failed to send email notification');
      }

      toast({
        title: "Booking Submitted!",
        description: "Your ride request has been submitted successfully. You can now track your ride status.",
      });
      
      // Store the ride ID and show tracking modal
      setSubmittedRideId(rideData.id);
      setShowTrackingModal(true);
      
      // Close booking modal and reset form
      onClose();
      setFormData({
        name: '',
        phone: '',
        vehicleType: '',
        issueDescription: '',
        location: '',
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-card/95 backdrop-blur-md rounded-3xl shadow-ios-lg border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/10">
              <h2 className="text-2xl font-bold text-foreground">
                {t('bookingTitle')}
              </h2>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary/70 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="w-4 h-4" />
                  {t('name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-ios"
                  placeholder={t('name')}
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Phone className="w-4 h-4" />
                  {t('phoneNumber')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-ios"
                  placeholder={t('phoneNumber')}
                  required
                />
              </div>

              {/* Vehicle Type Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Car className="w-4 h-4" />
                  {t('vehicleType')}
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="input-ios"
                  required
                >
                  <option value="">{t('vehicleType')}</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="w-4 h-4" />
                  {t('currentLocation')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-ios flex-1"
                    placeholder={t('location')}
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={detectLocation}
                    className="btn-secondary px-3 py-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MapPin className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Issue Description Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="w-4 h-4" />
                  {t('issueDescription')}
                </label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  className="input-ios resize-none h-24"
                  placeholder={t('issueDescription')}
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? t('loading') : t('submit')}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
      
      {/* Ride Tracking Modal */}
      {showTrackingModal && submittedRideId && (
        <RideTrackingModal
          isOpen={showTrackingModal}
          onClose={() => setShowTrackingModal(false)}
          rideId={submittedRideId}
        />
      )}
    </AnimatePresence>
  );
};

export default BookingModal;