import { 
  PrivacyRequest, 
  ClientTask, 
  BusinessProcess, 
  ClientEntity, 
  CustomerPrincipal, 
  AuditEvent,
  GrievanceRecord,
  BasicLocationCheckItem,
  RedactionReviewState,
  PlatformUser,
  CustomerAccount,
  ConsultantAccount,
  CustomerNotification
} from '../types';
import { generateDeadlineDate } from '../utils/slaCalculator';

export const DEFAULT_CUSTOMER_ACCOUNT: CustomerAccount = {
  id: 'CUS-1001',
  name: 'Rohan Mehta',
  email: 'rohan.mehta@example.com',
  phone: '+91 90000 12345',
  accountNumber: 'ACC-7842109812',
  customerType: 'Registered User',
  isVerified: true,
  verificationMethod: 'OTP',
  verifiedAt: '28 Sep 2026, 09:14 IST',
  securityQuestion: 'What was the name of your first school?',
  securityAnswer: 'St. Xavier High School'
};

export const INITIAL_REGISTERED_CUSTOMERS: CustomerAccount[] = [
  DEFAULT_CUSTOMER_ACCOUNT
];

export const DEFAULT_CONSULTANT_ACCOUNT: ConsultantAccount = {
  id: 'DUTRO-CON-01',
  name: 'Harshit Patel',
  email: 'harshit.patel@dutro.example',
  phone: '+91 98200 11223',
  organizationCode: 'DUTRO-GLOBAL',
  roleTitle: 'Privacy Operations Consultant',
  isVerified: true,
  verifiedAt: '01 Sep 2026, 08:30 IST'
};

export const DEMO_USERS: PlatformUser[] = [
  {
    id: 'user-dutro-1',
    name: 'Harshit Patel',
    role: 'Dutro Consultant',
    roleTitle: 'Lead Privacy Operations Consultant',
    organization: 'Dutro Privacy Advisory',
    email: 'harshit.patel@dutro.example',
    avatarInitials: 'HP',
    department: 'Dutro Client Engagement'
  },
  {
    id: 'user-dutro-2',
    name: 'Pooja Rao',
    role: 'Dutro Consultant',
    roleTitle: 'Senior Privacy Consultant',
    organization: 'Dutro Privacy Advisory',
    email: 'pooja.rao@dutro.example',
    avatarInitials: 'PR',
    department: 'Dutro Advisory Services'
  },
  {
    id: 'user-1',
    name: 'Ananya Mehta',
    role: 'Privacy Officer',
    roleTitle: 'Privacy Officer & DPO',
    organization: 'Client Organization',
    email: 'ananya.mehta@client.example',
    avatarInitials: 'AM',
    department: 'Privacy & Compliance'
  },
  {
    id: 'user-2',
    name: 'Rahul Sharma',
    role: 'Operations Team',
    roleTitle: 'Customer Support Lead',
    organization: 'Client Organization',
    email: 'rahul.sharma@client.example',
    avatarInitials: 'RS',
    department: 'Customer Support'
  },
  {
    id: 'user-3',
    name: 'Meera Singh',
    role: 'Grievance Officer',
    roleTitle: 'Statutory Grievance Officer',
    organization: 'Client Organization',
    email: 'meera.singh@client.example',
    avatarInitials: 'MS',
    department: 'Grievance Redressal Office'
  },
  {
    id: 'user-5',
    name: 'Vikram Shah',
    role: 'Finance Specialist',
    roleTitle: 'Finance Operations Lead',
    organization: 'Client Organization',
    email: 'vikram.shah@client.example',
    avatarInitials: 'VS',
    department: 'Finance Operations'
  }
];

export const MASTER_CLIENT: ClientEntity = {
  id: 'CLIENT-001',
  name: 'Client Organization',
  country: 'India',
  privacyOfficer: 'Ananya Mehta',
  privacyOfficerEmail: 'privacy-officer@client.example'
};

export const MASTER_CUSTOMER: CustomerPrincipal = {
  id: 'CUS-1001',
  name: 'Rohan Mehta',
  email: 'rohan.mehta@example.com',
  phone: '+91 90000 12345',
  customerType: 'Registered User',
  accountNumber: 'ACC-7842109812'
};

