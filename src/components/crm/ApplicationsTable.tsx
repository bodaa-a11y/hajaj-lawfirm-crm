import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  UserCheck, 
  AlertCircle,
  FileSpreadsheet,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Layers,
  Sparkles,
  Inbox,
  Trash2
} from 'lucide-react';
import { Application, ApplicationStatus, PriorityLevel, SourceChannel } from '../../types/crm';
import { crmDb } from '../../services/crmDb';

interface Props {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onRefresh: () => void;
}

export const ApplicationsTable: React.FC<Props> = ({
  applications,
  onSelectApplication,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const settings = crmDb.getSettings();
  const users = crmDb.getUsers();

  const statusConfig: Record<ApplicationStatus, { label: string; bg: string; text: string; border: string }> = {
    new: { label: 'جديد (وارد)', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    under_review: { label: 'قيد الدراسة', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    contacted: { label: 'تم التواصل', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    appointment_set: { label: 'موعد محدد', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    assigned: { label: 'مسند لمحامي', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    completed: { label: 'مكتمل', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
    rejected: { label: 'ملغي / اعتذار', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    archived: { label: 'مؤرشف', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' }
  };

  const priorityLabels: Record<PriorityLevel, { label: string; color: string }> = {
    normal: { label: 'عادي', color: 'text-blue-700 bg-blue-50 border border-blue-200' },
    urgent: { label: 'مستعجل ⚡', color: 'text-amber-700 bg-amber-50 border border-amber-200' },
    emergency: { label: 'طارئ 🚨', color: 'text-red-700 bg-red-50 border border-red-200' }
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        !searchTerm.trim() ||
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm) ||
        app.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesService = serviceFilter === 'all' || app.serviceType === serviceFilter;
      const matchesSource = sourceFilter === 'all' || (app.source || 'website') === sourceFilter;
      const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesService && matchesSource && matchesPriority;
    });
  }, [applications, searchTerm, statusFilter, serviceFilter, sourceFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredApps.length / pageSize) || 1;
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApps.slice(start, start + pageSize);
  }, [filteredApps, currentPage]);

  const handleExportCSV = () => {
    const headers = ['رقم الطلب', 'اسم العميل', 'رقم الجوال', 'البريد', 'الخدمة', 'الأولوية', 'المصدر', 'الحالة', 'تاريخ الإنشاء'];
    const rows = filteredApps.map(a => [
      a.orderNumber,
      `"${a.fullName}"`,
      a.phone,
      a.email || '',
      `"${a.serviceType}"`,
      a.priority,
      a.source || 'website',
      a.status,
      new Date(a.createdAt).toLocaleString('ar-SA')
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `طلبات_العملاء_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف طلب العميل: (${name})؟`)) {
      crmDb.deleteApplication(id);
      onRefresh();
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setServiceFilter('all');
    setSourceFilter('all');
    setPriorityFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter !== 'all' || serviceFilter !== 'all' || sourceFilter !== 'all' || priorityFilter !== 'all' || searchTerm;

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Live Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث بالاسم، رقم الجوال، الرقم المرجعي #HJ، أو التخصص..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#B8963A] focus:bg-white rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm text-gray-900 focus:outline-none transition shadow-inner placeholder-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons: Export CSV & Print */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-700 transition flex items-center gap-1.5 shadow-sm"
              title="تصدير إلى Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#B8963A]" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-700 transition flex items-center gap-1.5 shadow-sm"
              title="طباعة الجدول"
            >
              <Printer className="w-3.5 h-3.5 text-[#B8963A]" />
              <span>طباعة</span>
            </button>
          </div>

        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100 text-xs">
          
          <div>
            <label className="block text-gray-500 font-medium mb-1">الحالة القانونية:</label>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B8963A]"
            >
              <option value="all">جميع الحالات</option>
              <option value="new">جديد (وارد)</option>
              <option value="under_review">قيد الدراسة</option>
              <option value="contacted">تم التواصل</option>
              <option value="appointment_set">موعد محدد</option>
              <option value="assigned">مسند لمحامي</option>
              <option value="completed">مكتمل / منتهي</option>
              <option value="rejected">ملغي / اعتذار</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 font-medium mb-1">التخصص والخدمة:</label>
            <select
              value={serviceFilter}
              onChange={e => {
                setServiceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B8963A]"
            >
              <option value="all">جميع التخصصات</option>
              {settings.servicesList.map((srv, idx) => (
                <option key={idx} value={srv}>{srv}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-500 font-medium mb-1">مصدر الإحالة / الـ QR:</label>
            <select
              value={sourceFilter}
              onChange={e => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B8963A]"
            >
              <option value="all">جميع المصادر</option>
              <option value="lawyer_card">كرت المحامي</option>
              <option value="reception_desk">طاولة الاستقبال</option>
              <option value="google_maps">خرائط جوجل</option>
              <option value="social_media">سوشيال ميديا</option>
              <option value="paid_ads">إعلانات ممولة</option>
              <option value="website">الموقع المباشر</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 font-medium mb-1">درجة الأولوية:</label>
            <select
              value={priorityFilter}
              onChange={e => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B8963A]"
            >
              <option value="all">جميع الأولويات</option>
              <option value="normal">عادي</option>
              <option value="urgent">مستعجل ⚡</option>
              <option value="emergency">طارئ جداً 🚨</option>
            </select>
          </div>

        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-[#071B23] pt-1 border-t border-gray-100">
            <span>تم العثور على {filteredApps.length} طلب مطابق للفلتر المحدد</span>
            <button 
              onClick={clearFilters}
              className="hover:underline flex items-center gap-1 text-gray-500 hover:text-red-600 font-bold"
            >
              <X className="w-3.5 h-3.5" />
              <span>إعادة تعيين الفلاتر</span>
            </button>
          </div>
        )}

      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 font-bold">
              <tr>
                <th className="py-3.5 px-4">رقم الطلب</th>
                <th className="py-3.5 px-4">اسم العميل</th>
                <th className="py-3.5 px-4">رقم الجوال</th>
                <th className="py-3.5 px-4">نوع الخدمة</th>
                <th className="py-3.5 px-4">الأولوية</th>
                <th className="py-3.5 px-4">المصدر</th>
                <th className="py-3.5 px-4">المحامي المكلف</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-gray-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Inbox className="w-8 h-8 mx-auto text-gray-300" />
                      <p className="font-bold text-sm text-gray-700">لا توجد طلبات مسجلة حالياً</p>
                      <p className="text-xs text-gray-500">
                        {hasActiveFilters 
                          ? 'لا توجد نتائج مطابقة للفلاتر المختارة.' 
                          : 'يمكنك استقبال طلبات جديدة عن طريق نشر رمز الـ QR أو استمارة الموقع.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-[#B8963A] hover:underline font-bold"
                        >
                          مسح الفلاتر
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedApps.map(app => {
                  const statusInfo = statusConfig[app.status] || { label: app.status, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
                  const priorityInfo = priorityLabels[app.priority] || { label: app.priority, color: 'text-gray-600 bg-gray-50' };
                  const assignedUser = users.find(u => u.id === app.assignedLawyerId);

                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-amber-50/40 transition group cursor-pointer"
                      onClick={() => onSelectApplication(app)}
                    >
                      {/* Order Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#071B23]">
                        {app.orderNumber}
                      </td>

                      {/* Client Name */}
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <div className="flex flex-col">
                          <span>{app.fullName}</span>
                          {app.attachments.length > 0 && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1 font-normal">
                              📎 {app.attachments.length} مرفقات
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-gray-700" dir="ltr">
                        {app.phone}
                      </td>

                      {/* Service Type */}
                      <td className="py-3.5 px-4">
                        <span className="truncate block max-w-[170px] font-medium" title={app.serviceType}>
                          {app.serviceType}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {app.source === 'lawyer_card' ? '📇 كرت المحامي' :
                         app.source === 'reception_desk' ? '🏢 الاستقبال' :
                         app.source === 'google_maps' ? '📍 الخرائط' :
                         app.source === 'paid_ads' ? '📣 إعلانات' :
                         app.source === 'social_media' ? '📸 سوشيال' : '🌐 الموقع'}
                      </td>

                      {/* Assigned Lawyer */}
                      <td className="py-3.5 px-4">
                        {assignedUser ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-900 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="truncate max-w-[120px]">{assignedUser.name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px]">غير مسند</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectApplication(app)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#071B23] text-gray-700 hover:text-white transition"
                            title="فتح الملف وإدارة الحالة"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id, app.fullName)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <div>
              عرض صفحة {currentPage} من أصل {totalPages} (إجمالي {filteredApps.length} طلب)
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
