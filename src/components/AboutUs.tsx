import React from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowLeft, Award, Scale, BookOpen } from 'lucide-react';

interface Props {
  onOpenConsultation: () => void;
  onExploreServices: () => void;
}

export const AboutUs: React.FC<Props> = ({ onExploreServices }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="about" ref={ref} className="bg-[#FAF8F4] py-14 sm:py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
        
        {/* Lawyer Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-[260px] sm:max-w-[320px] md:max-w-[380px] mx-auto w-full order-2 lg:order-1"
        >
          <div className="rounded-2xl sm:rounded-[24px] overflow-hidden shadow-xl sm:shadow-2xl border-2 border-[#E8E0D0] ring-1 ring-[#C9AA67]/20">
            <img
              src="/lawyer.jpg"
              alt="المحامي والموثق حجاج عبدالرحمن الضويحي"
              className="w-full aspect-[3/4] object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2 text-right"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 justify-start mb-3 sm:mb-4">
            <span className="w-8 sm:w-10 h-0.5 bg-[#B8963A]" />
            <span className="text-[#8A6D24] text-[11px] sm:text-xs font-bold uppercase tracking-wider">عن المحامي</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-[36px] font-bold leading-[1.4] text-[#171717] mb-3.5 sm:mb-5">
            المحامي والموثق{' '}
            <span className="text-[#B8963A]">حجاج عبدالرحمن الضويحي</span>
          </h2>

          <p className="text-[#635E52] text-xs sm:text-sm md:text-base leading-[1.9] sm:leading-[2.1] mb-5 sm:mb-6">
            محامٍ وموثق معتمد ومرخص من وزارة العدل، يتمتع بخبرة تتجاوز <strong className="text-[#171717]">12 عامًا</strong> في مجالات المحاماة والتقاضي والاستشارات القانونية والتوثيق. أسس شركته ليقدم خدمات قانونية شاملة تجمع بين الأصالة الشرعية والاحترافية المعاصرة، مع التزام تام بحماية حقوق العملاء وتحقيق مصالحهم.
          </p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5 bg-[#F1ECE3] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 border border-[#DDD5C4]">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8963A] shrink-0" />
              <span className="text-xs sm:text-[13px] text-[#5A5247] font-medium">مرخص من وزارة العدل</span>
            </div>
            <div className="flex items-center gap-2.5 bg-[#F1ECE3] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 border border-[#DDD5C4]">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8963A] shrink-0" />
              <span className="text-xs sm:text-[13px] text-[#5A5247] font-medium">عضو هيئة المحامين</span>
            </div>
            <div className="flex items-center gap-2.5 bg-[#F1ECE3] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 border border-[#DDD5C4]">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8963A] shrink-0" />
              <span className="text-xs sm:text-[13px] text-[#5A5247] font-medium">+3,300 توثيق منجز</span>
            </div>
          </div>

          <button
            onClick={onExploreServices}
            className="group w-full sm:w-auto justify-center px-7 py-3.5 rounded-full bg-[#C9AA67] text-[#071B23] text-xs sm:text-sm font-bold inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <span>استكشف خدماتنا القانونية</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
