import React, { useState } from 'react';
import { ClientTask, RedactionReviewState, RedactionDecision, RedactionReviewStatus } from '../../../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  HelpCircle, 
  UserCheck, 
  Lock, 
  FileText,
  Info
} from 'lucide-react';

interface RedactionReviewSectionProps {
  task: ClientTask;
  onUpdateRedactionReview: (taskId: string, updatedState: RedactionReviewState) => void;
  isReadOnly?: boolean;
}

export const RedactionReviewSection: React.FC<RedactionReviewSectionProps> = ({
  task,
  onUpdateRedactionReview,
  isReadOnly = false
}) => {
  const defaultState: RedactionReviewState = task.redactionReview || {
    status: 'NO REDACTION REQUIRED',
    guidanceText: 'All information identified in this task relates to the verified requester and no additional disclosure restriction has been identified.',
    recommendedAction: 'Approve records for customer disclosure.',
    checklist: [
      { id: 'chk-1', label: "Requester's own personal data", description: 'Full name, email, phone, account number.', detected: true, decision: 'No Issue' },
      { id: 'chk-2', label: 'Third-party personal data', description: 'Names, emails or addresses of non-requester third parties.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-3', label: 'Employee personal data', description: 'Internal employee direct contacts, cell numbers or performance logs.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-4', label: 'Vendor / supplier personal data', description: 'Vendor personal identifiers.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-5', label: "Other customers' personal data", description: 'Accidental co-mingled account numbers or names.', detected: false, decision: 'No Issue' },
      { id: 'chk-6', label: 'Sensitive personal information (SPI)', description: 'Biometrics, passwords, secret PINs.', detected: false, decision: 'No Issue' },
      { id: 'chk-7', label: 'Confidential / internal information', description: 'Internal scorecards, commercial risk ratings.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-8', label: 'Security-related information', description: 'Server IPs, routing keys, encryption secrets.', detected: false, decision: 'Not Applicable' },
      { id: 'chk-9', label: 'Legal / privileged information', description: 'Privileged communications with litigation counsel.', detected: false, decision: 'Not Applicable' },
    ],
    isReviewed: false
  };

  const [reviewState, setReviewState] = useState<RedactionReviewState>(defaultState);
  const [reviewerNameInput, setReviewerNameInput] = useState(reviewState.reviewerName || task.assignedPerson || 'Ananya Mehta');

  const handleDecisionChange = (itemId: string, newDecision: RedactionDecision) => {
    if (isReadOnly) return;

    const updatedChecklist = reviewState.checklist.map(item => 
      item.id === itemId ? { ...item, decision: newDecision } : item
    );

    // Auto calculate overall status based on decisions
    const hasRedact = updatedChecklist.some(i => i.decision === 'Redact');
    const hasReview = updatedChecklist.some(i => i.decision === 'Review Required');
    
    let computedStatus: RedactionReviewStatus = 'NO REDACTION REQUIRED';
    let computedGuidance = 'All information identified in this task relates to the verified requester and no additional disclosure restriction has been identified.';
    let computedAction = 'Approve records for customer response package.';

    if (hasRedact) {
      computedStatus = 'REDACTION REQUIRED';
      computedGuidance = 'Redaction required on employee or third-party identifiers detected in this department dataset before customer response delivery.';
      computedAction = 'Client department must apply redactions in internal system before finalizing disclosure.';
    } else if (hasReview) {
      computedStatus = 'REVIEW REQUIRED';
      computedGuidance = 'Potential third-party or internal information flagged for review. Verify disclosure permissibility under DPDP Section 11 / GDPR Art. 15.';
      computedAction = 'Review third-party and internal information before disclosure.';
    }

    const nextState: RedactionReviewState = {
      ...reviewState,
      status: computedStatus,
      guidanceText: computedGuidance,
      recommendedAction: computedAction,
      checklist: updatedChecklist
    };

    setReviewState(nextState);
    onUpdateRedactionReview(task.id, nextState);
  };

  const handleFinalDecision = (decision: 'Approve Disclosure' | 'Redaction Required' | 'Mark Reviewed') => {
    const nextState: RedactionReviewState = {
      ...reviewState,
      finalDecision: decision,
      isReviewed: true,
      reviewerName: reviewerNameInput,
      reviewedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
    };
    setReviewState(nextState);
    onUpdateRedactionReview(task.id, nextState);
  };

  const getStatusBadge = () => {
    switch (reviewState.status) {
      case 'REDACTION REQUIRED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>REDACTION REQUIRED</span>
          </span>
        );
      case 'REVIEW REQUIRED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>REVIEW REQUIRED</span>
          </span>
        );
      case 'NO REDACTION REQUIRED':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>NO REDACTION REQUIRED</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 text-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              REDACTION & DISCLOSURE REVIEW
            </h4>
          </div>
          <p className="text-[11px] text-slate-500">
            Dutro compliance guidance for {task.processName} · {task.sourceSystem}. Client team makes the final redaction decision.
          </p>
        </div>

        <div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Guidance Box */}
      <div className={`p-3.5 rounded-lg border space-y-1.5 ${
        reviewState.status === 'REDACTION REQUIRED' ? 'bg-rose-50/70 border-rose-200 text-rose-950' :
        reviewState.status === 'REVIEW REQUIRED' ? 'bg-amber-50/70 border-amber-200 text-amber-950' :
        'bg-emerald-50/60 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-center space-x-1.5 font-bold text-[11px]">
          <Info className="w-3.5 h-3.5" />
          <span>DUTRO COMPLIANCE GUIDANCE:</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          {reviewState.guidanceText}
        </p>
        <p className="text-[11px] font-semibold">
          Recommended Action: <strong className="underline underline-offset-2">{reviewState.recommendedAction}</strong>
        </p>
      </div>

      {/* 9-Point Redaction Checklist Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            9-Point Disclosure Safeguard Checklist
          </span>
          <span className="text-[10px] text-slate-400">
            Select status for each data category
          </span>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {reviewState.checklist.map((item) => (
            <div key={item.id} className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800 text-xs">{item.label}</span>
                  {item.detected && (
                    <span className="text-[9px] font-bold uppercase bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-100">
                      Detected
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">{item.description}</p>
              </div>

              {/* Decision Options */}
              <div className="flex items-center space-x-1 shrink-0">
                {(['No Issue', 'Review Required', 'Redact', 'Not Applicable'] as RedactionDecision[]).map((dec) => {
                  const isSelected = item.decision === dec;
                  return (
                    <button
                      key={dec}
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => handleDecisionChange(item.id, dec)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? dec === 'No Issue' ? 'bg-emerald-600 text-white shadow-2xs' :
                            dec === 'Redact' ? 'bg-rose-600 text-white shadow-2xs' :
                            dec === 'Review Required' ? 'bg-amber-500 text-white shadow-2xs' :
                            'bg-slate-700 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {dec}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviewer Sign-Off & Final Action */}
      <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-500">Reviewer:</span>
          <input
            type="text"
            disabled={isReadOnly}
            value={reviewerNameInput}
            onChange={(e) => setReviewerNameInput(e.target.value)}
            placeholder="Reviewer Name & Role"
            className="px-2.5 py-1 rounded border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
          />
          {reviewState.reviewedAt && (
            <span className="text-[10px] text-slate-400 font-mono">
              ({reviewState.reviewedAt})
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {!isReadOnly && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleFinalDecision('Redaction Required')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                reviewState.finalDecision === 'Redaction Required'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300'
              }`}
            >
              Mark Redaction Required
            </button>

            <button
              type="button"
              onClick={() => handleFinalDecision('Approve Disclosure')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                reviewState.finalDecision === 'Approve Disclosure'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300'
              }`}
            >
              Approve Disclosure
            </button>

            <button
              type="button"
              onClick={() => handleFinalDecision('Mark Reviewed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                reviewState.finalDecision === 'Mark Reviewed'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300'
              }`}
            >
              Mark Reviewed ✓
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
