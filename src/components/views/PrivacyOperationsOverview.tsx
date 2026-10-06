import React from 'react';
import { useDSR } from '../../context/DSRContext';
import { 
  Inbox, 
  ShieldCheck, 
  Compass, 
  FileCheck, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  AlertTriangle, 
  Database, 
  Activity, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const PrivacyOperationsOverview: React.FC = () => {
  const { 
    dsrCases, 
    setCurrentView, 
    navigateToDSR 
  } = useDSR();

  const pipelineStages = [
    { name: 'Received', count: 24, highlight: false },
    { name: 'Verified', count: 20, highlight: false },
    { name: 'Discovery', count: 7, highlight: true },
    { name: 'Collection', count: 6, highlight: false },
    { name: 'Review', count: 5, highlight: false },
    { name: 'Approval', count: 3, highlight: false },
    { name: 'Response', count: 2, highlight: false },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Privacy Operations — DSAR Command Center</h1>
            <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              Right of Access Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">
            End-to-end Data Subject Access Request (DSAR) orchestration, department task fulfillment, and automated RoPA/PDI data map validation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateToDSR('DSR-1024', 'discovery')}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Open Demo Case (DSR-1024)</span>
          </button>
          
          <button
            onClick={() => setCurrentView('dsr-list')}
            className="px-3.5 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>View All DSARs</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Active DSARs */}
        <div 
          onClick={() => setCurrentView('dsr-list')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active DSARs</span>
            <Inbox className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">24</p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">
            +4 this week
          </p>
        </div>

        {/* Awaiting Verification */}
        <div 
          onClick={() => setCurrentView('dsr-list')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Verification</span>
            <ShieldCheck className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">4</p>
          <p className="text-[10px] text-slate-500 mt-1">2FA / OTP pending</p>
        </div>

        {/* In Discovery */}
        <div 
          onClick={() => navigateToDSR('DSR-1024', 'discovery')}
          className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 hover:border-blue-400 shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">In Discovery</span>
            <Compass className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">7</p>
          <p className="text-[10px] text-blue-700 font-medium mt-1">PDI matching active</p>
        </div>

        {/* Awaiting Review */}
        <div 
          onClick={() => navigateToDSR('DSR-1024', 'review')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Awaiting Review</span>
            <FileCheck className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">5</p>
          <p className="text-[10px] text-amber-700 font-medium mt-1">Redaction queue</p>
        </div>

        {/* Near Deadline */}
        <div 
          onClick={() => setCurrentView('dsr-list')}
          className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 hover:border-rose-300 shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Near Deadline</span>
            <Clock className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-rose-900 mt-2">3</p>
          <p className="text-[10px] text-rose-700 font-medium mt-1">SLA &lt; 5 days</p>
        </div>

        {/* Open Grievances */}
        <div 
          onClick={() => setCurrentView('grievances')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Open Grievances</span>
            <AlertCircle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">2</p>
          <p className="text-[10px] text-amber-700 font-medium mt-1">Stage 1 Internal</p>
        </div>

      </div>

      {/* REQUEST PIPELINE */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              DSAR Access Pipeline Orchestration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">End-to-end statutory Access Right lifecycle</p>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Total Active Ingestion: <strong className="text-slate-900">24</strong>
          </span>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          {pipelineStages.map((stage, idx) => (
            <div 
              key={stage.name}
              onClick={() => {
                if (stage.name === 'Discovery') navigateToDSR('DSR-1024', 'discovery');
                else if (stage.name === 'Review') navigateToDSR('DSR-1024', 'review');
                else setCurrentView('dsr-list');
              }}
              className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                stage.highlight 
                  ? 'bg-blue-50 border-blue-300 shadow-xs' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold">{idx + 1}</span>
                <span className="text-xs font-bold text-slate-900 font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                  {stage.count}
                </span>
              </div>
              <p className={`text-xs font-bold ${stage.highlight ? 'text-blue-700' : 'text-slate-800'}`}>
                {stage.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Action Required & Data Map Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: ACTION REQUIRED */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Action Required
            </h3>
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
              4 critical items
            </span>
          </div>

          <div className="space-y-2.5">
            
            {/* PDI Conflict Item */}
            <div 
              onClick={() => navigateToDSR('DSR-1024', 'discovery')}
              className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-start justify-between cursor-pointer group shadow-2xs"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-amber-900">1 DSAR has a Data Map / PDI Conflict</span>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">DSR-1024</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Support team reported customer phone data stored in unmapped SharePoint Excel sheet.
                  </p>
                  <p className="text-[11px] text-blue-600 font-bold mt-1.5 flex items-center gap-1 group-hover:underline">
                    Review conflict & create Gap Analysis item <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>

            {/* Department Tasks Overdue */}
            <div 
              onClick={() => navigateToDSR('DSR-1024', 'tasks')}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">3 department extraction tasks pending submission</p>
                  <p className="text-[11px] text-slate-500">Finance & Marketing retrieval tasks pending for DSR-1024 & DSR-1026</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Awaiting Identity Verification */}
            <div 
              onClick={() => setCurrentView('dsr-list')}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">2 DSARs awaiting identity verification</p>
                  <p className="text-[11px] text-slate-500">DSR-1025 (Rahul Sharma) awaiting secondary photo ID confirmation</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 2 DSRs approaching deadline */}
            <div 
              onClick={() => setCurrentView('dsr-list')}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">2 DSARs approaching statutory deadline (&lt; 5 days)</p>
                  <p className="text-[11px] text-slate-500">DSR-1026 has 3 days remaining before statutory breach</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

          </div>
        </div>

        {/* Right Column: DATA MAP HEALTH */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Data Map Health
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              PDI Connected
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            DSAR operations continuously validate and improve Dutro's central Personal Data Inventory & RoPA data map.
          </p>

          {/* Health Stats Grid */}
          <div className="space-y-2.5">
            
            {/* PDI Coverage */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold">PDI Coverage</span>
                <span className="font-bold text-emerald-700 font-mono">87%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '87%' }} />
              </div>
              <p className="text-[10px] text-slate-500">32 of 37 business processes fully mapped</p>
            </div>

            {/* PDI Gaps */}
            <div 
              onClick={() => setCurrentView('gap-analysis')}
              className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 flex items-center justify-between cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-slate-800">PDI Gaps</p>
                <p className="text-[11px] text-slate-500">Identified in privacy audits & DSARs</p>
              </div>
              <span className="text-base font-bold font-mono text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                8
              </span>
            </div>

            {/* Data Map Conflicts */}
            <div 
              onClick={() => navigateToDSR('DSR-1024', 'discovery')}
              className="p-3 rounded-lg bg-amber-50 border border-amber-200 hover:border-amber-300 flex items-center justify-between cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-amber-900">Data Map Conflicts</p>
                <p className="text-[11px] text-amber-700">Discovered during live DSAR fulfillment</p>
              </div>
              <span className="text-base font-bold font-mono text-amber-900 bg-white border border-amber-200 px-2 py-0.5 rounded">
                3
              </span>
            </div>

          </div>

          <button
            onClick={() => setCurrentView('pdi-catalog')}
            className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Explore Personal Data Inventory</span>
          </button>
        </div>

      </div>

    </div>
  );
};
