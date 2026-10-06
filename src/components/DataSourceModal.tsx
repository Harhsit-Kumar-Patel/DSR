import React from 'react';
import { X, Database, ShieldCheck, CheckCircle2, FileText, Lock, Building2, User, Layers, Calendar, Scale } from 'lucide-react';
import { MASTER_CLIENT } from '../mockData/initialData';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceInfo: {
    dataTitle: string;
    processName: string;
    department: string;
    owner: string;
    sourceSystem: string;
    identifiedVia: string;
    legalBasis?: string;
    retentionPeriod?: string;
    evidenceId?: string;
    elements?: string[];
  } | null;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  onClose,
  sourceInfo
}) => {
  if (!isOpen || !sourceInfo) return null;

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
                DATA PROVENANCE & ORIGIN
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {sourceInfo.dataTitle}
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
          
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-950 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Explainable Data Provenance</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Dutro can explain exactly where this customer data originated because it is permanently linked to {MASTER_CLIENT.name}'s central <strong>Personal Data Inventory (PDI)</strong> and Record of Processing Activities (RoPA).
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">Business Process:</span>
              <span className="font-bold text-slate-900">{sourceInfo.processName}</span>
            </div>
            
            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">Department / Team:</span>
              <span className="font-medium text-slate-800">{sourceInfo.department}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">Responsible Owner:</span>
              <span className="font-bold text-slate-900">{sourceInfo.owner}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">System of Record:</span>
              <span className="font-semibold text-slate-800">{sourceInfo.sourceSystem}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">Legal Basis:</span>
              <span className="font-semibold text-blue-800">
                {sourceInfo.legalBasis || 'Performance of Contract (DPDP Sec. 4)'}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-500 font-medium">Retention Rule:</span>
              <span className="font-medium text-slate-800">
                {sourceInfo.retentionPeriod || '7 Years post account closure (Statutory Requirement)'}
              </span>
            </div>

            <div className="flex justify-between pt-0.5 items-center">
              <span className="text-slate-500 font-medium">Identified through:</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {sourceInfo.identifiedVia}
              </span>
            </div>
          </div>

          {sourceInfo.elements && sourceInfo.elements.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Included Personal Data Fields</span>
              <div className="flex flex-wrap gap-1.5">
                {sourceInfo.elements.map((el, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200">
                    • {el}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Evidence Token: <strong className="text-slate-700">{sourceInfo.evidenceId || 'EV-DSR-2001'}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Provenance
          </button>
        </div>

      </div>
    </div>
  );
};
