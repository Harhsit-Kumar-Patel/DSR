import React from 'react';
import { X, Send, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { MASTER_CLIENT } from '../mockData/initialData';

interface DataRequestSentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToClientView?: () => void;
  taskId: string;
  dsrId: string;
  processName: string;
  recipient: string;
  dataRequested: string[];
}

export const DataRequestSentModal: React.FC<DataRequestSentModalProps> = ({
  isOpen,
  onClose,
  onSwitchToClientView,
  taskId,
  dsrId,
  processName,
  recipient,
  dataRequested
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                ORCHESTRATION DISPATCH
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                DATA REQUEST SENT
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
          
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
            <span className="font-bold text-blue-900 block text-xs">
              Task Dispatched to Client Team
            </span>
            <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
              "The Finance Operations team at {MASTER_CLIENT.name} has been asked to retrieve the requested customer data from the Client Billing System."
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">DSR Case ID:</span>
              <span className="font-mono font-bold text-blue-700">{dsrId}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">Client Task ID:</span>
              <span className="font-mono font-bold text-slate-900">{taskId}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">Process:</span>
              <span className="font-bold text-slate-900">{processName}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">Recipient:</span>
              <span className="font-bold text-slate-900">{recipient}</span>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-slate-500 font-medium block">Data Requested:</span>
              <div className="space-y-1 pl-2">
                {dataRequested.map((item, idx) => (
                  <p key={idx} className="font-semibold text-slate-800">• {item}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Status updated to:</span>
            <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Waiting for client action
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          {onSwitchToClientView && (
            <button
              onClick={() => {
                onClose();
                onSwitchToClientView();
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Switch to {MASTER_CLIENT.name} View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
