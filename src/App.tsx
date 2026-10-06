import React, { useState, useEffect } from 'react';
import { 
  PrivacyRequest, 
  ClientTask, 
  BusinessProcess, 
  AuditEvent, 
  GrievanceRecord, 
  DSRWorkspaceFilter,
  BasicLocationCheckItem,
  RedactionReviewState,
  GrievanceStage,
  GrievanceStatus,
  PlatformUser,
  MainNavigationSection,
  AuthRole,
  CustomerAccount,
  ConsultantAccount,
  CustomerNotification,
  NotificationTriggerStage
} from './types';
import { 
  INITIAL_REQUESTS, 
  INITIAL_CLIENT_TASKS, 
  INITIAL_GRIEVANCES, 
  INITIAL_NOTIFICATIONS,
  MASTER_CLIENT, 
  MASTER_CUSTOMER, 
  MASTER_BUSINESS_PROCESSES,
  DEMO_USERS,
  DEFAULT_CUSTOMER_ACCOUNT,
  DEFAULT_CONSULTANT_ACCOUNT,
  INITIAL_REGISTERED_CUSTOMERS,
  createDefaultRedactionReview
} from './mockData/initialData';
import { createNotification } from './services/notificationService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/views/OverviewView';
import { RequestsList } from './components/RequestsList';
import { MyTasksView } from './components/views/MyTasksView';
import { RequestDetails } from './components/RequestDetails';
import { GrievancesView } from './components/views/GrievancesView';
import { DSRHistoryView } from './components/views/DSRHistoryView';
import { DataDiscoveryView } from './components/views/DataDiscoveryView';
import { DataSourcesCatalogView } from './components/views/DataSourcesCatalogView';
import { RedactionReviewsView } from './components/views/RedactionReviewsView';
import { SLADeadlinesView } from './components/views/SLADeadlinesView';
import { PlatformAuditTrailView } from './components/views/PlatformAuditTrailView';
import { SettingsView, SettingsTab } from './components/views/Settings/SettingsView';
import { CustomerAuthAndIntakeModal } from './components/CustomerAuthAndIntakeModal';
import { ModuleInfoModal } from './components/ModuleInfoModal';
import { EndToEndFlowModal } from './components/EndToEndFlowModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { IntakeProvider } from './context/IntakeContext';
import { AuthLandingPage } from './components/auth/AuthLandingPage';
import { CustomerDashboard } from './components/views/CustomerPortal/CustomerDashboard';

// Local storage persistent database keys
const STORAGE_KEY_AUTH_ROLE = 'dutro_v7_auth_role';
const STORAGE_KEY_CUSTOMER_ACCOUNT = 'dutro_v7_customer_account';
const STORAGE_KEY_CONSULTANT_ACCOUNT = 'dutro_v7_consultant_account';
const STORAGE_KEY_REGISTERED_CUSTOMERS = 'dutro_v7_registered_customers';
const STORAGE_KEY_REQUESTS = 'dutro_v7_dsr_requests';
const STORAGE_KEY_TASKS = 'dutro_v7_client_tasks';
const STORAGE_KEY_GRIEVANCES = 'dutro_v7_grievances';
const STORAGE_KEY_NOTIFICATIONS = 'dutro_v7_notifications';
const STORAGE_KEY_ACTIVE_USER = 'dutro_v7_active_user';
const STORAGE_KEY_SELECTED_ID = 'dutro_v7_selected_id';
const STORAGE_KEY_MAIN_VIEW = 'dutro_v7_main_view';
const STORAGE_KEY_FILTER_TAB = 'dutro_v7_filter_tab';

export const deduplicateTasks = (tasks: ClientTask[]): ClientTask[] => {
  const seenIds = new Set<string>();
  const seenProcessAndDsr = new Set<string>();
  const result: ClientTask[] = [];

  for (const t of tasks) {
    if (!t || !t.id) continue;
    const procKey = `${t.dsrId || 'DSR-2001'}__${t.processName || t.id}`;
    if (!seenIds.has(t.id) && !seenProcessAndDsr.has(procKey)) {
      seenIds.add(t.id);
      seenProcessAndDsr.add(procKey);
      result.push(t);
    }
  }
  return result;
};

