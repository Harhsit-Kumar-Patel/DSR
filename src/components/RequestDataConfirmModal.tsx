import React, { useState } from 'react';
import { BusinessProcess } from '../types';
import { X, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { MASTER_CLIENT } from '../mockData/initialData';

interface RequestDataConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: BusinessProcess | null;
  onConfirm: () => void;
}

export const RequestDataConfirmModal: React.FC<RequestDataConfirmModalProps> = ({
  isOpen,
  onClose,
  process,
  onConfirm
}) => {
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !process) return null;

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => {
      onConfirm();
      setIsSent(false);
      onClose();
    }, 600);
  };

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
                Task Dispatch
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5 uppercase">
                DISPATCH CLIENT TASK
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
          
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{process.name}</h4>
            <p className="text-slate-600 text-xs mt-1">
              "Dutro will dispatch a data retrieval task to <strong>{process.owner}</strong> ({process.department} at {MASTER_CLIENT.name})."
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500">Responsible Owner:</span>
              <span className="font-bold text-slate-900">{process.owner}</span>
            </div>
            
            <div className="space-y-1 pt-1">
              <span className="text-slate-500 block">Data requested:</span>
              <div className="space-y-1 pl-2">
                {process.dataFound.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-slate-800 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✓ Task dispatched to {process.owner}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={isSent}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>{isSent ? 'Dispatched' : 'Dispatch Task'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
