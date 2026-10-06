import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  LogIn, 
  ShieldCheck, 
  Check, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  KeyRound 
} from 'lucide-react';
import { crmDb, INITIAL_USERS } from '../../services/crmDb';
import { User as CrmUser, UserRole } from '../../types/crm';
import { LegalEmblem } from '../LegalEmblem';

interface Props {
  onLoginSuccess: (user: CrmUser) => void;
  onCancel?: () => void;
}

export const AuthLogin: React.FC<Props> = ({ onLoginSuccess, onCancel }) => {
  const [selectedUser, setSelectedUser] = useState<CrmUser>(INITIAL_USERS[0]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const users = crmDb.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور للمتابعة');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isValid = crmDb.verifyPassword(password);

      if (isValid) {
        crmDb.setCurrentUser(selectedUser);
        setIsLoading(false);
        onLoginSuccess(selectedUser);
      } else {
        setIsLoading(false);
        setError('كلمة المرور غير صحيحة، يرجى التأكد وإعادة المحاولة');
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setPassword('HajajLaw#2026!Sec');
    setError('');
  };

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    admin: { label: 'مدير تنفيذي', desc: 'صلاحية كاملة على التقارير والإعدادات' },
    lawyer: { label: 'المحامي العام والمؤسس', desc: 'إدارة القضايا وإضافة الآراء وجدولة الجلسات' },
    consultant: { label: 'المستشار القانوني الأول', desc: 'دراسة الاستشارات وصياغة العقود' },
    manager: { label: 'خدمة العملاء والفرز', desc: 'استقبال الطلبات وتتبع سرعة الرد' },
    employee: { label: 'موظف استقبال', desc: 'تسجيل المراجعين وعرض المواعيد' }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-cairo flex items-center justify-center selection:bg-[#B8963A]/20 selection:text-[#071B23]" dir="rtl">
      <div className="max-w-md w-full mx-auto space-y-4">
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="h-2.5 bg-gradient-to-r from-[#071B23] via-[#B8963A] to-[#071B23]" />
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="text-center space-y-3">
              <div className="flex justify-center items-center">
                {!logoError ? (
                  <img 
                    src="/logo.png" 
                    alt="شركة حجاج عبدالرحمن الضويحي للمحاماة" 
                    className="h-20 sm:h-24 w-auto object-contain transition-transform hover:scale-105 duration-300"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <LegalEmblem size="lg" theme="dark" showText={false} />
                )}
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-amiri text-[#071B23]">
                  لوحة التحكم وإدارة الطلبات
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية والتوثيق
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                اختر حساب الدخول:
              </label>
              <div className="space-y-2">
                {users.map(u => {
                  const isSelected = selectedUser.id === u.id;
                  const roleInfo = roleLabels[u.role] || { label: u.role, desc: '' };

                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedUser(u);
                        setError('');
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-amber-50/70 border-[#B8963A] ring-1 ring-[#B8963A]/30 shadow-sm' 
                          : 'bg-white border-gray-200 hover:bg-gray-50/80 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-[#071B23] text-[#E8D39B]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {u.name.substring(0, 2)}
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-gray-900">{u.name}</div>
                          <div className="text-[11px] text-[#B8963A] font-semibold">{roleInfo.label}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#B8963A] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  البريد الإلكتروني المعتمد
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={selectedUser.email}
                    readOnly
                    dir="ltr"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600 text-right font-mono select-none"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    كلمة مرور لوحة التحكم
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="text-[11px] text-[#B8963A] hover:underline flex items-center gap-1 font-medium"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>تعبئة كلمة المرور الافتراضية</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="أدخل كلمة المرور هنا..."
                    className="w-full bg-white border border-gray-300 focus:border-[#B8963A] focus:ring-2 focus:ring-[#B8963A]/20 rounded-xl px-4 py-2.5 text-xs text-gray-900 text-right font-mono outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#071B23] hover:bg-[#0E2530] text-[#E8D39B] hover:text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-[#E8D39B] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-[#B8963A]" />
                    <span>تسجيل الدخول إلى لوحة الإدارة</span>
                  </>
                )}
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-2 text-center text-xs text-gray-500 hover:text-gray-800 font-medium transition"
                >
                  ← الرجوع إلى الموقع الرئيسي
                </button>
              )}
            </form>

            <div className="pt-3 border-t border-gray-100 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8963A]" />
              <span>نظام محمي ومشفر - شركة حجاج الضويحي للمحاماة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
