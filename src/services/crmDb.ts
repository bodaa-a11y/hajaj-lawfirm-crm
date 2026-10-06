import { Application, Appointment, InternalNote, SystemSettings, TimelineEvent, User } from '../types/crm';
import { notificationService } from './notificationService';

const STORAGE_KEYS = {
  APPLICATIONS: 'hajaj_crm_applications_v4',
  USERS: 'hajaj_crm_users_v4',
  APPOINTMENTS: 'hajaj_crm_appointments_v4',
  SETTINGS: 'hajaj_crm_settings_v4',
  CURRENT_USER: 'hajaj_crm_current_user_v4'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'أ. حجاج عبدالرحمن الضويحي',
    email: 'hajaj@hajaj-lawfirm.com',
    phone: '0555102513',
    role: 'lawyer',
    title: 'المحامي العام والمؤسس / خبير التوثيق والنزاعات التجارية',
    avatar: '',
    activeCaseload: 0
  },
  {
    id: 'usr-2',
    name: 'المستشار القانوني الأول',
    email: 'consultant@hajaj-lawfirm.com',
    phone: '0114088009',
    role: 'consultant',
    title: 'رئيس قسم الاستشارات الشرعية والنظامية وقضايا الشركات',
    avatar: '',
    activeCaseload: 0
  },
  {
    id: 'usr-3',
    name: 'إدارة العمليات وشؤون العملاء',
    email: 'crm@hajaj-lawfirm.com',
    phone: '0555102513',
    role: 'manager',
    title: 'مسؤول استقبال وفرز الطلبات والمواعيد',
    avatar: '',
    activeCaseload: 0
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  firmName: 'شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية والتوثيق',
  firmLicense: 'ترخيص وزارة العدل رقم: 41/1820',
  primaryPhone: '0555102513',
  founderPhone: '0555102513',
  consultantPhone: '0114088009',
  receptionPhone: '0114088009',
  address: 'الرياض - المملكة العربية السعودية',
  slaTargetMinutes: 30,
  servicesList: [
    'استشارات قانونية وشرعية',
    'التمثيل القضائي والترافع أمام المحاكم',
    'صياغة ومراجعة العقود والاتفاقيات',
    'خدمات التوثيق المعتمد وإفراغ العقارات',
    'تأسيس الشركات وحوكمة المؤسسات',
    'قسمة التركات وتصفية الأوقاف',
    'تحصيل الديون والمطالبات المالية',
    'حماية الملكية الفكرية والعلامات التجارية',
    'القضايا العمالية والتأمينات',
    'النزاعات المصرفية والتمويل'
  ],
  whatsappTemplates: [
    {
      id: 'tmpl-auto-reply',
      title: 'الرد الترحيبي والتوجيه للاستمارة (Auto-Reply)',
      text: 'وعليكم السلام ورحمة الله وبركاته،\n\nأهلاً وسهلاً بك في شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية والتوثيق ⚖️\n\nنظراً لكثافة الاستشارات الواردة ولضمان دراسة طلبكم بعناية تامة وبأعلى درجات السرية من قبل المستشار القانوني المختص:\n\n📌 يرجى التكرم بتسجيل تفاصيل استشارتكم عبر الرابط الرسمي:\n🔗 https://hajaj-lawfirm.com/apply\n\n⚡️ سيقوم فريقنا القانوني بمراجعة طلبكم على الفور والتواصل معكم لتحديد الموعد ومناقشة القضية.\n\n🔍 كما يمكنكم تتبع مسار المعاملة برقم الطلب عبر:\n🔗 https://hajaj-lawfirm.com/track\n\nشركة حجاج الضويحي للمحاماة • الرياض'
    },
    {
      id: 'tmpl-1',
      title: 'تأكيد استلام الطلب والترحيب',
      text: 'أهلاً بك أستاذ/ة {clientName}،\n\nنشكر تواصلك مع شركة حجاج عبدالرحمن الضويحي للمحاماة والاستشارات القانونية.\nتم استلام طلبكم رقم ({orderNumber}) بخصوص ({serviceName}) بنجاح.\n\nيقوم فريقنا القانوني المختص بمراجعة التفاصيل وسنتواصل معكم خلال دقائق.\n\nشركة حجاج الضويحي للمحاماة - الرياض'
    },
    {
      id: 'tmpl-2',
      title: 'طلب مستندات وتفاصيل إضافية',
      text: 'السلام عليكم ورحمة الله أستاذ/ة {clientName}،\n\nبشأن طلبكم القانوني رقم ({orderNumber})، نرجو تزويدنا بنسخة من المستندات والعقود المتعلقة بالموضوع لدراستها بدقة من قبل المستشار القانوني.\n\nشاكرين تعاونكم الكريم.'
    },
    {
      id: 'tmpl-3',
      title: 'تأكيد موعد استشارة قانونية',
      text: 'مرحباً أستاذ/ة {clientName}،\n\nيسعدنا تأكيد موعد استشارتكم القانونية رقم ({orderNumber}):\n📅 التاريخ: {appointmentDate}\n⏰ الوقت: {appointmentTime}\n📍 النوع: {appointmentType}\n👨‍⚖️ مع: {lawyerName}\n\nنتطلع لخدمتكم بكل احترافية.'
    },
    {
      id: 'tmpl-4',
      title: 'عرض أتعاب قانونية ودراسة القضية',
      text: 'أهلاً بك أستاذ/ة {clientName}،\n\nتمت دراسة طلبكم رقم ({orderNumber}) من قبل المستشار المختص، ويسعدنا مشاركتكم خطة العمل ومقترح الأتعاب القانونية المناسبة.\nيرجى الاطلاع وتأكيد رغبتكم بالبدء.'
    }
  ]
};

