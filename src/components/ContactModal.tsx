import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Check, Building2, Video, Phone, ShieldCheck, User, PhoneCall, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export type BookingType = 'existing' | 'new' | 'consultant' | 'founder' | 'general';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType?: BookingType;
  bookingTitle?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  bookingType = 'general',
  bookingTitle,
}) => {
  const [meetingMode, setMeetingMode] = useState<'مقر الشركة' | 'أونلاين Zoom' | 'هاتفياً'>('مقر الشركة');
  const [fileNumber, setFileNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('10:00 ص');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Time Slots
  const slots = [
    '10:00 ص',
    '11:30 ص',
    '01:00 م',
    '04:30 م',
    '06:00 م',
    '07:30 م',
    '08:30 م',
    '09:30 م',
  ];

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setBookingDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine Title & Target Contact Phone based on user rules
  // 1. Consultant: +966 11 408 8009
  // 2. Founder (Hajjaj), Existing Client, New Client: 0555102513
  const isConsultantRoute = bookingType === 'consultant';
  const targetPhone = isConsultantRoute ? '+966114088009' : '0555102513';
  const targetPhoneDisplay = isConsultantRoute ? '011 408 8009' : '0555102513';
  const targetWhatsApp = isConsultantRoute ? '966114088009' : '966555102513';

  const currentTitle = bookingTitle || (
    bookingType === 'founder' ? 'حجز موعد مع المحامي أ. حجاج الضويحي' :
    bookingType === 'consultant' ? 'حجز موعد مع المستشار القانوني' :
    bookingType === 'existing' ? 'حجز موعد ( لعميل مكتب )' :
    bookingType === 'new' ? 'حجز موعد ( لعميل جديد )' :
    'حجز موعد واستشارة قانونية'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C9AA67', '#071B23', '#E8D39B'],
    });

    setIsSubmitted(true);

    // Build WhatsApp message
    const message = `*طلب حجز موعد جديد*
-----------------------------
📌 *نوع الموعد:* ${currentTitle}
🏢 *طريقة الجلسة:* ${meetingMode}
${bookingType === 'existing' && fileNumber ? `📁 *رقم الملف / الهوية:* ${fileNumber}\n` : ''}👤 *الاسم:* ${fullName}
📱 *رقم التواصل:* ${phone}
📅 *التاريخ المفضل:* ${bookingDate}
⏰ *الوقت المفضل:* ${selectedSlot}
${notes ? `📝 *موجز الموضوع:* ${notes}` : ''}
-----------------------------
_مرسل عبر موقع شركة حجاج عبدالرحمن الضويحي للمحاماة_`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${targetWhatsApp}?text=${encoded}`;
    
    // Auto redirect to WhatsApp after 1.2 seconds
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#070E17]/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#C9AA67]/40 overflow-hidden z-10 text-right my-8"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071B23] via-[#0B2530] to-[#071B23] text-white p-5 sm:p-6 flex items-center justify-between border-b-2 border-[#C9AA67]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8D39B] leading-tight">
              {currentTitle}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#8CA8B8] mt-0.5">
              {isConsultantRoute ? 'المستشار القانوني: 0114088009' : 'مكتب المحامي أ. حجاج الضويحي: 0555102513'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-red-600/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Meeting Mode Selector */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#071B23] mb-2">
                  طريقة عقد الجلسة
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMeetingMode('مقر الشركة')}
                    className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      meetingMode === 'مقر الشركة'
                        ? 'bg-[#FFF8EB] border-[#C9AA67] text-[#071B23] shadow-sm font-bold'
                        : 'bg-[#FAF8F5] border-[#E2DBCE] text-[#555] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 ${meetingMode === 'مقر الشركة' ? 'text-[#B8963A]' : 'text-gray-500'}`} />
                    <span className="text-[11px] sm:text-xs">مقر الشركة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMeetingMode('أونلاين Zoom')}
                    className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      meetingMode === 'أونلاين Zoom'
                        ? 'bg-[#FFF8EB] border-[#C9AA67] text-[#071B23] shadow-sm font-bold'
                        : 'bg-[#FAF8F5] border-[#E2DBCE] text-[#555] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    <Video className={`w-5 h-5 ${meetingMode === 'أونلاين Zoom' ? 'text-[#B8963A]' : 'text-gray-500'}`} />
                    <span className="text-[11px] sm:text-xs">أونلاين Zoom</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMeetingMode('هاتفياً')}
                    className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      meetingMode === 'هاتفياً'
                        ? 'bg-[#FFF8EB] border-[#C9AA67] text-[#071B23] shadow-sm font-bold'
                        : 'bg-[#FAF8F5] border-[#E2DBCE] text-[#555] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    <Phone className={`w-5 h-5 ${meetingMode === 'هاتفياً' ? 'text-[#B8963A]' : 'text-gray-500'}`} />
                    <span className="text-[11px] sm:text-xs">استشارة هاتفية</span>
                  </button>
                </div>
              </div>

              {/* Existing Client File Number */}
              {bookingType === 'existing' && (
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#071B23] mb-1.5">
                    رقم ملف القضية أو الهوية الوطنية *
                  </label>
                  <input
                    type="text"
                    required
                    value={fileNumber}
                    onChange={(e) => setFileNumber(e.target.value)}
                    placeholder="مثال: HJ-2026-104 أو 10xxxxxxxx"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C7] bg-[#FAF8F5] text-[#1E293B] text-xs sm:text-sm focus:bg-white focus:border-[#C9AA67] focus:ring-2 focus:ring-[#C9AA67]/20 outline-none transition-all"
                  />
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#071B23] mb-1.5">
                  الاسم الكريم *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#DCD5C7] bg-[#FAF8F5] text-[#1E293B] text-xs sm:text-sm focus:bg-white focus:border-[#C9AA67] focus:ring-2 focus:ring-[#C9AA67]/20 outline-none transition-all"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#071B23] mb-1.5">
                  رقم الجوال / الواتساب *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    className="w-full px-4 py-2.5 pl-10 text-right rounded-xl border border-[#DCD5C7] bg-[#FAF8F5] text-[#1E293B] text-xs sm:text-sm focus:bg-white focus:border-[#C9AA67] focus:ring-2 focus:ring-[#C9AA67]/20 outline-none transition-all"
                  />
                  <PhoneCall className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Date & Time Slots */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#071B23] mb-1.5">
                  تاريخ الموعد المفضل *
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C7] bg-[#FAF8F5] text-[#1E293B] text-xs sm:text-sm focus:bg-white focus:border-[#C9AA67] focus:ring-2 focus:ring-[#C9AA67]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#071B23] mb-1.5">
                  الوقت المتاح للجلسة
                </label>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 rounded-lg text-center text-xs font-bold transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-[#071B23] text-[#E8D39B] border border-[#C9AA67] shadow-sm'
                          : 'bg-[#F1EDE4] text-[#071B23] border border-[#DFD8CB] hover:bg-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brief Subject */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#071B23] mb-1.5">
                  موجز موضوع الاستشارة (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتب ملخصاً للموضوع لمساعدة المستشار على دراسة حالتك مسبقاً..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C7] bg-[#FAF8F5] text-[#1E293B] text-xs sm:text-sm focus:bg-white focus:border-[#C9AA67] focus:ring-2 focus:ring-[#C9AA67]/20 outline-none transition-all resize-none"
                />
              </div>

              {/* Direct Route Information Note */}
              <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8DFC8] flex items-center gap-2.5 text-xs text-[#6B5D3F]">
                <ShieldCheck className="w-4 h-4 text-[#B8963A] shrink-0" />
                <span>
                  {isConsultantRoute
                    ? 'سيتم توجيه طلبك مباشرة إلى المستشار القانوني على الرقم: 0114088009'
                    : 'سيتم توجيه طلبك مباشرة إلى مكتب المحامي أ. حجاج الضويحي على الرقم: 0555102513'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D5]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#E5E0D8] text-[#475569] text-xs sm:text-sm font-bold hover:bg-[#D5CFC5] transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B8963A] via-[#C9AA67] to-[#B8963A] text-[#071B23] text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد وإرسال الحجز</span>
                </button>
              </div>

            </form>
          ) : (
            /* Success Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#FFF8EB] border-2 border-[#C9AA67] text-[#B8963A] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#071B23] mb-2">
                تم استلام طلب الموعد بنجاح!
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md mx-auto mb-6">
                شكراً لثقتكم بشركة المحامي والموثق حجاج عبدالرحمن الضويحي.<br />
                {isConsultantRoute 
                  ? 'تم تسجيل طلبك لتحويله للمستشار القانوني (0114088009).' 
                  : 'تم تسجيل طلبك لتحويله مباشرة إلى المحامي أ. حجاج الضويحي (0555102513).'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${targetWhatsApp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md hover:bg-[#20bd5a] transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>متابعة على واتساب</span>
                </a>
                <a
                  href={`tel:${targetPhone}`}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#071B23] text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 hover:bg-[#0B2530] transition-all"
                >
                  <Phone className="w-4 h-4 text-[#C9AA67]" />
                  <span>اتصال مباشر: {targetPhoneDisplay}</span>
                </a>
              </div>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};
