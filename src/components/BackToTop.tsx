import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 10 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="العودة لأعلى الصفحة"
          className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-gradient-to-tr from-[#B8963A] to-[#C9AA67] text-[#071B23] flex items-center justify-center shadow-lg hover:shadow-xl border border-white/20 transition-all duration-300 focus:outline-none cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 font-bold" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