// Default standard Redaction Checklist builder
export const createDefaultRedactionReview = (
  taskProcess: string, 
  hasIssues: boolean = false, 
  statusOverride?: 'NO REDACTION REQUIRED' | 'REDACTION REQUIRED' | 'REVIEW REQUIRED'
): RedactionReviewState => {
  if (taskProcess === 'Customer Support' || taskProcess === 'Customer Support Transcripts') {
    return {
      status: statusOverride || 'REVIEW REQUIRED',
      guidanceText: 'Potential third-party agent names and internal escalations detected in support transcripts. Ensure customer personal data is disclosed while redacting internal employee personal phone numbers.',
      recommendedAction: 'Review third-party and internal employee information before disclosure.',
      isReviewed: true,
      reviewerName: 'Neha Kapoor (Support Operations Lead)',
      reviewedAt: '28 Sep 2026, 14:10 IST',
      finalDecision: 'Redaction Required',
      checklist: [
        { id: 'chk-1', label: "Requester's own personal data", description: 'Full name, email, registered mobile, and customer ID.', detected: true, decision: 'No Issue' },
        { id: 'chk-2', label: 'Third-party personal data', description: 'Names or references to family members or external contacts.', detected: false, decision: 'Not Applicable' },
        { id: 'chk-3', label: 'Employee personal data', description: 'Internal support executive direct phone numbers & shift IDs.', detected: true, decision: 'Redact' },
        { id: 'chk-4', label: 'Vendor / supplier personal data', description: 'Contact details of external SMS gateway provider representatives.', detected: false, decision: 'Not Applicable' },
        { id: 'chk-5', label: "Other customers' personal data", description: 'Accidental cross-account mentions in shared tickets.', detected: false, decision: 'No Issue' },
        { id: 'chk-6', label: 'Sensitive personal information (SPI)', description: 'Biometrics, passwords, security PINs, or confidential credentials.', detected: false, decision: 'No Issue' },
        { id: 'chk-7', label: 'Confidential / internal information', description: 'Internal operational scorecards and risk ratings.', detected: true, decision: 'Review Required' },
        { id: 'chk-8', label: 'Security-related information', description: 'Server IPs, encryption key IDs, or API tokens.', detected: false, decision: 'Not Applicable' },
        { id: 'chk-9', label: 'Legal / privileged information', description: 'Communications with client legal counsel.', detected: false, decision: 'Not Applicable' },
      ]
    };
  }

  if (taskProcess === 'Billing & Payments') {
    return {
      status: statusOverride || 'NO REDACTION REQUIRED',
      guidanceText: 'All billing, fee invoices, and payment statements relate directly to the verified requester. No third-party data detected.',
      recommendedAction: 'Approve fee statements and transaction histories for customer disclosure package.',
      isReviewed: true,
      reviewerName: 'Vikram Shah (Finance Operations)',
      checklist: [
        { id: 'chk-1', label: "Requester's own personal data", description: 'Account numbers, billing address, transaction timestamps.', detected: true, decision: 'No Issue' },
        { id: 'chk-2', label: 'Third-party personal data', description: 'Counterparty names in transaction records.', detected: false, decision: 'No Issue' },
        { id: 'chk-3', label: 'Employee personal data', description: 'Internal billing processor employee IDs.', detected: false, decision: 'Not Applicable' },
        { id: 'chk-4', label: 'Vendor / supplier personal data', description: 'Payment gateway vendor contacts.', detected: false, decision: 'Not Applicable' },
        { id: 'chk-5', label: "Other customers' personal data", description: 'Cross-account reference numbers.', detected: false, decision: 'No Issue' },
        { id: 'chk-6', label: 'Sensitive personal information (SPI)', description: 'Raw authentication tokens or CVV numbers.', detected: false, decision: 'No Issue' },
        { id: 'chk-7', label: 'Confidential / internal information', description: 'Internal fee margin formulas.', detected: false, decision: 'Not Applicable' },
        { id: 'chk-8', label: 'Security-related information', description: 'Internal system routing keys.', detected: false, decision: 'Not Applicable' },
        { id: 'chk-9', label: 'Legal / privileged information', description: 'Internal audit investigation notes.', detected: false, decision: 'Not Applicable' },
      ]
    };
  }

  return {
    status: hasIssues ? 'REVIEW REQUIRED' : 'NO REDACTION REQUIRED',
    guidanceText: 'All information identified in this task relates to the verified requester and no additional disclosure restriction has been identified.',
    recommendedAction: 'Approve records for customer response package.',
    isReviewed: true,
    reviewerName: 'Rahul Verma (Operations Specialist)',
    reviewedAt: '28 Sep 2026, 11:25 IST',
    finalDecision: 'Approve Disclosure',
    checklist: [
      { id: 'chk-1', label: "Requester's own personal data", description: 'Full name, email, registered mobile, and customer profile.', detected: true, decision: 'No Issue' },
      { id: 'chk-2', label: 'Third-party personal data', description: 'Personal info belonging to non-requester third parties.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-3', label: 'Employee personal data', description: 'Internal employee contacts or performance evaluations.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-4', label: 'Vendor / supplier personal data', description: 'Vendor personal identifiers.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-5', label: "Other customers' personal data", description: 'Cross-customer data mixing.', detected: false, decision: 'No Issue' },
      { id: 'chk-6', label: 'Sensitive personal information (SPI)', description: 'Biometrics, passwords, security credentials.', detected: false, decision: 'No Issue' },
      { id: 'chk-7', label: 'Confidential / internal information', description: 'Internal pricing algorithms or notes.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-8', label: 'Security-related information', description: 'Security architecture or firewall rules.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-9', label: 'Legal / privileged information', description: 'Privileged legal counsel advice.', detected: false, decision: 'Not Applicable' },
    ]
  };
};

