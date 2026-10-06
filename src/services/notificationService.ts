import { CustomerNotification, NotificationTriggerStage, PrivacyRequest, GrievanceRecord } from '../types';

export const createNotification = (
  triggerStage: NotificationTriggerStage,
  payload: {
    recipientName: string;
    recipientEmail: string;
    relatedId: string;
    request?: PrivacyRequest;
    grievance?: GrievanceRecord;
    customNote?: string;
  }
): CustomerNotification => {
  const timestamp = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) + ' IST';

  const id = `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

  switch (triggerStage) {
    case 'dsr-intake-received': {
      const dsrId = payload.relatedId;
      return {
        id,
        timestamp,
        recipientName: payload.recipientName,
        recipientEmail: payload.recipientEmail,
        triggerStage,
        triggerLabel: '1. Request Intake & Identity Verified',
        subject: `[Dutro Privacy] Right of Access Request Received & Verified — Ref: ${dsrId}`,
        previewText: `Your Right of Access request (${dsrId}) has been received and verified. The statutory 30-day resolution timeline is now active.`,
        bodyText: `Dear ${payload.recipientName},

We have received your statutory Right of Access (DSAR) request under the Digital Personal Data Protection Act 2023 (Sec. 11) and General Data Protection Regulation (Art. 15).

