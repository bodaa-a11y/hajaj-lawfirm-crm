import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar, 
  UserCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Send, 
  Lock, 
  FileCheck, 
  AlertTriangle, 
  Download, 
  Building2, 
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  Video,
  MapPin,
  Scale,
  Bell,
  BellRing
} from 'lucide-react';
import { Application, ApplicationStatus, Appointment, InternalNote, User } from '../../types/crm';
import { crmDb } from '../../services/crmDb';
import { notificationService } from '../../services/notificationService';

interface Props {
  application: Application;
  currentUser: User;
  onClose: () => void;
  onUpdated: () => void;
}

export const ApplicationDetailModal: React.FC<Props> = ({
  application,
  currentUser,
  onClose,
  onUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'notes' | 'whatsapp' | 'appointment' | 'push'>('overview');
  
  // Note creation state
  const [newNote, setNewNote] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);

  // Push notification state
  const [pushTitle, setPushTitle] = useState('شركة حجاج الضويحي للمحاماة');
  const [pushBody, setPushBody] = useState(`تمت مراجعة استشارتك القانونية بخصوص [${application.serviceType}] وتحديد الإجراء اللازم.`);
  const [isSendingPush, setIsSendingPush] = useState(false);
  const [pushSuccessMsg, setPushSuccessMsg] = useState(false);

  // Appointment scheduling state
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointmentTime, setAppointmentTime] = useState('11:00');
  const [appointmentDuration, setAppointmentDuration] = useState(45);
  const [appointmentType, setAppointmentType] = useState<'in_person' | 'google_meet' | 'phone_call'>('in_person');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [appointmentLawyerId, setAppointmentLawyerId] = useState(currentUser.id);

  // WhatsApp template state
  const [selectedTemplateId, setSelectedTemplateId] = useState('tmpl-1');
  const [customWaMessage, setCustomWaMessage] = useState('');

  const users = crmDb.getUsers();
  const settings = crmDb.getSettings();

  const statusSteps: { key: ApplicationStatus; label: string; desc: string }[] = [
    { key: 'new', label: '1. استلام الطلب', desc: 'تم التقديم' },
    { key: 'under_review', label: '2. قيد الدراسة', desc: 'فحص الوقائع' },
    { key: 'contacted', label: '3. تم التواصل', desc: 'محادثة الموكل' },
    { key: 'appointment_set', label: '4. موعد استشارة', desc: 'جلسة محددة' },
    { key: 'assigned', label: '5. إسناد القضية', desc: 'بدء العمل' },
    { key: 'completed', label: '6. مكتملة', desc: 'إنهاء الإجراء' }
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === application.status);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    crmDb.updateApplication(application.id, { status: newStatus }, currentUser.name);
    onUpdated();
  };

  const handleAssignLawyer = (lawyerId: string) => {
    const assigned = users.find(u => u.id === lawyerId);
    crmDb.updateApplication(application.id, { 
      assignedLawyerId: lawyerId,
      assignedTo: assigned,
      status: application.status === 'new' ? 'under_review' : application.status
    }, currentUser.name);
    onUpdated();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    crmDb.addNote(application.id, {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.title,
      content: newNote.trim(),
      isPrivate: isPrivateNote
    });

    setNewNote('');
    onUpdated();
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedLawyer = users.find(u => u.id === appointmentLawyerId) || currentUser;

    crmDb.createAppointment({
      applicationId: application.id,
      clientName: application.fullName,
      clientPhone: application.phone,
      lawyerId: assignedLawyer.id,
      lawyerName: assignedLawyer.name,
      serviceType: application.serviceType,
      date: appointmentDate,
      time: appointmentTime,
      durationMinutes: appointmentDuration,
      meetingType: appointmentType,
      location: appointmentType === 'in_person' ? 'مقر الشركة الرئيسي - قاعة الاجتماعات' : undefined,
      meetingLink: appointmentType === 'google_meet' ? 'https://meet.google.com/hajaj-legal-crm' : undefined,
      notes: appointmentNotes,
      status: 'scheduled'
    }, currentUser.name);

    setActiveTab('overview');
    onUpdated();
  };

  const getWhatsAppMessage = () => {
    const tmpl = settings.whatsappTemplates.find(t => t.id === selectedTemplateId);
    let msg = tmpl ? tmpl.text : customWaMessage;
    
    msg = msg.replace(/{clientName}/g, application.fullName)
             .replace(/{orderNumber}/g, application.orderNumber)
             .replace(/{serviceName}/g, application.serviceType)
             .replace(/{appointmentDate}/g, appointmentDate)
             .replace(/{appointmentTime}/g, appointmentTime)
             .replace(/{appointmentType}/g, appointmentType === 'in_person' ? 'حضوري بمكتب المحامي' : 'عن بعد عبر Google Meet')
             .replace(/{lawyerName}/g, currentUser.name);

    return msg;
  };

  const sendWhatsApp = () => {
    const cleanPhone = application.phone.replace(/\D/g, '').replace(/^0/, '966');
    const msg = getWhatsAppMessage();
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    if (application.status === 'new' || application.status === 'under_review') {
      handleStatusChange('contacted');
    }
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushBody.trim()) return;

    setIsSendingPush(true);
    setPushSuccessMsg(false);

    await notificationService.sendNotificationToClient(application.orderNumber, {
      title: pushTitle.trim() || 'شركة حجاج الضويحي للمحاماة',
      body: pushBody.trim(),
      type: 'message',
      url: `/track?order=${application.orderNumber}`
    });

    setIsSendingPush(false);
    setPushSuccessMsg(true);
    setTimeout(() => setPushSuccessMsg(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto font-cairo" dir="rtl">
      
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gray-50 p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#071B23] flex items-center justify-center text-[#B8963A] font-mono font-bold text-sm shadow-sm">
              {application.orderNumber.replace('HJ-', '#')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">{application.fullName}</h2>
                <span className="text-xs font-mono font-bold text-[#071B23] px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                  {application.orderNumber}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{application.serviceType}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Progression Bar */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] gap-2">
            {statusSteps.map((step, idx) => {
              const isPastOrCurrent = currentStepIndex >= idx;
              const isCurrent = application.status === step.key;

              return (
                <div
                  key={step.key}
                  onClick={() => handleStatusChange(step.key)}
                  className={`flex-1 flex flex-col items-center cursor-pointer p-2 rounded-xl transition ${
                    isCurrent 
                      ? 'bg-[#071B23] text-white shadow-md' 
                      : isPastOrCurrent
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'hover:bg-gray-50 text-gray-500 border border-gray-100'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                    isCurrent 
                      ? 'bg-[#B8963A] text-[#071B23]' 
                      : isPastOrCurrent 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isPastOrCurrent && !isCurrent ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs font-bold text-center ${isCurrent ? 'text-white' : ''}`}>
                    {step.label}
                  </span>
                  <span className={`text-[10px] text-center truncate max-w-[90px] ${isCurrent ? 'text-amber-200' : 'text-gray-400'}`}>
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 px-6 text-xs sm:text-sm font-bold text-gray-500 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview' ? 'border-[#071B23] text-[#071B23]' : 'border-transparent hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 text-[#B8963A]" />
            <span>ملف القضية والمستندات</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'whatsapp' ? 'border-emerald-600 text-emerald-700' : 'border-transparent hover:text-gray-900'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>مراسلة واتساب الذكية</span>
          </button>

          <button
            onClick={() => setActiveTab('appointment')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'appointment' ? 'border-purple-600 text-purple-700' : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>حجز وتحديد موعد جلسة</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'notes' ? 'border-[#B8963A] text-[#071B23]' : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>الملاحظات والآراء ({application.notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'timeline' ? 'border-blue-600 text-blue-700' : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>سجل النشاط والتاريخ ({application.timeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('push')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'push' ? 'border-[#B8963A] text-[#071B23] bg-amber-50/70 font-bold' : 'border-transparent hover:text-gray-900'
            }`}
          >
            <BellRing className="w-4 h-4 text-[#B8963A]" />
            <span>إشعار جهاز العميل 📢</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Contact Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                  <span className="text-xs text-gray-500 font-bold block">بيانات العميل المباشرة</span>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">الجوال:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900" dir="ltr">{application.phone}</span>
                        <a 
                          href={`tel:${application.phone}`}
                          className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                          title="اتصال هاتفي"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {application.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">البريد:</span>
                        <span className="font-mono text-gray-800 text-[11px] truncate max-w-[140px]">{application.email}</span>
                      </div>
                    )}

                    {application.idNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">الهوية/السجل:</span>
                        <span className="font-mono text-gray-800">{application.idNumber}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">الوقت المفضل:</span>
                      <span className="font-semibold text-gray-800">
                        {application.preferredContactTime === 'morning' ? 'صباحاً (9-1)' :
                         application.preferredContactTime === 'afternoon' ? 'ظهراً (1-5)' : 'مساءً (5-9)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assignment Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                  <span className="text-xs text-gray-500 font-bold block">المحامي / المستشار المكلف</span>
                  
                  <div>
                    <select
                      value={application.assignedLawyerId || ''}
                      onChange={e => handleAssignLawyer(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#B8963A]"
                    >
                      <option value="">-- اختر المحامي المسؤول --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role === 'lawyer' ? 'محامي' : u.role === 'consultant' ? 'مستشار' : u.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-[11px] text-gray-500 space-y-1">
                    <div>مصدر الإحالة: <span className="text-gray-900 font-bold">{application.source || 'الموقع'}</span></div>
                    <div>تاريخ التسجيل: <span className="font-mono text-gray-700">{new Date(application.createdAt).toLocaleString('ar-SA')}</span></div>
                  </div>
                </div>

                {/* Appointment Snapshot */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-bold">موعد الاستشارة المجدولة</span>
                    {application.appointment && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                        مجدول
                      </span>
                    )}
                  </div>

                  {application.appointment ? (
                    <div className="text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <Calendar className="w-3.5 h-3.5 text-[#B8963A]" />
                        <span>{application.appointment.date} في تمام {application.appointment.time}</span>
                      </div>
                      <div className="text-gray-600 text-[11px]">
                        مع: {application.appointment.lawyerName} ({application.appointment.durationMinutes} دقيقة)
                      </div>
                      {application.appointment.meetingLink && (
                        <a
                          href={application.appointment.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-bold"
                        >
                          <Video className="w-3 h-3" />
                          <span>رابط Google Meet</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-2 space-y-2">
                      <p className="text-[11px] text-gray-500">لم يتم تحديد موعد استشارة بعد</p>
                      <button
                        onClick={() => setActiveTab('appointment')}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-xs text-[#071B23] font-bold border border-gray-200 shadow-sm"
                      >
                        + تحديد موعد الآن
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Legal Case Description */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#B8963A]" />
                  <span>تفاصيل ووقائع القضية / الاستشارة</span>
                </h3>
                <div className="p-4 rounded-xl bg-white text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-200 shadow-sm">
                  {application.details}
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#B8963A]" />
                    <span>المستندات والعقود المرفقة ({application.attachments.length})</span>
                  </h3>
                </div>

                {application.attachments.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4 bg-white rounded-xl border border-gray-200">
                    لا توجد مرفقات مرفوعة من قبل العميل في هذا الطلب.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {application.attachments.map(file => (
                      <div key={file.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 text-xs shadow-sm">
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-[#B8963A] shrink-0" />
                          <div className="truncate">
                            <span className="text-gray-900 font-medium block truncate">{file.name}</span>
                            <span className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(0)} KB</span>
                          </div>
                        </div>
                        <a
                          href={file.url}
                          download={file.name}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition flex items-center gap-1 text-[11px] font-bold"
                        >
                          <Download className="w-3 h-3" />
                          <span>تحميل</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: WHATSAPP SMART COMMUNICATION */}
          {activeTab === 'whatsapp' && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>مركز التواصل عبر واتساب الرسمي</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  إرسال رسائل مجهزة ونموذجية إلى جوال العميل: <span className="font-mono font-bold text-gray-900" dir="ltr">{application.phone}</span>
                </p>
              </div>

              {/* Template Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">اختر قالب الرسالة:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {settings.whatsappTemplates.map(tmpl => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setSelectedTemplateId(tmpl.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm' 
                            : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="text-xs font-bold">{tmpl.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Message Live Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">نص الرسالة المعاينة:</label>
                <div className="p-4 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans shadow-inner">
                  {getWhatsAppMessage()}
                </div>
              </div>

              <button
                onClick={sendWhatsApp}
                className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>فتح محادثة واتساب وإرسال الرسالة للعميل مباشرة</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </button>
            </div>
          )}

          {/* TAB 3: APPOINTMENT SCHEDULER */}
          {activeTab === 'appointment' && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>جدولة موعد وجلسة استشارة رسمية</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  تحديد موعد الجلسة مع الموكل وإضافتها تلقائياً لجدول المواعيد وسجل القضية.
                </p>
              </div>

              <form onSubmit={handleScheduleAppointment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">تاريخ الجلسة</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={e => setAppointmentDate(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">الوقت</label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={e => setAppointmentTime(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">المدة (بالدقائق)</label>
                    <select
                      value={appointmentDuration}
                      onChange={e => setAppointmentDuration(Number(e.target.value))}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-500"
                    >
                      <option value={30}>30 دقيقة</option>
                      <option value={45}>45 دقيقة</option>
                      <option value={60}>ساعة كاملة</option>
                      <option value={90}>ساعة ونصف</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">نوع الاجتماع</label>
                    <select
                      value={appointmentType}
                      onChange={e => setAppointmentType(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-500"
                    >
                      <option value="in_person">🏢 اجتماع حضوري بمقر شركة المحاماة</option>
                      <option value="google_meet">💻 اجتماع مرئي عن بعد (Google Meet)</option>
                      <option value="phone_call">📞 مكالمة هاتفية استشارية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">المستشار المقدم للجلسة</label>
                    <select
                      value={appointmentLawyerId}
                      onChange={e => setAppointmentLawyerId(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-500"
                    >
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} - {u.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">ملاحظات التحضير للجلسة</label>
                  <textarea
                    rows={3}
                    placeholder="مثال: إحضار أصل صك الحصر، مراجعة بنود العقد..."
                    value={appointmentNotes}
                    onChange={e => setAppointmentNotes(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>تأكيد حجز الموعد وتحديث حالة الطلب</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: INTERNAL NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              
              <form onSubmit={handleAddNote} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-gray-800 block">إضافة رأي قانوني أو ملاحظة داخلية:</label>
                <textarea
                  rows={3}
                  placeholder="اكتب التوصيات القانونية، ملخص المكالمة مع العميل، أو الإجراءات القادمة..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#B8963A]"
                />
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={isPrivateNote}
                      onChange={e => setIsPrivateNote(e.target.checked)}
                      className="rounded border-gray-300 text-[#B8963A]"
                    />
                    <span>سرية خاصة (للمحامي العام والمدير فقط)</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#071B23] hover:bg-[#0c2c3a] text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-[#B8963A]" />
                    <span>حفظ الملاحظة</span>
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {application.notes.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-6 bg-gray-50 rounded-2xl border border-gray-200">
                    لا توجد ملاحظات مسجلة بعد.
                  </p>
                ) : (
                  application.notes.map(note => (
                    <div key={note.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{note.authorName}</span>
                          <span className="text-gray-500">({note.authorRole})</span>
                          {note.isPrivate && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
                              خاص
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500 font-mono text-[11px]">
                          {new Date(note.createdAt).toLocaleString('ar-SA')}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 5: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="space-y-6 relative before:absolute before:inset-0 before:right-4 before:w-0.5 before:bg-gray-200">
                {application.timeline.map((event, idx) => (
                  <div key={event.id} className="relative flex items-start gap-4 pr-1">
                    <div className="w-7 h-7 rounded-full bg-white border-2 border-[#B8963A] flex items-center justify-center text-[#B8963A] text-xs font-bold z-10 shrink-0 shadow-sm">
                      ✓
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-3.5 text-xs space-y-1 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{event.title}</span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          {new Date(event.timestamp).toLocaleString('ar-SA')}
                        </span>
                      </div>
                      <p className="text-gray-700">{event.description}</p>
                      <div className="text-[10px] text-gray-400">بواسطة: {event.performedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DIRECT DEVICE PUSH NOTIFICATION */}
          {activeTab === 'push' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[#071B23] space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                  <BellRing className="w-4 h-4 text-[#B8963A]" />
                  <span>إرسال إشعار فوري وتنبيه لجهاز العميل</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  سيظهر هذا الإشعار كإشعار نظام منبثق (Web Push Notification) مع صوت تنبيه على جهاز/هاتف العميل الذي قام بتقديم الطلب منه (#{application.orderNumber}).
                </p>
              </div>

              {/* Quick Template Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">نماذج رسائل إشعار جاهزة:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'تم تحديد موعد استشارة', text: `تم تحديد موعد استشارتك القانونية في مقر الشركة/عن بعد. يرجى مراجعة صفحة التتبع.` },
                    { label: 'تمت دراسة الطلب والموافقة', text: `تمت دراسة استشارتك من قبل المستشار القانوني ونرحب بالبدء في إجراءات القضية.` },
                    { label: 'طلب مستندات إضافية', text: `نرجو التكرم بالدخول وتزويدنا بصورة الهوية الوطنية أو العقود ذات الصلة.` },
                    { label: 'تحديث على مسار الجلسة', text: `تم تحديث الموقف القانوني ومسار المعاملة لدى المحكمة المختصة.` }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPushBody(preset.text)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition border border-gray-200 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Push Form */}
              <form onSubmit={handleSendPush} className="space-y-4 bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">عنوان التنبيه:</label>
                  <input
                    type="text"
                    value={pushTitle}
                    onChange={e => setPushTitle(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#B8963A]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">نص الإشعار المنبثق:</label>
                  <textarea
                    rows={3}
                    value={pushBody}
                    onChange={e => setPushBody(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#B8963A]"
                    required
                  />
                </div>

                {pushSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تم إرسال الإشعار الفوري لجهاز العميل بنجاح!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingPush}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#071B23] hover:bg-[#0c2c3a] text-[#E8D39B] hover:text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {isSendingPush ? (
                    <div className="w-4 h-4 border-2 border-[#E8D39B] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Bell className="w-4 h-4 text-[#B8963A]" />
                      <span>إرسال الإشعار لجهاز العميل الآن (Push Alert)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