export const MASTER_AUDIT_TRAIL: AuditEvent[] = [
  {
    timestamp: '28 Sep 2026, 09:14:22 IST',
    actor: 'Customer (Rohan Mehta)',
    action: 'Request Submitted',
    details: 'Submitted Right of Access request via Client Customer Portal'
  },
  {
    timestamp: '28 Sep 2026, 09:14:55 IST',
    actor: 'Client Auth Gateway',
    action: 'Identity Verified',
    details: 'Authenticated customer portal session verified with 2FA token (Token: AUTH-PORTAL-SSO-78421-PASS)'
  },
  {
    timestamp: '28 Sep 2026, 09:15:20 IST',
    actor: 'Dutro Orchestration Platform',
    action: 'DSR Initialized & Real-Time SLA Clock Started',
    details: 'Created DSR-2001 with statutory 30 calendar days SLA (Deadline: 28 Oct 2026, 23:59 IST)'
  },
  {
    timestamp: '28 Sep 2026, 09:16:00 IST',
    actor: 'Dutro Privacy Engine',
    action: 'Data Discovery Scan Completed',
    details: 'Mapped request against Client Organization systems; identified relevant business processes & basic location checks'
  },
  {
    timestamp: '28 Sep 2026, 09:17:00 IST',
    actor: 'Dutro Orchestration Platform',
    action: 'Client Data Retrieval Tasks Dispatched',
    details: 'Created and dispatched data retrieval tasks to Client Organization teams (TASK-2001 to TASK-2003)'
  },
  {
    timestamp: '28 Sep 2026, 11:30:00 IST',
    actor: 'Rahul Verma (Operations)',
    action: 'Task Completed & Redaction Reviewed',
    details: 'TASK-2001 completed. Data retrieved from Client CRM System. Redaction review: NO REDACTION REQUIRED.'
  },
  {
    timestamp: '28 Sep 2026, 14:15:00 IST',
    actor: 'Neha Kapoor (Customer Support)',
    action: 'Task Completed & Redaction Marked',
    details: 'TASK-2002 completed. Data retrieved from Support Desk. Internal employee phone numbers redacted.'
  },
  {
    timestamp: '28 Sep 2026, 14:25:00 IST',
    actor: 'Vikram Shah (Finance)',
    action: 'Task Completed & Confirmed',
    details: 'TASK-2003 completed. Billing and fee statements retrieved from Client Billing System.'
  },
  {
    timestamp: '28 Sep 2026, 14:30:00 IST',
    actor: 'Ananya Mehta (Privacy Officer)',
    action: 'Disclosure Package Delivered & Closed',
    details: 'Verified personal data package delivered to customer portal. Triggered Stage 2 automated notification.'
  },
  {
    timestamp: '6 Oct 2026, 10:58:00 IST',
    actor: 'Customer (Rohan Mehta)',
    action: 'Formal Grievance Registered (GRV-1005)',
    details: 'Customer disputed omitted Q1-Q2 2026 transaction ledger records. Triggered Stage 3 automated notification.'
  }
];

