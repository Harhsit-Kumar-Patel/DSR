import React, { useState } from 'react';
import { X, Plus, Building2, CheckSquare, Sparkles, User, Database, FileText } from 'lucide-react';
import { ClientTask } from '../types';
import { MASTER_CLIENT } from '../mockData/initialData';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  dsrId: string;
  customerName: string;
  customerEmail: string;
  onCreateTask: (taskData: Omit<ClientTask, 'id'>) => void;
}

const PRESETS = [
  {
    name: 'KYC & AML Operations',
    department: 'Risk & Compliance',
    assignedTeam: 'AML & Compliance Team',
    assignedPerson: 'Arjun Gupta',
    assignedRole: 'Compliance Analyst',
    sourceSystem: 'Client Compliance System',
    dataRequested: ['KYC verification documents', 'Identity proof records', 'AML audit check logs', 'Biometric enrollment metadata']
  },
  {
    name: 'Wealth Management & Demat',
    department: 'Investments & Wealth',
    assignedTeam: 'Wealth Advisory Operations',
    assignedPerson: 'Meera Desai',
    assignedRole: 'Wealth Operations Manager',
    sourceSystem: 'Client Core Enterprise DB',
    dataRequested: ['Demat holding statements', 'Mutual fund investment history', 'Risk profiling questionnaire responses']
  },
  {
    name: 'Retail Lending & Mortgages',
    department: 'Credit & Loans',
    assignedTeam: 'Lending Operations',
    assignedPerson: 'Siddharth Joshi',
    assignedRole: 'Credit Underwriter',
    sourceSystem: 'Client Operations Engine',
    dataRequested: ['Loan application forms', 'Credit appraisal memos', 'CIBIL credit inquiry logs', 'Collateral registry records']
  }
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  dsrId,
  customerName,
  customerEmail,
  onCreateTask
}) => {
  if (!isOpen) return null;

  const [processName, setProcessName] = useState('KYC & AML Operations');
  const [department, setDepartment] = useState('Risk & Compliance');
  const [assignedTeam, setAssignedTeam] = useState('AML & Compliance Team');
  const [assignedPerson, setAssignedPerson] = useState('Arjun Gupta');
  const [assignedRole, setAssignedRole] = useState('Compliance Analyst');
  const [sourceSystem, setSourceSystem] = useState('Client Compliance System');
  const [dataRequestedText, setDataRequestedText] = useState(
    'KYC verification documents, Identity proof records, AML audit check logs'
  );
  const [dueDate, setDueDate] = useState('28 October 2026');

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setProcessName(preset.name);
    setDepartment(preset.department);
    setAssignedTeam(preset.assignedTeam);
    setAssignedPerson(preset.assignedPerson);
    setAssignedRole(preset.assignedRole);
    setSourceSystem(preset.sourceSystem);
    setDataRequestedText(preset.dataRequested.join(', '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processName.trim()) return;

    const dataArray = dataRequestedText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onCreateTask({
      dsrId,
      customerName,
      customerEmail,
      processName: processName.trim(),
      department: department.trim() || 'Internal Operations',
      assignedTeam: assignedTeam.trim() || `${MASTER_CLIENT.name} Operations`,
      assignedPerson: assignedPerson.trim() || 'Operations Lead',
      assignedRole: assignedRole.trim() || 'Department Member',
      sourceSystem: sourceSystem.trim() || `${MASTER_CLIENT.name} Internal Database`,
      dataRequested: dataArray.length > 0 ? dataArray : ['Customer departmental records'],
      status: 'Waiting for client action',
      dueDate: dueDate.trim() || '28 October 2026',
      dispatchedAt: '28 September 2026, 18:25 IST'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-none">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm tracking-tight">CREATE DEPARTMENT TASK</h3>
                <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                  {dsrId}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dispatch internal data retrieval task to {MASTER_CLIENT.name} team
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scroll space-y-5 flex-1 text-xs text-slate-800">
          
          {/* Quick Presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Quick Department Templates:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    processName === preset.name
                      ? 'bg-blue-50 border-blue-400 text-blue-900 ring-1 ring-blue-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{preset.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">{preset.assignedTeam}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Process / Task Name *
              </label>
              <input
                type="text"
                required
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                placeholder="e.g. Loan & Credit Card Records"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Department / Function *
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Risk & AML"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Assigned Team *
              </label>
              <input
                type="text"
                required
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
                placeholder="e.g. AML Operations Team"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Assigned Team Member & Role *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={assignedPerson}
                  onChange={(e) => setAssignedPerson(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <input
                  type="text"
                  required
                  value={assignedRole}
                  onChange={(e) => setAssignedRole(e.target.value)}
                  placeholder="Role"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Internal Source System *
              </label>
              <input
                type="text"
                required
                value={sourceSystem}
                onChange={(e) => setSourceSystem(e.target.value)}
                placeholder="e.g. Client Compliance Core"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Task Due Date *
              </label>
              <input
                type="text"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">
              Personal Data Categories to Retrieve (Comma separated) *
            </label>
            <textarea
              required
              rows={2}
              value={dataRequestedText}
              onChange={(e) => setDataRequestedText(e.target.value)}
              placeholder="e.g. Customer KYC file, ID proof, Verification logs"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white custom-scroll"
            />
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-[11px] text-blue-900 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Data Boundary:</strong> This task will be dispatched to {MASTER_CLIENT.name}'s task portal for {assignedPerson}. Dutro tracks fulfillment status; retrieved personal data remains inside the client's boundary.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Dispatch Task to Department</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
