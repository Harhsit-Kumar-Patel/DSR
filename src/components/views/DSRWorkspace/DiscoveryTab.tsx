import React, { useState } from 'react';
import { DSRCase, MatchedProcess } from '../../../types/dsr';
import { useDSR } from '../../../context/DSRContext';
import { 
  GitBranch, 
  Database, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ChevronRight, 
  Building2, 
  User, 
  ShieldCheck, 
  FileText,
  Sparkles,
  ExternalLink,
  Workflow,
  Plus
} from 'lucide-react';
import { RoPAProcessDrawer } from './drawers/RoPAProcessDrawer';

interface DiscoveryTabProps {
  dsrCase: DSRCase;
  onNavigateTab: (tab: 'overview' | 'tasks' | 'data' | 'review' | 'activity') => void;
}

export const DiscoveryTab: React.FC<DiscoveryTabProps> = ({ dsrCase, onNavigateTab }) => {
  const { createPDIGapFromConflict, setCurrentView } = useDSR();
  const [selectedProcess, setSelectedProcess] = useState<MatchedProcess | null>(null);

  const completedTasksCount = dsrCase.tasks.filter(t => t.status === 'Completed').length;
  const totalTasksCount = dsrCase.tasks.length;

  return (
    <div className="space-y-6">
      
      {/* Top Differentiator Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-indigo-50/40 border border-blue-200 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
                DUTRO INTELLIGENT DISCOVERY LAYER
              </span>
              <span className="text-xs text-emerald-700 font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 4 Matched RoPA Processes
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mt-1">PDI-Guided Discovery</h2>
            <p className="text-xs text-slate-600 max-w-3xl mt-0.5 leading-relaxed">
              "Relevant processes were identified using the client's existing Personal Data Inventory (PDI) and RoPA. Dutro does not blindly scan the entire enterprise — it queries mapped data processes directly."
            </p>
          </div>

          {/* Requester Persona Chip */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-right shrink-0 shadow-2xs">
            <p className="text-[10px] uppercase font-bold text-slate-400">Target Persona & Entity</p>
            <p className="font-bold text-slate-900 mt-0.5">{dsrCase.requesterName}</p>
            <p className="text-[11px] text-blue-700 font-mono font-medium">{dsrCase.persona} • {dsrCase.legalEntity}</p>
          </div>
        </div>

        {/* Visual Workflow Flowchart */}
        <div className="pt-3 border-t border-blue-100">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2.5 flex items-center gap-1.5">
            <Workflow className="w-3.5 h-3.5 text-blue-600" />
            Automated Knowledge Query Flow
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-center items-center">
              <span className="text-[10px] text-slate-400 font-mono font-semibold">1. Requester</span>
              <strong className="text-slate-900 text-xs mt-0.5 truncate">{dsrCase.requesterName}</strong>
              <span className="text-[10px] text-blue-600 font-medium">Customer Persona</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 shadow-2xs flex flex-col justify-center items-center">
              <span className="text-[10px] text-blue-700 font-mono font-semibold">2. Dutro RoPA/PDI</span>
              <strong className="text-slate-900 text-xs mt-0.5">87% Coverage</strong>
              <span className="text-[10px] text-blue-700 font-medium">Targeted Query</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-center items-center">
              <span className="text-[10px] text-slate-500 font-mono font-semibold">3. Matched Processes</span>
              <strong className="text-slate-900 text-xs mt-0.5">4 Processes</strong>
              <span className="text-[10px] text-slate-600 font-medium">Sales, Support, Fin, Mktg</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-center items-center">
              <span className="text-[10px] text-slate-500 font-mono font-semibold">4. Dept Owners</span>
              <strong className="text-slate-900 text-xs mt-0.5">4 Stewards</strong>
              <span className="text-[10px] text-slate-600 font-medium">Automated Dispatch</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs flex flex-col justify-center items-center">
              <span className="text-[10px] text-emerald-800 font-mono font-semibold">5. Data Tasks</span>
              <strong className="text-emerald-800 text-xs mt-0.5 font-bold">{completedTasksCount}/{totalTasksCount} Completed</strong>
              <span className="text-[10px] text-emerald-700 font-medium">Evidence Bank Ingest</span>
            </div>
          </div>
        </div>

      </div>

      {/* UNIQUE FEATURE: DATA MAP CONFLICT / PDI GAP (The "Wow Moment") */}
      {dsrCase.pdiConflict && (
        <div className={`p-5 rounded-2xl border transition-all ${
          dsrCase.pdiConflict.status === 'Detected' 
            ? 'bg-amber-50/90 border-amber-300 shadow-sm' 
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                dsrCase.pdiConflict.status === 'Detected' 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-900">
                    ⚠ DATA MAP CONFLICT DETECTED DURING DATA COLLECTION
                  </span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                    Severity: Medium
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  Customer phone data located in unmapped SharePoint Excel spreadsheet
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1.5 font-sans">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">PDI RoPA Baseline says:</span>
                    <p className="font-mono text-xs font-bold text-blue-700 mt-0.5">{dsrCase.pdiConflict.pdiBaseline}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Evidence collection revealed:</span>
                    <p className="font-mono text-xs font-bold text-amber-800 mt-0.5">{dsrCase.pdiConflict.evidenceDiscovered}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 pt-1">
                  "Dutro DSRs not only fulfill user rights — they continuously validate and identify weaknesses in the client's privacy data map."
                </p>
              </div>
            </div>

            {/* Action button */}
            <div className="shrink-0">
              {dsrCase.pdiConflict.status === 'Detected' ? (
                <button
                  onClick={() => createPDIGapFromConflict(dsrCase.id)}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Gap Analysis Item</span>
                </button>
              ) : (
                <div className="text-right space-y-1.5">
                  <div className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Gap GAP-304 Created & Linked</span>
                  </div>
                  <button
                    onClick={() => setCurrentView('gap-analysis')}
                    className="text-xs text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1 justify-end font-semibold font-mono"
                  >
                    View in Gap Analysis Register <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Matched Processes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              Matched Business Processes (PDI Query Results)
            </h3>
            <p className="text-xs text-slate-500">Click any process card to view RoPA details, legal basis, and retention rules</p>
          </div>

          <span className="text-xs text-slate-500 font-mono font-medium">
            4 / 4 Processes Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dsrCase.matchedProcesses.map((proc, idx) => (
            <div
              key={proc.id}
              onClick={() => setSelectedProcess(proc)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group space-y-3.5 shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs font-mono">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {proc.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{proc.department} • {proc.departmentOwner}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {proc.matchConfidence}% Match
                </span>
              </div>

              {/* Data Elements preview */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Target Personal Data Elements</span>
                <div className="flex flex-wrap gap-1.5">
                  {proc.dataElements.map((elem) => (
                    <span key={elem} className="px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-700 text-[11px] font-mono border border-slate-200">
                      {elem}
                    </span>
                  ))}
                </div>
              </div>

              {/* Source Application & Legal Basis Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono text-slate-600">Source: <strong className="text-slate-800">{proc.sourceSystem}</strong></span>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  RoPA Specs →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DATA ACTION PLAN (Prompt Section 9) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Data Action Plan & Department Orchestration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted departmental tasks generated automatically from matched RoPA processes.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            Manage Department Tasks ({completedTasksCount}/{totalTasksCount}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Process</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold">Department Owner</th>
                <th className="py-2.5 px-3 font-semibold">Required Action</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dsrCase.tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {task.processName}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {task.department}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {task.owner}
                  </td>
                  <td className="py-3 px-3 text-slate-800">
                    {task.title}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      task.status === 'Completed' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateTab('tasks')}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {task.status === 'Completed' ? 'View Extract' : 'Complete Task →'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RoPA Process Detail Drawer */}
      <RoPAProcessDrawer 
        process={selectedProcess} 
        onClose={() => setSelectedProcess(null)} 
      />

    </div>
  );
};
