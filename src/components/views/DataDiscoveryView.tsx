import React, { useState } from 'react';
import { PrivacyRequest, ClientTask, BusinessProcess, BasicLocationCheckItem } from '../../types';
import { 
  Database, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ArrowRight, 
  Server, 
  ShieldCheck, 
  Layers, 
  Play, 
  Check, 
  Plus, 
  RotateCcw,
  ExternalLink,
  Shield,
  FileCheck
} from 'lucide-react';
import { 
  MASTER_BUSINESS_PROCESSES, 
  INITIAL_BASIC_LOCATION_CHECKS, 
  MASTER_CLIENT 
} from '../../mockData/initialData';
import { BasicDataLocationCheck } from './DSRWorkspace/BasicDataLocationCheck';

interface DataDiscoveryViewProps {
  requests: PrivacyRequest[];
  tasks: ClientTask[];
  selectedRequest?: PrivacyRequest;
  onSelectRequest: (id: string) => void;
  onStartTaskForProcess?: (process: BusinessProcess) => void;
  onStartAllRemainingTasks?: (processes: BusinessProcess[]) => void;
}

export const DataDiscoveryView: React.FC<DataDiscoveryViewProps> = ({
  requests,
  tasks,
  selectedRequest,
  onSelectRequest,
  onStartTaskForProcess,
  onStartAllRemainingTasks
}) => {
  const currentReq = selectedRequest || requests[0];
  const [dataMapAvailable, setDataMapAvailable] = useState<boolean>(true);
  const [localChecks, setLocalChecks] = useState<BasicLocationCheckItem[]>(INITIAL_BASIC_LOCATION_CHECKS);
  const [filterDept, setFilterDept] = useState<string>('ALL');

  // Match processes with tasks
  const processesWithTaskStatus = MASTER_BUSINESS_PROCESSES.map((proc) => {
    const task = tasks.find(
      t => t.dsrId === currentReq?.id && (t.processName === proc.name || t.id === proc.taskId || t.sourceSystem === proc.source)
    );
    return {
      process: proc,
      task: task,
      isStarted: Boolean(task),
      isCompleted: task?.status === 'Completed'
    };
  });

  const unstartedProcesses = processesWithTaskStatus.filter(p => !p.isStarted).map(p => p.process);

  const handleUpdateCheck = (checkId: string, updated: Partial<BasicLocationCheckItem>) => {
    setLocalChecks(prev => prev.map(c => c.id === checkId ? { ...c, ...updated } : c));
  };

  const handleAddCheck = (newItem: Omit<BasicLocationCheckItem, 'id'>) => {
    const newCheck: BasicLocationCheckItem = {
      id: `loc-${localChecks.length + 1}`,
      ...newItem
    };
    setLocalChecks(prev => [...prev, newCheck]);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              DATA DISCOVERY ENGINE
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-blue-700 font-semibold">Flexible RoPA &amp; Location Architecture</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Data Discovery &amp; Systems Mapping
          </h1>
          <p className="text-xs text-slate-500">
            Dutro coordinates the discovery and task generation process without needing direct database access to client raw customer databases.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-semibold text-slate-600 mr-1">Active Case:</span>
          <select
            value={currentReq?.id}
            onChange={(e) => onSelectRequest(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-blue-700 focus:outline-none cursor-pointer"
          >
            {requests.map(r => (
              <option key={r.id} value={r.id}>{r.id} ({r.personName})</option>
            ))}
          </select>
        </div>
      </div>

      {/* "Data Map Available?" Selector Card (Section 8) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              DISCOVERY METHODOLOGY
            </span>
            <h3 className="text-sm font-bold text-slate-900">Does {MASTER_CLIENT.name} have a formal Data Map / RoPA?</h3>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setDataMapAvailable(true)}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                dataMapAvailable ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>YES: Use PDI / RoPA</span>
            </button>
            <button
              onClick={() => setDataMapAvailable(false)}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                !dataMapAvailable ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>NO: Basic Location Check</span>
            </button>
          </div>
        </div>

        {/* Informational Guidance Box */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 space-y-1">
          <div className="flex items-center space-x-2 font-bold text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>
              {dataMapAvailable 
                ? 'Pathway A: PDI/RoPA Automated Process Matching & Targeted Dispatch' 
                : 'Pathway B: Basic Data Location Check & Department Decentralized Verification'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            {dataMapAvailable
              ? 'Dutro maps the customer request against pre-indexed Records of Processing Activities (RoPA), identifies target business processes, and generates precise retrieval tasks directly to department leads.'
              : 'Dutro coordinates a checklist across standard client departments (CRM, Billing, Core DB, Support Desk, Marketing). Department owners verify their own systems and submit Data Found / Not Found results.'}
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PATH A: PDI / ROPA AVAILABLE */}
      {/* ========================================================= */}
      {dataMapAvailable ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Identified Business Processes &amp; Data Maps
              </h2>
              <p className="text-xs text-slate-500">
                Mapped against {MASTER_CLIENT.name} RoPA for {currentReq?.personName} ({currentReq?.type}).
              </p>
            </div>

            {unstartedProcesses.length > 0 && onStartAllRemainingTasks && (
              <button
                type="button"
                onClick={() => onStartAllRemainingTasks(MASTER_BUSINESS_PROCESSES)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Dispatch All Tasks ({unstartedProcesses.length} remaining)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {processesWithTaskStatus.map(({ process, task, isStarted, isCompleted }) => (
              <div 
                key={process.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isCompleted 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : isStarted 
                    ? 'bg-blue-50/40 border-blue-200' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 block">{process.id}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{process.name}</h3>
                    <p className="text-slate-500 text-[11px] font-mono">{process.source} · {process.department}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isCompleted 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : isStarted 
                      ? 'bg-blue-100 text-blue-800 border-blue-300' 
                      : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    {isCompleted ? '✓ Completed' : isStarted ? 'Task Dispatched' : 'Pending Start'}
                  </span>
                </div>

                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200/70 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Legal Basis:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[200px]">{process.legalBasis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Retention Period:</span>
                    <span className="font-mono text-slate-700">{process.retentionPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department Lead:</span>
                    <span className="font-semibold text-slate-800">{process.owner}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {process.dataFound.map((elem, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      ✓ {elem}
                    </span>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {task ? `Task: ${task.id}` : 'No task dispatched'}
                  </span>

                  {!isStarted && onStartTaskForProcess && (
                    <button
                      type="button"
                      onClick={() => onStartTaskForProcess(process)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Task</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* ========================================================= */
        /* PATH B: NO DATA MAP (BASIC DATA LOCATION CHECK) */
        /* ========================================================= */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-fade-in space-y-4">
          <BasicDataLocationCheck 
            locationChecks={localChecks}
            onUpdateLocationCheck={handleUpdateCheck}
            onAddLocationCheck={handleAddCheck}
          />
        </div>
      )}

    </div>
  );
};
