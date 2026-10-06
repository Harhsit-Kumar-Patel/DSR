import React, { useState } from 'react';
import { ClientTask, PrivacyRequest, RedactionReviewState } from '../../types';
import { 
  Shield, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  ExternalLink, 
  Check, 
  Clock, 
  Eye,
  UserCheck,
  Building2,
  Lock,
  Layers
} from 'lucide-react';
import { RedactionReviewSection } from './DSRWorkspace/RedactionReviewSection';

interface RedactionReviewsViewProps {
  tasks: ClientTask[];
  requests: PrivacyRequest[];
  onSelectRequest: (id: string) => void;
  onUpdateTaskRedaction: (taskId: string, redactionState: RedactionReviewState) => void;
}

export const RedactionReviewsView: React.FC<RedactionReviewsViewProps> = ({
  tasks,
  requests,
  onSelectRequest,
  onUpdateTaskRedaction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'REVIEW REQUIRED' | 'REDACTION REQUIRED' | 'NO REDACTION REQUIRED'>('ALL');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(tasks[1]?.id || tasks[0]?.id || null);

  const filteredTasks = tasks.filter(t => {
    const rStatus = t.redactionReview?.status || 'NO REDACTION REQUIRED';
    if (statusFilter !== 'ALL' && rStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        t.id.toLowerCase().includes(q) ||
        t.processName.toLowerCase().includes(q) ||
        t.sourceSystem.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.dsrId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: tasks.length,
    reviewed: tasks.filter(t => t.redactionReview?.isReviewed).length,
    reviewRequired: tasks.filter(t => t.redactionReview?.status === 'REVIEW REQUIRED').length,
    redactionRequired: tasks.filter(t => t.redactionReview?.status === 'REDACTION REQUIRED').length,
    noRedaction: tasks.filter(t => t.redactionReview?.status === 'NO REDACTION REQUIRED').length
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              DISCLOSURE GOVERNANCE
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-blue-700 font-semibold">Third-Party &amp; Employee Protection</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Redaction &amp; Disclosure Reviews
          </h1>
          <p className="text-xs text-slate-500">
            Dutro provides automated disclosure guidance and checks. The client makes the final redaction decision before customer delivery.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
            {stats.reviewed} / {stats.total} Reviews Completed
          </span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'ALL' ? 'bg-blue-50/80 border-blue-300' : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Disclosures</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('NO REDACTION REQUIRED')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'NO REDACTION REQUIRED' ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-emerald-700 block">No Redaction Needed</span>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.noRedaction}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('REVIEW REQUIRED')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'REVIEW REQUIRED' ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-blue-700 block">Review Required</span>
          <p className="text-2xl font-bold text-blue-800 mt-1">{stats.reviewRequired}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('REDACTION REQUIRED')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'REDACTION REQUIRED' ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-rose-700 block">Redaction Required</span>
          <p className="text-2xl font-bold text-rose-800 mt-1">{stats.redactionRequired}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by task ID, process, customer, or DSR..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          {(['ALL', 'NO REDACTION REQUIRED', 'REVIEW REQUIRED', 'REDACTION REQUIRED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
                statusFilter === st ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Reviews' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const isExpanded = expandedTaskId === task.id;
          const status = task.redactionReview?.status || 'NO REDACTION REQUIRED';

          return (
            <div key={task.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
                    {task.id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => onSelectRequest(task.dsrId)}
                    className="font-mono text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{task.dsrId}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-bold text-slate-900">{task.processName}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">Requester: {task.customerName}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    status === 'NO REDACTION REQUIRED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : status === 'REDACTION REQUIRED'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {status}
                  </span>

                  <button
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isExpanded ? 'Hide Checklist' : 'Review Checklist'}
                  </button>
                </div>
              </div>

              {/* Redaction Review Component */}
              {isExpanded && (
                <div className="pt-2 border-t border-slate-100">
                  <RedactionReviewSection
                    task={task}
                    onUpdateRedactionReview={(tId, updated) => onUpdateTaskRedaction(tId, updated)}
                  />
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
