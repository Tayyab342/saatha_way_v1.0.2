import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  const sections = [
    {
      icon: Database,
      title: language === 'ar' ? 'المعلومات التي نجمعها' : 'Information We Collect',
      content: language === 'ar' 
        ? 'نجمع المعلومات الشخصية التي تقدمها لنا عند استخدام خدماتنا، بما في ذلك الاسم ورقم الهاتف والموقع وتفاصيل المركبة.'
        : 'We collect personal information you provide when using our services, including name, phone number, location, and vehicle details.'
    },
    {
      icon: Eye,
      title: language === 'ar' ? 'كيف نستخدم معلوماتك' : 'How We Use Your Information',
      content: language === 'ar'
        ? 'نستخدم معلوماتك لتقديم خدمات السحب، والتواصل معك، وتحسين خدماتنا، وضمان السلامة والأمان.'
        : 'We use your information to provide towing services, communicate with you, improve our services, and ensure safety and security.'
    },
    {
      icon: Lock,
      title: language === 'ar' ? 'حماية البيانات' : 'Data Protection',
      content: language === 'ar'
        ? 'نحمي معلوماتك الشخصية باستخدام تدابير أمنية متقدمة ولا نشاركها مع أطراف ثالثة دون موافقتك.'
        : 'We protect your personal information using advanced security measures and do not share it with third parties without your consent.'
    },
    {
      icon: UserCheck,
      title: language === 'ar' ? 'حقوقك' : 'Your Rights',
      content: language === 'ar'
        ? 'لديك الحق في الوصول إلى بياناتك وتصحيحها وحذفها. يمكنك الاتصال بنا لممارسة هذه الحقوق.'
        : 'You have the right to access, correct, and delete your data. You can contact us to exercise these rights.'
    }
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
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-ios">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'نحن ملتزمون بحماية خصوصيتك وأمان معلوماتك الشخصية'
                : 'We are committed to protecting your privacy and the security of your personal information'
              }
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              {language === 'ar' ? 'آخر تحديث: يناير 2024' : 'Last updated: January 2024'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Overview */}
            <motion.div
              className="card-glass p-8 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {language === 'ar' ? 'نظرة عامة' : 'Overview'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'ar'
                  ? 'تصف سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات الشخصية عند استخدام خدمات ساعة وي للسحب. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقاً لأعلى المعايير الأمنية.'
                  : 'This Privacy Policy describes how we collect, use, and protect personal information when you use Saatha Way towing services. We respect your privacy and are committed to protecting your personal data according to the highest security standards.'
                }
              </p>
            </motion.div>

            {/* Sections */}
            <div className="grid gap-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  className="card-glass p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        {section.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              className="card-glass p-8 mt-12 bg-gradient-primary text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                  </h3>
                  <p className="mb-4 opacity-90">
                    {language === 'ar'
                      ? 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا:'
                      : 'If you have any questions about this Privacy Policy, please contact us:'
                    }
                  </p>
                  <div className="space-y-2 text-sm opacity-90">
                    <p>Email: privacy@saathaway.com</p>
                    <p>Phone: +966 11 123 4567</p>
                    <p>{language === 'ar' ? 'العنوان: الرياض، المملكة العربية السعودية' : 'Address: Riyadh, Saudi Arabia'}</p>
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

export default PrivacyPolicy;