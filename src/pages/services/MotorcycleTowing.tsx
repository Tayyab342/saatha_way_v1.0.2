import React from 'react';
import { motion } from 'framer-motion';
import { Bike, Shield, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';

const MotorcycleTowing = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-ios">
              <Bike className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {language === 'ar' ? 'سحب الدراجات النارية' : 'Motorcycle Towing'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'ar' 
                ? 'خدمة سحب متخصصة للدراجات النارية'
                : 'Specialized towing service for motorcycles'
              }
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="card-glass p-8 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {language === 'ar' ? 'خدمة سحب الدراجات النارية' : 'Motorcycle Towing Service'}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {language === 'ar'
                  ? 'نقدم خدمات سحب متخصصة للدراجات النارية بمعدات مصممة خصيصاً لضمان النقل الآمن.'
                  : 'We provide specialized motorcycle towing services with equipment designed specifically for safe transport.'
                }
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'نقل آمن' : 'Safe Transport'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'أحزمة تثبيت متخصصة' : 'Specialized securing straps'}
                  </p>
                </div>
                
                <div className="text-center">
                  <Wrench className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'معدات متخصصة' : 'Specialized Equipment'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'مقطورات مصممة للدراجات' : 'Trailers designed for motorcycles'}
                  </p>
                </div>
                
                <div className="text-center">
                  <Bike className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'جميع الأنواع' : 'All Types'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'من الدراجات الصغيرة إلى الكبيرة' : 'From small to large motorcycles'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MotorcycleTowing;