import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  CalendarCheck, 
  PhoneCall, 
  FileText, 
  Clock, 
  Lock, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
  onNavigateTo?: (view: string) => void;
}

const items = [
  { id: 'hero', label: 'الرئيسية' },
  { id: 'about', label: 'من نحن' },
  { id: 'services', label: 'خدماتنا' },
  { id: 'certificates', label: 'الشهادات' },
  { id: 'booking', label: 'حجز موعد' },
  { id: 'contact', label: 'تواصل معنا' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation, onNavigateTo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 45);
      const y = window.scrollY + 200;
      [...items].reverse().some((item) => {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= y) {
          setActive(item.id);
          return true;
        }
        return false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (id: string) => {
    setOpen(false);
    // If user clicked 'contact' or 'booking', open the booking appointment modal directly!
    if (id === 'contact' || id === 'booking') {
      onOpenConsultation();
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePortalNavigate = (view: string) => {
    setOpen(false);
    if (onNavigateTo) {
      onNavigateTo(view);
    }
  };

  return (
    <header className="fixed top-3 sm:top-5 md:top-7 inset-x-0 z-50 px-3 sm:px-4 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto w-full max-w-[1400px] rounded-full px-4 sm:px-6 md:px-8 py-2.5 md:py-3 flex items-center justify-between ${
          scrolled
            ? 'bg-[#071B23]/95 backdrop-blur-xl border-[#C9AA67]/40 shadow-2xl'
            : 'bg-[#071B23]/85 backdrop-blur-lg border-white/20'
        } border text-[#FAF7F2] transition-all duration-500`}
      >
        {/* Logo / Brand Name */}
        <button
          onClick={() => handleClick('hero')}
          className="flex items-center gap-2 text-right cursor-pointer"
        >
          <img src="/logo.png" alt="شعار الشركة" className="h-7 sm:h-8 w-auto object-contain" />
          <span className="text-xs sm:text-sm font-bold text-[#E8D39B] hidden sm:inline-block">
            شركة حجاج الضويحي للمحاماة
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[14px] font-semibold">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`relative py-1 transition-colors cursor-pointer ${
                active === item.id ? 'text-[#C9AA67]' : 'text-white/85 hover:text-[#C9AA67]'
              }`}
            >
              {item.label}
              {active === item.id && (
                <motion.span
                  layoutId="navDot"
                  className="absolute -bottom-1.5 left-1/2 w-1.5 h-1.5 rounded-full bg-[#C9AA67] -translate-x-1/2 shadow-[0_0_8px_#C9AA67]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Direct Appointment CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenConsultation}
            className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#B8963A] via-[#C9AA67] to-[#B8963A] text-[#071B23] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>تسجيل موعد</span>
          </button>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          className="md:hidden w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/15 transition-colors cursor-pointer"
          onClick={() => setOpen(true)}
          aria-label="القائمة الرئيسية"
        >
          <Menu className="w-5 h-5 text-[#E8D39B]" />
        </button>
      </motion.nav>

      {/* Mobile Fullscreen Slide-in Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 pointer-events-auto bg-[#071B23]/98 backdrop-blur-2xl flex flex-col justify-between p-6 z-[999] overflow-y-auto"
            dir="rtl"
          >
            {/* Top Close Button & Logo */}
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="شعار الشركة" className="h-10 w-auto object-contain" />
                <span className="text-xs font-bold text-[#E8D39B]">شركة حجاج الضويحي</span>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col items-center gap-3.5 text-center my-6">
              {items.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleClick(item.id)}
                  className={`text-lg font-bold transition-colors cursor-pointer py-1.5 w-full rounded-xl ${
                    active === item.id ? 'text-[#C9AA67] bg-white/5' : 'text-white hover:text-[#C9AA67]'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}

              <button
                onClick={() => {
                  setOpen(false);
                  onOpenConsultation();
                }}
                className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-[#B8963A] via-[#C9AA67] to-[#B8963A] text-[#071B23] font-bold text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>حجز موعد استشارة فورية</span>
              </button>
            </div>

            {/* Digital Portal Services inside Mobile Menu */}
            <div className="bg-white/5 border border-[#c5a880]/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-[#E8D39B] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#C9AA67]" />
                <span>البوابة الرقمية والخدمات الذكية:</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handlePortalNavigate('apply')}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition flex items-center justify-between cursor-pointer border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C9AA67]" />
                    <span>استمارة الاستشارة الفورية</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <button
                  onClick={() => handlePortalNavigate('track')}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition flex items-center justify-between cursor-pointer border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C9AA67]" />
                    <span>تتبع حالة الطلب والمعاملة</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <button
                  onClick={() => handlePortalNavigate('dashboard')}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#07131b] hover:bg-[#0c222e] text-[#E8D39B] font-bold text-xs transition flex items-center justify-between cursor-pointer border border-[#c5a880]/40"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>لوحة تحكم الإدارة CRM</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-[#C9AA67]" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-gray-400 pt-4">
              شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
