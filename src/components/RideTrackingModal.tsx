import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Navigation, Search } from 'lucide-react';
import RideStatus3D from './RideStatus3D';
import { useRideStatus } from '@/hooks/useRideStatus';
import { useCurrentRide } from '@/hooks/useCurrentRide';

interface RideTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideId?: string;
}

const RideTrackingModal: React.FC<RideTrackingModalProps> = ({
  isOpen,
  onClose,
  rideId: initialRideId,
}) => {
  const [rideId, setRideId] = useState(initialRideId || '');
  const [isTracking, setIsTracking] = useState(!!initialRideId);
  const [manualSearch, setManualSearch] = useState(false);
  const { currentRideId, loading: currentRideLoading } = useCurrentRide();
  const { rideStatus, loading } = useRideStatus(isTracking ? rideId : undefined);

  // Auto-track current ride when modal opens
  useEffect(() => {
    if (isOpen && !initialRideId && currentRideId && !manualSearch) {
      setRideId(currentRideId);
      setIsTracking(true);
    } else if (isOpen && !initialRideId && !currentRideId && !currentRideLoading) {
      // Show "no active ride" immediately if no current ride found
      setIsTracking(false);
      setManualSearch(false);
    }
  }, [isOpen, currentRideId, initialRideId, manualSearch, currentRideLoading]);

  const handleTrackRide = () => {
    if (rideId.trim()) {
      setIsTracking(true);
    }
  };

  const handleBack = () => {
    setIsTracking(false);
    setRideId('');
    setManualSearch(false);
  };

  const handleManualSearch = () => {
    setManualSearch(true);
    setIsTracking(false);
    setRideId('');
  };

  const getEstimatedTime = () => {
    switch (rideStatus?.status) {
      case 'pending':
        return '5-10 minutes';
      case 'en-route':
        return '15-25 minutes';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const getDriverName = () => {
    // In a real app, this would come from the ride data
    return 'Ahmed Al-Rashid';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Track Your Ride</h2>
                {isTracking && rideId && (
                  <p className="text-muted-foreground text-sm">
                    Ride ID: {rideId.slice(0, 8)}...
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isTracking && !initialRideId && (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Loading Current Ride */}
            {currentRideLoading && !isTracking && !manualSearch && (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Checking for active rides...</p>
              </div>
            )}

            {/* No Current Ride Found */}
            {!currentRideLoading && !currentRideId && !isTracking && !manualSearch && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Ride Booked
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  You don't have any active rides to track. Book a ride first to see real-time tracking.
                </p>
                <motion.button
                  onClick={handleManualSearch}
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search by Ride ID
                </motion.button>
              </div>
            )}

            {/* Ride ID Input Form */}
            {(!isTracking && manualSearch) && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <Search className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Enter Ride ID
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Enter your ride ID to track your current ride status
                  </p>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={rideId}
                    onChange={(e) => setRideId(e.target.value)}
                    placeholder="Enter your ride ID"
                    className="w-full p-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <motion.button
                    onClick={handleTrackRide}
                    disabled={!rideId.trim()}
                    className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: rideId.trim() ? 1.02 : 1 }}
                    whileTap={{ scale: rideId.trim() ? 0.98 : 1 }}
                  >
                    Track Ride
                  </motion.button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && isTracking && (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading ride status...</p>
              </div>
            )}

            {/* No Ride Found */}
            {isTracking && !loading && !rideStatus && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <X className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ride Not Found
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  No ride found with ID: {rideId}
                </p>
                <motion.button
                  onClick={handleBack}
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Again
                </motion.button>
              </div>
            )}

            {/* Ride Status Content */}
            {rideStatus && !loading && isTracking && (
              <div className="p-6 space-y-6">
                {/* 3D Status Display */}
                <RideStatus3D
                  status={rideStatus.status}
                  rideData={{
                    pickupLocation: rideStatus.location_address,
                    estimatedTime: getEstimatedTime(),
                    driverName: getDriverName(),
                  }}
                />

                {/* Ride Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Pickup Location</h4>
                      <p className="text-sm text-muted-foreground">
                        {rideStatus.location_address}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Vehicle Type</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {rideStatus.vehicle_type}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Issue Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {rideStatus.issue_description}
                    </p>
                  </div>
                </div>

                {/* Driver Actions (only show when en-route) */}
                {rideStatus.status === 'en-route' && (
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-semibold text-foreground">Driver Contact</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        className="flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Phone className="w-4 h-4" />
                        Call Driver
                      </motion.button>
                      <motion.button
                        className="flex items-center justify-center gap-2 p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Live Location Button */}
                {rideStatus.status === 'en-route' && (
                  <motion.button
                    className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-primary text-white rounded-lg font-semibold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Navigation className="w-5 h-5" />
                    View Live Location
                  </motion.button>
                )}

                {/* Completion Message */}
                {rideStatus.status === 'completed' && (
                  <motion.div
                    className="text-center p-6 bg-success/10 rounded-lg border border-success/20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-semibold text-success mb-2">
                      Ride Completed Successfully!
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Thank you for choosing Saatha Way. We hope you had a great experience!
                    </p>
                    <motion.button
                      className="btn-primary"
                      onClick={onClose}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RideTrackingModal;