import React, { useState, useMemo } from 'react';
import { ClientTask, PrivacyRequest, PlatformUser, RedactionReviewState } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  Database, 
  Search, 
  Filter, 
  ShieldCheck, 
  FileCheck, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  ExternalLink, 
  Shield, 
  Plus, 
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  UserCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { RedactionReviewSection } from './DSRWorkspace/RedactionReviewSection';
import { LiveSLABadge } from '../ui/LiveSLABadge';
import { CreateTaskModal } from '../CreateTaskModal';

interface MyTasksViewProps {
  tasks: ClientTask[];
  requests: PrivacyRequest[];
  currentUser: PlatformUser;
  onSelectRequest: (id: string) => void;
  onTaskComplete: (taskId: string) => void;
  onUpdateTaskRedaction: (taskId: string, redactionState: RedactionReviewState) => void;
  onUpdateTaskDataFound?: (taskId: string, status: 'Data Found' | 'No Data Found' | 'Unable to Determine') => void;
  onCreateTask?: (taskData: Omit<ClientTask, 'id'>) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({
  tasks,
  requests,
  currentUser,
  onSelectRequest,
  onTaskComplete,
  onUpdateTaskRedaction,
  onUpdateTaskDataFound,
  onCreateTask,
  onDeleteTask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState<'my' | 'all'>('my');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTaskIdForDetails, setSelectedTaskIdForDetails] = useState<string | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  // Editable comment & evidence states per task
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});
  const [taskEvidence, setTaskEvidence] = useState<Record<string, string>>({});

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Assignee / My filter
      if (assigneeFilter === 'my') {
        const matchesName = task.assignedPerson.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]);
        const matchesDept = currentUser.department && task.department.toLowerCase().includes(currentUser.department.toLowerCase());
        const isDutroConsultantOrPrivacyOfficer = currentUser.role === 'Privacy Officer' || currentUser.role === 'Dutro Consultant';
        
        if (!isDutroConsultantOrPrivacyOfficer && !matchesName && !matchesDept) {
          return false;
        }
      }

      // Department filter
      if (departmentFilter !== 'ALL' && task.department !== departmentFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'IN_PROGRESS' && task.status === 'Completed') return false;
      if (statusFilter === 'COMPLETED' && task.status !== 'Completed') return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          task.id.toLowerCase().includes(q) ||
          task.processName.toLowerCase().includes(q) ||
          task.sourceSystem.toLowerCase().includes(q) ||
          task.customerName.toLowerCase().includes(q) ||
          task.department.toLowerCase().includes(q) ||
          task.dsrId.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [tasks, assigneeFilter, departmentFilter, statusFilter, searchQuery, currentUser]);

  const departments = Array.from(new Set(tasks.map(t => t.department)));

  const handleDataFoundClick = (taskId: string, val: 'Data Found' | 'No Data Found' | 'Unable to Determine') => {
    if (onUpdateTaskDataFound) {
      onUpdateTaskDataFound(taskId, val);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              OPERATIONAL WORKSPACE
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-blue-700 font-semibold">Client Department Tasks</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Client Tasks &amp; Department Data Retrieval
          </h1>
          <p className="text-xs text-slate-500">
            All client teams work inside the same Dutro dashboard. Check assigned systems, record data found/not found results, and perform redaction &amp; disclosure reviews.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {onCreateTask && (
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Role-context notice */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            {currentUser.avatarInitials}
          </div>
          <div>
            <span className="text-blue-950 font-bold">
              Logged in as {currentUser.name} ({currentUser.roleTitle})
            </span>
            <p className="text-[11px] text-blue-700">
              {currentUser.role === 'Operations Team' 
                ? 'Viewing tasks assigned to Customer Support & Operations. You can locate customer data, mark Data Found, and review redactions.'
                : 'Full visibility across all client departments and DSR task queues.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-white border border-blue-200 rounded-lg p-1 text-xs font-semibold">
          <button
            onClick={() => setAssigneeFilter('my')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              assigneeFilter === 'my' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Assigned Tasks
          </button>
          <button
            onClick={() => setAssigneeFilter('all')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              assigneeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Client Tasks ({tasks.length})
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by task ID, process, system, customer, or DSR..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none font-medium cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none font-medium cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress / Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid / List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No tasks match the active filters.</p>
            <p className="text-xs text-slate-400">Try switching to "All Client Tasks" or clearing search criteria.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const linkedReq = requests.find(r => r.id === task.dsrId);
            const isDetailsExpanded = selectedTaskIdForDetails === task.id;

            return (
              <div 
                key={task.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs space-y-4 ${
                  isCompleted ? 'border-slate-200 bg-slate-50/50' : 'border-blue-200/80 hover:border-blue-300 shadow-sm'
                }`}
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
                      {task.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => onSelectRequest(task.dsrId)}
                      className="font-mono text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Linked Case: {task.dsrId}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-600 font-medium">
                      Requester: <strong className="text-slate-900">{task.customerName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}>
                      {isCompleted ? '✓ Completed' : 'In Progress'}
                    </span>

                    {linkedReq && (
                      <LiveSLABadge 
                        deadlineTimestamp={linkedReq.slaDeadlineTimestamp}
                        startTimestamp={linkedReq.slaStartTimestamp}
                        isCompleted={isCompleted}
                        size="sm"
                      />
                    )}
                  </div>
                </div>

                {/* Main Task Description & Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Process &amp; System
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{task.processName}</h3>
                    <p className="text-slate-500 font-mono text-[11px] flex items-center space-x-1">
                      <Database className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.sourceSystem}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Assigned Department &amp; Owner
                    </span>
                    <p className="font-semibold text-slate-800">{task.department}</p>
                    <p className="text-slate-500">{task.assignedPerson} ({task.assignedRole})</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Due Date &amp; Evidence
                    </span>
                    <p className="text-slate-700 font-medium flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.dueDate}</span>
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      Ref: {task.evidenceRef || 'Pending assignment'}
                    </p>
                  </div>
                </div>

                {/* Data Requested Elements Pill Tags */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Data Elements to Locate &amp; Extract:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {task.dataRequested.map((elem, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                        ✓ {elem}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Operational Task Actions Bar (Data Found, Redaction Review, Mark Complete) */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Data Found Radio Buttons */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Status Result:</span>
                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                      {(['Data Found', 'No Data Found', 'Unable to Determine'] as const).map((result) => {
                        const isSelected = (task.dataFoundStatus || 'Data Found') === result;
                        return (
                          <button
                            key={result}
                            type="button"
                            onClick={() => handleDataFoundClick(task.id, result)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? result === 'Data Found'
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : result === 'No Data Found'
                                  ? 'bg-slate-800 text-white shadow-2xs'
                                  : 'bg-amber-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {result}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Redaction Review & Complete Actions */}
                  <div className="flex items-center space-x-2">
                    
                    {/* Redaction Review Drawer Toggle */}
                    <button
                      type="button"
                      onClick={() => setSelectedTaskIdForDetails(isDetailsExpanded ? null : task.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        task.redactionReview?.status === 'NO REDACTION REQUIRED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : task.redactionReview?.status === 'REDACTION REQUIRED'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-blue-50 text-blue-800 border-blue-300'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Redaction: {task.redactionReview?.status || 'NO REDACTION REQUIRED'}</span>
                    </button>

                    {/* Mark Task Complete Button */}
                    {!isCompleted ? (
                      <button
                        type="button"
                        onClick={() => onTaskComplete(task.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Complete Task</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed on {task.completedAt?.split(',')[0] || '28 Sep 2026'}</span>
                      </span>
                    )}

                  </div>
                </div>

                {/* Inline Redaction Review Expansion if toggled */}
                {isDetailsExpanded && (
                  <div className="pt-3 border-t border-slate-200 animate-fade-in space-y-3">
                    <RedactionReviewSection
                      task={task}
                      onUpdateRedactionReview={(tId, updated) => onUpdateTaskRedaction(tId, updated)}
                    />
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Modal for creating custom task */}
      {isCreateTaskModalOpen && onCreateTask && (
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onCreateTask={onCreateTask}
          dsrId={requests[0]?.id || 'DSR-2001'}
          customerName={requests[0]?.personName || 'Rohan Mehta'}
          customerEmail={requests[0]?.email || 'rohan.mehta@example.com'}
        />
      )}

    </div>
  );
};
