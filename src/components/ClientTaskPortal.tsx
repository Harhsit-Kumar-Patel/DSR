import React, { useState, useMemo } from 'react';
import { ClientTask, DemoPerspective, PrivacyRequest, GrievanceRecord, RedactionReviewState } from '../types';
import { MASTER_CLIENT, MASTER_CUSTOMER, createDefaultRedactionReview } from '../mockData/initialData';
import { LiveSLABadge } from './ui/LiveSLABadge';
import { RedactionReviewSection } from './views/DSRWorkspace/RedactionReviewSection';
import { CreateTaskModal } from './CreateTaskModal';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Server, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Info, 
  Lock, 
  UserCheck, 
  Send, 
  Sparkles, 
  FileCheck, 
  Plus, 
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  RotateCcw,
  FileText,
  Layers,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Database,
  User,
  MessageSquareWarning,
  Archive,
  Inbox,
  AlertTriangle
} from 'lucide-react';

interface ClientTaskPortalProps {
  tasks: ClientTask[];
  requests?: PrivacyRequest[];
  grievances?: GrievanceRecord[];
  activeRequest?: PrivacyRequest;
  onSelectRequest?: (id: string) => void;
  onTaskComplete: (taskId: string) => void;
  onCreateTask?: (taskData: Omit<ClientTask, 'id'>) => void;
  onDeleteTask?: (taskId: string) => void;
  onUpdateRedactionReview?: (taskId: string, reviewState: RedactionReviewState) => void;
  onBankDeliverAndClose?: () => void;
  onResolveGrievance?: (grievanceId: string, resolutionNotes: string) => void;
  onSwitchPerspective: (perspective: DemoPerspective) => void;
}

export type ClientPortalTab = 'requests' | 'tasks' | 'grievances' | 'completed';

