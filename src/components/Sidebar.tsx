import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard,
  Inbox,
  MessageSquareWarning,
  Settings,
  RotateCcw,
  Sparkles,
  ChevronRight,
  UserCheck,
  FileText
} from 'lucide-react';
import { MASTER_CLIENT } from '../mockData/initialData';
import { DSRWorkspaceFilter, MainNavigationSection, PlatformUser } from '../types';

interface SidebarProps {
  currentMainView: MainNavigationSection;
  activeFilterTab: DSRWorkspaceFilter;
  currentUser: PlatformUser;
  onNavigateToSection: (section: MainNavigationSection, filterTab?: DSRWorkspaceFilter) => void;
  onNavigateToSettingsTab: (settingsSubTab: string) => void;
  onOpenCustomerIntakeModal: () => void;
  onOpenDemoRequest: () => void;
  onResetDemo: () => void;
  onOpenFlowModal?: () => void;
  counts?: {
    inbox: number;
    myTasks: number;
    pendingVerification: number;
    pendingClientAction: number;
    completed: number;
    grievances: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentMainView, 
  onNavigateToSection,
  onOpenCustomerIntakeModal,
  onOpenDemoRequest,
  onResetDemo,
  counts = { inbox: 2, myTasks: 1, pendingVerification: 0, pendingClientAction: 1, completed: 1, grievances: 1 }
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen shrink-0 select-none shadow-xs">
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Platform Branding */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group" 
            onClick={() => onNavigateToSection('overview')}
            title="Dutro DSR Overview Dashboard"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs font-bold text-sm group-hover:bg-blue-700 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base text-slate-900 tracking-tight">DUTRO</span>
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                  DSR
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">Privacy Operations Platform</p>
            </div>
          </div>
        </div>

        {/* Tenant Entity Indicator */}
        <div className="px-3.5 py-2 mx-3 mt-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="truncate">
            <span className="text-[9px] uppercase font-semibold text-slate-400 block tracking-wider">Client Entity</span>
            <span className="text-xs font-bold text-slate-800 truncate block">{MASTER_CLIENT.name}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            {MASTER_CLIENT.id}
          </span>
        </div>

        {/* Core Navigation Items */}
        <div className="p-3 space-y-1.5 overflow-y-auto flex-1 custom-scroll mt-2">
          
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Core Operations
            </span>
          </div>

          {/* 1. Overview Dashboard */}
          <button
            onClick={() => onNavigateToSection('overview')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentMainView === 'overview'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600/30'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              currentMainView === 'overview'
                ? 'bg-blue-700 text-white'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {counts.inbox}
            </span>
          </button>

          {/* 2. DSR Requests Workspace */}
          <button
            onClick={() => onNavigateToSection('workspace', 'inbox')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentMainView === 'workspace' || currentMainView === 'details'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600/30'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Inbox className="w-4 h-4" />
              <span>DSR Requests</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              currentMainView === 'workspace' || currentMainView === 'details'
                ? 'bg-blue-700 text-white'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {counts.inbox}
            </span>
          </button>

          {/* 3. Grievance Redressal */}
          <button
            onClick={() => onNavigateToSection('grievances')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentMainView === 'grievances'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-600/30'
                : 'text-slate-700 hover:bg-amber-50 hover:text-amber-950'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <MessageSquareWarning className={`w-4 h-4 ${currentMainView === 'grievances' ? 'text-white' : 'text-amber-600'}`} />
              <span>Grievances</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              currentMainView === 'grievances'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-100 text-amber-900 border border-amber-200'
            }`}>
              {counts.grievances}
            </span>
          </button>

          {/* 4. Audit Trail */}
          <button
            onClick={() => onNavigateToSection('audit-trail')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentMainView === 'audit-trail'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FileText className="w-4 h-4" />
              <span>Audit Trail</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              currentMainView === 'audit-trail'
                ? 'bg-blue-700 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}>
              Live
            </span>
          </button>

          {/* 5. Settings */}
          <button
            onClick={() => onNavigateToSection('settings')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentMainView === 'settings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </button>

        </div>
      </div>

      {/* Demonstration & Quick Action Section */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/80 space-y-2 shrink-0">
        
        {/* Customer Registration & 2FA Flow Modal */}
        <button
          onClick={onOpenCustomerIntakeModal}
          className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-[0.99]"
        >
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Customer 2FA Intake Flow</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Quick jump to Rohan Mehta showcase demo case */}
        <button
          onClick={onOpenDemoRequest}
          className="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between group transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Demo: Rohan (DSR-2001)</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Reset Demo State Button */}
        <button
          onClick={onResetDemo}
          className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-700 text-[11px] font-semibold transition-colors cursor-pointer"
          title="Reset database back to the 2 clean test cases"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Database</span>
        </button>

      </div>
    </aside>
  );
};
