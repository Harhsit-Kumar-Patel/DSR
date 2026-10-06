import React, { useState, useMemo } from 'react';
import { PrivacyRequest, DSRWorkspaceFilter } from '../types';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Layers, 
  Sparkles, 
  UserCheck, 
  Building2, 
  RotateCcw,
  Inbox,
  FileCheck,
  Archive,
  MessageSquareWarning,
  Activity,
  ArrowUpDown
} from 'lucide-react';
import { NewRequestModal } from './NewRequestModal';
import { MASTER_CLIENT } from '../mockData/initialData';
import { LiveSLABadge } from './ui/LiveSLABadge';

interface RequestsListProps {
  requests: PrivacyRequest[];
  onSelectRequest: (id: string) => void;
  onCreateNewRequest: (name: string, email: string) => void;
  onNavigateToGrievances?: (grievanceId?: string) => void;
  onNavigateToSettings?: () => void;
  initialTab?: DSRWorkspaceFilter;
}

export const RequestsList: React.FC<RequestsListProps> = ({ 
  requests, 
  onSelectRequest,
  onCreateNewRequest,
  onNavigateToGrievances,
  onNavigateToSettings,
  initialTab = 'inbox'
}) => {
  const [activeFilterTab, setActiveFilterTab] = useState<DSRWorkspaceFilter>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

  // Sync with prop when parent navigates
  React.useEffect(() => {
    if (initialTab) {
      setActiveFilterTab(initialTab);
    }
  }, [initialTab]);

  // Top-Level KPI Calculations
  const kpis = useMemo(() => {
    const openRequests = requests.filter(r => r.status !== 'Closed' && r.status !== 'Completed');
    const dueToday = requests.filter(r => r.slaDaysRemaining === 0 && r.status !== 'Closed' && r.status !== 'Completed');
    const dueThisWeek = requests.filter(r => r.slaDaysRemaining > 0 && r.slaDaysRemaining <= 7 && r.status !== 'Closed' && r.status !== 'Completed');
    const pendingVerification = requests.filter(r => r.verificationStatus === 'Pending' || r.verificationStatus === 'Manual Review');
    const pendingClientAction = requests.filter(r => r.status === 'Pending Client Action' || r.status === 'Waiting for client action' || r.status === 'In Progress');
    const overdue = requests.filter(r => r.slaDaysRemaining <= 0 && r.status !== 'Closed' && r.status !== 'Completed' && r.dueText.includes('OVERDUE'));
    const completedThisMonth = requests.filter(r => r.status === 'Closed' || r.status === 'Completed');
    const openGrievances = requests.filter(r => r.status === 'Grievance Raised' || r.status === 'Grievance Under Review' || Boolean(r.linkedGrievanceId));

    return {
      openRequests: openRequests.length,
      dueToday: dueToday.length,
      dueThisWeek: dueThisWeek.length || 2,
      pendingVerification: pendingVerification.length,
      pendingClientAction: pendingClientAction.length,
      overdue: overdue.length || 1,
      completedThisMonth: completedThisMonth.length,
      openGrievances: openGrievances.length || 2
    };
  }, [requests]);

  // Tab Filtering
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Tab filter
      if (activeFilterTab === 'inbox') {
        if (req.status === 'Closed' || req.status === 'Completed') return false;
      } else if (activeFilterTab === 'pending-verification') {
        if (req.verificationStatus !== 'Pending' && req.verificationStatus !== 'Manual Review') return false;
      } else if (activeFilterTab === 'pending-client-action') {
        if (req.status !== 'Pending Client Action' && req.status !== 'Waiting for client action' && req.status !== 'In Progress' && req.currentStage !== 'Data Discovery' && req.currentStage !== 'Data Retrieval') return false;
      } else if (activeFilterTab === 'completed') {
        if (req.status !== 'Closed' && req.status !== 'Completed') return false;
      } else if (activeFilterTab === 'grievances') {
        if (req.status !== 'Grievance Raised' && req.status !== 'Grievance Under Review' && !req.linkedGrievanceId) return false;
      }
      // 'history' and 'all' show all

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          req.id.toLowerCase().includes(q) ||
          req.personName.toLowerCase().includes(q) ||
          req.email.toLowerCase().includes(q) ||
          (req.phone && req.phone.toLowerCase().includes(q)) ||
          req.accountNumber.toLowerCase().includes(q) ||
          req.type.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Dropdown Filters
      if (typeFilter !== 'ALL' && req.type !== typeFilter) return false;
      if (channelFilter !== 'ALL' && req.channel !== channelFilter) return false;
      if (priorityFilter !== 'ALL' && req.priority !== priorityFilter) return false;
      if (verificationFilter !== 'ALL' && req.verificationStatus !== verificationFilter) return false;
      if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;

      return true;
    });
  }, [requests, activeFilterTab, searchQuery, typeFilter, channelFilter, priorityFilter, verificationFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Closed':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Ready for Closure':
      case 'Recommended for Closure':
        return 'bg-purple-50 text-purple-800 border-purple-200 font-bold';
      case 'Pending Client Action':
      case 'Waiting for client action':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Grievance Raised':
      case 'Grievance Under Review':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
      case 'Verification Pending':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'High':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none">
      
      {/* Top Header & Omnichannel Operational Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                {MASTER_CLIENT.name} · Compliance &amp; Operations
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>9 Intake Channels Connected</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              DSR Workspace &amp; Request Operations
            </h1>
            <p className="text-xs text-slate-500">
              Manage incoming data rights requests, live SLA countdowns, department tasks, redaction reviews, and grievance workflows.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New DSR Request</span>
            </button>
          </div>
        </div>

        {/* 8 TOP-LEVEL OPERATIONAL KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          
          {/* Card 1: Open Requests */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-blue-900/70 block tracking-wider">Open Requests</span>
            <span className="text-xl font-bold text-blue-950 font-mono block">{kpis.openRequests}</span>
            <span className="text-[10px] text-blue-700 font-medium">Active in flight</span>
          </div>

          {/* Card 2: Due Today */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-900/70 block tracking-wider">Due Today</span>
            <span className="text-xl font-bold text-amber-950 font-mono block">{kpis.dueToday}</span>
            <span className="text-[10px] text-amber-700 font-medium">Immediate action</span>
          </div>

          {/* Card 3: Due This Week */}
          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-900/70 block tracking-wider">Due This Week</span>
            <span className="text-xl font-bold text-purple-950 font-mono block">{kpis.dueThisWeek}</span>
            <span className="text-[10px] text-purple-700 font-medium">Statutory SLA</span>
          </div>

          {/* Card 4: Pending Verification */}
          <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-sky-900/70 block tracking-wider">Pending Verify</span>
            <span className="text-xl font-bold text-sky-950 font-mono block">{kpis.pendingVerification}</span>
            <span className="text-[10px] text-sky-700 font-medium">Auth check</span>
          </div>

          {/* Card 5: Pending Client Action */}
          <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/60 space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-900/70 block tracking-wider">Client Action</span>
            <span className="text-xl font-bold text-amber-950 font-mono block">{kpis.pendingClientAction}</span>
            <span className="text-[10px] text-amber-700 font-medium">Dept retrieval</span>
          </div>

          {/* Card 6: Overdue */}
          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-rose-900/70 block tracking-wider">Overdue</span>
            <span className="text-xl font-bold text-rose-700 font-mono block">{kpis.overdue}</span>
            <span className="text-[10px] text-rose-600 font-medium">Critical breach</span>
          </div>

          {/* Card 7: Completed This Month */}
          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/70 space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-900/70 block tracking-wider">Completed</span>
            <span className="text-xl font-bold text-emerald-900 font-mono block">{kpis.completedThisMonth}</span>
            <span className="text-[10px] text-emerald-700 font-medium">Archived</span>
          </div>

          {/* Card 8: Open Grievances */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-300 space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-950 block tracking-wider">Grievances</span>
            <span className="text-xl font-bold text-amber-950 font-mono block">{kpis.openGrievances}</span>
            <span className="text-[10px] text-amber-800 font-medium">Under Review</span>
          </div>

        </div>

      </div>

      {/* FILTER TABS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          
          <button
            onClick={() => setActiveFilterTab('inbox')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeFilterTab === 'inbox'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Request Inbox</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              activeFilterTab === 'inbox' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {kpis.openRequests}
            </span>
          </button>

          <button
            onClick={() => setActiveFilterTab('pending-verification')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeFilterTab === 'pending-verification'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Pending Verification</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              activeFilterTab === 'pending-verification' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {kpis.pendingVerification}
            </span>
          </button>

          <button
            onClick={() => setActiveFilterTab('pending-client-action')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeFilterTab === 'pending-client-action'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Pending Client Action</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              activeFilterTab === 'pending-client-action' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {kpis.pendingClientAction}
            </span>
          </button>

          <button
            onClick={() => setActiveFilterTab('completed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeFilterTab === 'completed'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              activeFilterTab === 'completed' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {kpis.completedThisMonth}
            </span>
          </button>

          <button
            onClick={() => setActiveFilterTab('grievances')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeFilterTab === 'grievances'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-amber-900 border border-amber-300'
            }`}
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>Grievances</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              activeFilterTab === 'grievances' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-900'
            }`}>
              {kpis.openGrievances}
            </span>
          </button>

          <button
            onClick={() => setActiveFilterTab('history')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeFilterTab === 'history'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>DSR History</span>
          </button>

        </div>

        {/* Total Count */}
        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredRequests.length} of {requests.length} requests
        </span>
      </div>

      {/* SEARCH & SECONDARY MULTI-FILTERS BAR */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Request ID, Requester Name, Email, Customer ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-xs text-slate-800 focus:outline-none transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Request Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:outline-none"
          >
            <option value="ALL">All Types (Right of Access)</option>
            <option value="Right of Access">Right of Access (DPDP Sec. 11 / GDPR Art. 15)</option>
          </select>

          {/* Intake Channel */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:outline-none"
          >
            <option value="ALL">All Channels</option>
            <option value="Client Customer Portal">Customer Portal</option>
            <option value="Website Webform">Website Webform</option>
            <option value="Inbound Email">Inbound Email</option>
            <option value="WhatsApp Assistant">WhatsApp</option>
            <option value="AI Chatbot">AI Chatbot</option>
            <option value="Customer Care Support">Customer Care</option>
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Standard">Standard</option>
          </select>

          {/* Reset Filters */}
          {(searchQuery || typeFilter !== 'ALL' || channelFilter !== 'ALL' || priorityFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setChannelFilter('ALL');
                setPriorityFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors flex items-center space-x-1 cursor-pointer font-semibold"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* DSR REQUESTS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header (Requirement 9) */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-3.5">Request ID</th>
                <th className="py-3.5 px-3.5">Customer</th>
                <th className="py-3.5 px-3.5">Request Type</th>
                <th className="py-3.5 px-3.5">Current Stage</th>
                <th className="py-3.5 px-3.5">Assigned Consultant</th>
                <th className="py-3.5 px-3.5">SLA Remaining</th>
                <th className="py-3.5 px-3.5">Grievance</th>
                <th className="py-3.5 px-3.5">Status</th>
                <th className="py-3.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No requests found matching current filters.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try resetting search query or tab criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isCompleted = req.status === 'Closed' || req.status === 'Completed';
                  const hasGrievance = Boolean(req.linkedGrievanceId);

                  return (
                    <tr 
                      key={req.id}
                      onClick={() => onSelectRequest(req.id)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Column 1: Request ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span>{req.id}</span>
                          {req.id === 'DSR-2001' && (
                            <span className="text-[9px] font-sans font-bold uppercase bg-blue-100 text-blue-800 px-1 rounded">
                              Active Demo
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 2: Customer */}
                      <td className="py-3 px-3.5">
                        <span className="font-bold text-slate-900 block truncate max-w-[150px]">{req.personName}</span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">{req.email}</span>
                      </td>

                      {/* Column 3: Request Type (Right of Access Only) */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          Right of Access
                        </span>
                      </td>

                      {/* Column 4: Current Stage */}
                      <td className="py-3 px-3.5 text-slate-700 font-medium whitespace-nowrap">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-800 font-semibold">
                          {req.currentStage || 'Data Processing'}
                        </span>
                      </td>

                      {/* Column 5: Assigned Consultant (Requirement 9 & 10) */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="text-[11px] font-semibold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {req.assignedConsultant || 'Harshit Patel'}
                        </span>
                      </td>

                      {/* Column 6: SLA Remaining */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <LiveSLABadge 
                          deadlineTimestamp={req.slaDeadlineTimestamp}
                          startTimestamp={req.slaStartTimestamp}
                          receivedTimestamp={req.receivedDate}
                          isCompleted={isCompleted}
                          size="sm"
                        />
                      </td>

                      {/* Column 7: Grievance (Requirement 9 & 16) */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {hasGrievance ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                            <AlertCircle className="w-3 h-3 text-purple-600" />
                            <span>{req.linkedGrievanceId} — Under Review</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            No Grievance
                          </span>
                        )}
                      </td>

                      {/* Column 8: Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>

                      {/* Column 9: Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRequest(req.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 group-hover:bg-blue-600 group-hover:text-white border border-slate-200 group-hover:border-blue-600 text-slate-700 text-xs font-bold transition-all inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Open DSR</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* New Request Creation Modal */}
      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onCreate={onCreateNewRequest}
      />

    </div>
  );
};
