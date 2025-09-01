import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Car, Clock, TrendingUp, Eye, Edit, Trash2, Download, LogOut, UserCheck, Calendar, CreditCard, CheckCircle, XCircle, Mail, MessageSquare, DollarSign, Shield, Filter, Search, Bell, BarChart3, RefreshCw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

interface Ride {
  id: string;
  name: string;
  contact: string;
  vehicle_type: string;
  location_address: string;
  issue_description: string;
  status: 'pending' | 'en-route' | 'completed';
  created_at: string;
  user_id: string;
}

interface DriverApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  license_number: string;
  experience_years: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate: string;
  previous_experience: string;
  availability: string;
  subscription_duration: string;
  subscription_price: number;
  subscription_start_date: string;
  subscription_end_date: string;
  payment_status: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalRides: number;
  pendingRides: number;
  completedRides: number;
  totalDrivers: number;
  pendingDrivers: number;
}

const Admin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalRides: 0,
    pendingRides: 0,
    completedRides: 0,
    totalDrivers: 0,
    pendingDrivers: 0,
  });
  const [rides, setRides] = useState<Ride[]>([]);
  const [driverApplications, setDriverApplications] = useState<DriverApplication[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverApplication | null>(null);
  const [editingDriver, setEditingDriver] = useState<DriverApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Check authentication and admin status
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          navigate('/auth');
          return;
        }
        
        if (!session || session.user.email?.toLowerCase() !== 'admin@saathaway.com') {
          navigate('/auth');
          return;
        }
        
        setUser(session.user);
        await fetchData();
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin auth:', error);
        navigate('/auth');
      }
    };

    checkAdminAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session || session.user.email?.toLowerCase() !== 'admin@saathaway.com') {
          navigate('/auth');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch rides
      const { data: ridesData, error: ridesError } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });

      if (ridesError) throw ridesError;
      setRides((ridesData || []).map(ride => ({
        ...ride,
        status: ride.status as 'pending' | 'en-route' | 'completed'
      })));

      // Fetch driver applications
      const { data: driversData, error: driversError } = await supabase
        .from('driver_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (driversError) throw driversError;
      setDriverApplications(driversData || []);

      // Fetch user count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Calculate stats
      const totalRides = ridesData?.length || 0;
      const pendingRides = ridesData?.filter(ride => ride.status === 'pending').length || 0;
      const completedRides = ridesData?.filter(ride => ride.status === 'completed').length || 0;
      const totalDrivers = driversData?.length || 0;
      const pendingDrivers = driversData?.filter(driver => driver.status === 'pending').length || 0;

      // Generate notifications for pending items
      const newNotifications = [
        ...(pendingRides > 0 ? [{ type: 'ride', count: pendingRides, message: `${pendingRides} pending ride${pendingRides > 1 ? 's' : ''} need attention` }] : []),
        ...(pendingDrivers > 0 ? [{ type: 'driver', count: pendingDrivers, message: `${pendingDrivers} driver application${pendingDrivers > 1 ? 's' : ''} awaiting review` }] : [])
      ];
      setNotifications(newNotifications);

      setStats({
        totalUsers: userCount || 0,
        totalRides,
        pendingRides,
        completedRides,
        totalDrivers,
        pendingDrivers,
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const updateRideStatus = async (rideId: string, newStatus: 'pending' | 'en-route' | 'completed') => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status: newStatus })
        .eq('id', rideId);

      if (error) throw error;

      setRides(prev => prev.map(ride => 
        ride.id === rideId ? { ...ride, status: newStatus } : ride
      ));

      toast({
        title: "Status Updated",
        description: `Ride status changed to ${newStatus}`,
      });

      // Refresh stats
      await fetchData();
    } catch (error) {
      console.error('Error updating ride status:', error);
      toast({
        title: "Error",
        description: "Failed to update ride status",
        variant: "destructive",
      });
    }
  };

  const deleteRide = async (rideId: string) => {
    if (!confirm('Are you sure you want to delete this ride?')) return;

    try {
      const { error } = await supabase
        .from('rides')
        .delete()
        .eq('id', rideId);

      if (error) throw error;

      setRides(prev => prev.filter(ride => ride.id !== rideId));
      
      toast({
        title: "Ride Deleted",
        description: "Ride has been successfully deleted",
      });

      // Refresh stats
      await fetchData();
    } catch (error) {
      console.error('Error deleting ride:', error);
      toast({
        title: "Error",
        description: "Failed to delete ride",
        variant: "destructive",
      });
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['ID', 'Customer Name', 'Contact', 'Vehicle Type', 'Location', 'Issue', 'Status', 'Created At'],
      ...rides.map(ride => [
        ride.id,
        ride.name,
        ride.contact,
        ride.vehicle_type,
        ride.location_address,
        ride.issue_description,
        ride.status,
        new Date(ride.created_at).toLocaleString(),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saatha-way-rides-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning/10';
      case 'en-route': return 'text-primary bg-primary/10';
      case 'completed': return 'text-success bg-success/10';
      case 'approved': return 'text-success bg-success/10';
      case 'rejected': return 'text-destructive bg-destructive/10';
      case 'under_review': return 'text-primary bg-primary/10';
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'suspended': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const updateDriverStatus = async (driverId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('driver_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', driverId)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from update');
      }

      // Update local state immediately with confirmed data
      setDriverApplications(prev => prev.map(driver => 
        driver.id === driverId ? { ...driver, ...data } : driver
      ));

      toast({
        title: "Success",
        description: `Driver status updated to ${newStatus}`,
      });

    } catch (error: any) {
      console.error('Error updating driver status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update driver status",
        variant: "destructive",
      });
    }
  };

  const updateDriverPaymentStatus = async (driverId: string, newPaymentStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('driver_applications')
        .update({ 
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', driverId)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from update');
      }

      // Update local state immediately with confirmed data
      setDriverApplications(prev => prev.map(driver => 
        driver.id === driverId ? { ...driver, ...data } : driver
      ));

      toast({
        title: "Success",
        description: `Payment status updated to ${newPaymentStatus}`,
      });

    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const deleteDriverApplication = async (driverId: string) => {
    if (!confirm('Are you sure you want to delete this driver application?')) return;

    try {
      const { error } = await supabase
        .from('driver_applications')
        .delete()
        .eq('id', driverId);

      if (error) throw error;

      setDriverApplications(prev => prev.filter(driver => driver.id !== driverId));
      
      toast({
        title: "Application Deleted",
        description: "Driver application has been successfully deleted",
      });

      await fetchData();
    } catch (error) {
      console.error('Error deleting driver application:', error);
      toast({
        title: "Error",
        description: "Failed to delete driver application",
        variant: "destructive",
      });
    }
  };

  const sendDriverEmail = (email: string, subject: string) => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.open(mailtoLink, '_blank');
  };

  const exportDriversCSV = () => {
    const csvContent = [
      ['ID', 'Full Name', 'Email', 'Phone', 'License', 'Vehicle', 'Experience', 'Status', 'Payment Status', 'Applied Date'],
      ...driverApplications.map(driver => [
        driver.id,
        driver.full_name,
        driver.email,
        driver.phone,
        driver.license_number,
        `${driver.vehicle_make} ${driver.vehicle_model} (${driver.vehicle_year})`,
        `${driver.experience_years} years`,
        driver.status,
        driver.payment_status,
        new Date(driver.created_at).toLocaleString(),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saatha-way-drivers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Bulk operations
  const bulkUpdateRideStatus = async (rideIds: string[], newStatus: 'pending' | 'en-route' | 'completed') => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status: newStatus })
        .in('id', rideIds);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Bulk Update Complete",
        description: `Updated ${rideIds.length} ride(s) to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error in bulk update:', error);
      toast({
        title: "Error",
        description: "Failed to update rides",
        variant: "destructive",
      });
    }
  };

  const bulkDeleteRides = async (rideIds: string[]) => {
    if (!confirm(`Are you sure you want to delete ${rideIds.length} ride(s)?`)) return;

    try {
      const { error } = await supabase
        .from('rides')
        .delete()
        .in('id', rideIds);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Bulk Delete Complete",
        description: `Deleted ${rideIds.length} ride(s)`,
      });
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast({
        title: "Error",
        description: "Failed to delete rides",
        variant: "destructive",
      });
    }
  };

  // Filter functions
  const filteredRides = rides.filter(ride => {
    const matchesSearch = searchTerm === '' || 
      ride.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.contact.includes(searchTerm) ||
      ride.location_address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredDrivers = driverApplications.filter(driver => {
    const matchesSearch = searchTerm === '' || 
      driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Real-time refresh
  const handleRefresh = () => {
    fetchData();
    toast({
      title: "Data Refreshed",
      description: "All data has been updated",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Header */}
      <section className="py-8 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user?.email}
              </p>
            </motion.div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </motion.button>
                
                {showNotifications && (
                  <motion.div
                    className="absolute right-0 top-12 w-80 bg-background border border-border rounded-lg shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif, idx) => (
                          <div key={idx} className="p-3 border-b border-border hover:bg-secondary/50">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-warning" />
                              <span className="text-sm">{notif.message}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No notifications
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Refresh Button */}
              <motion.button
                onClick={handleRefresh}
                className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>

              {/* Sign Out */}
              <motion.button
                onClick={handleSignOut}
                className="btn-secondary px-4 py-2 flex items-center gap-2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {[
              { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'text-primary' },
              { icon: Car, label: 'Total Rides', value: stats.totalRides, color: 'text-success' },
              { icon: Clock, label: 'Pending Rides', value: stats.pendingRides, color: 'text-warning' },
              { icon: TrendingUp, label: 'Completed Rides', value: stats.completedRides, color: 'text-green-500' },
              { icon: UserCheck, label: 'Total Drivers', value: stats.totalDrivers, color: 'text-blue-500' },
              { icon: Calendar, label: 'Pending Drivers', value: stats.pendingDrivers, color: 'text-orange-500' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="card-glass p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rides Management */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <motion.div
            className="card-glass p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Ride Management
              </h2>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleRefresh}
                  className="btn-secondary px-4 py-2 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </motion.button>
                <motion.button
                  onClick={exportCSV}
                  className="btn-secondary px-4 py-2 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </motion.button>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search rides by name, contact, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="en-route">En Route</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {filteredRides.length > 0 && (
              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <span>Showing {filteredRides.length} of {rides.length} rides</span>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => {
                      const selectedIds = filteredRides.map(r => r.id);
                      if (selectedIds.length > 0) {
                        bulkUpdateRideStatus(selectedIds, 'en-route');
                      }
                    }}
                    className="btn-secondary text-xs px-3 py-1"
                    whileHover={{ scale: 1.05 }}
                    disabled={filteredRides.length === 0}
                  >
                    Bulk En Route
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      const selectedIds = filteredRides.map(r => r.id);
                      if (selectedIds.length > 0) {
                        bulkUpdateRideStatus(selectedIds, 'completed');
                      }
                    }}
                    className="btn-secondary text-xs px-3 py-1"
                    whileHover={{ scale: 1.05 }}
                    disabled={filteredRides.length === 0}
                  >
                    Bulk Complete
                  </motion.button>
                </div>
              </div>
            )}

            {filteredRides.length === 0 && searchTerm === '' && statusFilter === 'all' ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No rides yet</h3>
                <p className="text-muted-foreground">Rides will appear here when customers book services.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Vehicle</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Issue</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRides.map((ride, index) => (
                      <motion.tr
                        key={ride.id}
                        className="border-b border-border/50 hover:bg-secondary/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{ride.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {ride.location_address}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{ride.contact}</td>
                        <td className="py-4 px-4">
                          <span className="capitalize text-foreground">{ride.vehicle_type}</span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground max-w-xs truncate">
                          {ride.issue_description}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={ride.status}
                            onChange={(e) => updateRideStatus(ride.id, e.target.value as any)}
                            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(ride.status)} border border-border bg-background`}
                          >
                            <option value="pending">Pending</option>
                            <option value="en-route">En Route</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">
                          {new Date(ride.created_at).toLocaleDateString()} {new Date(ride.created_at).toLocaleTimeString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => deleteRide(ride.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Driver Applications Management */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <motion.div
            className="card-glass p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Driver Applications
              </h2>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleRefresh}
                  className="btn-secondary px-4 py-2 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </motion.button>
                <motion.button
                  onClick={exportDriversCSV}
                  className="btn-secondary px-4 py-2 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </motion.button>
                <div className="text-sm text-muted-foreground">
                  {driverApplications.length} applications total
                </div>
              </div>
            </div>

            {/* Search and Filter Controls for Drivers */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search drivers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>
            </div>

            {filteredDrivers.length > 0 && (
              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <span>Showing {filteredDrivers.length} of {driverApplications.length} applications</span>
              </div>
            )}

            {filteredDrivers.length === 0 && searchTerm === '' && statusFilter === 'all' ? (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No driver applications yet</h3>
                <p className="text-muted-foreground">Driver applications will appear here when submitted.</p>
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No applications match your search</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Driver Info</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Vehicle</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Subscription</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Applied</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.map((driver, index) => (
                      <motion.tr
                        key={driver.id}
                        className="border-b border-border/50 hover:bg-secondary/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{driver.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              License: {driver.license_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Experience: {driver.experience_years} years
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-foreground">{driver.email}</p>
                            <p className="text-sm text-muted-foreground">{driver.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-foreground">{driver.vehicle_make} {driver.vehicle_model}</p>
                            <p className="text-sm text-muted-foreground">
                              {driver.vehicle_year} • {driver.vehicle_plate}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-foreground font-medium">
                              {driver.subscription_duration === '6months' ? '6 Months' : '1 Year'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {driver.subscription_price} SAR
                            </p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              driver.payment_status === 'pending' 
                                ? 'bg-warning/10 text-warning' 
                                : 'bg-success/10 text-success'
                            }`}>
                              {driver.payment_status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={driver.status}
                            onChange={(e) => updateDriverStatus(driver.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(driver.status)} border border-border bg-background`}
                          >
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">
                          {new Date(driver.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => setSelectedDriver(driver)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => setEditingDriver(driver)}
                              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Edit Driver"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => sendDriverEmail(driver.email, 'Regarding your driver application')}
                              className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Send Email"
                            >
                              <Mail className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => deleteDriverApplication(driver.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete Application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Driver Details Modal */}
      {selectedDriver && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedDriver(null)}
        >
          <motion.div
            className="card-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Driver Details</h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => sendDriverEmail(selectedDriver.email, 'Regarding your driver application')}
                    className="btn-secondary px-3 py-2 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </motion.button>
                  <button
                    onClick={() => setSelectedDriver(null)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Status Management */}
                <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Application Status</label>
                    <select
                      value={selectedDriver.status}
                      onChange={(e) => updateDriverStatus(selectedDriver.id, e.target.value)}
                      className="block mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                    <select
                      value={selectedDriver.payment_status}
                      onChange={(e) => updateDriverPaymentStatus(selectedDriver.id, e.target.value)}
                      className="block mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Personal Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-foreground">{selectedDriver.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground">{selectedDriver.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-foreground">{selectedDriver.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">License Number</label>
                      <p className="text-foreground">{selectedDriver.license_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Experience</label>
                      <p className="text-foreground">{selectedDriver.experience_years} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Availability</label>
                      <p className="text-foreground capitalize">{selectedDriver.availability}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Vehicle Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Vehicle Make</label>
                      <p className="text-foreground">{selectedDriver.vehicle_make}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Vehicle Model</label>
                      <p className="text-foreground">{selectedDriver.vehicle_model}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Vehicle Year</label>
                      <p className="text-foreground">{selectedDriver.vehicle_year}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Plate Number</label>
                      <p className="text-foreground">{selectedDriver.vehicle_plate}</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Information */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Subscription Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Duration</label>
                      <p className="text-foreground">
                        {selectedDriver.subscription_duration === '6months' ? '6 Months' : '1 Year'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Price</label>
                      <p className="text-foreground">{selectedDriver.subscription_price} SAR</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                      <p className="text-foreground">
                        {new Date(selectedDriver.subscription_start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">End Date</label>
                      <p className="text-foreground">
                        {new Date(selectedDriver.subscription_end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        selectedDriver.payment_status === 'pending' 
                          ? 'bg-warning/10 text-warning' 
                          : selectedDriver.payment_status === 'paid'
                          ? 'bg-success/10 text-success'
                          : selectedDriver.payment_status === 'overdue'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted/10 text-muted-foreground'
                      }`}>
                        {selectedDriver.payment_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Previous Experience */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Previous Experience</h4>
                  <div className="card-glass p-4">
                    <p className="text-muted-foreground">
                      {selectedDriver.previous_experience || 'No previous experience provided'}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <motion.button
                    onClick={() => updateDriverStatus(selectedDriver.id, 'approved')}
                    className="btn-primary px-4 py-2 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </motion.button>
                  <motion.button
                    onClick={() => updateDriverStatus(selectedDriver.id, 'rejected')}
                    className="btn-destructive px-4 py-2 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </motion.button>
                  <motion.button
                    onClick={() => updateDriverPaymentStatus(selectedDriver.id, 'paid')}
                    className="btn-secondary px-4 py-2 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <DollarSign className="w-4 h-4" />
                    Mark Paid
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Driver Edit Modal */}
      {editingDriver && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setEditingDriver(null)}
        >
          <motion.div
            className="card-glass max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Edit Driver Application</h3>
                <button
                  onClick={() => setEditingDriver(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates = Object.fromEntries(formData.entries());
                
                try {
                  const { error } = await supabase
                    .from('driver_applications')
                    .update(updates)
                    .eq('id', editingDriver.id);

                  if (error) throw error;

                  setDriverApplications(prev => prev.map(driver => 
                    driver.id === editingDriver.id ? { ...driver, ...updates } : driver
                  ));

                  toast({
                    title: "Driver Updated",
                    description: "Driver information has been successfully updated",
                  });

                  setEditingDriver(null);
                  await fetchData();
                } catch (error) {
                  console.error('Error updating driver:', error);
                  toast({
                    title: "Error",
                    description: "Failed to update driver information",
                    variant: "destructive",
                  });
                }
              }}>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">Personal Information</h4>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <input
                        name="full_name"
                        defaultValue={editingDriver.full_name}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={editingDriver.email}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <input
                        name="phone"
                        defaultValue={editingDriver.phone}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">License Number</label>
                      <input
                        name="license_number"
                        defaultValue={editingDriver.license_number}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Experience (Years)</label>
                      <input
                        name="experience_years"
                        type="number"
                        defaultValue={editingDriver.experience_years}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                  </div>

                  {/* Vehicle & Subscription */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">Vehicle & Subscription</h4>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Vehicle Make</label>
                      <input
                        name="vehicle_make"
                        defaultValue={editingDriver.vehicle_make}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Vehicle Model</label>
                      <input
                        name="vehicle_model"
                        defaultValue={editingDriver.vehicle_model}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Vehicle Year</label>
                      <input
                        name="vehicle_year"
                        type="number"
                        defaultValue={editingDriver.vehicle_year}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Plate Number</label>
                      <input
                        name="vehicle_plate"
                        defaultValue={editingDriver.vehicle_plate}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Subscription Price (SAR)</label>
                      <input
                        name="subscription_price"
                        type="number"
                        defaultValue={editingDriver.subscription_price}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-border mt-6">
                  <motion.button
                    type="submit"
                    className="btn-primary px-6 py-2 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Save Changes
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setEditingDriver(null)}
                    className="btn-secondary px-6 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Admin;