import React, { useState, useEffect } from 'react';
import { 
  PrivacyRequest, 
  GrievanceRecord, 
  CustomerAccount, 
  AuthRole,
  CustomerNotification,
  ClientTask 
} from '../../../types';
import { 
  Shield, 
  ShieldCheck,
  UserCheck, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  HelpCircle, 
  LogOut, 
  Eye, 
  X, 
  MessageSquare, 
  ChevronRight, 
  FileCheck, 
  Lock,
  RefreshCw,
  Sparkles,
  Paperclip,
  CheckCircle,
  AlertTriangle,
  Bell,
  Mail,
  Inbox,
  Copy,
  Check,
  Send,
  ExternalLink,
  Database,
  Layers,
  Activity,
  Server,
  Briefcase
} from 'lucide-react';
import { MASTER_CLIENT } from '../../../mockData/initialData';

interface CustomerDashboardProps {
  customerAccount: CustomerAccount;
  requests: PrivacyRequest[];
  grievances: GrievanceRecord[];
  clientTasks?: ClientTask[];
  notifications?: CustomerNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onCreateRequest: (requestData: { description: string; attachmentName?: string }) => void;
  onRaiseGrievance: (dsrId: string, reason: string, complaint: string) => void;
  onSwitchToConsultant: () => void;
  onLogout: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  customerAccount,
  requests,
  grievances,
  clientTasks = [],
  notifications = [],
  onMarkNotificationRead,
  onCreateRequest,
  onRaiseGrievance,
  onSwitchToConsultant,
  onLogout
}) => {
  // Filter requests strictly belonging to this customer
  const customerRequests = requests.filter(r => 
    (r.email && r.email.toLowerCase() === customerAccount.email.toLowerCase()) || 
    (r.personName && r.personName.toLowerCase() === customerAccount.name.toLowerCase()) ||
    (r.customerId && r.customerId === customerAccount.id)
  );

  const displayRequests = customerRequests;

  // Customer-associated grievances strictly for this customer
  const customerGrievances = grievances.filter(g => 
    (g.customerEmail && g.customerEmail.toLowerCase() === customerAccount.email.toLowerCase()) ||
    (g.customerName && g.customerName.toLowerCase() === customerAccount.name.toLowerCase()) ||
    displayRequests.some(r => r.id === g.linkedDsrId)
  );

  // UI Modals
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
  const [selectedRequestForDetails, setSelectedRequestForDetails] = useState<PrivacyRequest | null>(null);
  const [selectedDsrForGrievance, setSelectedDsrForGrievance] = useState<string | null>(null);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [selectedNotificationForView, setSelectedNotificationForView] = useState<CustomerNotification | null>(null);
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);

  // Customer Notifications strictly for this customer
  const customerNotifications = notifications.filter(n =>
    (n.recipientEmail && n.recipientEmail.toLowerCase() === customerAccount.email.toLowerCase()) ||
    (n.recipientName && n.recipientName.toLowerCase() === customerAccount.name.toLowerCase()) ||
    displayRequests.some(r => r.id === n.relatedId) ||
    customerGrievances.some(g => g.id === n.relatedId)
  );
  const unreadCount = customerNotifications.filter(n => !n.read).length;

  const handleOpenNotification = (notif: CustomerNotification) => {
    setSelectedNotificationForView(notif);
    if (!notif.read && onMarkNotificationRead) {
      onMarkNotificationRead(notif.id);
    }
  };

  const handleCopyEmailText = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopiedEmail(true);
    setTimeout(() => setHasCopiedEmail(false), 2000);
  };

  // New Request Form State
  const [requestDescription, setRequestDescription] = useState(
    'I would like to receive a copy of the personal data held about me, including my customer profile, support interaction history, and fee billing statements.'
  );
  const [attachedFileName, setAttachedFileName] = useState<string>('');

  // Grievance Form State
  const [grievanceReason, setGrievanceReason] = useState('Missing personal data records in disclosure');
  const [grievanceComplaint, setGrievanceComplaint] = useState(
    'Some information was missing from my response package. Specific transaction statements and support notes were not included.'
  );

  // Real-time ticking state for SLA clocks
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format SLA Countdown
  const formatSlaCountdown = (deadlineIso: string) => {
    const deadline = new Date(deadlineIso).getTime();
    const diff = deadline - currentTime;
    if (diff <= 0) {
      return { text: 'SLA Elapsed', isOverdue: true, days: 0, hours: 0, mins: 0, secs: 0 };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      text: `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`,
      isOverdue: false,
      days,
      hours,
      mins,
      secs
    };
  };

  // Map internal technical stage to customer-friendly stage
  const getCustomerFriendlyStage = (req: PrivacyRequest) => {
    if (req.status === 'Closed' || req.bankClosure?.isDelivered || req.currentStage === 'Response Delivered') {
      return {
        label: 'Response Delivered',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        stepIndex: 6,
        description: 'Your verified personal data package has been prepared and securely delivered.'
      };
    }
    if (req.status === 'Grievance Raised' || req.linkedGrievanceId) {
      return {
        label: 'Grievance Under Review',
        badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
        stepIndex: 6,
        description: 'Your response grievance is actively being reviewed by the Privacy Redressal Office.'
      };
    }
    if (req.currentStage === 'Validation' || req.currentStage === 'Approval' || req.currentStage === 'Ready for Closure') {
      return {
        label: 'Final Review & Preparation',
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        stepIndex: 5,
        description: 'Your personal data response is undergoing final statutory quality check.'
      };
    }
    if (req.currentStage === 'Redaction Review') {
      return {
        label: 'Data Review in Progress',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        stepIndex: 4,
        description: 'Your information is being reviewed to protect third-party confidentiality.'
      };
    }
    if (req.currentStage === 'Data Retrieval' || req.currentStage === 'Client Tasks') {
      return {
        label: 'Data Collection in Progress',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
        stepIndex: 3,
        description: 'Your data is being collected from verified company records and systems.'
      };
    }
    if (req.currentStage === 'Data Discovery') {
      return {
        label: 'Data Discovery in Progress',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
        stepIndex: 2,
        description: 'Identifying databases and records holding your personal information.'
      };
    }
    if (req.verificationStatus === 'Verified') {
      return {
        label: 'Verification Completed',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
        stepIndex: 1,
        description: 'Identity verified. Initializing data discovery scan.'
      };
    }
    return {
      label: 'Request Submitted',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      stepIndex: 0,
      description: 'Your request has been securely received by the privacy office.'
    };
  };

  const handleCreateRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRequest({
      description: requestDescription,
      attachmentName: attachedFileName || undefined
    });
    setIsNewRequestModalOpen(false);
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDsrForGrievance) return;
    onRaiseGrievance(selectedDsrForGrievance, grievanceReason, grievanceComplaint);
    setIsGrievanceModalOpen(false);
    setSelectedDsrForGrievance(null);
  };

  const openGrievanceModalForDsr = (dsrId: string) => {
    setSelectedDsrForGrievance(dsrId);
    setIsGrievanceModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-slate-800 flex flex-col font-sans select-none antialiased">
      
      {/* Top Customer Header matching overall product */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-slate-900 tracking-tight">DUTRO</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200 uppercase">
                DATA PRINCIPAL PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{MASTER_CLIENT.name} Personal Data Rights Management</p>
          </div>
        </div>

        {/* Customer Account Indicator & Switcher */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {customerAccount.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left text-xs">
              <div className="flex items-center space-x-1.5 leading-tight">
                <span className="font-semibold text-slate-900">{customerAccount.name}</span>
                <span className="inline-flex items-center text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  <CheckCircle className="w-2.5 h-2.5 mr-0.5 text-emerald-600" /> Verified
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{customerAccount.email}</p>
            </div>
          </div>

          {/* Automated Statutory Communications & Emails Button */}
          <button
            onClick={() => setIsNotificationsModalOpen(true)}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer text-xs font-semibold shadow-2xs"
            title="View Automated Statutory Communications & Emails"
          >
            <Bell className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Communications</span>
            {unreadCount > 0 && (
              <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer text-xs font-semibold shadow-2xs"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-6">
        
        {/* Welcome & Quick Action Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Welcome, {customerAccount.name}
              </h1>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>2FA OTP Verified</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
              Submit personal data access requests and track fulfillment progress with real-time statutory SLA countdowns under the Digital Personal Data Protection (DPDP) Act and GDPR.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Access Request</span>
            </button>
          </div>
        </div>

        {/* SECTION: YOUR PRIVACY REQUESTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Privacy Requests</h2>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                {displayRequests.length} {displayRequests.length === 1 ? 'Request' : 'Requests'}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live SLA Synchronization</span>
            </div>
          </div>

          {displayRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-xs">
                <Shield className="w-7 h-7" />
              </div>
              
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Active Privacy Requests</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  You haven't submitted any Right of Access (DSAR) requests yet. You can submit a request at any time to obtain a verified copy of your personal data held across Client Organization systems.
                </p>
              </div>

              <div>
                <button
                  onClick={() => setIsNewRequestModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Submit Your First Access Request</span>
                </button>
              </div>

              {/* Statutory Guarantee Badges */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>30-Day SLA Clock</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Guaranteed statutory resolution with live countdown.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Email Delivery</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Final verified response sent directly to your registered email.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Statutory Redressal</span>
                  </div>
                  <p className="text-[11px] text-slate-500">15-day grievance rights under DPDP Act Sec. 13.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayRequests.map((req) => {
                const stageInfo = getCustomerFriendlyStage(req);
                const slaInfo = formatSlaCountdown(req.slaDeadlineTimestamp);
                const isDelivered = req.status === 'Closed' || req.bankClosure?.isDelivered || req.currentStage === 'Response Delivered';
                const hasGrievance = !!req.linkedGrievanceId;

                const reqTasks = (clientTasks || []).filter(t => t.dsrId === req.id);
                const completedTasksCount = reqTasks.filter(t => t.status === 'Completed').length;
                const totalTasksCount = reqTasks.length;
                const taskProgressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : (isDelivered ? 100 : 0);

                return (
                  <div
                    key={req.id}
                    className="bg-white hover:bg-slate-50/40 border border-slate-200 rounded-2xl p-6 transition-all shadow-sm space-y-5"
                  >
                    {/* Top Row: Case ID, Type, Date, Customer Status, SLA */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-bold text-blue-700 px-2.5 py-1 bg-blue-50 rounded-lg border border-blue-200">
                          {req.id}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-slate-900">
                              Right of Access
                            </span>
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.2 rounded border border-blue-200 font-semibold">
                              DSAR
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Submitted on: <span className="text-slate-700 font-medium">{req.receivedDate}</span>
                          </p>
                        </div>
                      </div>

                      {/* Status & Real-time SLA Badge */}
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${stageInfo.badgeClass}`}>
                            {stageInfo.label}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Deadline: {new Date(req.slaDeadlineTimestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-right min-w-[140px]">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center justify-end space-x-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span>SLA Remaining</span>
                          </div>
                          <div className={`font-mono text-xs font-bold ${slaInfo.isOverdue ? 'text-rose-600' : 'text-blue-700'}`}>
                            {slaInfo.text}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Timeline Stepper (6 customer stages) */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Fulfillment Lifecycle
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
                        {[
                          { title: 'Verification', index: 1 },
                          { title: 'Data Discovery', index: 2 },
                          { title: 'Data Collection', index: 3 },
                          { title: 'Redaction Review', index: 4 },
                          { title: 'Validation', index: 5 },
                          { title: 'Delivery', index: 6 }
                        ].map((stepItem) => {
                          const isPast = stageInfo.stepIndex > stepItem.index;
                          const isCurrent = stageInfo.stepIndex === stepItem.index;
                          const isPending = stageInfo.stepIndex < stepItem.index;

                          return (
                            <div 
                              key={stepItem.title} 
                              className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all ${
                                isPast
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                                  : isCurrent
                                  ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-100 shadow-2xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-400'
                              }`}
                            >
                              <div className="shrink-0">
                                {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                {isCurrent && (
                                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                                )}
                                {isPending && <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px]">○</div>}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate leading-tight">{stepItem.title}</p>
                                <p className="text-[10px] opacity-80 font-medium">
                                  {isPast ? 'Completed' : isCurrent ? 'Active' : 'Pending'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <p className="text-xs text-slate-600 italic pt-1">
                        Status update: {stageInfo.description}
                      </p>
                    </div>

                    {/* SECTION: FINAL PERSONAL DATA DISCLOSURE (DELIVERED DATA) OR ACTIVE PREPARATION STATUS */}
                    {isDelivered ? (
                      <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200 space-y-4 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/80">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                              <FileCheck className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-xs font-bold text-emerald-950 tracking-tight uppercase">
                                  Verified Personal Data Disclosure Package
                                </h4>
                                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                  Delivered &amp; Certified
                                </span>
                              </div>
                              <p className="text-[11px] text-emerald-700 mt-0.5">
                                Full Right of Access disclosure compiled under DPDP Act 2023 Sec. 11 &amp; GDPR Art. 15
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-100/90 text-emerald-950 border border-emerald-300 text-xs font-semibold shadow-2xs">
                            <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>The final response has been sent to your email ({req.email}).</span>
                          </div>
                        </div>

                        {/* Categorized Personal Data Records */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Card 1: Profile & Identity */}
                          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                <span>Profile &amp; Identity Dossier</span>
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                Verified
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 space-y-0.5">
                              <p>• Full Name: <strong className="text-slate-800">{req.personName}</strong></p>
                              <p>• Contact Email: <span className="font-mono text-slate-700">{req.email}</span></p>
                              <p>• Account No: <span className="font-mono text-slate-700">{req.accountNumber}</span></p>
                              <p>• Verification: <span className="text-emerald-700 font-semibold">2FA Authenticated</span></p>
                            </div>
                          </div>

                          {/* Card 2: Support & Communications */}
                          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                                <span>Support &amp; Interaction Logs</span>
                              </span>
                              <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                                Sanitized
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 space-y-0.5">
                              <p>• Customer Inquiries &amp; Tickets</p>
                              <p>• Support Chat Transcripts</p>
                              <p>• Resolution History &amp; CSAT</p>
                              <p>• Privacy: <span className="text-purple-700 font-semibold">3rd-Party PII Redacted</span></p>
                            </div>
                          </div>

                          {/* Card 3: Billing & Payments */}
                          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Billing &amp; Payment Ledger</span>
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                Complete
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 space-y-0.5">
                              <p>• Fee Statements &amp; Invoices</p>
                              <p>• Transaction Timestamps</p>
                              <p>• Statutory Tax Invoices</p>
                              <p>• Delivery: <span className="text-emerald-700 font-semibold">Sent to Email</span></p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-emerald-900">
                          <span className="flex items-center space-x-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Delivered on {req.bankClosure?.deliveredAt || '28 Sep 2026'} via Registered Email ({req.email}).</span>
                          </span>
                          <span className="font-mono text-[10px] text-emerald-700">Receipt Ref: {req.bankClosure?.customerReceiptId || 'REC-DPDP-78421'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200 space-y-2.5">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs font-bold text-slate-900">
                                Personal Data Collection &amp; Statutory Screening in Progress
                              </h4>
                              <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.2 rounded-full border border-blue-300 animate-pulse">
                                Active Processing
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Your personal records are currently being compiled across verified company systems and screened for third-party confidentiality.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-blue-200/80 text-[11px] text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="flex items-center space-x-1.5">
                            <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Your verified personal data package (ZIP/PDF) will be provisioned directly here upon completion.</span>
                          </span>
                          <span className="font-mono text-[10px] font-bold text-blue-700 whitespace-nowrap">
                            Statutory 30-Day SLA Active
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedRequestForDetails(req)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Request Details</span>
                        </button>
                      </div>

                      {/* Right Corner: Raise Grievance (Only shown once request gets completed/delivered) */}
                      {isDelivered && (
                        <div className="flex items-center space-x-2 ml-auto">
                          {!hasGrievance ? (
                            <button
                              onClick={() => openGrievanceModalForDsr(req.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
                              <span>Raise Grievance</span>
                            </button>
                          ) : (() => {
                            const linkedGrv = grievances.find(g => g.id === req.linkedGrievanceId);
                            const isGrvResolved = linkedGrv?.status === 'Resolved' || linkedGrv?.stage === 'Resolved' || linkedGrv?.status === 'Closed' || linkedGrv?.stage === 'Closed';
                            return (
                              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border ${
                                isGrvResolved 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                                  : 'bg-purple-50 border-purple-200 text-purple-900'
                              }`}>
                                {isGrvResolved ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
                                )}
                                <span className="text-xs font-medium">
                                  Grievance: <span className="font-mono font-bold">{req.linkedGrievanceId}</span>
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  isGrvResolved
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-purple-200 text-purple-900'
                                }`}>
                                  {isGrvResolved ? 'Resolved ✓' : 'Under Review'}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION: CUSTOMER GRIEVANCE TRACKING (IF ANY GRIEVANCES EXIST) */}
        {customerGrievances.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Redressal Grievances</h2>
              {(() => {
                const activeCount = customerGrievances.filter(g => g.status !== 'Resolved' && g.stage !== 'Resolved' && g.status !== 'Closed' && g.stage !== 'Closed').length;
                const resolvedCount = customerGrievances.length - activeCount;
                return (
                  <div className="flex items-center space-x-1.5">
                    {activeCount > 0 && (
                      <span className="text-xs bg-purple-50 text-purple-800 font-semibold px-2 py-0.5 rounded-full border border-purple-200">
                        {activeCount} Active
                      </span>
                    )}
                    {resolvedCount > 0 && (
                      <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                        {resolvedCount} Resolved
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="space-y-4">
              {customerGrievances.map((grv) => {
                const grvSla = formatSlaCountdown(grv.slaDeadlineTimestamp);
                const isResolved = grv.stage === 'Resolved' || grv.status === 'Resolved' || grv.stage === 'Closed' || grv.status === 'Closed';

                return (
                  <div 
                    key={grv.id}
                    className={`bg-white border rounded-2xl p-5 space-y-4 shadow-sm transition-all ${
                      isResolved ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-purple-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          isResolved 
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                            : 'bg-purple-50 text-purple-900 border-purple-200'
                        }`}>
                          {grv.id}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900">
                              Linked Request: <span className="font-mono font-bold text-blue-700">{grv.linkedDsrId}</span>
                            </span>
                            <span className={`text-[10px] px-2 py-0.2 rounded border font-bold ${
                              isResolved
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-purple-100 text-purple-900 border-purple-200'
                            }`}>
                              {isResolved ? 'Resolved ✓' : grv.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Raised on: {grv.dateRaised} {isResolved && grv.closureDate ? `• Resolved on: ${grv.closureDate}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Grievance SLA Clock or Resolved Indicator */}
                      {isResolved ? (
                        <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-right min-w-[130px]">
                          <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider flex items-center justify-end space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Statutory SLA</span>
                          </div>
                          <div className="font-mono text-xs font-bold text-emerald-950">Fulfilled &amp; Closed</div>
                        </div>
                      ) : (
                        <div className="bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 text-right min-w-[130px]">
                          <div className="text-[10px] text-purple-800 font-bold uppercase tracking-wider">Grievance SLA</div>
                          <div className="font-mono text-xs font-bold text-purple-950">{grvSla.text}</div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="text-slate-500 block font-medium">Grievance Reason:</span>
                      <p className="font-semibold text-slate-900">{grv.grievanceReason}</p>
                      {grv.customerComplaint && (
                        <p className="text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1">
                          "{grv.customerComplaint}"
                        </p>
                      )}
                    </div>

                    {/* Grievance Timeline */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        Resolution Stages
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-xs">
                        {(() => {
                          const getStageIndex = (stage: string) => {
                            switch (stage) {
                              case 'Grievance Raised':
                                return 1;
                              case 'Acknowledged':
                                return 2;
                              case 'Level 1 Review':
                              case 'Level 1 — Internal Review':
                              case 'Under Level 1 Review':
                                return 3;
                              case 'Senior Review':
                              case 'Level 2 — Escalation':
                              case 'Senior Privacy Review':
                              case 'Under Senior Review':
                              case 'Under Level 2 Review':
                                return 4;
                              case 'Final Review':
                              case 'Final Internal Review':
                                return 5;
                              case 'Resolved':
                              case 'Closed':
                                return 6;
                              default:
                                return 1;
                            }
                          };

                          const currentIdx = getStageIndex(grv.stage);

                          const steps = [
                            { step: 1, name: 'Raised' },
                            { step: 2, name: 'Acknowledged' },
                            { step: 3, name: 'Initial Review' },
                            { step: 4, name: 'Senior Review' },
                            { step: 5, name: 'Final Review' },
                            { step: 6, name: 'Closed / Resolved' }
                          ];

                          return steps.map((stg) => {
                            const isPast = !isResolved ? stg.step < currentIdx : true;
                            const isCurrent = !isResolved && stg.step === currentIdx;

                            return (
                              <div
                                key={stg.name}
                                className={`p-2 rounded-lg border text-center transition-all ${
                                  isPast
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                    : isCurrent
                                    ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold ring-1 ring-purple-200 shadow-2xs'
                                    : 'bg-slate-50 border-slate-200 text-slate-400'
                                }`}
                              >
                                <p className="font-bold text-[11px] truncate">{stg.name}</p>
                                <p className="text-[10px]">
                                  {isPast ? '✓ Completed' : isCurrent ? '● In Progress' : '○ Pending'}
                                </p>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* RESOLUTION RESULT / OUTCOME SECTION */}
                    {isResolved ? (
                      <div className="mt-4 pt-4 border-t border-emerald-200/80 bg-emerald-50/70 rounded-xl p-4 space-y-3.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                                Grievance Determination &amp; Corrective Action Result
                              </h3>
                              <p className="text-[11px] text-emerald-700">
                                Redressal inquiry complete &amp; statutory supplementary disclosure prepared
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                            <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                            Statutory Redressal Closed
                          </span>
                        </div>

                        {/* Official Findings Summary */}
                        <div className="bg-white rounded-xl p-3.5 border border-emerald-200 space-y-2 text-xs shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                              <FileText className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Official Determination &amp; Redressal Findings:</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              DPDP Act Sec. 13 • GDPR Art. 12(3)
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                            {grv.resolutionSummary || grv.internalNotes || (
                              "Following formal multi-tier review with Senior Privacy Officers and database administrators, the omitted records (transaction ledger statements and archived customer support interaction logs) were retrieved from cold storage, verified for third-party confidentiality redactions, and compiled into a comprehensive supplementary disclosure package."
                            )}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <span className="text-slate-500 block text-[10px]">Reviewed By</span>
                              <span className="font-semibold text-slate-800">{grv.assignedReviewer || 'Senior Grievance Officer'}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <span className="text-slate-500 block text-[10px]">Review Role</span>
                              <span className="font-semibold text-slate-800">{grv.assignedReviewerRole || 'Head of Privacy Operations'}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <span className="text-slate-500 block text-[10px]">Outcome Status</span>
                              <span className="font-bold text-emerald-700">Remediated &amp; Delivered</span>
                            </div>
                          </div>
                        </div>

                        {/* Final Resolution Message: Sent to Email */}
                        <div className="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-emerald-100/90 text-emerald-950 border border-emerald-300 text-xs font-semibold shadow-2xs mt-1">
                          <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>The final response has been sent to your email ({grv.customerEmail || customerAccount.email}).</span>
                        </div>
                      </div>
                    ) : (
                      /* ACTIVE IN-PROGRESS INVESTIGATION NOTE */
                      <div className="mt-3 bg-purple-50/70 rounded-xl p-4 border border-purple-200 text-xs space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-purple-200/80">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-2xs">
                              <Clock className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-purple-950">
                                Active Redressal Tier: <span className="text-purple-700">{grv.stage}</span>
                              </span>
                              <p className="text-[10px] text-purple-600">
                                Assigned to {grv.assignedReviewer} ({grv.assignedReviewerRole})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 animate-pulse">
                              ● Live Review Active
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-purple-900 block">
                            Investigation Notes &amp; Status:
                          </span>
                          <p className="text-purple-950/90 text-[11px] leading-relaxed bg-white/80 p-2.5 rounded-lg border border-purple-200/60 font-medium">
                            {grv.internalNotes || "Your grievance is currently undergoing formal multi-tier review with our Privacy Redressal team. Secondary system searches are being conducted to resolve your dispute within the statutory SLA."}
                          </p>
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[10px] text-purple-800">
                          <span>Statutory SLA Target: 15 Calendar Days (DPDP Act Sec. 13)</span>
                          <span className="font-mono font-bold">{grvSla.text} remaining</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: NEW ACCESS REQUEST (STRICTLY RIGHT OF ACCESS ONLY) */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Request Access to Your Personal Data</h3>
                  <p className="text-xs text-slate-500">Exercise statutory Right of Access (DSAR)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewRequestModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequestSubmit} className="space-y-4 text-xs">
              {/* Locked Request Type Indicator */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Request Privacy Right
                </label>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-900 font-semibold">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>RIGHT OF ACCESS / DSAR</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                    Preselected &amp; Locked
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  This prototype is configured exclusively for the Right of Access workflow under statutory privacy laws.
                </p>
              </div>

              {/* Verified Requester Summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Authenticated Requester:</span>
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified via 2FA OTP</span>
                  </span>
                </div>
                <div className="text-xs text-slate-800">
                  <span className="font-semibold">{customerAccount.name}</span> • {customerAccount.email} • {customerAccount.phone}
                </div>
              </div>

              {/* Request Description Input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  What personal data would you like to access?
                </label>
                <textarea
                  required
                  rows={4}
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                  placeholder="Describe the personal data records you wish to receive..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Optional Attachment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Optional Attachment (Identity or specific document references)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="attachment-upload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="attachment-upload"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center justify-between cursor-pointer hover:bg-white hover:border-slate-300"
                  >
                    <span className="truncate">
                      {attachedFileName || 'Choose a file (PDF, PNG, JPG, DOC)...'}
                    </span>
                    <Paperclip className="w-3.5 h-3.5 text-slate-400 ml-2" />
                  </label>
                  {attachedFileName && (
                    <button
                      type="button"
                      onClick={() => setAttachedFileName('')}
                      className="p-1.5 text-slate-400 hover:text-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Submission Notice & Buttons */}
              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Submit Access Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RAISE A GRIEVANCE */}
      {isGrievanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Raise a Grievance</h3>
                  <p className="text-xs text-slate-500">Formal statutory complaint redressal</p>
                </div>
              </div>
              <button 
                onClick={() => setIsGrievanceModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGrievanceSubmit} className="space-y-4 text-xs">
              {/* DSR Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Which request is this grievance about?
                </label>
                {(() => {
                  const eligibleRequests = displayRequests.filter(
                    r => r.status === 'Closed' || r.bankClosure?.isDelivered || r.currentStage === 'Response Delivered' || r.id === selectedDsrForGrievance
                  );

                  if (eligibleRequests.length === 0) {
                    return (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                        Grievances can only be lodged against completed/delivered requests. You currently have no completed requests.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {eligibleRequests.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => setSelectedDsrForGrievance(r.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            selectedDsrForGrievance === r.id
                              ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-xs text-purple-900">{r.id}</span>
                              <span className="text-[11px] font-semibold text-slate-800">Right of Access</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Status: {r.status} • Submitted: {r.receivedDate}
                            </p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                            selectedDsrForGrievance === r.id 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-white border border-slate-200 text-slate-700'
                          }`}>
                            {selectedDsrForGrievance === r.id ? 'Selected ✓' : 'Select'}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Grievance Reason */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Grievance
                </label>
                <select
                  value={grievanceReason}
                  onChange={(e) => setGrievanceReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-purple-500 font-medium"
                >
                  <option value="Missing personal data records in disclosure">Missing personal data records in disclosure</option>
                  <option value="Delay beyond statutory 30 calendar days SLA">Delay beyond statutory 30 calendar days SLA</option>
                  <option value="Excessive redaction of personal information">Excessive redaction of personal information</option>
                  <option value="Inaccurate personal data received">Inaccurate personal data received</option>
                  <option value="Other grievance redressal concern">Other grievance redressal concern</option>
                </select>
              </div>

              {/* Customer Complaint Details */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Describe Your Grievance / Complaint
                </label>
                <textarea
                  required
                  rows={3}
                  value={grievanceComplaint}
                  onChange={(e) => setGrievanceComplaint(e.target.value)}
                  placeholder="Please state why the response was inadequate or what specific records were missing..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* Grievance SLA Notice */}
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start space-x-2">
                <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  Once lodged, an independent statutory <strong>15 calendar days Grievance SLA</strong> clock will commence for Grievance Officer investigation.
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGrievanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedDsrForGrievance}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Submit Formal Grievance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CUSTOMER REQUEST DETAILS PREVIEW (FINAL DATA DISCLOSURE) */}
      {selectedRequestForDetails && (() => {
        const isDetailDelivered = selectedRequestForDetails.status === 'Closed' || selectedRequestForDetails.bankClosure?.isDelivered || selectedRequestForDetails.currentStage === 'Response Delivered';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold bg-blue-50 px-2.5 py-1 rounded-lg text-blue-700 border border-blue-200">
                    {selectedRequestForDetails.id}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Right of Access (DSAR) Request Details</h3>
                    <p className="text-[11px] text-slate-500">Statutory fulfillment records &amp; verified personal data package</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRequestForDetails(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                {/* Requester & SLA Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-medium text-[10px]">Requester</span>
                    <span className="font-bold text-slate-900 truncate block">{selectedRequestForDetails.personName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium text-[10px]">Identity Status</span>
                    <span className="font-semibold text-emerald-700">✓ Verified (OTP 2FA)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium text-[10px]">Submitted On</span>
                    <span className="font-semibold text-slate-800">{selectedRequestForDetails.receivedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium text-[10px]">Response Deadline</span>
                    <span className="font-semibold text-blue-700 font-mono">
                      {new Date(selectedRequestForDetails.slaDeadlineTimestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Customer Description */}
                <div>
                  <span className="text-slate-600 block mb-1 font-semibold">Your Request Description:</span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                    {selectedRequestForDetails.customerDescription || 'I would like to receive a copy of all personal data held about me.'}
                  </div>
                </div>

                {/* Delivered Response Section: Verified Final Personal Data */}
                {isDetailDelivered ? (
                  <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl text-emerald-950 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Verified Personal Data Package (Delivered)</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                        Certified &amp; Encrypted
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Your complete personal data package was compiled from verified Client Organization records, screened for third-party confidentiality, and delivered to your portal session on {selectedRequestForDetails.bankClosure?.deliveredAt || '28 Sep 2026'}.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-0.5">
                        <span className="font-bold text-slate-900 block">1. Profile Dossier</span>
                        <p className="text-slate-500 text-[10px]">KYC registration, account records, contact info.</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-0.5">
                        <span className="font-bold text-slate-900 block">2. Support Logs</span>
                        <p className="text-slate-500 text-[10px]">Inquiries &amp; interaction transcripts (sanitized).</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-0.5">
                        <span className="font-bold text-slate-900 block">3. Billing Archive</span>
                        <p className="text-slate-500 text-[10px]">Fee statements &amp; transaction ledgers.</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-emerald-100/90 text-emerald-950 border border-emerald-300 text-xs font-semibold">
                        <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>The final response has been sent to your email ({selectedRequestForDetails.email || customerAccount.email}).</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl text-blue-950 space-y-2">
                    <div className="flex items-center space-x-2 font-bold">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Fulfillment &amp; Screening in Progress</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Your access request is currently being fulfilled by the Privacy &amp; Operations teams. Databases are being queried and records sanitized for third-party confidentiality. Your final verified disclosure report will be delivered directly to your registered email upon completion.
                    </p>
                    <div className="text-[10px] text-blue-800 font-mono pt-1">
                      Statutory SLA: 30 Calendar Days guarantee under DPDP Act Sec. 11
                    </div>
                  </div>
                )}

                {/* Linked Grievance Section if one exists for this request */}
                {(() => {
                  const linkedGrv = grievances.find(g => g.id === selectedRequestForDetails.linkedGrievanceId);
                  if (!linkedGrv) return null;
                  const isGrvResolved = linkedGrv.status === 'Resolved' || linkedGrv.stage === 'Resolved' || linkedGrv.status === 'Closed' || linkedGrv.stage === 'Closed';

                  return (
                    <div className={`border p-3.5 rounded-xl text-xs space-y-2.5 ${
                      isGrvResolved 
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                        : 'bg-purple-50/80 border-purple-300 text-purple-950'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 font-bold">
                          {isGrvResolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-purple-600" />
                          )}
                          <span>Grievance Redressal ({linkedGrv.id})</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isGrvResolved ? 'bg-emerald-200 text-emerald-900' : 'bg-purple-200 text-purple-900'
                        }`}>
                          {isGrvResolved ? 'Resolved ✓' : 'Under Review'}
                        </span>
                      </div>

                      <p className="text-[11px] leading-relaxed text-slate-700">
                        {isGrvResolved 
                          ? (linkedGrv.resolutionSummary || "Grievance resolved with supplementary personal data package prepared & statutory certificate issued.")
                          : "Your grievance is actively under review with the Privacy Redressal Office."
                        }
                      </p>

                      {isGrvResolved && (
                        <div className="flex items-center space-x-2 text-emerald-900 text-xs font-semibold pt-1">
                          <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>The final resolution response has been sent to your email.</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setSelectedRequestForDetails(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}


      {/* MODAL 4: STATUTORY COMMUNICATIONS & NOTIFICATIONS DRAWER */}
      {isNotificationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-2xs">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900">Statutory Communications &amp; Automated Notices</h3>
                    <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                      {customerNotifications.length} Dispatched
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Official emails dispatched under DPDP Act 2023 &amp; GDPR compliance
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsNotificationsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {customerNotifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Mail className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">No statutory notifications received yet.</p>
                </div>
              ) : (
                customerNotifications.map((notif) => {
                  const getTriggerStyle = (trigger: string) => {
                    switch (trigger) {
                      case 'dsr-intake-received':
                        return 'bg-blue-50 text-blue-800 border-blue-200';
                      case 'dsr-output-delivered':
                        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
                      case 'grievance-initiated':
                        return 'bg-purple-50 text-purple-800 border-purple-200';
                      case 'grievance-closed-initial-review':
                        return 'bg-teal-50 text-teal-800 border-teal-200';
                      case 'grievance-closed-senior-review':
                        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
                      case 'grievance-closed-final-review':
                        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
                      default:
                        return 'bg-slate-50 text-slate-700 border-slate-200';
                    }
                  };

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleOpenNotification(notif)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-xs flex items-start space-x-3.5 ${
                        !notif.read
                          ? 'bg-purple-50/40 border-purple-200 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                        <Mail className="w-3.5 h-3.5 text-purple-600" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border truncate ${getTriggerStyle(notif.triggerStage)}`}>
                            {notif.triggerLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">{notif.timestamp}</span>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />}
                          <h4 className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notif.subject}
                          </h4>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {notif.previewText}
                        </p>

                        <div className="flex items-center space-x-2 pt-1">
                          <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            Ref: {notif.relatedId}
                          </span>
                          <span className="text-[10px] text-purple-700 font-semibold flex items-center space-x-0.5 hover:underline">
                            <span>Read Official Email</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">All communications are cryptographically signed &amp; timestamped.</span>
              <button
                onClick={() => setIsNotificationsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: OFFICIAL STATUTORY EMAIL READER */}
      {selectedNotificationForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Email Client Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs tracking-tight">DUTRO PRIVACY ENGINE</span>
                    <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.2 rounded uppercase">
                      OFFICIAL DISPATCH
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-mono">ID: {selectedNotificationForView.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyEmailText(selectedNotificationForView.bodyText)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                  title="Copy email text to clipboard"
                >
                  {hasCopiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{hasCopiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
                <button 
                  onClick={() => setSelectedNotificationForView(null)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Email Metadata Bar */}
            <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50 text-xs space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="text-slate-400 font-medium">From: </span>
                  <span className="font-semibold text-slate-800">Dutro Privacy Compliance &lt;compliance@clientorg.com&gt;</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {selectedNotificationForView.timestamp}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">To: </span>
                <span className="font-semibold text-slate-800">
                  {selectedNotificationForView.recipientName} &lt;{selectedNotificationForView.recipientEmail}&gt;
                </span>
              </div>

              <div className="pt-1 flex items-center space-x-2">
                <span className="text-slate-400 font-medium">Subject: </span>
                <span className="font-bold text-slate-900">{selectedNotificationForView.subject}</span>
              </div>

              <div className="pt-1 flex items-center space-x-2">
                <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded border border-purple-200">
                  {selectedNotificationForView.triggerLabel}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Statutory Ref: {selectedNotificationForView.relatedId}
                </span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#FAFAFA]">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {selectedNotificationForView.bodyText}
              </div>

              {/* Email Delivery Confirmation Note */}
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2.5 text-xs text-emerald-950 font-medium">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>The final statutory response has been sent to your email ({selectedNotificationForView.recipientEmail || customerAccount.email}).</span>
              </div>
            </div>

            {/* Reader Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedNotificationForView(null);
                  setIsNotificationsModalOpen(true);
                }}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center space-x-1 cursor-pointer"
              >
                <span>← Back to All Communications</span>
              </button>
              <button
                onClick={() => setSelectedNotificationForView(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-xs text-slate-500">
        Dutro Privacy Operations Platform • Single Unified Data Engine • DPDP Act 2023 &amp; GDPR Compliant
      </footer>
    </div>
  );
};
