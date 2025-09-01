import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Shield, 
  Key,
  Bell,
  MapPin,
  Calendar,
  Clock,
  Settings,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rides, setRides] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    locationServices: true,
    autoLocation: false
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      await fetchProfile(session.user.id);
      await fetchUserRides(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setEditForm({
          full_name: data.full_name || '',
          phone: data.phone || ''
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRides = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRides(data || []);
    } catch (error: any) {
      console.error('Error fetching rides:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: editForm.full_name,
          phone: editForm.phone,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state with fresh data from database
      setProfile(data);
      setIsEditing(false);
      
      // Refetch the profile to ensure consistency
      await fetchProfile(user.id);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Profile save error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, you'd need to handle account deletion properly
      toast({
        title: "Account Deletion",
        description: "Please contact support to delete your account.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-warning text-warning-foreground',
      confirmed: 'bg-primary text-primary-foreground',
      'en-route': 'bg-accent text-accent-foreground',
      completed: 'bg-success text-success-foreground',
      cancelled: 'bg-destructive text-destructive-foreground'
    };
    
    return statusColors[status as keyof typeof statusColors] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-hero pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="card-glass p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                    variant="secondary"
                  >
                    <Camera className="w-3 h-3" />
                  </Button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {profile?.full_name || 'User'}
                  </h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    Member since {new Date(user?.created_at).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "destructive" : "secondary"}
                className="gap-2"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 border-t pt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Full Name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Phone Number"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>
            )}
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-glass backdrop-blur-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rides">My Rides</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-glass p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Name:</span>
                      <span>{profile?.full_name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{profile?.phone || 'Not set'}</span>
                    </div>
                  </div>
                </Card>

                <Card className="card-glass p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Activity Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Rides:</span>
                      <span className="font-semibold">{rides.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Created:</span>
                      <span>{new Date(user?.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rides">
              <Card className="card-glass p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Rides</h3>
                {rides.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No rides found. Book your first ride to get started!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rides.map((ride) => (
                      <div key={ride.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                        <div>
                          <h4 className="font-medium">{ride.name}</h4>
                          <p className="text-sm text-muted-foreground">{ride.location_address}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(ride.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusBadge(ride.status)}>
                          {ride.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="card-glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  App Preferences
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch 
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                    </div>
                    <Switch 
                      checked={preferences.smsNotifications}
                      onCheckedChange={(checked) => setPreferences({...preferences, smsNotifications: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Location Services</h4>
                      <p className="text-sm text-muted-foreground">Allow location access for better service</p>
                    </div>
                    <Switch 
                      checked={preferences.locationServices}
                      onCheckedChange={(checked) => setPreferences({...preferences, locationServices: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-detect Location</h4>
                      <p className="text-sm text-muted-foreground">Automatically fill location fields</p>
                    </div>
                    <Switch 
                      checked={preferences.autoLocation}
                      onCheckedChange={(checked) => setPreferences({...preferences, autoLocation: checked})}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <Card className="card-glass p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Security
                  </h3>
                  <div className="space-y-4">
                    <Button 
                      variant="secondary" 
                      onClick={handlePasswordReset}
                      className="w-full justify-start gap-3"
                    >
                      <Key className="w-4 h-4" />
                      Reset Password
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="w-full justify-start gap-3"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
                </Card>

                <Card className="card-glass p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Privacy Settings
                  </h3>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>Your data is secure with us. We use industry-standard encryption to protect your information.</p>
                    <p>You can request to download or delete your data at any time by contacting our support team.</p>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;