import React from 'react';
import { motion, useInView } from 'motion/react';
import { Phone, Smartphone, Mail, MapPin, ArrowUpLeft } from 'lucide-react';
import { CONTACT_ITEMS } from '../data/lawFirmData';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Phone, Smartphone, Mail, MapPin
};

export const ContactStrip: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="contact-strip" ref={ref} className="bg-[#071B23] py-16 md:py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#C9AA67]/15 text-[#C9AA67] text-xs font-bold tracking-wide mb-4 border border-[#C9AA67]/20">
            نحن هنا لخدمتك
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold leading-[1.4] text-white">
            تواصل معنا <span className="text-[#C9AA67]">بأي وقت</span>
          </h2>
          <p className="mt-3 text-[#A0B4BF] text-sm sm:text-base max-w-xl mx-auto leading-[1.8]">
            يسعدنا استقبال استفساراتك وتقديم الدعم القانوني الذي تحتاجه
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {CONTACT_ITEMS.map((item, i) => {
            const Icon = iconMap[item.iconName];
            return (
              <motion.a
                key={item.id}
                href={item.href}
                target={item.id === 'location' ? '_blank' : undefined}
                rel={item.id === 'location' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-[#0D2A35] border border-[#1A3D4D] rounded-2xl p-6 flex flex-col gap-5 hover:border-[#C9AA67]/50 hover:bg-[#112F3C] transition-all duration-400 cursor-pointer"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#C9AA67]/10 text-[#C9AA67] flex items-center justify-center group-hover:bg-[#C9AA67] group-hover:text-[#071B23] transition-all duration-300">
                  {Icon && <Icon className="w-6 h-6" />}
                </div>

                {/* Text */}
                <div className="text-right flex-1">
                  <span className="block text-xs text-[#7CA0B0] mb-2 font-medium">
                    {item.label}
                  </span>
                  <span
                    className="block text-base md:text-lg font-bold text-white group-hover:text-[#C9AA67] transition-colors truncate"
                    dir={item.id === 'phone' || item.id === 'mobile' ? 'ltr' : undefined}
                  >
                    {item.value}
                  </span>
                  {item.subValue && (
                    <span className="block text-[11px] text-[#5A8498] mt-1.5">
                      {item.subValue}
                    </span>
                  )}
                </div>

                {/* Action Link */}
                <div className="flex items-center justify-between border-t border-[#1A3D4D] pt-4 mt-auto">
                  <span className="text-[12px] font-semibold text-[#C9AA67]/80 group-hover:text-[#C9AA67] transition-colors">
                    {item.actionText}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#C9AA67]/10 flex items-center justify-center group-hover:bg-[#C9AA67]/20 transition-colors">
                    <ArrowUpLeft className="w-3.5 h-3.5 text-[#C9AA67] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
