import React from 'react';
import { MatchedProcess } from '../../../../types/dsr';
import { X, GitBranch, Database, Shield, Clock, Share2, User, FileText, CheckCircle2 } from 'lucide-react';

interface RoPAProcessDrawerProps {
  process: MatchedProcess | null;
  onClose: () => void;
}

export const RoPAProcessDrawer: React.FC<RoPAProcessDrawerProps> = ({ process, onClose }) => {
  if (!process) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                  DUTRO RoPA / PDI RECORD
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{process.name}</h3>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Alert */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2.5">
            <Database className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-900">PDI Knowledge Base Link</p>
              <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                This record is pulled directly from Dutro's central Record of Processing Activities (RoPA) & Personal Data Inventory. Match confidence: <strong className="text-emerald-700">{process.matchConfidence}%</strong>.
              </p>
            </div>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" /> Department Owner
              </span>
              <p className="font-bold text-slate-900 mt-1">{process.departmentOwner}</p>
              <p className="text-[11px] text-slate-500">{process.department}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" /> Primary Source System
              </span>
              <p className="font-bold text-slate-900 mt-1">{process.sourceSystem}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Legal Basis
              </span>
              <p className="font-bold text-emerald-800 mt-1">{process.legalBasis}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Retention Schedule
              </span>
              <p className="font-bold text-slate-900 mt-1">{process.retentionPeriod}</p>
            </div>
          </div>

          {/* Purpose Statement */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" /> Processing Purpose
            </span>
            <p className="text-slate-700 leading-relaxed font-sans">{process.purpose}</p>
          </div>

          {/* Data Elements Categorization */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-500">
              Mapped Personal Data Elements ({process.dataElements.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {process.dataElements.map((elem: string) => (
                <span key={elem} className="px-2.5 py-1 rounded-md bg-white text-slate-800 font-mono text-xs border border-slate-200 flex items-center gap-1.5 shadow-2xs font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {elem}
                </span>
              ))}
            </div>
          </div>

          {/* Third-Party Transfer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-600" /> Third-Party / Cross-Border Transfers
            </span>
            <p className="text-slate-700">{process.thirdPartyTransfer}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">RoPA Record ID: <strong>{process.id}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors cursor-pointer"
          >
            Close Detail
          </button>
        </div>

      </div>
    </div>
  );
};
