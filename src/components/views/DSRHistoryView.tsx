import React, { useState, useMemo } from 'react';
import { PrivacyRequest } from '../../types';
import { 
  Search, 
  Archive, 
  RotateCcw, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquareWarning, 
  FileText, 
  ShieldCheck, 
  Calendar,
  ExternalLink,
  Download,
  Filter
} from 'lucide-react';
import { LiveSLABadge } from '../ui/LiveSLABadge';

interface DSRHistoryViewProps {
  requests: PrivacyRequest[];
  onSelectRequest: (id: string) => void;
  onRaiseGrievance?: (dsrId: string) => void;
}

export const DSRHistoryView: React.FC<DSRHistoryViewProps> = ({
  requests,
  onSelectRequest,
  onRaiseGrievance
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [grievanceFilter, setGrievanceFilter] = useState('ALL');
  const [selectedHistoricalRequest, setSelectedHistoricalRequest] = useState<PrivacyRequest | null>(null);

  const filteredHistory = useMemo(() => {
    return requests.filter((req) => {
      // Search
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

      // Status
      if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
      // Type
      if (typeFilter !== 'ALL' && req.type !== typeFilter) return false;
      // Channel
      if (channelFilter !== 'ALL' && req.channel !== channelFilter) return false;
      // Grievance
      if (grievanceFilter === 'GRIEVANCE_RAISED' && !req.linkedGrievanceId && req.status !== 'Grievance Raised') return false;
      if (grievanceFilter === 'NO_GRIEVANCE' && (req.linkedGrievanceId || req.status === 'Grievance Raised')) return false;

      return true;
    });
  }, [requests, searchQuery, statusFilter, typeFilter, channelFilter, grievanceFilter]);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              AUDIT-READY ARCHIVE
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Statutory Record Retention</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Complete DSR History &amp; Audit Archive
          </h1>
          <p className="text-xs text-slate-500">
            Immutable statutory records of all requests ever received, including verified tasks, redaction decisions, SLA milestones, and linked grievances.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
            {requests.length} Total Historical Cases
          </span>
        </div>
      </div>

      {/* Multi-Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search archive by Request ID, Name, Email, Phone, Account CIF..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-xs text-slate-800 focus:outline-none transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Closed">Closed / Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Client Action">Pending Client Action</option>
            <option value="Grievance Raised">Grievance Raised</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:outline-none"
          >
            <option value="ALL">All Types (Right of Access)</option>
            <option value="Right of Access">Right of Access (DPDP Sec. 11 / GDPR Art. 15)</option>
          </select>

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
          </select>

          <select
            value={grievanceFilter}
            onChange={(e) => setGrievanceFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:outline-none"
          >
            <option value="ALL">All Grievance Statuses</option>
            <option value="GRIEVANCE_RAISED">Grievance Raised / Linked</option>
            <option value="NO_GRIEVANCE">No Grievances</option>
          </select>

          {(searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL' || channelFilter !== 'ALL' || grievanceFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setTypeFilter('ALL');
                setChannelFilter('ALL');
                setGrievanceFilter('ALL');
              }}
              className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors flex items-center space-x-1 cursor-pointer font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Request Type</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Received Date</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">SLA Outcome</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Grievance</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Archive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No historical records match your filter.</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((req) => {
                  const isClosed = req.status === 'Closed' || req.status === 'Completed';

                  return (
                    <tr 
                      key={req.id}
                      onClick={() => onSelectRequest(req.id)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Request ID */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        <span>{req.id}</span>
                      </td>

                      {/* Requester */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block truncate max-w-[140px]">{req.personName}</span>
                        <span className="text-[10px] text-slate-400 block">{req.email}</span>
                      </td>

                      {/* Request Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{req.type}</span>
                        <span className="text-[10px] text-slate-400 block">{req.statutoryBasis}</span>
                      </td>

                      {/* Channel */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <span className="text-[11px]">{req.channel}</span>
                      </td>

                      {/* Received Date */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        <span>{req.receivedDate.split(',')[0]}</span>
                      </td>

                      {/* Verification */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span>✓ {req.verificationStatus}</span>
                        </span>
                      </td>

                      {/* SLA Outcome */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <LiveSLABadge 
                          deadlineTimestamp={req.slaDeadlineTimestamp}
                          startTimestamp={req.slaStartTimestamp}
                          receivedTimestamp={req.receivedDate}
                          isCompleted={isClosed}
                          size="sm"
                        />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isClosed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          req.status === 'Grievance Raised' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>

                      {/* Grievance Link */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {req.linkedGrievanceId ? (
                          <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded flex items-center space-x-1">
                            <MessageSquareWarning className="w-3 h-3 text-amber-700" />
                            <span>{req.linkedGrievanceId}</span>
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          {isClosed && onRaiseGrievance && !req.linkedGrievanceId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRaiseGrievance(req.id);
                              }}
                              className="px-2 py-1 rounded bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
                              title="Raise grievance against this historical DSR"
                            >
                              Raise Grievance
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRequest(req.id);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-50 group-hover:bg-blue-600 group-hover:text-white border border-slate-200 group-hover:border-blue-600 text-slate-700 text-xs font-bold transition-all inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
