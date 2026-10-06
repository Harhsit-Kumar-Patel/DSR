import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DSRCase, 
  Grievance, 
  GapRecord, 
  DSRStage, 
  DataTreatment, 
  RequestType, 
  Persona, 
  RequestChannel,
  ActivityEvent,
  CollectedDataRecord
} from '../types/dsr';
import { 
  INITIAL_DSR_CASES, 
  INITIAL_GRIEVANCES, 
  INITIAL_GAPS,
  INITIAL_MATCHED_PROCESSES 
} from '../mockData/initialData';
import confetti from 'canvas-confetti';

export type ActiveView = 
  | 'overview' 
  | 'dsr-list' 
  | 'dsr-workspace' 
  | 'grievances' 
  | 'gap-analysis' 
  | 'pdi-catalog' 
  | 'portal-intake';

export type WorkspaceTab = 
  | 'overview' 
  | 'discovery' 
  | 'tasks' 
  | 'data' 
  | 'review' 
  | 'activity';

interface DSRContextType {
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  selectedDsrId: string;
  setSelectedDsrId: (id: string) => void;
  activeWorkspaceTab: WorkspaceTab;
  setActiveWorkspaceTab: (tab: WorkspaceTab) => void;
  selectedGrievanceId: string;
  setSelectedGrievanceId: (id: string) => void;
  
  dsrCases: DSRCase[];
  selectedDSR: DSRCase;
  grievances: Grievance[];
  selectedGrievance?: Grievance;
  gaps: GapRecord[];
  
  // Actions
  navigateToDSR: (dsrId: string, tab?: WorkspaceTab) => void;
  navigateToGrievance: (grievanceId: string) => void;
  completeTask: (dsrId: string, taskId: string, customNotes?: string) => void;
  updateDataTreatment: (
    dsrId: string, 
    recordId: string, 
    treatment: DataTreatment, 
    reason?: string, 
    reviewerNotes?: string
  ) => void;
  approveDecision: (dsrId: string, recordId: string) => void;
  approveResponsePackage: (dsrId: string) => void;
  sendResponsePackage: (dsrId: string) => void;
  createPDIGapFromConflict: (dsrId: string) => void;
  createDSRFromPortal: (data: {
    fullName: string;
    email: string;
    phone: string;
    persona: Persona;
    requestType: RequestType;
    channel: RequestChannel;
    description: string;
  }) => string;
  updateGrievanceStage: (
    grievanceId: string, 
    newStage: Grievance['stage'], 
    newStatus: Grievance['status'], 
    internalNote?: string
  ) => void;
  resetDemoData: () => void;
  
  // Toast notifications
  toastMessage: string | null;
  toastType: 'success' | 'info' | 'warning' | 'error' | null;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const STORAGE_KEY_CASES = 'dutro_dsr_cases_v2';
const STORAGE_KEY_GRIEVANCES = 'dutro_dsr_grievances_v2';
const STORAGE_KEY_GAPS = 'dutro_dsr_gaps_v2';

const DSRContext = createContext<DSRContextType | undefined>(undefined);

export const DSRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ActiveView>('overview');
  const [selectedDsrId, setSelectedDsrId] = useState<string>('DSR-1024');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('discovery');
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string>('GRV-102');

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

