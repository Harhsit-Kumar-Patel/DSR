import React from 'react';
import { useDSR, ActiveView } from '../../context/DSRContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Inbox, 
  AlertCircle, 
  Database, 
  GitBranch, 
  Building2, 
  Users, 
  FileText, 
  Layers, 
  CheckSquare, 
  Share2, 
  Sparkles, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  onOpenDemoTour: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenDemoTour }) => {
  const { 
    currentView, 
    setCurrentView, 
    dsrCases, 
    grievances, 
    gaps, 
    resetDemoData, 
    navigateToDSR 
  } = useDSR();

  const activeDSRCount = dsrCases.filter(c => c.status !== 'Completed' && c.status !== 'Response Sent').length;
  const openGrievancesCount = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed').length;
  const conflictCount = dsrCases.filter(c => c.pdiConflict?.status === 'Detected').length;

  const navItemClass = (view: ActiveView) => `
    w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer
    ${currentView === view 
      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs' 
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }
  `;

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
      {/* Top Branding & Tenant */}
      <div>
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setCurrentView('overview')}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900">DUTRO</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                  DSAR
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Access Rights & Risk Engine</p>
            </div>
          </div>

          {/* Tenant Entity Badge */}
          <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Tenant Entity</p>
                <p className="text-xs font-bold text-slate-800 truncate">Dutro India Pvt Ltd</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
              IN-HQ
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-230px)]">
          
          {/* Top-Level Section: PRIVACY OPERATIONS */}
          <div>
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                DSAR Operations
              </span>
              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1 rounded">
                ACCESS
              </span>
            </div>

            <div className="space-y-1">
              <button 
                onClick={() => setCurrentView('overview')}
                className={navItemClass('overview')}
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span>Overview</span>
                </div>
              </button>

              <button 
                onClick={() => setCurrentView('dsr-list')}
                className={navItemClass('dsr-list')}
              >
                <div className="flex items-center space-x-2.5">
                  <Inbox className="w-4 h-4 text-blue-600" />
                  <span>DSAR Inbox</span>
                </div>
                <div className="flex items-center space-x-1">
                  {conflictCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" title="PDI Conflict Pending" />
                  )}
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                    {activeDSRCount}
                  </span>
                </div>
              </button>

              <button 
                onClick={() => setCurrentView('grievances')}
                className={navItemClass('grievances')}
              >
                <div className="flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Grievances</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                  {openGrievancesCount}
                </span>
              </button>
            </div>
          </div>

          {/* Dutro Native Section: DATA MAPPING */}
          <div>
            <div className="px-3 mb-1.5">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Data Mapping & Inventory
              </span>
            </div>

            <div className="space-y-1">
              <button 
                onClick={() => setCurrentView('pdi-catalog')}
                className={navItemClass('pdi-catalog')}
              >
                <div className="flex items-center space-x-2.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Personal Data Inventory</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 rounded font-bold">
                  87%
                </span>
              </button>

              <button 
                onClick={() => setCurrentView('pdi-catalog')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <GitBranch className="w-4 h-4 text-purple-600" />
                  <span>RoPA / Processes</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">12</span>
              </button>

              <button 
                onClick={() => setCurrentView('pdi-catalog')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Share2 className="w-4 h-4 text-sky-600" />
                  <span>Vendors / Sub-processors</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">6</span>
              </button>
            </div>
          </div>

          {/* Dutro Native Section: GOVERNANCE & RISK */}
          <div>
            <div className="px-3 mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Governance & Risk
              </span>
            </div>

            <div className="space-y-1">
              <button 
                onClick={() => setCurrentView('gap-analysis')}
                className={navItemClass('gap-analysis')}
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-4 h-4 text-rose-600" />
                  <span>Gap Analysis</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold">
                  {gaps.length}
                </span>
              </button>

              <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-default">
                <div className="flex items-center space-x-2.5">
                  <CheckSquare className="w-4 h-4 text-teal-600" />
                  <span>Evidence Bank</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">18</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Interactive Demo Controls */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2">
        
        {/* Quick Demo Case Jump button */}
        <button
          onClick={() => navigateToDSR('DSR-2001', 'discovery')}
          className="w-full py-2 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold flex items-center justify-between group transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Demo Case: Rohan (DSR-2001)</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Public Intake Portal Toggle */}
        <button
          onClick={() => setCurrentView('portal-intake')}
          className="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            <span>Customer DSAR Portal</span>
          </div>
          <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1 rounded">/request</span>
        </button>

        {/* Demo Script & Reset row */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            onClick={onOpenDemoTour}
            className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Demo Guide</span>
          </button>

          <button
            onClick={resetDemoData}
            className="py-1.5 px-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 text-[11px] font-medium flex items-center justify-center transition-all cursor-pointer"
            title="Reset All Demo Changes to Fresh State"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
