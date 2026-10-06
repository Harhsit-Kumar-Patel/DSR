import React from 'react';
import { useDSR, WorkspaceTab } from '../../../context/DSRContext';
import { 
  ArrowLeft, 
  Compass, 
  CheckSquare, 
  Database, 
  FileCheck, 
  Clock, 
  LayoutDashboard, 
  AlertTriangle, 
  ShieldCheck, 
  User, 
  Building2, 
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { OverviewTab } from './OverviewTab';
import { DiscoveryTab } from './DiscoveryTab';
import { TasksTab } from './TasksTab';
import { DataTab } from './DataTab';
import { ReviewTab } from './ReviewTab';
import { ActivityTab } from './ActivityTab';

export const DSRWorkspace: React.FC = () => {
  const { 
    selectedDSR, 
    activeWorkspaceTab, 
    setActiveWorkspaceTab, 
    setCurrentView 
  } = useDSR();

  if (!selectedDSR) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 m-6 shadow-sm">
        <p className="text-slate-700 font-semibold">No DSR Case Selected.</p>
        <button 
          onClick={() => setCurrentView('dsr-list')}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          Return to DSR Inbox
        </button>
      </div>
    );
  }

  const completedTasksCount = selectedDSR.tasks.filter(t => t.status === 'Completed').length;
  const totalTasksCount = selectedDSR.tasks.length;
  const hasPDIConflict = selectedDSR.pdiConflict?.status === 'Detected';

  const tabClass = (tab: WorkspaceTab) => `
    flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer select-none whitespace-nowrap
    ${activeWorkspaceTab === tab 
      ? 'border-blue-600 text-blue-600 bg-blue-50/70' 
      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }
  `;

  return (
    <div className="min-h-full flex flex-col bg-slate-50">
      
      {/* Case Workspace Header (Clean White Card) */}
      <div className="bg-white border-b border-slate-200 px-6 pt-5 pb-0 shadow-sm space-y-4">
        
        {/* Top Row: Back button, Case ID, Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setCurrentView('dsr-list')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200"
              title="Return to DSR Inbox"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <span className="font-mono text-base font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {selectedDSR.id}
                </span>
                <span className="text-slate-300">•</span>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  {selectedDSR.requesterName}
                </h1>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  {selectedDSR.requestType} Request
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-medium text-slate-700">{selectedDSR.persona}</span>
                <span className="text-slate-300">•</span>
                <span>{selectedDSR.legalEntity}</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-slate-500">Channel: <strong className="text-slate-700">{selectedDSR.channel}</strong></span>
              </p>
            </div>
          </div>

          {/* Right Status Badges & Quick Action */}
          <div className="flex items-center space-x-3">
            
            {/* Status Pill */}
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold font-mono inline-block ${
                selectedDSR.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                selectedDSR.status === 'Ready to Send' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                selectedDSR.status === 'Response Sent' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {selectedDSR.status}
              </span>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                SLA: <strong className="text-slate-800">{selectedDSR.slaDaysRemaining}d remaining</strong>
              </p>
            </div>

            {/* Quick action button based on tab */}
            {activeWorkspaceTab === 'discovery' && hasPDIConflict && (
              <button
                onClick={() => setActiveWorkspaceTab('discovery')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Resolve PDI Conflict</span>
              </button>
            )}

            {activeWorkspaceTab !== 'review' && (
              <button
                onClick={() => setActiveWorkspaceTab('review')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Jump to Review →</span>
              </button>
            )}
          </div>

        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center space-x-1 border-t border-slate-200 pt-1 overflow-x-auto custom-scroll">
          
          <button
            onClick={() => setActiveWorkspaceTab('overview')}
            className={tabClass('overview')}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('discovery')}
            className={tabClass('discovery')}
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Discovery (PDI RoPA)</span>
            {hasPDIConflict && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" title="PDI Conflict Detected" />
            )}
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('tasks')}
            className={tabClass('tasks')}
          >
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>Department Tasks</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
              {completedTasksCount}/{totalTasksCount}
            </span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('data')}
            className={tabClass('data')}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>Collected Data</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
              {selectedDSR.collectedData.length}
            </span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('review')}
            className={tabClass('review')}
          >
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Review & Redaction</span>
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('activity')}
            className={tabClass('activity')}
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Audit Activity</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {selectedDSR.activityTimeline.length}
            </span>
          </button>

        </div>

      </div>

      {/* Main Tab Content Body */}
      <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeWorkspaceTab === 'overview' && (
          <OverviewTab 
            dsrCase={selectedDSR} 
            onNavigateTab={setActiveWorkspaceTab} 
          />
        )}

        {activeWorkspaceTab === 'discovery' && (
          <DiscoveryTab 
            dsrCase={selectedDSR} 
            onNavigateTab={setActiveWorkspaceTab} 
          />
        )}

        {activeWorkspaceTab === 'tasks' && (
          <TasksTab 
            dsrCase={selectedDSR} 
            onNavigateTab={setActiveWorkspaceTab} 
          />
        )}

        {activeWorkspaceTab === 'data' && (
          <DataTab 
            dsrCase={selectedDSR} 
            onNavigateTab={setActiveWorkspaceTab} 
          />
        )}

        {activeWorkspaceTab === 'review' && (
          <ReviewTab 
            dsrCase={selectedDSR} 
            onNavigateTab={setActiveWorkspaceTab} 
          />
        )}

        {activeWorkspaceTab === 'activity' && (
          <ActivityTab 
            dsrCase={selectedDSR} 
          />
        )}
      </div>

    </div>
  );
};
