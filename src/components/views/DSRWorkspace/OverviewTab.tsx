import React from 'react';
import { DSRCase } from '../../../types/dsr';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  ArrowRight,
  Send,
  Lock,
  ExternalLink
} from 'lucide-react';

interface OverviewTabProps {
  dsrCase: DSRCase;
  onNavigateTab: (tab: 'discovery' | 'tasks' | 'data' | 'review' | 'activity') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ dsrCase, onNavigateTab }) => {
  const lifecycleSteps = [
    { name: 'Request Received', completed: true, date: dsrCase.submittedDate },
    { name: 'Identity Verified', completed: dsrCase.verification.status === 'Verified', date: dsrCase.verification.verifiedAt || 'Pending' },
    { name: 'Discovery', completed: dsrCase.currentStage !== 'Received' && dsrCase.currentStage !== 'Verified', current: dsrCase.currentStage === 'Discovery' },
    { name: 'Data Collection', completed: ['Review', 'Approval', 'Response', 'Closed'].includes(dsrCase.currentStage), current: dsrCase.currentStage === 'Collection' },
    { name: 'Review', completed: ['Approval', 'Response', 'Closed'].includes(dsrCase.currentStage), current: dsrCase.currentStage === 'Review' },
    { name: 'Client Approval', completed: ['Response', 'Closed'].includes(dsrCase.currentStage) || dsrCase.approvalStatus === 'Approved', current: dsrCase.currentStage === 'Approval' },
    { name: 'Response Sent', completed: dsrCase.status === 'Response Sent' || dsrCase.currentStage === 'Response' || dsrCase.currentStage === 'Closed', current: dsrCase.currentStage === 'Response' },
    { name: 'Closed', completed: dsrCase.currentStage === 'Closed', current: dsrCase.currentStage === 'Closed' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 2 Column Layout: Request Info & Lifecycle Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: REQUEST INFORMATION */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Requester Profile Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Request Information & Identity Profile
              </h3>
              
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                Channel: {dsrCase.channel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Requester Name</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{dsrCase.requesterName}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Persona Classification</p>
                <p className="text-sm font-bold text-blue-700 mt-1">{dsrCase.persona}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Legal Entity</p>
                <p className="text-xs font-bold text-slate-800 mt-1">{dsrCase.legalEntity}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Request Type</p>
                <p className="text-sm font-bold text-blue-700 mt-1">{dsrCase.requestType} Request</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Submission Date</p>
                <p className="text-xs font-mono font-bold text-slate-800 mt-1">{dsrCase.submittedDate}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Preferred Response</p>
                <p className="text-xs font-bold text-slate-800 mt-1">{dsrCase.preferredResponse}</p>
              </div>

            </div>

            {/* Verification Status Card */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5 border border-emerald-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-emerald-950">Identity Status: {dsrCase.verification.status}</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      {dsrCase.verification.confidenceScore}% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">
                    Method: <strong className="text-emerald-800">{dsrCase.verification.method}</strong>
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{dsrCase.verification.verificationNotes}</p>
                </div>
              </div>

              {dsrCase.verification.verifiedAt && (
                <span className="text-[11px] font-mono text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0 shadow-2xs font-semibold">
                  {dsrCase.verification.verifiedAt}
                </span>
              )}
            </div>

            {/* Request Summary Statement */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Request Summary Statement
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed font-sans italic">
                "{dsrCase.summary}"
              </p>
            </div>

          </div>

          {/* Legal Basis & Statutory Mandate Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              Statutory Governance & Timelines
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Applicable Privacy Regime</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Digital Personal Data Protection (DPDP) Act 2023 Sec. 11 & GDPR Art. 15 Right of Access.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">Statutory Deadline Clock</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Standard 30-day statutory window. <strong className="text-blue-700 font-mono font-bold">{dsrCase.slaDaysRemaining} days remaining</strong> before regulatory breach.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: LIFECYCLE STEPPER & ASSIGNED OWNER */}
        <div className="space-y-6">
          
          {/* Assigned Owner Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Assigned Privacy Officer
            </span>

            <div className="flex items-center space-x-3 pt-1">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                PS
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{dsrCase.owner}</p>
                <p className="text-xs text-blue-600 font-medium">{dsrCase.ownerRole}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Dutro Privacy Operations Unit</p>
              </div>
            </div>
          </div>

          {/* Lifecycle Stepper (Vertical) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                DSR Lifecycle Stepper
              </h3>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {dsrCase.currentStage}
              </span>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {lifecycleSteps.map((step, idx) => (
                <div key={step.name} className="flex items-start space-x-3 relative">
                  
                  {/* Icon dot */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 z-10 ${
                    step.completed 
                      ? 'bg-emerald-500 text-white shadow-xs' 
                      : step.current 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 font-bold' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="pt-0.5">
                    <p className={`text-xs font-semibold ${
                      step.current ? 'text-blue-600 font-bold' : step.completed ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {step.date || (step.completed ? 'Completed' : 'Pending Stage')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('discovery')}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Continue to PDI Discovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
