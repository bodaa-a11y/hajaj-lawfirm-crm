import React, { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { LEGAL_SERVICES } from '../data/lawFirmData';
import { LegalService } from '../types';
import {
  Scale,
  FileCheck,
  ScrollText,
  Building2,
  Briefcase,
  BadgeCheck,
  Store,
  ArrowLeft,
  X,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';

interface Props {
  onSelectServiceForConsultation: (s: LegalService) => void;
}

const icons: Record<string, React.ReactNode> = {
  Scale: <Scale className="w-5 h-5" />,
  FileCheck: <FileCheck className="w-5 h-5" />,
  ScrollText: <ScrollText className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  BadgeCheck: <BadgeCheck className="w-5 h-5" />,
  Store: <Store className="w-5 h-5" />,
};

export const Services: React.FC<Props> = ({ onSelectServiceForConsultation }) => {
  const [active, setActive] = useState('all');
  const [selected, setSelected] = useState<LegalService | null>(null);

  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const categories = [
    { id: 'all', label: 'كافة الخدمات' },
    { id: 'litigation', label: 'التقاضي والمحاكم' },
    { id: 'corporate', label: 'الشركات والاستشارات' },
    { id: 'documentation', label: 'خدمات التوثيق والعقود' },
  ];

  const filteredServices =
    active === 'all'
      ? LEGAL_SERVICES
      : LEGAL_SERVICES.filter((s) => s.category === active);

  return (
    <section id="services" ref={ref} className="bg-[#FAF8F4] py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="text-right">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#C9AA67]/15 text-[#8A6D24] text-xs font-bold tracking-wide mb-3 border border-[#C9AA67]/30">
              خدماتنا القانونية
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#171717] leading-[1.35]">
              منظومة خدمات <span className="text-[#B8963A]">قانونية متكاملة</span>
            </h2>
            <p className="mt-3 text-[#635E52] text-sm sm:text-base max-w-xl leading-[1.8]">
              نقدم باقة شاملة من الخدمات القانونية والشرعية والتوثيق المعتمد باحترافية عالية لحماية مصالح عملائنا.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
            {categories.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  active === id
                    ? 'bg-[#071B23] text-[#C9AA67] shadow-md border border-[#071B23]'
                    : 'bg-[#EDE4D0]/60 text-[#6F6A61] border border-[#DDD5C4] hover:border-[#B8963A] hover:bg-[#EDE4D0]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid (Solid Clean Dark Luxury Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {filteredServices.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelected(s)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-[#1E3B48] bg-[#071B23] hover:bg-[#0B2530] shadow-lg hover:shadow-2xl hover:shadow-[#071B23]/40 hover:border-[#C9AA67]/60 transition-all duration-300 text-right flex flex-col justify-between p-6 sm:p-7 min-h-[300px]"
            >
              {/* Subtle Ambient Radial Highlight */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#C9AA67]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#C9AA67]/10 transition-colors" />

              {/* Top Row: Small Plain Icon & Category Tag */}
              <div className="relative z-10 flex items-center justify-between mb-5">
                {/* Small Plain Elegant Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#0F2F3D] border border-[#C9AA67]/30 text-[#C9AA67] flex items-center justify-center group-hover:bg-[#C9AA67] group-hover:text-[#071B23] group-hover:border-[#C9AA67] transition-all duration-300 shadow-sm">
                  {icons[s.iconName] || <Scale className="w-5 h-5" />}
                </div>

                <span className="text-[11px] font-semibold text-[#C9AA67] border border-[#C9AA67]/25 bg-[#0F2F3D]/80 px-3 py-1 rounded-lg">
                  {s.categoryLabel}
                </span>
              </div>

              {/* Middle: Title & Description */}
              <div className="relative z-10 my-auto">
                <h3 className="text-xl sm:text-[22px] font-bold text-white group-hover:text-[#E8D39B] transition-colors leading-[1.35] mb-2.5">
                  {s.title}
                </h3>
                
                <p className="text-sm text-[#8CA8B8] leading-[1.8] line-clamp-3">
                  {s.shortDescription}
                </p>
              </div>

              {/* Bottom Row: Action link */}
              <div className="relative z-10 mt-6 pt-4 border-t border-[#173745] flex items-center justify-between text-[#C9AA67] group-hover:text-[#E8D39B] text-xs sm:text-sm font-bold transition-colors">
                <span>اكتشف ما نقدمه</span>
                <div className="w-7 h-7 rounded-lg bg-[#0F2F3D] border border-[#C9AA67]/25 flex items-center justify-center group-hover:bg-[#C9AA67] group-hover:text-[#071B23] transition-all duration-300">
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Details & Booking Modal */}
      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-[#071B23] text-white rounded-3xl border border-[#C9AA67]/40 p-6 sm:p-8 shadow-2xl my-6 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 pt-1">
                <div className="w-12 h-12 rounded-xl bg-[#0F2F3D] border border-[#C9AA67]/30 text-[#C9AA67] flex items-center justify-center shadow-sm shrink-0">
                  {icons[selected.iconName] || <Scale className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-xs text-[#C9AA67] font-semibold">
                    {selected.categoryLabel}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-0.5">
                    {selected.title}
                  </h3>
                </div>
              </div>

              {/* Full Description */}
              <p className="mt-6 text-[#CBD5E1] text-base leading-[2] border-b border-white/10 pb-6">
                {selected.fullDescription}
              </p>

              {/* Features List */}
              <div className="mt-6">
                <h4 className="text-sm font-bold text-[#C9AA67] mb-3">
                  أبرز ما تشمله هذه الخدمة:
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selected.features.map((f, i) => (
                    <div
                      key={i}
                      className="text-xs sm:text-sm bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 text-white/90"
                    >
                      <CheckCircle className="w-4 h-4 text-[#C9AA67] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Service CTA */}
              <button
                onClick={() => {
                  const s = selected;
                  setSelected(null);
                  onSelectServiceForConsultation(s);
                }}
                className="mt-8 w-full py-4 rounded-2xl bg-[#C9AA67] hover:bg-[#D4B979] text-[#071B23] font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-black/30 transition-all cursor-pointer"
              >
                <PhoneCall className="w-5 h-5" />
                <span>حجز استشارة أو طلب هذه الخدمة</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
