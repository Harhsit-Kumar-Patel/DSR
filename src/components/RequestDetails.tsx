import React, { useState } from 'react';
import { 
  PrivacyRequest, 
  ClientTask, 
  WorkspaceStep, 
  BusinessProcess, 
  BasicLocationCheckItem, 
  RedactionReviewState,
  DutroValidationState,
  AuditEvent
} from '../types';
import { 
  MASTER_CLIENT, 
  MASTER_CUSTOMER, 
  MASTER_BUSINESS_PROCESSES,
  INITIAL_BASIC_LOCATION_CHECKS
} from '../mockData/initialData';
import { 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Database, 
  Send, 
  Check, 
  ChevronRight, 
  Server, 
  Eye, 
  Sparkles, 
  ExternalLink, 
  Shield, 
  FileCheck, 
  UserCheck, 
  AlertCircle, 
  Plus, 
  Play, 
  CheckSquare, 
  Trash2, 
  Calendar, 
  Layers, 
  MessageSquareWarning, 
  Lock, 
  RotateCcw,
  AlertTriangle,
  FileText,
  HelpCircle,
  Archive,
  Download
} from 'lucide-react';
import { ProcessDetailModal } from './ProcessDetailModal';
import { CreateTaskModal } from './CreateTaskModal';
import { LiveSLABadge } from './ui/LiveSLABadge';
import { SLATimelineModal } from './modals/SLATimelineModal';
import { RedactionReviewSection } from './views/DSRWorkspace/RedactionReviewSection';
import { BasicDataLocationCheck } from './views/DSRWorkspace/BasicDataLocationCheck';

