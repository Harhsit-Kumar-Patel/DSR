import React from 'react';
import { X, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ModuleInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
}

export const ModuleInfoModal: React.FC<ModuleInfoModalProps> = ({
  isOpen,
  onClose,
  moduleName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                Dutro Native Module
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{moduleName}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            <strong>{moduleName}</strong> is part of Dutro's central privacy and compliance foundation.
          </p>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-950 space-y-1">
            <p className="font-bold text-blue-900">How DSR connects to this module:</p>
            <p className="text-[11px]">
              When an Access Request (DSAR) is received, Dutro does not perform blind database searches. It queries this central mapping to immediately identify which departments, systems, and owners hold the customer's data.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Back to Requests
          </button>
        </div>

      </div>
    </div>
  );
};
