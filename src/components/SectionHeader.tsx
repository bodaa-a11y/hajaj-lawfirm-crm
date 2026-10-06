import React from 'react';
import { motion, useInView } from 'motion/react';
import { TextReveal } from './TextReveal';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'right';
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  theme = 'light',
  className = '',
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px 0px' });
  const isDark = theme === 'dark';

  return (
    <div
      ref={ref}
      className={`flex flex-col mb-12 md:mb-16 ${
        align === 'center' ? 'items-center text-center' : 'items-start text-right'
      } ${className}`}
    >
      {/* Gold Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2.5 mb-3"
      >
        <span className="w-6 h-[1.5px] bg-[#B8963A]" />
        <span className="text-xs md:text-sm font-semibold tracking-widest text-[#B8963A] uppercase">
          {eyebrow}
        </span>
        <span className="w-6 h-[1.5px] bg-[#B8963A]" />
      </motion.div>

      {/* Main Title with word reveal */}
      <div className="max-w-3xl">
        <TextReveal
          text={title}
          tag="h2"
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold tracking-tight leading-[1.3] ${
            isDark ? 'text-[#FAF7F2]' : 'text-[#071B23]'
          }`}
          staggerDelay={0.04}
          initialDelay={0.15}
        />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-4 text-base md:text-lg max-w-2xl font-normal leading-relaxed ${
            isDark ? 'text-[#EDE8DC]/80' : 'text-[#7A6A52]'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
