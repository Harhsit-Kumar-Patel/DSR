import React from 'react';
import { PrivacyRequest } from '../../types';
import { useRealtimeSLA } from '../../hooks/useRealtimeSLA';
import { formatSlaDate } from '../../utils/slaCalculator';
import { 
  X, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  UserCheck,
  Search,
  FileCheck,
  Send,
  Flag
} from 'lucide-react';

interface SLATimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PrivacyRequest;
}

export const SLATimelineModal: React.FC<SLATimelineModalProps> = ({
  isOpen,
  onClose,
  request
}) => {
  const isCompleted = request.status === 'Closed' || request.status === 'Completed';
  const sla = useRealtimeSLA(
    request.slaDeadlineTimestamp,
    request.slaStartTimestamp,
    request.receivedDate,
    isCompleted
  );

  if (!isOpen) return null;

  const timelineMilestones = [
    {
      id: 'step-1',
      title: 'Request Received & Ingested',
      timestamp: request.receivedDate,
      channel: request.channel,
      status: 'Completed',
      actor: `${request.personName} (${request.role || 'Customer'})`,
      icon: <Clock className="w-4 h-4 text-blue-600" />
    },
    {
      id: 'step-2',
      title: 'Identity Verification Completed',
      timestamp: request.verificationDetails?.verifiedAt || request.receivedDate,
      channel: request.verificationMethod,
      status: request.verificationStatus === 'Verified' ? 'Completed' : 'Pending',
      actor: 'Client Auth Gateway',
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'step-3',
      title: 'Data Discovery & Task Assignment',
      timestamp: '28 Sep 2026, 09:17 IST',
      channel: request.dataDiscoveryMode === 'basic-location' ? 'Basic Location Check' : 'PDI / RoPA Match',
      status: 'Completed',
      actor: 'Dutro Orchestrator',
      icon: <Search className="w-4 h-4 text-purple-600" />
    },
    {
      id: 'step-4',
      title: 'Client Tasks & Redaction Review',
      timestamp: 'In Progress (SLA Active)',
      channel: 'Client Department Portals',
      status: isCompleted ? 'Completed' : 'In Progress',
      actor: 'Operations, Support, Finance',
      icon: <FileCheck className="w-4 h-4 text-amber-600" />
    },
    {
      id: 'step-5',
      title: 'Dutro Validation & Internal Review',
      timestamp: 'Scheduled upon task completion',
      channel: 'Compliance Engine',
      status: isCompleted ? 'Completed' : 'Upcoming',
      actor: 'Dutro Advisory & Ananya Mehta (DPO)',
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />
    },
    {
      id: 'step-6',
      title: 'Case Closure & Customer Response Delivered',
      timestamp: isCompleted ? '28 Sep 2026' : 'Target: Prior to Statutory Deadline',
      channel: 'Customer Portal',
      status: isCompleted ? 'Completed' : 'Upcoming',
      actor: 'Client Organization Privacy Office',
      icon: <Send className="w-4 h-4 text-emerald-600" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                {request.id}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-700">{request.personName}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Real-Time Statutory SLA Clock & Milestone Timeline
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time SLA Status Banner */}
        <div className="p-6 overflow-y-auto custom-scroll space-y-6">
          
          {/* Live Clock Card */}
          <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            sla.status === 'OVERDUE' ? 'bg-rose-50 border-rose-200 text-rose-900' :
            sla.status === 'DUE SOON' ? 'bg-amber-50 border-amber-300 text-amber-950' :
            'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  STATUTORY SLA LIVE COUNTDOWN
                </span>
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">
                {isCompleted ? 'Completed within SLA' : sla.timeRemainingFormatted}
              </div>
              <p className="text-xs opacity-80">
                Statutory Basis: <strong>{request.statutoryBasis}</strong>
              </p>
            </div>

            <div className="text-right shrink-0 bg-white/80 p-3 rounded-lg border border-slate-200/60 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Statutory Deadline</span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {formatSlaDate(request.slaDeadlineTimestamp)}
              </span>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                sla.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' :
                sla.status === 'DUE SOON' ? 'bg-amber-100 text-amber-900' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {sla.status}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Request Received: {request.receivedDate}</span>
              <span>Deadline: {formatSlaDate(request.slaDeadlineTimestamp)}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className={`h-full transition-all duration-500 ${
                  sla.status === 'OVERDUE' ? 'bg-rose-500' :
                  sla.status === 'DUE SOON' ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${sla.percentageElapsed}%` }}
              />
            </div>
            <div className="text-right text-[11px] font-mono text-slate-400">
              {sla.percentageElapsed}% of statutory 30 calendar days elapsed
            </div>
          </div>

          {/* Milestone Stepper */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              SLA Milestone Timeline Lifecycle
            </h3>

            <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {timelineMilestones.map((m, idx) => {
                const isMilestoneComplete = m.status === 'Completed';
                const isMilestoneActive = m.status === 'In Progress';

                return (
                  <div key={m.id} className="flex items-start space-x-3.5 relative pl-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      isMilestoneComplete ? 'bg-emerald-600 text-white shadow-xs' :
                      isMilestoneActive ? 'bg-amber-500 text-white animate-pulse' :
                      'bg-slate-200 text-slate-500'
                    }`}>
                      {isMilestoneComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                    </div>

                    <div className={`flex-1 p-3 rounded-xl border text-xs ${
                      isMilestoneActive ? 'bg-amber-50/70 border-amber-200 text-amber-950' :
                      isMilestoneComplete ? 'bg-slate-50/70 border-slate-200 text-slate-900' :
                      'bg-slate-50/30 border-slate-200 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{m.title}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isMilestoneComplete ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          isMilestoneActive ? 'bg-amber-100 text-amber-900 font-bold' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {m.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 mt-1 pt-1 border-t border-slate-200/50">
                        <span>Actor: <strong className="text-slate-700">{m.actor}</strong></span>
                        <span>{m.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close Timeline
          </button>
        </div>

      </div>
    </div>
  );
};
