export type UserRole = 'admin' | 'lawyer' | 'consultant' | 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  title: string;
  avatar?: string;
  activeCaseload?: number;
}

export type ApplicationStatus = 
  | 'new'            // جديد
  | 'under_review'    // قيد المراجعة والدراسة
  | 'contacted'       // تم التواصل مع العميل
  | 'appointment_set' // تم تحديد موعد استشارة
  | 'assigned'        // مسند لمحامي/مستشار
  | 'completed'       // مكتمل / تم التعاقد
  | 'rejected'        // ملغي / اعتذار عن القضية
  | 'archived';       // مؤرشف

export type PriorityLevel = 'normal' | 'urgent' | 'emergency';

export type ContactMethod = 'whatsapp' | 'phone' | 'email' | 'in_person';

export type ContactTime = 'morning' | 'afternoon' | 'evening';

export type SourceChannel = 
  | 'lawyer_card' 
  | 'reception_desk' 
  | 'google_maps' 
  | 'social_media' 
  | 'paid_ads' 
  | 'website' 
  | 'referral' 
  | 'direct' 
  | 'custom';

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  title: string;
  description: string;
  performedBy: string;
  timestamp: string;
}

export interface InternalNote {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  isPrivate: boolean; // Only visible to lawyers/admins
  createdAt: string;
}

export interface Appointment {
  id: string;
  applicationId: string;
  clientName: string;
  clientPhone: string;
  lawyerId: string;
  lawyerName: string;
  serviceType: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  durationMinutes: number;
  meetingType: 'in_person' | 'phone_call' | 'google_meet' | 'zoom';
  meetingLink?: string;
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  createdAt: string;
}

export interface Application {
  id: string;
  orderNumber: string; // e.g. HJ-10254
  fullName: string;
  phone: string;
  email?: string;
  idNumber?: string; // National ID / Iqama / Commercial Register
  serviceType: string;
  details: string;
  priority: PriorityLevel;
  preferredContactMethod: ContactMethod;
  preferredContactTime: ContactTime;
  source: SourceChannel;
  campaign?: string;
  qrId?: string;
  
  status: ApplicationStatus;
  assignedTo?: User;
  assignedLawyerId?: string;
  
  attachments: FileAttachment[];
  timeline: TimelineEvent[];
  notes: InternalNote[];
  appointment?: Appointment;
  
  estimatedFee?: number;
  isPaid?: boolean;
  
  createdAt: string;
  updatedAt: string;
  firstResponseAt?: string;
  slaBreached?: boolean;
}

export interface SystemSettings {
  firmName: string;
  firmLicense: string;
  primaryPhone: string;
  founderPhone: string;
  consultantPhone: string;
  receptionPhone: string;
  address: string;
  slaTargetMinutes: number; // e.g. 30 minutes
  servicesList: string[];
  whatsappTemplates: {
    id: string;
    title: string;
    text: string;
  }[];
}