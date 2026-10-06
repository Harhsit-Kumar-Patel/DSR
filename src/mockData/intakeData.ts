import { IntakeRequest, IntakeChannel, WebformConfig, ChannelSummary } from '../types/intake';

export const DEFAULT_WEBFORM_CONFIG: WebformConfig = {
  id: 'WF-STATUTORY-2026',
  title: 'Statutory Data Subject & Privacy Request Webform',
  description: 'Submit your formal rights request under the Digital Personal Data Protection (DPDP) Act 2023 & GDPR with Client Organization',
  organizationName: 'Client Organization',
  themeColor: '#2563eb',
  statutoryNotice: 'Under Section 11 & 12 of the DPDP Act 2023, you are entitled to access, rectify, or request erasure of your personal data. We respond to all verified requests within the statutory 30-day window.',
  requireIdProof: true,
  requireOtpVerification: true,
  defaultAssignedDepartment: 'Privacy & Compliance Office',
  autoAcknowledgementMessage: 'Thank you for contacting Client Organization. Your privacy request has been registered under Case ID {{caseId}}. An acknowledgement email and supplementary verification form have been dispatched.',
  fields: [
    {
      id: 'fullName',
      label: 'Full Legal Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Rohan Mehta',
      description: 'As it appears on your government identity documents.'
    },
    {
      id: 'email',
      label: 'Registered Email Address',
      type: 'email',
      required: true,
      placeholder: 'e.g., rohan.mehta@example.com',
      description: 'We will send the verification OTP and final response package to this address.'
    },
    {
      id: 'phone',
      label: 'Mobile Phone Number',
      type: 'phone',
      required: true,
      placeholder: '+91 90000 12345',
      description: 'Required for two-factor SMS OTP authentication.'
    },
    {
      id: 'persona',
      label: 'Your Relationship with Client Organization',
      type: 'select',
      required: true,
      options: ['Registered User', 'Corporate Client Representative', 'Former Customer', 'Job Applicant / Candidate', 'Current / Former Employee', 'Vendor / Sub-processor Contact'],
      placeholder: 'Select your relationship...'
    },
    {
      id: 'requestCategory',
      label: 'Statutory Request Type',
      type: 'select',
      required: true,
      options: [
        'Right of Access (DSAR) - DPDP Sec. 11 / GDPR Art. 15',
        'Right to Erasure / Account Deletion - DPDP Sec. 12 / GDPR Art. 17',
        'Right to Correction / Rectification - DPDP Sec. 12',
        'Revoke Marketing & Telemarketing Consent',
        'Data Portability (Export Machine-Readable Records)',
        'Formal Privacy Grievance / Complaint'
      ],
      placeholder: 'Select request category...'
    },
    {
      id: 'accountNumber',
      label: 'Bank Account Number / Customer CIF ID',
      type: 'text',
      required: false,
      placeholder: 'e.g., ACC-7842109812 (optional if known)',
      description: 'Helps us expedite automated account matching.'
    },
    {
      id: 'description',
      label: 'Request Details & Specific Information Required',
      type: 'textarea',
      required: true,
      placeholder: 'Please provide specific details regarding your data request, systems of interest, or relevant timeline...',
      description: 'Be specific to help our operations team fulfill your request promptly.'
    }
  ]
};

