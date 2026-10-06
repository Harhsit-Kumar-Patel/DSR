import React, { useState } from 'react';
import { DSRCase, DepartmentTask } from '../../../types/dsr';
import { useDSR } from '../../../context/DSRContext';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  Send, 
  Eye, 
  User, 
  Building2, 
  Paperclip, 
  Calendar, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TaskDetailDrawer } from './drawers/TaskDetailDrawer';

interface TasksTabProps {
  dsrCase: DSRCase;
  onNavigateTab: (tab: 'data' | 'review') => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({ dsrCase, onNavigateTab }) => {
  const { completeTask, showToast } = useDSR();
  const [selectedTask, setSelectedTask] = useState<DepartmentTask | null>(null);

  const completedCount = dsrCase.tasks.filter(t => t.status === 'Completed').length;
  const totalCount = dsrCase.tasks.length;

  const handleSendReminder = (task: DepartmentTask, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`Urgent SLA reminder notification dispatched to ${task.owner} (${task.ownerEmail})`, 'info');
  };

  const handleQuickComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    completeTask(dsrCase.id, taskId);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Progress Bar Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Department Data Retrieval Tasks
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted data element extraction tasks orchestrated across enterprise departments.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-xl">
              {completedCount} of {totalCount} Tasks Completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <div 
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / Math.max(1, totalCount)) * 100}%` }}
          />
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3.5">
        {dsrCase.tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group space-y-4 shadow-sm ${
              task.status === 'Completed'
                ? 'bg-white border-slate-200 hover:border-slate-300'
                : 'bg-white border-blue-200 hover:border-blue-400 ring-1 ring-blue-50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              
              <div className="flex items-start space-x-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  task.status === 'Completed' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {task.status === 'Completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {task.department}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-sans italic">
                    "{task.instructions}"
                  </p>
                  
                  {task.submittedNotes && (
                    <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                      ✓ Ingestion Note: {task.submittedNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Badge & Due Date */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                  task.status === 'Completed' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {task.status}
                </span>

                <span className="text-[11px] font-mono text-slate-500">
                  {task.status === 'Completed' ? `Done: ${task.completedDate?.split(' ')[0]}` : `Due: ${task.dueDate}`}
                </span>
              </div>
            </div>

            {/* Bottom Row: Assignee, Data checklist, Action buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              
              <div className="flex flex-wrap items-center gap-3 text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  {task.owner} ({task.ownerEmail})
                </span>

                {task.evidenceId && (
                  <span className="flex items-center gap-1 font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-semibold">
                    <Paperclip className="w-3 h-3" /> {task.evidenceId}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {task.status !== 'Completed' && (
                  <>
                    <button
                      onClick={(e) => handleSendReminder(task, e)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-600" />
                      <span>Send Reminder</span>
                    </button>

                    <button
                      onClick={(e) => handleQuickComplete(task.id, e)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>1-Click Submit Data</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedTask(task)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Task Detail</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        dsrCase={dsrCase}
        onClose={() => setSelectedTask(null)}
      />

    </div>
  );
};
