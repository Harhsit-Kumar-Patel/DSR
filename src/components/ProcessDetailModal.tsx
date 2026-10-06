import React, { useState } from 'react';
import { BusinessProcess } from '../types';
import { X, CheckCircle2, ShieldCheck, Database, ArrowRight } from 'lucide-react';
import { PDIReferenceModal } from './PDIReferenceModal';
import { RequestDataConfirmModal } from './RequestDataConfirmModal';
import { MASTER_CLIENT } from '../mockData/initialData';

interface ProcessDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: BusinessProcess | null;
  onRequestData?: (processId: string) => void;
}

export const ProcessDetailModal: React.FC<ProcessDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  process,
  onRequestData 
}) => {
  const [isPDIModalOpen, setIsPDIModalOpen] = useState(false);
  const [isRequestConfirmOpen, setIsRequestConfirmOpen] = useState(false);

  if (!isOpen || !process) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {MASTER_CLIENT.name} RoPA Record
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5 uppercase tracking-wide">
                  {process.name}
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

          {/* Details Body */}
          <div className="p-6 space-y-4 text-xs text-slate-700 overflow-y-auto custom-scroll">
            
            {/* Status confirmation */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data location verified in {MASTER_CLIENT.name} PDI ✓</span>
            </div>

            {/* Core Process Metadata */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
                <p className="font-bold text-slate-900">{process.department}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Process owner</span>
                <p className="font-bold text-slate-900">{process.owner}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Primary System</span>
                <p className="font-medium text-slate-800">{process.source}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Classification</span>
                <p className="font-semibold text-blue-700">{process.dataClassification || 'Confidential Data'}</p>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400">Processing Purpose</span>
                <p className="font-medium text-slate-800 mt-0.5">{process.purpose}</p>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400">Statutory Legal Basis</span>
                <p className="font-medium text-slate-900 mt-0.5">{process.legalBasis}</p>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400">Retention Period</span>
                <p className="font-medium text-slate-900 mt-0.5">{process.retentionPeriod}</p>
              </div>
            </div>

            {/* Data that may exist */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Personal Data Elements Mapped in PDI:</span>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                {process.dataFound.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Crucial Dutro Value Explanation */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-950 space-y-1">
              <span className="font-bold text-blue-900 block">Identified from PDI:</span>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                "Dutro identified this process by scanning {MASTER_CLIENT.name}'s centralized Personal Data Inventory. Dutro tracks task completion while actual data stays within client systems."
              </p>
            </div>

          </div>

          {/* Footer with PDI link & Action */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setIsPDIModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>View PDI Baseline</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <span>Close</span>
            </button>
          </div>

        </div>
      </div>

      {/* PDI Reference Sub-Modal */}
      <PDIReferenceModal 
        isOpen={isPDIModalOpen} 
        onClose={() => setIsPDIModalOpen(false)} 
        process={process} 
      />
    </>
  );
};
