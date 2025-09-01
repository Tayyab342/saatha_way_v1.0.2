import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, Car } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';

const FlatbedTowing = () => {
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
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {language === 'ar' ? 'سحب بمقطورة مسطحة' : 'Flatbed Towing'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'ar' 
                ? 'نقل آمن للسيارات الفاخرة والمتضررة'
                : 'Safe transport for luxury and damaged vehicles'
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
                {language === 'ar' ? 'خدمة السحب بالمقطورة المسطحة' : 'Flatbed Towing Service'}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {language === 'ar'
                  ? 'الطريقة الأكثر أماناً لنقل السيارات، خاصة السيارات الفاخرة أو المنخفضة أو المتضررة بشدة.'
                  : 'The safest way to transport vehicles, especially luxury, low-clearance, or severely damaged cars.'
                }
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'حماية كاملة' : 'Full Protection'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'لا تلامس الأرض أثناء النقل' : 'No ground contact during transport'}
                  </p>
                </div>
                
                <div className="text-center">
                  <Car className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'جميع أنواع السيارات' : 'All Vehicle Types'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'من السيارات الصغيرة إلى الشاحنات' : 'From small cars to trucks'}
                  </p>
                </div>
                
                <div className="text-center">
                  <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'معدات حديثة' : 'Modern Equipment'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'مقطورات مسطحة متطورة' : 'Advanced flatbed trailers'}
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

export default FlatbedTowing;