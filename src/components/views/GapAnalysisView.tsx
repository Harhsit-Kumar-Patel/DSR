import React from 'react';
import { useDSR } from '../../context/DSRContext';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Plus, 
  FileText,
  UserCheck,
  Sparkles
} from 'lucide-react';

export const GapAnalysisView: React.FC = () => {
  const { gaps, navigateToDSR, dsrCases } = useDSR();

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-50 via-white to-blue-50/40 p-6 rounded-2xl border border-rose-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-900 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
              CONNECTED DUTRO MODULE
            </span>
            <span className="text-xs text-slate-500 font-medium">Continuous Privacy Map Audit</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Gap Analysis & Remediation Register</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Dutro continuously identifies data map discrepancies during DSR fulfillment and tracks corrective remediation actions.
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-rose-100 text-rose-900 border border-rose-200 px-3 py-1.5 rounded-xl">
          {gaps.length} Active Gaps Tracked
        </span>
      </div>

      {/* Highlight Card if GAP-304 exists (from DSR-1024 conflict) */}
      {gaps.some(g => g.id === 'GAP-304') && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm space-y-3">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                  NEW GAP GENERATED VIA DSR CONFLICT
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  GAP-304: Customer phone data exists outside currently mapped CRM process
                </h3>
              </div>
            </div>

            <button
              onClick={() => navigateToDSR('DSR-1024', 'discovery')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>View Source Case (DSR-1024)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            "Discovered during DSR-1024 data collection. Customer Support maintains an offline Excel sheet (Support_Escalations_2026.xlsx) on SharePoint containing customer phone numbers without active RoPA/PDI mapping or automated retention governance."
          </p>
        </div>
      )}

      {/* Gaps Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200 tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Gap ID</th>
                <th className="py-3 px-4 font-semibold">Title & Description</th>
                <th className="py-3 px-4 font-semibold">Source Trigger</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Remediation Plan</th>
                <th className="py-3 px-4 font-semibold">Owner</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gaps.map((gap) => (
                <tr 
                  key={gap.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    gap.id === 'GAP-304' ? 'bg-amber-50/50' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-800">
                    {gap.id}
                  </td>

                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="font-bold text-slate-900">{gap.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{gap.description}</p>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    {gap.sourceDsrId.startsWith('DSR') ? (
                      <button
                        onClick={() => navigateToDSR(gap.sourceDsrId, 'discovery')}
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-bold"
                      >
                        {gap.sourceDsrId} <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-slate-500">{gap.sourceDsrId}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      gap.severity === 'High' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                      gap.severity === 'Medium' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {gap.severity}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">
                    {gap.department}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-[11px] text-slate-600">
                    {gap.remediationPlan}
                  </td>

                  <td className="py-3.5 px-4 text-slate-800 font-medium">
                    {gap.assignedOwner}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      gap.status === 'Open' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                      gap.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {gap.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
