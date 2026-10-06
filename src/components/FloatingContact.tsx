import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface FloatingContactProps {
  onClick: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-[#FAF7F2] text-[#071B23] border border-[#DDD5C4] shadow-xl hover:shadow-2xl hover:border-[#B8963A] transition-all duration-300 focus:outline-none"
      >
        {/* Black Circular Icon */}
        <div className="w-10 h-10 rounded-full bg-[#071B23] text-[#C9AA67] flex items-center justify-center shadow-md group-hover:bg-[#B8963A] group-hover:text-[#071B23] transition-colors duration-300">
          <MessageCircle className="w-5 h-5" />
        </div>

        {/* Text Label */}
        <div className="text-right">
          <span className="block text-xs font-bold text-[#071B23] tracking-wide">
            تواصل معنا
          </span>
          <span className="block text-[10px] text-[#7A6A52] font-medium">
            استشارة فورية
          </span>
        </div>
      </motion.button>
    </div>
  );
};
