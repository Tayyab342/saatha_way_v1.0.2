import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Shield, Truck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';

const VehicleRecovery = () => {
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
              <RotateCcw className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {language === 'ar' ? 'استرداد المركبة' : 'Vehicle Recovery'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'ar' 
                ? 'استرداد المركبات من المواقف الصعبة والحوادث'
                : 'Recovering vehicles from difficult situations and accidents'
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
                {language === 'ar' ? 'خدمة استرداد المركبات' : 'Vehicle Recovery Service'}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {language === 'ar'
                  ? 'نقدم خدمات استرداد المركبات المتخصصة للسيارات العالقة في الرمال أو الوحل أو المتضررة من الحوادث.'
                  : 'We provide specialized vehicle recovery services for cars stuck in sand, mud, or damaged in accidents.'
                }
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'استرداد آمن' : 'Safe Recovery'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'معدات متخصصة لضمان السلامة' : 'Specialized equipment for safety'}
                  </p>
                </div>
                
                <div className="text-center">
                  <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {language === 'ar' ? 'معدات ثقيلة' : 'Heavy Equipment'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'ونشات قوية للمواقف الصعبة' : 'Powerful winches for difficult situations'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'ar' ? 'خبرة متخصصة' : 'Expert Experience'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'فريق مدرب على جميع أنواع الاسترداد' : 'Team trained in all recovery types'}
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

export default VehicleRecovery;