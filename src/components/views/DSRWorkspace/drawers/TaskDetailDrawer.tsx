import React, { useState } from 'react';
import { DepartmentTask, DSRCase } from '../../../../types/dsr';
import { useDSR } from '../../../../context/DSRContext';
import { 
  X, 
  CheckSquare, 
  UploadCloud, 
  FileText, 
  User, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Paperclip
} from 'lucide-react';

interface TaskDetailDrawerProps {
  task: DepartmentTask | null;
  dsrCase: DSRCase;
  onClose: () => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ task, dsrCase, onClose }) => {
  const { completeTask } = useDSR();
  const [submissionNotes, setSubmissionNotes] = useState(task?.submittedNotes || '');
  const [isUploading, setIsUploading] = useState(false);
  const [mockFiles, setMockFiles] = useState<string[]>(task?.evidenceFiles || []);

  if (!task) return null;

  const handleMockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const generatedFile = `${task.processName.replace(/\s+/g, '_')}_Evidence_Extract_${Date.now().toString().slice(-4)}.pdf`;
      setMockFiles(prev => [...prev, generatedFile]);
      setIsUploading(false);
    }, 600);
  };

  const handleSubmit = () => {
    completeTask(dsrCase.id, task.id, submissionNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {dsrCase.id}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  DEPARTMENT DATA TASK
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{task.title}</h3>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Requester & Process Context Box */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Data Principal (Requester)</p>
              <p className="font-bold text-slate-900 mt-0.5">{dsrCase.requesterName}</p>
              <p className="text-[11px] text-slate-500">{dsrCase.persona} • {dsrCase.requesterEmail}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Target Business Process</p>
              <p className="font-bold text-blue-700 mt-0.5">{task.processName}</p>
              <p className="text-[11px] text-slate-500">{task.department}</p>
            </div>
          </div>

          {/* Status & Assignee Info */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center space-x-2.5">
              <User className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-bold text-slate-900">{task.owner}</p>
                <p className="text-[10px] text-slate-500">{task.ownerEmail}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-medium">Due Date</p>
                <p className="font-bold text-slate-800 font-mono">{task.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Data Required Checklist */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              Data Elements Required from {task.department}
            </p>
            <div className="space-y-1.5 pt-1">
              {task.dataRequired.map((req, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-800 font-semibold">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <p className="text-[10px] font-bold uppercase text-slate-500">Instructions for Department Owner</p>
            <p className="text-slate-700 leading-relaxed italic">"{task.instructions}"</p>
          </div>

          {/* Evidence Upload Area */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-slate-500">Evidence & System Extracts</p>
            
            <div 
              onClick={handleMockUpload}
              className="p-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 transition-all text-center cursor-pointer space-y-1.5"
            >
              <UploadCloud className="w-6 h-6 text-blue-600 mx-auto" />
              <p className="text-xs font-bold text-slate-800">
                {isUploading ? 'Ingesting Mock Evidence Extract...' : 'Click to Upload Department Evidence / System Extract'}
              </p>
              <p className="text-[10px] text-slate-500">Accepts CSV, PDF, JSON, ZIP extracts from source application</p>
            </div>

            {/* Uploaded files list */}
            {mockFiles.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {mockFiles.map((file, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-mono text-slate-800 text-[11px] font-semibold">{file}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      Linked to Evidence Bank
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Notes input */}
          <div className="space-y-1.5 text-xs">
            <label className="text-[10px] font-bold uppercase text-slate-500">Department Submission Notes</label>
            <textarea
              rows={2}
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="e.g. Exported from production system. Verified all active sub-accounts."
              className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Data & Complete Task</span>
          </button>
        </div>

      </div>
    </div>
  );
};
