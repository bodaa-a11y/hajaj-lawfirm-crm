import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Award, FileCheck, Scale, ShieldCheck, BadgeCheck, ZoomIn, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  imgSrc: string;
  icon: React.ReactNode;
}

const certificates: Certificate[] = [
  {
    id: 'lawyer-license',
    title: 'رخصة المحاماة',
    shortTitle: 'رخصة المحاماة',
    description: 'ترخيص ممارسة مهنة المحاماة الصادر من وزارة العدل بالمملكة العربية السعودية.',
    imgSrc: '/cert-law.jpg',
    icon: <Scale className="w-6 h-6" />,
  },
  {
    id: 'notarization-license',
    title: 'رخصة التوثيق',
    shortTitle: 'رخصة التوثيق',
    description: 'ترخيص التوثيق المعتمد من وزارة العدل لتقديم خدمات التوثيق الرسمية على مدار 24 ساعة.',
    imgSrc: '/cert-notary.jpg',
    icon: <FileCheck className="w-6 h-6" />,
  },
  {
    id: 'sasl-accreditation',
    title: 'شهادة الاعتماد المهني السعودي (SASL)',
    shortTitle: 'الاعتماد المهني SASL',
    description: 'شهادة اجتياز الاعتماد المهني السعودي للقانونيين الصادرة من الهيئة السعودية للمحامين.',
    imgSrc: '/cert-5.jpg',
    icon: <BadgeCheck className="w-6 h-6" />,
  },
  {
    id: 'franchise-certificate',
    title: 'شهادة وسطاء الامتياز التجاري',
    shortTitle: 'وسطاء الامتياز التجاري',
    description: 'شهادة إعداد وتأهيل وسطاء الامتياز التجاري المعتمدة لتقديم استشارات وحلول الامتياز التجاري.',
    imgSrc: '/cert-franchise.jpg',
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    id: 'labor-consulting-license',
    title: 'ترخيص استشارات عمالية',
    shortTitle: 'استشارات عمالية',
    description: 'ترخيص مستشار استشارات عمالية معتمد صادر من وزارة الموارد البشرية والتنمية الاجتماعية.',
    imgSrc: '/cert-hajaj.jpg',
    icon: <Award className="w-6 h-6" />,
  },
];

