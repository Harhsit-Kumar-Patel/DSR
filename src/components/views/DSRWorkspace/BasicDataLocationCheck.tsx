import React, { useState } from 'react';
import { BasicLocationCheckItem } from '../../../types';
import { 
  Building2, 
  Database, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Plus, 
  Search, 
  Server, 
  Sparkles, 
  HelpCircle,
  FileText
} from 'lucide-react';

interface BasicDataLocationCheckProps {
  locationChecks: BasicLocationCheckItem[];
  onUpdateLocationCheck: (checkId: string, updated: Partial<BasicLocationCheckItem>) => void;
  onAddLocationCheck?: (newItem: Omit<BasicLocationCheckItem, 'id'>) => void;
  isReadOnly?: boolean;
}

export const BasicDataLocationCheck: React.FC<BasicDataLocationCheckProps> = ({
  locationChecks,
  onUpdateLocationCheck,
  onAddLocationCheck,
  isReadOnly = false
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSystem, setNewSystem] = useState('');
  const [newDept, setNewDept] = useState('Customer Support');
  const [newOwner, setNewOwner] = useState('');

  const handleToggleStatus = (item: BasicLocationCheckItem, targetStatus: BasicLocationCheckItem['status']) => {
    if (isReadOnly) return;
    onUpdateLocationCheck(item.id, {
      status: targetStatus,
      checkedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
    });
  };

  const handleAddNewCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSystem.trim() || !onAddLocationCheck) return;

    onAddLocationCheck({
      systemName: newSystem,
      department: newDept,
      owner: newOwner || `${newDept} Lead`,
      ownerEmail: `lead.${newDept.toLowerCase().replace(/\s+/g, '')}@client.example`,
      status: 'Pending',
      notes: 'Manually added department data check.'
    });

    setNewSystem('');
    setNewOwner('');
    setIsAddModalOpen(false);
  };

  const completedFound = locationChecks.filter(c => c.status === 'Completed — Data Found').length;
  const completedNotFound = locationChecks.filter(c => c.status === 'Completed — No Data Found').length;
  const pendingCount = locationChecks.filter(c => c.status === 'Pending' || c.status === 'In Progress').length;

  return (
    <div className="space-y-4 text-xs animate-fade-in">
      
      {/* Overview Banner for Path B */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              PATH B: BASIC DATA LOCATION CHECK
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-[11px] font-semibold text-slate-700">No RoPA / Data Map Required</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Dutro coordinates basic department data location checks. Client teams check their own systems and report Data Found or Not Found.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {completedFound} Data Found
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            {completedNotFound} No Data Found
          </span>
          {pendingCount > 0 && (
            <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              {pendingCount} Pending
            </span>
          )}
        </div>
      </div>

      {/* Systems Checklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-xs">
            Client Department Systems ({locationChecks.length})
          </span>

          {!isReadOnly && onAddLocationCheck && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Department System</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {locationChecks.map((item) => {
            const isFound = item.status === 'Completed — Data Found';
            const isNotFound = item.status === 'Completed — No Data Found';
            const isPending = item.status === 'Pending' || item.status === 'In Progress';

            return (
              <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/40 transition-colors">
                
                {/* System & Owner Info */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Server className="w-3.5 h-3.5 text-slate-500" />
                    <h4 className="font-bold text-slate-900 text-xs">{item.systemName}</h4>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {item.department}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Owner: <strong className="text-slate-700">{item.owner}</strong> ({item.ownerEmail})
                  </p>

                  {item.notes && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200/60 mt-1">
                      {item.notes}
                    </p>
                  )}

                  {item.checkedAt && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      Checked on: {item.checkedAt}
                    </p>
                  )}
                </div>

                {/* Status & Interactive Controls */}
                <div className="flex items-center space-x-2 shrink-0">
                  {!isReadOnly ? (
                    <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => handleToggleStatus(item, 'Completed — Data Found')}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                          isFound
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
                        }`}
                        title="Mark Data Found"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Data Found</span>
                      </button>

                      <button
                        onClick={() => handleToggleStatus(item, 'Completed — No Data Found')}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                          isNotFound
                            ? 'bg-slate-700 text-white shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                        title="Mark No Data Found"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>No Data Found</span>
                      </button>

                      {isPending && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded">
                          ● Pending Check
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      isFound ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      isNotFound ? 'bg-slate-50 text-slate-700 border-slate-200' :
                      'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Location Check Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Department Data Location Check</h3>
            
            <form onSubmit={handleAddNewCheck} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">System / Database Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Core CRM, Payment Gateway, Legacy HR"
                  value={newSystem}
                  onChange={(e) => setNewSystem(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Customer Support">Customer Support</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance Operations">Finance Operations</option>
                  <option value="Marketing Operations">Marketing Operations</option>
                  <option value="IT & Security Engineering">IT & Security Engineering</option>
                  <option value="Risk & Compliance">Risk & Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Responsible Owner Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Shah (Finance Lead)"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Add Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