export const MASTER_BUSINESS_PROCESSES: BusinessProcess[] = [
  {
    id: 'proc-1',
    name: 'Customer Profile & CRM',
    department: 'Operations',
    owner: 'Rahul Verma',
    ownerEmail: 'rahul.verma@client.example',
    source: 'Client CRM System',
    purpose: 'Customer identity verification, account provisioning, and customer profile management',
    legalBasis: 'Performance of Contract (DPDP Sec. 4 / GDPR Art. 6(1)(b))',
    retentionPeriod: '7 Years post account closure',
    securityTier: 'Tier 1 (Restricted Enterprise Data)',
    dataClassification: 'Confidential / PII',
    dataSummary: 'Customer profile, contact details, account information, verification records',
    dataFound: ['Customer profile', 'Contact details', 'Account information', 'Profile documents'],
    taskId: 'TASK-2001',
    taskStatus: 'Completed'
  },
  {
    id: 'proc-2',
    name: 'Customer Support',
    department: 'Customer Support',
    owner: 'Neha Kapoor',
    ownerEmail: 'neha.kapoor@client.example',
    source: 'Client Support Platform',
    purpose: 'Customer issue resolution, technical assistance, support ticketing, and communication records',
    legalBasis: 'Legitimate Interests (DPDP Sec. 4 / GDPR Art. 6(1)(f))',
    retentionPeriod: '3 Years post ticket resolution',
    securityTier: 'Tier 2 (Internal Operations)',
    dataClassification: 'Internal / PII',
    dataSummary: 'Support ticket history, customer inquiries, communication logs, resolution transcripts',
    dataFound: ['Support requests', 'Customer communications', 'Support history'],
    taskId: 'TASK-2002',
    taskStatus: 'Completed'
  },
  {
    id: 'proc-3',
    name: 'Billing & Payments',
    department: 'Finance Operations',
    owner: 'Vikram Shah',
    ownerEmail: 'vikram.shah@client.example',
    source: 'Client Billing System',
    purpose: 'Account fee billing, payment transaction processing, invoice generation, and statutory tax accounting',
    legalBasis: 'Legal Obligation (Statutory & Tax Compliance)',
    retentionPeriod: '10 Years (Statutory Requirement)',
    securityTier: 'Tier 1 (Financial Data)',
    dataClassification: 'Confidential / Financial',
    dataSummary: 'Fee invoices, payment history, transaction records, tax invoices',
    dataFound: ['Billing records', 'Payment history', 'Invoice records'],
    taskId: 'TASK-2003',
    taskStatus: 'Completed'
  }
];

export const INITIAL_BASIC_LOCATION_CHECKS: BasicLocationCheckItem[] = [
  {
    id: 'loc-1',
    systemName: 'Customer Relationship Management (CRM)',
    department: 'Customer Support',
    owner: 'Neha Kapoor',
    ownerEmail: 'neha.kapoor@client.example',
    status: 'Completed — Data Found',
    dataElementsFound: ['Contact profile', 'Interaction history', 'Support tickets'],
    checkedAt: '28 Sep 2026, 11:15 IST',
    notes: 'Customer records confirmed in CRM instance. Support tickets located.'
  },
  {
    id: 'loc-2',
    systemName: 'Core Enterprise Database',
    department: 'Operations',
    owner: 'Rahul Verma',
    ownerEmail: 'rahul.verma@client.example',
    status: 'Completed — Data Found',
    dataElementsFound: ['Account record', 'Service provisioning', 'Customer dossier'],
    checkedAt: '28 Sep 2026, 11:30 IST',
    notes: 'Active customer record identified in core enterprise database.'
  },
  {
    id: 'loc-3',
    systemName: 'Billing & Transaction Ledger',
    department: 'Finance Operations',
    owner: 'Vikram Shah',
    ownerEmail: 'vikram.shah@client.example',
    status: 'Completed — Data Found',
    dataElementsFound: ['Monthly fee invoices', 'Payment transaction records'],
    checkedAt: '28 Sep 2026, 14:25 IST',
    notes: 'Finance team extracted fee statements.'
  }
];

