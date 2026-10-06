import React, { useState } from 'react';
import { useDSR } from '../../context/DSRContext';
import { INITIAL_MATCHED_PROCESSES } from '../../mockData/initialData';
import { 
  Database, 
  GitBranch, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Share2, 
  Building2, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { RoPAProcessDrawer } from './DSRWorkspace/drawers/RoPAProcessDrawer';
import { MatchedProcess } from '../../types/dsr';

export const PDICatalogView: React.FC = () => {
  const { navigateToDSR } = useDSR();
  const [selectedProcess, setSelectedProcess] = useState<MatchedProcess | null>(null);

  const extendedProcesses = [
    ...INITIAL_MATCHED_PROCESSES,
    {
      id: 'proc-5',
      name: 'Employee Payroll & Statutory Tax Withholding',
      department: 'HR & Finance',
      departmentOwner: 'Neha Kapoor',
      sourceSystem: 'Workday & ADP Payroll',
      legalBasis: 'Statutory Employment Obligation',
      retentionPeriod: '8 Years post employment',
      thirdPartyTransfer: 'None (India Region Hosted)',
      dataElements: ['PAN Number', 'Provident Fund ID', 'Salary Structure', 'Bank Account Details'],
      purpose: 'Monthly salary credit, TDS calculation, EPFO statutory filing',
      matchConfidence: 85,
    },
    {
      id: 'proc-6',
      name: 'Candidate Recruitment & Evaluation',
      department: 'HR & Talent Acquisition',
      departmentOwner: 'Rahul Gupta',
      sourceSystem: 'Greenhouse ATS',
      legalBasis: 'Consent & Legitimate Interest',
      retentionPeriod: '1 Year post application',
      thirdPartyTransfer: 'HireRight Background Check (US)',
      dataElements: ['Resume / CV', 'Interview Evaluation Notes', 'Past Employment References'],
      purpose: 'Candidate sourcing, interviewing, and reference screening',
      matchConfidence: 90,
    }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 via-white to-emerald-50/40 p-6 rounded-2xl border border-blue-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
              CONNECTED DUTRO MODULE
            </span>
            <span className="text-xs text-slate-500 font-medium">Baseline Data Map</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Personal Data Inventory (PDI) & RoPA</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            The intelligent knowledge foundation that powers Dutro's automated DSR discovery and orchestration.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-right shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Enterprise PDI Coverage</span>
            <p className="text-lg font-bold font-mono text-emerald-700">87% Active</p>
          </div>

          <button
            onClick={() => navigateToDSR('DSR-2001', 'discovery')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            <span>See Live DSR Query (DSR-2001) →</span>
          </button>
        </div>
      </div>

      {/* RoPA Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {extendedProcesses.map((proc) => (
          <div
            key={proc.id}
            onClick={() => setSelectedProcess(proc)}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group space-y-3 shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  {proc.id}
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                  Mapped
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {proc.name}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {proc.purpose}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {proc.dataElements.slice(0, 3).map((elem: string) => (
                  <span key={elem} className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] font-mono border border-slate-200">
                    {elem}
                  </span>
                ))}
                {proc.dataElements.length > 3 && (
                  <span className="text-[10px] text-slate-500 font-mono self-center">
                    +{proc.dataElements.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{proc.department}</span>
              <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                Details →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer */}
      <RoPAProcessDrawer 
        process={selectedProcess} 
        onClose={() => setSelectedProcess(null)} 
      />

    </div>
  );
};
