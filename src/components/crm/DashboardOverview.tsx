import React from 'react';
import { 
  Users, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  PhoneCall, 
  Calendar, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ExternalLink, 
  MessageCircle, 
  PlusCircle, 
  Inbox, 
  Globe, 
  Share2 
} from 'lucide-react';
import { Application, User } from '../../types/crm';
import { crmDb } from '../../services/crmDb';

interface Props {
  applications: Application[];
  currentUser: User;
  onSelectApplication: (app: Application) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<Props> = ({
  applications,
  currentUser,
  onSelectApplication,
  onNavigateTab
}) => {
  const settings = crmDb.getSettings();
  const overdueApps = crmDb.getOverdueApplications();

  // Metrics
  const totalIntakes = applications.length;
  const newIntakes = applications.filter(a => a.status === 'new').length;
  const underReview = applications.filter(a => a.status === 'under_review' || a.status === 'contacted').length;
  const scheduledApts = applications.filter(a => a.status === 'appointment_set').length;

  // Services distribution
  const serviceCounts: Record<string, number> = {};
  applications.forEach(a => {
    serviceCounts[a.serviceType] = (serviceCounts[a.serviceType] || 0) + 1;
  });
  const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  // Source channels distribution
  const sourceLabels: Record<string, string> = {
    website: 'استمارة الموقع الإلكتروني',
    direct: 'تواصل مباشر / اتصال',
    referral: 'توصية عميل سابق',
    social_media: 'وسائل التواصل الاجتماعي',
    google_maps: 'خرائط جوجل',
    paid_ads: 'الإعلانات الممولة'
  };

  const sourceCounts: Record<string, number> = {};
  applications.forEach(a => {
    const src = a.source || 'website';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const recentApplications = [...applications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const statusColors: Record<string, { label: string; bg: string; text: string; border: string }> = {
    new: { label: 'جديد (وارد)', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    under_review: { label: 'قيد الدراسة', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    contacted: { label: 'تم التواصل', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    appointment_set: { label: 'موعد محدد', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    assigned: { label: 'مسند لمحامي', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    completed: { label: 'مكتمل / تم العقد', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
  };

  return (
    <div className="space-y-6 font-cairo">
      
      {/* SLA Alert Banner if any overdue */}
      {overdueApps.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-600 border border-red-200 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-red-900">
                تنبيه سرعة الاستجابة SLA: يوجد {overdueApps.length} طلب بانتظار التواصل والتوجيه
              </h3>
              <p className="text-xs text-red-700 mt-0.5">
                تجاوزت الطلبات المستهدفة ({settings.slaTargetMinutes} دقيقة) دون تحديث للحالة.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('applications')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shrink-0 shadow-sm"
          >
            عرض الطلبات المتأخرة
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Intakes */}
        <div className="bg-white border border-gray-200/90 hover:border-gray-300 rounded-2xl p-5 transition shadow-sm hover:shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">إجمالي الطلبات والاستشارات</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-gray-900">{totalIntakes}</span>
            <span className="text-[11px] text-gray-400 font-medium">طلب مسجل</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-2">من استمارة الموقع والقنوات المباشرة</div>
        </div>

        {/* New Unhandled Intakes */}
        <div className="bg-white border border-gray-200/90 hover:border-emerald-200 rounded-2xl p-5 transition shadow-sm hover:shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">طلبات واردة جديدة</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600">{newIntakes}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">بانتظار الفرز</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-2">مستهدف الرد: {settings.slaTargetMinutes} دقيقة</div>
        </div>

        {/* In Review & Contacted */}
        <div className="bg-white border border-gray-200/90 hover:border-amber-200 rounded-2xl p-5 transition shadow-sm hover:shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">قيد الدراسة والتواصل</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600">{underReview}</span>
            <span className="text-[11px] text-gray-400">مع المستشارين</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-2">دراسة العقود وصياغة المذكرات</div>
        </div>

        {/* Appointments Scheduled */}
        <div className="bg-white border border-gray-200/90 hover:border-purple-200 rounded-2xl p-5 transition shadow-sm hover:shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold">المواعيد والجلسات المجدولة</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-purple-600">{scheduledApts}</span>
            <span className="text-[11px] text-purple-600 font-medium">جلسة استشارة</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-2">حضورية وعن بعد (Meet)</div>
        </div>

      </div>

      {/* Analytics & Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Legal Services Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#B8963A]" />
              <span>التخصصات الأكثر طلباً</span>
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">حسب الإقبال</span>
          </div>

          {topServices.length === 0 ? (
            <div className="py-8 text-center text-gray-400 space-y-1">
              <p className="text-xs">لا توجد طلبات مسجلة بعد</p>
              <span className="text-[11px] text-gray-400">ستظهر الإحصائيات هنا فور وصول أول طلب</span>
            </div>
          ) : (
            <div className="space-y-3">
              {topServices.map(([srv, count], idx) => {
                const percent = Math.round((count / (totalIntakes || 1)) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700 font-medium truncate max-w-[200px]">{srv}</span>
                      <span className="text-[#B8963A] font-mono font-bold">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#B8963A] to-[#C9AA67] rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Source Channels Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>مصادر القضايا والاستشارات</span>
            </h3>
            <span className="text-[11px] text-gray-400">توزيع القنوات</span>
          </div>

          {Object.keys(sourceCounts).length === 0 ? (
            <div className="py-8 text-center text-gray-400 space-y-1">
              <p className="text-xs">لم يتم تسجيل مصادر بعد</p>
              <span className="text-[11px] text-gray-400">ستظهر القنوات فور تقديم الطلبات</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(sourceCounts).map(([sourceKey, count], idx) => {
                const label = sourceLabels[sourceKey] || sourceKey;
                return (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                    <span className="text-gray-700 font-medium truncate max-w-[180px]">{label}</span>
                    <span className="font-mono px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[#071B23] font-bold">
                      {count} عميل
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B8963A]" />
              <span>الإجراءات السريعة</span>
            </h3>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onNavigateTab('apply')}
              className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-amber-50/70 border border-gray-200 text-right text-xs font-bold text-gray-800 transition flex items-center justify-between"
            >
              <span>+ تسجيل طلب استشارة نيابة عن موكل</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#B8963A]" />
            </button>

            <button
              onClick={() => onNavigateTab('appointments')}
              className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-purple-50/70 border border-gray-200 text-right text-xs font-bold text-gray-800 transition flex items-center justify-between"
            >
              <span>📅 فتح جدول المواعيد وجلسات اليوم</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#B8963A]" />
            </button>

            <button
              onClick={() => onNavigateTab('applications')}
              className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-blue-50/70 border border-gray-200 text-right text-xs font-bold text-gray-800 transition flex items-center justify-between"
            >
              <span>📋 عرض قائمة كافة الطلبات</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#B8963A]" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] space-y-0.5 text-gray-700">
            <div className="text-gray-500 font-medium">الجهة المعتمدة:</div>
            <div className="font-bold text-[#071B23]">{settings.firmName}</div>
            <div className="text-gray-600 font-mono" dir="ltr">{settings.primaryPhone}</div>
          </div>
        </div>

      </div>

      {/* Recent Applications Stream */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#B8963A]" />
              <span>أحدث الطلبات الواردة للمكتب</span>
            </h3>
            <span className="text-xs text-gray-500">انقر على أي طلب لفتح الملف التفصيلي ومراسلة الموكل</span>
          </div>

          {applications.length > 0 && (
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs text-[#B8963A] hover:underline font-bold flex items-center gap-1"
            >
              <span>عرض كل الطلبات ({totalIntakes})</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {applications.length === 0 ? (
          <div className="py-12 text-center text-gray-400 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">لوحة التحكم جاهزة وخالية من البيانات الوهمية</p>
              <p className="text-xs text-gray-500 mt-1">
                يمكنك الآن تجربة إرسال طلب جديد من استمارة العميل ليظهر هنا فوراً.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('apply')}
              className="px-4 py-2 rounded-xl bg-[#071B23] hover:bg-[#0c2c3a] text-white text-xs font-bold shadow-sm transition"
            >
              + تجربة تسجيل طلب جديد
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentApplications.map(app => {
              const statusInfo = statusColors[app.status] || { label: app.status, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="py-3.5 px-3 rounded-xl hover:bg-gray-50 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-mono font-bold text-xs text-[#071B23] shrink-0">
                      {app.orderNumber.replace('HJ-', '#')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-[#B8963A] transition">{app.fullName}</span>
                        {app.priority === 'emergency' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold">
                            🚨 طارئ جداً
                          </span>
                        )}
                        {app.priority === 'urgent' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                            ⚡ مستعجل
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>{app.serviceType}</span>
                        <span>•</span>
                        <span dir="ltr" className="font-mono">{app.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} font-bold`}>
                      {statusInfo.label}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {new Date(app.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