// Strictly 2 Test Cases Tasks (Showcase Demo DSR-2001 & Interactive Testing DSR-2002)
export const INITIAL_CLIENT_TASKS: ClientTask[] = [
  // 1. DSR-2001 (Rohan Mehta - Showcase Demo Case)
  {
    id: 'TASK-2001',
    dsrId: 'DSR-2001',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@example.com',
    processName: 'Customer Profile & CRM',
    department: 'Operations',
    assignedTeam: 'Operations',
    assignedPerson: 'Rahul Verma',
    assignedRole: 'Operations Specialist',
    dataRequested: ['Customer profile', 'Contact details', 'Account information', 'Profile verification'],
    sourceSystem: 'Client CRM System',
    status: 'Completed',
    dataFoundStatus: 'Data Found',
    dueDate: '30 September 2026',
    slaImpact: 'High - Critical Path',
    dispatchedAt: '28 September 2026, 09:17 IST',
    completedAt: '28 September 2026, 11:30 IST',
    confirmationNote: 'Requested customer profile and verification records retrieved and confirmed by Operations.',
    evidenceRef: 'EV-2026-CRM-78421',
    redactionReview: createDefaultRedactionReview('Customer Profile & CRM', false, 'NO REDACTION REQUIRED')
  },
  {
    id: 'TASK-2002',
    dsrId: 'DSR-2001',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@example.com',
    processName: 'Customer Support',
    department: 'Customer Support',
    assignedTeam: 'Customer Support',
    assignedPerson: 'Neha Kapoor',
    assignedRole: 'Support Team Lead',
    dataRequested: ['Support requests', 'Customer communications', 'Support history'],
    sourceSystem: 'Client Support Platform',
    status: 'Completed',
    dataFoundStatus: 'Data Found',
    dueDate: '30 September 2026',
    slaImpact: 'Medium',
    dispatchedAt: '28 September 2026, 09:17 IST',
    completedAt: '28 September 2026, 14:15 IST',
    confirmationNote: 'Requested support records retrieved. Third-party staff contact details reviewed and redacted.',
    evidenceRef: 'EV-2026-SUPP-98214',
    redactionReview: createDefaultRedactionReview('Customer Support', true, 'REVIEW REQUIRED')
  },
  {
    id: 'TASK-2003',
    dsrId: 'DSR-2001',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@example.com',
    processName: 'Billing & Payments',
    department: 'Finance Operations',
    assignedTeam: 'Finance Operations',
    assignedPerson: 'Vikram Shah',
    assignedRole: 'Finance Specialist',
    dataRequested: ['Billing records', 'Payment history', 'Invoice records'],
    sourceSystem: 'Client Billing System',
    status: 'Completed',
    dataFoundStatus: 'Data Found',
    dueDate: '1 October 2026',
    slaImpact: 'High - Statutory Tax Record',
    dispatchedAt: '28 September 2026, 09:17 IST',
    completedAt: '28 September 2026, 14:25 IST',
    confirmationNote: 'Fee statements and transaction receipts retrieved and verified.',
    evidenceRef: 'EV-2026-BILL-44129',
    redactionReview: createDefaultRedactionReview('Billing & Payments', false, 'NO REDACTION REQUIRED')
  },

];

