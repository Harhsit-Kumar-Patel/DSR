import React, { useState } from 'react';
import { 
  Sliders, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface SLARuleConfig {
  id: string;
  category: string;
  statute: string;
  durationDays: number;
  durationType: 'Calendar Days' | 'Business Days';
  warningThresholdDays: number;
  escalationLevel: string;
}

export const SLAConfigTab: React.FC = () => {
  const [slaRules, setSlaRules] = useState<SLARuleConfig[]>([
    {
      id: 'SLA-01',
      category: 'Right of Access (DSAR)',
      statute: 'DPDP Act 2023 Sec. 11 / GDPR Art. 15',
      durationDays: 30,
      durationType: 'Calendar Days',
      warningThresholdDays: 3,
      escalationLevel: 'Privacy Officer & Legal Lead'
    },
    {
      id: 'SLA-02',
      category: 'Right to Erasure / Deletion',
      statute: 'DPDP Act 2023 Sec. 12 / GDPR Art. 17',
      durationDays: 30,
      durationType: 'Calendar Days',
      warningThresholdDays: 3,
      escalationLevel: 'Compliance Officer & IT Lead'
    },
    {
      id: 'SLA-03',
      category: 'Right to Rectification / Correction',
      statute: 'DPDP Act 2023 Sec. 12',
      durationDays: 30,
      durationType: 'Calendar Days',
      warningThresholdDays: 3,
      escalationLevel: 'Support Team Lead'
    },
    {
      id: 'SLA-04',
      category: 'Consent Revocation / Opt-Out',
      statute: 'DPDP Act 2023 Sec. 6(4)',
      durationDays: 15,
      durationType: 'Calendar Days',
      warningThresholdDays: 2,
      escalationLevel: 'Marketing Operations Lead'
    },
    {
      id: 'SLA-05',
      category: 'Data Portability (Export)',
      statute: 'GDPR Art. 20 / DPDP Machine Readable',
      durationDays: 30,
      durationType: 'Calendar Days',
      warningThresholdDays: 3,
      escalationLevel: 'IT & Security Lead'
    },
    {
      id: 'SLA-06',
      category: 'Data Principal Grievance Redressal',
      statute: 'DPDP Act 2023 Sec. 13',
      durationDays: 15,
      durationType: 'Calendar Days',
      warningThresholdDays: 2,
      escalationLevel: 'Senior Privacy Counsel / DPO'
    }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateDuration = (ruleId: string, days: number) => {
    setSlaRules(prev => prev.map(r => r.id === ruleId ? { ...r, durationDays: days } : r));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-xs animate-fade-in">
      
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              STATUTORY DEADLINES ENGINE
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-700">DPDP Act 2023 &amp; GDPR Rules</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Configure statutory deadline rules, real-time live clock countdown parameters, and escalation warning thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save SLA Rules</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>SLA configurations saved and applied across all active live clocks.</span>
        </div>
      )}

      {/* SLA Rules Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Rule ID</th>
              <th className="py-3 px-4">Request Category</th>
              <th className="py-3 px-4">Statutory Basis</th>
              <th className="py-3 px-4">Statutory SLA</th>
              <th className="py-3 px-4">Counting Type</th>
              <th className="py-3 px-4">Warning Threshold</th>
              <th className="py-3 px-4">Escalation Recipient</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {slaRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-blue-700">{rule.id}</td>
                <td className="py-3 px-4 font-bold text-slate-800">{rule.category}</td>
                <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{rule.statute}</td>
                
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={rule.durationDays}
                      onChange={(e) => handleUpdateDuration(rule.id, parseInt(e.target.value) || 30)}
                      className="w-16 px-2 py-1 rounded border border-slate-300 text-xs font-mono font-bold text-slate-800 bg-white"
                    />
                    <span className="text-slate-500">Days</span>
                  </div>
                </td>

                <td className="py-3 px-4 text-slate-600 font-medium">{rule.durationType}</td>
                
                <td className="py-3 px-4">
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono text-[11px] font-bold">
                    ≤ {rule.warningThresholdDays} Days (Due Soon)
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-700">{rule.escalationLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
