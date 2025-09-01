# Saatha Way - Towing Service Platform

A modern, bilingual (English/Arabic with RTL support) towing service platform built with React, Framer Motion, and iOS-style design principles.

## 🚀 Features

- **Bilingual Support**: English and Arabic with RTL layout
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: iOS-style UI with smooth animations
- **Booking System**: User registration required for ride booking
- **Admin Panel**: Dynamic dashboard with real-time data
- **Progressive Web App**: Mobile-first approach

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Backend**: Supabase (when connected)
- **Forms**: Web3Forms integration

## 📋 Prerequisites

Before running this project locally, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🏃‍♂️ Running Locally

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd saatha-way
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your environment variables:

```env
# Web3Forms API Key (for contact forms)
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_api_key_here

# Supabase Configuration (when connected)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
# or
yarn build
```

### 6. Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## 🔧 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── BookingModal.tsx
│   ├── Footer.tsx
│   ├── LanguageToggle.tsx
│   ├── Navigation.tsx
│   └── ThemeToggle.tsx
├── contexts/           # React contexts
│   └── LanguageContext.tsx
├── pages/              # Page components
│   ├── About.tsx
│   ├── Admin.tsx
│   ├── Contact.tsx
│   ├── DriverApplication.tsx
│   ├── Home.tsx
│   └── Splash.tsx
├── assets/             # Static assets
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── styles/             # Global styles
```

## 🎨 Design System

The project uses a custom design system with:

- **Colors**: Red and Green gradient theme
- **Typography**: iOS system fonts
- **Spacing**: Consistent spacing scale
- **Components**: Glass morphism effects
- **Animations**: Smooth iOS-style transitions

## 🌐 Supabase Integration

To enable full functionality (authentication, database, admin panel):

1. Click the green **Supabase** button in the top right of the Lovable interface
2. Connect your Supabase project
3. This enables:
   - User authentication with email verification
   - Database storage for rides and users
   - Dynamic admin panel with real data
   - Protected routes and role-based access

## 📱 Features Overview

### User Features
- **Splash Screen**: Animated logo and loading
- **Authentication**: Sign up/Sign in required for booking
- **Ride Booking**: Form with GPS location detection
- **Multi-language**: Switch between English and Arabic
- **Dark Mode**: Toggle between light and dark themes

### Admin Features
- **Dashboard**: Statistics and ride management
- **Ride Tracking**: View all rides with status updates
- **User Management**: View registered users
- **Data Export**: Export ride data to CSV

### Developer Features
- **Hot Reload**: Fast development with Vite
- **TypeScript**: Type safety throughout
- **ESLint**: Code quality enforcement
- **Responsive**: Mobile-first design approach

## 🚀 Deployment

The project is configured for deployment on:

- **Vercel** (recommended)
- **Netlify**
- **Firebase Hosting**
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **Email**: contact@saathaway.com
- **Phone**: +966 11 123 4567
- **Documentation**: Check the inline code comments

## 🔄 Updates

Keep your dependencies updated:

```bash
npm update
# or
yarn upgrade
```

---

**Note**: This project requires Supabase integration for full functionality. Connect to Supabase through the Lovable interface to enable authentication, database operations, and the admin panel.# saatha_way_v1.0.2