// Strictly Rohan Mehta Case (DSR-2001)
export const INITIAL_REQUESTS: PrivacyRequest[] = [
  // Showcase Demo Case (Rohan Mehta)
  {
    id: 'DSR-2001',
    personName: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91 90000 12345',
    accountNumber: 'ACC-7842109812',
    accountTier: 'Registered User',
    type: 'Right of Access',
    role: 'Active Customer',
    clientEntity: 'Client Organization',
    channel: 'Client Customer Portal',
    priority: 'High',
    status: 'Closed',
    currentStage: 'Closed',
    assignedTeam: 'Privacy & Compliance Office',
    assignedOwner: 'Ananya Mehta (Privacy Officer)',
    assignedConsultant: 'Harshit Patel',
    customerId: 'CUS-1001',
    customerDescription: 'I would like to receive a copy of the personal data held about me, including my customer profile, support ticket transcripts, and fee payment invoices.',
    receivedDate: '28 Sep 2026, 09:14 IST',
    dueDate: '28 Oct 2026, 23:59 IST',
    dueText: '30 calendar days SLA',
    customerSince: 'March 2024',
    slaStartTimestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    slaDeadlineTimestamp: generateDeadlineDate(22),
    slaDaysRemaining: 22,
    statutoryBasis: 'DPDP Act 2023 Sec. 11 (Right to Access) / GDPR Art. 15',
    lastUpdated: '06 Oct 2026, 10:58 IST',
    verificationStatus: 'Verified',
    verificationMethod: 'Authenticated customer portal',
    verificationToken: 'AUTH-PORTAL-SSO-78421-PASS',
    linkedGrievanceId: 'GRV-1005',
    verificationDetails: {
      status: 'Verified',
      method: 'Authenticated customer portal',
      verifiedAt: '28 Sep 2026, 09:14 IST',
      referenceToken: 'AUTH-PORTAL-SSO-78421-PASS',
      confidenceScore: 100,
      notes: 'Customer logged in with biometric 2FA session on client customer portal.'
    },
    webhookId: 'WH-20260928-78421-INGEST',
    dataDiscoveryMode: 'ropa',
    basicLocationChecks: INITIAL_BASIC_LOCATION_CHECKS,
    auditTrail: MASTER_AUDIT_TRAIL,
    dutroValidation: {
      isValidated: true,
      validationStatus: 'READY FOR CLOSURE',
      validatedBy: 'Dutro Privacy Engine & Consultant',
      validatedAt: '28 Sep 2026, 14:28 IST',
      checks: {
        tasksCompleted: true,
        systemsChecked: true,
        dataFoundRecorded: true,
        redactionReviewCompleted: true,
        slaCompliant: true,
        internalReviewCompleted: true
      },
      recommendationText: 'All department retrieval tasks verified and privacy safeguards satisfied. Cleared for closure.',
      canBeClosed: true
    },
    dutroReview: {
      isReviewed: true,
      reviewedBy: 'Dutro Privacy Consultant (Harshit Patel)',
      reviewedAt: '28 Sep 2026, 14:29 IST',
      checkpoints: {
        tasksCompleted: true,
        redactionVerified: true,
        slaCompliant: true
      },
      notes: 'All tasks completed and redacted properly. Statutory package approved for customer delivery.'
    },
    dutroRecommendation: {
      isFinalized: true,
      recommendedBy: 'Dutro Privacy Advisory Team',
      recommendedAt: '28 Sep 2026, 14:29 IST',
      recommendationText: 'According to Dutro Privacy Consultants, all data retrieval tasks and third-party privacy safeguards have been verified. This case has been delivered by Client Organization.',
      canBeClosed: true
    },
    bankClosure: {
      isDelivered: true,
      deliveredBy: 'Ananya Mehta (Privacy Officer)',
      deliveredAt: '28 Sep 2026, 14:30 IST',
      deliveryChannel: 'Client Customer Portal',
      customerReceiptId: 'REC-2026-ROHAN-78421',
      closureNotes: 'Full verified personal data disclosure package delivered to customer portal session.'
    }
  }
];

// Strictly Grievance for Showcase Demo Case (GRV-1005 linked to DSR-2001)
export const INITIAL_GRIEVANCES: GrievanceRecord[] = [
  {
    id: 'GRV-1005',
    linkedDsrId: 'DSR-2001',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@example.com',
    customerPhone: '+91 90000 12345',
    originalRequestType: 'Right of Access',
    originalResponseDate: '28 Sep 2026',
    originalResponseSummary: 'Customer profile, support tickets, and fee payment invoices delivered.',
    grievanceReason: 'Missing Q1-Q2 2026 transaction ledger records from the delivered disclosure package.',
    originalScopeSummary: 'Full Right of Access request across all accounts, transactions, and support interactions.',
    whatWasProvidedSummary: 'Customer profile data and support history provided. Archival Q1-Q2 2026 transaction ledger was omitted.',
    dateRaised: '6 Oct 2026, 10:58 IST',
    stage: 'Level 1 — Internal Review',
    status: 'Under Level 1 Review',
    assignedReviewer: 'Meera Singh',
    assignedReviewerRole: 'Statutory Grievance Redressal Officer',
    slaStartTimestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    slaDeadlineTimestamp: generateDeadlineDate(14), // 14 days remaining
    internalNotes: 'Contacted Finance Operations. Vikram Shah is extracting the legacy Q1-Q2 transaction archive to prepare supplementary disclosure.',
    auditTrail: [
      {
        timestamp: '6 Oct 2026, 10:58:00 IST',
        actor: 'Customer (Rohan Mehta)',
        action: 'Formal Grievance Registered',
        details: 'Customer lodged formal grievance stating Q1-Q2 2026 transaction statements were omitted.'
      },
      {
        timestamp: '6 Oct 2026, 10:58:15 IST',
        actor: 'Dutro Automated Notification Engine',
        action: 'Stage 3 Automated Acknowledgment Dispatched',
        details: 'Dispatched statutory grievance registration notice & 15-day clock notification to rohan.mehta@example.com.'
      },
      {
        timestamp: '6 Oct 2026, 11:15:00 IST',
        actor: 'Meera Singh (Grievance Officer)',
        action: 'Level 1 Review Commenced',
        details: 'Assigned investigation to Vikram Shah (Finance Operations) for archival ledger retrieval.'
      }
    ]
  }
];

