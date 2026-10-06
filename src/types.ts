// Unified Dutro DSR/DSAR Platform Types

export type UserRole = 
  | 'Privacy Officer'
  | 'Operations Team'
  | 'Grievance Officer'
  | 'Dutro Consultant'
  | 'Finance Specialist';

export type AuthRole = 'customer' | 'consultant';

export interface CustomerAccount {
  id: string; // 'CUS-1001'
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
  customerType: string;
  isVerified: boolean;
  verificationMethod: VerificationMethod;
  verifiedAt?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export interface ConsultantAccount {
  id: string; // 'DUTRO-CON-01'
  name: string;
  email: string;
  phone: string;
  organizationCode: string;
  roleTitle: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  email: string;
  avatarInitials: string;
  department?: string;
}

export type MainNavigationSection = 
  | 'overview'           // Overview Dashboard
  | 'workspace'          // Request Inbox & filtered tabs
  | 'my-tasks'           // My Tasks (Client & Operations task workspace)
  | 'details'            // DSR Case Details
  | 'grievances'         // Grievances Workspace & Case Details
  | 'history'            // DSR History Archive
  | 'data-discovery'     // Data Discovery (RoPA vs Basic Location Check)
  | 'data-sources'       // Data Sources / Basic Data Map Catalog
  | 'redaction-reviews'  // Redaction & Disclosure Reviews
  | 'sla-deadlines'      // SLA & Deadlines Radar
  | 'audit-trail'        // Platform Audit Trail
  | 'settings';          // Platform Settings (Intake, Integrations, Routing, SLA, Users)

export type RequestStatus = 
  | 'New'
  | 'Verification Pending'
  | 'Pending Verification'
  | 'Verified'
  | 'In Progress'
  | 'Pending Client Action'
  | 'Pending Review'
  | 'Ready for Validation'
  | 'Ready for Approval'
  | 'Ready for Closure'
  | 'Closed'
  | 'Grievance Raised'
  | 'Grievance Under Review'
  | 'Resolved'
  | 'Completed' // backward compat
  | 'Waiting for client action' // backward compat
  | 'Recommended for Closure'; // backward compat

export type RequestType = 
  | 'Right of Access'
  | 'Right to Erasure / Deletion'
  | 'Right to Rectification'
  | 'Data Portability'
  | 'Consent Revocation'
  | 'Grievance / Escalation'
  | 'Security Inquiry'
  | 'General Privacy Query'
  | 'Right to Correction'
  | 'Consent Withdrawal / Opt-Out'
  | 'Other Privacy Request';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Standard';

export type VerificationStatus = 'Pending' | 'Passed' | 'Verified' | 'Failed' | 'Manual Review';

export type VerificationMethod = 
  | 'Match'
  | 'OTP'
  | '2FA'
  | 'Security Questions'
  | 'Manual Review'
  | 'Authenticated customer portal'
  | 'Identity Proof Upload';

export type IntakeChannel = 
  | 'Client Customer Portal'
  | 'Website Webform'
  | 'Inbound Email'
  | 'WhatsApp Assistant'
  | 'AI Chatbot'
  | 'Customer Care Support'
  | 'Mobile App SDK'
  | 'API Webhook Ingest'
  | 'Social Media'
  | 'Client Organization Customer Portal';

export type DemoPerspective = 'dutro-officer' | 'client-team' | 'bank-team-member';

export type DataDiscoveryMode = 'ropa' | 'basic-location';

export interface AuditEvent {
  id?: string;
  timestamp: string;
  actor: string;
  role?: string;
  action: string;
  details: string;
  statusChange?: string;
}

export interface ClientEntity {
  id: string;
  name: string;
  country: string;
  privacyOfficer: string;
  privacyOfficerEmail: string;
}

export interface CustomerPrincipal {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerType: string;
  accountNumber: string;
}

// Redaction & Disclosure Review Structure
export type RedactionReviewStatus = 'NO REDACTION REQUIRED' | 'REDACTION REQUIRED' | 'REVIEW REQUIRED';
export type RedactionDecision = 'No Issue' | 'Review Required' | 'Redact' | 'Not Applicable';

export interface RedactionChecklistItem {
  id: string;
  label: string;
  description: string;
  detected: boolean;
  decision: RedactionDecision;
  notes?: string;
}

export interface RedactionReviewState {
  status: RedactionReviewStatus;
  guidanceText: string;
  checklist: RedactionChecklistItem[];
  recommendedAction: string;
  reviewerName?: string;
  reviewerRole?: string;
  reviewedAt?: string;
  finalDecision?: 'Approve Disclosure' | 'Redaction Required' | 'Mark Reviewed' | 'No Redaction' | 'Not Applicable';
  isReviewed: boolean;
}

// Basic Data Location Check Item (Path B: No Data Map)
export interface BasicLocationCheckItem {
  id: string;
  systemName: string;
  department: string;
  owner: string;
  ownerEmail: string;
  status: 'Pending' | 'In Progress' | 'Completed — Data Found' | 'Completed — No Data Found' | 'Unable to Determine';
  dataElementsFound?: string[];
  checkedAt?: string;
  notes?: string;
  evidenceRef?: string;
}

export interface ClientTask {
  id: string; // 'TASK-2001'
  dsrId: string; // 'DSR-2001'
  customerName: string;
  customerEmail: string;
  processName: string;
  department: string;
  assignedTeam: string;
  assignedPerson: string;
  assignedRole: string;
  dataRequested: string[];
  sourceSystem: string;
  status: 'Completed' | 'Waiting for client action' | 'In Progress' | 'Pending';
  dataFoundStatus?: 'Pending Check' | 'Data Found' | 'No Data Found' | 'Unable to Determine';
  dueDate: string;
  slaImpact?: string;
  dispatchedAt?: string;
  completedAt?: string;
  confirmationNote?: string;
  evidenceRef?: string;
  // Dedicated Redaction Review
  redactionReview?: RedactionReviewState;
}

export interface DutroValidationState {
  isValidated: boolean;
  validationStatus: 'READY FOR VALIDATION' | 'READY FOR CLOSURE' | 'ACTION REQUIRED';
  validatedBy: string;
  validatedAt?: string;
  checks: {
    tasksCompleted: boolean;
    systemsChecked: boolean;
    dataFoundRecorded: boolean;
    redactionReviewCompleted: boolean;
    evidenceAdded?: boolean;
    slaCompliant: boolean;
    internalReviewCompleted: boolean;
  };
  recommendationText: string;
  canBeClosed: boolean;
}

export interface DutroReviewState {
  isReviewed: boolean;
  reviewedBy: string;
  reviewedAt?: string;
  checkpoints: {
    tasksCompleted: boolean;
    redactionVerified: boolean;
    slaCompliant: boolean;
  };
  notes: string;
}

export interface DutroRecommendationState {
  isFinalized: boolean;
  recommendedBy: string;
  recommendedAt?: string;
  recommendationText: string;
  canBeClosed: boolean;
}

export interface BankClosureState {
  isDelivered: boolean;
  deliveredBy?: string;
  deliveredAt?: string;
  deliveryChannel: string;
  customerReceiptId?: string;
  closureNotes?: string;
}

export interface IdentityVerificationRecord {
  status: VerificationStatus;
  method: VerificationMethod;
  verifiedAt?: string;
  referenceToken?: string;
  confidenceScore?: number;
  notes?: string;
  verifiedBy?: string;
  identitySource?: string;
}

export interface BusinessProcess {
  id: string;
  name: string;
  department: string;
  owner: string;
  ownerEmail?: string;
  source: string;
  purpose: string;
  legalBasis: string;
  retentionPeriod: string;
  securityTier?: string;
  dataClassification?: string;
  dataSummary: string;
  dataFound: string[];
  taskId: string;
  taskStatus: 'Completed' | 'Waiting for client action' | 'In Progress' | 'Pending';
}

export interface PrivacyRequest {
  id: string; // 'DSR-2001'
  personName: string; // 'Rohan Mehta'
  email: string;
  phone: string;
  accountNumber: string;
  accountTier: string;
  type: RequestType | string;
  role: string;
  clientEntity: string;
  channel: IntakeChannel | string;
  priority?: PriorityLevel;
  status: RequestStatus;
  currentStage?: 
    | 'Request Received'
    | 'Identity Verification'
    | 'Data Discovery'
    | 'Client Tasks'
    | 'Data Retrieval'
    | 'Redaction Review'
    | 'Validation'
    | 'Internal Review'
    | 'Approval'
    | 'Ready for Closure'
    | 'Delivery'
    | 'Closed'
    | 'Response Delivered'
    | 'DSR History'
    | 'Grievance';
  assignedTeam?: string;
  assignedOwner?: string;
  assignedConsultant?: string;
  customerId?: string;
  customerDescription?: string;
  customerAttachment?: string;
  receivedDate: string;
  dueDate: string;
  dueText: string;
  customerSince: string;
  
