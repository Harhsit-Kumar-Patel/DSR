import React, { useState } from 'react';
import { CollectedDataRecord, DataTreatment } from '../../../../types/dsr';
import { useDSR } from '../../../../context/DSRContext';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  FileCheck, 
  HelpCircle, 
  Scale, 
  Edit3, 
  ArrowRight,
  Database,
  GitBranch,
  UserCheck
} from 'lucide-react';

interface DecisionDetailsDrawerProps {
  record: CollectedDataRecord | null;
  onClose: () => void;
}

export const DecisionDetailsDrawer: React.FC<DecisionDetailsDrawerProps> = ({ record, onClose }) => {
  const { updateDataTreatment, approveDecision, selectedDSR } = useDSR();
  
  const [isChangingDecision, setIsChangingDecision] = useState(false);
  const [newTreatment, setNewTreatment] = useState<DataTreatment>(record?.proposedTreatment || 'DISCLOSE');
  const [newReason, setNewReason] = useState(record?.decisionReason || '');
  const [reviewerNotes, setReviewerNotes] = useState(record?.reviewNotes || '');

  if (!record) return null;

  const handleApprove = () => {
    approveDecision(selectedDSR.id, record.id);
    onClose();
  };

  const handleSaveChange = () => {
    updateDataTreatment(selectedDSR.id, record.id, newTreatment, newReason, reviewerNotes);
    setIsChangingDecision(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                  EXPLAINABLE REDACTION DECISION ("WHY?")
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{record.fieldName}</h3>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Decision Pill Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Treatment Classification</p>
              <p className="text-lg font-bold font-mono mt-0.5 flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-sm ${
                  record.proposedTreatment === 'DISCLOSE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                  record.proposedTreatment === 'REDACT' ? 'bg-amber-50 text-amber-900 border border-amber-300' :
                  record.proposedTreatment === 'EXCLUDE' ? 'bg-purple-50 text-purple-900 border border-purple-200' :
                  'bg-yellow-50 text-yellow-900 border border-yellow-300'
                }`}>
                  {record.proposedTreatment}
                </span>
                {record.isHumanReviewed ? (
                  <span className="text-xs font-sans text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed & Approved
                  </span>
                ) : (
                  <span className="text-xs font-sans text-amber-800 font-semibold flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Human Review Recommended
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={() => setIsChangingDecision(!isChangingDecision)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>{isChangingDecision ? 'Cancel Edit' : 'Change Decision'}</span>
            </button>
          </div>

          {/* Edit / Override Panel (if active) */}
          {isChangingDecision ? (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-4 text-xs animate-fade-in">
              <p className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                Override Decision Treatment
              </p>

              <div>
                <label className="text-[10px] text-slate-600 uppercase font-bold">New Treatment Classification</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {(['DISCLOSE', 'REDACT', 'EXCLUDE', 'HUMAN_REVIEW'] as DataTreatment[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewTreatment(t)}
                      className={`p-2.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                        newTreatment === t 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase font-bold">Updated Statutory Justification</label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase font-bold">Privacy Officer Notes</label>
                <input
                  type="text"
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="e.g. Reviewed with departmental lead; agreed to mask third-party direct phone."
                  className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2 text-xs text-slate-900 mt-1 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsChangingDecision(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChange}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save & Apply Treatment
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Statutory Reason */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-600" /> Statutory Reason & Decision Explanation
                </span>
                <p className="text-slate-800 text-xs leading-relaxed font-medium">{record.decisionReason}</p>
              </div>

              {/* Policy Reference */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-500">Applicable Policy & Exemption Rule</span>
                <p className="font-mono text-blue-700 text-xs font-bold">{record.policyReference}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                  {record.proposedTreatment === 'REDACT' && 'Third-party individual privacy rights take precedence over requester access scope.'}
                  {record.proposedTreatment === 'EXCLUDE' && 'Protected under attorney-client privilege & statutory enterprise confidentiality.'}
                  {record.proposedTreatment === 'DISCLOSE' && 'Mandatory statutory access right under DPDP Sec. 11 / GDPR Art. 15.'}
                  {record.proposedTreatment === 'HUMAN_REVIEW' && 'Discretionary evaluation required to balance requester right vs third-party employee confidentiality.'}
                </p>
              </div>

              {/* Provenance Context Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Source Application</span>
                  <p className="font-bold text-slate-900 mt-0.5">{record.sourceSystem}</p>
                  <p className="text-[11px] text-slate-500">{record.department}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Evidence Record</span>
                  <p className="font-mono font-bold text-amber-900 mt-0.5">{record.evidenceId}</p>
                  <p className="text-[11px] text-slate-500">Verified System Extract</p>
                </div>
              </div>

              {/* Review Audit History */}
              {record.reviewedBy && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Review Audit Stamp</span>
                  <p className="text-slate-700">
                    Reviewed & ratified by <strong className="text-slate-900">{record.reviewedBy}</strong>
                  </p>
                  {record.reviewNotes && (
                    <p className="text-[11px] text-slate-600 italic">Notes: "{record.reviewNotes}"</p>
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>

          {!isChangingDecision && (
            <button
              onClick={handleApprove}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Treatment Decision</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
