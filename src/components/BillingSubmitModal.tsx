import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, Check } from 'lucide-react';
import { MASTER_CLIENT, MASTER_CUSTOMER } from '../mockData/initialData';

interface BillingSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isAlreadySubmitted: boolean;
}

export const BillingSubmitModal: React.FC<BillingSubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isAlreadySubmitted
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasJustSubmitted, setHasJustSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setHasJustSubmitted(true);
      onSubmit();
      setTimeout(() => {
        onClose();
        setHasJustSubmitted(false);
      }, 700);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                Finance Operations · {MASTER_CLIENT.name}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                CONFIRM TASK COMPLETION
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
        <div className="p-6 space-y-4 text-xs text-slate-700">
          
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Process</span>
              <p className="font-bold text-slate-900 text-sm">Billing & Payments</p>
              <p className="text-[11px] text-slate-500 font-medium">Source: Client Billing System</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>✓ Data retrieved by client</span>
            </span>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-slate-800 space-y-1">
            <p className="font-medium text-slate-700">
              "Confirm that Finance Operations has retrieved and reviewed the requested billing and invoice records for <strong>{MASTER_CUSTOMER.name} (DSR-2001)</strong>."
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isAlreadySubmitted}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            {isSubmitting ? 'Confirming...' : isAlreadySubmitted ? '✓ Already Completed' : 'Confirm Completion'}
          </button>
        </div>

      </div>
    </div>
  );
};
