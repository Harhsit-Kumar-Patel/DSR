import React, { useState } from 'react';
import { useDSR } from '../../context/DSRContext';
import { 
  Search, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

interface HeaderProps {
  onOpenDemoTour: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDemoTour }) => {
  const { 
    currentView, 
    setCurrentView, 
    selectedDsrId, 
    selectedDSR, 
    dsrCases, 
    navigateToDSR, 
    toastMessage, 
    toastType 
  } = useDSR();

  const [searchQuery, setSearchQuery] = useState('');

  const pdiConflictDSR = dsrCases.find(c => c.pdiConflict?.status === 'Detected');

  const filteredQuickDSRs = searchQuery.trim() === '' 
    ? [] 
    : dsrCases.filter(c => 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.requesterName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <span className="text-slate-400">DSAR Operations</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        {currentView === 'overview' && (
          <span className="text-slate-900 font-bold">Overview</span>
        )}
        {currentView === 'dsr-list' && (
          <span className="text-slate-900 font-bold">DSAR Inbox</span>
        )}
        {currentView === 'dsr-workspace' && (
          <div className="flex items-center space-x-1.5">
            <button 
              onClick={() => setCurrentView('dsr-list')} 
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              DSAR Inbox
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-blue-700 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              {selectedDsrId}
            </span>
            <span className="text-slate-600 font-medium">({selectedDSR?.requesterName})</span>
          </div>
        )}
        {currentView === 'grievances' && (
          <span className="text-slate-900 font-bold">Grievance Workspace</span>
        )}
        {currentView === 'gap-analysis' && (
          <span className="text-slate-900 font-bold">Connected Module: Gap Analysis</span>
        )}
        {currentView === 'pdi-catalog' && (
          <span className="text-slate-900 font-bold">Connected Module: Personal Data Inventory (PDI)</span>
        )}
      </div>

      {/* Center Toast Banner */}
      {toastMessage && (
        <div className={`hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
          toastType === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
          toastType === 'warning' ? 'bg-amber-50 border border-amber-200 text-amber-800' :
          toastType === 'info' ? 'bg-blue-50 border border-blue-200 text-blue-800' :
          'bg-slate-100 border border-slate-200 text-slate-800'
        }`}>
          {toastType === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          {toastType === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Right side controls */}
      <div className="flex items-center space-x-3.5">
        
        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white rounded-lg px-2.5 py-1.5 w-52 lg:w-60 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search DSARs, requesters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full"
            />
          </div>

          {/* Quick search popup results */}
          {filteredQuickDSRs.length > 0 && (
            <div className="absolute top-full mt-1.5 right-0 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-2 z-50 space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Matching DSAR Cases</p>
              {filteredQuickDSRs.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => {
                    navigateToDSR(c.id, 'overview');
                    setSearchQuery('');
                  }}
                  className="p-2 hover:bg-blue-50 rounded-md cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900">{c.requesterName} <span className="font-mono text-blue-600 font-semibold text-[11px]">({c.id})</span></p>
                    <p className="text-[11px] text-slate-500">Right of Access • {c.persona}</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold">
                    {c.currentStage}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conflict Alert Pill */}
        {pdiConflictDSR && (
          <button
            onClick={() => navigateToDSR('DSR-1024', 'discovery')}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer"
            title="PDI Data Map Conflict Discovered in DSR-1024"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden sm:inline">1 PDI Conflict</span>
          </button>
        )}

        {/* Demo Tour Button */}
        <button
          onClick={onOpenDemoTour}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Demo Guide</span>
        </button>

        {/* User Persona Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
            HP
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">Harshit Patel</p>
            <p className="text-[11px] text-blue-600 leading-tight font-medium">Dutro Consultant</p>
          </div>
        </div>

      </div>
    </header>
  );
};
