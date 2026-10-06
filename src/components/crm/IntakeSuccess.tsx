import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  UserCheck, 
  ExternalLink,
  MessageCircle,
  RotateCcw,
  Search,
  Bell,
  BellRing,
  Sparkles
} from 'lucide-react';
import { Application } from '../../types/crm';
import { crmDb } from '../../services/crmDb';
import { notificationService } from '../../services/notificationService';

interface Props {
  application: Application;
  onNewRequest: () => void;
  onTrackStatus: () => void;
}

export const IntakeSuccess: React.FC<Props> = ({ 
  application, 
  onNewRequest, 
  onTrackStatus 
}) => {
  const [copied, setCopied] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifError, setNotifError] = useState('');

  const settings = crmDb.getSettings();

  useEffect(() => {
    // Check if device is already subscribed
    if (notificationService.isDeviceSubscribed(application.orderNumber)) {
      setIsSubscribed(true);
    }
  }, [application.orderNumber]);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(application.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnableNotifications = async () => {
    setIsSubscribing(true);
    setNotifError('');

    try {
      const success = await notificationService.subscribeDevice(application.orderNumber);
      if (success) {
        setIsSubscribed(true);
        // Show welcome confirmation notification
        notificationService.showLocalNotification('شركة حجاج الضويحي للمحاماة', {
          body: `تم تفعيل إشعارات جهازك لطلبك #${application.orderNumber}. ستصلك تنبيهات المواعيد وتحديثات المحامي فوراً!`,
          url: `/track?order=${application.orderNumber}`
        });
      } else {
        setNotifError('يرجى السماح بالإشعارات من إعدادات المتصفح');
      }
    } catch (e) {
      setNotifError('تعذر تفعيل الإشعارات على هذا المتصفح');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Generate direct WhatsApp link
  const founderPhone = settings.founderPhone || '0555102513';
  const cleanPhone = founderPhone.replace(/\D/g, '').replace(/^0/, '966');
  const waMessage = `السلام عليكم ورحمة الله،\nأنا العميل: ${application.fullName}\nقمت بتقديم طلب استشارة قانونية عبر الاستمارة برقم مرجعي: ${application.orderNumber}\nالخدمة المطلوبة: ${application.serviceType}\nأرجو المتابعة والتواصل معي وشكراً.`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-[#F0F4F9] text-[#202124] py-8 sm:py-12 px-3 sm:px-6 lg:px-8 font-cairo flex items-center justify-center" dir="rtl">
      
      <div className="max-w-2xl w-full mx-auto space-y-4">
        
        {/* Main Confirmation Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Top Accent Strip */}
          <div className="h-3 bg-gradient-to-r from-[#071B23] via-[#B8963A] to-[#071B23]" />
          
          <div className="p-6 sm:p-10 space-y-6">
            
            {/* Header Success Status */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold font-amiri text-[#071B23]">
                  تم تسجيل ردك واستلام طلب الاستشارة بنجاح
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  شكراً لتواصلكم مع شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية.
                </p>
              </div>
            </div>

            {/* Reference Order Badge */}
            <div className="bg-amber-50/60 border border-[#B8963A]/30 rounded-2xl p-5 text-center space-y-2">
              <span className="text-xs text-gray-600 font-medium block">الرقم المرجعي الرسمي لطلبكم</span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono tracking-wider text-[#071B23]">
                  {application.orderNumber}
                </span>
                <button
                  onClick={handleCopyOrderNumber}
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 text-gray-700 transition border border-gray-200 shadow-sm cursor-pointer"
                  title="نسخ الرقم المرجعي"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                يرجى الاحتفاظ بهذا الرقم لمتابعة حالة الملف عند التواصل مع المحامي.
              </p>
            </div>

            {/* Device Push Notification Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isSubscribed 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                : 'bg-gradient-to-br from-amber-50/90 to-amber-100/40 border-[#B8963A]/40 text-[#071B23]'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSubscribed ? 'bg-emerald-600 text-white' : 'bg-[#071B23] text-[#E8D39B]'
                  }`}>
                    {isSubscribed ? <BellRing className="w-5 h-5 animate-bounce" /> : <Bell className="w-5 h-5" />}
                  </div>
                  <div className="space-y-1 text-right">
                    <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      <span>{isSubscribed ? 'الإشعارات الفورية مفعلة على هذا الجهاز' : 'تفعيل إشعارات هذا الجهاز الفورية'}</span>
                      {isSubscribed && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isSubscribed 
                        ? 'ستتلقى تنبيهاً فورياً ومباشراً على هذا الجهاز فور قيام المحامي بتحديد موعد استشارتك أو تحديث حالة القضية.'
                        : 'احصل على تنبيه صوتي وشعارات منبثقة على هاتفك أو جهازك فور تحديد موعد الجلسة أو مراجعة استشارتك.'}
                    </p>
                  </div>
                </div>

                {!isSubscribed && (
                  <button
                    onClick={handleEnableNotifications}
                    disabled={isSubscribing}
                    className="shrink-0 py-2.5 px-4 rounded-xl bg-[#071B23] hover:bg-[#0c2c3a] text-[#E8D39B] hover:text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    {isSubscribing ? (
                      <div className="w-4 h-4 border-2 border-[#E8D39B] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-[#B8963A]" />
                        <span>تفعيل الإشعار</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {notifError && (
                <p className="text-xs text-rose-600 font-semibold mt-2 text-right">
                  {notifError}
                </p>
              )}
            </div>

            {/* Order Brief Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-xs sm:text-sm border border-gray-200">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">الاسم:</span>
                <span className="font-bold text-gray-800">{application.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">رقم الجوال:</span>
                <span className="font-mono text-gray-800" dir="ltr">{application.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">الخدمة المطلوبة:</span>
                <span className="font-bold text-[#B8963A]">{application.serviceType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">الحالة:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-xs border border-blue-200">
                  <Clock className="w-3 h-3" />
                  قيد المراجعة الفورية من قبل المستشار
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>متابعة الطلب عبر واتساب المحامي مباشرة</span>
                <ExternalLink className="w-4 h-4 opacity-75 group-hover:translate-x-[-2px] transition" />
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={onTrackStatus}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#B8963A]" />
                  <span>تتبع حالة المعاملة</span>
                </button>

                <button
                  onClick={onNewRequest}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إرسال رد أو طلب آخر</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#B8963A]" />
              <span>شركة حجاج الضويحي للمحاماة • سرية تامة والتزام مهني</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
