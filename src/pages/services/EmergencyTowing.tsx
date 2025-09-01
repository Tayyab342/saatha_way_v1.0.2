import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';

const EmergencyTowing = () => {
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
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {language === 'ar' ? 'سحب الطوارئ' : 'Emergency Towing'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'ar' 
                ? 'خدمة سحب سريعة وموثوقة متاحة على مدار الساعة'
                : 'Fast and reliable towing service available 24/7'
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
                {language === 'ar' ? 'خدمة السحب الطارئة' : 'Emergency Towing Service'}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {language === 'ar'
                  ? 'عندما تتعطل مركبتك في الطريق، نحن هنا لمساعدتك. فريقنا المدرب والمجهز بأحدث المعدات جاهز للوصول إليك في أسرع وقت ممكن.'
                  : 'When your vehicle breaks down on the road, we are here to help. Our trained team equipped with the latest equipment is ready to reach you as quickly as possible.'
                }
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'استجابة سريعة' : 'Quick Response'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'متوسط وقت الوصول 15 دقيقة' : 'Average arrival time 15 minutes'}
                  </p>
                </div>
                
                <div className="text-center">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'متاح 24/7' : 'Available 24/7'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'خدمة على مدار الساعة' : 'Round-the-clock service'}
                  </p>
                </div>
                
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'تغطية شاملة' : 'Full Coverage'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'جميع أنحاء الرياض' : 'All areas of Riyadh'}
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

export default EmergencyTowing;