export const INITIAL_INTAKE_REQUESTS: IntakeRequest[] = [
  {
    id: 'INTK-9101',
    channel: 'email',
    receivedAt: '28 Sep 2026, 09:14 IST',
    requesterName: 'Rohan Mehta',
    requesterEmail: 'rohan.mehta@example.com',
    requesterPhone: '+91 90000 12345',
    requesterPersona: 'Customer',
    rawSubject: 'Formal DPDP Section 11 Subject Access Request for Account ACC-7842109812',
    rawPayload: `Dear Data Protection Officer,\n\nI am writing to submit a formal Data Subject Access Request under Section 11 of the Digital Personal Data Protection Act 2023 and GDPR Article 15.\n\nPlease provide me with a comprehensive report of all personal data held about me across your Core Enterprise DB, CRM, Loan Origination, and Support systems. My customer ID is CUST-78421.\n\nLooking forward to your formal statutory response within the 30-day timeline.\n\nRegards,\nRohan Mehta`,
    category: 'Right of Access (DSAR)',
    categoryConfidence: 99,
    categoryReasoning: 'Explicit reference to DPDP Act Sec. 11, GDPR Art. 15, and request for all personal data across banking systems.',
    extractedEntities: {
      name: 'Rohan Mehta',
      email: 'rohan.mehta@example.com',
      phone: '+91 90000 12345',
      accountNumber: 'ACC-7842109812',
      identifiers: ['CUST-78421', 'Core Enterprise DB', 'Loan Origination'],
      statutoryKeywords: ['DPDP Act 2023 Sec 11', 'GDPR Art 15', 'Access Request', '30-day timeline'],
      sentiment: 'Cooperative'
    },
    urgency: 'Standard',
    slaDays: 30,
    statutoryAct: 'DPDP Act 2023 Sec. 11 / GDPR Art. 15',
    transferredTo: {
      department: 'Privacy & Compliance Office',
      assignedOwner: 'Ananya Mehta (Privacy Officer)',
      ownerEmail: 'privacy@client.example',
      ownerRole: 'Data Protection Officer',
      transferredAt: '28 Sep 2026, 09:15 IST',
      transferReason: 'Auto-routed to DPO based on high-confidence statutory DSAR classification.'
    },
    acknowledgement: {
      status: 'Delivered',
      sentAt: '28 Sep 2026, 09:14:30 IST',
      channel: 'email',
      recipientContact: 'rohan.mehta@example.com',
      messagePreview: 'Dear Rohan Mehta, your Subject Access Request (INTK-9101) has been received. Please complete your 2FA identity confirmation form attached.',
      trackingToken: 'ACK-EML-9101-8842'
    },
    attachedForm: {
      formId: 'FORM-VERIFY-9101',
      formTitle: 'Government ID & OTP Identity Verification Form',
      formType: 'Identity Verification (KYC)',
      formUrl: 'https://privacy.client.example/verify/INTK-9101',
      status: 'Completed & Verified',
      dispatchedAt: '28 Sep 2026, 09:14:30 IST',
      completedAt: '28 Sep 2026, 09:14:55 IST',
      idProofUploaded: true,
      idProofType: 'Aadhaar / National ID Masked',
      idProofFileName: 'rohan_aadhaar_masked.pdf',
      requesterNotes: 'Identity confirmed via SMS OTP and masked Aadhaar scan.'
    },
    status: 'Converted to DSR',
    linkedDsrId: 'DSR-2001',
    auditTrail: [
      {
        timestamp: '28 Sep 2026, 09:14:00 IST',
        actor: 'Inbound Email Gateway (privacy@client.example)',
        action: 'Ingested Request',
        note: 'Captured email payload from rohan.mehta@example.com'
      },
      {
        timestamp: '28 Sep 2026, 09:14:15 IST',
        actor: 'AI Classification Engine',
        action: 'Auto-Categorized',
        note: 'Classified as Right of Access (DSAR) with 99% confidence.'
      },
      {
        timestamp: '28 Sep 2026, 09:14:30 IST',
        actor: 'Automated Notification System',
        action: 'Acknowledgement & Form Dispatched',
        note: 'Sent formal acknowledgement email with dynamic Identity Verification form.'
      },
      {
        timestamp: '28 Sep 2026, 09:14:55 IST',
        actor: 'Requester (Rohan Mehta)',
        action: 'Supplementary Form Submitted',
        note: 'Completed KYC OTP verification and uploaded masked identity proof.'
      },
      {
        timestamp: '28 Sep 2026, 09:15:20 IST',
        actor: 'Privacy Orchestrator',
        action: 'Transferred & Converted',
        note: 'Transferred to Privacy & Compliance Office and converted to active workspace case DSR-2001.'
      }
    ]
  },
  {
    id: 'INTK-9102',
    channel: 'whatsapp',
    receivedAt: '28 Sep 2026, 10:22 IST',
    requesterName: 'Priya Sharma',
    requesterEmail: 'priya.sharma99@gmail.com',
    requesterPhone: '+91 98234 56789',
    requesterPersona: 'Customer',
    rawPayload: `Hi Client Organization, I closed my credit card account last month. Please permanently delete all my phone numbers, biometric scans, and marketing records from your servers immediately under DPDP right to be forgotten. Stop calling me for loan offers!`,
    category: 'Right to Erasure / Deletion',
    categoryConfidence: 96,
    categoryReasoning: 'Customer explicitly requesting permanent deletion of personal data, biometrics, and marketing contact details following account closure.',
    extractedEntities: {
      name: 'Priya Sharma',
      phone: '+91 98234 56789',
      identifiers: ['Credit Card Account Closed', 'Biometric Scans', 'Marketing Records'],
      statutoryKeywords: ['Right to be forgotten', 'Permanently delete', 'DPDP Act Sec 12', 'Stop calling'],
      sentiment: 'Frustrated'
    },
    urgency: 'High',
    slaDays: 30,
    statutoryAct: 'DPDP Act 2023 Sec. 12 (Right to Erasure)',
    transferredTo: {
      department: 'Privacy & Compliance Office',
      assignedOwner: 'Ananya Mehta (Privacy Officer)',
      ownerEmail: 'privacy@client.example',
      ownerRole: 'Data Protection Officer',
      transferredAt: '28 Sep 2026, 10:23 IST',
      transferReason: 'Erasure request requires statutory legal hold check and retention schedule verification.'
    },
    acknowledgement: {
      status: 'Delivered',
      sentAt: '28 Sep 2026, 10:22:15 IST',
      channel: 'whatsapp',
      recipientContact: '+91 98234 56789',
      messagePreview: 'Hello Priya, Client Organization has received your erasure request (INTK-9102). Tap the button below to confirm your account details on our secure portal.',
      trackingToken: 'ACK-WA-9102-3391'
    },
    attachedForm: {
      formId: 'FORM-ERASURE-9102',
      formTitle: 'Data Erasure Scope & Statutory Retention Waiver Form',
      formType: 'Erasure Scope Declaration',
      formUrl: 'https://privacy.client.example/forms/erasure/INTK-9102',
      status: 'Completed & Verified',
      dispatchedAt: '28 Sep 2026, 10:22:15 IST',
      completedAt: '28 Sep 2026, 10:25:40 IST',
      idProofUploaded: true,
      idProofType: 'Driver License',
      idProofFileName: 'priya_dl_redacted.jpg',
      requesterNotes: 'Confirmed deletion of credit card CRM history and telemarketing consent.'
    },
    status: 'Transferred',
    auditTrail: [
      {
        timestamp: '28 Sep 2026, 10:22:00 IST',
        actor: 'WhatsApp Business API Webhook (+91 98000 12345)',
        action: 'Ingested Message',
        note: 'Received inbound WhatsApp message from +91 98234 56789'
      },
      {
        timestamp: '28 Sep 2026, 10:22:10 IST',
        actor: 'NLP Entity & Intent Classifier',
        action: 'Auto-Categorized',
        note: 'Identified Right to Erasure with 96% confidence and High urgency.'
      },
      {
        timestamp: '28 Sep 2026, 10:22:15 IST',
        actor: 'WhatsApp Interactive Bot',
        action: 'Dispatched Acknowledgement & Form',
        note: 'Sent interactive WhatsApp acknowledgement with secure erasure scope form link.'
      },
      {
        timestamp: '28 Sep 2026, 10:25:40 IST',
        actor: 'Requester (Priya Sharma)',
        action: 'Form Submitted',
        note: 'Completed Erasure Scope Declaration via mobile browser.'
      }
    ]
  },
  {
    id: 'INTK-9103',
    channel: 'chatbot',
    receivedAt: '28 Sep 2026, 11:05 IST',
    requesterName: 'Vikramaditya Iyer',
    requesterEmail: 'vikram.iyer@fintechventures.io',
    requesterPhone: '+91 97112 34567',
    requesterPersona: 'Job Candidate',
    rawPayload: `Candidate Chatbot Session #88392:\nUser: "I interviewed for the Senior Product Manager role 6 months ago. I would like all copies of my resume, interview evaluation scores, background check documents, and salary slips removed from your Greenhouse and HR records under DPDP guidelines."\nBot: "I understand you wish to submit a candidate data deletion request. Let me register this with our HR Privacy team."`,
    category: 'Right to Erasure / Deletion',
    categoryConfidence: 94,
    categoryReasoning: 'Ex-candidate requesting removal of candidate evaluation files, resume, background check records from HR recruitment systems.',
    extractedEntities: {
      name: 'Vikramaditya Iyer',
      email: 'vikram.iyer@fintechventures.io',
      phone: '+91 97112 34567',
      identifiers: ['Greenhouse ATS', 'Senior PM Interview', 'HR Records'],
      statutoryKeywords: ['Interview scores', 'Resume deletion', 'Background check', 'DPDP guidelines'],
      sentiment: 'Neutral'
    },
    urgency: 'Standard',
    slaDays: 30,
    statutoryAct: 'DPDP Act 2023 Sec. 12 (Applicant Data Retention)',
    transferredTo: {
      department: 'HR & Talent Privacy',
      assignedOwner: 'Vikram Singhania (Head of HR Operations)',
      ownerEmail: 'hr-privacy@client.example',
      ownerRole: 'HR Privacy Lead',
      transferredAt: '28 Sep 2026, 11:06 IST',
      transferReason: 'Candidate recruitment data deletion routed to HR & Talent Privacy Operations.'
    },
    acknowledgement: {
      status: 'Delivered',
      sentAt: '28 Sep 2026, 11:05:45 IST',
      channel: 'chatbot',
      recipientContact: 'vikram.iyer@fintechventures.io',
      messagePreview: 'Hi Vikramaditya, your candidate data erasure request (INTK-9103) has been registered. Please verify your identity via the supplementary form link sent to your email.',
      trackingToken: 'ACK-BOT-9103-7721'
    },
    attachedForm: {
      formId: 'FORM-HR-9103',
      formTitle: 'Candidate Recruitment Data Erasure Form',
      formType: 'Erasure Scope Declaration',
      formUrl: 'https://privacy.client.example/forms/candidate/INTK-9103',
      status: 'Pending Requester Submission',
      dispatchedAt: '28 Sep 2026, 11:05:45 IST',
      idProofUploaded: false
    },
    status: 'Awaiting Form Submission',
    auditTrail: [
      {
        timestamp: '28 Sep 2026, 11:05:00 IST',
        actor: 'Website AI Conversational Bot',
        action: 'Ingested Chat Session',
        note: 'Transcribed candidate data deletion conversation.'
      },
      {
        timestamp: '28 Sep 2026, 11:05:30 IST',
        actor: 'AI Intent Analyzer',
        action: 'Auto-Categorized',
        note: 'Matched to Right to Erasure / Candidate Persona (94% confidence).'
      },
      {
        timestamp: '28 Sep 2026, 11:06:00 IST',
        actor: 'Smart Routing Engine',
        action: 'Transferred',
        note: 'Transferred to HR & Talent Privacy (Vikram Singhania).'
      }
    ]
  },
  {
    id: 'INTK-9104',
    channel: 'webform',
    receivedAt: '28 Sep 2026, 11:45 IST',
    requesterName: 'Aditi Deshmukh',
    requesterEmail: 'aditi.deshmukh@corppartners.in',
    requesterPhone: '+91 99301 22334',
    requesterPersona: 'Customer',
    rawSubject: 'Correction of Registered Communication Address and PAN Number',
    rawPayload: `Webform Submission #WF-88912:\nRequester: Aditi Deshmukh\nCategory: Right to Rectification / Correction\nAccount: ACC-992144001\nDetails: "My residential address and PAN card spelling are incorrect in your Core Enterprise DB system after recent marital name change. Attached is my updated PAN card and Marriage Certificate for rectification under DPDP Section 12."`,
    category: 'Right to Rectification / Correction',
    categoryConfidence: 98,
    categoryReasoning: 'Customer requesting data update/correction of name, PAN, and address with attached legal proofs.',
    extractedEntities: {
      name: 'Aditi Deshmukh',
      email: 'aditi.deshmukh@corppartners.in',
      phone: '+91 99301 22334',
      accountNumber: 'ACC-992144001',
      identifiers: ['PAN Card', 'Address update', 'Core Enterprise DB'],
      statutoryKeywords: ['Right to Rectification', 'DPDP Section 12', 'Correction of data'],
      sentiment: 'Cooperative'
    },
    urgency: 'Standard',
    slaDays: 30,
    statutoryAct: 'DPDP Act 2023 Sec. 12 (Right to Correction & Erasure)',
    transferredTo: {
      department: 'Customer Support Operations',
      assignedOwner: 'Neha Kapoor (Support Lead)',
      ownerEmail: 'support-ops@client.example',
      ownerRole: 'Customer Operations Manager',
      transferredAt: '28 Sep 2026, 11:46 IST',
      transferReason: 'Customer record rectification and KYC document verification routed to Support Operations.'
    },
    acknowledgement: {
      status: 'Delivered',
      sentAt: '28 Sep 2026, 11:45:20 IST',
      channel: 'webform',
      recipientContact: 'aditi.deshmukh@corppartners.in',
      messagePreview: 'Dear Aditi Deshmukh, your rectification request (INTK-9104) has been logged. Our KYC Operations team is validating your uploaded documents.',
      trackingToken: 'ACK-WEB-9104-1290'
    },
    attachedForm: {
      formId: 'FORM-RECT-9104',
      formTitle: 'KYC Document Rectification & Address Proof Form',
      formType: 'DSAR Supplementary Details',
      formUrl: 'https://privacy.client.example/forms/rectify/INTK-9104',
      status: 'Completed & Verified',
      dispatchedAt: '28 Sep 2026, 11:45:20 IST',
      completedAt: '28 Sep 2026, 11:45:20 IST',
      idProofUploaded: true,
      idProofType: 'Updated PAN Card & Marriage Certificate',
      idProofFileName: 'pan_marriage_cert_aditi.pdf',
      requesterNotes: 'Uploaded official gazette and PAN card copy for name match.'
    },
    status: 'Transferred',
    auditTrail: [
      {
        timestamp: '28 Sep 2026, 11:45:00 IST',
        actor: 'Statutory Webform Engine',
        action: 'Ingested Webform',
        note: 'Captured authenticated form submission.'
      },
      {
        timestamp: '28 Sep 2026, 11:46:00 IST',
        actor: 'Smart Routing Engine',
        action: 'Transferred',
        note: 'Assigned to Customer Support Operations (Neha Kapoor).'
      }
    ]
  },
  {
    id: 'INTK-9105',
    channel: 'calls',
    receivedAt: '28 Sep 2026, 12:30 IST',
    requesterName: 'Suresh Menon',
    requesterEmail: 'suresh.menon@keralatraders.co',
    requesterPhone: '+91 94470 99881',
    requesterPersona: 'Customer',
    audioDuration: '04:18 mins',
    callTranscript: `[Agent Rahul]: "Thank you for calling Client Phone Support, my name is Rahul. How may I assist you today Mr. Menon?"\n[Caller Suresh]: "Yes, I am calling because I received marketing SMS messages claiming to pre-approve personal loans using my credit score. I never gave permission to share my credit score with third-party telemarketers. I want to revoke all marketing consent and I want a full list of third parties who have access to my credit history."\n[Agent Rahul]: "Understood Mr. Menon. Under our privacy policy and the DPDP Act, I will initiate a formal Consent Revocation and Third-Party Disclosure request for your account."`,
    rawPayload: `Inbound Call Center IVR Recording #CALL-20260928-8819\nDuration: 04:18 | Agent: Rahul V. | Caller ID: +91 94470 99881\nIntent: Marketing Consent Withdrawal & Third-Party Disclosure Inquiry.`,
    category: 'Consent Revocation / Opt-Out',
    categoryConfidence: 97,
    categoryReasoning: 'Customer explicitly stating withdrawal of consent for credit score sharing and marketing communications via phone banking voice transcript.',
    extractedEntities: {
      name: 'Suresh Menon',
      phone: '+91 94470 99881',
      identifiers: ['Credit Score Sharing', 'Third-Party Telemarketers', 'Personal Loan Pre-approval'],
      statutoryKeywords: ['Revoke marketing consent', 'Third parties list', 'DPDP Act', 'Credit score'],
      sentiment: 'Frustrated'
    },
    urgency: 'Medium',
    slaDays: 15,
    statutoryAct: 'DPDP Act 2023 Sec. 6(4) (Withdrawal of Consent)',
    transferredTo: {
      department: 'Privacy & Compliance Office',
      assignedOwner: 'Ananya Mehta (Privacy Officer)',
      ownerEmail: 'privacy@client.example',
      ownerRole: 'Data Protection Officer',
      transferredAt: '28 Sep 2026, 12:32 IST',
      transferReason: 'Consent withdrawal across marketing platforms and third-party vendor audit requires DPO coordination.'
    },
    acknowledgement: {
      status: 'Delivered',
      sentAt: '28 Sep 2026, 12:31:00 IST',
      channel: 'calls',
      recipientContact: '+91 94470 99881',
      messagePreview: 'SMS to Suresh Menon: Your marketing consent withdrawal request (INTK-9105) has been initiated via Phone Support. Please set your communication preferences via: https://privacy.client.example/consent/INTK-9105',
      trackingToken: 'ACK-SMS-9105-6623'
    },
    attachedForm: {
      formId: 'FORM-CONSENT-9105',
      formTitle: 'Comprehensive Marketing & Data Sharing Preference Center',
      formType: 'Consent Preference Form',
      formUrl: 'https://privacy.client.example/consent/INTK-9105',
      status: 'Completed & Verified',
      dispatchedAt: '28 Sep 2026, 12:31:00 IST',
      completedAt: '28 Sep 2026, 12:38:15 IST',
      idProofUploaded: false,
      requesterNotes: 'Opted out of all SMS, WhatsApp, and third-party credit score sharing.'
    },
    status: 'Transferred',
    auditTrail: [
      {
        timestamp: '28 Sep 2026, 12:30:00 IST',
        actor: 'IVR Voice Recording & Speech-to-Text Gateway',
        action: 'Ingested Voice Call',
        note: 'Transcribed 4-minute phone banking conversation.'
      },
      {
        timestamp: '28 Sep 2026, 12:30:45 IST',
        actor: 'Voice AI Intent Classifier',
        action: 'Auto-Categorized',
        note: 'Matched Consent Revocation / Marketing Opt-out with 97% confidence.'
      },
      {
        timestamp: '28 Sep 2026, 12:31:00 IST',
        actor: 'Automated SMS Gateway',
        action: 'Sent SMS Acknowledgement & Form Link',
        note: 'Dispatched instant SMS with Preference Center link.'
      }
    ]
  },
  {
    id: 'INTK-9106',
    channel: 'social',
    receivedAt: '28 Sep 2026, 13:10 IST',
    requesterName: 'Karan Mehra',
    requesterEmail: 'karan.mehra.designer@gmail.com',
    requesterPhone: '+91 98119 44332',
    requesterPersona: 'Customer',
    socialHandle: '@karanm_design (X / Twitter)',
    rawPayload: `Inbound Direct Message from @karanm_design:\n"Hey @ClientBank Support, I noticed targeted ads on Instagram showing products I only browsed inside your mobile banking app. How is my in-app telemetry being shared with Meta? This violates DPDP Section 4 purpose limitation. I want a complete audit of what tracking SDKs are attached to my profile!"`,
    category: 'Security & Breach Inquiry',
    categoryConfidence: 91,
    categoryReasoning: 'Social media inquiry regarding mobile app telemetry sharing with Meta, third-party tracking SDKs, and purpose limitation compliance.',
    extractedEntities: {
      name: 'Karan Mehra',
      socialHandle: '@karanm_design',
      identifiers: ['Meta Pixel / Ads', 'Mobile Banking App Telemetry', 'Tracking SDKs'],
      statutoryKeywords: ['DPDP Section 4', 'Purpose limitation', 'Tracking SDK audit'],
      sentiment: 'Urgent'
    },
    urgency: 'High',
    slaDays: 7,
    statutoryAct: 'DPDP Act 2023 Sec. 4 & 8 (Data Processing Purpose & Security)',
    transferredTo: {
      department: 'IT & Security Engineering',
      assignedOwner: 'Amit Shah (Head of Information Security)',
      ownerEmail: 'infosec@client.example',
      ownerRole: 'CISO / Lead Security Engineer',
      transferredAt: '28 Sep 2026, 13:12 IST',
      transferReason: 'Mobile app SDK telemetry and advertising tracker inquiry routed to InfoSec & Security Engineering.'
    },
    acknowledgement: {
      status: 'Delivered',
      sentAt: '28 Sep 2026, 13:10:30 IST',
      channel: 'social',
      recipientContact: '@karanm_design (X DM)',
      messagePreview: 'Hi Karan, thank you for reaching out. We take data privacy very seriously. We have generated security ticket INTK-9106 and our InfoSec team is investigating. Please securely verify your account on our portal.',
      trackingToken: 'ACK-SOC-9106-4412'
    },
    attachedForm: {
      formId: 'FORM-SEC-9106',
      formTitle: 'SDK & Telemetry Privacy Inquiry Form',
      formType: 'DSAR Supplementary Details',
      formUrl: 'https://privacy.client.example/inquiry/INTK-9106',
      status: 'Pending Requester Submission',
      dispatchedAt: '28 Sep 2026, 13:10:30 IST',
      idProofUploaded: false
    },
    status: 'Transferred',
    auditTrail: [
      {
        timestamp: '28 Sep 2026, 13:10:00 IST',
        actor: 'Social Media Ingestion Connector (X API v2)',
        action: 'Ingested Direct Message',
        note: 'Captured DM mentioning @ClientBank regarding SDK telemetry.'
      },
      {
        timestamp: '28 Sep 2026, 13:10:20 IST',
        actor: 'AI Sentiment & Policy Engine',
        action: 'Auto-Categorized',
        note: 'Categorized as Security & Breach Inquiry (91% confidence).'
      },
      {
        timestamp: '28 Sep 2026, 13:12:00 IST',
        actor: 'Smart Routing Engine',
        action: 'Transferred',
        note: 'Transferred to IT & Security Engineering (Amit Shah).'
      }
    ]
  },
  {
    id: 'INTK-9107',
    channel: 'app_stores',
    receivedAt: '28 Sep 2026, 14:00 IST',
    requesterName: 'Devika Nair',
    requesterEmail: 'devika.nair@outlook.com',
    requesterPhone: '+91 97441 55667',
    requesterPersona: 'Customer',
    appStoreRating: 1,
    appStoreVersion: 'iOS App v4.12.0 (Apple App Store)',
    rawPayload: `Apple App Store Review ★☆☆☆☆:\nReviewer: "Devika_Nair_2026" (App Version 4.12.0)\nTitle: "Cannot find in-app account and data deletion button"\nBody: "App Store guidelines require an immediate account and data deletion option inside the app settings. I have uninstalled the app and I want Client Organization to delete my biometrics, transaction history, and stored cards immediately. Fix this or I will report to the Data Protection Board of India!"`,
    category: 'Grievance / Escalation',
    categoryConfidence: 95,
    categoryReasoning: 'Public app store review threatening regulatory complaint to DPBI over missing in-app deletion button.',
    extractedEntities: {
      name: 'Devika Nair',
      identifiers: ['iOS App v4.12.0', 'In-app deletion', 'Stored cards'],
      statutoryKeywords: ['Data Protection Board of India', 'Account deletion', 'App store guidelines'],
      sentiment: 'Frustrated'
    },
    urgency: 'Critical',
    slaDays: 7,
    statutoryAct: 'DPDP Act 2023 Sec. 13 (Grievance Redressal)',
    transferredTo: {
      department: 'Legal & Regulatory Counsel',
      assignedOwner: 'Meera Sen (Chief Legal Officer)',
      ownerEmail: 'legal-privacy@client.example',
      ownerRole: 'Head of Legal & Regulatory Affairs',
      transferredAt: '28 Sep 2026, 14:02 IST',
      transferReason: 'Public regulatory escalation threatening complaint to DPBI routed to Legal Counsel & Grievance Officer.'
    },
    acknowledgement: {
      status: 'Delivered',
      sentAt: '28 Sep 2026, 14:01:00 IST',
      channel: 'app_stores',
      recipientContact: 'Apple App Store Developer Response API',
      messagePreview: 'Developer Response to Devika: Thank you for your feedback. In-app deletion is available in Settings > Security. We have also opened priority grievance ticket INTK-9107. Please visit our secure resolution form.',
      trackingToken: 'ACK-APP-9107-9920'
    },
    attachedForm: {
      formId: 'FORM-GRV-9107',
      formTitle: 'Formal Privacy Grievance & Expedited Erasure Statement',
      formType: 'Grievance Statement',
      formUrl: 'https://privacy.client.example/grievance/INTK-9107',
      status: 'Completed & Verified',
      dispatchedAt: '28 Sep 2026, 14:01:00 IST',
      completedAt: '28 Sep 2026, 14:20:10 IST',
      idProofUploaded: true,
      idProofType: 'Aadhaar / Voter ID',
      idProofFileName: 'devika_nair_voter_id.jpg',
      requesterNotes: 'Requester completed full grievance details and confirmed account number ACC-33910.'
    },
    status: 'Transferred',
    auditTrail: [
      {
        timestamp: '28 Sep 2026, 14:00:00 IST',
        actor: 'App Store Connect Webhook Gateway',
        action: 'Ingested 1-Star Review',
        note: 'Parsed critical review mentioning Data Protection Board of India.'
      },
      {
        timestamp: '28 Sep 2026, 14:00:30 IST',
        actor: 'AI Risk & Grievance Classifier',
        action: 'Auto-Categorized',
        note: 'Escalated to Grievance / Critical Urgency due to DPBI mention.'
      },
      {
        timestamp: '28 Sep 2026, 14:02:00 IST',
        actor: 'Smart Routing Engine',
        action: 'Transferred',
        note: 'Routed directly to Legal & Regulatory Counsel (Meera Sen).'
      }
    ]
  },
  {
    id: 'INTK-9108',
    channel: 'linkedin',
    receivedAt: '28 Sep 2026, 14:40 IST',
    requesterName: 'Rajesh Singhal',
    requesterEmail: 'rajesh.singhal@ex-corp.com',
    requesterPhone: '+91 98990 11223',
    requesterPersona: 'Employee',
    rawPayload: `LinkedIn InMail to Client Organization Corporate Page:\n"Hello, I was an employee in your Treasury department between 2021 and 2024 (Emp ID: NB-4091). I am requesting an export of all my performance appraisal records, provident fund tax withholding certificates, and internal training logs in JSON / Excel format as per DPDP portability guidelines."`,
    category: 'Data Portability',
    categoryConfidence: 96,
    categoryReasoning: 'Ex-employee requesting machine-readable export (JSON/Excel) of employment, tax, and appraisal history.',
    extractedEntities: {
      name: 'Rajesh Singhal',
      identifiers: ['Emp ID: NB-4091', 'Treasury Department', 'PF Tax Certificates', 'Appraisal Logs'],
      statutoryKeywords: ['Data portability', 'JSON/Excel format', 'DPDP portability', 'Ex-employee'],
      sentiment: 'Cooperative'
    },
    urgency: 'Standard',
    slaDays: 30,
    statutoryAct: 'DPDP Act 2023 Sec. 11(1) & GDPR Art. 20 (Data Portability)',
    transferredTo: {
      department: 'HR & Talent Privacy',
      assignedOwner: 'Vikram Singhania (Head of HR Operations)',
      ownerEmail: 'hr-privacy@client.example',
      ownerRole: 'HR Privacy Lead',
      transferredAt: '28 Sep 2026, 14:42 IST',
      transferReason: 'Employee record export and tax certificate compilation routed to HR Operations.'
    },
    acknowledgement: {
      status: 'Delivered',
      sentAt: '28 Sep 2026, 14:40:40 IST',
      channel: 'linkedin',
      recipientContact: 'Rajesh Singhal (LinkedIn InMail)',
      messagePreview: 'Dear Rajesh, your employee data portability request (INTK-9108) has been routed to HR Operations. Please complete employment ID verification.',
      trackingToken: 'ACK-LNK-9108-5519'
    },
    attachedForm: {
      formId: 'FORM-PORT-9108',
      formTitle: 'Ex-Employee Identity & Data Portability Scope Form',
      formType: 'DSAR Supplementary Details',
      formUrl: 'https://privacy.client.example/forms/employee/INTK-9108',
      status: 'Completed & Verified',
      dispatchedAt: '28 Sep 2026, 14:40:40 IST',
      completedAt: '28 Sep 2026, 14:55:00 IST',
      idProofUploaded: true,
      idProofType: 'Ex-Employee ID Card & PAN',
      idProofFileName: 'rajesh_nb_id_card.pdf',
      requesterNotes: 'Verified Employee ID NB-4091 against HRMS database.'
    },
    status: 'Transferred',
    auditTrail: [
      {
        timestamp: '28 Sep 2026, 14:40:00 IST',
        actor: 'LinkedIn Lead & Message Ingestion Bot',
        action: 'Ingested InMail',
        note: 'Captured InMail from ex-employee Rajesh Singhal.'
      },
      {
        timestamp: '28 Sep 2026, 14:41:00 IST',
        actor: 'AI Classifier',
        action: 'Auto-Categorized',
        note: 'Categorized as Data Portability / Employee Persona (96% confidence).'
      },
      {
        timestamp: '28 Sep 2026, 14:42:00 IST',
        actor: 'Smart Routing Engine',
        action: 'Transferred',
        note: 'Assigned to HR & Talent Privacy (Vikram Singhania).'
      }
    ]
  },
  {
    id: 'INTK-9109',
    channel: 'google_web',
    receivedAt: '28 Sep 2026, 15:15 IST',
    requesterName: 'Manish Chawla',
    requesterEmail: 'manish.chawla@venturecapital.in',
    requesterPhone: '+91 99100 88776',
    requesterPersona: 'Partner/Vendor',
    rawSubject: 'Inquiry via Website Homepage Privacy Widget / Help Search',
    rawPayload: `Google Search Landing -> Homepage Privacy Help Desk Widget:\nUser entered query: "What third-party sub-processors and cloud hosting providers does Client Organization use for processing retail investor data? Is our data transferred outside India?"\nContact provided: manish.chawla@venturecapital.in`,
    category: 'General Privacy Query',
    categoryConfidence: 93,
    categoryReasoning: 'Inquiry regarding third-party sub-processors, cross-border data transfers, and cloud infrastructure compliance.',
    extractedEntities: {
      name: 'Manish Chawla',
      email: 'manish.chawla@venturecapital.in',
      phone: '+91 99100 88776',
      identifiers: ['Sub-processors list', 'Cross-border transfer', 'Cloud hosting'],
      statutoryKeywords: ['Third-party sub-processors', 'Data transfer outside India', 'DPDP Act Sec 16'],
      sentiment: 'Neutral'
    },
    urgency: 'Standard',
    slaDays: 15,
    statutoryAct: 'DPDP Act 2023 Sec. 16 (Transfer of Personal Data Outside India)',
    transferredTo: {
      department: 'Privacy & Compliance Office',
      assignedOwner: 'Ananya Mehta (Privacy Officer)',
      ownerEmail: 'privacy@client.example',
      ownerRole: 'Data Protection Officer',
      transferredAt: '28 Sep 2026, 15:16 IST',
      transferReason: 'Sub-processor transparency and cross-border transfer schedule routed to Privacy Office.'
    },
    acknowledgement: {
      status: 'Delivered',
      sentAt: '28 Sep 2026, 15:15:30 IST',
      channel: 'google_web',
      recipientContact: 'manish.chawla@venturecapital.in',
      messagePreview: 'Dear Manish, thank you for your query regarding Client Organization sub-processors. Case INTK-9109 has been assigned to our Privacy Office. View our published sub-processor transparency list in the attached link.',
      trackingToken: 'ACK-WEB-9109-0012'
    },
    attachedForm: {
      formId: 'FORM-INFO-9109',
      formTitle: 'Sub-Processor Transparency & Cross-Border Disclosure Request',
      formType: 'DSAR Supplementary Details',
      formUrl: 'https://privacy.client.example/info/INTK-9109',
      status: 'Completed & Verified',
      dispatchedAt: '28 Sep 2026, 15:15:30 IST',
      completedAt: '28 Sep 2026, 15:20:00 IST',
      idProofUploaded: false,
      requesterNotes: 'Provided institutional partner contact details for disclosure report.'
    },
    status: 'Transferred',
    auditTrail: [
      {
        timestamp: '28 Sep 2026, 15:15:00 IST',
        actor: 'Homepage Search / Privacy Help Widget',
        action: 'Ingested Organic Query',
        note: 'Captured inquiry originating from Google search landing on homepage.'
      },
      {
        timestamp: '28 Sep 2026, 15:15:20 IST',
        actor: 'AI Classifier',
        action: 'Auto-Categorized',
        note: 'Categorized as General Privacy Query / Sub-processor Transparency.'
      },
      {
        timestamp: '28 Sep 2026, 15:16:00 IST',
        actor: 'Smart Routing Engine',
        action: 'Transferred',
        note: 'Assigned to Privacy & Compliance Office.'
      }
    ]
  }
];