  // Real-time SLA Tracking
  slaStartTimestamp: string;
  slaDeadlineTimestamp: string;
  slaDaysRemaining: number;
  statutoryBasis: string;
  lastUpdated?: string;

  // Identity Verification
  verificationStatus: VerificationStatus | string;
  verificationMethod: VerificationMethod | string;
  verificationToken?: string;
  verificationDetails?: IdentityVerificationRecord;
  webhookId?: string;

  // Data Map vs Basic Location Check
  dataDiscoveryMode?: DataDiscoveryMode;
  basicLocationChecks?: BasicLocationCheckItem[];

  // Tasks & Validation
  auditTrail: AuditEvent[];
  dutroValidation?: DutroValidationState;
  dutroReview?: DutroReviewState;
  dutroRecommendation?: DutroRecommendationState;
  bankClosure?: BankClosureState;

  // Linked Grievance if raised
  linkedGrievanceId?: string;
  grievanceStatus?: string;
}

export type GrievanceStage = 
  | 'Grievance Raised'
  | 'Acknowledged'
  | 'Level 1 Review'
  | 'Level 1 — Internal Review'
  | 'Decision / Response'
  | 'Senior Review'
  | 'Level 2 — Escalation'
  | 'Senior Privacy Review'
  | 'Final Review'
  | 'Final Internal Review'
  | 'Resolved'
  | 'Closed';

export type GrievanceStatus = 
  | 'Grievance Raised'
  | 'Acknowledged'
  | 'Under Level 1 Review'
  | 'Escalated'
  | 'Under Level 2 Review'
  | 'Under Senior Review'
  | 'Final Review'
  | 'Resolved'
  | 'Closed';

export interface GrievanceRecord {
  id: string; // 'GRV-1001'
  linkedDsrId: string; // 'DSR-2001'
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  originalRequestType: string;
  originalResponseDate: string;
  originalResponseSummary?: string;
  customerComplaint?: string;
  grievanceReason: string;
  originalScopeSummary: string;
  whatWasProvidedSummary: string;
  dateRaised: string;
  stage: GrievanceStage;
  status: GrievanceStatus;
  assignedReviewer: string;
  assignedReviewerRole: string;
  
