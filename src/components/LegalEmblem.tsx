import React from 'react';
import { FIRM_DETAILS } from '../data/lawFirmData';

interface LegalEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  theme?: 'light' | 'dark' | 'gold';
}

export const LegalEmblem: React.FC<LegalEmblemProps> = ({
  className = '',
  size = 'md',
  showText = true,
  theme = 'gold',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    hero: 'w-20 h-20 md:w-24 md:h-24',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
    hero: 'text-2xl md:text-3xl font-bold',
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Golden Geometric Scales Emblem */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl p-2 transition-transform duration-500 hover:scale-105 ${
          isDark
            ? 'bg-[#0E2530] border border-[#B8963A]/40 text-[#C9AA67]'
            : 'bg-gradient-to-b from-[#0E2530] to-[#071B23] border border-[#B8963A]/50 text-[#C9AA67] shadow-md'
        }`}
      >
        {/* Subtle geometric ring */}
        <div className="absolute inset-0 rounded-xl border border-[#B8963A]/20 pointer-events-none" />
        
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#C9AA67]"
        >
          {/* Top Pillar Tip */}
          <path
            d="M24 6L28 11H20L24 6Z"
            fill="currentColor"
            opacity="0.9"
          />
          {/* Center Pillar */}
          <path
            d="M23 11H25V36H23V11Z"
            fill="currentColor"
          />
          {/* Balance Beam */}
          <path
            d="M10 15C10 14.4477 10.4477 14 11 14H37C37.5523 14 38 14.4477 38 15C38 15.5523 37.5523 16 37 16H11C10.4477 16 10 15.5523 10 15Z"
            fill="currentColor"
          />
          {/* Left Scale Strings & Pan */}
          <path d="M12 16L7 27H19L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 27C6 30.5 9 32 13 32C17 32 20 30.5 20 27H6Z" fill="currentColor" opacity="0.85"/>
          
          {/* Right Scale Strings & Pan */}
          <path d="M36 16L31 27H43L38 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 27C30 30.5 33 32 37 32C41 32 44 30.5 44 27H30Z" fill="currentColor" opacity="0.85"/>

          {/* Stepped Pedestal Base */}
          <path d="M16 36H32V38H16V36Z" fill="currentColor" opacity="0.9"/>
          <path d="M12 38H36V42H12V38Z" fill="currentColor"/>
          
          {/* Star of Justice Center Accent */}
          <circle cx="24" cy="15" r="2.2" fill="#FAF7F2" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-right leading-tight">
          <span
            className={`${textSizes[size]} tracking-tight ${
              isDark ? 'text-[#FAF7F2]' : 'text-[#071B23]'
            }`}
          >
            {FIRM_DETAILS.shortName}
          </span>
          <span
            className={`text-xs tracking-wider ${
              isDark ? 'text-[#C9AA67]' : 'text-[#B8963A]'
            } font-medium`}
          >
            للمحاماة والاستشارات القانونية والتوثيق
          </span>
        </div>
      )}
    </div>
  );
};
