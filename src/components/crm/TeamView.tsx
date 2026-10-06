import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Scale, 
  Phone, 
  Mail, 
  Briefcase, 
  Check, 
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { User, UserRole } from '../../types/crm';
import { crmDb } from '../../services/crmDb';

interface Props {
  onRefresh: () => void;
}

export const TeamView: React.FC<Props> = ({ onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'lawyer' as UserRole,
    title: ''
  });

  const users = crmDb.getUsers();
  const applications = crmDb.getApplications();

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.phone) return;

    const created: User = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email || `${newUser.phone}@hajaj-lawfirm.com`,
      phone: newUser.phone,
      role: newUser.role,
      title: newUser.title || 'مستشار قانوني معتمد',
      activeCaseload: 0
    };

    const updated = [...users, created];
    crmDb.saveUsers(updated);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', phone: '', role: 'lawyer', title: '' });
    onRefresh();
  };

  const getCaseloadForUser = (userId: string) => {
    return applications.filter(a => a.assignedLawyerId === userId && a.status !== 'completed' && a.status !== 'rejected').length;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#B8963A]" />
            <span>فريق المحامين والمستشارين القانونيين</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            إدارة صلاحيات الفريق وتوزيع أعباء القضايا والاستشارات النشطة.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#071B23] hover:bg-[#0c2c3a] text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4 text-[#B8963A]" />
          <span>إضافة عضو فريق جديد</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(member => {
          const activeCases = getCaseloadForUser(member.id);

          return (
            <div 
              key={member.id} 
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#071B23] text-[#B8963A] flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                    {member.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{member.name}</h3>
                    <p className="text-xs text-[#B8963A] font-semibold mt-0.5">{member.title}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 border border-gray-200 text-gray-700">
                  {member.role === 'lawyer' ? 'محامي مرخص' :
                   member.role === 'consultant' ? 'مستشار قانوني' :
                   member.role === 'admin' ? 'مدير تنفيذي' : 'خدمة عملاء'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 text-[11px] block">القضايا النشطة:</span>
                  <span className="text-base font-bold font-mono text-[#071B23]">{activeCases} قضايا</span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 text-[11px] block">رقم الجوال:</span>
                  <span className="text-xs font-mono font-bold text-gray-800" dir="ltr">{member.phone}</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 flex items-center gap-1.5 border-t border-gray-100 pt-3 font-mono">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{member.email}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">إضافة مستشار أو محامي جديد</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">الاسم الكريم</label>
                <input
                  type="text"
                  placeholder="مثال: أ. فيصل السعدون"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#B8963A]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">المسمى والتخصص</label>
                <input
                  type="text"
                  placeholder="مثال: مستشار قضايا تجارية"
                  value={newUser.title}
                  onChange={e => setNewUser({ ...newUser, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#B8963A]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">رقم الجوال</label>
                <input
                  type="tel"
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  value={newUser.phone}
                  onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#B8963A] text-right font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">الدور والصلاحية</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#B8963A]"
                >
                  <option value="lawyer">محامي مرخص (ترافع وتمثيل)</option>
                  <option value="consultant">مستشار قانوني (دراسة عقود واستشارات)</option>
                  <option value="manager">مدير عمليات وخدمة عملاء</option>
                  <option value="admin">مسؤول نظام تنفيذي</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#071B23] hover:bg-[#0c2c3a] text-white font-bold text-xs shadow-md"
                >
                  حفظ وإضافة العضو
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