// Matched processes
export const INITIAL_MATCHED_PROCESSES: any[] = [
  {
    id: 'proc-1',
    name: 'Customer Profile & CRM',
    department: 'Operations',
    departmentOwner: 'Rahul Verma (Operations Lead)',
    sourceSystem: 'Client CRM System',
    legalBasis: 'Performance of Contract (DPDP Sec. 4 / GDPR Art. 6(1)(b))',
    retentionPeriod: '7 Years post account closure',
    thirdPartyTransfer: 'None (Secure Cloud Region)',
    dataElements: ['Customer profile', 'Contact details', 'Account information', 'Profile documents'],
    purpose: 'Customer identity verification, account provisioning, and customer profile management',
    matchConfidence: 98,
  },
  {
    id: 'proc-2',
    name: 'Customer Support',
    department: 'Customer Support',
    departmentOwner: 'Neha Kapoor (Support Team Lead)',
    sourceSystem: 'Client Support Platform',
    legalBasis: 'Legitimate Interests (DPDP Sec. 4 / GDPR Art. 6(1)(f))',
    retentionPeriod: '3 Years post ticket resolution',
    thirdPartyTransfer: 'None',
    dataElements: ['Support requests', 'Customer communications', 'Support history'],
    purpose: 'Customer issue resolution, technical assistance, support ticketing, and communication records',
    matchConfidence: 95,
  },
  {
    id: 'proc-3',
    name: 'Billing & Payments',
    department: 'Finance Operations',
    departmentOwner: 'Vikram Shah (Finance Operations)',
    sourceSystem: 'Client Billing System',
    legalBasis: 'Legal Obligation (Statutory & Tax Compliance)',
    retentionPeriod: '10 Years (Statutory Requirement)',
    thirdPartyTransfer: 'None (Secure Internal Ledger)',
    dataElements: ['Billing records', 'Payment history', 'Invoice records'],
    purpose: 'Account fee billing, payment transaction processing, invoice generation, and statutory tax accounting',
    matchConfidence: 92,
  }
];

export const INITIAL_DSR_CASES: any[] = [];
export const INITIAL_GAPS: any[] = [];