export const Certificates: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const gridStyle = React.useMemo(() => {
    if (isDesktop) {
      const cols = certificates.map((_, i) => (i === activeIndex ? '4.5fr' : '1fr')).join(' ');
      return { gridTemplateColumns: cols, gridTemplateRows: '1fr' };
    } else {
      const rows = certificates.map((_, i) => (i === activeIndex ? '4fr' : '1fr')).join(' ');
      return { gridTemplateRows: rows, gridTemplateColumns: '1fr' };
    }
  }, [activeIndex, isDesktop]);

  const handleNextZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomIndex !== null) {
      setZoomIndex((zoomIndex + 1) % certificates.length);
    }
  };

  const handlePrevZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomIndex !== null) {
      setZoomIndex((zoomIndex - 1 + certificates.length) % certificates.length);
    }
  };

  return (
    <section id="certificates" ref={ref} className="bg-[#071B23] py-16 md:py-24 overflow-hidden border-y border-[#B8963A]/15">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9AA67]/10 text-[#C9AA67] text-xs font-bold tracking-wide mb-4 border border-[#C9AA67]/25 shadow-sm">
            <Award className="w-4 h-4 text-[#C9AA67]" />
            <span>الشهادات والتراخيص المعتمدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.4] text-white">
            اعتمادات وتراخيص <span className="text-[#C9AA67]">رسمية موثقة</span>
          </h2>
          <p className="mt-3 text-[#8CA8B8] text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-[1.9]">
            نعمل وفق أعلى معايير الترخيص والاعتماد المهني المعتمدة من وزارة العدل والهيئة السعودية للمحامين.
          </p>
        </motion.div>

        {/* Expanding Cards Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full grid h-[560px] sm:h-[620px] md:h-[520px] gap-2.5 sm:gap-3 transition-[grid-template-columns,grid-template-rows] duration-500 ease-out"
          style={gridStyle}
        >
          {certificates.map((cert, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={cert.id}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => {
                  if (isActive) {
                    setZoomIndex(index);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                tabIndex={0}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 min-h-0 min-w-0 bg-[#0B232E] ${
                  isActive
                    ? 'border-[#C9AA67] ring-2 ring-[#C9AA67]/30 shadow-2xl shadow-[#C9AA67]/10'
                    : 'border-[#173745] hover:border-[#C9AA67]/50 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Certificate Background Image */}
                <div className="absolute inset-0 bg-[#F4F1EA]">
                  <img
                    src={cert.imgSrc}
                    alt={cert.title}
                    className={`w-full h-full object-contain md:object-cover object-center transition-all duration-700 ${
                      isActive
                        ? 'scale-100 grayscale-0 brightness-100'
                        : 'scale-105 grayscale brightness-90 contrast-110'
                    }`}
                  />
                </div>

                {/* Gradient Overlays for readable text */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? 'bg-gradient-to-t from-[#071B23] via-[#071B23]/75 to-transparent opacity-95'
                      : 'bg-[#071B23]/80 hover:bg-[#071B23]/70 opacity-100'
                  }`}
                />

                {/* Collapsed State: Vertical Title for Desktop */}
                {!isActive && isDesktop && (
                  <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-[#C9AA67] opacity-80">
                        {cert.icon}
                      </div>
                      <span
                        className="text-white/90 text-sm font-bold tracking-wide select-none drop-shadow-md whitespace-nowrap"
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          transform: 'rotate(180deg)',
                        }}
                      >
                        {cert.shortTitle}
                      </span>
                    </div>
                  </div>
                )}

                {/* Collapsed State for Mobile */}
                {!isActive && !isDesktop && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-5 pointer-events-none">
                    <span className="text-white/90 text-xs sm:text-sm font-bold drop-shadow">
                      {cert.shortTitle}
                    </span>
                    <span className="text-[#C9AA67] scale-90">{cert.icon}</span>
                  </div>
                )}

                {/* Active Expanded State Content */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 transition-all duration-500 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-2.5">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#C9AA67]/20 border border-[#C9AA67]/40 flex items-center justify-center text-[#E8D39B] shadow-inner shrink-0">
                      {cert.icon}
                    </div>
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-white/10 backdrop-blur-sm text-[#E8D39B] text-[11px] sm:text-xs font-semibold border border-white/15">
                      معتمد وموثق
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2 leading-tight">
                    {cert.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed max-w-xl mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                    {cert.description}
                  </p>

                  <div className="flex items-center gap-3 pt-0.5 sm:pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomIndex(index);
                      }}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#C9AA67] text-[#071B23] text-xs sm:text-sm font-bold shadow-lg hover:bg-[#DBC182] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>تكبير وعرض الشهادة</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </motion.div>

      </div>

      {/* ════════════════════════════════════════════
          IN-PLACE LIGHTBOX MODAL (NO PDF REDIRECT)
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {zoomIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setZoomIndex(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center bg-[#071B23] rounded-2xl sm:rounded-3xl border-2 border-[#C9AA67]/40 shadow-2xl p-4 sm:p-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Controls */}
              <div className="w-full flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 text-right mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#C9AA67]/20 text-[#E8D39B] flex items-center justify-center">
                    {certificates[zoomIndex].icon}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-lg font-bold text-white leading-tight">
                      {certificates[zoomIndex].title}
                    </h4>
                    <span className="text-[10px] sm:text-xs text-[#C9AA67]">
                      شهادة معتمدة وموثقة رسمياً
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setZoomIndex(null)}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* High-Resolution Certificate Image */}
              <div className="relative w-full flex items-center justify-center overflow-auto rounded-xl bg-[#030D11] p-2 sm:p-3 max-h-[68vh]">
                <img
                  src={certificates[zoomIndex].imgSrc}
                  alt={certificates[zoomIndex].title}
                  className="max-h-[62vh] sm:max-h-[65vh] w-auto object-contain rounded-lg shadow-lg"
                />
              </div>

              {/* Bottom Navigation Controls */}
              <div className="w-full flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 text-xs sm:text-sm text-white/80">
                <button
                  onClick={handlePrevZoom}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابقة</span>
                </button>

                <span className="text-xs text-[#C9AA67] font-semibold">
                  {zoomIndex + 1} / {certificates.length}
                </span>

                <button
                  onClick={handleNextZoom}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <span>التالية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
