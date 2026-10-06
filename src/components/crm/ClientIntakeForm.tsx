import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Send, 
  Upload, 
  FileText, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck, 
  X,
  CheckCircle2,
  Paperclip,
  Trash2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { crmDb } from '../../services/crmDb';
import { Application, ContactMethod, ContactTime, FileAttachment, PriorityLevel, SourceChannel } from '../../types/crm';
import { IntakeSuccess } from './IntakeSuccess';

interface Props {
  onBackToHome?: () => void;
  onNavigateToTrack?: (orderNumber: string) => void;
}

export const ClientIntakeForm: React.FC<Props> = ({ onBackToHome, onNavigateToTrack }) => {
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [source, setSource] = useState<SourceChannel>('website');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const srcParam = params.get('source') as SourceChannel;
    if (srcParam) {
      setSource(srcParam);
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    idNumber: '',
    serviceType: 'استشارات قانونية وشرعية',
    details: '',
    priority: 'normal' as PriorityLevel,
    preferredContactMethod: 'whatsapp' as ContactMethod,
    preferredContactTime: 'morning' as ContactTime,
    agreeTerms: true
  });

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const settings = crmDb.getSettings();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: FileAttachment[] = Array.from(files).map(file => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'document',
      url: '#',
      uploadedAt: new Date().toISOString()
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleClearForm = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في محو كافة البيانات المدخلة في النموذج؟')) {
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        idNumber: '',
        serviceType: 'استشارات قانونية وشرعية',
        details: '',
        priority: 'normal',
        preferredContactMethod: 'whatsapp',
        preferredContactTime: 'morning',
        agreeTerms: true
      });
      setAttachments([]);
      setErrors({});
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'يرجى كتابة الاسم الكريم بالكامل';
    if (!formData.phone.trim()) {
      newErrors.phone = 'يرجى إدخال رقم الجوال للتواصل';
    } else {
      const cleanPhone = formData.phone.replace(/[\s-]/g, '');
      if (!/^05\d{8}$|^\+9665\d{8}$|^9665\d{8}$/.test(cleanPhone)) {
        newErrors.phone = 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 0501234567)';
      }
    }
    if (!formData.details.trim() || formData.details.length < 10) {
      newErrors.details = 'يرجى تقديم ملخص موجز عن الاستشارة أو القضية (10 أحرف على الأقل)';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'يرجى الموافقة على سياسة الخصوصية وسرية المعلومات';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const created = crmDb.createApplication({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          idNumber: formData.idNumber,
          serviceType: formData.serviceType,
          details: formData.details,
          priority: formData.priority,
          preferredContactMethod: formData.preferredContactMethod,
          preferredContactTime: formData.preferredContactTime,
          source: source,
          status: 'new',
          attachments: attachments
        });

        setSubmittedApp(created);
      } catch (err) {
        console.error('Error submitting form', err);
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  if (submittedApp) {
    return (
      <IntakeSuccess 
        application={submittedApp} 
        onNewRequest={() => {
          setSubmittedApp(null);
          setFormData({
            fullName: '',
            phone: '',
            email: '',
            idNumber: '',
            serviceType: 'استشارات قانونية وشرعية',
            details: '',
            priority: 'normal',
            preferredContactMethod: 'whatsapp',
            preferredContactTime: 'morning',
            agreeTerms: true
          });
          setAttachments([]);
          setErrors({});
        }}
        onTrackStatus={() => {
          if (onNavigateToTrack) {
            onNavigateToTrack(submittedApp.orderNumber);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F9] text-[#202124] py-8 sm:py-12 px-3 sm:px-6 lg:px-8 font-cairo" dir="rtl">
      
      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* Top Back Navigation Bar */}
        {onBackToHome && (
          <div className="flex items-center justify-between pb-1">
            <button 
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-[#071B23] hover:text-[#B8963A] font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm transition"
            >
              <span>← العودة إلى الموقع الرئيسي</span>
            </button>
            <span className="text-[11px] text-gray-500 font-medium">بوابة طلب الخدمات القانونية</span>
          </div>
        )}

        {/* 1. Google Forms Header Card with Brand Top Accent Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Top Decorative Color Bar */}
          <div className="h-3 bg-gradient-to-r from-[#071B23] via-[#B8963A] to-[#071B23]" />
          
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="شعار الشركة" className="h-10 sm:h-12 w-auto object-contain" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-amiri text-[#071B23]">
                  شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية والتوثيق
                </h1>
                <p className="text-xs text-[#B8963A] font-semibold mt-0.5">
                  ترخيص وزارة العدل رقم: 41/1820
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
              مرحباً بكم. يرجى تعبئة بيانات الطلب أو القضية بدقة. سيتم توجيه طلبكم إلى المستشار المختص لدراسة الوقائع والتواصل معكم في أقرب وقت.
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-red-600 font-medium">
              <span>* يشير إلى أن الحقل مطلوب</span>
              <span className="text-gray-400 text-[11px]">سرية تامة ومحمية بنظام المحاماة</span>
            </div>
          </div>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Question Card 1: Full Name */}
          <div className={`bg-white rounded-2xl p-5 sm:p-6 border ${errors.fullName ? 'border-red-500 shadow-red-50' : 'border-gray-200'} shadow-sm transition hover:shadow-md space-y-3`}>
            <label className="block text-sm font-bold text-gray-800">
              الاسم الكريم (الاسم الثلاثي أو اسم الشركة) <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500">يرجى كتابة الاسم كما يظهر في الهوية الوطنية أو السجل التجاري</p>
            <input
              type="text"
              placeholder="إجابتك"
              value={formData.fullName}
              onChange={e => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              className="w-full border-b-2 border-gray-200 focus:border-[#B8963A] py-2 px-1 text-sm text-gray-900 outline-none transition bg-transparent placeholder-gray-400"
            />
            {errors.fullName && (
              <div className="flex items-center gap-1 text-xs text-red-500 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* Question Card 2: Phone */}
          <div className={`bg-white rounded-2xl p-5 sm:p-6 border ${errors.phone ? 'border-red-500 shadow-red-50' : 'border-gray-200'} shadow-sm transition hover:shadow-md space-y-3`}>
            <label className="block text-sm font-bold text-gray-800">
              رقم الجوال للتواصل (واتساب) <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500">سيتم استخدام هذا الرقم لمراسلتكم بنتيجة دراسة الملف وموعد الاستشارة</p>
            <input
              type="tel"
              placeholder="05xxxxxxxx"
              dir="ltr"
              value={formData.phone}
              onChange={e => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className="w-full border-b-2 border-gray-200 focus:border-[#B8963A] py-2 px-1 text-sm text-gray-900 outline-none transition bg-transparent placeholder-gray-400 text-right font-mono"
            />
            {errors.phone && (
              <div className="flex items-center gap-1 text-xs text-red-500 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Question Card 3: Email */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm transition hover:shadow-md space-y-3">
            <label className="block text-sm font-bold text-gray-800">
              البريد الإلكتروني <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
            </label>
            <p className="text-xs text-gray-500">لاستلام نسخ من العقود ومذكرات الرأي القانوني</p>
            <input
              type="email"
              placeholder="name@example.com"
              dir="ltr"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full border-b-2 border-gray-200 focus:border-[#B8963A] py-2 px-1 text-sm text-gray-900 outline-none transition bg-transparent placeholder-gray-400 text-right font-mono"
            />
          </div>

          {/* Question Card 4: National ID / CR */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm transition hover:shadow-md space-y-3">
            <label className="block text-sm font-bold text-gray-800">
              رقم الهوية الوطنية / الإقامة / السجل التجاري <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
            </label>
            <input
              type="text"
              placeholder="إجابتك"
              value={formData.idNumber}
              onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
              className="w-full border-b-2 border-gray-200 focus:border-[#B8963A] py-2 px-1 text-sm text-gray-900 outline-none transition bg-transparent placeholder-gray-400"
            />
          </div>

          {/* Question Card 5: Service Type (Radio / Choice List) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm transition hover:shadow-md space-y-3">
            <label className="block text-sm font-bold text-gray-800">
              نوع الخدمة أو الاستشارة القانونية المطلوبة <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500">اختر التخصص الأقرب لموضوع طلبكم</p>
            
            <div className="space-y-2.5 pt-2">
              {settings.servicesList.map((srv, idx) => {
                const isSelected = formData.serviceType === srv;
                return (
                  <label 
                    key={idx} 
                    className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-50/70 border-[#B8963A] text-[#071B23] font-semibold' 
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      checked={isSelected}
                      onChange={() => setFormData({ ...formData, serviceType: srv })}
                      className="w-4 h-4 text-[#B8963A] border-gray-300 focus:ring-[#B8963A]"
                    />
                    <span className="text-xs sm:text-sm">{srv}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Question Card 6: Priority Level */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm transition hover:shadow-md space-y-3">
            <label className="block text-sm font-bold text-gray-800">
              درجة الاستعجال والأولوية
            </label>
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {[
                { id: 'normal', label: 'عادي', sub: 'دراسة اعتيادية' },
                { id: 'urgent', label: 'مستعجل ⚡', sub: 'موعد جلسة قريب' },
                { id: 'emergency', label: 'طارئ جداً 🚨', sub: 'نزاع عاجل / توقيف' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: item.id as PriorityLevel })}
                  className={`p-3 rounded-xl border text-center transition ${
                    formData.priority === item.id 
                      ? 'bg-[#071B23] border-[#071B23] text-white font-bold shadow-md' 
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="text-xs sm:text-sm">{item.label}</div>
                  <div className={`text-[10px] mt-0.5 ${formData.priority === item.id ? 'text-amber-300' : 'text-gray-400'}`}>
                    {item.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Card 7: Request Details / Summary */}
          <div className={`bg-white rounded-2xl p-5 sm:p-6 border ${errors.details ? 'border-red-500 shadow-red-50' : 'border-gray-200'} shadow-sm transition hover:shadow-md space-y-3`}>
            <label className="block text-sm font-bold text-gray-800">
              تفاصيل ووقائع الاستشارة أو القضية <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500">
              يرجى كتابة ملخص واضح لموضوع القضية، الأطراف المعنية، أو الاستفسارات المحددة التي ترغب باستشارة المحامي بشأنها.
            </p>
            <textarea
              rows={4}
              placeholder="إجابتك"
              value={formData.details}
              onChange={e => {
                setFormData({ ...formData, details: e.target.value });
                if (errors.details) setErrors({ ...errors, details: '' });
              }}
              className="w-full border-b-2 border-gray-200 focus:border-[#B8963A] py-2 px-1 text-sm text-gray-900 outline-none transition bg-transparent placeholder-gray-400 leading-relaxed"
            />
            {errors.details && (
              <div className="flex items-center gap-1 text-xs text-red-500 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.details}</span>
              </div>
            )}
          </div>

          {/* Question Card 8: File Uploads (Google Drive Style) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm transition hover:shadow-md space-y-3">
            <label className="block text-sm font-bold text-gray-800">
              المستندات والعقود المرفقة <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
            </label>
            <p className="text-xs text-gray-500">
              يمكنك رفع صور الصكوك، العقود، أو المذكرات ذات العلاقة (PDF, Word, صور) حتى 25 ميجابايت.
            </p>

            {/* Upload Button Google Forms Style */}
            <div className="pt-2">
              <input
                type="file"
                id="google-form-file-upload"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label 
                htmlFor="google-form-file-upload" 
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 hover:border-[#B8963A] hover:bg-amber-50/50 text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer transition shadow-sm"
              >
                <Upload className="w-4 h-4 text-[#B8963A]" />
                <span>+ إضافة ملف أو مستند</span>
              </label>
            </div>

            {/* Attached Files List */}
            {attachments.length > 0 && (
              <div className="space-y-2 pt-2">
                {attachments.map(file => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-[#B8963A] shrink-0" />
                      <span className="text-gray-800 font-medium truncate">{file.name}</span>
                      <span className="text-gray-400 text-[10px]">({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeAttachment(file.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition"
                      title="حذف الملف"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Question Card 9: Contact Preferences */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm transition hover:shadow-md space-y-4">
            <label className="block text-sm font-bold text-gray-800">
              تفضيلات التواصل والمقابلة
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-600 font-medium mb-1.5">طريقة التواصل المفضلة:</label>
                <select
                  value={formData.preferredContactMethod}
                  onChange={e => setFormData({ ...formData, preferredContactMethod: e.target.value as ContactMethod })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#B8963A]"
                >
                  <option value="whatsapp">واتساب مباشر (الأسرع)</option>
                  <option value="phone">مكالمة هاتفية صوتية</option>
                  <option value="in_person">جلسة استشارة حضورية بالمكتب</option>
                  <option value="email">بريد إلكتروني</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1.5">الوقت المفضل للتواصل:</label>
                <select
                  value={formData.preferredContactTime}
                  onChange={e => setFormData({ ...formData, preferredContactTime: e.target.value as ContactTime })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#B8963A]"
                >
                  <option value="morning">الفترة الصباحية (9:00 ص - 1:00 م)</option>
                  <option value="afternoon">فترة الظهيرة (1:00 م - 5:00 م)</option>
                  <option value="evening">الفترة المسائية (5:00 م - 9:00 م)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Question Card 10: Legal Consent Checkbox */}
          <div className={`bg-white rounded-2xl p-5 sm:p-6 border ${errors.agreeTerms ? 'border-red-500 shadow-red-50' : 'border-gray-200'} shadow-sm transition hover:shadow-md space-y-2`}>
            <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-gray-700 leading-relaxed">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={e => {
                  setFormData({ ...formData, agreeTerms: e.target.checked });
                  if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: '' });
                }}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#B8963A] focus:ring-[#B8963A]"
              />
              <span>
                أقر بأن جميع البيانات والمستندات المدخلة صحيحة، وأوافق على معالجتها من قبل شركة حجاج عبدالرحمن الضويحي للمحاماة وفق أحكام السرية المهنية المعمول بها في نظام المحاماة السعودي. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.agreeTerms && (
              <div className="flex items-center gap-1 text-xs text-red-500 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.agreeTerms}</span>
              </div>
            )}
          </div>

          {/* Form Actions (Submit & Clear Form) */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-[#071B23] hover:bg-[#0c2c3a] text-[#FAF7F2] font-bold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#B8963A]" />
                  <span>إرسال الطلب</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClearForm}
              className="text-xs text-gray-500 hover:text-red-600 font-medium px-3 py-2 transition"
            >
              محو النموذج
            </button>
          </div>

        </form>

        {/* Google Forms Style Watermark & Privacy Footer */}
        <div className="pt-6 text-center text-xs text-gray-400 space-y-1">
          <div>هذا النموذج آمن ومقدم مباشرة من شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية</div>
          <div className="text-[11px] text-gray-400">الرياض • ترخيص وزارة العدل رقم 41/1820</div>
        </div>

      </div>
    </div>
  );
};