export function App() {
  // 0. Authentication Role (Customer vs Dutro Consultant)
  const [authRole, setAuthRole] = useState<AuthRole | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH_ROLE);
      if (saved === 'customer' || saved === 'consultant') return saved as AuthRole;
    } catch (e) {
      console.warn('Failed to load auth role from storage:', e);
    }
    return null; // Show landing page first
  });

  // Customer Accounts DB in Storage
  const [registeredCustomers, setRegisteredCustomers] = useState<CustomerAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REGISTERED_CUSTOMERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(c => c.name?.toLowerCase() !== 'priya sharma' && c.email?.toLowerCase() !== 'priya.sharma@example.com');
          if (filtered.length > 0) return filtered;
        }
      }
    } catch (e) {
      console.warn('Failed to load registered customers:', e);
    }
    return [DEFAULT_CUSTOMER_ACCOUNT];
  });

  // Customer Profile State
  const [customerAccount, setCustomerAccount] = useState<CustomerAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOMER_ACCOUNT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.name?.toLowerCase() !== 'priya sharma') return parsed;
      }
    } catch (e) {
      console.warn('Failed to load customer account:', e);
    }
    return DEFAULT_CUSTOMER_ACCOUNT;
  });

  // Consultant Profile State
  const [consultantAccount, setConsultantAccount] = useState<ConsultantAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONSULTANT_ACCOUNT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load consultant account:', e);
    }
    return DEFAULT_CONSULTANT_ACCOUNT;
  });

  // 1. Current Logged-In User (Section 1: ONE Dashboard, Role-Based Access)
  const [currentUser, setCurrentUser] = useState<PlatformUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load active user from storage:', e);
    }
    return DEMO_USERS[0]; // Default: Harshit Patel (Dutro Consultant)
  });

  // 2. Requests State
  const [requests, setRequests] = useState<PrivacyRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REQUESTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(r => r.id !== 'DSR-2002' && r.personName?.toLowerCase() !== 'priya sharma');
          if (filtered.length > 0) {
            return filtered.map(req => ({
              ...req,
              slaDeadlineTimestamp: req.slaDeadlineTimestamp || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              slaStartTimestamp: req.slaStartTimestamp || new Date().toISOString(),
              receivedDate: req.receivedDate || '28 Sep 2026, 09:14 IST',
              priority: req.priority || 'High',
              status: req.status || 'In Progress',
              verificationStatus: req.verificationStatus || 'Verified',
              verificationMethod: req.verificationMethod || 'OTP'
            }));
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load requests from storage:', e);
    }
    return INITIAL_REQUESTS;
  });

  // 3. Client Tasks State
  const [clientTasks, setClientTasks] = useState<ClientTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(t => t.dsrId !== 'DSR-2002' && t.customerName?.toLowerCase() !== 'priya sharma');
          if (filtered.length > 0) {
            return deduplicateTasks(filtered);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load client tasks from storage:', e);
    }
    return INITIAL_CLIENT_TASKS;
  });

  // 4. Grievances State
  const [grievances, setGrievances] = useState<GrievanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GRIEVANCES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load grievances from storage:', e);
    }
    return INITIAL_GRIEVANCES;
  });

  // 4.5 Automated Customer Communications & Notifications State (6 Core Triggers)
  const [notifications, setNotifications] = useState<CustomerNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(n => n.relatedId !== 'DSR-2002' && n.recipientName?.toLowerCase() !== 'priya sharma');
          if (filtered.length > 0) return filtered;
        }
      }
    } catch (e) {
      console.warn('Failed to load notifications from storage:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const dispatchAutomatedNotification = (
    trigger: NotificationTriggerStage,
    payload: {
      recipientName: string;
      recipientEmail: string;
      relatedId: string;
      request?: PrivacyRequest;
      grievance?: GrievanceRecord;
      customNote?: string;
    }
  ) => {
    const notif = createNotification(trigger, payload);
    setNotifications(prev => [notif, ...prev]);
    return notif;
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // 5. Main Navigation View (Section 2)
  const [currentMainView, setCurrentMainView] = useState<MainNavigationSection>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MAIN_VIEW);
      if (saved && [
        'overview', 'workspace', 'my-tasks', 'details', 'grievances', 'history',
        'data-discovery', 'data-sources', 'redaction-reviews', 'sla-deadlines', 'audit-trail', 'settings'
      ].includes(saved)) {
        return saved as MainNavigationSection;
      }
    } catch (e) {
      console.warn('Failed to load main view from storage:', e);
    }
    return 'overview';
  });

  // 6. Active Filter Tab in DSR Workspace
  const [activeFilterTab, setActiveFilterTab] = useState<DSRWorkspaceFilter>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILTER_TAB);
      if (saved && ['all', 'overview', 'inbox', 'my-tasks', 'pending-verification', 'pending-client-action', 'completed', 'grievances', 'history'].includes(saved)) {
        return saved as DSRWorkspaceFilter;
      }
    } catch (e) {
      console.warn('Failed to load filter tab from storage:', e);
    }
    return 'inbox';
  });

  // 7. Settings Sub-tab
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsTab>('intake-webform');

  // 8. Selected Request & Grievance IDs
  const [selectedRequestId, setSelectedRequestId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SELECTED_ID);
      if (saved) return saved;
    } catch (e) {
      console.warn('Failed to load selectedRequestId from storage:', e);
    }
    return 'DSR-2001';
  });

  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | undefined>(undefined);
  const [demoKey, setDemoKey] = useState<number>(0);
  const [isCustomerIntakeModalOpen, setIsCustomerIntakeModalOpen] = useState(false);
  const [isGlobalFlowModalOpen, setIsGlobalFlowModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [activeModuleModal, setActiveModuleModal] = useState<string | null>(null);

  // Sync state to localStorage immediately on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    } catch (e) {
      console.warn('Failed to save requests:', e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(clientTasks));
    } catch (e) {
      console.warn('Failed to save tasks:', e);
    }
  }, [clientTasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GRIEVANCES, JSON.stringify(grievances));
    } catch (e) {
      console.warn('Failed to save grievances:', e);
    }
  }, [grievances]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Failed to save active user:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED_ID, selectedRequestId);
    } catch (e) {
      console.warn('Failed to save selectedRequestId:', e);
    }
  }, [selectedRequestId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MAIN_VIEW, currentMainView);
    } catch (e) {
      console.warn('Failed to save main view:', e);
    }
  }, [currentMainView]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FILTER_TAB, activeFilterTab);
    } catch (e) {
      console.warn('Failed to save filter tab:', e);
    }
  }, [activeFilterTab]);

  useEffect(() => {
    try {
      if (authRole) {
        localStorage.setItem(STORAGE_KEY_AUTH_ROLE, authRole);
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH_ROLE);
      }
    } catch (e) {
      console.warn('Failed to save auth role:', e);
    }
  }, [authRole]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOMER_ACCOUNT, JSON.stringify(customerAccount));
    } catch (e) {
      console.warn('Failed to save customer account:', e);
    }
  }, [customerAccount]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONSULTANT_ACCOUNT, JSON.stringify(consultantAccount));
    } catch (e) {
      console.warn('Failed to save consultant account:', e);
    }
  }, [consultantAccount]);

  // Real-time synchronization across multi-tab sessions & external updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === STORAGE_KEY_REQUESTS) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setRequests(parsed);
        } else if (e.key === STORAGE_KEY_TASKS) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setClientTasks(deduplicateTasks(parsed));
        } else if (e.key === STORAGE_KEY_GRIEVANCES) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setGrievances(parsed);
        } else if (e.key === STORAGE_KEY_NOTIFICATIONS) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setNotifications(parsed);
        }
      } catch (err) {
        console.warn('Storage sync parse error:', err);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || requests[0];

  const handleAuthenticate = (role: AuthRole, account: CustomerAccount | ConsultantAccount, isNewRegistration?: boolean) => {
    setAuthRole(role);
    if (role === 'customer') {
      const cusAcc = account as CustomerAccount;
      setCustomerAccount(cusAcc);

      // If this is a fresh new customer registration, clean any previous test requests/tasks for this email
      if (isNewRegistration) {
        setRequests(prev => {
          const cleaned = prev.filter(r => 
            r.email?.toLowerCase() !== cusAcc.email.toLowerCase() &&
            r.personName?.toLowerCase() !== cusAcc.name.toLowerCase() &&
            r.customerId !== cusAcc.id
          );
          try {
            localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(cleaned));
          } catch (e) {
            console.warn('Failed to save cleaned requests:', e);
          }
          return cleaned;
        });
        setClientTasks(prev => {
          const cleaned = prev.filter(t => 
            t.customerEmail?.toLowerCase() !== cusAcc.email.toLowerCase() &&
            t.customerName?.toLowerCase() !== cusAcc.name.toLowerCase()
          );
          try {
            localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(cleaned));
          } catch (e) {
            console.warn('Failed to save cleaned tasks:', e);
          }
          return cleaned;
        });
        setGrievances(prev => {
          const cleaned = prev.filter(g => 
            g.customerEmail?.toLowerCase() !== cusAcc.email.toLowerCase() &&
            g.customerName?.toLowerCase() !== cusAcc.name.toLowerCase()
          );
          try {
            localStorage.setItem(STORAGE_KEY_GRIEVANCES, JSON.stringify(cleaned));
          } catch (e) {
            console.warn('Failed to save cleaned grievances:', e);
          }
          return cleaned;
        });
      }

      // Persist in registeredCustomers array in state & storage
      setRegisteredCustomers(prev => {
        const exists = prev.some(c => c.id === cusAcc.id || (c.email && c.email.toLowerCase() === cusAcc.email.toLowerCase()));
        let updated: CustomerAccount[];
        if (exists) {
          updated = prev.map(c => (c.id === cusAcc.id || (c.email && c.email.toLowerCase() === cusAcc.email.toLowerCase())) ? { ...c, ...cusAcc } : c);
        } else {
          updated = [...prev, cusAcc];
        }
        try {
          localStorage.setItem(STORAGE_KEY_REGISTERED_CUSTOMERS, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save registered customers:', e);
        }
        return updated;
      });
    } else {
      setConsultantAccount(account as ConsultantAccount);
      const consultantUser = DEMO_USERS.find(u => u.role === 'Dutro Consultant') || DEMO_USERS[0];
      setCurrentUser(consultantUser);
      setCurrentMainView('overview');
      setActiveFilterTab('inbox');

      // Refresh requests and tasks from storage to ensure any customer-created requests are visible
      try {
        const savedReqs = localStorage.getItem(STORAGE_KEY_REQUESTS);
        if (savedReqs) {
          const parsed = JSON.parse(savedReqs);
          if (Array.isArray(parsed) && parsed.length > 0) setRequests(parsed);
        }
        const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
        if (savedTasks) {
          const parsed = JSON.parse(savedTasks);
          if (Array.isArray(parsed) && parsed.length > 0) setClientTasks(deduplicateTasks(parsed));
        }
      } catch (e) {
        console.warn('Failed to reload requests on consultant login:', e);
      }
    }
  };

  const handleSwitchToConsultant = () => {
    setAuthRole('consultant');
    const consultantUser = DEMO_USERS.find(u => u.role === 'Dutro Consultant') || DEMO_USERS[0];
    setCurrentUser(consultantUser);
    setCurrentMainView('overview');
    setActiveFilterTab('inbox');

    try {
      const savedReqs = localStorage.getItem(STORAGE_KEY_REQUESTS);
      if (savedReqs) {
        const parsed = JSON.parse(savedReqs);
        if (Array.isArray(parsed) && parsed.length > 0) setRequests(parsed);
      }
      const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) setClientTasks(deduplicateTasks(parsed));
      }
    } catch (e) {
      console.warn('Failed to reload requests on switch to consultant:', e);
    }
  };

  const handleSwitchToCustomer = () => {
    setAuthRole('customer');
  };

  const handleLogout = () => {
    setAuthRole(null);
  };

  // =========================================================
  // CUSTOMER DEDICATED WORKFLOW HANDLERS (Section 4, 5, 17, 18, 19)
  // =========================================================
  const handleCustomerCreateRequest = ({ description, attachmentName }: { description: string; attachmentName?: string }) => {
    const nextDsrNum = 2000 + requests.length + 1;
    const newId = `DSR-${nextDsrNum}`;
    const nowTimestamp = new Date().toISOString();
    const nowFormatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST';

    const newReq: PrivacyRequest = {
      id: newId,
      personName: customerAccount.name,
      email: customerAccount.email,
      phone: customerAccount.phone,
      accountNumber: customerAccount.accountNumber || 'ACC-7842109812',
      accountTier: customerAccount.customerType || 'Registered User',
      type: 'Right of Access',
      role: 'Active Customer',
      clientEntity: MASTER_CLIENT.name,
      channel: 'Client Customer Portal',
      priority: 'High',
      status: 'In Progress',
      currentStage: 'Data Discovery',
      assignedTeam: 'Privacy & Compliance Office',
      assignedOwner: 'Harshit Patel (Lead Consultant)',
      assignedConsultant: 'Harshit Patel',
      customerId: customerAccount.id,
      customerDescription: description,
      customerAttachment: attachmentName,
      receivedDate: nowFormatted,
      dueDate: '30 calendar days',
      dueText: '30 calendar days SLA',
      customerSince: 'March 2024',
      slaStartTimestamp: nowTimestamp,
      slaDeadlineTimestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      slaDaysRemaining: 30,
      statutoryBasis: 'DPDP Act 2023 Sec. 11 (Right to Access) / GDPR Art. 15',
      lastUpdated: nowFormatted,
      verificationStatus: 'Verified',
      verificationMethod: customerAccount.verificationMethod || 'OTP',
      verificationToken: `AUTH-2FA-OTP-${customerAccount.id}-PASS`,
      verificationDetails: {
        status: 'Verified',
        method: customerAccount.verificationMethod || 'OTP',
        verifiedAt: customerAccount.verifiedAt || nowFormatted,
        referenceToken: `AUTH-2FA-OTP-${customerAccount.id}-PASS`,
        confidenceScore: 100,
        notes: 'Requester completed OTP 2FA verification before request intake.'
      },
      dataDiscoveryMode: 'ropa',
      basicLocationChecks: [
        {
          id: `loc-1-${newId}`,
          systemName: 'Customer Relationship Management (CRM)',
          department: 'Operations',
          owner: 'Rahul Verma',
          ownerEmail: 'rahul.verma@client.example',
          status: 'Completed — Data Found',
          dataElementsFound: ['Contact profile', 'Interaction history', 'Account details'],
          checkedAt: nowFormatted,
          notes: 'Customer profile records located.'
        },
        {
          id: `loc-2-${newId}`,
          systemName: 'Client Support Platform',
          department: 'Customer Support',
          owner: 'Neha Kapoor',
          ownerEmail: 'neha.kapoor@client.example',
          status: 'In Progress',
          dataElementsFound: ['Support tickets', 'Chat inquiry transcripts'],
          checkedAt: nowFormatted,
          notes: 'Support transcripts extraction ongoing.'
        },
        {
          id: `loc-3-${newId}`,
          systemName: 'Billing & Transaction Ledger',
          department: 'Finance Operations',
          owner: 'Vikram Shah',
          ownerEmail: 'vikram.shah@client.example',
          status: 'In Progress',
          dataElementsFound: ['Monthly fee invoices', 'Payment transaction records'],
          checkedAt: nowFormatted,
          notes: 'Finance team extracting fee statements.'
        }
      ],
      dutroValidation: {
        isValidated: false,
        validationStatus: 'ACTION REQUIRED',
        validatedBy: 'Dutro Privacy Engine',
        checks: {
          tasksCompleted: false,
          systemsChecked: true,
          dataFoundRecorded: true,
          redactionReviewCompleted: false,
          slaCompliant: true,
          internalReviewCompleted: false
        },
        recommendationText: 'Waiting for department data retrieval and redaction review before validation clearance.',
        canBeClosed: false
      },
      bankClosure: {
        isDelivered: false,
        deliveryChannel: 'Client Customer Portal'
      },
      auditTrail: [
        {
          timestamp: nowFormatted,
          actor: `Customer (${customerAccount.name})`,
          role: 'Data Principal',
          action: 'Right of Access Request Created',
          details: `Submitted Access Request via verified portal session. 2FA verification recorded.`
        },
        {
          timestamp: nowFormatted,
          actor: 'Dutro Orchestration Platform',
          role: 'System',
          action: 'DSR Initialized & Assigned',
          details: `Created ${newId} and assigned to Dutro Lead Consultant (Harshit Patel) with 30-day statutory SLA clock.`
        }
      ]
    };

    const notif = dispatchAutomatedNotification('dsr-intake-received', {
      recipientName: customerAccount.name,
      recipientEmail: customerAccount.email,
      relatedId: newId,
      request: newReq
    });

    newReq.auditTrail.push({
      timestamp: nowFormatted,
      actor: 'Dutro Automated Notification Engine',
      role: 'System Notification',
      action: 'Stage 1 Automated Acknowledgment Dispatched',
      details: `Dispatched statutory DSAR receipt & 30-day SLA acknowledgment email (${notif.subject}) to ${customerAccount.email}.`
    });

    // Automatically create 3 initial department retrieval tasks for the consultant workflow
    const taskBase = 2000 + clientTasks.length;
    const newTasks: ClientTask[] = [
      {
        id: `TASK-${taskBase + 1}`,
        dsrId: newId,
        customerName: customerAccount.name,
        customerEmail: customerAccount.email,
        processName: 'Customer Profile & CRM',
        department: 'Operations',
        assignedTeam: 'Operations',
        assignedPerson: 'Rahul Verma',
        assignedRole: 'Operations Specialist',
        dataRequested: ['Customer profile', 'Contact details', 'Account registration'],
        sourceSystem: 'Client CRM System',
        status: 'In Progress',
        dueDate: '30 October 2026',
        dispatchedAt: nowFormatted,
        redactionReview: createDefaultRedactionReview('Customer Profile & CRM', false, 'NO REDACTION REQUIRED')
      },
      {
        id: `TASK-${taskBase + 2}`,
        dsrId: newId,
        customerName: customerAccount.name,
        customerEmail: customerAccount.email,
        processName: 'Customer Support',
        department: 'Customer Support',
        assignedTeam: 'Customer Support',
        assignedPerson: 'Neha Kapoor',
        assignedRole: 'Support Team Lead',
        dataRequested: ['Support tickets', 'Chat inquiry transcripts'],
        sourceSystem: 'Client Support Platform',
        status: 'In Progress',
        dueDate: '30 October 2026',
        dispatchedAt: nowFormatted,
        redactionReview: createDefaultRedactionReview('Customer Support', true, 'REVIEW REQUIRED')
      },
      {
        id: `TASK-${taskBase + 3}`,
        dsrId: newId,
        customerName: customerAccount.name,
        customerEmail: customerAccount.email,
        processName: 'Billing & Payments',
        department: 'Finance Operations',
        assignedTeam: 'Finance Operations',
        assignedPerson: 'Vikram Shah',
        assignedRole: 'Finance Specialist',
        dataRequested: ['Billing invoices', 'Fee statements'],
        sourceSystem: 'Client Billing System',
        status: 'In Progress',
        dueDate: '31 October 2026',
        dispatchedAt: nowFormatted,
        redactionReview: createDefaultRedactionReview('Billing & Payments', false, 'NO REDACTION REQUIRED')
      }
    ];

    setRequests(prev => {
      const updated = [newReq, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save requests:', e);
      }
      return updated;
    });

    setClientTasks(prev => {
      const updated = deduplicateTasks([...newTasks, ...prev]);
      try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save tasks:', e);
      }
      return updated;
    });

    setSelectedRequestId(newId);
  };

  const handleCustomerRaiseGrievance = (dsrId: string, reason: string, complaint: string) => {
    const targetReq = requests.find(r => r.id === dsrId);
    const grvNum = 1000 + grievances.length + 1;
    const newGrvId = `GRV-${grvNum}`;
    const nowFormatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST';
    const nowTimestamp = new Date().toISOString();

    const newGrv: GrievanceRecord = {
      id: newGrvId,
      linkedDsrId: dsrId,
      customerName: targetReq ? targetReq.personName : customerAccount.name,
      customerEmail: targetReq ? targetReq.email : customerAccount.email,
      customerPhone: targetReq ? targetReq.phone : customerAccount.phone,
      originalRequestType: 'Right of Access',
      originalResponseDate: targetReq?.bankClosure?.deliveredAt || targetReq?.receivedDate || '28 Sep 2026',
      originalResponseSummary: 'Customer Right of Access response package delivered.',
      customerComplaint: complaint,
      grievanceReason: reason,
      originalScopeSummary: 'Full statutory Right of Access across client business processes.',
      whatWasProvidedSummary: 'Verified personal data disclosure package delivered.',
      dateRaised: nowFormatted,
      stage: 'Grievance Raised',
      status: 'Grievance Raised',
      assignedReviewer: 'Harshit Patel',
      assignedReviewerRole: 'Dutro Lead Consultant',
      slaStartTimestamp: nowTimestamp,
      slaDeadlineTimestamp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      internalNotes: 'Customer lodged formal grievance. Statutory 15-day resolution SLA running.',
      auditTrail: [
        {
          timestamp: nowFormatted,
          actor: `Customer (${customerAccount.name})`,
          role: 'Data Principal',
          action: 'Grievance Raised against DSR',
          details: `Lodged formal grievance against ${dsrId}: "${complaint}"`
        },
        {
          timestamp: nowFormatted,
          actor: 'Dutro Grievance Engine',
          role: 'System',
          action: 'Grievance SLA Clock Initialized',
          details: `Commenced independent 15 calendar days statutory grievance redressal SLA.`
        }
      ]
    };

    // Stage 3 Automated Notification: Grievance Initiated
    const notif = dispatchAutomatedNotification('grievance-initiated', {
      recipientName: newGrv.customerName,
      recipientEmail: newGrv.customerEmail,
      relatedId: newGrv.id,
      grievance: newGrv
    });

    newGrv.auditTrail.push({
      timestamp: nowFormatted,
      actor: 'Dutro Automated Notification Engine',
      role: 'System Notification',
      action: 'Stage 3 Grievance Lodgment Acknowledgment Dispatched',
      details: `Dispatched formal 15-day statutory grievance registration acknowledgment (${notif.subject}) to ${newGrv.customerEmail}.`
    });

    setGrievances(prev => [newGrv, ...prev]);
    setRequests(prev => prev.map(r => r.id === dsrId ? {
      ...r,
      status: 'Grievance Raised',
      linkedGrievanceId: newGrvId,
      auditTrail: [
        ...r.auditTrail,
        {
          timestamp: nowFormatted,
          actor: `Customer (${customerAccount.name})`,
          role: 'Customer',
          action: 'Grievance Raised against DSR',
          details: `Customer disputed response. Created linked grievance ${newGrvId}.`
        }
      ]
    } : r));
    setSelectedGrievanceId(newGrvId);
  };

  // =========================================================
  // NAVIGATION HANDLERS
  // =========================================================
  const handleSelectRequest = (id: string) => {
    setSelectedRequestId(id);
    setCurrentMainView('details');
  };

  const handleSelectGrievance = (identifier?: string) => {
    if (identifier) {
      const match = grievances.find(g => g.id === identifier || g.linkedDsrId === identifier);
      setSelectedGrievanceId(match ? match.id : identifier);
    } else {
      setSelectedGrievanceId(undefined);
    }
    setCurrentMainView('grievances');
  };

  const handleNavigateToSection = (section: MainNavigationSection, filterTab?: DSRWorkspaceFilter) => {
    if (filterTab) setActiveFilterTab(filterTab);
    if (section === 'grievances') {
      setSelectedGrievanceId(undefined); // Reset so it opens default list view
    }
    setCurrentMainView(section);
  };

  const handleNavigateToSettingsTab = (subTab: string) => {
    setSettingsSubTab(subTab as SettingsTab);
    setCurrentMainView('settings');
  };

  // =========================================================
  // CUSTOMER INTAKE & 2FA SUBMISSION (Section 3, 4, 5)
  // =========================================================
  const handleCustomerIntakeSubmit = (newReqData: Partial<PrivacyRequest>) => {
    const newReqId = newReqData.id || `DSR-${Math.floor(2010 + Math.random() * 90)}`;
    const nowFormatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST';

    const newReq: PrivacyRequest = {
      id: newReqId,
      personName: newReqData.personName || 'Rohan Mehta',
      email: newReqData.email || 'rohan.mehta@example.com',
      phone: newReqData.phone || '+91 90000 12345',
      accountNumber: newReqData.accountNumber || 'ACC-7842109812',
      accountTier: 'Verified Registered User',
      type: newReqData.type || 'Right of Access',
      role: 'Active Customer',
      clientEntity: MASTER_CLIENT.name,
      channel: newReqData.channel || 'Client Customer Portal',
      priority: 'High',
      status: 'In Progress',
      currentStage: 'Data Discovery',
      assignedTeam: 'Privacy & Compliance Office',
      assignedOwner: 'Ananya Mehta (Privacy Officer)',
      receivedDate: nowFormatted,
      dueDate: '30 calendar days',
      dueText: '30 calendar days SLA',
      customerSince: 'March 2024',
      slaStartTimestamp: new Date().toISOString(),
      slaDeadlineTimestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      slaDaysRemaining: 30,
      statutoryBasis: 'DPDP Act 2023 Sec. 11 / GDPR Art. 15',
      verificationStatus: 'Verified',
      verificationMethod: newReqData.verificationMethod || 'OTP',
      verificationToken: newReqData.verificationToken || 'AUTH-2FA-OTP-PASS',
      auditTrail: newReqData.auditTrail || []
    };

    // Stage 1 Notification: User details received & request initiated
    const notif = dispatchAutomatedNotification('dsr-intake-received', {
      recipientName: newReq.personName,
      recipientEmail: newReq.email,
      relatedId: newReq.id,
      request: newReq
    });

    newReq.auditTrail.push({
      timestamp: nowFormatted,
      actor: 'Dutro Automated Notification Engine',
      role: 'System Notification',
      action: 'Stage 1 Automated Acknowledgment Dispatched',
      details: `Dispatched statutory DSAR receipt & 30-day SLA acknowledgment email (${notif.subject}) to ${newReq.email}.`
    });

    setRequests(prev => {
      const updated = [newReq, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save requests:', e);
      }
      return updated;
    });
    setSelectedRequestId(newReq.id);
    setIsCustomerIntakeModalOpen(false);
    setCurrentMainView('details');
  };

  // Legacy quick request creator
  const handleCreateNewRequest = (name: string, email: string) => {
    handleCustomerIntakeSubmit({ personName: name, email });
  };

  // =========================================================
  // TASK & DATA DISCOVERY HANDLERS (Section 8 & 9)
  // =========================================================
  const handleStartTaskForProcess = (process: BusinessProcess) => {
    const exists = clientTasks.find(
      t => t.dsrId === selectedRequestId && (t.processName.toLowerCase() === process.name.toLowerCase() || t.id === process.taskId)
    );

    if (exists) return;

    let nextTaskId = process.taskId || `TASK-${2000 + clientTasks.length + 1}`;
    let counter = 1;
    while (clientTasks.some(t => t.id === nextTaskId)) {
      nextTaskId = `TASK-${2000 + clientTasks.length + counter}`;
      counter++;
    }

    const newTask: ClientTask = {
      id: nextTaskId,
      dsrId: selectedRequestId,
      customerName: selectedRequest.personName,
      customerEmail: selectedRequest.email,
      processName: process.name,
      department: process.department,
      assignedTeam: process.department,
      assignedPerson: process.owner,
      assignedRole: 'Department Lead',
      dataRequested: process.dataFound,
      sourceSystem: process.source,
      status: 'Waiting for client action',
      dataFoundStatus: 'Data Found',
      dueDate: '28 October 2026',
      dispatchedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
    };

    setClientTasks(prev => deduplicateTasks([...prev, newTask]));

    setRequests(prev => prev.map(req => {
      if (req.id === selectedRequestId) {
        return {
          ...req,
          auditTrail: [
            ...(req.auditTrail || []),
            {
              timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
              actor: `${currentUser.name} (${currentUser.role})`,
              role: currentUser.role,
              action: 'RoPA Match Accepted & Task Dispatched',
              details: `Accepted RoPA match "${process.name}" (${process.id}) and dispatched data retrieval task ${nextTaskId} to ${process.department} (${process.owner}).`
            }
          ]
        };
      }
      return req;
    }));
  };

  const handleStartAllRemainingTasks = (processes: BusinessProcess[]) => {
    const newTasksToCreate: ClientTask[] = [];
    const auditEntries: AuditEvent[] = [];

    processes.forEach((proc) => {
      const exists = clientTasks.some(
        t => t.dsrId === selectedRequestId && (t.processName.toLowerCase() === proc.name.toLowerCase() || t.id === proc.taskId)
      ) || newTasksToCreate.some(t => t.processName.toLowerCase() === proc.name.toLowerCase());

      if (!exists) {
        let nextId = proc.taskId || `TASK-${2000 + clientTasks.length + newTasksToCreate.length + 1}`;
        let counter = 1;
        while (clientTasks.some(t => t.id === nextId) || newTasksToCreate.some(t => t.id === nextId)) {
          nextId = `TASK-${2000 + clientTasks.length + newTasksToCreate.length + counter}`;
          counter++;
        }

        newTasksToCreate.push({
          id: nextId,
          dsrId: selectedRequestId,
          customerName: selectedRequest.personName,
          customerEmail: selectedRequest.email,
          processName: proc.name,
          department: proc.department,
          assignedTeam: proc.department,
          assignedPerson: proc.owner,
          assignedRole: 'Department Lead',
          dataRequested: proc.dataFound,
          sourceSystem: proc.source,
          status: 'Waiting for client action',
          dataFoundStatus: 'Data Found',
          dueDate: '28 October 2026',
          dispatchedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
        });

        auditEntries.push({
          timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
          actor: `${currentUser.name} (${currentUser.role})`,
          role: currentUser.role,
          action: 'RoPA Match Accepted & Task Dispatched',
          details: `Accepted RoPA match "${proc.name}" (${proc.id}) and dispatched data retrieval task ${nextId} to ${proc.department} (${proc.owner}).`
        });
      }
    });

    if (newTasksToCreate.length > 0) {
      setClientTasks(prev => deduplicateTasks([...prev, ...newTasksToCreate]));
      setRequests(prev => prev.map(req => {
        if (req.id === selectedRequestId) {
          return {
            ...req,
            auditTrail: [
              ...(req.auditTrail || []),
              ...auditEntries
            ]
          };
        }
        return req;
      }));
    }
  };

  const handleCreateTask = (newTaskData: Omit<ClientTask, 'id'>) => {
    let nextTaskNum = 2000 + clientTasks.length + 1;
    let newTaskId = `TASK-${nextTaskNum}`;
    while (clientTasks.some(t => t.id === newTaskId)) {
      nextTaskNum++;
      newTaskId = `TASK-${nextTaskNum}`;
    }

    const newTask: ClientTask = {
      id: newTaskId,
      ...newTaskData
    };

    setClientTasks(prev => deduplicateTasks([...prev, newTask]));

    setRequests(prev => prev.map(req => {
      if (req.id === newTask.dsrId) {
        return {
          ...req,
          auditTrail: [
            ...(req.auditTrail || []),
            {
              timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
              actor: `${currentUser.name} (${currentUser.role})`,
              role: currentUser.role,
              action: 'Department Task Dispatched',
              details: `Dispatched task ${newTaskId} (${newTask.processName}) to ${newTask.assignedTeam} (${newTask.assignedPerson})`
            }
          ]
        };
      }
      return req;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    const targetTask = clientTasks.find(t => t.id === taskId);
    const taskName = targetTask?.processName || 'Department Data Task';

    setClientTasks(prev => prev.filter(task => task.id !== taskId));

    setRequests(prev => prev.map(req => {
      if (req.id === selectedRequestId) {
        return {
          ...req,
          auditTrail: [
            ...(req.auditTrail || []),
            {
              timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
              actor: `${currentUser.name} (${currentUser.role})`,
              role: currentUser.role,
              action: 'Department Task Deleted',
              details: `Removed task ${taskId} (${taskName}) from DSR case ${selectedRequestId}.`
            }
          ]
        };
      }
      return req;
    }));
  };

  // Task Completion Handler
  const handleTaskComplete = (taskId: string) => {
    const targetTask = clientTasks.find(t => t.id === taskId);
    const taskName = targetTask?.processName || 'Department Data Task';
    const assignedPerson = targetTask?.assignedPerson || currentUser.name;

    setClientTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: 'Completed', 
            dataFoundStatus: 'Data Found',
            completedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
            confirmationNote: `Requested records retrieved and confirmed by ${assignedPerson}.`
          } 
        : task
    ));

    setRequests(prev => prev.map(req => {
      if (req.id === targetTask?.dsrId || req.id === selectedRequestId) {
        return {
          ...req,
          auditTrail: [
            ...(req.auditTrail || []),
            {
              timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
              actor: `${assignedPerson} (${currentUser.role})`,
              role: currentUser.role,
              action: 'Task Completed & Confirmed',
              details: `${taskId} completed: Requested records retrieved and confirmed for ${taskName}.`
            }
          ]
        };
      }
      return req;
    }));
  };

  // Update Data Found Status
  const handleUpdateTaskDataFound = (taskId: string, status: 'Data Found' | 'No Data Found' | 'Unable to Determine') => {
    setClientTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, dataFoundStatus: status } : task
    ));
  };

  // Update Redaction Review State on Task
  const handleUpdateTaskRedaction = (taskId: string, redactionState: RedactionReviewState) => {
    setClientTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, redactionReview: redactionState } : task
    ));
  };

  // Dutro Validation Sign-Off
  const handleDutroReviewComplete = () => {
    setRequests(prev => prev.map(req => {
      if (req.id === selectedRequestId) {
        return {
          ...req,
          dutroReview: {
            isReviewed: true,
            reviewedBy: 'Dutro Privacy Consultant (Pooja Rao)',
            reviewedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
            checkpoints: {
              tasksCompleted: true,
              redactionVerified: true,
              slaCompliant: true
            },
            notes: 'Verified all department retrieval confirmations, verified client redactions, and confirmed statutory SLA compliance.'
          },
          auditTrail: [
            ...(req.auditTrail || []),
            {
              timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
              actor: 'Dutro Privacy Consultant (Pooja Rao)',
              role: 'Dutro Consultant',
              action: 'Dutro Validation Completed',
              details: 'Step 6 validation completed: Verified all department tasks, third-party redactions, and statutory SLA compliance.'
            }
          ]
        };
      }
      return req;
    }));
  };

  // Dutro Finalizes Recommendation & Clears Case for Closure
  const handleDutroFinalizeRecommendation = () => {
    setRequests(prev => prev.map(req => {
      if (req.id === selectedRequestId) {
        return {
          ...req,
          status: 'Ready for Closure',
          dutroRecommendation: {
            isFinalized: true,
            recommendedBy: 'Dutro Privacy Advisory Team',
            recommendedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
            recommendationText: 'Dutro has completed all compliance checks and verified all department tasks. Case cleared for client legal approval and delivery.',
            canBeClosed: true
          },
          auditTrail: [
            ...(req.auditTrail || []),
            {
              timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
              actor: 'Dutro Privacy Advisory Team',
              role: 'Dutro Consultant',
              action: 'Dutro Clearance & Recommendation Issued',
              details: `Dutro finalized review: Formally notified Client Organization that case ${selectedRequestId} is cleared for closure.`
            }
          ]
        };
      }
      return req;
    }));
  };

  // Client Organization closes request & delivers response (Trigger 2: Output email)
  const handleBankDeliverAndClose = () => {
    const timestamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST';

    const targetReq = requests.find(r => r.id === selectedRequestId);
    let deliveryNotifSubj = '';
    if (targetReq) {
      const notif = dispatchAutomatedNotification('dsr-output-delivered', {
        recipientName: targetReq.personName,
        recipientEmail: targetReq.email,
        relatedId: targetReq.id,
        request: targetReq
      });
      deliveryNotifSubj = notif.subject;
    }

    setRequests(prev => prev.map(req => {
      if (req.id === selectedRequestId) {
        return {
          ...req,
          status: 'Closed',
          dueText: 'Completed',
          currentStage: 'Closed',
          bankClosure: {
            isDelivered: true,
            deliveredBy: `${currentUser.name} (${currentUser.role}, ${currentUser.organization})`,
            deliveredAt: timestamp,
            deliveryChannel: req.channel,
            customerReceiptId: `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`
          },
          auditTrail: [
            ...(req.auditTrail || []),
            {
              timestamp,
              actor: `${currentUser.name} (${currentUser.role}, ${currentUser.organization})`,
              role: currentUser.role,
              action: 'Response Delivered & Case Closed',
              details: `Delivered encrypted statutory disclosure package directly to ${req.personName} via ${req.channel}.`
            },
            {
              timestamp,
              actor: 'Dutro Automated Notification Engine',
              role: 'System Notification',
              action: 'Stage 2 Output Delivery Email Dispatched',
              details: `Dispatched verified personal data disclosure package output email (${deliveryNotifSubj}) to ${req.email}.`
            }
          ]
        };
      }
      return req;
    }));
  };

  // =========================================================
  // GRIEVANCE HANDLERS (Section 16, 17, 18, 19, 20, 21)
  // =========================================================
  const handleRaiseGrievance = (dsrId: string) => {
    const targetReq = requests.find(r => r.id === dsrId) || requests[0];
    const newGrvId = `GRV-${1000 + grievances.length + 1}`;
    const timestamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST';
    
    const newGrievance: GrievanceRecord = {
      id: newGrvId,
      linkedDsrId: targetReq.id,
      customerName: targetReq.personName,
      customerEmail: targetReq.email,
      customerPhone: targetReq.phone,
      originalRequestType: targetReq.type,
      originalResponseDate: targetReq.bankClosure?.deliveredAt || targetReq.receivedDate,
      originalResponseSummary: `Full ${targetReq.type} disclosure package.`,
      customerComplaint: `Customer disputed omitted transaction records in response delivered under ${targetReq.id}.`,
      grievanceReason: `Customer disputed omissions in records delivered under ${targetReq.id}.`,
      originalScopeSummary: `Statutory ${targetReq.type} across enterprise systems.`,
      whatWasProvidedSummary: `Original records package delivered on ${targetReq.bankClosure?.deliveredAt || targetReq.receivedDate}.`,
      dateRaised: timestamp,
      stage: 'Grievance Raised',
      status: 'Grievance Raised',
      assignedReviewer: 'Meera Singh',
      assignedReviewerRole: 'Statutory Grievance Officer (Client Organization)',
      slaStartTimestamp: new Date().toISOString(),
      slaDeadlineTimestamp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      internalNotes: 'Customer lodged formal grievance. Statutory 15-day resolution SLA started.',
      auditTrail: [
        {
          timestamp,
          actor: `Customer (${targetReq.personName})`,
          role: 'Customer',
          action: 'Grievance Lodged against DSR',
          details: `Created grievance ${newGrvId} linked to ${targetReq.id}.`
        }
      ]
    };

    // Stage 3 Automated Notification: Grievance Initiated
    const notif = dispatchAutomatedNotification('grievance-initiated', {
      recipientName: newGrievance.customerName,
      recipientEmail: newGrievance.customerEmail,
      relatedId: newGrievance.id,
      grievance: newGrievance
    });

    newGrievance.auditTrail.push({
      timestamp,
      actor: 'Dutro Automated Notification Engine',
      role: 'System Notification',
      action: 'Stage 3 Grievance Lodgment Acknowledgment Dispatched',
      details: `Dispatched formal 15-day statutory grievance registration acknowledgment (${notif.subject}) to ${newGrievance.customerEmail}.`
    });

    setGrievances(prev => [newGrievance, ...prev]);
    setSelectedGrievanceId(newGrvId);

    // Update request to show linked grievance
    setRequests(prev => prev.map(r => r.id === targetReq.id ? { ...r, linkedGrievanceId: newGrvId, status: 'Grievance Raised' } : r));

    setCurrentMainView('grievances');
  };

  // Stage 4, 5, 6 Notifications: Grievance closed at Initial Review, Senior Review, or Final Review
  const handleUpdateGrievanceStage = (
    grievanceId: string, 
    nextStage: GrievanceStage, 
    nextStatus: GrievanceStatus, 
    note?: string
  ) => {
    const timestamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST';
    const currentGrv = grievances.find(g => g.id === grievanceId);

    let dispatchedNotif: CustomerNotification | undefined;
    let notifActionTitle = '';

    if (currentGrv && (nextStage === 'Resolved' || nextStage === 'Closed')) {
      const prevStage = currentGrv.stage;
      let trigger: NotificationTriggerStage = 'grievance-closed-initial-review';
      notifActionTitle = 'Stage 4 Initial Review Resolution Email Dispatched';

      const prevStageStr = String(prevStage);
      if (
        prevStageStr.includes('Senior') || 
        prevStageStr.includes('Level 2') || 
        prevStageStr.includes('Escalat')
      ) {
        trigger = 'grievance-closed-senior-review';
        notifActionTitle = 'Stage 5 Senior Privacy Review Resolution Email Dispatched';
      } else if (
        prevStageStr.includes('Final') || 
        prevStageStr.includes('DPO')
      ) {
        trigger = 'grievance-closed-final-review';
        notifActionTitle = 'Stage 6 Final Executive DPO Resolution Certificate Email Dispatched';
      }

      dispatchedNotif = dispatchAutomatedNotification(trigger, {
        recipientName: currentGrv.customerName,
        recipientEmail: currentGrv.customerEmail,
        relatedId: currentGrv.id,
        grievance: currentGrv,
        customNote: note
      });
    }
    
    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        return {
          ...g,
          stage: nextStage,
          status: nextStatus,
          internalNotes: note ? `${g.internalNotes || ''}\n\n[${timestamp}]: ${note}` : g.internalNotes,
          resolutionSummary: nextStage === 'Resolved' ? (note || 'Grievance resolved and supplementary disclosure provided.') : g.resolutionSummary,
          closureDate: nextStage === 'Resolved' ? timestamp : g.closureDate,
          auditTrail: [
            ...(g.auditTrail || []),
            {
              timestamp,
              actor: `${currentUser.name} (${currentUser.role})`,
              role: currentUser.role,
              action: `Grievance Updated: ${nextStage}`,
              details: note || `Progressed grievance stage to ${nextStage}.`
            },
            ...(dispatchedNotif ? [{
              timestamp,
              actor: 'Dutro Automated Notification Engine',
              role: 'System Notification',
              action: notifActionTitle,
              details: `Dispatched automated statutory resolution email (${dispatchedNotif.subject}) to ${g.customerEmail}.`
            }] : [])
          ]
        };
      }
      return g;
    }));
  };

  const handleCreateGrievance = (newGrvData: Omit<GrievanceRecord, 'id'>) => {
    const newGrvId = `GRV-${1000 + grievances.length + 1}`;
    const newGrievance: GrievanceRecord = {
      id: newGrvId,
      ...newGrvData
    };
    setGrievances(prev => [newGrievance, ...prev]);
    setSelectedGrievanceId(newGrvId);
  };

  // Reset Demo to fresh initial state
  const handleResetDemo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_REQUESTS);
      localStorage.removeItem(STORAGE_KEY_TASKS);
      localStorage.removeItem(STORAGE_KEY_GRIEVANCES);
      localStorage.removeItem(STORAGE_KEY_NOTIFICATIONS);
      localStorage.removeItem(STORAGE_KEY_REGISTERED_CUSTOMERS);
      localStorage.removeItem(STORAGE_KEY_CUSTOMER_ACCOUNT);
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
      localStorage.removeItem(STORAGE_KEY_SELECTED_ID);
      localStorage.removeItem(STORAGE_KEY_MAIN_VIEW);
      localStorage.removeItem(STORAGE_KEY_FILTER_TAB);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }

    setRequests(INITIAL_REQUESTS);
    setClientTasks(INITIAL_CLIENT_TASKS);
    setGrievances(INITIAL_GRIEVANCES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setRegisteredCustomers(INITIAL_REGISTERED_CUSTOMERS);
    setCustomerAccount(DEFAULT_CUSTOMER_ACCOUNT);
    setCurrentUser(DEMO_USERS[0]);
    setSelectedRequestId('DSR-2001');
    setSelectedGrievanceId(undefined);
    setCurrentMainView('overview');
    setActiveFilterTab('inbox');
    setDemoKey(prev => prev + 1);
  };

  // Sidebar Counts
  const counts = {
    inbox: requests.filter(r => r.status !== 'Closed' && r.status !== 'Completed').length,
    myTasks: clientTasks.filter(t => t.status !== 'Completed').length,
    pendingVerification: requests.filter(r => r.verificationStatus === 'Pending' || r.verificationStatus === 'Manual Review').length,
    pendingClientAction: requests.filter(r => r.status === 'Pending Client Action' || r.status === 'Waiting for client action' || r.status === 'In Progress').length,
    completed: requests.filter(r => r.status === 'Closed' || r.status === 'Completed').length,
    grievances: grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed').length
  };

  // 1. If unauthenticated, show Authentication Landing Page (Section 1)
  if (authRole === null) {
    return <AuthLandingPage onAuthenticate={handleAuthenticate} />;
  }

  // 2. If authenticated as CUSTOMER, show dedicated Customer Dashboard (Section 3, 4, 5, 6, 7, 19)
  if (authRole === 'customer') {
    return (
      <CustomerDashboard
        customerAccount={customerAccount}
        requests={requests}
        grievances={grievances}
        clientTasks={clientTasks}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onCreateRequest={handleCustomerCreateRequest}
        onRaiseGrievance={handleCustomerRaiseGrievance}
        onSwitchToConsultant={handleSwitchToConsultant}
        onLogout={handleLogout}
      />
    );
  }

  // 3. If authenticated as DUTRO CONSULTANT, show Consultant Operations Workspace (Section 8, 9, 10, 11-18, 20, 21)
  return (
    <IntakeProvider onPromoteToWorkspace={(dsrId) => {
      setSelectedRequestId(dsrId);
      setCurrentMainView('details');
    }}>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased select-none">
        
        {/* Left Clean Sidebar (Section 2: DSR Workspace, Data & Operations, Governance, Settings) */}
        <Sidebar
          currentMainView={currentMainView}
          activeFilterTab={activeFilterTab}
          currentUser={currentUser}
          onNavigateToSection={handleNavigateToSection}
          onNavigateToSettingsTab={handleNavigateToSettingsTab}
          onOpenCustomerIntakeModal={() => setIsCustomerIntakeModalOpen(true)}
          onOpenDemoRequest={() => {
            setSelectedRequestId('DSR-2001');
            setCurrentMainView('details');
          }}
          onResetDemo={handleResetDemo}
          onOpenFlowModal={() => setIsGlobalFlowModalOpen(true)}
          counts={counts}
        />

        {/* Main Content Area (Single Unified Dashboard) */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-slate-50">
          
          {/* Header with Logged-In User & Role Switcher */}
          <Header
            currentMainView={currentMainView}
            activeFilterTab={activeFilterTab}
            currentUser={currentUser}
            onSwitchUser={setCurrentUser}
            onNavigateToWorkspace={(tab) => handleNavigateToSection('workspace', tab || 'inbox')}
            onNavigateToSettings={(tab) => handleNavigateToSettingsTab(tab || 'intake-webform')}
            onOpenCustomerIntakeModal={() => setIsCustomerIntakeModalOpen(true)}
            onSwitchToCustomerView={handleSwitchToCustomer}
            onLogout={handleLogout}
            activeRequestId={selectedRequest?.id}
            activePersonName={selectedRequest?.personName}
          />

          {/* Scrollable Main View Container */}
          <main className="flex-1 overflow-y-auto custom-scroll bg-slate-50 text-slate-900">
            
            {/* 1. Overview Dashboard */}
            {currentMainView === 'overview' && (
              <OverviewView
                requests={requests}
                tasks={clientTasks}
                grievances={grievances}
                currentUser={currentUser}
                onSelectRequest={handleSelectRequest}
                onNavigateToTab={(tab) => handleNavigateToSection('workspace', tab)}
                onNavigateToSection={(section) => handleNavigateToSection(section)}
                onOpenCustomerIntakeModal={() => setIsCustomerIntakeModalOpen(true)}
              />
            )}

            {/* 2. Request Inbox & Filtered Tabs */}
            {currentMainView === 'workspace' && (
              <RequestsList
                requests={requests}
                initialTab={activeFilterTab}
                onSelectRequest={handleSelectRequest}
                onCreateNewRequest={handleCreateNewRequest}
                onNavigateToGrievances={(grvId) => {
                  if (grvId) setSelectedGrievanceId(grvId);
                  setCurrentMainView('grievances');
                }}
                onNavigateToSettings={() => handleNavigateToSettingsTab('intake-webform')}
              />
            )}

            {/* 3. My Tasks (Client & Operations Workspace) */}
            {currentMainView === 'my-tasks' && (
              <MyTasksView
                tasks={clientTasks}
                requests={requests}
                currentUser={currentUser}
                onSelectRequest={handleSelectRequest}
                onTaskComplete={handleTaskComplete}
                onUpdateTaskRedaction={handleUpdateTaskRedaction}
                onUpdateTaskDataFound={handleUpdateTaskDataFound}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {/* 4. DSR Case Details (10-Stage Unified Lifecycle) */}
            {currentMainView === 'details' && (
              <RequestDetails
                key={`${selectedRequestId}-${demoKey}`}
                request={selectedRequest}
                clientTasks={clientTasks}
                onBack={() => setCurrentMainView('workspace')}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
                onStartTaskForProcess={handleStartTaskForProcess}
                onStartAllRemainingTasks={handleStartAllRemainingTasks}
                onTaskComplete={handleTaskComplete}
                onUpdateTaskRedaction={handleUpdateTaskRedaction}
                onDutroReviewComplete={handleDutroReviewComplete}
                onDutroFinalizeRecommendation={handleDutroFinalizeRecommendation}
                onBankDeliverAndClose={handleBankDeliverAndClose}
                onRaiseGrievance={handleRaiseGrievance}
                onNavigateToGrievances={handleSelectGrievance}
              />
            )}

            {/* 5. Grievances Workspace & Case Page */}
            {currentMainView === 'grievances' && (
              <GrievancesView
                grievances={grievances}
                requests={requests}
                selectedGrievanceId={selectedGrievanceId}
                onSelectGrievance={setSelectedGrievanceId}
                onSelectDSR={handleSelectRequest}
                onUpdateGrievanceStage={handleUpdateGrievanceStage}
                onCreateGrievance={handleCreateGrievance}
              />
            )}

            {/* 6. DSR History Archive */}
            {currentMainView === 'history' && (
              <DSRHistoryView
                requests={requests}
                onSelectRequest={handleSelectRequest}
                onRaiseGrievance={handleRaiseGrievance}
              />
            )}

            {/* 7. Data Discovery Workspace */}
            {currentMainView === 'data-discovery' && (
              <DataDiscoveryView
                requests={requests}
                tasks={clientTasks}
                selectedRequest={selectedRequest}
                onSelectRequest={handleSelectRequest}
                onStartTaskForProcess={handleStartTaskForProcess}
                onStartAllRemainingTasks={handleStartAllRemainingTasks}
              />
            )}

            {/* 8. Data Sources / Basic Data Map */}
            {currentMainView === 'data-sources' && (
              <DataSourcesCatalogView />
            )}

            {/* 9. Redaction Reviews Workspace */}
            {currentMainView === 'redaction-reviews' && (
              <RedactionReviewsView
                tasks={clientTasks}
                requests={requests}
                onSelectRequest={handleSelectRequest}
                onUpdateTaskRedaction={handleUpdateTaskRedaction}
              />
            )}

            {/* 10. SLA & Deadlines Radar */}
            {currentMainView === 'sla-deadlines' && (
              <SLADeadlinesView
                requests={requests}
                grievances={grievances}
                onSelectRequest={handleSelectRequest}
                onSelectGrievance={handleSelectGrievance}
              />
            )}

            {/* 11. Platform Audit Trail */}
            {currentMainView === 'audit-trail' && (
              <PlatformAuditTrailView
                requests={requests}
                clientTasks={clientTasks}
                onSelectRequest={handleSelectRequest}
                onSelectTask={(taskId, dsrId) => {
                  setSelectedRequestId(dsrId);
                  setCurrentMainView('details');
                }}
              />
            )}

            {/* 12. Settings & Integrations */}
            {currentMainView === 'settings' && (
              <SettingsView
                initialTab={settingsSubTab}
                currentUser={currentUser}
                onSwitchUser={setCurrentUser}
              />
            )}

          </main>
        </div>

        {/* Customer Registration & 2FA Flow Modal */}
        <CustomerAuthAndIntakeModal
          isOpen={isCustomerIntakeModalOpen}
          onClose={() => setIsCustomerIntakeModalOpen(false)}
          onSubmitSuccess={handleCustomerIntakeSubmit}
        />

        {/* Secondary Dutro Module Info Modal */}
        <ModuleInfoModal
          isOpen={Boolean(activeModuleModal)}
          onClose={() => setActiveModuleModal(null)}
          moduleName={activeModuleModal || ''}
        />

        {/* Global End-to-End Flow Diagram Modal */}
        <EndToEndFlowModal
          isOpen={isGlobalFlowModalOpen}
          onClose={() => setIsGlobalFlowModalOpen(false)}
        />

        {/* How Dutro Works Modal */}
        <HowItWorksModal
          isOpen={isHowItWorksOpen}
          onClose={() => setIsHowItWorksOpen(false)}
        />

      </div>
    </IntakeProvider>
  );
}

export default App;
