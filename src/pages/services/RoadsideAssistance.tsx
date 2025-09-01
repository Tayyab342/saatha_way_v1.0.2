import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Battery, Fuel, Key } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';

const RoadsideAssistance = () => {
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
              <Wrench className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {language === 'ar' ? 'مساعدة على الطريق' : 'Roadside Assistance'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'ar' 
                ? 'حلول سريعة لمشاكل السيارة على الطريق'
                : 'Quick solutions for car problems on the road'
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
                {language === 'ar' ? 'خدمات المساعدة على الطريق' : 'Roadside Assistance Services'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <Battery className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {language === 'ar' ? 'تشغيل البطارية' : 'Battery Jump Start'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'تشغيل السيارة عند نفاد البطارية' : 'Start your car when battery is dead'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Fuel className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {language === 'ar' ? 'توصيل الوقود' : 'Fuel Delivery'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'توصيل الوقود عند نفاده' : 'Fuel delivery when you run out'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Key className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {language === 'ar' ? 'فتح السيارة' : 'Lockout Service'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'فتح السيارة عند نسيان المفاتيح' : 'Unlock your car when keys are locked inside'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Wrench className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {language === 'ar' ? 'تغيير الإطار' : 'Tire Change'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'تغيير الإطار المثقوب' : 'Change flat or damaged tires'}
                    </p>
                  </div>
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

export default RoadsideAssistance;