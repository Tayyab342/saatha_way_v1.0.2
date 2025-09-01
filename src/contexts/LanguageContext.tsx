import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About Us',
    contact: 'Contact',
    driverApp: 'Driver Application',
    admin: 'Admin',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    
    // Hero Section
    heroTitle: 'Saatha Way',
    heroSubtitle: 'Hope you\'re safe — we\'ll take care of the ride',
    bookRide: 'Book a Ride',
    
    // Forms
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phoneNumber: 'Phone Number',
    vehicleType: 'Vehicle Type',
    issueDescription: 'Issue Description',
    location: 'Location',
    submit: 'Submit',
    cancel: 'Cancel',
    
    // Booking Form
    bookingTitle: 'Request Towing Service',
    currentLocation: 'Current Location',
    detectLocation: 'Detect My Location',
    
    // Driver Application
    driverTitle: 'Join Our Driver Network',
    licenseNumber: 'License Number',
    vehicleDetails: 'Vehicle Details',
    experience: 'Years of Experience',
    
    // Admin Panel
    adminTitle: 'Admin Dashboard',
    totalUsers: 'Total Users',
    totalRides: 'Total Rides',
    rideManagement: 'Ride Management',
    status: 'Status',
    pending: 'Pending',
    enRoute: 'En Route',
    completed: 'Completed',
    
    // About Us
    aboutTitle: 'About Saatha Way',
    aboutDescription: 'We are dedicated to providing reliable and efficient towing services when you need them most.',
    
    // Contact
    contactTitle: 'Get in Touch',
    message: 'Message',
    sendMessage: 'Send Message',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    welcome: 'Welcome',
    
    // Auth
    welcomeBack: 'Welcome Back',
    joinSaathaWay: 'Join Saatha Way',
    signInToAccount: 'Sign in to your account',
    createAccount: 'Create your account',
    fullName: 'Full Name',
    alreadyHaveAccount: 'Already have an account? Sign in',
    dontHaveAccount: "Don't have an account? Sign up",
    backToHome: 'Back to Home',
    
    // Contact Page
    contactDescription: 'Need help or have questions? We\'re here 24/7 to assist you with any towing needs.',
    phoneContact: 'Phone',
    hours: 'Hours',
    emergencyHotline: '24/7 Emergency Hotline',
    respondTime: 'We respond within 1 hour',
    servingArea: 'Serving all Saudi Arabia',
    alwaysHere: 'Always here for you',
    
    // About Page  
    safetyFirst: 'Safety first in every operation',
    availability24: '24/7 availability for our customers',
    transparentPricing: 'Transparent and fair pricing',
    
    // Features
    gpsTracking: 'GPS Tracking',
    gpsDescription: 'Real-time location tracking for faster response',
    serviceTitle: '24/7 Service', 
    serviceDescription: 'Available around the clock when you need us',
    safeSecure: 'Safe & Secure',
    safeDescription: 'Licensed drivers and insured vehicles',
    topRated: 'Top Rated',
    topDescription: '5-star service from our professional team',
    
    // Company Info
    companyDescription: 'We provide reliable, professional towing services with cutting-edge technology. Our expert team is available 24/7 to help you get back on the road safely.',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'من نحن',
    contact: 'اتصل بنا',
    driverApp: 'طلب سائق',
    admin: 'المدير',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    
    // Hero Section
    heroTitle: 'ساعة واي',
    heroSubtitle: 'نأمل أن تكون بأمان — سنتولى نحن الرحلة',
    bookRide: 'احجز رحلة',
    
    // Forms
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    phoneNumber: 'رقم الهاتف',
    vehicleType: 'نوع المركبة',
    issueDescription: 'وصف المشكلة',
    location: 'الموقع',
    submit: 'إرسال',
    cancel: 'إلغاء',
    
    // Booking Form
    bookingTitle: 'طلب خدمة السحب',
    currentLocation: 'الموقع الحالي',
    detectLocation: 'حدد موقعي',
    
    // Driver Application
    driverTitle: 'انضم إلى شبكة السائقين',
    licenseNumber: 'رقم الرخصة',
    vehicleDetails: 'تفاصيل المركبة',
    experience: 'سنوات الخبرة',
    
    // Admin Panel
    adminTitle: 'لوحة الإدارة',
    totalUsers: 'إجمالي المستخدمين',
    totalRides: 'إجمالي الرحلات',
    rideManagement: 'إدارة الرحلات',
    status: 'الحالة',
    pending: 'قيد الانتظار',
    enRoute: 'في الطريق',
    completed: 'مكتمل',
    
    // About Us
    aboutTitle: 'حول ساعة واي',
    aboutDescription: 'نحن ملتزمون بتوفير خدمات سحب موثوقة وفعالة عندما تحتاجها أكثر.',
    
    // Contact
    contactTitle: 'تواصل معنا',
    message: 'الرسالة',
    sendMessage: 'إرسال الرسالة',
    
    // Common
    loading: 'جارٍ التحميل...',
    error: 'خطأ',
    success: 'نجح',
    welcome: 'مرحباً',
    
    // Contact Page
    contactDescription: 'هل تحتاج مساعدة أو لديك أسئلة؟ نحن هنا على مدار الساعة طوال أيام الأسبوع لمساعدتك في أي احتياجات سحب.',
    phoneContact: 'الهاتف',
    hours: 'ساعات العمل',
    emergencyHotline: 'خط الطوارئ على مدار الساعة',
    respondTime: 'نرد خلال ساعة واحدة',
    servingArea: 'خدمة جميع أنحاء المملكة العربية السعودية',
    alwaysHere: 'دائماً في خدمتك',
    
    // About Page
    safetyFirst: 'السلامة أولاً في كل عملية',
    availability24: 'متاح على مدار الساعة لعملائنا',
    transparentPricing: 'تسعير شفاف وعادل',
    
    // Features  
    gpsTracking: 'تتبع GPS',
    gpsDescription: 'تتبع الموقع في الوقت الفعلي للاستجابة الأسرع',
    serviceTitle: 'خدمة 24/7',
    serviceDescription: 'متاح على مدار الساعة عندما تحتاجنا',
    safeSecure: 'آمن ومضمون',
    safeDescription: 'سائقون مرخصون ومركبات مؤمنة',
    topRated: 'الأعلى تقييماً',
    topDescription: 'خدمة 5 نجوم من فريقنا المهني',
    
    // Company Info
    companyDescription: 'نحن نقدم خدمات سحب موثوقة ومهنية مع أحدث التقنيات. فريقنا المتخصص متاح على مدار الساعة لمساعدتك.',
    
    // Auth
    welcomeBack: 'مرحباً بعودتك',
    joinSaathaWay: 'انضم إلى ساعة واي',
    signInToAccount: 'سجل دخولك إلى حسابك',
    createAccount: 'إنشاء حسابك',
    fullName: 'الاسم الكامل',
    alreadyHaveAccount: 'لديك حساب بالفعل؟ سجل دخولك',
    dontHaveAccount: 'ليس لديك حساب؟ سجل',
    backToHome: 'العودة إلى الرئيسية',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};