export const ClientTaskPortal: React.FC<ClientTaskPortalProps> = ({
  tasks,
  requests = [],
  grievances = [],
  activeRequest,
  onSelectRequest,
  onTaskComplete,
  onCreateTask,
  onDeleteTask,
  onUpdateRedactionReview,
  onBankDeliverAndClose,
  onResolveGrievance,
  onSwitchPerspective
}) => {
  // Navigation Tabs in Client Portal
  const [activePortalTab, setActivePortalTab] = useState<ClientPortalTab>('requests');

  // Selected Request inside the Client Portal
  const [selectedReqId, setSelectedReqId] = useState<string>(activeRequest?.id || 'DSR-2001');

  // Currently opened request in detail view (null means overview list)
  const [isRequestDetailOpen, setIsRequestDetailOpen] = useState<boolean>(false);

  // Active sub-tab inside request detail
  const [requestSubTab, setRequestSubTab] = useState<'tasks' | 'grievance' | 'clearance'>('tasks');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedDsrFilter, setSelectedDsrFilter] = useState<string>('ALL');

  // Task Drawer State
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmedCheckbox, setIsConfirmedCheckbox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isDeliveringFinal, setIsDeliveringFinal] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  // Grievance resolution form state
  const [grievanceNotes, setGrievanceNotes] = useState<string>('');
  const [isResolvingGrievance, setIsResolvingGrievance] = useState<boolean>(false);
  const [grievanceSuccessToast, setGrievanceSuccessToast] = useState<boolean>(false);

  // Deduplicate tasks defensively
  const uniqueTasks = useMemo(() => {
    const seen = new Set<string>();
    const seenProcess = new Set<string>();
    const result: ClientTask[] = [];
    for (const t of tasks) {
      if (!t || !t.id) continue;
      const key = `${t.dsrId || 'DSR-2001'}__${t.processName || t.id}`;
      if (!seen.has(t.id) && !seenProcess.has(key)) {
        seen.add(t.id);
        seenProcess.add(key);
        result.push(t);
      }
    }
    return result;
  }, [tasks]);

  // Current active request object
  const currentSelectedRequest = useMemo(() => {
    return requests.find(r => r.id === selectedReqId) || activeRequest || requests[0];
  }, [requests, selectedReqId, activeRequest]);

  // Tasks for current selected request
  const tasksForCurrentReq = useMemo(() => {
    return uniqueTasks.filter(t => t.dsrId === currentSelectedRequest?.id);
  }, [uniqueTasks, currentSelectedRequest]);

  // Linked Grievance for current selected request
  const linkedGrievance = useMemo(() => {
    if (!currentSelectedRequest?.linkedGrievanceId) return null;
    return grievances.find(g => g.id === currentSelectedRequest.linkedGrievanceId || g.linkedDsrId === currentSelectedRequest.id) || null;
  }, [grievances, currentSelectedRequest]);

  // KPIs for the Client Dashboard
  const kpis = useMemo(() => {
    const openRequests = requests.filter(r => r.status !== 'Closed' && r.status !== 'Completed');
    const pendingTasks = uniqueTasks.filter(t => t.status === 'Waiting for client action');
    const dueSoon = requests.filter(r => r.slaDaysRemaining <= 3 && r.status !== 'Closed' && r.status !== 'Completed');
    const activeGrievances = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed');
    const readyForClosure = requests.filter(r => r.dutroRecommendation?.isFinalized || r.status === 'Ready for Closure' || r.status === 'Recommended for Closure');
    const completed = requests.filter(r => r.status === 'Closed' || r.status === 'Completed');

    return {
      openRequests: openRequests.length,
      pendingTasks: pendingTasks.length,
      dueSoon: dueSoon.length || 1,
      activeGrievances: activeGrievances.length,
      readyForClosure: readyForClosure.length,
      completed: completed.length
    };
  }, [requests, uniqueTasks, grievances]);

  // Available departments from tasks
  const availableDepartments = useMemo(() => {
    const depts = uniqueTasks.map(t => t.assignedTeam || t.department);
    return Array.from(new Set(depts)).filter(Boolean);
  }, [uniqueTasks]);

  // Filtered Requests list
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Tab filter
      if (activePortalTab === 'completed') {
        if (req.status !== 'Closed' && req.status !== 'Completed') return false;
      } else if (activePortalTab === 'requests') {
        if (req.status === 'Closed' || req.status === 'Completed') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          req.id.toLowerCase().includes(q) ||
          req.personName.toLowerCase().includes(q) ||
          req.email.toLowerCase().includes(q) ||
          req.accountNumber.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Status Filter
      if (selectedStatusFilter !== 'ALL' && req.status !== selectedStatusFilter) {
        return false;
      }

      return true;
    });
  }, [requests, activePortalTab, searchQuery, selectedStatusFilter]);

  // Filtered Tasks list for the "All Tasks" view
  const filteredTasks = useMemo(() => {
    return uniqueTasks.filter(task => {
      if (selectedDsrFilter !== 'ALL' && task.dsrId !== selectedDsrFilter) return false;
      if (selectedDeptFilter !== 'ALL' && task.assignedTeam !== selectedDeptFilter && task.department !== selectedDeptFilter) return false;
      if (selectedStatusFilter !== 'ALL' && task.status !== selectedStatusFilter) return false;
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          task.id.toLowerCase().includes(q) ||
          task.dsrId.toLowerCase().includes(q) ||
          task.processName.toLowerCase().includes(q) ||
          task.customerName.toLowerCase().includes(q) ||
          task.assignedPerson.toLowerCase().includes(q) ||
          task.assignedTeam.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [uniqueTasks, selectedDsrFilter, selectedDeptFilter, selectedStatusFilter, searchQuery]);

  // Active selected task object
  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;
    return uniqueTasks.find(t => t.id === activeTaskId) || null;
  }, [activeTaskId, uniqueTasks]);

  // Open Request Workspace Handler
  const handleOpenRequestWorkspace = (reqId: string) => {
    setSelectedReqId(reqId);
    if (onSelectRequest) onSelectRequest(reqId);
    setIsRequestDetailOpen(true);
    setRequestSubTab('tasks');
  };

  // Complete Task Handler
  const handleConfirmTaskCompletion = () => {
    if (!isConfirmedCheckbox || !activeTask) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      onTaskComplete(activeTask.id);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 300);
  };

  // Authorize Final Response Delivery Handler
  const handleDeliverAndClose = () => {
    if (!onBankDeliverAndClose) return;
    setIsDeliveringFinal(true);
    setTimeout(() => {
      setIsDeliveringFinal(false);
      onBankDeliverAndClose();
    }, 400);
  };

  // Resolve Grievance Handler
  const handleResolveGrievanceAction = (grvId: string) => {
    if (!onResolveGrievance) return;
    setIsResolvingGrievance(true);
    setTimeout(() => {
      setIsResolvingGrievance(false);
      onResolveGrievance(grvId, grievanceNotes || 'Client Privacy Officer completed investigation and delivered supplementary records.');
      setGrievanceSuccessToast(true);
      setTimeout(() => setGrievanceSuccessToast(false), 4000);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-y-auto custom-scroll text-slate-900 select-none">
      
      {/* Top Client Portal Navigation Bar */}
      <div className="bg-slate-900 text-white px-6 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight">{MASTER_CLIENT.name.toUpperCase()}</span>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Client Privacy &amp; Operations Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Department Retrieval Tasks &amp; Grievance Redressal Workspace
            </p>
          </div>
        </div>

        {/* Perspective Switcher */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onSwitchPerspective('dutro-officer')}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to Dutro Privacy Workspace</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">

        {/* Top Operational Status Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {MASTER_CLIENT.name} · Internal Data Discovery &amp; Fulfillment
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Dutro Workflow Sync Active</span>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Client Operations Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                Fulfill department data retrieval tasks, complete redaction reviews, and resolve customer grievances. Raw customer data stays within client systems.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Retrieval Task</span>
              </button>
            </div>
          </div>

          {/* 6 Client KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            
            {/* Card 1: Active DSR Requests */}
            <div 
              onClick={() => { setActivePortalTab('requests'); setIsRequestDetailOpen(false); }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activePortalTab === 'requests' && !isRequestDetailOpen
                  ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                  : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-slate-500 block tracking-wider">Active DSRs</span>
              <span className="text-xl font-bold text-slate-900 font-mono block">{kpis.openRequests}</span>
              <span className="text-[10px] text-blue-600 font-semibold">Open Access Requests</span>
            </div>

            {/* Card 2: Pending Client Tasks */}
            <div 
              onClick={() => { setActivePortalTab('tasks'); setIsRequestDetailOpen(false); }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activePortalTab === 'tasks' && !isRequestDetailOpen
                  ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20'
                  : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-amber-700 block tracking-wider">Pending Tasks</span>
              <span className="text-xl font-bold text-amber-900 font-mono block">{kpis.pendingTasks}</span>
              <span className="text-[10px] text-amber-700 font-semibold">Department Extractions</span>
            </div>

            {/* Card 3: Due Soon */}
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-rose-700 block tracking-wider">Due Soon / Urgent</span>
              <span className="text-xl font-bold text-rose-900 font-mono block">{kpis.dueSoon}</span>
              <span className="text-[10px] text-rose-600 font-semibold">Ticking SLA Clocks</span>
            </div>

            {/* Card 4: Grievances */}
            <div 
              onClick={() => { setActivePortalTab('grievances'); setIsRequestDetailOpen(false); }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activePortalTab === 'grievances' && !isRequestDetailOpen
                  ? 'bg-amber-100/70 border-amber-400 ring-2 ring-amber-500/20'
                  : 'bg-amber-50/50 border-amber-200 hover:bg-amber-100/50'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-amber-900 block tracking-wider">Grievances</span>
              <span className="text-xl font-bold text-amber-950 font-mono block">{kpis.activeGrievances}</span>
              <span className="text-[10px] text-amber-800 font-semibold">Disputes Under Review</span>
            </div>

            {/* Card 5: Dutro Cleared */}
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-purple-700 block tracking-wider">Dutro Cleared</span>
              <span className="text-xl font-bold text-purple-900 font-mono block">{kpis.readyForClosure}</span>
              <span className="text-[10px] text-purple-700 font-semibold">Ready for Delivery</span>
            </div>

            {/* Card 6: Completed */}
            <div 
              onClick={() => { setActivePortalTab('completed'); setIsRequestDetailOpen(false); }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activePortalTab === 'completed' && !isRequestDetailOpen
                  ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-emerald-700 block tracking-wider">Completed</span>
              <span className="text-xl font-bold text-emerald-900 font-mono block">{kpis.completed}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Delivered to Users</span>
            </div>

          </div>
        </div>

        {/* Primary Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <button
              onClick={() => { setActivePortalTab('requests'); setIsRequestDetailOpen(false); }}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
                activePortalTab === 'requests' && !isRequestDetailOpen
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Active DSR Requests</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activePortalTab === 'requests' && !isRequestDetailOpen ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {kpis.openRequests}
              </span>
            </button>

            <button
              onClick={() => { setActivePortalTab('tasks'); setIsRequestDetailOpen(false); }}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
                activePortalTab === 'tasks' && !isRequestDetailOpen
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Department Tasks Queue</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activePortalTab === 'tasks' && !isRequestDetailOpen ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {kpis.pendingTasks}
              </span>
            </button>

            <button
              onClick={() => { setActivePortalTab('grievances'); setIsRequestDetailOpen(false); }}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
                activePortalTab === 'grievances' && !isRequestDetailOpen
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-300'
              }`}
            >
              <MessageSquareWarning className="w-4 h-4" />
              <span>Grievances Desk</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activePortalTab === 'grievances' && !isRequestDetailOpen ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-900'
              }`}>
                {kpis.activeGrievances}
              </span>
            </button>

            <button
              onClick={() => { setActivePortalTab('completed'); setIsRequestDetailOpen(false); }}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
                activePortalTab === 'completed' && !isRequestDetailOpen
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Completed &amp; Delivered</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activePortalTab === 'completed' && !isRequestDetailOpen ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {kpis.completed}
              </span>
            </button>
          </div>

          {/* Breadcrumb if inside Request Detail */}
          {isRequestDetailOpen && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Viewing Request:</span>
              <span className="font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                {currentSelectedRequest?.id}
              </span>
              <button
                onClick={() => setIsRequestDetailOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline ml-2 cursor-pointer"
              >
                Back to List
              </button>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: ACTIVE DSR REQUESTS TABLE / OVERVIEW                  */}
        {/* ------------------------------------------------------------- */}
        {activePortalTab === 'requests' && !isRequestDetailOpen && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Requester, DSR ID, Email, Account..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending Client Action">Pending Client Action</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Ready for Closure">Ready for Closure</option>
                  <option value="Grievance Raised">Grievance Raised</option>
                </select>
              </div>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Data Principal / Requester</th>
                    <th className="py-3 px-4">Right Type</th>
                    <th className="py-3 px-4">Real-Time SLA Clock</th>
                    <th className="py-3 px-4">Department Tasks</th>
                    <th className="py-3 px-4">Dutro Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map(req => {
                    const reqTasks = uniqueTasks.filter(t => t.dsrId === req.id);
                    const completedTasks = reqTasks.filter(t => t.status === 'Completed').length;
                    const hasGrievance = Boolean(req.linkedGrievanceId || req.status === 'Grievance Raised');
                    const isReadyForDelivery = req.dutroRecommendation?.isFinalized || req.status === 'Ready for Closure';

                    return (
                      <tr 
                        key={req.id} 
                        onClick={() => handleOpenRequestWorkspace(req.id)}
                        className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                          {req.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{req.personName}</div>
                          <div className="text-[11px] text-slate-400">{req.email} · {req.accountNumber}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]">
                            {req.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <LiveSLABadge 
                            deadlineTimestamp={req.slaDeadlineTimestamp}
                            startTimestamp={req.slaStartTimestamp}
                            receivedTimestamp={req.receivedDate}
                            isCompleted={req.status === 'Closed' || req.status === 'Completed'}
                            size="sm"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          {reqTasks.length > 0 ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600">
                                <span>{completedTasks}/{reqTasks.length} Done</span>
                                <span className={completedTasks === reqTasks.length ? 'text-emerald-600' : 'text-amber-600'}>
                                  {Math.round((completedTasks / reqTasks.length) * 100)}%
                                </span>
                              </div>
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${completedTasks === reqTasks.length ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                  style={{ width: `${(completedTasks / reqTasks.length) * 100}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No tasks mapped</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {hasGrievance ? (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] flex items-center space-x-1 w-max">
                              <MessageSquareWarning className="w-3 h-3 text-amber-700" />
                              <span>Grievance Active</span>
                            </span>
                          ) : isReadyForDelivery ? (
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 font-bold text-[10px] flex items-center space-x-1 w-max">
                              <CheckCircle2 className="w-3 h-3 text-purple-700" />
                              <span>Cleared for Delivery</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                              {req.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenRequestWorkspace(req.id);
                            }}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg font-bold text-xs transition-all flex items-center space-x-1 ml-auto cursor-pointer"
                          >
                            <span>Open Tasks</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1 (DRILLDOWN): REQUEST WORKSPACE & TASK EXECUTION        */}
        {/* ------------------------------------------------------------- */}
        {activePortalTab === 'requests' && isRequestDetailOpen && currentSelectedRequest && (
          <div className="space-y-6">
            
            {/* Request Summary Top Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono font-bold text-sm bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                      {currentSelectedRequest.id}
                    </span>
                    <span className="text-[11px] font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {currentSelectedRequest.type}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      Received: {currentSelectedRequest.receivedDate}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {currentSelectedRequest.personName} · Request Workspace
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Email: <strong className="text-slate-700">{currentSelectedRequest.email}</strong> · Phone: <strong className="text-slate-700">{currentSelectedRequest.phone}</strong> · Account: <strong className="text-slate-700">{currentSelectedRequest.accountNumber}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <LiveSLABadge 
                    deadlineTimestamp={currentSelectedRequest.slaDeadlineTimestamp}
                    startTimestamp={currentSelectedRequest.slaStartTimestamp}
                    receivedTimestamp={currentSelectedRequest.receivedDate}
                    isCompleted={currentSelectedRequest.status === 'Closed' || currentSelectedRequest.status === 'Completed'}
                    size="lg"
                  />
                </div>
              </div>

              {/* Sub-Navigation within Request */}
              <div className="flex items-center space-x-2 border-t border-slate-100 pt-3 text-xs font-bold">
                <button
                  onClick={() => setRequestSubTab('tasks')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                    requestSubTab === 'tasks'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Department Tasks ({tasksForCurrentReq.length})</span>
                </button>

                {linkedGrievance && (
                  <button
                    onClick={() => setRequestSubTab('grievance')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                      requestSubTab === 'grievance'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    <MessageSquareWarning className="w-3.5 h-3.5 text-amber-700" />
                    <span>Grievance Redressal ({linkedGrievance.id})</span>
                  </button>
                )}

                <button
                  onClick={() => setRequestSubTab('clearance')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                    requestSubTab === 'clearance'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span>Dutro Clearance &amp; Final Delivery</span>
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: DEPARTMENT TASKS */}
            {requestSubTab === 'tasks' && (
              <div className="space-y-4">
                
                {/* Active Grievance Alert Bar if applicable */}
                {linkedGrievance && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-amber-950 flex items-center space-x-2">
                          <span>Active Grievance Raised by Customer ({linkedGrievance.id})</span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono">
                            {linkedGrievance.stage}
                          </span>
                        </div>
                        <p className="text-xs text-amber-800 mt-1">
                          Disputed issue: &ldquo;{linkedGrievance.grievanceReason}&rdquo;
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setRequestSubTab('grievance')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 shadow-2xs cursor-pointer"
                    >
                      Handle Grievance
                    </button>
                  </div>
                )}

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasksForCurrentReq.map((task) => {
                    const isTaskDone = task.status === 'Completed';
                    const isSelected = activeTaskId === task.id;

                    return (
                      <div 
                        key={task.id}
                        className={`bg-white rounded-2xl border transition-all p-5 space-y-4 shadow-xs ${
                          isSelected 
                            ? 'border-blue-500 ring-2 ring-blue-500/20' 
                            : isTaskDone 
                              ? 'border-emerald-200 bg-emerald-50/20' 
                              : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Task Card Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                {task.id}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-slate-400">
                                {task.assignedTeam}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mt-1">
                              {task.processName}
                            </h3>
                            <p className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                              <Server className="w-3.5 h-3.5 text-slate-400" />
                              <span>{task.sourceSystem}</span>
                            </p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isTaskDone 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1' 
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {isTaskDone && <Check className="w-3 h-3" />}
                            <span>{isTaskDone ? 'Completed' : 'Action Required'}</span>
                          </span>
                        </div>

                        {/* Data Elements Checklist */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Requested Data Elements ({task.dataRequested.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {task.dataRequested.map((elem, idx) => (
                              <span key={idx} className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                                {elem}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Redaction Review Summary Pill */}
                        <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100">
                          <span className="text-slate-500 font-medium">Redaction Review:</span>
                          <span className={`font-bold text-[11px] px-2 py-0.5 rounded ${
                            task.redactionReview?.status === 'NO REDACTION REQUIRED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : task.redactionReview?.status === 'REDACTION REQUIRED'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-300'
                          }`}>
                            {task.redactionReview?.status || 'NO REDACTION REQUIRED'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setActiveTaskId(task.id)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Open Redaction &amp; Task Review</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {!isTaskDone ? (
                            <button
                              onClick={() => {
                                setActiveTaskId(task.id);
                                setIsConfirmedCheckbox(false);
                                setShowConfirmModal(true);
                              }}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Complete Task</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirmed by {task.assignedPerson}</span>
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* SUB-VIEW 2: GRIEVANCE REDRESSAL */}
            {requestSubTab === 'grievance' && linkedGrievance && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                        {linkedGrievance.id}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Linked to {linkedGrievance.linkedDsrId}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Customer Grievance Redressal
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Lodged by <strong className="text-slate-700">{linkedGrievance.customerName}</strong> on {linkedGrievance.dateRaised}
                    </p>
                  </div>

                  <LiveSLABadge 
                    deadlineTimestamp={linkedGrievance.slaDeadlineTimestamp}
                    startTimestamp={linkedGrievance.slaStartTimestamp}
                    isCompleted={linkedGrievance.status === 'Resolved'}
                    size="md"
                  />
                </div>

                {/* Grievance Reason & Scope Dispute */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                      Customer Dispute / Grievance Grounds
                    </span>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">
                      &ldquo;{linkedGrievance.grievanceReason}&rdquo;
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Original Request vs Response Scope
                    </span>
                    <p className="text-xs text-slate-700">
                      <strong>Original Scope:</strong> {linkedGrievance.originalScopeSummary || 'Complete Right of Access records.'}
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong>Delivered:</strong> {linkedGrievance.whatWasProvidedSummary || 'Preliminary data package.'}
                    </p>
                  </div>
                </div>

                {/* Investigation & Redressal Form */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <span className="text-xs font-bold text-slate-900 block">
                    Client Officer Investigation &amp; Resolution Actions
                  </span>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Investigation Findings &amp; Supplementary Disclosure Notes:
                    </label>
                    <textarea
                      rows={3}
                      value={grievanceNotes}
                      onChange={(e) => setGrievanceNotes(e.target.value)}
                      placeholder="e.g. Finance team extracted the archived legacy statements. Supplementary ZIP prepared for secure delivery."
                      className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">
                      Statutory 15-day Grievance SLA tracked automatically.
                    </span>

                    <button
                      onClick={() => handleResolveGrievanceAction(linkedGrievance.id)}
                      disabled={isResolvingGrievance}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isResolvingGrievance ? 'Updating...' : 'Submit Grievance Resolution & Update Customer'}</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SUB-VIEW 3: DUTRO CLEARANCE & FINAL DELIVERY */}
            {requestSubTab === 'clearance' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Dutro Compliance Clearance &amp; Response Delivery
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dutro validates all statutory criteria; Client Privacy Officer authorizes final delivery to the customer.
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    currentSelectedRequest.dutroRecommendation?.isFinalized || currentSelectedRequest.status === 'Ready for Closure'
                      ? 'bg-purple-100 text-purple-900 border border-purple-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {currentSelectedRequest.dutroRecommendation?.isFinalized ? 'Cleared by Dutro' : 'Validation in Progress'}
                  </span>
                </div>

                {/* 6-point criteria check */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
                    <CheckCircle2 className={`w-5 h-5 ${tasksForCurrentReq.every(t => t.status === 'Completed') ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Department Tasks Completed</span>
                      <span className="text-slate-500 text-[11px]">{tasksForCurrentReq.filter(t => t.status === 'Completed').length}/{tasksForCurrentReq.length} fulfilled</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Redaction &amp; Disclosure Checked</span>
                      <span className="text-slate-500 text-[11px]">Internal employee &amp; 3rd-party data protected</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Statutory SLA Compliance</span>
                      <span className="text-slate-500 text-[11px]">Within 30 calendar days window</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
                    <CheckCircle2 className={`w-5 h-5 ${currentSelectedRequest.dutroRecommendation?.isFinalized ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Formal Dutro Clearance Issued</span>
                      <span className="text-slate-500 text-[11px]">{currentSelectedRequest.dutroRecommendation?.isFinalized ? 'Recommended for closure' : 'Pending Dutro sign-off'}</span>
                    </div>
                  </div>
                </div>

                {/* Final Delivery Action */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Client Privacy Officer Authorization
                      </h4>
                      <p className="text-xs text-slate-600">
                        Deliver final response package to <strong className="text-slate-900">{currentSelectedRequest.personName}</strong> via <strong className="text-blue-700">{currentSelectedRequest.channel}</strong>.
                      </p>
                    </div>

                    <button
                      onClick={handleDeliverAndClose}
                      disabled={isDeliveringFinal || currentSelectedRequest.status === 'Closed' || currentSelectedRequest.status === 'Completed'}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {currentSelectedRequest.status === 'Closed' || currentSelectedRequest.status === 'Completed'
                          ? 'Response Delivered & Closed'
                          : isDeliveringFinal
                            ? 'Delivering Package...'
                            : 'Authorize Delivery & Close Case'}
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: CROSS-DEPARTMENT TASKS QUEUE                          */}
        {/* ------------------------------------------------------------- */}
        {activePortalTab === 'tasks' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks by DSR, process, system, assignee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Departments</option>
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Waiting for client action">Waiting Action</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Tasks Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Task ID</th>
                    <th className="py-3 px-4">Case / Customer</th>
                    <th className="py-3 px-4">Department / System</th>
                    <th className="py-3 px-4">Assignee</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map(task => (
                    <tr 
                      key={task.id} 
                      onClick={() => setActiveTaskId(task.id)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {task.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-700 mr-2">{task.dsrId}</span>
                        <span className="text-slate-900 font-semibold">{task.customerName}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{task.processName}</div>
                        <div className="text-[11px] text-slate-400">{task.sourceSystem} ({task.assignedTeam})</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {task.assignedPerson}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          task.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {task.status === 'Completed' ? 'Completed' : 'Waiting Action'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTaskId(task.id);
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg font-bold text-xs transition-all cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: GRIEVANCES DESK                                       */}
        {/* ------------------------------------------------------------- */}
        {activePortalTab === 'grievances' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Client Grievance Redressal Desk
                </h2>
                <p className="text-xs text-slate-500">
                  Manage disputes, investigate missing records, and resolve customer grievances within statutory 15 days.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {grievances.map(grv => (
                <div key={grv.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          {grv.id}
                        </span>
                        {grv.linkedDsrId && (
                          <span className="font-mono text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Linked: {grv.linkedDsrId}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-700">
                          {grv.customerName} ({grv.customerEmail})
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium mt-1">
                        Dispute: &ldquo;{grv.grievanceReason}&rdquo;
                      </p>
                    </div>

                    <LiveSLABadge 
                      deadlineTimestamp={grv.slaDeadlineTimestamp}
                      startTimestamp={grv.slaStartTimestamp}
                      isCompleted={grv.status === 'Resolved'}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 text-[11px]">Stage: <strong className="text-slate-700">{grv.stage}</strong></span>
                    {grv.linkedDsrId && (
                      <button
                        onClick={() => handleOpenRequestWorkspace(grv.linkedDsrId!)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Open Linked DSR Workspace
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: COMPLETED & DELIVERED ARCHIVE                         */}
        {/* ------------------------------------------------------------- */}
        {activePortalTab === 'completed' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            <h2 className="text-base font-bold text-slate-900">
              Completed &amp; Delivered Access Requests
            </h2>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {filteredRequests.map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {req.id}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{req.personName}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Delivered via {req.channel} · Statutory Basis: {req.statutoryBasis}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* TASK DETAIL & REDACTION REVIEW MODAL / DRAWER                 */}
      {/* ------------------------------------------------------------- */}
      {activeTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded">
                    {activeTask.id}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Case: {activeTask.dsrId}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeTask.processName} · Data Retrieval &amp; Redaction Review
                </h3>
              </div>
              <button
                onClick={() => setActiveTaskId(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scroll">
              
              {/* Task System Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                  <span className="font-bold text-slate-800">{activeTask.assignedTeam}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Source System</span>
                  <span className="font-bold text-slate-800">{activeTask.sourceSystem}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assignee</span>
                  <span className="font-bold text-slate-800">{activeTask.assignedPerson}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <span className={`font-bold ${activeTask.status === 'Completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {activeTask.status}
                  </span>
                </div>
              </div>

              {/* Requested Data Elements */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 block">
                  Requested Customer Personal Data Elements:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeTask.dataRequested.map((elem, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg font-medium">
                      ✓ {elem}
                    </span>
                  ))}
                </div>
              </div>

              {/* 9-Point Redaction & Disclosure Safeguard Review */}
              <div className="border-t border-slate-100 pt-4">
                <RedactionReviewSection 
                  task={activeTask}
                  onUpdateRedactionReview={(tId, updatedState) => {
                    if (onUpdateRedactionReview) {
                      onUpdateRedactionReview(tId, updatedState);
                    }
                  }}
                  isReadOnly={false}
                />
              </div>

              {/* Evidence and Notes */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Retrieval Confirmation Notes &amp; Evidence Ref:</span>
                <p className="text-slate-600">
                  {activeTask.confirmationNote || 'Data extracted and verified within client system boundaries.'}
                </p>
                <div className="font-mono text-[11px] text-slate-500">
                  Ref: {activeTask.evidenceRef || 'EV-CLIENT-EXTRACT-DEFAULT'}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setActiveTaskId(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>

              {activeTask.status !== 'Completed' && (
                <button
                  onClick={() => {
                    setIsConfirmedCheckbox(false);
                    setShowConfirmModal(true);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Task as Completed</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && activeTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Confirm Data Retrieval</h4>
                <p className="text-xs text-slate-500">Task {activeTask.id} · {activeTask.processName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              I confirm that all requested customer personal data has been retrieved from <strong>{activeTask.sourceSystem}</strong>, third-party personal details have been redacted within client boundaries, and records are prepared for disclosure.
            </p>

            <label className="flex items-start space-x-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isConfirmedCheckbox}
                onChange={(e) => setIsConfirmedCheckbox(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                I verify compliance with disclosure guidelines and confirm task completion.
              </span>
            </label>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTaskCompletion}
                disabled={!isConfirmedCheckbox || isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Confirm & Complete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreateTaskModalOpen && (
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onCreateTask={(newTask) => {
            if (onCreateTask) onCreateTask(newTask);
            setIsCreateTaskModalOpen(false);
          }}
          dsrId={currentSelectedRequest?.id || 'DSR-2001'}
          customerName={currentSelectedRequest?.personName || 'Rohan Mehta'}
          customerEmail={currentSelectedRequest?.email || 'rohan.mehta@example.com'}
        />
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 z-50 animate-bounce-short">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">Data retrieval task confirmed &amp; marked as completed!</span>
        </div>
      )}

      {/* Grievance Success Toast */}
      {grievanceSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-amber-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 z-50 animate-bounce-short">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-bold">Grievance resolution recorded &amp; response dispatched!</span>
        </div>
      )}

    </div>
  );
};
