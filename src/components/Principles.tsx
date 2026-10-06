import React from 'react';
import { motion, useInView } from 'motion/react';
import { Lock, Target, Scale, Sparkles, ShieldCheck, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { LEGAL_PRINCIPLES } from '../data/lawFirmData';
import { TextReveal } from './TextReveal';

const iconMap: Record<string, React.ReactNode> = {
  Lock: <Lock className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
};

interface DaySchedule {
  dayName: string;
  morning: string;
  evening: string;
  status: 'open' | 'evening-only' | 'closed';
  statusText: string;
}

const allWeekDays: DaySchedule[] = [
  {
    dayName: 'السبت',
    morning: '— (مغلق صباحاً)',
    evening: '4:00 م – 10:00 م',
    status: 'evening-only',
    statusText: 'فترة مسائية فقط',
  },
  {
    dayName: 'الأحد',
    morning: '8:00 ص – 12:00 م',
    evening: '4:00 م – 10:00 م',
    status: 'open',
    statusText: 'فترتان صباحية ومسائية',
  },
  {
    dayName: 'الإثنين',
    morning: '8:00 ص – 12:00 م',
    evening: '4:00 م – 10:00 م',
    status: 'open',
    statusText: 'فترتان صباحية ومسائية',
  },
  {
    dayName: 'الثلاثاء',
    morning: '8:00 ص – 12:00 م',
    evening: '4:00 م – 10:00 م',
    status: 'open',
    statusText: 'فترتان صباحية ومسائية',
  },
  {
    dayName: 'الأربعاء',
    morning: '8:00 ص – 12:00 م',
    evening: '4:00 م – 10:00 م',
    status: 'open',
    statusText: 'فترتان صباحية ومسائية',
  },
  {
    dayName: 'الخميس',
    morning: '8:00 ص – 12:00 م',
    evening: '4:00 م – 10:00 م',
    status: 'open',
    statusText: 'فترتان صباحية ومسائية',
  },
  {
    dayName: 'الجمعة',
    morning: '— (مغلق)',
    evening: '— (مغلق)',
    status: 'closed',
    statusText: 'إجازة أسبوعية',
  },
];

export const Principles: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="principles" ref={ref} className="bg-[#EDE3D0] py-16 md:py-28 border-y border-[#DDD5C4]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <span className="eyebrow">مبادئنا الأساسية</span>
        <TextReveal
          text="منهج قانوني يقوم على الدقة والمصداقية"
          tag="h2"
          className="text-2xl sm:text-3xl md:text-[42px] font-bold mt-2 sm:mt-3 text-[#171717]"
        />
        <p className="mt-2.5 sm:mt-3 text-[#635E52] text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-[1.8]">
          قيم مهنية راسخة تشكل ركيزة تعاملاتنا وتضمن أعلى درجات الاحترافية لعملائنا
        </p>

        {/* 5 Principles Grid */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5 text-right">
          {LEGAL_PRINCIPLES.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F9F6F0] rounded-2xl p-5 sm:p-6 border border-[#DDD5C4] hover:border-[#C9AA67] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#071B23]/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#C9AA67]/20 text-[#8A6D24] border border-[#C9AA67]/30 flex items-center justify-center">
                    {iconMap[p.iconName] || <Scale className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C9AA67]">
                    {p.number}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-[#171717] leading-[1.4] mb-1.5 sm:mb-2">
                  {p.title}
                </h3>
              </div>
              <p className="text-xs sm:text-[13px] text-[#635E52] leading-[1.8]">
                {p.subtitle}
              </p>
            </motion.article>
          ))}
        </div>

        {/* ════════════════════════════════════════════
            SCHEDULE: LUXURY RESPONSIVE SCHEDULE
        ════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-12 sm:mt-16 bg-[#071B23] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#C9AA67]/35 shadow-2xl text-right text-white"
        >
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 sm:pb-6 border-b border-white/10 gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#C9AA67]/20 border border-[#C9AA67]/40 text-[#E8D39B] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  جدول مواعيد وساعات العمل الرسمية
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-[#8CA8B8] mt-0.5">
                  يسعدنا استقبالكم واستقبال طلباتكم وفق الأوقات المحددة أدناه
                </p>
              </div>
            </div>

            {/* 24/7 Notarization Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl sm:rounded-2xl bg-[#C9AA67]/15 border border-[#C9AA67]/35 text-[#E8D39B] text-xs sm:text-sm font-bold self-start md:self-auto shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#C9AA67] shrink-0" />
              <span>خدمات التوثيق: متاحة على مدار 24 ساعة</span>
            </div>
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-xs sm:text-sm text-[#C9AA67] font-bold">
                  <th className="py-3.5 px-4">اليوم</th>
                  <th className="py-3.5 px-4">الفترة الصباحية</th>
                  <th className="py-3.5 px-4">الفترة المسائية</th>
                  <th className="py-3.5 px-4 text-center">حالة العمل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                {allWeekDays.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      item.status === 'closed'
                        ? 'bg-red-500/[0.04] text-white/50'
                        : idx % 2 === 0
                        ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                        : 'hover:bg-white/[0.05]'
                    }`}
                  >
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${item.status === 'closed' ? 'text-red-400/50' : 'text-[#C9AA67]'}`} />
                      <span>{item.dayName}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={item.morning.includes('مغلق') ? 'text-[#5E7987]' : 'text-[#CBD5E1] font-medium'}>
                        {item.morning}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={item.evening.includes('مغلق') ? 'text-red-400/70' : 'text-[#E8D39B] font-semibold'}>
                        {item.evening}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'open'
                            ? 'bg-[#059669]/20 text-[#34D399] border border-[#059669]/30'
                            : item.status === 'evening-only'
                            ? 'bg-[#C9AA67]/20 text-[#E8D39B] border border-[#C9AA67]/30'
                            : 'bg-red-500/15 text-red-300 border border-red-500/25'
                        }`}
                      >
                        {item.statusText}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (< md) for pure eye comfort */}
          <div className="md:hidden space-y-2.5">
            {allWeekDays.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-right transition-all ${
                  item.status === 'open'
                    ? 'bg-[#0B2530] border-[#1E4354]'
                    : item.status === 'evening-only'
                    ? 'bg-[#0B2530] border-[#C9AA67]/35'
                    : 'bg-[#07171E] border-white/5 opacity-65'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Calendar className={`w-3.5 h-3.5 ${item.status === 'closed' ? 'text-red-400' : 'text-[#C9AA67]'}`} />
                    {item.dayName}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-md font-semibold ${
                      item.status === 'open'
                        ? 'bg-[#059669]/20 text-[#34D399] border border-[#059669]/30'
                        : item.status === 'evening-only'
                        ? 'bg-[#C9AA67]/20 text-[#E8D39B] border border-[#C9AA67]/30'
                        : 'bg-red-500/15 text-red-300 border border-red-500/25'
                    }`}
                  >
                    {item.statusText}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-black/25 rounded-lg p-2 border border-white/5">
                    <span className="block text-[#8CA8B8] text-[10px]">الصباحية:</span>
                    <span className={`font-semibold ${item.morning.includes('مغلق') ? 'text-[#5E7987]' : 'text-[#E2E8F0]'}`}>
                      {item.morning}
                    </span>
                  </div>
                  <div className="bg-black/25 rounded-lg p-2 border border-white/5">
                    <span className="block text-[#8CA8B8] text-[10px]">المسائية:</span>
                    <span className={`font-semibold ${item.evening.includes('مغلق') ? 'text-red-400/80' : 'text-[#E8D39B]'}`}>
                      {item.evening}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note inside Schedule */}
          <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#8CA8B8] gap-2 text-center sm:text-right">
            <span>📍 المقر: الرياض، الخرج، طريق الملك عبدالله</span>
            <span className="text-[#C9AA67] font-semibold">📞 للاستفسارات والتوثيق 24 ساعة: 0555102513</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
