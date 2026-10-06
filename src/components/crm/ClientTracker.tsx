import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  User, 
  Building2, 
  MessageCircle, 
  Phone, 
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Scale,
  RotateCcw,
  Bell,
  BellRing,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Application, ApplicationStatus } from '../../types/crm';
import { crmDb } from '../../services/crmDb';
import { notificationService, DeviceNotification } from '../../services/notificationService';

interface Props {
  initialOrderNumber?: string;
  onBackToHome?: () => void;
  onNewRequest?: () => void;
}

export const ClientTracker: React.FC<Props> = ({
  initialOrderNumber = '',
  onBackToHome,
  onNewRequest
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundApp, setFoundApp] = useState<Application | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState<DeviceNotification[]>([]);

  const settings = crmDb.getSettings();

  // Load initial order if provided in URL
  useEffect(() => {
    if (initialOrderNumber) {
      performSearch(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  // Periodic Polling for Live Notifications & Status Updates
  useEffect(() => {
    if (!foundApp) return;

    const orderNum = foundApp.orderNumber;
    setIsSubscribed(notificationService.isDeviceSubscribed(orderNum));

    const checkUpdates = async () => {
      // 1. Fetch notifications
      const notifs = await notificationService.fetchNotifications(orderNum);
      if (notifs.length > 0) {
        setLiveNotifications(notifs);

        // Check if any unread
        const unread = notifs.filter(n => !n.isRead || n.isRead === 0);
        if (unread.length > 0) {
          const latest = unread[0];
          notificationService.showLocalNotification(latest.title, {
            body: latest.body,
            url: `/track?order=${orderNum}`
          });
          notificationService.markRead(orderNum);
        }
      }

      // 2. Fetch updated application data from Hostinger server
      const updated = await crmDb.fetchApplicationFromHostinger(orderNum);
      if (updated && JSON.stringify(updated) !== JSON.stringify(foundApp)) {
        setFoundApp(updated);
      }
    };

    checkUpdates();
    const interval = setInterval(checkUpdates, 10000);
    return () => clearInterval(interval);
  }, [foundApp?.orderNumber]);

  const performSearch = async (cleanOrder: string) => {
    if (!cleanOrder) return;
    setErrorMsg('');
    setSearched(true);

    // First try server fetch, fallback to local storage
    const app = await crmDb.fetchApplicationFromHostinger(cleanOrder);

    if (app) {
      if (phoneQuery.trim()) {
        const cleanP = phoneQuery.trim().replace(/\D/g, '');
        const appP = app.phone.replace(/\D/g, '');
        if (!appP.endsWith(cleanP) && !cleanP.endsWith(appP)) {
          setErrorMsg('رقم الجوال غير متطابق مع بيانات الطلب.');
          setFoundApp(null);
          return;
        }
      }
      setFoundApp(app);
      setIsSubscribed(notificationService.isDeviceSubscribed(app.orderNumber));
    } else {
      setFoundApp(null);
      setErrorMsg('لم يتم العثور على أي طلب بالرقم المرجعي المدخل.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderQuery.trim().toUpperCase());
  };

  const handleEnableDeviceNotifications = async () => {
    if (!foundApp) return;
    setIsSubscribing(true);

    const success = await notificationService.subscribeDevice(foundApp.orderNumber);
    if (success) {
      setIsSubscribed(true);
      notificationService.showLocalNotification('شركة حجاج الضويحي للمحاماة', {
        body: `تم تفعيل إشعارات هذا الجهاز بنجاح لطلبك #${foundApp.orderNumber}!`,
        url: `/track?order=${foundApp.orderNumber}`
      });
    }
    setIsSubscribing(false);
  };

  const statusSteps: { key: ApplicationStatus; label: string }[] = [
    { key: 'new', label: 'تم الاستلام' },
    { key: 'under_review', label: 'قيد الدراسة' },
    { key: 'contacted', label: 'تم التواصل' },
    { key: 'appointment_set', label: 'موعد استشارة' },
    { key: 'assigned', label: 'إسناد لمحامي' },
    { key: 'completed', label: 'مكتملة' }
  ];

  const currentStepIndex = foundApp ? statusSteps.findIndex(s => s.key === foundApp.status) : -1;

  // WhatsApp follow-up link
  const founderPhone = settings.founderPhone || '0555102513';
  const cleanPhone = founderPhone.replace(/\D/g, '').replace(/^0/, '966');
  const waMsg = foundApp 
    ? `السلام عليكم، أود المتابعة بخصوص طلبي القانوني رقم (${foundApp.orderNumber}) - العميل: ${foundApp.fullName}`
    : 'السلام عليكم ورحمة الله، أود الاستفسار عن حالة طلبي القانوني.';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="min-h-screen bg-[#F0F4F9] text-[#202124] py-8 sm:py-12 px-3 sm:px-6 lg:px-8 font-cairo" dir="rtl">
      
      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* Top Back Navigation Bar */}
        {onBackToHome && (
          <div className="flex items-center justify-between pb-1">
            <button 
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-[#071B23] hover:text-[#B8963A] font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm transition cursor-pointer"
            >
              <span>← العودة للموقع الرئيسي</span>
            </button>
            {onNewRequest && (
              <button
                onClick={onNewRequest}
                className="text-xs text-[#B8963A] hover:underline font-semibold cursor-pointer"
              >
                + تقديم استشارة جديدة
              </button>
            )}
          </div>
        )}

        {/* 1. Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-[#071B23] via-[#B8963A] to-[#071B23]" />
          
          <div className="p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="شعار الشركة" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-amiri text-[#071B23]">
                  بوابة تتبع واستعلام طلبات العملاء
                </h1>
                <p className="text-xs text-[#B8963A] font-semibold mt-0.5">
                  شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 pt-2 border-t border-gray-100">
              أدخل الرقم المرجعي للطلب للتحقق من مرحلة تقدم المعاملة، المستشار المعين، والمواعيد المجدولة.
            </p>
          </div>
        </div>

        {/* 2. Search Query Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  الرقم المرجعي للطلب <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: HJ-10482 أو 10482"
                  value={orderQuery}
                  onChange={e => setOrderQuery(e.target.value)}
                  className="w-full border-b-2 border-gray-200 focus:border-[#B8963A] py-2 px-1 text-sm text-gray-900 outline-none transition font-mono tracking-wider"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  رقم الجوال المسجل (اختياري)
                </label>
                <input
                  type="tel"
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  value={phoneQuery}
                  onChange={e => setPhoneQuery(e.target.value)}
                  className="w-full border-b-2 border-gray-200 focus:border-[#B8963A] py-2 px-1 text-sm text-gray-900 outline-none transition font-mono text-right"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#071B23] hover:bg-[#0c2c3a] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#B8963A]" />
              <span>استعلام ومتابعة</span>
            </button>
          </form>
        </div>

        {/* 3. Search Result Card */}
        {foundApp && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-500">صاحب الطلب:</span>
                <h3 className="text-lg font-bold text-[#071B23]">{foundApp.fullName}</h3>
                <span className="text-xs text-[#B8963A] font-semibold">{foundApp.serviceType}</span>
              </div>

              <div className="bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-mono font-bold text-sm text-[#071B23]">
                {foundApp.orderNumber}
              </div>
            </div>

            {/* Device Notification Status Card */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              isSubscribed ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isSubscribed ? 'bg-emerald-600 text-white' : 'bg-[#071B23] text-[#E8D39B]'
                }`}>
                  {isSubscribed ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </div>
                <div>
                  <span className="font-bold block">
                    {isSubscribed ? 'إشعارات هذا الجهاز نشطة ومفعلة ✓' : 'تلقي تنبيهات هذا الجهاز الفورية'}
                  </span>
                  <span className="text-[11px] text-gray-600">
                    {isSubscribed ? 'ستصلك رسائل تنبيه منبثقة عند أي رد من المحامي' : 'اضغط للتفعيل لتصلك التنبيهات على جوالك مباشرة'}
                  </span>
                </div>
              </div>

              {!isSubscribed && (
                <button
                  onClick={handleEnableDeviceNotifications}
                  disabled={isSubscribing}
                  className="py-1.5 px-3 rounded-lg bg-[#071B23] text-[#E8D39B] hover:text-white font-bold text-xs shadow-sm cursor-pointer shrink-0 transition"
                >
                  {isSubscribing ? 'جاري التفعيل...' : 'تفعيل'}
                </button>
              )}
            </div>

            {/* Steps Progress */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 block">مرحلة تقدم المعاملة:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                {statusSteps.map((step, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = foundApp.status === step.key;

                  return (
                    <div 
                      key={step.key} 
                      className={`p-2.5 rounded-xl border text-xs transition ${
                        isCurrent 
                          ? 'bg-[#071B23] border-[#071B23] text-white shadow-md' 
                          : isDone 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' 
                            : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold ${
                        isCurrent ? 'bg-[#B8963A] text-[#071B23]' : isDone ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isDone && !isCurrent ? '✓' : idx + 1}
                      </div>
                      <span className="text-[11px] block truncate">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scheduled Appointment Alert if any */}
            {foundApp.appointment && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm animate-fade-in">
                <div className="p-2.5 rounded-xl bg-purple-600 text-white shrink-0 shadow-sm">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-purple-950">
                    تم تحديد موعد استشارة رسمي: {foundApp.appointment.date} في تمام الساعة {foundApp.appointment.time}
                  </h4>
                  <p className="text-[11px] text-purple-800">
                    المستشار: <span className="font-bold">{foundApp.appointment.lawyerName}</span> ({foundApp.appointment.meetingType === 'in_person' ? 'حضوري بمقر الشركة بالرياض' : 'عن بعد عبر Google Meet / Zoom'})
                  </p>
                  {foundApp.appointment.meetingLink && (
                    <a 
                      href={foundApp.appointment.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-xs text-purple-700 underline font-bold pt-1"
                    >
                      <span>رابط الجلسة الافتراضية</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Assigned Lawyer Card if assigned */}
            {foundApp.assignedTo && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#B8963A] font-bold text-xs shadow-sm">
                  {foundApp.assignedTo.name.substring(0, 2)}
                </div>
                <div>
                  <div className="text-[11px] text-gray-500">المستشار المكلف بدراسة الملف:</div>
                  <div className="text-xs font-bold text-gray-900">{foundApp.assignedTo.name}</div>
                </div>
              </div>
            )}

            {/* WhatsApp Direct Action */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>متابعة الاستفسار مع المحامي عبر واتساب</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="pt-6 text-center text-xs text-gray-400">
          شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية والتوثيق
        </div>

      </div>
    </div>
  );
};
