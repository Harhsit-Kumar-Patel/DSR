import React, { useState } from 'react';
import { PrivacyRequest, GrievanceRecord } from '../../types';
import { 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Activity,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { LiveSLABadge } from '../ui/LiveSLABadge';
import { MASTER_CLIENT } from '../../mockData/initialData';

interface SLADeadlinesViewProps {
  requests: PrivacyRequest[];
  grievances: GrievanceRecord[];
  onSelectRequest: (id: string) => void;
  onSelectGrievance: (id: string) => void;
}

export const SLADeadlinesView: React.FC<SLADeadlinesViewProps> = ({
  requests,
  grievances,
  onSelectRequest,
  onSelectGrievance
}) => {
  const [activeTab, setActiveTab] = useState<'dsr' | 'grievance'>('dsr');
  const [searchQuery, setSearchQuery] = useState('');

  const openDSRs = requests.filter(r => r.status !== 'Closed' && r.status !== 'Completed');
  const openGrievances = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed');

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              GOVERNANCE &amp; STATUTORY COMPLIANCE
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-blue-700 font-semibold">Real-Time Continuous Timers</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            SLA &amp; Statutory Deadlines Radar
          </h1>
          <p className="text-xs text-slate-500">
            Real-time countdown clocks calculated dynamically from statutory timestamps. DSRs and Grievances maintain independent statutory SLA clocks.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('dsr')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'dsr' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>DSR Timers (30-Day DPDP) ({openDSRs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('grievance')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'grievance' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Grievance Timers (15-Day) ({openGrievances.length})</span>
          </button>
        </div>
      </div>

      {/* Statutory Rules Reference Card */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="font-bold text-blue-950 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>DPDP Act 2023 / GDPR Statutory DSR Window:</span>
          </span>
          <p className="text-[11px] text-slate-600">
            30 calendar days from verified intake. Dutro tracks statutory start timestamps and delivers real-time warnings at 7 days, 3 days, and 24 hours.
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-amber-950 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>DPDP Act 2023 Sec. 13 Statutory Grievance Window:</span>
          </span>
          <p className="text-[11px] text-slate-600">
            15 calendar days from dispute registration. Grievances maintain an independent statutory clock separate from the original closed DSR.
          </p>
        </div>
      </div>

      {/* DSR SLA Table */}
      {activeTab === 'dsr' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Active DSR Statutory Clocks</span>
            <span className="text-slate-500 font-mono">Ticking in real-time (1s interval)</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Intake Channel</th>
                <th className="py-3 px-4">Received Timestamp</th>
                <th className="py-3 px-4">Statutory Deadline</th>
                <th className="py-3 px-4">Real-Time Remaining</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => {
                const isCompleted = req.status === 'Closed' || req.status === 'Completed';

                return (
                  <tr 
                    key={req.id}
                    onClick={() => onSelectRequest(req.id)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{req.id}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{req.personName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{req.channel}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{req.receivedDate}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">{req.dueDate}</td>
                    <td className="py-3.5 px-4">
                      <LiveSLABadge 
                        deadlineTimestamp={req.slaDeadlineTimestamp}
                        startTimestamp={req.slaStartTimestamp}
                        receivedTimestamp={req.receivedDate}
                        isCompleted={isCompleted}
                        size="md"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-blue-600 font-bold group-hover:underline">Open DSR →</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Grievance SLA Table */}
      {activeTab === 'grievance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Active Grievance Redressal Statutory Clocks</span>
            <span className="text-amber-800 font-mono font-bold">15-Day Resolution Clock</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Grievance ID</th>
                <th className="py-3 px-4">Linked DSR</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Grievance Officer</th>
                <th className="py-3 px-4">Statutory Grievance SLA</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grievances.map((grv) => {
                const isResolved = grv.status === 'Resolved' || grv.status === 'Closed';

                return (
                  <tr 
                    key={grv.id}
                    onClick={() => onSelectGrievance(grv.id)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-900">{grv.id}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-700">{grv.linkedDsrId}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{grv.customerName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        {grv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{grv.assignedReviewer}</td>
                    <td className="py-3.5 px-4">
                      <LiveSLABadge 
                        deadlineTimestamp={grv.slaDeadlineTimestamp}
                        startTimestamp={grv.slaStartTimestamp}
                        isCompleted={isResolved}
                        size="md"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-amber-700 font-bold group-hover:underline">Open Grievance →</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
