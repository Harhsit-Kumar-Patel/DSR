import React, { useState } from 'react';
import { DSRCase, CollectedDataRecord } from '../../../types/dsr';
import { 
  Database, 
  GitBranch, 
  Layers, 
  Paperclip, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  HelpCircle,
  Building2,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { DataProvenanceDrawer } from './drawers/DataProvenanceDrawer';
import { DecisionDetailsDrawer } from './drawers/DecisionDetailsDrawer';

interface DataTabProps {
  dsrCase: DSRCase;
  onNavigateTab: (tab: 'review') => void;
}

export const DataTab: React.FC<DataTabProps> = ({ dsrCase, onNavigateTab }) => {
  const [selectedRecordForProvenance, setSelectedRecordForProvenance] = useState<CollectedDataRecord | null>(null);
  const [selectedRecordForDecision, setSelectedRecordForDecision] = useState<CollectedDataRecord | null>(null);

  // Group records by process
  const processes = Array.from(new Set(dsrCase.collectedData.map(r => r.processName)));

  const getTreatmentBadge = (treatment: string) => {
    switch (treatment) {
      case 'DISCLOSE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
            DISCLOSE
          </span>
        );
      case 'REDACT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200">
            REDACT
          </span>
        );
      case 'EXCLUDE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-50 text-purple-800 border border-purple-200">
            EXCLUDE
          </span>
        );
      case 'HUMAN_REVIEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-yellow-50 text-yellow-800 border border-yellow-200">
            HUMAN REVIEW
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Aggregated Evidence & Collected Personal Data
            </h3>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
              {dsrCase.collectedData.length} Records Ingested
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            All data records collected from departmental systems, mapped with full provenance and automated treatment rules.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('review')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <span>Proceed to Response Review</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grouped Data Tables */}
      <div className="space-y-6">
        {processes.map((procName) => {
          const recordsInProc = dsrCase.collectedData.filter(r => r.processName === procName);
          const firstRec = recordsInProc[0];

          return (
            <div key={procName} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm space-y-0">
              
              {/* Process Section Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {procName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Dept: <strong className="text-slate-700">{firstRec?.department}</strong> • Source: <strong className="text-slate-700">{firstRec?.sourceSystem}</strong>
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 font-semibold shadow-2xs">
                  {recordsInProc.length} attributes
                </span>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50/50 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Data Element</th>
                      <th className="py-2.5 px-4 font-semibold">Value / Extract Summary</th>
                      <th className="py-2.5 px-4 font-semibold">Source App</th>
                      <th className="py-2.5 px-4 font-semibold">Evidence Link</th>
                      <th className="py-2.5 px-4 font-semibold">Proposed Treatment</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Provenance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recordsInProc.map((rec) => (
                      <tr 
                        key={rec.id}
                        onClick={() => setSelectedRecordForProvenance(rec)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                      >
                        {/* Data Element */}
                        <td className="py-3 px-4 font-semibold text-slate-900 group-hover:text-blue-600">
                          <div>
                            <span>{rec.fieldName}</span>
                            <p className="text-[10px] text-slate-400 font-normal">{rec.category}</p>
                          </div>
                        </td>

                        {/* Value */}
                        <td className="py-3 px-4 max-w-xs font-mono text-slate-700 truncate">
                          {rec.proposedTreatment === 'REDACT' ? (
                            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-semibold">
                              {rec.value}
                            </span>
                          ) : rec.proposedTreatment === 'EXCLUDE' ? (
                            <span className="text-purple-800 italic text-[11px] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              [Privileged] {rec.value}
                            </span>
                          ) : (
                            rec.value
                          )}
                        </td>

                        {/* Source App */}
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {rec.sourceSystem}
                        </td>

                        {/* Evidence Link */}
                        <td className="py-3 px-4 font-mono">
                          <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1 w-fit font-semibold">
                            <Paperclip className="w-3 h-3" /> {rec.evidenceId}
                          </span>
                        </td>

                        {/* Proposed Treatment */}
                        <td className="py-3 px-4">
                          {getTreatmentBadge(rec.proposedTreatment)}
                        </td>

                        {/* Provenance Action */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecordForProvenance(rec);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Lineage →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          );
        })}
      </div>

      {/* Provenance Drawer */}
      <DataProvenanceDrawer
        record={selectedRecordForProvenance}
        onClose={() => setSelectedRecordForProvenance(null)}
        onOpenDecisionDetails={(rec) => {
          setSelectedRecordForProvenance(null);
          setSelectedRecordForDecision(rec);
        }}
      />

      {/* Decision Details Drawer ("Why?") */}
      <DecisionDetailsDrawer
        record={selectedRecordForDecision}
        onClose={() => setSelectedRecordForDecision(null)}
      />

    </div>
  );
};
