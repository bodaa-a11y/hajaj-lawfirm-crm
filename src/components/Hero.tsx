import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowDown } from 'lucide-react';
import { FIRM_DETAILS } from '../data/lawFirmData';

interface HeroProps { onExploreMore: () => void; onOpenConsultation: () => void; }

/* ── Typewriter Hook ── */
function useTypewriter(text: string, speed = 55, startDelay = 800) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      timeout = setTimeout(function tick() {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
          timeout = setTimeout(tick, speed);
        } else {
          setDone(true);
        }
      }, speed);
    };

    const delayTimeout = setTimeout(startTyping, startDelay);
    return () => { clearTimeout(delayTimeout); clearTimeout(timeout); };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export const Hero: React.FC<HeroProps> = ({ onExploreMore, onOpenConsultation }) => {
  const welcomeText = `نرحب بكم في شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية والتوثيق`;
  const { displayed, done } = useTypewriter(welcomeText, 45, 1200);

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#071B23] text-white">
      {/* ── Background Image ── */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="مكتب محاماة"
          className="w-full h-full object-cover scale-[1.04] brightness-[.30] saturate-[.65]"
        />
        {/* Dark overlay layers */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,27,35,.72)_0%,rgba(7,27,35,.40)_40%,rgba(7,27,35,.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_0%,rgba(7,27,35,.50)_55%,rgba(7,27,35,.85)_100%)]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-5xl px-5 pt-24 pb-20 text-center flex flex-col items-center">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-10"
        >
          <img
            src="/logo.png"
            alt={FIRM_DETAILS.name}
            className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] h-auto mx-auto drop-shadow-[0_4px_32px_rgba(201,170,103,0.25)]"
          />
        </motion.div>

        {/* Typewriter Welcome Text */}
        <div className="max-w-4xl min-h-[90px] sm:min-h-[110px] md:min-h-[130px]">
          <h1 className="text-[26px] sm:text-3xl md:text-4xl lg:text-[46px] font-bold leading-[1.45] tracking-[-.01em] text-[#C9AA67]">
            {displayed}
            {!done && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block w-[3px] h-[1em] bg-[#C9AA67] align-middle mr-1 rounded-sm"
              />
            )}
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mt-6 md:mt-7 text-[14px] sm:text-lg md:text-xl leading-[2] text-[#F5F0E8]/85"
        >
          {FIRM_DETAILS.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 4, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={onExploreMore}
            className="group min-w-52 px-8 py-4 rounded-full bg-[#C9AA67] text-[#071B23] font-bold shadow-xl shadow-black/20 hover:bg-[#D4B979] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            استكشف المزيد <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <button
            onClick={onOpenConsultation}
            className="px-7 py-4 rounded-full border border-white/35 bg-white/5 backdrop-blur-md text-white font-semibold hover:bg-white/10 transition-all"
          >
            احجز استشارة قانونية
          </button>
        </motion.div>
      </div>

      {/* ── Scroll Down Hint ── */}
      <motion.button
        onClick={onExploreMore}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-[#C9AA67] flex flex-col items-center gap-2 text-[11px]"
      >
        <span>مرر للاستكشاف</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.7, repeat: Infinity }}>
          <ArrowDown className="w-4 h-4" />
        </motion.span>
      </motion.button>
    </section>
  );
};
