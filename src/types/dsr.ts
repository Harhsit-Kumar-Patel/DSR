export type RequestType = 'Access';

export type Persona = 'Customer' | 'Employee' | 'Candidate' | 'Vendor/Partner' | 'Visitor';

export type RequestChannel = 'Customer Portal' | 'Email' | 'API' | 'Website' | 'Support System';

export type DSRStage = 
  | 'Received' 
  | 'Verified' 
  | 'Discovery' 
  | 'Collection' 
  | 'Review' 
  | 'Approval' 
  | 'Response' 
  | 'Closed';

export type DSRStatus = 
  | 'In Progress' 
  | 'Awaiting Verification' 
  | 'Ready to Send' 
  | 'Response Sent' 
  | 'At Risk' 
  | 'Completed' 
  | 'Needs Client Approval';

export type VerificationStatus = 'Verified' | 'Pending' | 'Failed';

export type DataTreatment = 'DISCLOSE' | 'REDACT' | 'EXCLUDE' | 'HUMAN_REVIEW';

export interface MatchedProcess {
  id: string;
  name: string;
  department: string;
  departmentOwner: string;
  sourceSystem: string;
  legalBasis: string;
  retentionPeriod: string;
  thirdPartyTransfer: string;
  dataElements: string[];
  purpose: string;
  matchConfidence: number;
}

export interface DepartmentTask {
  id: string;
  dsrId: string;
  title: string;
  processName: string;
  department: string;
  owner: string;
  ownerEmail: string;
  status: 'Completed' | 'Pending' | 'In Progress' | 'Overdue';
  dueDate: string;
  completedDate?: string;
  dataRequired: string[];
  instructions: string;
  evidenceId?: string;
  evidenceFiles?: string[];
  submittedNotes?: string;
}

export interface CollectedDataRecord {
  id: string;
  dsrId: string;
  processId: string;
  processName: string;
  department: string;
  sourceSystem: string;
  category: string;
  fieldName: string;
  value: string;
  evidenceId: string;
  proposedTreatment: DataTreatment;
  decisionReason: string;
  policyReference: string;
  relationship: 'Requester' | 'Third-party individual' | 'Internal privileged' | 'Mixed entity';
  isHumanReviewed: boolean;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface PDIConflict {
  id: string;
  dsrId: string;
  title: string;
  description: string;
  pdiBaseline: string;
  evidenceDiscovered: string;
  detectedInTask: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Detected' | 'Gap Created' | 'Resolved';
  createdGapId?: string;
  detectedAt: string;
}

export interface GapRecord {
  id: string;
  title: string;
  sourceDsrId: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  department: string;
  identifiedDate: string;
  description: string;
  remediationPlan: string;
  assignedOwner: string;
}

export interface ActivityEvent {
  id: string;
  dsrId: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  type: 'system' | 'user' | 'verification' | 'task' | 'review' | 'conflict' | 'response';
}

export interface DSRCase {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  persona: Persona;
  requestType: RequestType;
  channel: RequestChannel;
  legalEntity: string;
  submittedDate: string;
  currentStage: DSRStage;
  owner: string;
  ownerRole: string;
  slaDaysRemaining: number;
  status: DSRStatus;
  preferredResponse: 'Email' | 'Secure Portal' | 'Physical Mail';
  verification: {
    status: VerificationStatus;
    method: string;
    verifiedAt?: string;
    confidenceScore: number;
    verificationNotes: string;
  };
  summary: string;
  matchedProcesses: MatchedProcess[];
  tasks: DepartmentTask[];
  collectedData: CollectedDataRecord[];
  pdiConflict?: PDIConflict;
  approvalStatus: 'Draft' | 'Under Review' | 'Approved' | 'Sent';
  responseSentDate?: string;
  activityTimeline: ActivityEvent[];
}

export interface Grievance {
  id: string;
  relatedDsrId: string;
  requesterName: string;
  requesterEmail: string;
  issue: string;
  stage: 'Stage 1 — Internal Review' | 'Stage 2 — Escalation' | 'Stage 3 — Resolution / Exhaustion';
  owner: string;
  deadline: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
  createdDate: string;
  originalRequestType: string;
  whatWasRequested: string;
  whatWasProvided: string;
  requesterComplaint: string;
  internalReviewNotes: string;
  resolutionSummary?: string;
}
