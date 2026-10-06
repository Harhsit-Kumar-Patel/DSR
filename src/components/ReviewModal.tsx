import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Check, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { MASTER_CLIENT, MASTER_CUSTOMER } from '../mockData/initialData';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDecision: (decision: 'Include' | 'Remove') => void;
  currentDecision: 'Include' | 'Remove' | 'Pending';
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onDecision,
  currentDecision
}) => {
  const [selectedOption, setSelectedOption] = useState<'Include' | 'Remove'>(
    currentDecision === 'Include' ? 'Include' : 'Remove'
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onDecision(selectedOption);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                PRIVACY SANITIZATION CHECK
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Client Third-Party Information Review
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700 overflow-y-auto custom-scroll">
          
          {/* WHY DOES THIS NEED REVIEW? */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Third-Party Data Subject Protection</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px] font-medium">
              {MASTER_CLIENT.name}'s Support Team conducted an internal review and confirmed that internal staff phone numbers and staff representative identities have been sanitized within {MASTER_CLIENT.name}'s environment prior to response delivery. Under DPDP Act 2023 Sec. 11 and GDPR Art. 15(4), disclosure must not adversely affect other individuals.
            </p>
          </div>

          {/* Detected Entity Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Internal Reviewing Team:</span>
              <span className="font-bold text-slate-900">{MASTER_CLIENT.name} Support Operations</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Data Subject:</span>
              <span className="font-medium text-slate-800">{MASTER_CUSTOMER.name} (DSR-2001)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Status:</span>
              <span className="font-mono text-emerald-900 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Redaction Completed by Client
              </span>
            </div>
          </div>

          {/* Before & After Sanitization Preview */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Support Conversation Review Preview:</span>
            
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-red-50/60 border border-red-200 space-y-1">
                <span className="text-[10px] font-bold text-red-800 uppercase font-mono">Original in Client System:</span>
                <p className="font-mono text-[11px] text-slate-800">
                  Agent: "Hi {MASTER_CUSTOMER.name.split(' ')[0]}, I am <strong className="text-red-700 bg-red-100 px-1 py-0.5 rounded">Neha Kapoor (neha.k@client.example)</strong> from {MASTER_CLIENT.name} Tier-2 support. I have resolved your account access."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono">Redacted for Customer Package:</span>
                <p className="font-mono text-[11px] text-slate-800">
                  Agent: "Hi {MASTER_CUSTOMER.name.split(' ')[0]}, I am <strong className="text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">[REDACTED - Support Staff #EMP-4882]</strong> from {MASTER_CLIENT.name} Tier-2 support. I have resolved your account access."
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Confirm Review
          </button>
        </div>

      </div>
    </div>
  );
};
