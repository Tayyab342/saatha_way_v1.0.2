import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import towTruckLogo from '@/assets/tow-truck-logo.png';

const Footer = () => {
  const { t, language } = useLanguage();

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Location',
      content: 'Riyadh, Saudi Arabia',
      arabicContent: 'الرياض، المملكة العربية السعودية'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+966 11 123 4567',
      arabicContent: '+966 11 123 4567'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@saathaway.com',
      arabicContent: 'contact@saathaway.com'
    },
    {
      icon: Clock,
      title: '24/7 Service',
      content: 'Available Around the Clock',
      arabicContent: 'متاح على مدار الساعة'
    }
  ];

  const services = [
    { name: 'Emergency Towing', arabic: 'سحب الطوارئ', link: '/services/emergency-towing' },
    { name: 'Roadside Assistance', arabic: 'مساعدة على الطريق', link: '/services/roadside-assistance' },
    { name: 'Vehicle Recovery', arabic: 'استرداد المركبة', link: '/services/vehicle-recovery' },
    { name: 'Flatbed Towing', arabic: 'سحب بمقطورة مسطحة', link: '/services/flatbed-towing' },
    { name: 'Motorcycle Towing', arabic: 'سحب الدراجات النارية', link: '/services/motorcycle-towing' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <img src={towTruckLogo} alt="Saatha Way Logo" className="w-10 h-10" />
              <h3 className="text-2xl font-bold text-foreground">
                Saatha Way
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('companyDescription')}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-secondary/50 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 text-foreground" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-foreground">
              {language === 'ar' ? 'خدماتنا' : 'Our Services'}
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.link}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {language === 'ar' ? service.arabic : service.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-foreground">
              {language === 'ar' ? 'اتصل بنا' : 'Contact Info'}
            </h4>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <info.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {language === 'ar' && info.title === 'Location' ? 'الموقع' :
                       language === 'ar' && info.title === 'Phone' ? 'الهاتف' :
                       language === 'ar' && info.title === 'Email' ? 'البريد الإلكتروني' :
                       language === 'ar' && info.title === '24/7 Service' ? 'خدمة 24/7' :
                       info.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? info.arabicContent : info.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-foreground">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {language === 'ar' ? 'الرئيسية' : 'Home'}
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {language === 'ar' ? 'من نحن' : 'About Us'}
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {language === 'ar' ? 'اتصل بنا' : 'Contact'}
                </a>
              </li>
              <li>
                <a href="/driver-application" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {language === 'ar' ? 'طلب سائق' : 'Driver Application'}
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {language === 'ar' ? 'الخصوصية' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {language === 'ar' ? 'الشروط' : 'Terms of Service'}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Emergency Banner */}
        <motion.div
          className="mt-12 bg-gradient-primary rounded-3xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            {language === 'ar' ? 'حالة طوارئ؟' : 'Emergency?'}
          </h3>
          <p className="text-white/90 mb-6">
            {language === 'ar' 
              ? 'اتصل بنا الآن للحصول على مساعدة فورية'
              : 'Call us now for immediate assistance'
            }
          </p>
          <motion.a
            href="tel:+966111234567"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-2xl font-semibold hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-5 h-5" />
            +966 11 123 4567
          </motion.a>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-12 pt-8 border-t border-border text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm">
            {language === 'ar' 
              ? `© ${new Date().getFullYear()} ساعة وي. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Saatha Way. All rights reserved.`
            }
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;