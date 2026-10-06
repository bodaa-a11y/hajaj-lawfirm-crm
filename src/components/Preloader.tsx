import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FIRM_DETAILS } from '../data/lawFirmData';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Elegant splash screen duration: 1.8 seconds
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#071B23] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient Background Gold Glow */}
          <div className="absolute w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-[#C9AA67]/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

          {/* Center Logo with Pulse & Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="relative mb-6">
              {/* Outer Golden Ring Animation */}
              <div className="absolute -inset-4 rounded-full border border-[#C9AA67]/25 animate-ping opacity-40" />
              <div className="absolute -inset-2 rounded-full border border-[#C9AA67]/40 animate-pulse" />

              {/* Logo Image */}
              <img
                src="/logo.png"
                alt={FIRM_DETAILS.name}
                className="w-[170px] sm:w-[220px] md:w-[260px] h-auto drop-shadow-[0_0_35px_rgba(201,170,103,0.35)]"
              />
            </div>

            {/* Firm Name */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-2xl font-bold text-white tracking-wide"
            >
              {FIRM_DETAILS.shortName}
            </motion.h2>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xs sm:text-sm text-[#C9AA67] mt-1.5 font-medium tracking-wide"
            >
              {FIRM_DETAILS.slogan}
            </motion.p>

            {/* Sleek Progress Line */}
            <div className="mt-8 w-44 sm:w-56 h-[3px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-[#B8963A] via-[#E8D39B] to-[#C9AA67] rounded-full shadow-[0_0_12px_rgba(201,170,103,0.8)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