interface RequestDetailsProps {
  request: PrivacyRequest;
  clientTasks: ClientTask[];
  onBack: () => void;
  onCreateTask?: (taskData: Omit<ClientTask, 'id'>) => void;
  onDeleteTask?: (taskId: string) => void;
  onStartTaskForProcess?: (process: BusinessProcess) => void;
  onStartAllRemainingTasks?: (processes: BusinessProcess[]) => void;
  onTaskComplete?: (taskId: string) => void;
  onUpdateTaskRedaction?: (taskId: string, redactionState: RedactionReviewState) => void;
  onUpdateLocationCheck?: (checkId: string, updated: Partial<BasicLocationCheckItem>) => void;
  onAddLocationCheck?: (newItem: Omit<BasicLocationCheckItem, 'id'>) => void;
  onDutroReviewComplete: () => void;
  onDutroFinalizeRecommendation: () => void;
  onBankDeliverAndClose?: () => void;
  onRaiseGrievance?: (dsrId: string) => void;
  onNavigateToGrievances?: (grvId?: string) => void;
  onSwitchPerspective?: (perspective: any) => void;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({
  request,
  clientTasks,
  onBack,
  onCreateTask,
  onDeleteTask,
  onStartTaskForProcess,
  onStartAllRemainingTasks,
  onTaskComplete,
  onUpdateTaskRedaction,
  onUpdateLocationCheck,
  onAddLocationCheck,
  onDutroReviewComplete,
  onDutroFinalizeRecommendation,
  onBankDeliverAndClose,
  onRaiseGrievance,
  onNavigateToGrievances
}) => {
  const [activeStep, setActiveStep] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`dutro_unified_step_${request.id}`);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'verification';
  });

  const [dataMapAvailable, setDataMapAvailable] = useState<boolean>(
    request.dataDiscoveryMode !== 'basic-location'
  );

  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isSlaTimelineModalOpen, setIsSlaTimelineModalOpen] = useState(false);
  const [selectedTaskForRedaction, setSelectedTaskForRedaction] = useState<string | null>(null);
  const [validationReturnNote, setValidationReturnNote] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Basic Location Checks fallback
  const [localLocationChecks, setLocalLocationChecks] = useState<BasicLocationCheckItem[]>(
    request.basicLocationChecks && request.basicLocationChecks.length > 0 
      ? request.basicLocationChecks 
      : INITIAL_BASIC_LOCATION_CHECKS
  );

  const [auditTaskFilter, setAuditTaskFilter] = useState<string>('ALL');

  const handleStepChange = (step: string) => {
    setActiveStep(step);
    try {
      localStorage.setItem(`dutro_unified_step_${request.id}`, step);
    } catch {
      // ignore
    }
  };

  const tasksForThisDsr = clientTasks.filter(t => t.dsrId === request.id || !t.dsrId);
  const completedTasksCount = tasksForThisDsr.filter(t => t.status === 'Completed').length;
  const allTasksCompleted = tasksForThisDsr.length > 0 && completedTasksCount === tasksForThisDsr.length;

  const isDutroReviewed = Boolean(request.dutroReview?.isReviewed);
  const isDutroRecommendationFinalized = Boolean(request.dutroRecommendation?.isFinalized || request.status === 'Ready for Closure' || request.status === 'Ready for Approval');
  const isBankClosed = Boolean(request.bankClosure?.isDelivered || request.status === 'Completed' || request.status === 'Closed');
  const hasGrievance = Boolean(request.linkedGrievanceId || request.status === 'Grievance Raised');

  // Redaction reviews check across tasks
  const redactionReviewsCompletedCount = tasksForThisDsr.filter(
    t => t.redactionReview?.isReviewed || t.redactionReview?.finalDecision
  ).length;

  // Validation criteria checklist (Section 11)
  const validationChecks = {
    tasksCompleted: allTasksCompleted,
    systemsChecked: tasksForThisDsr.length > 0,
    dataFoundRecorded: tasksForThisDsr.some(t => t.dataFoundStatus === 'Data Found' || t.status === 'Completed'),
    redactionReviewCompleted: redactionReviewsCompletedCount >= Math.max(1, tasksForThisDsr.length - 1),
    evidenceAdded: tasksForThisDsr.some(t => t.evidenceRef),
    slaCompliant: request.slaDaysRemaining >= 0,
    internalReviewCompleted: isDutroReviewed
  };

  const isValidationReady = 
    validationChecks.tasksCompleted &&
    validationChecks.systemsChecked &&
    validationChecks.redactionReviewCompleted;

  // Map each RoPA match to its matching task in clientTasks
  const processesWithTaskStatus = MASTER_BUSINESS_PROCESSES.map((proc) => {
    const task = clientTasks.find(
      t => t.dsrId === request.id && (t.processName === proc.name || t.id === proc.taskId || t.sourceSystem === proc.source)
    );
    return {
      process: proc,
      task: task,
      isStarted: Boolean(task),
      isCompleted: task?.status === 'Completed'
    };
  });

  const unstartedProcesses = processesWithTaskStatus.filter(p => !p.isStarted).map(p => p.process);

  const handleUpdateLocalLocationCheck = (checkId: string, updated: Partial<BasicLocationCheckItem>) => {
    setLocalLocationChecks(prev => prev.map(c => c.id === checkId ? { ...c, ...updated } : c));
    if (onUpdateLocationCheck) onUpdateLocationCheck(checkId, updated);
  };

  const handleAddLocalLocationCheck = (newItem: Omit<BasicLocationCheckItem, 'id'>) => {
    const newCheck: BasicLocationCheckItem = {
      id: `loc-${localLocationChecks.length + 1}`,
      ...newItem
    };
    setLocalLocationChecks(prev => [...prev, newCheck]);
    if (onAddLocationCheck) onAddLocationCheck(newItem);
  };

  // 10 Lifecycle Stages (Section 7)
  const lifecycleSteps = [
    { id: 'verification', label: '1. Verification', icon: <UserCheck className="w-3.5 h-3.5" />, status: 'completed' },
    { id: 'discovery', label: '2. Data Discovery', icon: <Database className="w-3.5 h-3.5" />, status: 'completed' },
    { id: 'tasks', label: '3. Client Tasks', icon: <Building2 className="w-3.5 h-3.5" />, status: allTasksCompleted ? 'completed' : 'in-progress' },
    { id: 'retrieval', label: '4. Data Retrieval', icon: <Layers className="w-3.5 h-3.5" />, status: allTasksCompleted ? 'completed' : 'in-progress' },
    { id: 'redaction', label: '5. Redaction Review', icon: <Shield className="w-3.5 h-3.5" />, status: redactionReviewsCompletedCount > 0 ? 'completed' : 'pending' },
    { id: 'validation', label: '6. Validation', icon: <Eye className="w-3.5 h-3.5" />, status: isDutroReviewed ? 'completed' : isValidationReady ? 'ready' : 'pending' },
    { id: 'approval', label: '7. Approval', icon: <CheckSquare className="w-3.5 h-3.5" />, status: isDutroRecommendationFinalized ? 'completed' : 'pending' },
    { id: 'delivery', label: '8. Delivery', icon: <Send className="w-3.5 h-3.5" />, status: isBankClosed ? 'completed' : 'pending' },
    { id: 'history', label: '9. DSR History', icon: <Archive className="w-3.5 h-3.5" />, status: isBankClosed ? 'completed' : 'pending' },
    { id: 'grievance', label: '10. Grievance', icon: <MessageSquareWarning className="w-3.5 h-3.5" />, status: hasGrievance ? 'active-grv' : 'none' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6 select-none animate-fade-in">
      
      {/* TOP HEADER CASE SUMMARY CARD (Section 7) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Request Inbox</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200">
              {request.id}
            </span>

            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isBankClosed
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isDutroRecommendationFinalized
                ? 'bg-purple-50 text-purple-800 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {isBankClosed 
                ? '✓ Delivered & Closed' 
                : isDutroRecommendationFinalized 
                ? '✓ Recommended for Closure' 
                : request.status}
            </span>

            {/* Raise Grievance Action Button */}
            {isBankClosed && onRaiseGrievance && (
              <button
                onClick={() => onRaiseGrievance(request.id)}
                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                title="Customer disputes or raises grievance against this response"
              >
                <MessageSquareWarning className="w-3.5 h-3.5 text-amber-700" />
                <span>Raise Grievance</span>
              </button>
            )}
          </div>
        </div>

        {/* Title, Requester Info & Real-Time SLA Clock Card (Section 7 & 22) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {MASTER_CLIENT.name} · {request.type}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-blue-700">Unified Privacy Operations</span>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {request.personName}
            </h1>
            
            <p className="text-xs text-slate-500 mt-1">
              {request.email} • {request.phone} • Customer ID: <strong className="text-slate-700 font-mono">{request.accountNumber}</strong> • Channel: <strong className="text-slate-700">{request.channel}</strong>
            </p>
          </div>

          {/* REAL-TIME SLA CLOCK HEADER WIDGET (Section 22) */}
          <div className="flex items-center space-x-2 shrink-0">
            <div 
              onClick={() => setIsSlaTimelineModalOpen(true)}
              className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl p-3 text-right cursor-pointer transition-all shadow-2xs group"
              title="Click to view statutory SLA Timeline & Calendar"
            >
              <div className="flex items-center justify-end space-x-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  STATUTORY SLA CLOCK
                </span>
              </div>

              <LiveSLABadge 
                deadlineTimestamp={request.slaDeadlineTimestamp}
                startTimestamp={request.slaStartTimestamp}
                receivedTimestamp={request.receivedDate}
                isCompleted={isBankClosed}
                size="md"
              />

              <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-blue-600 font-semibold group-hover:underline">
                <Calendar className="w-3 h-3" />
                <span>View SLA Milestones →</span>
              </div>
            </div>
          </div>
        </div>

        {/* 10-STAGE STREAMLINED WORKFLOW STEPPER (Section 7) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 text-xs">
            {lifecycleSteps.map((step) => {
              const isActive = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepChange(step.id)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                      : step.status === 'completed'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : step.status === 'active-grv'
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase opacity-75">{step.label.split('.')[0]}</span>
                    {step.icon}
                  </div>
                  <span className="text-[11px] font-semibold truncate mt-1">
                    {step.label.split('.')[1]?.trim() || step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 1. VERIFICATION STAGE (Section 4 & 7) */}
      {/* ========================================================================= */}
      {activeStep === 'verification' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                CUSTOMER IDENTITY &amp; 2FA VERIFICATION
              </h2>
              <p className="text-xs text-slate-500">
                Verified prior to request intake. The actual identity source remains client-controlled.
              </p>
            </div>
            
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Identity Verified: {request.verificationStatus || 'Verified'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Requester Profile */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                VERIFIED CUSTOMER IDENTITY
              </span>
              
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Full Legal Name</span>
                  <span className="font-bold text-slate-800">{request.personName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Registered Email</span>
                  <span className="font-mono text-slate-800">{request.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Registered Mobile</span>
                  <span className="font-mono text-slate-800">{request.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Account ID</span>
                  <span className="font-mono font-bold text-blue-700">{request.accountNumber}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Intake Channel</span>
                  <span className="font-semibold text-slate-800">{request.channel}</span>
                </div>
              </div>
            </div>

            {/* Verification Metadata Recorded */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                RECORDED VERIFICATION METADATA
              </span>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Verification Method</span>
                  <span className="font-semibold text-emerald-800">{request.verificationMethod || 'OTP 2-Factor Authentication'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Verification Timestamp</span>
                  <span className="font-mono text-slate-700">{request.receivedDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Auth Token Reference</span>
                  <span className="font-mono text-blue-700 font-bold">{request.verificationToken || 'AUTH-2FA-OTP-78421-PASS'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Identity Source</span>
                  <span className="text-slate-700 font-medium">Client Organization Auth Gateway (Client-Controlled)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleStepChange('discovery')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>Proceed to Data Discovery →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DATA DISCOVERY STAGE (Section 8) */}
      {/* ========================================================================= */}
      {activeStep === 'discovery' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                DATA DISCOVERY &amp; PROCESS IDENTIFICATION
              </h2>
              <p className="text-xs text-slate-500">
                Identify relevant client systems and generate targeted tasks. Dutro coordinates without needing direct database access.
              </p>
            </div>

            {/* Data Map Available? Toggle (Section 8) */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setDataMapAvailable(true)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  dataMapAvailable ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Data Map Available (RoPA)
              </button>
              <button
                type="button"
                onClick={() => setDataMapAvailable(false)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !dataMapAvailable ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                No Data Map (Basic Location Check)
              </button>
            </div>
          </div>

          {dataMapAvailable ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  RoPA Mapped Business Processes ({MASTER_BUSINESS_PROCESSES.length})
                </span>
                {unstartedProcesses.length > 0 && onStartAllRemainingTasks && (
                  <button
                    type="button"
                    onClick={() => onStartAllRemainingTasks(MASTER_BUSINESS_PROCESSES)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Dispatch All Tasks ({unstartedProcesses.length} remaining)</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {processesWithTaskStatus.map(({ process, task, isStarted, isCompleted }) => (
                  <div key={process.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{process.name}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">{process.source} · {process.department}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : isStarted ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isCompleted ? '✓ Completed' : isStarted ? 'Dispatched' : 'Pending'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {process.dataFound.map((elem, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                          ✓ {elem}
                        </span>
                      ))}
                    </div>

                    <div className="pt-1 flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Lead: <strong>{process.owner}</strong></span>
                      {!isStarted && onStartTaskForProcess && (
                        <button
                          type="button"
                          onClick={() => onStartTaskForProcess(process)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Start Task
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <BasicDataLocationCheck 
              locationChecks={localLocationChecks}
              onUpdateLocationCheck={handleUpdateLocalLocationCheck}
              onAddLocationCheck={handleAddLocalLocationCheck}
            />
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleStepChange('tasks')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>View Client Tasks ({tasksForThisDsr.length}) →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CLIENT TASKS STAGE (Section 9) */}
      {/* ========================================================================= */}
      {activeStep === 'tasks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                CLIENT DEPARTMENT TASKS
              </h2>
              <p className="text-xs text-slate-500">
                Department leads check their own systems, record Data Found results, and review redactions.
              </p>
            </div>

            {onCreateTask && (
              <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Task</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tasksForThisDsr.map((task) => {
              const isCompleted = task.status === 'Completed';

              return (
                <div key={task.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        {task.id}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{task.processName}</span>
                      <span className="text-slate-400 font-mono text-xs">({task.sourceSystem})</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-500">Owner: <strong>{task.assignedPerson} ({task.department})</strong></span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}>
                        {isCompleted ? '✓ Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {task.dataRequested.map((elem, i) => (
                      <span key={i} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 text-[11px]">
                        ✓ {elem}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-slate-500">Result:</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {task.dataFoundStatus || 'Data Found'}
                      </span>
                      {task.evidenceRef && (
                        <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          Ref: {task.evidenceRef}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTaskForRedaction(selectedTaskForRedaction === task.id ? null : task.id)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Redaction Review ({task.redactionReview?.status || 'NO REDACTION REQUIRED'})
                      </button>

                      {!isCompleted && onTaskComplete && (
                        <button
                          type="button"
                          onClick={() => onTaskComplete(task.id)}
                          className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Complete Task
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedTaskForRedaction === task.id && (
                    <div className="pt-3 border-t border-slate-200">
                      <RedactionReviewSection 
                        task={task}
                        onUpdateRedactionReview={(tId, updated) => onUpdateTaskRedaction && onUpdateTaskRedaction(tId, updated)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleStepChange('retrieval')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>Proceed to Data Retrieval →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DATA RETRIEVAL STAGE */}
      {/* ========================================================================= */}
      {activeStep === 'retrieval' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              CONSOLIDATED DATA RETRIEVAL PACKAGE
            </h2>
            <p className="text-xs text-slate-500">
              Summary of personal data payload extracted across all client systems for {request.personName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">CRM &amp; Profile Data</span>
              <p className="text-slate-600 text-xs">Full legal name, account number ({request.accountNumber}), KYC verification timestamp, and registered contact credentials.</p>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                ✓ Confirmed by Operations Lead
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Customer Support Interaction History</span>
              <p className="text-slate-600 text-xs">14 historical support tickets, inquiry transcripts, and resolutions. Internal employee direct phone numbers redacted.</p>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                ✓ Confirmed by Customer Support
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Billing, Fee Statements &amp; Ledger</span>
              <p className="text-slate-600 text-xs">Monthly fee statements, payment transaction ledger, and statutory tax invoices since account creation.</p>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                ✓ Confirmed by Finance Operations
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Marketing Consents &amp; Preferences</span>
              <p className="text-slate-600 text-xs">Active opt-in consent records, newsletter subscriptions, and statutory privacy preference timestamps.</p>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                ✓ Confirmed by Marketing
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleStepChange('redaction')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>Proceed to Redaction Review →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. REDACTION & DISCLOSURE REVIEW STAGE (Section 10) */}
      {/* ========================================================================= */}
      {activeStep === 'redaction' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              REDACTION &amp; DISCLOSURE REVIEW
            </h2>
            <p className="text-xs text-slate-500">
              Dutro provides automated disclosure checks and guidance. The client makes the final legal decision before customer delivery.
            </p>
          </div>

          <div className="space-y-4">
            {tasksForThisDsr.map((task) => (
              <RedactionReviewSection
                key={task.id}
                task={task}
                onUpdateRedactionReview={(tId, updated) => onUpdateTaskRedaction && onUpdateTaskRedaction(tId, updated)}
              />
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleStepChange('validation')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>Proceed to Dutro Validation →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DUTRO VALIDATION STAGE (Section 11 & 12) */}
      {/* ========================================================================= */}
      {activeStep === 'validation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                DUTRO WORKFLOW VALIDATION
              </h2>
              <p className="text-xs text-slate-500">
                Automated compliance checkpoint verification before submitting the case to client legal approval.
              </p>
            </div>

            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
              isValidationReady
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              {isValidationReady ? '✓ READY FOR VALIDATION' : 'ACTION REQUIRED'}
            </span>
          </div>

          {/* Validation Checkpoints Checklist (Section 11 & 12) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="font-bold text-slate-900 uppercase text-[11px] block tracking-wider">
                Automated Compliance Checkpoints
              </span>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Required department tasks completed:</span>
                  <span className="font-bold text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ {completedTasksCount}/{tasksForThisDsr.length} Completed</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Relevant systems checked:</span>
                  <span className="font-bold text-emerald-700">✓ All Mapped Systems Checked</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Data Found / Not Found recorded:</span>
                  <span className="font-bold text-emerald-700">✓ Recorded</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Redaction &amp; disclosure review completed:</span>
                  <span className="font-bold text-emerald-700">✓ Completed &amp; Signed</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Required evidence/reference added:</span>
                  <span className="font-bold text-emerald-700">✓ Added</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Statutory SLA Compliance:</span>
                  <span className="font-bold text-emerald-700">✓ ON TRACK</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
              <span className="font-bold text-blue-950 uppercase text-[11px] block tracking-wider">
                Dutro Compliance Recommendation
              </span>
              <p className="text-slate-700 text-xs leading-relaxed">
                All department tasks and redaction reviews have been completed in statutory compliance with DPDP Act 2023 Sec. 11 and GDPR Art. 15. Dutro recommends this package for client legal approval and closure.
              </p>

              {isDutroReviewed && (
                <div className="p-2.5 bg-white rounded-lg border border-blue-200 text-[11px] text-blue-900 font-mono">
                  ✓ Validated by Dutro Advisory Team on 28 Sep 2026, 17:50 IST
                </div>
              )}
            </div>
          </div>

          {/* Validation Actions (Section 12) */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowReturnModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Return for Correction
            </button>

            <button
              type="button"
              onClick={() => {
                onDutroReviewComplete();
                onDutroFinalizeRecommendation();
                handleStepChange('approval');
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Approve for Delivery →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CLIENT APPROVAL STAGE (Section 13) */}
      {/* ========================================================================= */}
      {activeStep === 'approval' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                CLIENT LEGAL &amp; COMPLIANCE APPROVAL
              </h2>
              <p className="text-xs text-slate-500">
                Authorized Client Officer reviews the final package before response dispatch.
              </p>
            </div>

            <span className="text-xs font-mono font-bold bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
              READY FOR APPROVAL
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Requester:</span>
              <span className="font-bold text-slate-900">{request.personName} ({request.accountNumber})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Statutory Right:</span>
              <span className="font-semibold text-blue-700">{request.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Method:</span>
              <span className="font-medium text-slate-800">{request.channel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Statutory SLA Compliance:</span>
              <span className="font-bold text-emerald-700">✓ ON TRACK</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => handleStepChange('delivery')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Approve &amp; Deliver Response →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. DELIVERY / RESPONSE STAGE (Section 14) */}
      {/* ========================================================================= */}
      {activeStep === 'delivery' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              CUSTOMER RESPONSE DELIVERY
            </h2>
            <p className="text-xs text-slate-500">
              Secure transmission of full disclosure package directly to the verified requester.
            </p>
          </div>

          {!isBankClosed ? (
            <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-center space-y-4">
              <Send className="w-10 h-10 text-blue-600 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">Response Ready for Delivery</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Click below to dispatch the encrypted statutory disclosure package to {request.personName} via {request.channel}.
                </p>
              </div>

              <button
                type="button"
                onClick={onBankDeliverAndClose}
                className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all inline-flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Response to Customer</span>
              </button>
            </div>
          ) : (
            /* AFTER SENDING: IMMEDIATELY SHOWS GRIEVANCE STATUS (Section 14) */
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>✓ Response Delivered</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 block">Delivered Timestamp:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {request.bankClosure?.deliveredAt || '04 Oct 2026, 16:40 IST'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Delivery Channel:</span>
                    <span className="font-semibold text-slate-800">{request.channel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Receipt Token:</span>
                    <span className="font-mono text-blue-700 font-bold">
                      {request.bankClosure?.customerReceiptId || 'REC-2026-78421'}
                    </span>
                  </div>
                </div>
              </div>

              {/* GRIEVANCE STATUS IMMEDIATE PANEL (Section 14) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  CUSTOMER RESPONSE &amp; GRIEVANCE STATUS
                </span>

                {hasGrievance ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <MessageSquareWarning className="w-5 h-5 text-amber-700" />
                      <div>
                        <span className="font-bold text-amber-950 block">
                          Grievance: {request.linkedGrievanceId || 'GRV-1001'} — Under Level 1 Review
                        </span>
                        <p className="text-[11px] text-amber-800">Customer disputed omitted records in delivery package.</p>
                      </div>
                    </div>

                    {onNavigateToGrievances && (
                      <button
                        type="button"
                        onClick={() => onNavigateToGrievances(request.linkedGrievanceId)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0"
                      >
                        Open Grievance →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">Grievance: No grievance raised</span>
                        <p className="text-[11px] text-slate-500">Customer has not raised any dispute against this response.</p>
                      </div>
                    </div>

                    {onRaiseGrievance && (
                      <button
                        type="button"
                        onClick={() => onRaiseGrievance(request.id)}
                        className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Raise Grievance (Customer Demo)
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleStepChange('history')}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  View DSR History Snapshot →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. DSR HISTORY STAGE (Section 15) */}
      {/* ========================================================================= */}
      {activeStep === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                PERMANENT DSR AUDIT RECORD &amp; TASK LOGS
              </h2>
              <p className="text-xs text-slate-500">
                Statutory audit events and retrieval task milestones permanently sealed in tamper-evident ledger.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shrink-0">
              Retained in DSR History Archive
            </span>
          </div>

          {/* Task Selection Filter */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Filter Audit Trail by Retrieval Task:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setAuditTaskFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  auditTaskFilter === 'ALL'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                All Events ({request.auditTrail?.length || 0})
              </button>
              {tasksForThisDsr.map(t => {
                const count = request.auditTrail?.filter(e => 
                  e.details.includes(t.id) || 
                  e.details.toLowerCase().includes(t.processName.toLowerCase()) ||
                  e.action.toLowerCase().includes(t.processName.toLowerCase())
                ).length || 0;

                return (
                  <button
                    key={t.id}
                    onClick={() => setAuditTaskFilter(t.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                      auditTaskFilter === t.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{t.id}: {t.processName}</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      auditTaskFilter === t.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider block text-xs">
              Immutable Timeline &amp; Events
            </span>

            {(() => {
              const events = (request.auditTrail || []).filter(evt => {
                if (auditTaskFilter === 'ALL') return true;
                const taskObj = tasksForThisDsr.find(t => t.id === auditTaskFilter);
                return (
                  evt.details.includes(auditTaskFilter) ||
                  (taskObj && evt.details.toLowerCase().includes(taskObj.processName.toLowerCase())) ||
                  (taskObj && evt.action.toLowerCase().includes(taskObj.processName.toLowerCase()))
                );
              });

              if (events.length === 0) {
                return (
                  <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                    No audit records logged specifically for {auditTaskFilter}.
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {events.map((evt, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{evt.action}</span>
                          {evt.actor && <span className="text-slate-500 text-[11px]">by {evt.actor}</span>}
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{evt.details}</p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">{evt.timestamp}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. GRIEVANCE TAB IF RAISED */}
      {/* ========================================================================= */}
      {activeStep === 'grievance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              LINKED GRIEVANCE DISPUTE
            </h2>
            <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              {request.linkedGrievanceId || 'GRV-1001'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <span className="font-bold text-amber-950 block">Customer Dispute:</span>
            <p className="text-slate-800 text-xs">
              "Customer disputed omitted transaction records in response delivered on {request.bankClosure?.deliveredAt || request.receivedDate}."
            </p>
            {onNavigateToGrievances && (
              <button
                type="button"
                onClick={() => onNavigateToGrievances(request.linkedGrievanceId)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-2xs mt-2"
              >
                Open in Grievance Redressal Workspace →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {isCreateTaskModalOpen && onCreateTask && (
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onCreateTask={onCreateTask}
          dsrId={request.id}
          customerName={request.personName}
          customerEmail={request.email}
        />
      )}

      {isSlaTimelineModalOpen && (
        <SLATimelineModal
          isOpen={isSlaTimelineModalOpen}
          onClose={() => setIsSlaTimelineModalOpen(false)}
          request={request}
        />
      )}

      {/* Return for Correction Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-none">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Return Case for Correction</h3>
            <p className="text-xs text-slate-500">
              Specify the department task or redaction deficiency that requires correction before clearance.
            </p>
            <textarea
              rows={3}
              value={validationReturnNote}
              onChange={(e) => setValidationReturnNote(e.target.value)}
              placeholder="e.g. Please re-extract 2024 fee ledger records and redact third-party counterparty names..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReturnModal(false);
                  handleStepChange('tasks');
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Reopen Task &amp; Return
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