// Automated notifications pre-populated for the 2 test cases
export const INITIAL_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'NOTIF-INIT-3',
    timestamp: '6 Oct 2026, 10:58 IST',
    recipientName: 'Rohan Mehta',
    recipientEmail: 'rohan.mehta@example.com',
    triggerStage: 'grievance-initiated',
    triggerLabel: '3. Grievance Initiated & Registered',
    subject: '[Dutro Redressal] Formal Grievance Registered & 15-Day Clock Started — Ref: GRV-1005',
    previewText: 'Your grievance (GRV-1005) linked to DSR-2001 has been lodged. A dedicated Grievance Officer has been assigned under a 15-day SLA.',
    bodyText: `Dear Rohan Mehta,

This is an automated statutory acknowledgment confirming that your formal Redressal Grievance has been registered under the DPDP Act 2023 Sec. 13 / GDPR.

GRIEVANCE REGISTRATION DETAILS:
• Grievance Reference: GRV-1005
• Linked Access Request: DSR-2001
• Lodgment Timestamp: 6 Oct 2026, 10:58 IST
• Stated Dispute: Missing personal data records in disclosure (Q1-Q2 2026 statements)
• Assigned Reviewer: Meera Singh (Statutory Grievance Redressal Officer)
• Statutory Resolution SLA: 15 Calendar Days

NEXT REDRESSAL STEPS:
1. Initial Level 1 Review compares original request scope against retrieved database extracts.
2. If omission is identified, secondary queries will be executed against client systems.
3. You will receive real-time automated updates at each resolution stage.

You can monitor the live 15-day countdown and resolution milestones on your portal dashboard.

Warm regards,
Statutory Grievance Redressal Office
Dutro Privacy Operations Platform`,
    relatedId: 'GRV-1005',
    read: false
  },
  {
    id: 'NOTIF-INIT-2',
    timestamp: '28 Sep 2026, 14:30 IST',
    recipientName: 'Rohan Mehta',
    recipientEmail: 'rohan.mehta@example.com',
    triggerStage: 'dsr-output-delivered',
    triggerLabel: '2. Disclosure Package Output Delivered',
    subject: '[Dutro Privacy] Your Verified Personal Data Disclosure Package is Ready — Ref: DSR-2001',
    previewText: 'Your personal data disclosure package for DSR-2001 has been verified and securely sent to your registered email (rohan.mehta@example.com).',
    bodyText: `Dear Rohan Mehta,

We are pleased to inform you that your Right of Access request (DSR-2001) has been fulfilled within statutory SLA compliance.

DELIVERY DETAILS:
• Reference ID: DSR-2001
• Completion Date: 28 Sep 2026, 14:30 IST
• Delivery Status: Verified & Delivered to Registered Email
• Recipient Email: rohan.mehta@example.com
• Format: Encrypted Personal Data Archive (.ZIP / .PDF)
• Package Contents: Identity Profile, Financial Records, Customer Interaction Logs, and Formal Disclosure Statement.

EMAIL DELIVERY CONFIRMATION:
The complete personal data disclosure package and statutory compliance certificate have been sent directly to your registered email address (rohan.mehta@example.com).

STATUTORY GRIEVANCE REDRESSAL RIGHTS:
If you believe any records were omitted, inaccurate, or excessively redacted, you have the statutory right under DPDP Act 2023 Sec. 13 to raise a formal grievance directly through the portal within 15 days.

Thank you for exercising your data privacy rights with us.

Warm regards,
Dutro Privacy Operations Office
Client Data Protection Team`,
    relatedId: 'DSR-2001',
    read: true
  },
  {
    id: 'NOTIF-INIT-1',
    timestamp: '20 Sep 2026, 11:24 IST',
    recipientName: 'Rohan Mehta',
    recipientEmail: 'rohan.mehta@example.com',
    triggerStage: 'dsr-intake-received',
    triggerLabel: '1. Request Intake & Identity Verified',
    subject: '[Dutro Privacy] Right of Access Request Received & Verified — Ref: DSR-2001',
    previewText: 'Your Right of Access request (DSR-2001) has been received and verified. The statutory 30-day resolution timeline is now active.',
    bodyText: `Dear Rohan Mehta,

We have received your statutory Right of Access (DSAR) request under the Digital Personal Data Protection Act 2023 (Sec. 11) and General Data Protection Regulation (Art. 15).

REQUEST DETAILS:
• Reference ID: DSR-2001
• Requester: Rohan Mehta (rohan.mehta@example.com)
• Request Type: Right of Access / Personal Data Disclosure
• Submission Timestamp: 20 Sep 2026, 11:24 IST
• Identity Verification: Authenticated & Verified (OTP 2FA)
• Statutory SLA Deadline: 30 Calendar Days

WHAT HAPPENS NEXT:
1. Automated Data Discovery is scanning authorized client repositories (Core Banking, CRM, Customer Support).
2. Data extracts will be compiled and reviewed for third-party confidentiality redactions.
3. You will receive an automated notification once your verified personal data package has been dispatched to your email.

You can track real-time progress by logging into your Data Principal Portal anytime.

Warm regards,
Dutro Privacy Operations Office
Client Data Protection Team`,
    relatedId: 'DSR-2001',
    read: true
  }
];
