import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import towTruckLogo from '@/assets/tow-truck-logo.png';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        toast({
          title: "Password reset email sent!",
          description: "Check your email for the password reset link.",
        });
        setIsForgotPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        
        // Check if admin user and redirect accordingly
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && formData.email.toLowerCase() === 'admin@saathaway.com') {
          toast({
            title: "Welcome Admin!",
            description: "Redirecting to admin panel.",
          });
          setTimeout(() => navigate('/admin'), 500);
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          setTimeout(() => navigate('/'), 500);
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Check your email!",
          description: "We've sent you a verification link to complete your registration.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="card-glass p-8">
          <div className="text-center mb-8">
            <motion.img
              src={towTruckLogo}
              alt="Saatha Way"
              className="w-16 h-16 mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isForgotPassword ? 'Reset Password' : (isLogin ? t('welcomeBack') : t('joinSaathaWay'))}
            </h1>
            <p className="text-muted-foreground">
              {isForgotPassword ? 'Enter your email to reset your password' : (isLogin ? t('signInToAccount') : t('createAccount'))}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgotPassword && (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    name="fullName"
                    placeholder={t('fullName')}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder={t('phoneNumber')}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                name="email"
                placeholder={t('email')}
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>

            {!isForgotPassword && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  name="password"
                  placeholder={t('password')}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? t('loading') : (isForgotPassword ? 'Send Reset Email' : (isLogin ? t('signIn') : t('signUp')))}
            </Button>
          </form>

          <div className="text-center mt-6 space-y-3">
            {!isForgotPassword && (
              <>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  {isLogin
                    ? t('dontHaveAccount')
                    : t('alreadyHaveAccount')
                  }
                </button>
                {isLogin && (
                  <div>
                    <button
                      onClick={() => setIsForgotPassword(true)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </>
            )}
            {isForgotPassword && (
              <button
                onClick={() => setIsForgotPassword(false)}
                className="text-primary hover:text-primary-hover transition-colors"
              >
                Back to Sign In
              </button>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToHome')}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;