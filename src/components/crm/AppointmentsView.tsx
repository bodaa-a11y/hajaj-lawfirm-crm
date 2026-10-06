import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  User, 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  ExternalLink,
  Plus,
  Filter,
  Layers,
  Search,
  Inbox
} from 'lucide-react';
import { Appointment, User as CrmUser } from '../../types/crm';
import { crmDb } from '../../services/crmDb';

interface Props {
  onRefresh: () => void;
}

export const AppointmentsView: React.FC<Props> = ({ onRefresh }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLawyer, setFilterLawyer] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const appointments = crmDb.getAppointments();
  const users = crmDb.getUsers();

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = !searchTerm.trim() || 
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.clientPhone.includes(searchTerm) ||
      apt.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || apt.meetingType === filterType;
    const matchesLawyer = filterLawyer === 'all' || apt.lawyerId === filterLawyer;

    return matchesSearch && matchesType && matchesLawyer;
  });

  const handleStatusChange = (aptId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    const apts = crmDb.getAppointments();
    const index = apts.findIndex(a => a.id === aptId);
    if (index !== -1) {
      apts[index].status = status;
      crmDb.saveAppointments(apts);
      onRefresh();
    }
  };

  const meetingTypeInfo: Record<string, { label: string; icon: any; color: string }> = {
    in_person: { label: '🏢 حضوري بالمكتب', icon: MapPin, color: 'text-amber-800 bg-amber-50 border border-amber-200' },
    google_meet: { label: '💻 Google Meet', icon: Video, color: 'text-blue-800 bg-blue-50 border border-blue-200' },
    phone_call: { label: '📞 مكالمة هاتفية', icon: Phone, color: 'text-emerald-800 bg-emerald-50 border border-emerald-200' },
    zoom: { label: '🎥 Zoom', icon: Video, color: 'text-indigo-800 bg-indigo-50 border border-indigo-200' }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <span>جدول المواعيد والاستشارات القانونية</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              متابعة الجلسات الحضورية والمقابلات المرئية عبر Google Meet لجميع المستشارين.
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="ابحث باسم العميل أو الجوال..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-200 focus:border-purple-500 rounded-xl px-4 py-2 pr-9 text-xs text-gray-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
          <div>
            <label className="block text-gray-500 font-medium mb-1">نوع المقابلة:</label>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none"
            >
              <option value="all">جميع الأنواع (حضوري / عن بعد / هاتف)</option>
              <option value="in_person">🏢 حضوري بالمكتب</option>
              <option value="google_meet">💻 اجتماعات Google Meet</option>
              <option value="phone_call">📞 مكالمات هاتفية</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 font-medium mb-1">المحامي المكلف:</label>
            <select
              value={filterLawyer}
              onChange={e => setFilterLawyer(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none"
            >
              <option value="all">جميع المحامين والمستشارين</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-gray-300" />
            <p className="font-bold text-sm text-gray-700">لا توجد مواعيد مجدولة حالياً</p>
            <p className="text-xs text-gray-500">
              يمكنك جدولة موعد مع أي عميل مباشرة من صفحة تفاصيل الطلب.
            </p>
          </div>
        ) : (
          filteredAppointments.map(apt => {
            const typeInfo = meetingTypeInfo[apt.meetingType] || { label: apt.meetingType, color: 'text-gray-700' };
            const cleanPhone = apt.clientPhone.replace(/\D/g, '').replace(/^0/, '966');

            return (
              <div 
                key={apt.id} 
                className="bg-white border border-gray-200 hover:border-purple-300 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      apt.status === 'scheduled' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {apt.status === 'scheduled' ? 'مجدول' : apt.status === 'completed' ? 'تم الانتهاء' : 'ملغي'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{apt.clientName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{apt.serviceType}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-gray-900 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B8963A]" />
                        <span>{apt.date}</span>
                      </div>
                      <span className="font-mono text-[#071B23]">{apt.time} ({apt.durationMinutes} دقيقة)</span>
                    </div>

                    <div className="text-[11px] text-gray-600 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>مع المستشار: {apt.lawyerName}</span>
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-[11px] text-gray-600 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                      "{apt.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {apt.meetingLink ? (
                      <a
                        href={apt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>بدء الاجتماع</span>
                      </a>
                    ) : (
                      <a
                        href={`tel:${apt.clientPhone}`}
                        className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-gray-200"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#B8963A]" />
                        <span>اتصال بالعميل</span>
                      </a>
                    )}

                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>تذكير واتساب</span>
                    </a>
                  </div>

                  {apt.status === 'scheduled' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(apt.id, 'completed')}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 transition"
                      >
                        ✓ تحديد كمكتمل
                      </button>
                      <button
                        onClick={() => handleStatusChange(apt.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold border border-red-200 transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
