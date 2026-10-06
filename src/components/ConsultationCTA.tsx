import React from 'react';
import { motion, useInView } from 'motion/react';
import { FolderOpen, UserPlus, Scale, UserCheck, ChevronLeft, CalendarCheck } from 'lucide-react';

export type BookingType = 'existing' | 'new' | 'consultant' | 'founder';

interface Props {
  onOpenBooking: (type: BookingType, title: string) => void;
}

export const ConsultationCTA: React.FC<Props> = ({ onOpenBooking }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const bookingOptions = [
    {
      type: 'existing' as BookingType,
      title: 'حجز موعد ( لعميل مكتب )',
      subtitle: 'للعملاء الحاليين والمتابعة مع فريق القضية',
      icon: <FolderOpen className="w-6 h-6" />,
    },
    {
      type: 'new' as BookingType,
      title: 'حجز موعد ( لعميل جديد )',
      subtitle: 'دراسة القضية وتحديد الموقف القانوني الأولي',
      icon: <UserPlus className="w-6 h-6" />,
    },
    {
      type: 'consultant' as BookingType,
      title: 'حجز موعد مع المستشار القانوني',
      subtitle: 'استشارات تجارية، عمالية، عقارية، وشركات',
      icon: <Scale className="w-6 h-6" />,
    },
    {
      type: 'founder' as BookingType,
      title: 'حجز موعد مع المحامي أ. حجاج الضويحي',
      subtitle: 'جلسة استشارية خاصة ومباشرة مع رئيس الشركة',
      icon: <UserCheck className="w-6 h-6" />,
    },
  ];

  return (
    <section id="booking" ref={ref} className="relative bg-[#FAF8F4] py-16 sm:py-24 overflow-hidden border-t border-[#E5DEC9]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9AA67]/15 text-[#8A6D24] text-xs font-bold tracking-wide mb-3 border border-[#C9AA67]/30 shadow-sm">
            <CalendarCheck className="w-4 h-4 text-[#B8963A]" />
            <span>الخدمات والمواعيد</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-[#071B23] leading-tight">
            حجز موعد <span className="text-[#B8963A]">واستشارة قانونية</span>
          </h2>
          
          <p className="mt-3 text-[#635E52] text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            اختر نوع الموعد المناسب لجدولة جلستك مع المحامي أو المستشار القانوني مباشرة.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#C9AA67] to-transparent mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* 4 Luxury Booking Cards */}
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {bookingOptions.map((opt, index) => (
            <motion.div
              key={opt.type}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onOpenBooking(opt.type, opt.title)}
              className="group relative cursor-pointer bg-gradient-to-r from-[#071B23] via-[#0B2530] to-[#071B23] hover:from-[#0B2530] hover:via-[#0F303E] hover:to-[#0B2530] border border-[#C9AA67]/25 hover:border-[#C9AA67] rounded-2xl p-4 sm:p-5 sm:px-7 flex items-center justify-between shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 text-right overflow-hidden"
            >
              {/* Gold Indicator Line */}
              <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#E8D39B] via-[#C9AA67] to-[#B8963A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon Emblem */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 group-hover:bg-[#C9AA67] border border-[#C9AA67]/40 group-hover:border-[#C9AA67] text-[#E8D39B] group-hover:text-[#071B23] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-all duration-300">
                {opt.icon}
              </div>

              {/* Text Info */}
              <div className="flex-1 px-4 sm:px-6 text-right">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-[#E8D39B] transition-colors leading-snug">
                  {opt.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#8CA8B8] group-hover:text-[#CBD5E1] transition-colors mt-0.5">
                  {opt.subtitle}
                </p>
              </div>

              {/* Action Arrow */}
              <div className="text-[#C9AA67] group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
