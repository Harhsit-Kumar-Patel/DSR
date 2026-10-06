import React from 'react';
import { BusinessProcess } from '../types';
import { X, Database, ShieldCheck } from 'lucide-react';
import { MASTER_CLIENT } from '../mockData/initialData';

interface PDIReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: BusinessProcess | null;
}

export const PDIReferenceModal: React.FC<PDIReferenceModalProps> = ({ isOpen, onClose, process }) => {
  if (!isOpen || !process) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                {MASTER_CLIENT.name} PDI Record
              </span>
              <p className="text-xs text-slate-900 font-bold mt-0.5">
                {process.name}
              </p>
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
          
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 space-y-1">
            <div className="flex items-center space-x-1.5 text-blue-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Dutro Data Mapping Connection</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              This process is permanently mapped in {MASTER_CLIENT.name}'s central Record of Processing Activities (RoPA). Because the data location and responsible team are already known, Dutro immediately connects this process to incoming Access Requests.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Process</span>
              <p className="font-bold text-slate-900">{process.name}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
              <p className="font-bold text-slate-900">{process.department}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Responsible Owner</span>
              <p className="font-medium text-slate-800">{process.owner}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Primary Source</span>
              <p className="font-medium text-slate-800">{process.source}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Statutory Purpose</span>
            <p className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 font-medium">
              {process.purpose}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Personal Data Elements Mapped in PDI</span>
            <div className="flex flex-wrap gap-1.5">
              {process.dataFound.map((item, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium text-[11px]">
                  • {item}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close PDI View
          </button>
        </div>

      </div>
    </div>
  );
};