export const CHANNEL_CONFIGS: ChannelSummary[] = [
  {
    channel: 'email',
    title: 'Email Ingestion',
    iconName: 'Mail',
    activeCount: 18,
    totalCount: 342,
    avgResponseSeconds: 1.1,
    status: 'Operational',
    endpoint: 'privacy@client.example',
    badgeColor: 'blue'
  },
  {
    channel: 'whatsapp',
    title: 'WhatsApp Business API',
    iconName: 'MessageSquare',
    activeCount: 12,
    totalCount: 289,
    avgResponseSeconds: 0.8,
    status: 'Operational',
    endpoint: '+91 98000 12345 (Meta Webhook v19.0)',
    badgeColor: 'emerald'
  },
  {
    channel: 'chatbot',
    title: 'Website AI Chatbot',
    iconName: 'Bot',
    activeCount: 9,
    totalCount: 215,
    avgResponseSeconds: 0.5,
    status: 'Operational',
    endpoint: 'https://api.client.example/v1/chat/privacy',
    badgeColor: 'indigo'
  },
  {
    channel: 'webform',
    title: 'Statutory Webform',
    iconName: 'FileSpreadsheet',
    activeCount: 24,
    totalCount: 512,
    avgResponseSeconds: 0.4,
    status: 'Operational',
    endpoint: 'https://privacy.client.example/request',
    badgeColor: 'violet'
  },
  {
    channel: 'calls',
    title: 'Customer Calls / IVR',
    iconName: 'PhoneCall',
    activeCount: 7,
    totalCount: 148,
    avgResponseSeconds: 2.4,
    status: 'Operational',
    endpoint: 'IVR Voice Trunk + Twilio Speech-to-Text API',
    badgeColor: 'amber'
  },
  {
    channel: 'social',
    title: 'Social Media (X / IG)',
    iconName: 'Share2',
    activeCount: 5,
    totalCount: 94,
    avgResponseSeconds: 1.5,
    status: 'Operational',
    endpoint: 'X API v2 Webhook & Meta Graph API',
    badgeColor: 'sky'
  },
  {
    channel: 'app_stores',
    title: 'Apple & Google Play',
    iconName: 'Smartphone',
    activeCount: 4,
    totalCount: 76,
    avgResponseSeconds: 3.2,
    status: 'Operational',
    endpoint: 'App Store Connect & Google Play Console Webhook',
    badgeColor: 'rose'
  },
  {
    channel: 'linkedin',
    title: 'LinkedIn InMail',
    iconName: 'Linkedin',
    activeCount: 3,
    totalCount: 62,
    avgResponseSeconds: 2.0,
    status: 'Operational',
    endpoint: 'LinkedIn Marketing & Messaging API v2',
    badgeColor: 'blue'
  },
  {
    channel: 'google_web',
    title: 'Google / Homepage',
    iconName: 'Globe',
    activeCount: 6,
    totalCount: 118,
    avgResponseSeconds: 0.9,
    status: 'Operational',
    endpoint: 'https://client.example/privacy-widget',
    badgeColor: 'teal'
  }
];

