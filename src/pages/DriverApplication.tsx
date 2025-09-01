import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Car, FileText, Upload, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const DriverApplication = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    experience: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlateLetters: '',
    vehiclePlateNumbers: '',
    previousExperience: '',
    availability: '',
    subscriptionDuration: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate subscription price
      const subscriptionPrice = formData.subscriptionDuration === '6months' ? 350 : 600;
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + (formData.subscriptionDuration === '6months' ? 6 : 12));

      // Submit to Supabase
      const { error } = await supabase
        .from('driver_applications')
        .insert({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          license_number: formData.licenseNumber,
          experience_years: parseInt(formData.experience.split('-')[0]) || 1,
          vehicle_make: formData.vehicleType,
          vehicle_model: formData.vehicleModel,
          vehicle_year: parseInt(formData.vehicleYear),
          vehicle_plate: `${formData.vehiclePlateLetters} ${formData.vehiclePlateNumbers}`,
          previous_experience: formData.previousExperience,
          availability: formData.availability,
          subscription_duration: formData.subscriptionDuration,
          subscription_price: subscriptionPrice,
          subscription_start_date: currentDate.toISOString(),
          subscription_end_date: endDate.toISOString(),
          payment_status: 'pending',
        });

      if (error) throw error;

      // Send secure email notification via edge function
      const emailData = {
        subject: `New Driver Application - ${formData.name}`,
        from_name: formData.name,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        license_number: formData.licenseNumber,
        experience: formData.experience,
        vehicle_type: formData.vehicleType,
        vehicle_model: formData.vehicleModel,
        vehicle_year: formData.vehicleYear,
        vehicle_plate: `${formData.vehiclePlateLetters} ${formData.vehiclePlateNumbers}`,
        previous_experience: formData.previousExperience,
        availability: formData.availability,
        subscription_duration: formData.subscriptionDuration,
        subscription_price: subscriptionPrice.toString(),
      };

      const emailResponse = await supabase.functions.invoke('send-form-email', {
        body: { formData: emailData }
      });

      if (emailResponse.error) {
        throw new Error(emailResponse.error.message || 'Failed to send email notification');
      }
      
      console.log('Driver application submitted:', formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        licenseNumber: '',
        experience: '',
        vehicleType: '',
        vehicleModel: '',
        vehicleYear: '',
        vehiclePlateLetters: '',
        vehiclePlateNumbers: '',
        previousExperience: '',
        availability: '',
        subscriptionDuration: '',
      });
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const benefits = [
    {
      icon: Award,
      title: 'Competitive Pay',
      description: 'Earn competitive rates with performance bonuses',
    },
    {
      icon: Car,
      title: 'Flexible Schedule',
      description: 'Choose your working hours that fit your lifestyle',
    },
    {
      icon: Phone,
      title: 'Modern Equipment',
      description: 'Work with state-of-the-art towing equipment',
    },
    {
      icon: FileText,
      title: 'Full Training',
      description: 'Comprehensive training and ongoing support',
    },
  ];

  const requirements = [
    'Valid UAE driving license (minimum 3 years)',
    'Clean driving record',
    'Previous towing or automotive experience preferred',
    'Own towing vehicle or willing to lease one',
    'Available for flexible shifts including weekends',
    'Strong communication skills in English and/or Arabic',
    'Physical ability to operate towing equipment',
    'Professional appearance and customer service skills',
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {t('driverTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our team of professional drivers and help people get back on the road safely.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Drive with Saatha Way?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer excellent benefits and a supportive work environment for our drivers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {benefits.map((benefit, index) => (
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
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Application Form */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Requirements
                </h3>
                <div className="card-glass p-6">
                  <ul className="space-y-4">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Application Form */}
              <motion.div
                className="card-glass p-8"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Apply Now
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">Personal Information</h4>
                    
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
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

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                          <Mail className="w-4 h-4" />
                          {t('email')}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-ios"
                          placeholder={t('email')}
                          required
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                          <Phone className="w-4 h-4" />
                          {t('phone')}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input-ios"
                          placeholder={t('phone')}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('licenseNumber')}
                        </label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          className="input-ios"
                          placeholder={t('licenseNumber')}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('experience')}
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="input-ios"
                          required
                        >
                          <option value="">{t('experience')}</option>
                          <option value="1-2">1-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5-10">5-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">{t('vehicleDetails')}</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
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
                          <option value="light-duty">Light Duty Tow Truck</option>
                          <option value="medium-duty">Medium Duty Tow Truck</option>
                          <option value="heavy-duty">Heavy Duty Tow Truck</option>
                          <option value="flatbed">Flatbed Truck</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Vehicle Model
                        </label>
                        <input
                          type="text"
                          name="vehicleModel"
                          value={formData.vehicleModel}
                          onChange={handleInputChange}
                          className="input-ios"
                          placeholder="Vehicle Model"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Vehicle Year
                        </label>
                        <input
                          type="number"
                          name="vehicleYear"
                          value={formData.vehicleYear}
                          onChange={handleInputChange}
                          className="input-ios"
                          placeholder="Vehicle Year"
                          min="2000"
                          max="2024"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Plate Number (KSA Format)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <input
                              type="text"
                              name="vehiclePlateLetters"
                              value={formData.vehiclePlateLetters}
                              onChange={handleInputChange}
                              className="input-ios"
                              placeholder="ABC (Letters)"
                              pattern="[A-Za-z]{1,3}"
                              maxLength={3}
                              required
                            />
                            <p className="text-xs text-muted-foreground mt-1">Letters only</p>
                          </div>
                          <div>
                            <input
                              type="text"
                              name="vehiclePlateNumbers"
                              value={formData.vehiclePlateNumbers}
                              onChange={handleInputChange}
                              className="input-ios"
                              placeholder="1234 (Numbers)"
                              pattern="[0-9]{1,4}"
                              maxLength={4}
                              required
                            />
                            <p className="text-xs text-muted-foreground mt-1">Numbers only</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Previous Towing Experience
                    </label>
                    <textarea
                      name="previousExperience"
                      value={formData.previousExperience}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-ios resize-none"
                      placeholder="Describe your previous towing or automotive experience..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="input-ios"
                      required
                    >
                      <option value="">Select Availability</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="nights">Night Shifts</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  {/* Subscription Plan */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">Subscription Plan</h4>
                    <p className="text-sm text-muted-foreground">Choose your subscription duration to start driving with Saatha Way</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <motion.div
                        className={`card-glass p-4 border-2 cursor-pointer transition-colors ${
                          formData.subscriptionDuration === '6months' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, subscriptionDuration: '6months' }))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-center">
                          <h5 className="text-lg font-semibold text-foreground mb-2">6 Months</h5>
                          <div className="text-2xl font-bold text-primary mb-1">350 SAR</div>
                          <p className="text-sm text-muted-foreground">Perfect for getting started</p>
                        </div>
                      </motion.div>

                      <motion.div
                        className={`card-glass p-4 border-2 cursor-pointer transition-colors ${
                          formData.subscriptionDuration === '1year' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, subscriptionDuration: '1year' }))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-center">
                          <h5 className="text-lg font-semibold text-foreground mb-2">1 Year</h5>
                          <div className="text-2xl font-bold text-primary mb-1">600 SAR</div>
                          <p className="text-sm text-muted-foreground">Best value option</p>
                          <div className="inline-block bg-success text-success-foreground text-xs px-2 py-1 rounded-full mt-1">
                            Save 100 SAR
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {!formData.subscriptionDuration && (
                      <p className="text-sm text-destructive">Please select a subscription plan to continue</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !formData.subscriptionDuration}
                    className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50"
                    whileHover={{ scale: isSubmitting || !formData.subscriptionDuration ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting || !formData.subscriptionDuration ? 1 : 0.98 }}
                  >
                    {isSubmitting ? t('loading') : t('submit')}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DriverApplication;