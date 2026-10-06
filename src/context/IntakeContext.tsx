import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  IntakeRequest, 
  IntakeChannel, 
  RequestCategory, 
  TargetDepartment, 
  WebformConfig, 
  ChannelSummary,
  UrgencyLevel
} from '../types/intake';
import { 
  INITIAL_INTAKE_REQUESTS, 
  CHANNEL_CONFIGS, 
  DEFAULT_WEBFORM_CONFIG,
  SIMULATION_PRESETS 
} from '../mockData/intakeData';

interface IntakeContextType {
  requests: IntakeRequest[];
  channelConfigs: ChannelSummary[];
  webformConfig: WebformConfig;
  selectedChannelFilter: IntakeChannel | 'all';
  setSelectedChannelFilter: (ch: IntakeChannel | 'all') => void;
  selectedCategoryFilter: RequestCategory | 'all';
  setSelectedCategoryFilter: (cat: RequestCategory | 'all') => void;
  selectedDepartmentFilter: TargetDepartment | 'all';
  setSelectedDepartmentFilter: (dep: TargetDepartment | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  selectedRequest: IntakeRequest | null;
  setSelectedRequest: (req: IntakeRequest | null) => void;

  // Active sub-tab in Intake Hub
  activeTab: 'inbox' | 'webform-builder' | 'connectors' | 'routing-rules';
  setActiveTab: (tab: 'inbox' | 'webform-builder' | 'connectors' | 'routing-rules') => void;

  // Modals
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  isRequesterFormOpen: boolean;
  setIsRequesterFormOpen: (open: boolean) => void;
  activeRequesterFormRequestId: string | null;
  setActiveRequesterFormRequestId: (id: string | null) => void;

  // Actions
  simulateInboundRequest: (data: {
    channel: IntakeChannel;
    requesterName: string;
    requesterEmail: string;
    requesterPhone: string;
    persona: 'Customer' | 'Employee' | 'Job Candidate' | 'Partner/Vendor' | 'Anonymous User';
    rawPayload: string;
    category?: RequestCategory;
    department?: TargetDepartment;
    assignedOwner?: string;
  }) => string;

  updateRequestCategory: (
    requestId: string, 
    newCategory: RequestCategory, 
    reason: string
  ) => void;

  transferRequest: (
    requestId: string, 
    department: TargetDepartment, 
    assignedOwner: string, 
    ownerRole: string,
    ownerEmail: string,
    reason: string
  ) => void;

  resendAcknowledgement: (
    requestId: string, 
    channel?: IntakeChannel, 
    customMessage?: string
  ) => void;

  submitSupplementaryForm: (
    requestId: string, 
    formData: {
      idProofUploaded: boolean;
      idProofType?: string;
      idProofFileName?: string;
      requesterNotes?: string;
    }
  ) => void;

  submitWebformPublic: (formData: Record<string, any>) => string;

  updateWebformConfig: (config: Partial<WebformConfig>) => void;

  promoteToDSRCase: (requestId: string) => string;

  resetIntakeData: () => void;

  // Notification Toast
  toastMessage: string | null;
  toastType: 'success' | 'info' | 'warning' | 'error' | null;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const STORAGE_KEY_INTAKE_REQUESTS = 'dutro_intake_requests_v3';
const STORAGE_KEY_WEBFORM_CONFIG = 'dutro_webform_config_v3';

const IntakeContext = createContext<IntakeContextType | undefined>(undefined);

export const IntakeProvider: React.FC<{ 
  children: React.ReactNode;
  onPromoteToWorkspace?: (dsrId: string) => void;
}> = ({ children, onPromoteToWorkspace }) => {
  const [requests, setRequests] = useState<IntakeRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INTAKE_REQUESTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load intake requests:', e);
    }
    return INITIAL_INTAKE_REQUESTS;
  });

  const [channelConfigs] = useState<ChannelSummary[]>(CHANNEL_CONFIGS);

  const [webformConfig, setWebformConfig] = useState<WebformConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEBFORM_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load webform config:', e);
    }
    return DEFAULT_WEBFORM_CONFIG;
  });

  const [selectedChannelFilter, setSelectedChannelFilter] = useState<IntakeChannel | 'all'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<RequestCategory | 'all'>('all');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<TargetDepartment | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedRequest, setSelectedRequest] = useState<IntakeRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'webform-builder' | 'connectors' | 'routing-rules'>('inbox');

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isRequesterFormOpen, setIsRequesterFormOpen] = useState(false);
  const [activeRequesterFormRequestId, setActiveRequesterFormRequestId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning' | 'error' | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 4500);
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INTAKE_REQUESTS, JSON.stringify(requests));
    } catch (e) {
      console.warn('Failed to persist intake requests:', e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WEBFORM_CONFIG, JSON.stringify(webformConfig));
    } catch (e) {
      console.warn('Failed to persist webform config:', e);
    }
  }, [webformConfig]);

  // AI & Rule Categorizer Helper
  const inferCategoryAndRouting = (payload: string, channel: IntakeChannel, customCategory?: RequestCategory, customDept?: TargetDepartment) => {
    const text = payload.toLowerCase();

    let category: RequestCategory = customCategory || 'Right of Access (DSAR)';
    let confidence = 95;
    let reasoning = 'Categorized by matching keyword patterns and statutory context.';
    let urgency: UrgencyLevel = 'Standard';
    let slaDays = 30;
    let statutoryAct = 'DPDP Act 2023 Sec. 11 / GDPR Art. 15';

    if (!customCategory) {
      if (text.includes('delete') || text.includes('erasure') || text.includes('forgotten') || text.includes('purge') || text.includes('remove my data')) {
        category = 'Right to Erasure / Deletion';
        confidence = 96;
        reasoning = 'Customer requested permanent erasure/deletion of personal records.';
        statutoryAct = 'DPDP Act 2023 Sec. 12 (Right to Erasure)';
      } else if (text.includes('correct') || text.includes('update') || text.includes('rectification') || text.includes('wrong') || text.includes('spelling') || text.includes('address change')) {
        category = 'Right to Rectification / Correction';
        confidence = 98;
        reasoning = 'Requester seeking correction/update of personal records.';
        statutoryAct = 'DPDP Act 2023 Sec. 12 (Right to Correction)';
      } else if (text.includes('consent') || text.includes('revoke') || text.includes('stop calling') || text.includes('telemarketing') || text.includes('opt-out') || text.includes('opt out') || text.includes('unsubscribe')) {
        category = 'Consent Revocation / Opt-Out';
        confidence = 97;
        urgency = 'Medium';
        slaDays = 15;
        reasoning = 'Request to revoke processing consent and withdraw from marketing channels.';
        statutoryAct = 'DPDP Act 2023 Sec. 6(4) (Consent Withdrawal)';
      } else if (text.includes('export') || text.includes('json') || text.includes('excel') || text.includes('machine-readable') || text.includes('portability') || text.includes('transfer my data')) {
        category = 'Data Portability';
        confidence = 95;
        reasoning = 'Requester requested personal data in structured machine-readable format.';
        statutoryAct = 'DPDP Act 2023 Sec. 11(1) & GDPR Art. 20';
      } else if (text.includes('grievance') || text.includes('complaint') || text.includes('dpbi') || text.includes('board of india') || text.includes('illegal') || text.includes('violation')) {
        category = 'Grievance / Escalation';
        confidence = 98;
        urgency = 'Critical';
        slaDays = 7;
        reasoning = 'Escalated privacy grievance or complaint mentioning regulatory oversight.';
        statutoryAct = 'DPDP Act 2023 Sec. 13 (Grievance Redressal)';
      } else if (text.includes('breach') || text.includes('leak') || text.includes('sdk') || text.includes('pixel') || text.includes('telemetry') || text.includes('hacked') || text.includes('meta tracking')) {
        category = 'Security & Breach Inquiry';
        confidence = 92;
        urgency = 'High';
        slaDays = 7;
        reasoning = 'Inquiry concerning security telemetry, tracking tags, or potential vulnerability.';
        statutoryAct = 'DPDP Act 2023 Sec. 8(5) (Security Measures)';
      } else if (text.includes('sub-processor') || text.includes('cross-border') || text.includes('cloud hosting') || text.includes('privacy policy') || text.includes('faq')) {
        category = 'General Privacy Query';
        confidence = 91;
        slaDays = 15;
        reasoning = 'General informational inquiry regarding organizational privacy posture.';
        statutoryAct = 'DPDP Act 2023 Sec. 16 (Transparency & Transfer)';
      }
    }

    // Determine target department
    let department: TargetDepartment = customDept || 'Privacy & Compliance Office';
    let assignedOwner = 'Ananya Mehta (Privacy Officer)';
    let ownerEmail = 'privacy@client.example';
    let ownerRole = 'Data Protection Officer';

    if (!customDept) {
      if (category === 'Right to Rectification / Correction') {
        department = 'Customer Support Operations';
        assignedOwner = 'Neha Kapoor (Support Lead)';
        ownerEmail = 'support-ops@client.example';
        ownerRole = 'Customer Operations Manager';
      } else if (text.includes('candidate') || text.includes('employee') || text.includes('resume') || text.includes('salary') || text.includes('hr') || text.includes('interview')) {
        department = 'HR & Talent Privacy';
        assignedOwner = 'Vikram Singhania (Head of HR Operations)';
        ownerEmail = 'hr-privacy@client.example';
        ownerRole = 'HR Privacy Lead';
      } else if (category === 'Security & Breach Inquiry' || text.includes('sdk') || text.includes('telemetry') || text.includes('api')) {
        department = 'IT & Security Engineering';
        assignedOwner = 'Amit Shah (Head of Information Security)';
        ownerEmail = 'infosec@client.example';
        ownerRole = 'CISO / Lead Security Engineer';
      } else if (category === 'Grievance / Escalation' || text.includes('legal') || text.includes('court') || text.includes('dpbi')) {
        department = 'Legal & Regulatory Counsel';
        assignedOwner = 'Meera Sen (Chief Legal Officer)';
        ownerEmail = 'legal-privacy@client.example';
        ownerRole = 'Head of Legal & Regulatory Affairs';
      } else if (text.includes('billing') || text.includes('invoice') || text.includes('statement') || text.includes('transaction receipt')) {
        department = 'Billing & Accounts Operations';
        assignedOwner = 'Rahul Verma (Operations)';
        ownerEmail = 'operations@client.example';
        ownerRole = 'Operations Lead';
      }
    }

    // Determine appropriate supplementary form
    let formType: import('../types/intake').AttachedSupplementaryForm['formType'] = 'Identity Verification (KYC)';
    let formTitle = 'Government ID & OTP Identity Verification Form';

    if (category === 'Right to Erasure / Deletion') {
      formType = 'Erasure Scope Declaration';
      formTitle = 'Data Erasure Scope & Statutory Retention Waiver Form';
    } else if (category === 'Consent Revocation / Opt-Out') {
      formType = 'Consent Preference Form';
      formTitle = 'Comprehensive Marketing & Data Sharing Preference Center';
    } else if (category === 'Grievance / Escalation') {
      formType = 'Grievance Statement';
      formTitle = 'Formal Privacy Grievance Statement & Incident Details';
    } else if (category === 'Data Portability' || category === 'Right of Access (DSAR)' || category === 'Right to Rectification / Correction') {
      formType = 'DSAR Supplementary Details';
      formTitle = 'Identity Proof & Scope Specification Form';
    }

    return {
      category,
      confidence,
      reasoning,
      urgency,
      slaDays,
      statutoryAct,
      department,
      assignedOwner,
      ownerEmail,
      ownerRole,
      formType,
      formTitle
    };
  };

  // Simulate Inbound Request from any of the 9 channels
  const simulateInboundRequest = (data: {
    channel: IntakeChannel;
    requesterName: string;
    requesterEmail: string;
    requesterPhone: string;
    persona: 'Customer' | 'Employee' | 'Job Candidate' | 'Partner/Vendor' | 'Anonymous User';
    rawPayload: string;
    category?: RequestCategory;
    department?: TargetDepartment;
    assignedOwner?: string;
  }): string => {
    const nextNum = 9100 + requests.length + 1;
    const newId = `INTK-${nextNum}`;
    const now = new Date();
    const timeStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

    const decision = inferCategoryAndRouting(data.rawPayload, data.channel, data.category, data.department);

    const trackingToken = `ACK-${data.channel.toUpperCase().substring(0, 3)}-${nextNum}-${Math.floor(1000 + Math.random() * 9000)}`;
    const formId = `FORM-${nextNum}`;

    const newRequest: IntakeRequest = {
      id: newId,
      channel: data.channel,
      receivedAt: timeStr,
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      requesterPhone: data.requesterPhone,
      requesterPersona: data.persona,
      rawSubject: `${decision.category} via ${data.channel.toUpperCase()}`,
      rawPayload: data.rawPayload,
      category: decision.category,
      categoryConfidence: decision.confidence,
      categoryReasoning: decision.reasoning,
      extractedEntities: {
        name: data.requesterName,
        email: data.requesterEmail,
        phone: data.requesterPhone,
        statutoryKeywords: [decision.statutoryAct, decision.category, `${decision.slaDays}-day SLA`],
        sentiment: decision.urgency === 'Critical' ? 'Frustrated' : 'Cooperative'
      },
      urgency: decision.urgency,
      slaDays: decision.slaDays,
      statutoryAct: decision.statutoryAct,
      transferredTo: {
        department: decision.department,
        assignedOwner: data.assignedOwner || decision.assignedOwner,
        ownerEmail: decision.ownerEmail,
        ownerRole: decision.ownerRole,
        transferredAt: timeStr,
        transferReason: `Auto-categorized as "${decision.category}" and assigned based on routing policy.`
      },
      acknowledgement: {
        status: 'Delivered',
        sentAt: timeStr,
        channel: data.channel,
        recipientContact: data.requesterEmail || data.requesterPhone || data.requesterName,
        messagePreview: `Hello ${data.requesterName}, Client Organization has received your ${decision.category} request (${newId}). Please complete your attached verification form.`,
        trackingToken: trackingToken
      },
      attachedForm: {
        formId: formId,
        formTitle: decision.formTitle,
        formType: decision.formType,
        formUrl: `https://privacy.client.example/verify/${newId}`,
        status: 'Pending Requester Submission',
        dispatchedAt: timeStr,
        idProofUploaded: false
      },
      status: 'Transferred',
      auditTrail: [
        {
          timestamp: timeStr,
          actor: `Inbound Gateway (${data.channel.toUpperCase()})`,
          action: 'Ingested Request',
          note: `Captured payload via ${data.channel} connector.`
        },
        {
          timestamp: timeStr,
          actor: 'AI Auto-Classifier & NLP Engine',
          action: 'Auto-Categorized',
          note: `Classified as ${decision.category} (${decision.confidence}% confidence).`
        },
        {
          timestamp: timeStr,
          actor: 'Automated Dispatch Engine',
          action: 'Dispatched Acknowledgement & Supplementary Form',
          note: `Sent instant acknowledgement with ${decision.formTitle} attached.`
        },
        {
          timestamp: timeStr,
          actor: 'Smart Routing Engine',
          action: 'Transferred',
          note: `Assigned case to ${decision.department} (${decision.assignedOwner}).`
        }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);
    setSelectedRequest(newRequest);
    showToast(`New request ${newId} ingested via ${data.channel.toUpperCase()}! Auto-categorized and acknowledgement dispatched.`, 'success');
    return newId;
  };

  // Public Webform submission
  const submitWebformPublic = (formData: Record<string, any>): string => {
    const nextNum = 9100 + requests.length + 1;
    const newId = `INTK-${nextNum}`;
    const now = new Date();
    const timeStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

    const fullName = formData.fullName || 'Anonymous User';
    const email = formData.email || 'requester@example.com';
    const phone = formData.phone || '+91 90000 00000';
    const persona = formData.persona || 'Customer';
    const description = formData.description || 'Statutory Privacy Request submitted via Webform';
    const rawCategory = formData.requestCategory || 'Right of Access (DSAR)';

    let mappedCat: RequestCategory = 'Right of Access (DSAR)';
    if (typeof rawCategory === 'string') {
      if (rawCategory.includes('Erasure') || rawCategory.includes('Deletion')) mappedCat = 'Right to Erasure / Deletion';
      else if (rawCategory.includes('Correction') || rawCategory.includes('Rectification')) mappedCat = 'Right to Rectification / Correction';
      else if (rawCategory.includes('Marketing') || rawCategory.includes('Revoke')) mappedCat = 'Consent Revocation / Opt-Out';
      else if (rawCategory.includes('Portability')) mappedCat = 'Data Portability';
      else if (rawCategory.includes('Grievance')) mappedCat = 'Grievance / Escalation';
    }

    const decision = inferCategoryAndRouting(description, 'webform', mappedCat, webformConfig.defaultAssignedDepartment);

    const trackingToken = `ACK-WEB-${nextNum}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: IntakeRequest = {
      id: newId,
      channel: 'webform',
      receivedAt: timeStr,
      requesterName: fullName,
      requesterEmail: email,
      requesterPhone: phone,
      requesterPersona: persona,
      rawSubject: `Webform Ingestion: ${mappedCat}`,
      rawPayload: `Webform Submission #WF-${nextNum}:\nRequester: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nRelationship: ${persona}\nCategory: ${rawCategory}\nDetails: "${description}"`,
      category: mappedCat,
      categoryConfidence: 99,
      categoryReasoning: 'Statutory webform submission with user-selected category and validated fields.',
      extractedEntities: {
        name: fullName,
        email: email,
        phone: phone,
        accountNumber: formData.accountNumber || undefined,
        statutoryKeywords: [decision.statutoryAct, mappedCat, 'DPDP Act 2023'],
        sentiment: 'Cooperative'
      },
      urgency: decision.urgency,
      slaDays: decision.slaDays,
      statutoryAct: decision.statutoryAct,
      transferredTo: {
        department: decision.department,
        assignedOwner: decision.assignedOwner,
        ownerEmail: decision.ownerEmail,
        ownerRole: decision.ownerRole,
        transferredAt: timeStr,
        transferReason: `Auto-routed to ${decision.department} via Statutory Webform Rule.`
      },
      acknowledgement: {
        status: 'Delivered',
        sentAt: timeStr,
        channel: 'webform',
        recipientContact: email,
        messagePreview: `Dear ${fullName}, your statutory request (${newId}) has been received by Client Organization. Please complete your 2FA identity confirmation form.`,
        trackingToken: trackingToken
      },
      attachedForm: {
        formId: `FORM-WEB-${nextNum}`,
        formTitle: decision.formTitle,
        formType: decision.formType,
        formUrl: `https://privacy.client.example/verify/${newId}`,
        status: 'Completed & Verified',
        dispatchedAt: timeStr,
        completedAt: timeStr,
        idProofUploaded: true,
        idProofType: 'Webform Authenticated KYC Session',
        idProofFileName: 'webform_verified_session.pdf',
        requesterNotes: 'Authenticated via webform SMS OTP session.'
      },
      status: 'Transferred',
      auditTrail: [
        {
          timestamp: timeStr,
          actor: 'Statutory Webform Ingestion Hub',
          action: 'Webform Ingested',
          note: `Received submission from ${fullName} (${email}).`
        },
        {
          timestamp: timeStr,
          actor: 'Smart Routing Engine',
          action: 'Transferred',
          note: `Routed to ${decision.department} (${decision.assignedOwner}).`
        },
        {
          timestamp: timeStr,
          actor: 'Automated Dispatch Gateway',
          action: 'Sent Acknowledgement & Verification Form',
          note: 'Delivered instant confirmation email with tracking token.'
        }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);
    setSelectedRequest(newRequest);
    showToast(`Webform submission registered as ${newId}! Acknowledgement dispatched.`, 'success');
    return newId;
  };

  // Update Request Category manually
  const updateRequestCategory = (requestId: string, newCategory: RequestCategory, reason: string) => {
    const now = new Date();
    const timeStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          category: newCategory,
          categoryConfidence: 100,
          categoryReasoning: `Manual override by Privacy Officer: ${reason}`,
          auditTrail: [
            ...req.auditTrail,
            {
              timestamp: timeStr,
              actor: 'Privacy Officer (Manual Override)',
              action: 'Re-Categorized',
              note: `Changed category to "${newCategory}". Reason: ${reason}`
            }
          ]
        };
      }
      return req;
    }));

    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest(prev => prev ? {
        ...prev,
        category: newCategory,
        categoryConfidence: 100,
        categoryReasoning: `Manual override by Privacy Officer: ${reason}`
      } : null);
    }

    showToast(`Case ${requestId} re-categorized as "${newCategory}"`, 'info');
  };

  // Transfer Request to a new department/owner
  const transferRequest = (
    requestId: string, 
    department: TargetDepartment, 
    assignedOwner: string, 
    ownerRole: string,
    ownerEmail: string,
    reason: string
  ) => {
    const now = new Date();
    const timeStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          transferredTo: {
            department,
            assignedOwner,
            ownerEmail,
            ownerRole,
            transferredAt: timeStr,
            transferReason: reason
          },
          status: 'Transferred',
          auditTrail: [
            ...req.auditTrail,
            {
              timestamp: timeStr,
              actor: 'Privacy Operations Lead',
              action: 'Re-Assigned / Transferred',
              note: `Transferred case to ${department} (${assignedOwner}). Reason: ${reason}`
            }
          ]
        };
      }
      return req;
    }));

    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest(prev => prev ? {
        ...prev,
        transferredTo: {
          department,
          assignedOwner,
          ownerEmail,
          ownerRole,
          transferredAt: timeStr,
          transferReason: reason
        },
        status: 'Transferred'
      } : null);
    }

    showToast(`Case ${requestId} transferred to ${department} (${assignedOwner})`, 'success');
  };

  // Resend Acknowledgement
  const resendAcknowledgement = (requestId: string, channel?: IntakeChannel, customMessage?: string) => {
    const now = new Date();
    const timeStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const targetChannel = channel || req.channel;
        const msg = customMessage || req.acknowledgement.messagePreview;
        return {
          ...req,
          acknowledgement: {
            ...req.acknowledgement,
            status: 'Delivered',
            sentAt: timeStr,
            channel: targetChannel,
            messagePreview: msg
          },
          auditTrail: [
            ...req.auditTrail,
            {
              timestamp: timeStr,
              actor: 'Privacy Officer',
              action: 'Resent Acknowledgement',
              note: `Resent formal acknowledgement via ${targetChannel.toUpperCase()} with tracking token ${req.acknowledgement.trackingToken}.`
            }
          ]
        };
      }
      return req;
    }));

    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest(prev => prev ? {
        ...prev,
        acknowledgement: {
          ...prev.acknowledgement,
          status: 'Delivered',
          sentAt: timeStr,
          messagePreview: customMessage || prev.acknowledgement.messagePreview
        }
      } : null);
    }

    showToast(`Acknowledgement resent successfully for ${requestId}`, 'success');
  };

  // Submit Supplementary Form (Simulate Requester filling out the attached form)
  const submitSupplementaryForm = (
    requestId: string, 
    formData: {
      idProofUploaded: boolean;
      idProofType?: string;
      idProofFileName?: string;
      requesterNotes?: string;
    }
  ) => {
    const now = new Date();
    const timeStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          attachedForm: {
            ...req.attachedForm,
            status: 'Completed & Verified',
            completedAt: timeStr,
            idProofUploaded: formData.idProofUploaded,
            idProofType: formData.idProofType || 'National Government ID (Masked)',
            idProofFileName: formData.idProofFileName || 'id_proof_verified.pdf',
            requesterNotes: formData.requesterNotes || 'Requester submitted supplementary verification details.'
          },
          status: 'Form Completed',
          auditTrail: [
            ...req.auditTrail,
            {
              timestamp: timeStr,
              actor: `Requester (${req.requesterName})`,
              action: 'Supplementary Form Submitted',
              note: `Completed ${req.attachedForm.formTitle} with verified ID proof (${formData.idProofType || 'Government ID'}).`
            }
          ]
        };
      }
      return req;
    }));

    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest(prev => prev ? {
        ...prev,
        attachedForm: {
          ...prev.attachedForm,
          status: 'Completed & Verified',
          completedAt: timeStr,
          idProofUploaded: formData.idProofUploaded,
          idProofType: formData.idProofType || 'National Government ID (Masked)',
          idProofFileName: formData.idProofFileName || 'id_proof_verified.pdf',
          requesterNotes: formData.requesterNotes || 'Requester submitted supplementary verification details.'
        },
        status: 'Form Completed'
      } : null);
    }

    showToast(`Supplementary form completed & verified for ${requestId}! Ready for DSR fulfillment.`, 'success');
  };

  // Update Webform Config
  const updateWebformConfig = (config: Partial<WebformConfig>) => {
    setWebformConfig(prev => ({
      ...prev,
      ...config
    }));
    showToast('Webform configuration updated successfully!', 'success');
  };

  // Promote to DSR Case in Workspace
  const promoteToDSRCase = (requestId: string): string => {
    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) return 'DSR-2001';

    const dsrId = targetReq.linkedDsrId || 'DSR-2001';
    const now = new Date();
    const timeStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'Converted to DSR',
          linkedDsrId: dsrId,
          auditTrail: [
            ...req.auditTrail,
            {
              timestamp: timeStr,
              actor: 'Privacy Officer',
              action: 'Converted to DSR Workspace Case',
              note: `Linked intake case ${requestId} to active DSR Case ${dsrId} for multi-department orchestration.`
            }
          ]
        };
      }
      return req;
    }));

    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest(prev => prev ? {
        ...prev,
        status: 'Converted to DSR',
        linkedDsrId: dsrId
      } : null);
    }

    if (onPromoteToWorkspace) {
      onPromoteToWorkspace(dsrId);
    }

    showToast(`Intake ${requestId} promoted to Active DSR Case ${dsrId}!`, 'success');
    return dsrId;
  };

  const resetIntakeData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_INTAKE_REQUESTS);
      localStorage.removeItem(STORAGE_KEY_WEBFORM_CONFIG);
    } catch (e) {
      console.warn(e);
    }
    setRequests(INITIAL_INTAKE_REQUESTS);
    setWebformConfig(DEFAULT_WEBFORM_CONFIG);
    setSelectedRequest(null);
    showToast('Intake Hub reset to initial demo data.', 'info');
  };

  return (
    <IntakeContext.Provider value={{
      requests,
      channelConfigs,
      webformConfig,
      selectedChannelFilter,
      setSelectedChannelFilter,
      selectedCategoryFilter,
      setSelectedCategoryFilter,
      selectedDepartmentFilter,
      setSelectedDepartmentFilter,
      searchQuery,
      setSearchQuery,
      selectedRequest,
      setSelectedRequest,
      activeTab,
      setActiveTab,
      isSimulatorOpen,
      setIsSimulatorOpen,
      isRequesterFormOpen,
      setIsRequesterFormOpen,
      activeRequesterFormRequestId,
      setActiveRequesterFormRequestId,
      simulateInboundRequest,
      updateRequestCategory,
      transferRequest,
      resendAcknowledgement,
      submitSupplementaryForm,
      submitWebformPublic,
      updateWebformConfig,
      promoteToDSRCase,
      resetIntakeData,
      toastMessage,
      toastType,
      showToast
    }}>
      {children}
    </IntakeContext.Provider>
  );
};

export const useIntake = () => {
  const context = useContext(IntakeContext);
  if (!context) {
    throw new Error('useIntake must be used within an IntakeProvider');
  }
  return context;
};
