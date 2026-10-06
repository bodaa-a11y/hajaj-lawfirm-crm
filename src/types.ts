export interface LegalService {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'corporate' | 'litigation' | 'individual' | 'documentation';
  categoryLabel: string;
  iconName: string;
  bgImage: string;
  features: string[];
  scope: string[];
  deliverables: string[];
}

export interface LegalPrinciple {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export interface ContactInfoItem {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  href: string;
  iconName: string;
  actionText: string;
}

export interface FirmStatistic {
  value: string;
  label: string;
  subLabel?: string;
}

export interface ConsultationRequest {
  fullName: string;
  phone: string;
  email: string;
  serviceCategory: string;
  inquiryType: 'urgent' | 'consultation' | 'retainer' | 'litigation';
  details: string;
  preferredTime: 'morning' | 'evening';
}