export const SIMULATION_PRESETS: {
  channel: IntakeChannel;
  title: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  persona: 'Customer' | 'Employee' | 'Job Candidate' | 'Partner/Vendor' | 'Anonymous User';
  rawPayload: string;
  expectedCategory: import('../types/intake').RequestCategory;
  expectedDepartment: import('../types/intake').TargetDepartment;
  assignedOwner: string;
}[] = [
  {
    channel: 'whatsapp',
    title: 'WhatsApp: Erasure of Credit Card Telemarketing Data',
    requesterName: 'Deepak Patel',
    requesterEmail: 'deepak.patel@ahmedabadchem.com',
    requesterPhone: '+91 98790 44556',
    persona: 'Customer',
    rawPayload: 'Hello, please delete all my financial records and phone numbers from your telemarketing list immediately. I closed my Demat account with Client last month. Do not call me again.',
    expectedCategory: 'Right to Erasure / Deletion',
    expectedDepartment: 'Privacy & Compliance Office',
    assignedOwner: 'Ananya Mehta (Privacy Officer)'
  },
  {
    channel: 'email',
    title: 'Email: Formal DPDP Sec 11 Right of Access for Loan Account',
    requesterName: 'Sunita Rao',
    requesterEmail: 'sunita.rao@blrtech.in',
    requesterPhone: '+91 98450 77889',
    persona: 'Customer',
    rawPayload: 'Dear Privacy Officer, Under Section 11 of the DPDP Act 2023, I hereby request a full copy of all personal data held about me regarding Home Loan #HL-90912 and insurance policies.',
    expectedCategory: 'Right of Access (DSAR)',
    expectedDepartment: 'Privacy & Compliance Office',
    assignedOwner: 'Ananya Mehta (Privacy Officer)'
  },
  {
    channel: 'chatbot',
    title: 'Chatbot: Candidate CV & Interview Records Deletion',
    requesterName: 'Arjun Nambiar',
    requesterEmail: 'arjun.nambiar@talent.io',
    requesterPhone: '+91 97455 11224',
    persona: 'Job Candidate',
    rawPayload: 'Hi, I applied for the VP Technology role last quarter. Please purge my CV, salary slips, and interview evaluation notes from your HR database as per DPDP right to erasure.',
    expectedCategory: 'Right to Erasure / Deletion',
    expectedDepartment: 'HR & Talent Privacy',
    assignedOwner: 'Vikram Singhania (Head of HR Operations)'
  },
  {
    channel: 'webform',
    title: 'Webform: Correction of KYC Address and Mobile Number',
    requesterName: 'Meenakshi Sundaram',
    requesterEmail: 'meenakshi.s@chennaicorp.com',
    requesterPhone: '+91 94440 22119',
    persona: 'Customer',
    rawPayload: 'I have relocated to Bengaluru. Please update my registered residential address and Aadhaar link in Core Enterprise DB to avoid failed transaction notices.',
    expectedCategory: 'Right to Rectification / Correction',
    expectedDepartment: 'Customer Support Operations',
    assignedOwner: 'Neha Kapoor (Support Lead)'
  },
  {
    channel: 'calls',
    title: 'Customer Call: Voice Transcript revoking third-party credit bureau sharing',
    requesterName: 'Harish Joshi',
    requesterEmail: 'harish.joshi@puneauto.co.in',
    requesterPhone: '+91 98220 66778',
    persona: 'Customer',
    rawPayload: '[Voice Transcript]: "Agent, I am calling to withdraw my consent for Client sharing my credit repayment behavior with third-party insurance brokers. I want immediate confirmation."',
    expectedCategory: 'Consent Revocation / Opt-Out',
    expectedDepartment: 'Privacy & Compliance Office',
    assignedOwner: 'Ananya Mehta (Privacy Officer)'
  },
  {
    channel: 'social',
    title: 'Social Media: Twitter DM querying Facebook Pixel SDK on Banking Login',
    requesterName: 'Ravi Teja',
    requesterEmail: 'ravi.teja@hyderabadcloud.com',
    requesterPhone: '+91 98850 33445',
    persona: 'Customer',
    rawPayload: '@ClientBank DM: "Why does your online banking portal fire tracking tags to third-party ad networks before login? Please explain your tracking telemetry under DPDP Act."',
    expectedCategory: 'Security & Breach Inquiry',
    expectedDepartment: 'IT & Security Engineering',
    assignedOwner: 'Amit Shah (Head of Information Security)'
  },
  {
    channel: 'app_stores',
    title: 'App Store: Review threatening DPBI complaint over missing deletion button',
    requesterName: 'Natasha Bose',
    requesterEmail: 'natasha.bose@kolkatamedia.org',
    requesterPhone: '+91 98300 55661',
    persona: 'Customer',
    rawPayload: '★☆☆☆☆ App Store Review: "App does not allow deleting account. Will file complaint with Data Protection Board of India if my account is not wiped immediately."',
    expectedCategory: 'Grievance / Escalation',
    expectedDepartment: 'Legal & Regulatory Counsel',
    assignedOwner: 'Meera Sen (Chief Legal Officer)'
  },
  {
    channel: 'linkedin',
    title: 'LinkedIn: Ex-Employee requesting machine-readable export of PF & Tax Slips',
    requesterName: 'Tarun Saxena',
    requesterEmail: 'tarun.saxena@delhiventures.com',
    requesterPhone: '+91 98100 99887',
    persona: 'Employee',
    rawPayload: 'LinkedIn Message: "Hello HR team, I worked at Client until Dec 2025. Please provide an export of all my Form 16s, salary certificates, and appraisal files in JSON format as per DPDP portability."',
    expectedCategory: 'Data Portability',
    expectedDepartment: 'HR & Talent Privacy',
    assignedOwner: 'Vikram Singhania (Head of HR Operations)'
  },
  {
    channel: 'google_web',
    title: 'Google Search / Homepage: Inquiry about sub-processor cloud locations',
    requesterName: 'Pooja Bhatt',
    requesterEmail: 'pooja.bhatt@mumbaifin.in',
    requesterPhone: '+91 98200 11992',
    persona: 'Partner/Vendor',
    rawPayload: 'Homepage Search Query: "Are our company financial records hosted on AWS Mumbai or transferred to AWS US East? Please share the list of approved cloud sub-processors."',
    expectedCategory: 'General Privacy Query',
    expectedDepartment: 'Privacy & Compliance Office',
    assignedOwner: 'Ananya Mehta (Privacy Officer)'
  }
];
