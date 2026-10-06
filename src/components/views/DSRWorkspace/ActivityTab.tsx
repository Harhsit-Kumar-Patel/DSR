import React from 'react';
import { DSRCase } from '../../../types/dsr';
import { 
  Clock, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Layers, 
  FileText, 
  Bot,
  Database,
  Lock
} from 'lucide-react';

interface ActivityTabProps {
  dsrCase: DSRCase;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ dsrCase }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'conflict':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'review':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'response':
        return <Send className="w-4 h-4 text-emerald-600" />;
      case 'system':
        return <Database className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Cryptographic Statutory Audit Trail & Activity Log
            </h3>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Immutable Log
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete chronological record of all actions, verification hashes, task completions, and review decisions for regulatory defensibility.
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold shadow-2xs">
          <Lock className="w-3.5 h-3.5" />
          <span>Audit Sealed</span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        
        <div className="relative pl-6 space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {dsrCase.activityTimeline.map((event) => (
            <div key={event.id} className="relative group">
              
              {/* Dot Icon */}
              <div className="absolute -left-[30px] top-0.5 w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-xs group-hover:border-blue-500 transition-colors">
                {getEventIcon(event.type)}
              </div>

              {/* Event Content Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{event.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                      {event.actorRole}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    {event.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-sans leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-1 flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                  <span>Actor: <strong className="text-slate-600">{event.actor}</strong></span>
                  <span>•</span>
                  <span>Event ID: {event.id}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