export const INITIAL_APPLICATIONS: Application[] = [];
export const INITIAL_APPOINTMENTS: Appointment[] = [];

class CrmDatabaseService {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // Health check
  async checkApiHealth(): Promise<{ ok: boolean; db?: string; uploadsWritable?: boolean }> {
    try {
      const res = await fetch('/api/index.php?action=health');
      if (res.ok) {
        const data = await res.json();
        return { ok: data.success === true, db: data.db, uploadsWritable: data.uploadsWritable };
      }
    } catch {
      // Fallback
    }
    return { ok: false };
  }

  // Real File Upload to Hostinger
  async uploadFile(file: File): Promise<FileAttachment | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/index.php?action=upload_file', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          return result.data as FileAttachment;
        }
      }
    } catch (err) {
      console.error('File upload failed:', err);
    }
    return null;
  }

  // Sync with Hostinger backend with retry for pending submissions
  async syncFromHostinger(): Promise<Application[]> {
    try {
      // 1. Check for pending local submissions to push first
      const localApps = this.getApplications();
      const pendingApps = localApps.filter(a => a.pendingSync === true);

      for (const pending of pendingApps) {
        try {
          const pushRes = await fetch('/api/index.php?action=create_application', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pending)
          });
          if (pushRes.ok) {
            const pushData = await pushRes.json();
            if (pushData.success) {
              pending.pendingSync = false;
              pending.syncedToServer = true;
            }
          }
        } catch {
          // Keep as pending
        }
      }

      // 2. Fetch latest from server
      const res = await fetch('/api/index.php?action=get_applications');
      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          const serverApps: Application[] = result.data.map((app: Application) => ({
            ...app,
            syncedToServer: true,
            pendingSync: false
          }));

          // Merge: Keep any unsynced local drafts that aren't on server yet
          const finalApps = [...serverApps];
          for (const local of localApps) {
            if (local.pendingSync && !finalApps.some(s => s.id === local.id || s.orderNumber === local.orderNumber)) {
              finalApps.unshift(local);
            }
          }

          this.saveApplications(finalApps);
          return finalApps;
        }
      }
    } catch (err) {
      console.warn('Sync from Hostinger failed:', err);
    }
    return this.getApplications();
  }

  // Fetch single application from server by Order Number or ID
  async fetchApplicationFromHostinger(query: string): Promise<Application | null> {
    try {
      const clean = query.trim().toUpperCase();
      const res = await fetch(`/api/index.php?action=get_application&order=${encodeURIComponent(clean)}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const fetchedApp: Application = {
            ...result.data,
            syncedToServer: true,
            pendingSync: false
          };
          const apps = this.getApplications();
          const idx = apps.findIndex(a => a.id === fetchedApp.id || a.orderNumber.toUpperCase() === clean);
          if (idx >= 0) {
            apps[idx] = fetchedApp;
          } else {
            apps.unshift(fetchedApp);
          }
          this.saveApplications(apps);
          return fetchedApp;
        }
      }
    } catch (err) {
      console.warn('Fetch application from server failed:', err);
    }
    return this.getApplicationById(query) || null;
  }

  getApplications(): Application[] {
    return this.getStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  }

  saveApplications(apps: Application[]): void {
    this.setStorage(STORAGE_KEYS.APPLICATIONS, apps);
  }

  getApplicationById(id: string): Application | undefined {
    const apps = this.getApplications();
    const clean = id.trim().toUpperCase();
    return apps.find(a => a.id === id || a.orderNumber.toUpperCase() === clean || a.orderNumber.replace('HJ-', '') === clean);
  }

  // Synchronous local creator (with background async sync)
  createApplication(data: Omit<Application, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline' | 'notes'>): Application {
    const apps = this.getApplications();
    const orderNumSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrderNumber = `HJ-${orderNumSuffix}`;
    const newId = `app-${Date.now()}`;
    const now = new Date().toISOString();

    const initialTimeline: TimelineEvent = {
      id: `tl-${Date.now()}`,
      status: 'new',
      title: 'تم استلام الطلب الجديد',
      description: `تم تقديم الطلب بنجاح عبر استمارة الموقع`,
      performedBy: 'النظام الآلي',
      timestamp: now
    };

    const newApp: Application = {
      ...data,
      id: newId,
      orderNumber: newOrderNumber,
      status: 'new',
      attachments: data.attachments || [],
      timeline: [initialTimeline],
      notes: [],
      createdAt: now,
      updatedAt: now,
      pendingSync: true,
      syncedToServer: false
    };

    apps.unshift(newApp);
    this.saveApplications(apps);

    // Asynchronously send to Hostinger API
    fetch('/api/index.php?action=create_application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp)
    }).then(async res => {
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const currentApps = this.getApplications();
          const targetIndex = currentApps.findIndex(a => a.id === newId || a.orderNumber === newOrderNumber);
          if (targetIndex >= 0) {
            currentApps[targetIndex] = {
              ...result.data,
              syncedToServer: true,
              pendingSync: false
            };
            this.saveApplications(currentApps);
          }
        }
      }
    }).catch(err => {
      console.warn('API background save failed:', err);
    });

    return newApp;
  }

  // Fully awaited async application submission
  async createApplicationAsync(data: Omit<Application, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline' | 'notes'>): Promise<{ application: Application; serverSaved: boolean }> {
    const apps = this.getApplications();
    const orderNumSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrderNumber = `HJ-${orderNumSuffix}`;
    const newId = `app-${Date.now()}`;
    const now = new Date().toISOString();

    const initialTimeline: TimelineEvent = {
      id: `tl-${Date.now()}`,
      status: 'new',
      title: 'تم استلام الطلب الجديد',
      description: `تم تقديم الطلب بنجاح عبر استمارة الموقع`,
      performedBy: 'النظام الآلي',
      timestamp: now
    };

    const newApp: Application = {
      ...data,
      id: newId,
      orderNumber: newOrderNumber,
      status: 'new',
      attachments: data.attachments || [],
      timeline: [initialTimeline],
      notes: [],
      createdAt: now,
      updatedAt: now,
      pendingSync: true,
      syncedToServer: false
    };

    let serverSaved = false;

    try {
      const res = await fetch('/api/index.php?action=create_application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          newApp.syncedToServer = true;
          newApp.pendingSync = false;
          serverSaved = true;
        }
      }
    } catch (err) {
      console.warn('Direct server save failed, saved locally for auto-retry:', err);
    }

    apps.unshift(newApp);
    this.saveApplications(apps);

    return { application: newApp, serverSaved };
  }

  updateApplication(id: string, updates: Partial<Application>, performedBy = 'النظام'): Application | null {
    const apps = this.getApplications();
    const index = apps.findIndex(a => a.id === id || a.orderNumber === id);
    if (index === -1) return null;

    const oldApp = apps[index];
    const now = new Date().toISOString();

    let newTimeline = [...oldApp.timeline];
    if (updates.status && updates.status !== oldApp.status) {
      const statusLabels: Record<string, string> = {
        new: 'جديد',
        under_review: 'قيد الدراسة',
        contacted: 'تم التواصل مع العميل',
        appointment_set: 'تم تحديد موعد استشارة',
        assigned: 'تم إسناد القضية للمحامي',
        completed: 'مكتملة / تم إنهاء الإجراء',
        rejected: 'ملغية / اعتذار',
        archived: 'مؤرشفة'
      };

      newTimeline.push({
        id: `tl-${Date.now()}`,
        status: updates.status,
        title: `تحديث الحالة إلى: ${statusLabels[updates.status] || updates.status}`,
        description: `تم تغيير الحالة بواسطة ${performedBy}`,
        performedBy,
        timestamp: now
      });

      // Automatically dispatch Web Push notification to client device
      const statusTitle = statusLabels[updates.status] || updates.status;
      notificationService.sendNotificationToClient(oldApp.orderNumber, {
        title: 'شركة حجاج الضويحي للمحاماة',
        body: `تحديث على طلبك #${oldApp.orderNumber}: تم تعديل الحالة إلى [${statusTitle}]`,
        type: 'status_update',
        url: `/track?order=${oldApp.orderNumber}`
      });
    }

    const updatedApp: Application = {
      ...oldApp,
      ...updates,
      timeline: newTimeline,
      updatedAt: now
    };

    apps[index] = updatedApp;
    this.saveApplications(apps);

    // Sync update to Hostinger API
    fetch('/api/index.php?action=update_application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: updatedApp.id,
        status: updatedApp.status,
        assignedLawyerId: updatedApp.assignedLawyerId,
        performedBy
      })
    }).catch(() => {});

    return updatedApp;
  }

  deleteApplication(id: string): boolean {
    let apps = this.getApplications();
    const initialLen = apps.length;
    apps = apps.filter(a => a.id !== id && a.orderNumber !== id);
    if (apps.length !== initialLen) {
      this.saveApplications(apps);

      // Sync deletion to Hostinger API
      fetch('/api/index.php?action=delete_application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(() => {});

      return true;
    }
    return false;
  }

  addNote(appId: string, note: Omit<InternalNote, 'id' | 'createdAt'>): InternalNote | null {
    const apps = this.getApplications();
    const app = apps.find(a => a.id === appId || a.orderNumber === appId);
    if (!app) return null;

    const newNote: InternalNote = {
      ...note,
      id: `nt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    app.notes.unshift(newNote);
    app.updatedAt = new Date().toISOString();
    this.saveApplications(apps);

    // Sync note to Hostinger API
    fetch('/api/index.php?action=update_application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: app.id,
        newNote
      })
    }).catch(() => {});

    return newNote;
  }

  getUsers(): User[] {
    return this.getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  saveUsers(users: User[]): void {
    this.setStorage(STORAGE_KEYS.USERS, users);
  }

  getAppointments(): Appointment[] {
    return this.getStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  }

  saveAppointments(apts: Appointment[]): void {
    this.setStorage(STORAGE_KEYS.APPOINTMENTS, apts);
  }

  createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>, performedBy = 'المسؤول'): Appointment {
    const apts = this.getAppointments();
    const newApt: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    apts.unshift(newApt);
    this.saveAppointments(apts);

    if (appointment.applicationId) {
      const apps = this.getApplications();
      const targetApp = apps.find(a => a.id === appointment.applicationId || a.orderNumber === appointment.applicationId);

      this.updateApplication(appointment.applicationId, {
        status: 'appointment_set',
        appointment: newApt
      }, performedBy);

      if (targetApp) {
        notificationService.sendNotificationToClient(targetApp.orderNumber, {
          title: 'شركة حجاج الضويحي للمحاماة - تم تحديد موعد استشارتك',
          body: `تم تحديد موعد استشارتك القانونية في تاريخ ${newApt.date} الساعة ${newApt.time} مع المستشار ${newApt.lawyerName}`,
          type: 'appointment',
          url: `/track?order=${targetApp.orderNumber}`
        });
      }
    }

    // Sync appointment to Hostinger API
    fetch('/api/index.php?action=create_appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApt)
    }).catch(() => {});

    return newApt;
  }

  getSettings(): SystemSettings {
    return this.getStorage<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  saveSettings(settings: SystemSettings): void {
    this.setStorage(STORAGE_KEYS.SETTINGS, settings);
  }

  getCurrentUser(): User | null {
    return this.getStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: User | null): void {
    if (user === null) {
      try { localStorage.removeItem(STORAGE_KEYS.CURRENT_USER); } catch(e){}
    } else {
      this.setStorage(STORAGE_KEYS.CURRENT_USER, user);
    }
  }

  verifyPassword(password: string): boolean {
    const validPasswords = [
      'HajajLaw#2026!Sec'
    ];
    return validPasswords.includes(password.trim());
  }

  getOverdueApplications(): Application[] {
    const apps = this.getApplications();
    const settings = this.getSettings();
    const targetMs = (settings.slaTargetMinutes || 30) * 60 * 1000;
    const now = Date.now();

    return apps.filter(app => {
      if (app.status === 'new' || (app.status === 'under_review' && !app.firstResponseAt)) {
        const createdMs = new Date(app.createdAt).getTime();
        return (now - createdMs) > targetMs;
      }
      return false;
    });
  }

  clearAllData(): void {
    this.saveApplications([]);
    this.saveAppointments([]);
  }
}

export const crmDb = new CrmDatabaseService();