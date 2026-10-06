import React, { useState } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  ShieldAlert, 
  Clock, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  Search, 
  Scale, 
  PlusCircle, 
  ExternalLink, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { User } from '../../types/crm';
import { crmDb } from '../../services/crmDb';
import { LegalEmblem } from '../LegalEmblem';

interface Props {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
  onNewIntake: () => void;
  onGoToSite: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  onSwitchUser,
  onNewIntake,
  onGoToSite,
  children
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const users = crmDb.getUsers();
  const applications = crmDb.getApplications();
  const overdueApps = crmDb.getOverdueApplications();

  const newCount = applications.filter(a => a.status === 'new').length;
  const overdueCount = overdueApps.length;

  const navItems = [
    { id: 'overview', label: 'لوحة التحكم والمؤشرات', icon: LayoutDashboard },
    { id: 'applications', label: 'إدارة ومتابعة الطلبات', icon: FileText, badge: newCount > 0 ? newCount : undefined, badgeColor: 'bg-[#B8963A]' },
    { id: 'appointments', label: 'جدول المواعيد والاستشارات', icon: Calendar },
    { id: 'team', label: 'فريق المحامين والمستشارين', icon: Users },
    { id: 'settings', label: 'إعدادات النظام والـ SLA', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-cairo flex flex-col md:flex-row" dir="rtl">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-l border-gray-200 p-5 space-y-6 shrink-0 justify-between shadow-sm">
        
        <div className="space-y-6">
          {/* Firm Logo & Title */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="شعار شركة حجاج الضويحي" 
                className="h-10 w-auto object-contain shrink-0"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#071B23] flex items-center justify-center text-[#B8963A] shadow-sm shrink-0">
                <Scale className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold font-amiri text-[#071B23] truncate">شركة حجاج الضويحي</h1>
              <p className="text-[11px] text-[#B8963A] font-semibold truncate">لوحة إدارة القضايا CRM</p>
            </div>
          </div>

          {/* SLA Overdue Alert Badge if any */}
          {overdueCount > 0 && (
            <div 
              onClick={() => onTabChange('applications')}
              className="p-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100/70 transition cursor-pointer flex items-center gap-2.5 text-xs text-red-700 animate-pulse"
            >
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-bold block">تنبيه استجابة SLA</span>
                <span className="text-[10px] text-red-600">{overdueCount} طلب بحاجة إلى تواصل</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    isActive 
                      ? 'bg-[#071B23] text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#B8963A]' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono text-white ${item.badgeColor || 'bg-blue-600'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action: New Intake on Behalf of Client */}
          <button
            onClick={onNewIntake}
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#B8963A] hover:bg-[#a38430] text-[#071B23] font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ استمارة حجز جديدة</span>
          </button>
        </div>

        {/* User Profile & Role Switcher */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="relative">
            <div
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#071B23] text-[#B8963A] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  {currentUser.name.substring(0, 2)}
                </div>
                <div className="min-w-0 text-right">
                  <div className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-[#B8963A] font-semibold truncate">{currentUser.title}</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            </div>

            {/* Quick Switch Dropdown */}
            {isRoleDropdownOpen && (
              <div className="absolute bottom-full mb-2 right-0 left-0 bg-white border border-gray-200 rounded-2xl p-2 shadow-xl space-y-1 z-30">
                <div className="text-[10px] text-gray-400 px-2 py-1 font-semibold">تبديل حساب المستخدم (RBAC):</div>
                {users.map(u => (
                  <div
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition ${
                      currentUser.id === u.id ? 'bg-amber-50 text-[#B8963A] font-bold border border-amber-200' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{u.name}</span>
                    {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-[#B8963A]" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToSite}
              className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3 h-3 text-[#B8963A]" />
              <span>الموقع الرئيسي</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 transition flex items-center gap-1"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[10px] font-bold hidden xl:inline">خروج</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          {!logoError ? (
            <img 
              src="/logo.png" 
              alt="شعار شركة حجاج الضويحي" 
              className="h-8 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#071B23] flex items-center justify-center text-[#B8963A]">
              <Scale className="w-5 h-5" />
            </div>
          )}
          <div>
            <h2 className="text-xs font-bold text-gray-900">شركة حجاج الضويحي</h2>
            <span className="text-[10px] text-[#B8963A] font-semibold">لوحة الإدارة CRM</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-gray-100 text-gray-700"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-3 z-40">
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between ${
                  activeTab === item.id ? 'bg-[#071B23] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#B8963A] text-white">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button onClick={onGoToSite} className="flex-1 py-2 rounded-xl bg-gray-100 text-xs text-gray-700 font-bold">
              الموقع الرئيسي
            </button>
            <button onClick={onLogout} className="py-2 px-4 rounded-xl bg-red-50 text-xs text-red-600 font-bold">
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}

      {/* Main Scrollable Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
};
