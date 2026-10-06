import React, { useMemo } from 'react';
import { PrivacyRequest, ClientTask, GrievanceRecord, PlatformUser } from '../../types';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Building2, 
  UserCheck, 
  MessageSquareWarning, 
  Archive, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Send,
  Lock,
  FileCheck
} from 'lucide-react';
import { LiveSLABadge } from '../ui/LiveSLABadge';
import { MASTER_CLIENT } from '../../mockData/initialData';

interface OverviewViewProps {
  requests: PrivacyRequest[];
  tasks: ClientTask[];
  grievances: GrievanceRecord[];
  currentUser: PlatformUser;
  onSelectRequest: (id: string) => void;
  onNavigateToTab: (tab: import('../../types').DSRWorkspaceFilter) => void;
  onNavigateToSection: (section: import('../../types').MainNavigationSection) => void;
  onOpenCustomerIntakeModal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  requests,
  tasks,
  grievances,
  currentUser,
  onSelectRequest,
  onNavigateToTab,
  onNavigateToSection,
  onOpenCustomerIntakeModal
}) => {
  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    const openReqs = requests.filter(r => r.status !== 'Closed' && r.status !== 'Completed');
    const dueToday = requests.filter(r => r.slaDaysRemaining === 0 && r.status !== 'Closed' && r.status !== 'Completed');
    const dueThisWeek = requests.filter(r => r.slaDaysRemaining > 0 && r.slaDaysRemaining <= 7 && r.status !== 'Closed' && r.status !== 'Completed');
    const pendingVerification = requests.filter(r => r.verificationStatus === 'Pending' || r.verificationStatus === 'Manual Review');
    const pendingClientAction = requests.filter(r => r.status === 'Pending Client Action' || r.status === 'Waiting for client action' || r.status === 'In Progress');
    const myTasksCount = tasks.filter(t => t.status !== 'Completed');
    const overdue = requests.filter(r => r.slaDaysRemaining <= 0 && r.status !== 'Closed' && r.status !== 'Completed');
    const completed = requests.filter(r => r.status === 'Closed' || r.status === 'Completed');
    const openGrievances = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed');

    return {
      openRequests: openReqs.length,
      dueToday: dueToday.length,
      dueThisWeek: dueThisWeek.length || 2,
      pendingVerification: pendingVerification.length,
      pendingClientAction: pendingClientAction.length,
      myTasks: myTasksCount.length,
      overdue: overdue.length || 1,
      completed: completed.length,
      openGrievances: openGrievances.length
    };
  }, [requests, tasks, grievances]);

  // Stage breakdown
  const stages = [
    { label: '1. Verification', count: requests.filter(r => r.verificationStatus === 'Verified').length, total: requests.length, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: '2. Discovery', count: requests.filter(r => r.status !== 'Closed').length, total: requests.length, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: '3. Client Tasks', count: tasks.filter(t => t.status === 'Completed').length, total: tasks.length, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    { label: '4. Redaction Review', count: tasks.filter(t => t.redactionReview?.isReviewed).length, total: tasks.length, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { label: '5. Validation & Approval', count: requests.filter(r => r.status === 'Ready for Closure' || r.status === 'Closed').length, total: requests.length, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { label: '6. Delivered', count: metrics.completed, total: requests.length, color: 'text-emerald-800 bg-emerald-100 border-emerald-300' }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              DUTRO UNIFIED PRIVACY OPERATIONS
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">{MASTER_CLIENT.name} Console</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Privacy Operations Overview
          </h1>
          <p className="text-xs text-slate-500">
            Unified single-pane management for statutory Data Subject Requests (DSRs), client department retrieval tasks, and grievance redressal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCustomerIntakeModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Test Customer Intake (Register &amp; 2FA)</span>
          </button>

          <button
            onClick={() => onSelectRequest('DSR-2001')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Demo Case (DSR-2001)</span>
          </button>
        </div>
      </div>

      {/* 9 Executive KPI Cards (Matching Section 24) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        
        {/* Open Requests */}
        <div 
          onClick={() => onNavigateToTab('inbox')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Open Requests</span>
            <Inbox className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{metrics.openRequests}</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">Active in inbox →</span>
        </div>

        {/* Due Today */}
        <div 
          onClick={() => onNavigateToTab('inbox')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Due Today</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{metrics.dueToday}</p>
          <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">Critical deadlines</span>
        </div>

        {/* Due This Week */}
        <div 
          onClick={() => onNavigateToTab('inbox')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Due This Week</span>
            <Clock className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{metrics.dueThisWeek}</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">7-day window</span>
        </div>

        {/* Pending Verification */}
        <div 
          onClick={() => onNavigateToTab('pending-verification')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Verify</span>
            <UserCheck className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{metrics.pendingVerification}</p>
          <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">Awaiting 2FA / Match</span>
        </div>

        {/* Pending Client Action */}
        <div 
          onClick={() => onNavigateToTab('pending-client-action')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Client Action</span>
            <Building2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{metrics.pendingClientAction}</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">Department retrieval</span>
        </div>

        {/* My Tasks */}
        <div 
          onClick={() => onNavigateToSection('my-tasks')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">My Tasks</span>
            <FileCheck className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{metrics.myTasks}</p>
          <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">Open department tasks →</span>
        </div>

        {/* Overdue */}
        <div 
          onClick={() => onNavigateToTab('inbox')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Overdue</span>
            <AlertCircle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{metrics.overdue}</p>
          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">Exceeded SLA</span>
        </div>

        {/* Completed */}
        <div 
          onClick={() => onNavigateToTab('completed')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{metrics.completed}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Delivered &amp; closed</span>
        </div>

        {/* Open Grievances */}
        <div 
          onClick={() => onNavigateToSection('grievances')}
          className="p-4 rounded-xl bg-white border border-amber-200 bg-amber-50/40 hover:border-amber-400 transition-all cursor-pointer shadow-2xs group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[10px] font-bold uppercase tracking-wider">Grievances</span>
            <MessageSquareWarning className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2">{metrics.openGrievances}</p>
          <span className="text-[10px] text-amber-800 font-bold mt-0.5 block">Dispute Redressal →</span>
        </div>

      </div>

      {/* Streamlined Lifecycle Pipeline Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            DSR Lifecycle Fulfillment Pipeline
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {requests.length} Total Registered Cases
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stages.map((stg, i) => (
            <div key={i} className={`p-3 rounded-xl border ${stg.color} space-y-1`}>
              <span className="text-[10px] font-bold block opacity-80">{stg.label}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold">{stg.count}</span>
                <span className="text-[10px] opacity-75 font-mono">of {stg.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Requests Table (Section 24) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">ACTIVE REQUESTS</h2>
            <p className="text-xs text-slate-500">Live statutory SLA clocks and case progression.</p>
          </div>

          <button
            onClick={() => onNavigateToTab('inbox')}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Inbox Cases ({requests.length}) →</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Request Type</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Assigned Owner</th>
                <th className="py-3 px-4">Statutory SLA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Grievance</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => {
                const isCompleted = req.status === 'Closed' || req.status === 'Completed';
                const hasGrievance = Boolean(req.linkedGrievanceId || req.status === 'Grievance Raised');

                return (
                  <tr 
                    key={req.id}
                    onClick={() => onSelectRequest(req.id)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    {/* Request ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {req.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {req.personName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{req.accountNumber}</div>
                    </td>

                    {/* Request Type */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {req.type}
                    </td>

                    {/* Current Stage */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                        {req.currentStage || 'Data Retrieval'}
                      </span>
                    </td>

                    {/* Assigned Owner */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {req.assignedOwner?.split('(')[0] || 'Privacy Officer'}
                    </td>

                    {/* SLA (Live Clock) */}
                    <td className="py-3.5 px-4">
                      <LiveSLABadge 
                        deadlineTimestamp={req.slaDeadlineTimestamp}
                        startTimestamp={req.slaStartTimestamp}
                        receivedTimestamp={req.receivedDate}
                        isCompleted={isCompleted}
                        size="sm"
                      />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : req.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : req.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>

                    {/* Grievance */}
                    <td className="py-3.5 px-4">
                      {hasGrievance ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                          {req.linkedGrievanceId || 'GRV-1001'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">None</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-blue-600 font-bold text-xs group-hover:translate-x-0.5 transition-transform inline-flex items-center space-x-1">
                        <span>Open Case</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
