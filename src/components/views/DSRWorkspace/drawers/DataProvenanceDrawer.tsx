import React from 'react';
import { CollectedDataRecord } from '../../../../types/dsr';
import { 
  X, 
  Database, 
  GitBranch, 
  Building2, 
  FileCheck, 
  UserCheck, 
  ShieldAlert, 
  ShieldCheck, 
  Scale, 
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface DataProvenanceDrawerProps {
  record: CollectedDataRecord | null;
  onClose: () => void;
  onOpenDecisionDetails?: (record: CollectedDataRecord) => void;
}

export const DataProvenanceDrawer: React.FC<DataProvenanceDrawerProps> = ({ 
  record, 
  onClose,
  onOpenDecisionDetails 
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                  DATA PROVENANCE & LINEAGE
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{record.fieldName}</h3>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Differentiator Explanation Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              Dutro Provenance Tracking Principle
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Dutro does not just display raw values. Every single piece of data is mapped back to its business process, source system, department owner, legal evidence item, and relationship classification.
            </p>
          </div>

          {/* Data Field & Value Preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500">Captured Value</span>
              <span className="text-[10px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold shadow-2xs">
                Category: {record.category}
              </span>
            </div>
            <p className="font-mono text-sm text-slate-900 bg-white p-3 rounded-lg border border-slate-200 break-all select-all font-semibold shadow-2xs">
              {record.value}
            </p>
          </div>

          {/* Provenance Tree / Lineage Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            
            {/* Source System */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" /> Source Application
              </span>
              <p className="font-bold text-slate-900">{record.sourceSystem}</p>
            </div>

            {/* Process */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-blue-600" /> Business Process
              </span>
              <p className="font-bold text-slate-900">{record.processName}</p>
            </div>

            {/* Department */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Department Origin
              </span>
              <p className="font-bold text-slate-900">{record.department}</p>
            </div>

            {/* Evidence Link */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-amber-600" /> Evidence ID
              </span>
              <p className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 w-fit">{record.evidenceId}</p>
            </div>

          </div>

          {/* Relationship & Subject Classification */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Data Principal Relationship Classification
            </span>
            <div className="flex items-center space-x-2 pt-1 flex-wrap gap-y-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                record.relationship === 'Requester' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                record.relationship === 'Third-party individual' ? 'bg-amber-50 text-amber-900 border border-amber-300' :
                record.relationship === 'Internal privileged' ? 'bg-purple-50 text-purple-900 border border-purple-200' :
                'bg-slate-200 text-slate-800'
              }`}>
                {record.relationship}
              </span>
              <span className="text-[11px] text-slate-600">
                {record.relationship === 'Requester' ? 'Direct data principal attribute' : 'Belongs to non-requester party or confidential process'}
              </span>
            </div>
          </div>

          {/* Proposed Treatment & Legal Justification */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">Proposed Disclosure Treatment</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-xs ${
                record.proposedTreatment === 'DISCLOSE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                record.proposedTreatment === 'REDACT' ? 'bg-amber-50 text-amber-900 border border-amber-300' :
                record.proposedTreatment === 'EXCLUDE' ? 'bg-purple-50 text-purple-900 border border-purple-200' :
                'bg-yellow-50 text-yellow-900 border border-yellow-300'
              }`}>
                {record.proposedTreatment}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 shadow-2xs">
              <p className="font-bold text-slate-900 text-xs">Statutory Reason & Policy Basis:</p>
              <p className="text-slate-700 text-xs leading-relaxed">{record.decisionReason}</p>
              <p className="text-[10px] font-mono font-semibold text-blue-700 pt-1">Policy: {record.policyReference}</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">Record ID: <strong>{record.id}</strong></span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
            >
              Close Lineage
            </button>

            {onOpenDecisionDetails && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDecisionDetails(record);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Open "Why?" Decision Details →
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
