export type IntakeChannel = 
  | 'email'
  | 'whatsapp'
  | 'chatbot'
  | 'webform'
  | 'calls'
  | 'social'
  | 'app_stores'
  | 'linkedin'
  | 'google_web';

export type RequestCategory = 
  | 'Right of Access (DSAR)'
  | 'Right to Erasure / Deletion'
  | 'Right to Rectification / Correction'
  | 'Data Portability'
  | 'Consent Revocation / Opt-Out'
  | 'Grievance / Escalation'
  | 'Security & Breach Inquiry'
  | 'General Privacy Query';

export type TargetDepartment = 
  | 'Privacy & Compliance Office'
  | 'Customer Support Operations'
  | 'HR & Talent Privacy'
  | 'IT & Security Engineering'
  | 'Billing & Accounts Operations'
  | 'Legal & Regulatory Counsel';

export type IntakeStatus = 
  | 'New Ingested'
  | 'Auto-Categorized'
  | 'Transferred'
  | 'Awaiting Form Submission'
  | 'Form Completed'
  | 'Converted to DSR'
  | 'Resolved / Closed';

export type UrgencyLevel = 'Critical' | 'High' | 'Medium' | 'Standard';

export interface FormFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'file' | 'checkbox';
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
}

export interface WebformConfig {
  id: string;
  title: string;
  description: string;
  organizationName: string;
  logoUrl?: string;
  themeColor: string;
  statutoryNotice: string;
  requireIdProof: boolean;
  requireOtpVerification: boolean;
  fields: FormFieldConfig[];
  autoAcknowledgementMessage: string;
  defaultAssignedDepartment: TargetDepartment;
}

export interface IntakeAcknowledgement {
  status: 'Sent' | 'Delivered' | 'Pending' | 'Failed';
  sentAt: string;
  channel: IntakeChannel;
  recipientContact: string;
  messagePreview: string;
  trackingToken: string;
}

export interface AttachedSupplementaryForm {
  formId: string;
  formTitle: string;
  formType: 'Identity Verification (KYC)' | 'Erasure Scope Declaration' | 'Consent Preference Form' | 'Grievance Statement' | 'DSAR Supplementary Details';
  formUrl: string;
  status: 'Pending Requester Submission' | 'Completed & Verified' | 'Awaiting Review';
  dispatchedAt: string;
  completedAt?: string;
  idProofUploaded?: boolean;
  idProofType?: string;
  idProofFileName?: string;
  requesterNotes?: string;
}

export interface IntakeRequest {
  id: string; // e.g. 'INTK-9001'
  channel: IntakeChannel;
  receivedAt: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  requesterPersona: 'Customer' | 'Employee' | 'Job Candidate' | 'Partner/Vendor' | 'Anonymous User';
  rawSubject?: string;
  rawPayload: string;
  audioDuration?: string; // For calls
  callTranscript?: string; // For calls
  appStoreRating?: number; // For App store reviews
  appStoreVersion?: string; // For App store reviews
  socialHandle?: string; // For social media
  category: RequestCategory;
  categoryConfidence: number; // 0-100%
  categoryReasoning: string;
  extractedEntities: {
    name?: string;
    email?: string;
    phone?: string;
    accountNumber?: string;
    socialHandle?: string;
    identifiers?: string[];
    statutoryKeywords: string[];
    sentiment: 'Frustrated' | 'Neutral' | 'Urgent' | 'Cooperative';
  };
  urgency: UrgencyLevel;
  slaDays: number;
  statutoryAct: string;
  transferredTo: {
    department: TargetDepartment;
    assignedOwner: string;
    ownerEmail: string;
    ownerRole: string;
    transferredAt: string;
    transferReason: string;
  };
  acknowledgement: IntakeAcknowledgement;
  attachedForm: AttachedSupplementaryForm;
  status: IntakeStatus;
  linkedDsrId?: string;
  auditTrail: {
    timestamp: string;
    actor: string;
    action: string;
    note: string;
  }[];
}

export interface ChannelSummary {
  channel: IntakeChannel;
  title: string;
  iconName: string;
  activeCount: number;
  totalCount: number;
  avgResponseSeconds: number;
  status: 'Operational' | 'Connected' | 'Degraded';
  endpoint: string;
  badgeColor: string;
}
