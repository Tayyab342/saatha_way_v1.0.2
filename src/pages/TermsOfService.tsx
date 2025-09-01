import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, CreditCard, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  const { language } = useLanguage();

  const sections = [
    {
      icon: Users,
      title: language === 'ar' ? 'قبول الشروط' : 'Acceptance of Terms',
      content: language === 'ar'
        ? 'باستخدام خدمات ساعة وي، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.'
        : 'By using Saatha Way services, you agree to be bound by these Terms and Conditions. If you do not agree to any of these terms, please do not use our services.'
    },
    {
      icon: CheckCircle,
      title: language === 'ar' ? 'الخدمات المقدمة' : 'Services Provided',
      content: language === 'ar'
        ? 'نقدم خدمات السحب والمساعدة على الطريق على مدار الساعة. نحتفظ بالحق في تعديل أو إيقاف أي خدمة في أي وقت دون إشعار مسبق.'
        : 'We provide 24/7 towing and roadside assistance services. We reserve the right to modify or discontinue any service at any time without prior notice.'
    },
    {
      icon: CreditCard,
      title: language === 'ar' ? 'الدفع والرسوم' : 'Payment and Fees',
      content: language === 'ar'
        ? 'الرسوم مستحقة الدفع عند تقديم الخدمة. نقبل النقد والبطاقات الائتمانية. قد تطبق رسوم إضافية للخدمات خارج ساعات العمل العادية.'
        : 'Fees are due upon service completion. We accept cash and credit cards. Additional charges may apply for services outside normal business hours.'
    },
    {
      icon: XCircle,
      title: language === 'ar' ? 'المسؤولية والضمان' : 'Liability and Warranty',
      content: language === 'ar'
        ? 'نحن مؤمنون ومرخصون، لكن مسؤوليتنا محدودة بقيمة الخدمة المقدمة. لا نتحمل مسؤولية الأضرار الناتجة عن ظروف خارجة عن سيطرتنا.'
        : 'We are insured and licensed, but our liability is limited to the value of the service provided. We are not responsible for damages resulting from circumstances beyond our control.'
    }
  ];

  const responsibilities = [
    {
      title: language === 'ar' ? 'مسؤولياتك' : 'Your Responsibilities',
      items: language === 'ar' ? [
        'تقديم معلومات دقيقة عن موقعك ومركبتك',
        'التواجد في الموقع عند وصول السائق',
        'دفع الرسوم المتفق عليها',
        'التعامل بأدب واحترام مع فريقنا'
      ] : [
        'Provide accurate information about your location and vehicle',
        'Be present at the location when the driver arrives',
        'Pay agreed-upon fees',
        'Treat our team with courtesy and respect'
      ]
    },
    {
      title: language === 'ar' ? 'مسؤولياتنا' : 'Our Responsibilities',
      items: language === 'ar' ? [
        'الوصول في الوقت المحدد أو إشعارك بأي تأخير',
        'التعامل مع مركبتك بعناية واحترافية',
        'تقديم خدمة آمنة وموثوقة',
        'الحفاظ على سرية معلوماتك الشخصية'
      ] : [
        'Arrive on time or notify you of any delays',
        'Handle your vehicle with care and professionalism',
        'Provide safe and reliable service',
        'Maintain confidentiality of your personal information'
      ]
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
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === 'ar'
                ? 'الشروط والأحكام التي تحكم استخدام خدمات ساعة وي'
                : 'Terms and conditions governing the use of Saatha Way services'
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
                {language === 'ar' ? 'مقدمة' : 'Introduction'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'ar'
                  ? 'مرحباً بك في ساعة وي. هذه الشروط والأحكام تحدد القواعد واللوائح لاستخدام خدمات الشركة. نحن شركة مرخصة ومؤمنة تقدم خدمات السحب والمساعدة على الطريق في المملكة العربية السعودية.'
                  : 'Welcome to Saatha Way. These Terms and Conditions outline the rules and regulations for the use of our services. We are a licensed and insured company providing towing and roadside assistance services in Saudi Arabia.'
                }
              </p>
            </motion.div>

            {/* Main Sections */}
            <div className="grid gap-8 mb-12">
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

            {/* Responsibilities */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {responsibilities.map((resp, index) => (
                <motion.div
                  key={index}
                  className="card-glass p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    {resp.title}
                  </h3>
                  <ul className="space-y-3">
                    {resp.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Important Notice */}
            <motion.div
              className="card-glass p-8 bg-gradient-primary text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    {language === 'ar' ? 'إشعار مهم' : 'Important Notice'}
                  </h3>
                  <p className="mb-4 opacity-90">
                    {language === 'ar'
                      ? 'نحتفظ بالحق في تحديث هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات مهمة. الاستمرار في استخدام خدماتنا يعني موافقتك على الشروط المحدثة.'
                      : 'We reserve the right to update these terms at any time. You will be notified of any significant changes. Continued use of our services constitutes acceptance of updated terms.'
                    }
                  </p>
                  <div className="space-y-2 text-sm opacity-90">
                    <p>Email: legal@saathaway.com</p>
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

export default TermsOfService;