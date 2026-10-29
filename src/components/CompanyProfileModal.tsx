import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({ isOpen, onClose }) => {
  const pdfUrl = '/company-profile.pdf';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
          dir="rtl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl h-[92vh] bg-[#071720] rounded-2xl md:rounded-3xl border border-[#C9AA67]/35 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Elegant Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-3.5 bg-[#051118]/95 border-b border-[#C9AA67]/20 flex items-center justify-between gap-3 shrink-0">
              
              {/* Right Side: Firm Branding & Clean Title */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/logo.png"
                  alt="شعار الشركة"
                  className="h-8 sm:h-9 w-auto object-contain shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                    بروفايل الشركة التعريفي
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#C9AA67]/90 truncate">
                    شركة حجاج عبدالرحمن الضويحي للمحاماة
                  </p>
                </div>
              </div>

              {/* Left Side: Modern Action Buttons & Close */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Open in New Tab Button */}
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#F5F0E8] border border-white/10 hover:border-[#C9AA67]/40 text-xs font-semibold transition-all cursor-pointer"
                  title="فتح في تبويب جديد"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C9AA67]" />
                  <span className="hidden sm:inline">فتح في صفحة جديدة</span>
                  <span className="sm:hidden">فتح</span>
                </a>

                {/* Download PDF Button */}
                <a
                  href={pdfUrl}
                  download="الملف_التعريفي_شركة_حجاج_الضويحي_للمحاماة.pdf"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#C9AA67] hover:bg-[#D4B979] text-[#071B23] text-xs font-bold shadow-md hover:shadow-[#C9AA67]/20 transition-all cursor-pointer"
                  title="تحميل الملف التعريفي PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل PDF</span>
                </a>

                {/* Vertical Divider */}
                <span className="w-px h-5 bg-white/15 mx-0.5" />

                {/* Modern Close Button */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 text-white/80 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="إغلاق"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="relative flex-1 bg-[#0b1922] w-full h-full overflow-hidden flex flex-col">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                title="الملف التعريفي لشركة حجاج عبدالرحمن الضويحي للمحاماة"
                className="w-full h-full border-0 flex-1 bg-white"
              />

              {/* Bottom Subtle Status Bar */}
              <div className="bg-[#051118] border-t border-white/10 px-4 sm:px-6 py-2 flex items-center justify-between text-[11px] sm:text-xs text-[#8CA8B8] shrink-0">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9AA67]" />
                  <span>ترخيص وزارة العدل رقم: 41/1820</span>
                </div>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9AA67] hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>عرض بكامل الشاشة</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
