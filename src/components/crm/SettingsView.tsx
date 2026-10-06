import React, { useState } from 'react';
import { 
  Settings, 
  Clock, 
  Building2, 
  MessageSquare, 
  Save, 
  Check, 
  Plus, 
  Trash2, 
  ShieldCheck,
  Phone,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { SystemSettings } from '../../types/crm';
import { crmDb } from '../../services/crmDb';

interface Props {
  onRefresh: () => void;
}

export const SettingsView: React.FC<Props> = ({ onRefresh }) => {
  const [settings, setSettings] = useState<SystemSettings>(crmDb.getSettings());
  const [newService, setNewService] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    crmDb.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    onRefresh();
  };

  const handleAddService = () => {
    if (!newService.trim()) return;
    setSettings({
      ...settings,
      servicesList: [...settings.servicesList, newService.trim()]
    });
    setNewService('');
  };

  const handleRemoveService = (index: number) => {
    const updated = settings.servicesList.filter((_, i) => i !== index);
    setSettings({ ...settings, servicesList: updated });
  };

  const handleResetData = () => {
    if (window.confirm('هل أنت متأكد من تفريغ كافة الطلبات والمواعيد لبدء العمل من الصفر؟')) {
      crmDb.clearAllData();
      onRefresh();
      alert('تم تفريغ كافة البيانات بنجاح.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#B8963A]" />
            <span>إعدادات النظام والتخصيص المؤسسي</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ضبط وقت استجابة SLA، قوالب رسائل الواتساب، وأرقام التواصل الرسمية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ التعديلات بنجاح</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleResetData}
            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 text-xs font-bold transition flex items-center gap-1.5"
            title="تفريغ الطلبات التجريبية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تفريغ السجلات</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. SLA Settings */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-[#071B23] border-b border-gray-100 pb-3">
            <Clock className="w-4 h-4 text-[#B8963A]" />
            <span>مؤشر سرعة الاستجابة المستهدفة (SLA Target)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-700 mb-1.5 font-bold">
                المهلة الزمنية للرد على طلبات العملاء الجدد:
              </label>
              <select
                value={settings.slaTargetMinutes}
                onChange={e => setSettings({ ...settings, slaTargetMinutes: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#B8963A]"
              >
                <option value={15}>15 دقيقة (استجابة فائقة السرعة ⚡)</option>
                <option value={30}>30 دقيقة (الوضع القياسي الموصى به)</option>
                <option value={60}>ساعة واحدة (60 دقيقة)</option>
                <option value={120}>ساعتان (120 دقيقة)</option>
              </select>
              <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                عند تجاوز هذا الوقت دون تحديث للحالة، يظهر تنبيه أحمر عاجل في لوحة التحكم.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Official Contact Numbers */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-[#071B23] border-b border-gray-100 pb-3">
            <Phone className="w-4 h-4 text-[#B8963A]" />
            <span>أرقام التواصل والتحويل المباشر</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-700 mb-1 font-bold">رقم المحامي العام أ. حجاج (واتساب):</label>
              <input
                type="text"
                value={settings.founderPhone}
                onChange={e => setSettings({ ...settings, founderPhone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#B8963A] font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-bold">رقم المستشار القانوني الأول:</label>
              <input
                type="text"
                value={settings.consultantPhone}
                onChange={e => setSettings({ ...settings, consultantPhone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#B8963A] font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-bold">رقم هاتف الاستقبال والمكتب:</label>
              <input
                type="text"
                value={settings.receptionPhone}
                onChange={e => setSettings({ ...settings, receptionPhone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#B8963A] font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* 3. Services Management */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-[#071B23] border-b border-gray-100 pb-3">
            <Building2 className="w-4 h-4 text-[#B8963A]" />
            <span>قائمة الخدمات والتخصصات المتاحة في الاستمارة</span>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="إضافة خدمة قانونية جديدة..."
                value={newService}
                onChange={e => setNewService(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#B8963A]"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 border border-gray-200 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#B8963A]" />
                <span>إضافة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {settings.servicesList.map((srv, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-800 font-medium truncate">{srv}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-3 px-8 rounded-xl bg-[#071B23] hover:bg-[#0c2c3a] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#B8963A]" />
            <span>حفظ وتطبيق التعديلات</span>
          </button>
        </div>

      </form>

    </div>
  );
};