  // Independent Real-Time Grievance SLA
  slaStartTimestamp: string;
  slaDeadlineTimestamp: string;
  
  internalNotes?: string;
  resolutionSummary?: string;
  closureDate?: string;
  auditTrail: AuditEvent[];
}

export type WorkspaceStep = 
  | 'verification'
  | 'discovery' 
  | 'tasks'
  | 'collect' 
  | 'redaction' 
  | 'validation'
  | 'approval' 
  | 'delivery'
  | 'history'
  | 'grievance'
  | 'request' // backward compat
  | 'review'  // backward compat
  | 'send';   // backward compat

export type DSRWorkspaceFilter = 
  | 'all'
  | 'overview'
  | 'inbox'
  | 'my-tasks'
  | 'pending-verification'
  | 'pending-client-action'
  | 'completed'
  | 'grievances'
  | 'history';

export type NotificationTriggerStage = 
  | 'dsr-intake-received'
  | 'dsr-output-delivered'
  | 'grievance-initiated'
  | 'grievance-closed-initial-review'
  | 'grievance-closed-senior-review'
  | 'grievance-closed-final-review';

export interface CustomerNotification {
  id: string;
  timestamp: string;
  recipientEmail: string;
  recipientName: string;
  triggerStage: NotificationTriggerStage;
  triggerLabel: string;
  subject: string;
  previewText: string;
  bodyText: string;
  relatedId: string; // e.g. DSR-2001 or GRV-1005
  read: boolean;
  downloadAction?: {
    label: string;
    actionType: 'dsr-package' | 'supplementary-package' | 'certificate';
  };
}
