import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VisionMission } from './components/VisionMission';
import { Services } from './components/Services';
import { Principles } from './components/Principles';
import { AboutUs } from './components/AboutUs';
import { Certificates } from './components/Certificates';
import { ConsultationCTA, BookingType } from './components/ConsultationCTA';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';
import { BackToTop } from './components/BackToTop';
import { ContactModal } from './components/ContactModal';
import { Preloader } from './components/Preloader';
import { LegalService } from './types';

// CRM System Components
import { ClientIntakeForm } from './components/crm/ClientIntakeForm';
import { AuthLogin } from './components/crm/AuthLogin';
import { ClientTracker } from './components/crm/ClientTracker';
import { DashboardLayout } from './components/crm/DashboardLayout';
import { DashboardOverview } from './components/crm/DashboardOverview';
import { ApplicationsTable } from './components/crm/ApplicationsTable';
import { ApplicationDetailModal } from './components/crm/ApplicationDetailModal';
import { AppointmentsView } from './components/crm/AppointmentsView';
import { TeamView } from './components/crm/TeamView';
import { SettingsView } from './components/crm/SettingsView';
import { crmDb } from './services/crmDb';
import { Application, User } from './types/crm';
import { FileText, Lock, Clock, Sparkles } from 'lucide-react';

type ViewMode = 'website' | 'apply' | 'track' | 'dashboard' | 'login';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('website');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<Application | null>(null);
  const [trackOrderNumber, setTrackOrderNumber] = useState<string>('');
  
  // Data refresh trigger
  const [dataVersion, setDataVersion] = useState(0);
  const refreshData = () => setDataVersion(v => v + 1);

  // Modal State for regular website booking
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>('general');
  const [bookingTitle, setBookingTitle] = useState<string>('');

  // Determine view from URL path / query param on mount and popstate
  useEffect(() => {
    // Initial sync with Hostinger server on load
    crmDb.syncFromHostinger().then(() => {
      refreshData();
    });

    const syncViewWithUrl = () => {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      const viewParam = search.get('view') as ViewMode;

      if (path === '/apply' || viewParam === 'apply') {
        setCurrentView('apply');
      } else if (path === '/track' || viewParam === 'track') {
        setCurrentView('track');
        const order = search.get('order');
        if (order) setTrackOrderNumber(order);
      } else if (path === '/dashboard' || viewParam === 'dashboard') {
        const user = crmDb.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setCurrentView('dashboard');
        } else {
          setCurrentView('login');
        }
      } else if (path === '/login' || viewParam === 'login') {
        setCurrentView('login');
      } else {
        setCurrentView('website');
      }
    };

    syncViewWithUrl();
    window.addEventListener('popstate', syncViewWithUrl);
    return () => window.removeEventListener('popstate', syncViewWithUrl);
  }, []);

  // Live polling for new incoming applications while inside dashboard
  useEffect(() => {
    if (currentView !== 'dashboard') return;

    const interval = setInterval(async () => {
      await crmDb.syncFromHostinger();
      refreshData();
    }, 8000);

    return () => clearInterval(interval);
  }, [currentView]);

  // Update browser URL on view change
  const navigateTo = (view: ViewMode, params?: Record<string, string>) => {
    setCurrentView(view);
    const url = new URL(window.location.href);
    url.pathname = view === 'website' ? '/' : `/${view}`;
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle direct hash navigation like #booking on website
  useEffect(() => {
    if (currentView !== 'website') return;

    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace('#', '');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            const yOffset = -80;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 600);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentView]);

  // Initialize Lenis smooth scroll for website
  useEffect(() => {
    if (currentView !== 'website') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [currentView]);

  const handleOpenBooking = (type: BookingType = 'general', title?: string) => {
    setBookingType(type);
    setBookingTitle(title || '');
    setIsBookingOpen(true);
  };

  const handleOpenConsultation = (service?: LegalService | null) => {
    if (service) {
      handleOpenBooking('consultant', `حجز استشارة في: ${service.title}`);
    } else {
      handleOpenBooking('general', 'حجز موعد واستشارة قانونية');
    }
  };

  const handleExploreMore = () => {
    const bookingElem = document.getElementById('booking');
    if (bookingElem) {
      const yOffset = -80;
      const y = bookingElem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleExploreServices = () => {
    const servicesElement = document.getElementById('services');
    if (servicesElement) {
      const yOffset = -80;
      const y = servicesElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // ----------------------------------------------------
  // VIEW ROUTING
  // ----------------------------------------------------

  // 1. Client Intake Form View (Google Forms Style)
  if (currentView === 'apply') {
    return (
      <ClientIntakeForm 
        onBackToHome={() => navigateTo('website')}
        onNavigateToTrack={(orderNum) => {
          setTrackOrderNumber(orderNum);
          navigateTo('track', { order: orderNum });
        }}
      />
    );
  }

  // 2. Client Order Tracker View
  if (currentView === 'track') {
    return (
      <ClientTracker 
        initialOrderNumber={trackOrderNumber}
        onBackToHome={() => navigateTo('website')}
        onNewRequest={() => navigateTo('apply')}
      />
    );
  }

  // 3. Staff Login View
  if (currentView === 'login') {
    return (
      <AuthLogin 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          navigateTo('dashboard');
        }}
        onCancel={() => navigateTo('website')}
      />
    );
  }

  // 4. CRM Dashboard View
  if (currentView === 'dashboard') {
    const activeUser = currentUser || crmDb.getCurrentUser();
    if (!activeUser) {
      return (
        <AuthLogin 
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            navigateTo('dashboard');
          }}
          onCancel={() => navigateTo('website')}
        />
      );
    }
    const applications = crmDb.getApplications();

    return (
      <DashboardLayout
        currentUser={activeUser}
        activeTab={dashboardTab}
        onTabChange={(tab) => setDashboardTab(tab)}
        onLogout={() => {
          crmDb.setCurrentUser(null);
          setCurrentUser(null);
          navigateTo('website');
        }}
        onSwitchUser={(u) => {
          crmDb.setCurrentUser(u);
          setCurrentUser(u);
          refreshData();
        }}
        onNewIntake={() => navigateTo('apply')}
        onGoToSite={() => navigateTo('website')}
      >
        {dashboardTab === 'overview' && (
          <DashboardOverview
            applications={applications}
            currentUser={activeUser}
            onSelectApplication={(app) => setSelectedAppForDetail(app)}
            onNavigateTab={(tab) => setDashboardTab(tab)}
          />
        )}

        {dashboardTab === 'applications' && (
          <ApplicationsTable
            applications={applications}
            onSelectApplication={(app) => setSelectedAppForDetail(app)}
            onRefresh={refreshData}
          />
        )}

        {dashboardTab === 'appointments' && (
          <AppointmentsView onRefresh={refreshData} />
        )}

        {dashboardTab === 'team' && (
          <TeamView onRefresh={refreshData} />
        )}

        {dashboardTab === 'settings' && (
          <SettingsView onRefresh={refreshData} />
        )}

        {/* Selected Application Detail Modal */}
        {selectedAppForDetail && (
          <ApplicationDetailModal
            application={selectedAppForDetail}
            currentUser={activeUser}
            onClose={() => setSelectedAppForDetail(null)}
            onUpdated={() => {
              const updated = crmDb.getApplicationById(selectedAppForDetail.id);
              if (updated) setSelectedAppForDetail(updated);
              refreshData();
            }}
          />
        )}
      </DashboardLayout>
    );
  }

  // 5. Default Website Landing View
  return (
    <div className="relative min-h-screen bg-[#F5F0E8] text-[#171717] selection:bg-[#B8963A]/25 selection:text-[#071B23]">
      
      {/* Top Banner for CRM & Digital Services (Visible on Desktop / Tablets, cleanly moved to 3-bars menu on Mobile) */}
      <div className="hidden md:block bg-[#07131b] border-b border-[#c5a880]/30 py-2 px-4 text-xs text-gray-300 relative z-50 font-cairo shadow-md" dir="rtl">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[#E8D39B] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#C9AA67]" />
              البوابة الرقمية لشركة حجاج الضويحي للمحاماة:
            </span>
            <span className="text-gray-400 hidden sm:inline">نظام الاستقبال الذكي وخدمات الموكلين</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('apply')}
              className="inline-flex items-center gap-1 text-white hover:text-[#E8D39B] font-semibold transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#C9AA67]" />
              <span>استمارة الاستشارة الفورية</span>
            </button>

            <span className="text-gray-600">|</span>

            <button
              onClick={() => navigateTo('track')}
              className="inline-flex items-center gap-1 text-white hover:text-[#E8D39B] font-semibold transition cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#C9AA67]" />
              <span>تتبع حالة الطلب</span>
            </button>

            <span className="text-gray-600">|</span>

            <button
              onClick={() => navigateTo('dashboard')}
              className="inline-flex items-center gap-1 text-[#E8D39B] hover:text-white font-bold bg-[#14232e] px-2.5 py-1 rounded-md border border-[#c5a880]/30 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>لوحة الإدارة CRM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Luxury Loading Splash Screen */}
      <Preloader onComplete={() => {
        if (window.location.hash) {
          const el = document.getElementById(window.location.hash.replace('#', ''));
          if (el) {
            const yOffset = -80;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }} />

      {/* Floating Navbar */}
      <Navbar 
        onOpenConsultation={() => handleOpenBooking('general', 'حجز موعد واستشارة قانونية')} 
        onNavigateTo={(view) => navigateTo(view as any)}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onExploreMore={handleExploreMore}
          onOpenConsultation={() => handleOpenBooking('general', 'حجز موعد واستشارة قانونية')}
        />

        {/* 2. Vision & Mission Section with Animated Stats */}
        <VisionMission />

        {/* 3. About the Lawyer */}
        <AboutUs
          onOpenConsultation={() => handleOpenBooking('founder', 'حجز موعد مع المحامي أ. حجاج الضويحي')}
          onExploreServices={handleExploreServices}
        />

        {/* 4. Certificates & Licenses (In-Place Lightbox) */}
        <Certificates />

        {/* 5. Services Section */}
        <Services
          onSelectServiceForConsultation={(service) => handleOpenConsultation(service)}
        />

        {/* 6. Principles & 7-Day Schedule Section */}
        <Principles />

        {/* 7. The 4-Option Booking & Appointment Section (#booking) */}
        <ConsultationCTA
          onOpenBooking={(type, title) => handleOpenBooking(type, title)}
        />
      </main>

      {/* 8. Dark Navy Footer (#contact) */}
      <Footer />

      {/* Floating Action Controls */}
      <FloatingContact onClick={() => handleOpenBooking('general', 'حجز استشارة فورية')} />
      <BackToTop />

      {/* Interactive Multi-Step Appointment Booking Modal */}
      <ContactModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        bookingType={bookingType}
        bookingTitle={bookingTitle}
      />
    </div>
  );
}