REQUEST DETAILS:
• Reference ID: ${dsrId}
• Requester: ${payload.recipientName} (${payload.recipientEmail})
• Request Type: Right of Access / Personal Data Disclosure
• Submission Timestamp: ${timestamp}
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
        relatedId: dsrId,
        read: false
      };
    }

    case 'dsr-output-delivered': {
      const dsrId = payload.relatedId;
      return {
        id,
        timestamp,
        recipientName: payload.recipientName,
        recipientEmail: payload.recipientEmail,
        triggerStage,
        triggerLabel: '2. Disclosure Package Output Delivered',
        subject: `[Dutro Privacy] Your Verified Personal Data Disclosure Package is Ready — Ref: ${dsrId}`,
        previewText: `Your personal data disclosure package for ${dsrId} has been verified and securely sent to your registered email (${payload.recipientEmail}).`,
        bodyText: `Dear ${payload.recipientName},

We are pleased to inform you that your Right of Access request (${dsrId}) has been fulfilled within statutory SLA compliance.

DELIVERY DETAILS:
• Reference ID: ${dsrId}
• Completion Date: ${timestamp}
• Delivery Status: Verified & Delivered to Registered Email
• Recipient Email: ${payload.recipientEmail}
• Format: Encrypted Personal Data Archive (.ZIP / .PDF)
• Package Contents: Identity Profile, Financial Records, Customer Interaction Logs, and Formal Disclosure Statement.

EMAIL DELIVERY CONFIRMATION:
The complete personal data disclosure package and statutory certificate have been sent directly to your registered email address (${payload.recipientEmail}). Please check your inbox and spam folder.

STATUTORY GRIEVANCE REDRESSAL RIGHTS:
If you believe any records were omitted, inaccurate, or excessively redacted, you have the statutory right under DPDP Act 2023 Sec. 13 to raise a formal grievance directly through the portal within 15 days.

Thank you for exercising your data privacy rights with us.

Warm regards,
Dutro Privacy Operations Office
Client Data Protection Team`,
        relatedId: dsrId,
        read: false
      };
    }

    case 'grievance-initiated': {
      const grvId = payload.relatedId;
      const linkedDsr = payload.grievance?.linkedDsrId || payload.request?.id || 'DSR-2001';
      return {
        id,
        timestamp,
        recipientName: payload.recipientName,
        recipientEmail: payload.recipientEmail,
        triggerStage,
        triggerLabel: '3. Grievance Initiated & Registered',
        subject: `[Dutro Redressal] Formal Grievance Registered & 15-Day Clock Started — Ref: ${grvId}`,
        previewText: `Your grievance (${grvId}) linked to ${linkedDsr} has been lodged. A dedicated Grievance Officer has been assigned under a 15-day SLA.`,
        bodyText: `Dear ${payload.recipientName},

This is an automated statutory acknowledgment confirming that your formal Redressal Grievance has been registered under the DPDP Act 2023 Sec. 13 / GDPR.

GRIEVANCE REGISTRATION DETAILS:
• Grievance Reference: ${grvId}
• Linked Access Request: ${linkedDsr}
• Lodgment Timestamp: ${timestamp}
• Stated Dispute: ${payload.grievance?.grievanceReason || 'Missing personal data records in disclosure'}
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
        relatedId: grvId,
        read: false
      };
    }

    case 'grievance-closed-initial-review': {
      const grvId = payload.relatedId;
      const linkedDsr = payload.grievance?.linkedDsrId || 'DSR-2001';
      return {
        id,
        timestamp,
        recipientName: payload.recipientName,
        recipientEmail: payload.recipientEmail,
        triggerStage,
        triggerLabel: '4. Grievance Closed at Initial Review',
        subject: `[Dutro Redressal] Grievance Resolved at Initial Review — Ref: ${grvId}`,
        previewText: `Your grievance ${grvId} has been resolved during Level 1 Initial Review. Supplementary records have been sent to your email.`,
        bodyText: `Dear ${payload.recipientName},

Your grievance (${grvId}) regarding request ${linkedDsr} has been investigated and resolved during Level 1 Initial Review.

DETERMINATION & REMEDIATION SUMMARY:
• Grievance ID: ${grvId}
• Resolution Stage: Initial Review (Level 1)
• Closure Timestamp: ${timestamp}
• Reviewing Officer: Meera Singh (Grievance Redressal Officer)
• Corrective Action: Omitted personal transaction statements and support notes were located in secondary system indices, validated, sanitized, and compiled into a Supplementary Disclosure Package.

DELIVERY CONFIRMATION:
The verified Supplementary Personal Data Package and Resolution Certificate have been sent directly to your registered email address (${payload.recipientEmail}).

${payload.customNote ? `\nOFFICER REMARKS:\n"${payload.customNote}"\n` : ''}
Thank you for your patience during this inquiry.

Warm regards,
Statutory Grievance Redressal Office
Dutro Privacy Operations Platform`,
        relatedId: grvId,
        read: false
      };
    }

    case 'grievance-closed-senior-review': {
      const grvId = payload.relatedId;
      const linkedDsr = payload.grievance?.linkedDsrId || 'DSR-2001';
      return {
        id,
        timestamp,
        recipientName: payload.recipientName,
        recipientEmail: payload.recipientEmail,
        triggerStage,
        triggerLabel: '5. Grievance Closed at Senior Review',
        subject: `[Dutro Redressal] Senior Privacy Review Determination & Remediation — Ref: ${grvId}`,
        previewText: `Your grievance ${grvId} has been resolved under Senior Privacy Review & Legal Counsel. Supplementary package sent to email.`,
        bodyText: `Dear ${payload.recipientName},

Following multi-tier escalation, your grievance (${grvId}) regarding request ${linkedDsr} has been resolved under Senior Privacy & Legal Counsel Review.

SENIOR DETERMINATION SUMMARY:
• Grievance ID: ${grvId}
• Resolution Stage: Senior Privacy Review (Level 2 Escalation)
• Closure Timestamp: ${timestamp}
• Reviewing Authority: Senior Privacy Officer & Legal Advisory Team
• Findings: Database administrators successfully performed deep queries across archival repositories and historical communication backups to retrieve the contested records.
• Statutory Compliance: Fully remediated in adherence with DPDP Act Sec. 13 & 32.

DELIVERY CONFIRMATION:
Your Supplementary Personal Data Disclosure Package and Senior Redressal Certificate have been securely dispatched to your registered email (${payload.recipientEmail}).

${payload.customNote ? `\nSENIOR REVIEW NOTES:\n"${payload.customNote}"\n` : ''}
Warm regards,
Senior Privacy & Grievance Redressal Board
Dutro Privacy Operations Platform`,
        relatedId: grvId,
        read: false
      };
    }

    case 'grievance-closed-final-review': {
      const grvId = payload.relatedId;
      const linkedDsr = payload.grievance?.linkedDsrId || 'DSR-2001';
      return {
        id,
        timestamp,
        recipientName: payload.recipientName,
        recipientEmail: payload.recipientEmail,
        triggerStage,
        triggerLabel: '6. Grievance Closed at Final DPO Review',
        subject: `[Dutro Redressal] Final Executive Statutory Determination & Certificate — Ref: ${grvId}`,
        previewText: `Final Determination issued by Data Protection Officer (DPO) for grievance ${grvId}. Statutory response sent to email.`,
        bodyText: `Dear ${payload.recipientName},

This is the official Final Statutory Determination Notice issued by the Data Protection Officer (DPO) and Executive Privacy Leadership regarding grievance ${grvId} (linked to ${linkedDsr}).

EXECUTIVE DPO DETERMINATION:
• Grievance ID: ${grvId}
• Resolution Authority: Data Protection Officer (DPO) & Executive Privacy Council
• Final Stage: Final Statutory Review (Step 6 of 6)
• Determination Timestamp: ${timestamp}
• Formal Resolution: The comprehensive re-discovery and third-party sanitization process has been completed and formally certified by the DPO. All eligible personal data records have been disclosed.
• Statutory Certificate: CERT-GRV-${grvId.replace('GRV-', '')}-2026

DELIVERY CONFIRMATION:
The complete Supplementary Personal Data Package and formal Statutory Resolution Certificate have been securely sent to your registered email (${payload.recipientEmail}).

${payload.customNote ? `\nDPO STATEMENT:\n"${payload.customNote}"\n` : ''}
This case is now formally closed in our records with complete statutory compliance.

Warm regards,
Office of the Data Protection Officer (DPO)
Dutro Privacy Operations Platform`,
        relatedId: grvId,
        read: false
      };
    }
  }
};
