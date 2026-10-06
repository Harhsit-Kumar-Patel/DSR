import React, { useState, useMemo } from 'react';
import { PrivacyRequest, AuditEvent, ClientTask } from '../../types';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  MessageSquareWarning,
  Lock,
  Download,
  FileCheck,
  Layers,
  Filter,
  Check,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { MASTER_AUDIT_TRAIL, INITIAL_CLIENT_TASKS } from '../../mockData/initialData';

interface PlatformAuditTrailViewProps {
  requests: PrivacyRequest[];
  clientTasks?: ClientTask[];
  onSelectRequest: (id: string) => void;
  onSelectTask?: (taskId: string, dsrId: string) => void;
}

interface EnrichedAuditEvent extends AuditEvent {
  dsrId?: string;
  personName?: string;
  matchedTaskId?: string;
  matchedTaskName?: string;
  matchedDepartment?: string;
  evidenceRef?: string;
  category: 'TASK' | 'AUTH' | 'REDACTION' | 'DELIVERY' | 'GRIEVANCE' | 'SYSTEM';
}

export const PlatformAuditTrailView: React.FC<PlatformAuditTrailViewProps> = ({
  requests,
  clientTasks = INITIAL_CLIENT_TASKS,
  onSelectRequest,
  onSelectTask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>('ALL');
  const [selectedTaskFilter, setSelectedTaskFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [copiedAuditLog, setCopiedAuditLog] = useState(false);

  // Available tasks list
  const allTasks = useMemo(() => {
    return clientTasks && clientTasks.length > 0 ? clientTasks : INITIAL_CLIENT_TASKS;
  }, [clientTasks]);

  // Aggregate and enrich all audit events
  const allEnrichedEvents = useMemo<EnrichedAuditEvent[]>(() => {
    const events: EnrichedAuditEvent[] = [];
    const seenEventKeys = new Set<string>();

    // Helper to determine category & task match
    const enrichEvent = (evt: AuditEvent, dsrId: string, personName: string): EnrichedAuditEvent => {
      const text = `${evt.action} ${evt.details}`.toLowerCase();
      
      // Match task
      let matchedTaskId: string | undefined = undefined;
      let matchedTaskName: string | undefined = undefined;
      let matchedDepartment: string | undefined = undefined;
      let evidenceRef: string | undefined = undefined;

      for (const t of allTasks) {
        if (
          text.includes(t.id.toLowerCase()) || 
          text.includes(t.processName.toLowerCase()) ||
          (t.evidenceRef && text.includes(t.evidenceRef.toLowerCase())) ||
          (t.dsrId === dsrId && text.includes(t.assignedPerson.toLowerCase()))
        ) {
          matchedTaskId = t.id;
          matchedTaskName = t.processName;
          matchedDepartment = t.department;
          evidenceRef = t.evidenceRef;
          break;
        }
      }

      // Determine category
      let category: EnrichedAuditEvent['category'] = 'SYSTEM';
      if (text.includes('task') || text.includes('retriev') || matchedTaskId) {
        category = 'TASK';
      } else if (text.includes('auth') || text.includes('verified') || text.includes('2fa') || text.includes('otp')) {
        category = 'AUTH';
      } else if (text.includes('redact') || text.includes('confidential')) {
        category = 'REDACTION';
      } else if (text.includes('deliver') || text.includes('package') || text.includes('closed')) {
        category = 'DELIVERY';
      } else if (text.includes('grievance') || text.includes('dispute') || text.includes('grv-')) {
        category = 'GRIEVANCE';
      }

      return {
        ...evt,
        dsrId,
        personName,
        matchedTaskId,
        matchedTaskName,
        matchedDepartment,
        evidenceRef,
        category
      };
    };

    // 1. Process events from requests
    requests.forEach(req => {
      if (req.auditTrail && Array.isArray(req.auditTrail)) {
        req.auditTrail.forEach(evt => {
          const key = `${req.id}__${evt.timestamp}__${evt.action}`;
          if (!seenEventKeys.has(key)) {
            seenEventKeys.add(key);
            events.push(enrichEvent(evt, req.id, req.personName));
          }
        });
      }
    });

    // 2. Process master audit trail
    MASTER_AUDIT_TRAIL.forEach(evt => {
      const key = `DSR-2001__${evt.timestamp}__${evt.action}`;
      if (!seenEventKeys.has(key)) {
        seenEventKeys.add(key);
        events.push(enrichEvent(evt, 'DSR-2001', 'Rohan Mehta'));
      }
    });

    // Sort descending by timestamp / order
    return events;
  }, [requests, allTasks]);

  // Filter events based on task, case, category, and search query
  const filteredEvents = useMemo(() => {
    return allEnrichedEvents.filter(evt => {
      // Filter by case
      if (selectedCaseFilter !== 'ALL' && evt.dsrId !== selectedCaseFilter) {
        return false;
      }

      // Filter by task
      if (selectedTaskFilter !== 'ALL') {
        if (evt.matchedTaskId !== selectedTaskFilter) {
          // Check if details or action mention this task explicitly
          const taskObj = allTasks.find(t => t.id === selectedTaskFilter);
          const hasDirectMatch = evt.details.includes(selectedTaskFilter) || 
            (taskObj && evt.details.toLowerCase().includes(taskObj.processName.toLowerCase()));
          if (!hasDirectMatch) return false;
        }
      }

      // Filter by category
      if (selectedCategoryFilter !== 'ALL' && evt.category !== selectedCategoryFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          evt.action.toLowerCase().includes(q) ||
          evt.actor.toLowerCase().includes(q) ||
          evt.details.toLowerCase().includes(q) ||
          (evt.dsrId && evt.dsrId.toLowerCase().includes(q)) ||
          (evt.personName && evt.personName.toLowerCase().includes(q)) ||
          (evt.matchedTaskId && evt.matchedTaskId.toLowerCase().includes(q)) ||
          (evt.matchedTaskName && evt.matchedTaskName.toLowerCase().includes(q)) ||
          (evt.evidenceRef && evt.evidenceRef.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [allEnrichedEvents, selectedCaseFilter, selectedTaskFilter, selectedCategoryFilter, searchQuery, allTasks]);

  // Selected task object if a specific task filter is chosen
  const activeTaskObj = useMemo(() => {
    if (selectedTaskFilter === 'ALL') return null;
    return allTasks.find(t => t.id === selectedTaskFilter) || null;
  }, [selectedTaskFilter, allTasks]);

  // Export / copy audit log
  const handleExportAuditLog = () => {
    const logData = {
      exportTimestamp: new Date().toISOString(),
      platform: 'DUTRO Privacy Operations Platform',
      statutoryAct: 'Digital Personal Data Protection Act 2023 / GDPR Compliance',
      tamperEvidentSeal: 'SHA-256: 8f9b4c2e1a7d6e5f3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0',
      totalRecordedEvents: filteredEvents.length,
      selectedFilter: {
        task: selectedTaskFilter,
        dsrCase: selectedCaseFilter,
        category: selectedCategoryFilter
      },
      events: filteredEvents
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DUTRO-Audit-Trail-${selectedTaskFilter !== 'ALL' ? selectedTaskFilter : 'Full'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCopiedAuditLog(true);
    setTimeout(() => setCopiedAuditLog(false), 2500);
  };

  const getCategoryBadge = (cat: EnrichedAuditEvent['category']) => {
    switch (cat) {
      case 'TASK':
        return <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Task Operation</span>;
      case 'AUTH':
        return <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">2FA Identity</span>;
      case 'REDACTION':
        return <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Redaction Review</span>;
      case 'DELIVERY':
        return <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Package Delivery</span>;
      case 'GRIEVANCE':
        return <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">Grievance Dispute</span>;
      default:
        return <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">System Log</span>;
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>STATUTORY AUDIT &amp; TASK EVIDENCE TRAIL</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-blue-700 font-semibold">DPDP Sec 11 / GDPR Tamper-Evident Ledger</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Compliance Audit Trail &amp; Task Inspector
          </h1>
          <p className="text-xs text-slate-500">
            Select specific client data retrieval tasks or review the entire platform event history to audit data retrieval, redaction decisions, and delivery milestones.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleExportAuditLog}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300/80 transition-colors cursor-pointer shadow-2xs"
            title="Download signed audit report JSON"
          >
            {copiedAuditLog ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copiedAuditLog ? 'Audit Certificate Exported' : 'Export Audit Log (JSON)'}</span>
          </button>
          
          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-3 py-2 rounded-xl border border-blue-200 shadow-2xs">
            {filteredEvents.length} Events Logged
          </span>
        </div>
      </div>

      {/* Task Selection Ribbon / Pill Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Select Retrieval Task to Audit:
            </span>
          </div>
          {selectedTaskFilter !== 'ALL' && (
            <button
              onClick={() => setSelectedTaskFilter('ALL')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
            >
              Reset to All Tasks &amp; Events
            </button>
          )}
        </div>

        {/* Task Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSelectedTaskFilter('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
              selectedTaskFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Tasks &amp; Events</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              selectedTaskFilter === 'ALL' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {allEnrichedEvents.length}
            </span>
          </button>

          {allTasks.map(task => {
            const isSelected = selectedTaskFilter === task.id;
            const taskEventsCount = allEnrichedEvents.filter(e => 
              e.matchedTaskId === task.id || 
              e.details.includes(task.id) ||
              e.details.toLowerCase().includes(task.processName.toLowerCase())
            ).length;

            return (
              <button
                key={task.id}
                onClick={() => {
                  setSelectedTaskFilter(task.id);
                  if (task.dsrId) setSelectedCaseFilter(task.dsrId);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                }`}
              >
                <FileCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                <span className="font-mono">{task.id}</span>
                <span className="truncate max-w-[150px] font-normal">{task.processName}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected 
                    ? 'bg-blue-700 text-white' 
                    : task.status === 'Completed' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-900'
                }`}>
                  {taskEventsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Task Spotlight Card */}
      {activeTaskObj && (
        <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/70 rounded-2xl border border-blue-200 p-5 shadow-xs space-y-3 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                    {activeTaskObj.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {activeTaskObj.processName}
                  </h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    activeTaskObj.status === 'Completed' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}>
                    {activeTaskObj.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Source: <strong className="text-slate-800">{activeTaskObj.sourceSystem}</strong> • Assigned: <strong className="text-slate-800">{activeTaskObj.assignedPerson}</strong> ({activeTaskObj.department})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (activeTaskObj.dsrId) {
                    if (onSelectTask) {
                      onSelectTask(activeTaskObj.id, activeTaskObj.dsrId);
                    } else {
                      onSelectRequest(activeTaskObj.dsrId);
                    }
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Open Task in DSR Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Linked Request</span>
              <span className="font-bold text-slate-800">{activeTaskObj.dsrId} ({activeTaskObj.customerName})</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Evidence Token</span>
              <span className="font-mono font-semibold text-blue-700">{activeTaskObj.evidenceRef || 'EV-NOT-ASSIGNED'}</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Redaction Review</span>
              <span className={`font-semibold ${
                activeTaskObj.redactionReview?.status === 'NO REDACTION REQUIRED' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {activeTaskObj.redactionReview?.status || 'NO REDACTION REQUIRED'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, task ID, action, timestamp, or evidence token..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white"
          />
        </div>

        {/* Task Dropdown Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-[11px] font-semibold text-slate-500">Task:</label>
          <select
            value={selectedTaskFilter}
            onChange={(e) => setSelectedTaskFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none font-medium cursor-pointer"
          >
            <option value="ALL">All Retrieval Tasks</option>
            {allTasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.id} - {t.processName} ({t.dsrId})
              </option>
            ))}
          </select>
        </div>

        {/* Case Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-[11px] font-semibold text-slate-500">Case:</label>
          <select
            value={selectedCaseFilter}
            onChange={(e) => setSelectedCaseFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none font-medium cursor-pointer"
          >
            <option value="ALL">All DSR Cases</option>
            {requests.map(r => (
              <option key={r.id} value={r.id}>{r.id} ({r.personName})</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-[11px] font-semibold text-slate-500">Type:</label>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none font-medium cursor-pointer"
          >
            <option value="ALL">All Event Types</option>
            <option value="TASK">Task Operations</option>
            <option value="AUTH">Identity &amp; 2FA Auth</option>
            <option value="REDACTION">Redaction Reviews</option>
            <option value="DELIVERY">Package Deliveries</option>
            <option value="GRIEVANCE">Grievance Disputes</option>
          </select>
        </div>

      </div>

      {/* Audit Events Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Chronological Statutory Ledger
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Showing <strong className="text-slate-800">{filteredEvents.length}</strong> events
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Filter className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium text-slate-600">No audit events match your selected task or filter criteria.</p>
            <button
              onClick={() => {
                setSelectedTaskFilter('ALL');
                setSelectedCaseFilter('ALL');
                setSelectedCategoryFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((evt, idx) => {
              const hasTask = evt.matchedTaskId;
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                    hasTask && selectedTaskFilter === evt.matchedTaskId
                      ? 'bg-blue-50/50 border-blue-200 shadow-2xs ring-1 ring-blue-200/50'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    
                    {/* Left: Timestamp, DSR ID, Task Chip, Category Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {evt.timestamp}
                      </span>

                      {evt.dsrId && (
                        <button
                          onClick={() => onSelectRequest(evt.dsrId!)}
                          className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors cursor-pointer"
                          title="View DSR Case Details"
                        >
                          [{evt.dsrId}]
                        </button>
                      )}

                      {/* Task Chip Selector */}
                      {evt.matchedTaskId && (
                        <button
                          onClick={() => setSelectedTaskFilter(evt.matchedTaskId!)}
                          className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border flex items-center space-x-1 cursor-pointer transition-colors ${
                            selectedTaskFilter === evt.matchedTaskId
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-white text-slate-800 border-slate-300 hover:border-blue-400 hover:text-blue-700'
                          }`}
                          title={`Filter audit trail by ${evt.matchedTaskId}`}
                        >
                          <FileCheck className="w-3 h-3" />
                          <span>{evt.matchedTaskId}</span>
                          {evt.matchedTaskName && <span className="font-sans font-normal truncate max-w-[120px]">({evt.matchedTaskName})</span>}
                        </button>
                      )}

                      {getCategoryBadge(evt.category)}
                    </div>

                    {/* Right: Actor & Role */}
                    <div className="flex items-center space-x-1.5 text-slate-500 shrink-0">
                      <span className="font-semibold text-slate-800">{evt.actor}</span>
                      {evt.role && <span className="text-[10px] text-slate-400 font-medium">({evt.role})</span>}
                    </div>

                  </div>

                  {/* Action Title */}
                  <div className="flex items-center space-x-2 pt-0.5">
                    <span className="font-bold text-slate-900 text-xs">{evt.action}</span>
                    {evt.evidenceRef && (
                      <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        Evidence Ref: {evt.evidenceRef}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <p className="text-slate-600 text-xs leading-relaxed pl-0.5">
                    {evt.details}
                  </p>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
