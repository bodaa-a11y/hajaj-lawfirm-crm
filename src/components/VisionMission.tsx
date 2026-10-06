import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Eye, Target } from 'lucide-react';

// Smooth Animated Counter Component
interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  inView: boolean;
}

const AnimatedCounter: React.FC<CounterProps> = ({ end, duration = 2000, suffix = '', prefix = '', inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(easeOutExpo(progress) * end);
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, end, duration]);

  return (
    <span className="font-extrabold tracking-tight">
      {prefix}
      {count.toLocaleString('en-US')}
      {suffix}
    </span>
  );
};

export const VisionMission: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' });

  const stats = [
    {
      id: 'years',
      number: 12,
      suffix: ' +',
      title: 'سنة خبرة راسخة',
      description: 'تجاوزت خبرتنا 12 سنة في مختلف المجالات والأنظمة القانونية',
    },
    {
      id: 'notarizations',
      number: 3300,
      suffix: ' +',
      title: 'عملية توثيق معتمدة',
      description: 'أكثر من 3,300 عملية توثيق للعقود والوكالات والإفراغات العقارية',
    },
    {
      id: 'clients',
      number: 1500,
      suffix: ' +',
      title: 'عميل راضٍ وموثوق',
      description: 'أكثر من 1,500 عميل راضٍ من الأفراد والشركات والمؤسسات',
    },
    {
      id: 'cases',
      number: 1040,
      suffix: ' +',
      title: 'قضية منجزة بنجاح',
      description: 'أكثر من 1,040 قضية متنوعة تم إنجازها بنجاح أمام المحاكم واللجان',
    },
  ];

  return (
    <section id="vision-mission" ref={ref} className="bg-[#EAE4D3] py-14 sm:py-20 overflow-hidden border-b border-[#D8CEB8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Upper Part: Office Image & Vision/Mission Cards */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Office Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 order-2 lg:order-1 flex justify-center"
          >
            <div className="relative w-full max-w-[480px] group">
              <div className="rounded-[22px] overflow-hidden shadow-2xl border-2 border-white/80 ring-1 ring-[#B8963A]/25">
                <img
                  src="/hajjaj_desk.jpg"
                  alt="مكتب المحامي والموثق حجاج عبدالرحمن الضويحي"
                  className="w-full aspect-[4/3] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>

          {/* Vision & Mission Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 text-right">
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 justify-start mb-6 sm:mb-8"
            >
              <span className="w-8 sm:w-10 h-0.5 bg-[#B8963A]" />
              <span className="text-[#8A6D24] text-xs font-bold uppercase tracking-wider">
                رؤيتنا ورسالتنا
              </span>
            </motion.div>

            <div className="space-y-4 sm:space-y-5">
              {/* Vision Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FAF8F4] p-5 sm:p-7 rounded-2xl border border-[#DCD3BE] shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-5 items-start hover:shadow-md hover:border-[#C9AA67]/40 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#DECFA9] text-[#071B23] flex items-center justify-center shrink-0 shadow-sm border border-[#C6B386]">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#171717] mb-1.5 sm:mb-2">رؤيتنا</h3>
                  <p className="text-[#635E52] text-xs sm:text-sm md:text-[15px] leading-[1.9] sm:leading-[2]">
                    أن نكون الخيار الأول للعملاء في تقديم الخدمات القانونية من خلال الالتزام بالتميز والدقة وتوفير حلول قانونية متكاملة تُسهم في تعزيز بيئة العدالة وتحقيق رضا العملاء.
                  </p>
                </div>
              </motion.div>

              {/* Mission Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FAF8F4] p-5 sm:p-7 rounded-2xl border border-[#DCD3BE] shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-5 items-start hover:shadow-md hover:border-[#C9AA67]/40 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#DECFA9] text-[#071B23] flex items-center justify-center shrink-0 shadow-sm border border-[#C6B386]">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#171717] mb-1.5 sm:mb-2">رسالتنا</h3>
                  <p className="text-[#635E52] text-xs sm:text-sm md:text-[15px] leading-[1.9] sm:leading-[2]">
                    تقديم خدمات قانونية موثوقة وفعّالة، مبنية على أسس العدالة والنزاهة والمهنية، بما يلبي تطلعات الأفراد والشركات ويضمن حماية مصالحهم وفقًا للأنظمة المعمول بها في المملكة.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>

        {/* ════════════════════════════════════════════
            CLEAN TYPOGRAPHY STATISTICS NUMBERS SECTION
        ════════════════════════════════════════════ */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 35 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-12 sm:mt-16 pt-10 sm:pt-14 border-t border-[#D5CABB]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative group bg-[#071B23] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-[#C9AA67]/25 shadow-xl hover:border-[#C9AA67]/60 hover:-translate-y-1 transition-all duration-300 text-right overflow-hidden flex flex-col justify-between"
              >
                {/* Background Golden Ambient Glow */}
                <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#C9AA67]/10 rounded-full blur-2xl group-hover:bg-[#C9AA67]/20 transition-all duration-500" />
                
                {/* Accent Top Line */}
                <div className="w-10 h-1 bg-gradient-to-l from-[#C9AA67] to-transparent rounded-full mb-4 opacity-75 group-hover:w-16 transition-all duration-300" />

                {/* Animated Count Number */}
                <div className="text-3xl sm:text-4xl md:text-[44px] font-black text-transparent bg-clip-text bg-gradient-to-l from-[#E8D39B] via-[#C9AA67] to-[#FFF] mb-2.5 leading-none">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} inView={statsInView} />
                </div>

                {/* Stat Title */}
                <h4 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                  {stat.title}
                </h4>

                {/* Stat Description */}
                <p className="text-xs sm:text-[13px] text-[#A0B6C2] leading-[1.8]">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