  // State with LocalStorage fallbacks
  const [dsrCases, setDsrCases] = useState<DSRCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CASES);
      return saved ? JSON.parse(saved) : INITIAL_DSR_CASES;
    } catch {
      return INITIAL_DSR_CASES;
    }
  });

  const [grievances, setGrievances] = useState<Grievance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GRIEVANCES);
      return saved ? JSON.parse(saved) : (INITIAL_GRIEVANCES as any);
    } catch {
      return INITIAL_GRIEVANCES as any;
    }
  });

  const [gaps, setGaps] = useState<GapRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GAPS);
      return saved ? JSON.parse(saved) : INITIAL_GAPS;
    } catch {
      return INITIAL_GAPS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(dsrCases));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [dsrCases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GRIEVANCES, JSON.stringify(grievances));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [grievances]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GAPS, JSON.stringify(gaps));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [gaps]);

  const selectedDSR = dsrCases.find((c) => c.id === selectedDsrId) || dsrCases[0];
  const selectedGrievance = grievances.find((g) => g.id === selectedGrievanceId) || grievances[0];

  const navigateToDSR = (dsrId: string, tab: WorkspaceTab = 'overview') => {
    setSelectedDsrId(dsrId);
    setActiveWorkspaceTab(tab);
    setCurrentView('dsr-workspace');
  };

  const navigateToGrievance = (grievanceId: string) => {
    setSelectedGrievanceId(grievanceId);
    setCurrentView('grievances');
  };

  const completeTask = (dsrId: string, taskId: string, customNotes?: string) => {
    setDsrCases((prevCases) => {
      return prevCases.map((c) => {
        if (c.id !== dsrId) return c;

        const targetTask = c.tasks.find((t) => t.id === taskId);
        if (!targetTask) return c;

        const updatedTasks = c.tasks.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'Completed' as const,
              completedDate: new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              submittedNotes: customNotes || t.submittedNotes || 'Data extracted and verified against source platform.',
            };
          }
          return t;
        });

        // Add corresponding data items if not already present
        let updatedCollectedData = [...c.collectedData];

        if (taskId === 'task-103' && !c.collectedData.some((r) => r.fieldName === 'Invoice #INV-2048')) {
          const billingRecords: CollectedDataRecord[] = [
            {
              id: `rec-bill-1-${Date.now()}`,
              dsrId,
              processId: 'proc-3',
              processName: 'Billing & Invoicing',
              department: 'Finance',
              sourceSystem: 'Billing System (Stripe & NetSuite)',
              category: 'Financial Information',
              fieldName: 'Invoice #INV-2048',
              value: 'Invoice #INV-2048 (Paid: INR 45,000 + 18% GST = INR 53,100 on 12 Jan 2026; Paid via Corporate Mastercard *8832)',
              evidenceId: 'EV-3011',
              proposedTreatment: 'DISCLOSE',
              decisionReason: 'Commercial transactional receipt directly associated with requester account.',
              policyReference: 'DPDP Act Sec. 11 Right of Access',
              relationship: 'Requester',
              isHumanReviewed: true,
            },
            {
              id: `rec-bill-2-${Date.now()}`,
              dsrId,
              processId: 'proc-3',
              processName: 'Billing & Invoicing',
              department: 'Finance',
              sourceSystem: 'Billing System (Stripe)',
              category: 'Financial Information',
              fieldName: 'Payment Instrument Record',
              value: 'Mastercard ending in *8832 (Token: tok_1NyT294GvL8Z)',
              evidenceId: 'EV-3011',
              proposedTreatment: 'DISCLOSE',
              decisionReason: 'Masked payment credential stored for recurring subscription billing.',
              policyReference: 'PCI-DSS Tokenization & DPDP Act Sec. 11',
              relationship: 'Requester',
              isHumanReviewed: true,
            },
          ];
          updatedCollectedData = [...updatedCollectedData, ...billingRecords];
        }

        if (taskId === 'task-104' && !c.collectedData.some((r) => r.fieldName === 'Marketing Newsletter Subscription')) {
          const marketingRecords: CollectedDataRecord[] = [
            {
              id: `rec-mkt-1-${Date.now()}`,
              dsrId,
              processId: 'proc-4',
              processName: 'Marketing Communications',
              department: 'Marketing',
              sourceSystem: 'Marketing Platform (HubSpot)',
              category: 'Consent & Preferences',
              fieldName: 'Marketing Newsletter Subscription',
              value: 'Subscribed to Monthly Privacy & DPDP Digest (Double Opt-In Confirmed 12 Jan 2026)',
              evidenceId: 'EV-4089',
              proposedTreatment: 'DISCLOSE',
              decisionReason: 'Marketing communication preferences linked to requester official email.',
              policyReference: 'DPDP Act Sec. 6 Notice and Consent Records',
              relationship: 'Requester',
              isHumanReviewed: true,
            },
            {
              id: `rec-mkt-2-${Date.now()}`,
              dsrId,
              processId: 'proc-4',
              processName: 'Marketing Communications',
              department: 'Marketing',
              sourceSystem: 'Marketing Platform (HubSpot)',
              category: 'Event Engagement',
              fieldName: 'Webinar Attendance Log',
              value: 'Attended live webinar: "Navigating Enterprise DSAR Compliance in 2026" (Registered: 18 May 2026)',
              evidenceId: 'EV-4089',
              proposedTreatment: 'DISCLOSE',
              decisionReason: 'Virtual event participation history.',
              policyReference: 'DPDP Act Sec. 11 Right of Access',
              relationship: 'Requester',
              isHumanReviewed: true,
            },
          ];
          updatedCollectedData = [...updatedCollectedData, ...marketingRecords];
        }

        const allTasksDone = updatedTasks.every((t) => t.status === 'Completed');
        const nextStage: DSRStage = allTasksDone ? 'Review' : 'Collection';

        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          dsrId,
          timestamp: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          title: `Task Completed: ${targetTask.title}`,
          description: `${targetTask.owner} (${targetTask.department}) submitted evidence (${targetTask.evidenceId || 'Uploaded'}). Data ingested automatically into Data Tab.`,
          actor: targetTask.owner,
          actorRole: targetTask.department,
          type: 'task',
        };

        return {
          ...c,
          tasks: updatedTasks,
          collectedData: updatedCollectedData,
          currentStage: nextStage,
          status: allTasksDone ? 'In Progress' : c.status,
          activityTimeline: [newActivity, ...c.activityTimeline],
        };
      });
    });

    showToast(`Task marked as Completed! Evidence & records populated in Data tab.`, 'success');
  };

  const updateDataTreatment = (
    dsrId: string,
    recordId: string,
    treatment: DataTreatment,
    reason?: string,
    reviewerNotes?: string
  ) => {
    setDsrCases((prevCases) => {
      return prevCases.map((c) => {
        if (c.id !== dsrId) return c;

        let recordName = '';
        const updatedRecords = c.collectedData.map((r) => {
          if (r.id === recordId) {
            recordName = r.fieldName;
            return {
              ...r,
              proposedTreatment: treatment,
              decisionReason: reason || r.decisionReason,
              reviewNotes: reviewerNotes || r.reviewNotes,
              isHumanReviewed: true,
              reviewedBy: 'Priya Sharma (Privacy Officer)',
            };
          }
          return r;
        });

        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          dsrId,
          timestamp: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          title: `Treatment Updated: ${recordName} → ${treatment}`,
          description: `Privacy Officer updated classification to ${treatment}. Reason: ${reason || 'Manual review modification.'}`,
          actor: 'Priya Sharma',
          actorRole: 'Privacy Officer',
          type: 'review',
        };

        return {
          ...c,
          collectedData: updatedRecords,
          activityTimeline: [newActivity, ...c.activityTimeline],
        };
      });
    });

    showToast(`Treatment updated to ${treatment} with updated legal justification.`, 'info');
  };

  const approveDecision = (dsrId: string, recordId: string) => {
    setDsrCases((prevCases) => {
      return prevCases.map((c) => {
        if (c.id !== dsrId) return c;

        let fieldName = '';
        const updatedRecords = c.collectedData.map((r) => {
          if (r.id === recordId) {
            fieldName = r.fieldName;
            return {
              ...r,
              isHumanReviewed: true,
              reviewedBy: 'Priya Sharma (Privacy Officer)',
            };
          }
          return r;
        });

        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          dsrId,
          timestamp: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          title: `Treatment Decision Approved: ${fieldName}`,
          description: `Priya Sharma ratified automated classification treatment.`,
          actor: 'Priya Sharma',
          actorRole: 'Privacy Officer',
          type: 'review',
        };

        return {
          ...c,
          collectedData: updatedRecords,
          activityTimeline: [newActivity, ...c.activityTimeline],
        };
      });
    });

    showToast(`Decision ratified and confirmed for response package.`, 'success');
  };

  const approveResponsePackage = (dsrId: string) => {
    setDsrCases((prevCases) => {
      return prevCases.map((c) => {
        if (c.id !== dsrId) return c;

        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          dsrId,
          timestamp: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          title: 'Response Package Approved by Client',
          description: 'Client Legal/Privacy Counsel approved final redacted disclosure package. State transitioned to Ready to Send.',
          actor: 'Amit Verma',
          actorRole: 'General Counsel (Dutro India)',
          type: 'response',
        };

        return {
          ...c,
          currentStage: 'Approval',
          status: 'Ready to Send',
          approvalStatus: 'Approved',
          activityTimeline: [newActivity, ...c.activityTimeline],
        };
      });
    });

    showToast('Response package approved! Ready for final transmission to requester.', 'success');
  };

  const sendResponsePackage = (dsrId: string) => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#06b6d4', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    setDsrCases((prevCases) => {
      return prevCases.map((c) => {
        if (c.id !== dsrId) return c;

        const formattedDate = new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          dsrId,
          timestamp: formattedDate,
          title: 'Response Package Dispatched to Requester',
          description: `Cryptographically signed disclosure PDF & secure download link transmitted to ${c.requesterEmail}. Audit trail archived.`,
          actor: 'Dutro Response Dispatcher',
          actorRole: 'System Gateway',
          type: 'response',
        };

        return {
          ...c,
          currentStage: 'Response',
          status: 'Response Sent',
          approvalStatus: 'Sent',
          responseSentDate: formattedDate,
          activityTimeline: [newActivity, ...c.activityTimeline],
        };
      });
    });

    showToast('Response sent successfully! Complete audit trail preserved.', 'success');
  };

  const createPDIGapFromConflict = (dsrId: string) => {
    const newGapId = `GAP-304`;
    const newGap: GapRecord = {
      id: newGapId,
      title: 'Customer phone data exists outside currently mapped CRM process (Unmapped SharePoint Excel File)',
      sourceDsrId: dsrId,
      severity: 'Medium',
      status: 'Open',
      department: 'Customer Support & IT Ops',
      identifiedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: `Discovered during DSR-1024 data collection. Customer Support maintains an offline Excel sheet (Support_Escalations_2026.xlsx) on SharePoint containing data principal direct phone numbers without active PDI/RoPA mapping or automated retention governance.`,
      remediationPlan: 'Migrate offline Excel records into Salesforce CRM custom fields, decommission SharePoint spreadsheet, and update RoPA Process #proc-2.',
      assignedOwner: 'Anjali Verma (Head of Support) & IT Sec',
    };

    setGaps((prev) => [newGap, ...prev.filter((g) => g.id !== newGapId)]);

    setDsrCases((prevCases) => {
      return prevCases.map((c) => {
        if (c.id !== dsrId || !c.pdiConflict) return c;

        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          dsrId,
          timestamp: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          title: `PDI Gap Created: ${newGapId}`,
          description: `Discrepancy escalated to Dutro Gap Analysis module: "${newGap.title}". Continuous privacy data map improvement initiated.`,
          actor: 'Priya Sharma',
          actorRole: 'Privacy Officer',
          type: 'conflict',
        };

        return {
          ...c,
          pdiConflict: {
            ...c.pdiConflict,
            status: 'Gap Created',
            createdGapId: newGapId,
          },
          activityTimeline: [newActivity, ...c.activityTimeline],
        };
      });
    });

    showToast(`Data Map Conflict resolved into Gap Analysis record ${newGapId}!`, 'success');
  };

  const createDSRFromPortal = (data: {
    fullName: string;
    email: string;
    phone: string;
    persona: Persona;
    requestType: RequestType;
    channel: RequestChannel;
    description: string;
  }) => {
    const nextNum = 1028 + (dsrCases.length - 4);
    const newId = `DSR-${nextNum}`;

    const newCase: DSRCase = {
      id: newId,
      requesterName: data.fullName,
      requesterEmail: data.email,
      requesterPhone: data.phone,
      persona: data.persona,
      requestType: data.requestType,
      channel: data.channel,
      legalEntity: 'Dutro India Pvt Ltd',
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      currentStage: 'Received',
      owner: 'Priya Sharma',
      ownerRole: 'Privacy Officer',
      slaDaysRemaining: 30,
      status: 'Awaiting Verification',
      preferredResponse: 'Email',
      verification: {
        status: 'Pending',
        method: 'Registered Email OTP Verification',
        confidenceScore: 75,
        verificationNotes: 'Verification magic link dispatched to requester email address.',
      },
      summary: data.description || `Data principal submitted a ${data.requestType} request via ${data.channel}.`,
      matchedProcesses: INITIAL_MATCHED_PROCESSES.slice(0, 2),
      tasks: [
        {
          id: `task-${newId}-1`,
          dsrId: newId,
          title: 'Verify Requester Identity & Match Profile',
          processName: 'Identity Verification',
          department: 'Privacy Ops',
          owner: 'Priya Sharma',
          ownerEmail: 'priya.sharma@dutro.com',
          status: 'Pending',
          dueDate: '30 Sep 2026',
          dataRequired: ['Email confirmation', 'Photo ID'],
          instructions: 'Check token validity in verification service.',
        },
      ],
      collectedData: [],
      approvalStatus: 'Draft',
      activityTimeline: [
        {
          id: `act-${newId}-1`,
          dsrId: newId,
          timestamp: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          title: `DSR Submitted via ${data.channel}`,
          description: `New ${data.requestType} request submitted by ${data.fullName} (${data.email}). Case initialized.`,
          actor: data.fullName,
          actorRole: data.persona,
          type: 'user',
        },
      ],
    };

    setDsrCases((prev) => [newCase, ...prev]);
    showToast(`New case ${newId} created successfully via ${data.channel}!`, 'success');
    return newId;
  };

  const updateGrievanceStage = (
    grievanceId: string,
    newStage: Grievance['stage'],
    newStatus: Grievance['status'],
    internalNote?: string
  ) => {
    setGrievances((prev) => {
      return prev.map((g) => {
        if (g.id !== grievanceId) return g;
        return {
          ...g,
          stage: newStage,
          status: newStatus,
          internalReviewNotes: internalNote ? `${g.internalReviewNotes}\n\n[Updated]: ${internalNote}` : g.internalReviewNotes,
        };
      });
    });

    showToast(`Grievance ${grievanceId} progressed to ${newStage}.`, 'info');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_CASES);
    localStorage.removeItem(STORAGE_KEY_GRIEVANCES);
    localStorage.removeItem(STORAGE_KEY_GAPS);
    setDsrCases(INITIAL_DSR_CASES);
    setGrievances(INITIAL_GRIEVANCES as any);
    setGaps(INITIAL_GAPS);
    setSelectedDsrId('DSR-1024');
    setActiveWorkspaceTab('discovery');
    setCurrentView('dsr-workspace');
    showToast('Demo data reset to baseline state.', 'info');
  };

  return (
    <DSRContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedDsrId,
        setSelectedDsrId,
        activeWorkspaceTab,
        setActiveWorkspaceTab,
        selectedGrievanceId,
        setSelectedGrievanceId,
        dsrCases,
        selectedDSR,
        grievances,
        selectedGrievance,
        gaps,
        navigateToDSR,
        navigateToGrievance,
        completeTask,
        updateDataTreatment,
        approveDecision,
        approveResponsePackage,
        sendResponsePackage,
        createPDIGapFromConflict,
        createDSRFromPortal,
        updateGrievanceStage,
        resetDemoData,
        toastMessage,
        toastType,
        showToast,
      }}
    >
      {children}
    </DSRContext.Provider>
  );
};

export const useDSR = () => {
  const context = useContext(DSRContext);
  if (!context) {
    throw new Error('useDSR must be used within a DSRProvider');
  }
  return context;
};
