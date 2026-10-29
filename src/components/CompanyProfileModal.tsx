import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ExternalLink, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

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
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6"
          dir="rtl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl h-[92vh] bg-[#071B23] rounded-2xl sm:rounded-3xl border-2 border-[#C9AA67]/40 shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Gold Accent Bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#071B23] via-[#C9AA67] to-[#071B23] shrink-0" />

            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#07131b] border-b border-[#C9AA67]/25 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#C9AA67]/15 border border-[#C9AA67]/40 flex items-center justify-center text-[#E8D39B] shrink-0 shadow-inner">
                  <BookOpen className="w-5 h-5 text-[#C9AA67]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-lg font-bold text-white font-amiri">
                      الملف التعريفي الرسمي (Company Profile)
                    </h3>
                    <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C9AA67]/15 border border-[#C9AA67]/30 text-[#E8D39B] text-[11px] font-semibold">
                      <Sparkles className="w-3 h-3 text-[#C9AA67]" />
                      نسخة رسمية معتمدة
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#8CA8B8]">
                    شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية والتوثيق
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#E8D39B] hover:text-white border border-[#C9AA67]/30 text-xs font-bold transition-all cursor-pointer"
                  title="فتح في تبويب مستقل"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C9AA67]" />
                  <span>فتح في تبويب جديد</span>
                </a>

                <a
                  href={pdfUrl}
                  download="الملف_التعريفي_شركة_حجاج_الضويحي_للمحاماة.pdf"
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#B8963A] via-[#C9AA67] to-[#B8963A] text-[#071B23] hover:brightness-110 text-xs font-bold shadow-md transition-all cursor-pointer"
                  title="تحميل الملف التعريفي PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">تحميل البروفايل (PDF)</span>
                  <span className="sm:hidden">تحميل</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer mr-1"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer Container */}
            <div className="relative flex-1 bg-[#0b1922] w-full h-full overflow-hidden flex flex-col">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                title="الملف التعريفي لشركة حجاج عبدالرحمن الضويحي للمحاماة"
                className="w-full h-full border-0 flex-1 bg-white"
              />

              {/* Mobile / Fallback Quick Bar */}
              <div className="bg-[#07131b] border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-[#8CA8B8] shrink-0">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C9AA67]" />
                  <span>ترخيص وزارة العدل رقم: 41/1820</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E8D39B] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>عرض بملء الشاشة</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
