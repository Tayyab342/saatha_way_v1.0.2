import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Wrench, RotateCcw, Truck, Bike, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';

const Services = () => {
  const { language } = useLanguage();

  const services = [
    {
      icon: AlertTriangle,
      title: language === 'ar' ? 'سحب الطوارئ' : 'Emergency Towing',
      description: language === 'ar' ? 'خدمة سحب سريعة متاحة 24/7' : 'Fast towing service available 24/7',
      link: '/services/emergency-towing'
    },
    {
      icon: Wrench,
      title: language === 'ar' ? 'مساعدة على الطريق' : 'Roadside Assistance',
      description: language === 'ar' ? 'حلول سريعة لمشاكل السيارة' : 'Quick solutions for car problems',
      link: '/services/roadside-assistance'
    },
    {
      icon: RotateCcw,
      title: language === 'ar' ? 'استرداد المركبة' : 'Vehicle Recovery',
      description: language === 'ar' ? 'استرداد من المواقف الصعبة' : 'Recovery from difficult situations',
      link: '/services/vehicle-recovery'
    },
    {
      icon: Truck,
      title: language === 'ar' ? 'سحب بمقطورة مسطحة' : 'Flatbed Towing',
      description: language === 'ar' ? 'نقل آمن للسيارات الفاخرة' : 'Safe transport for luxury vehicles',
      link: '/services/flatbed-towing'
    },
    {
      icon: Bike,
      title: language === 'ar' ? 'سحب الدراجات النارية' : 'Motorcycle Towing',
      description: language === 'ar' ? 'خدمة متخصصة للدراجات' : 'Specialized service for motorcycles',
      link: '/services/motorcycle-towing'
    }
  ];

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
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {language === 'ar' ? 'خدماتنا' : 'Our Services'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'ar' 
                ? 'خدمات شاملة للسحب والمساعدة على الطريق'
                : 'Comprehensive towing and roadside assistance services'
              }
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.a
                key={index}
                href={service.link}
                className="card-glass p-8 group hover:shadow-ios-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;