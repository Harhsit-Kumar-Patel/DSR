import React, { useState } from 'react';
import { DSRCase, CollectedDataRecord } from '../../../types/dsr';
import { useDSR } from '../../../context/DSRContext';
import { 
  FileCheck, 
  ShieldAlert, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  HelpCircle, 
  Scale, 
  ArrowRight,
  Send,
  Sparkles,
  Edit3,
  UserCheck
} from 'lucide-react';
import { DecisionDetailsDrawer } from './drawers/DecisionDetailsDrawer';
import { ResponsePreviewModal } from './modals/ResponsePreviewModal';

interface ReviewTabProps {
  dsrCase: DSRCase;
  onNavigateTab: (tab: 'activity') => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({ dsrCase, onNavigateTab }) => {
  const { approveResponsePackage, showToast } = useDSR();
  
  const [selectedRecordForWhy, setSelectedRecordForWhy] = useState<CollectedDataRecord | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const discloseItems = dsrCase.collectedData.filter(r => r.proposedTreatment === 'DISCLOSE');
  const redactItems = dsrCase.collectedData.filter(r => r.proposedTreatment === 'REDACT');
  const excludeItems = dsrCase.collectedData.filter(r => r.proposedTreatment === 'EXCLUDE');
  const humanReviewItems = dsrCase.collectedData.filter(r => r.proposedTreatment === 'HUMAN_REVIEW');

  const totalRecords = dsrCase.collectedData.length;
  const humanReviewedCount = dsrCase.collectedData.filter(r => r.isHumanReviewed).length;

  const handleApproveResponse = () => {
    approveResponsePackage(dsrCase.id);
  };

  const handleRequestChanges = () => {
    showToast('Change request logged. Department owners notified to clarify records.', 'info');
  };

  return (
    <div className="space-y-7">
      
      {/* Top Title & Explanation Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
            EXPLAINABLE DISCLOSURE ENGINE
          </span>
          <span className="text-xs text-slate-500 font-medium">Step 5 of DSR Lifecycle</span>
        </div>

        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Response Review & Redaction Classification</h2>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          "Review how collected information will be treated before generating the response. Every automated redaction or exclusion decision is explainable and verifiable under statutory privacy standards."
        </p>
      </div>

      {/* 4 Categorized Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. DISCLOSE (Green) */}
        <div className="rounded-2xl bg-white border border-emerald-200 overflow-hidden flex flex-col justify-between shadow-sm">
          <div>
            <div className="p-3.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  DISCLOSE ({discloseItems.length})
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                Outward Bundle
              </span>
            </div>

            <div className="p-3 space-y-2 max-h-96 overflow-y-auto custom-scroll">
              {discloseItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRecordForWhy(item)}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 cursor-pointer transition-all space-y-1 hover:bg-white"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 truncate">{item.fieldName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{item.evidenceId}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50/50 border-t border-emerald-100 text-[11px] text-emerald-800 text-center font-semibold">
            Personal data belonging to requester
          </div>
        </div>

        {/* 2. REDACT (Amber/Red) */}
        <div className="rounded-2xl bg-white border border-amber-200 overflow-hidden flex flex-col justify-between shadow-sm">
          <div>
            <div className="p-3.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  REDACT ({redactItems.length})
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 font-bold">
                Masked
              </span>
            </div>

            <div className="p-3 space-y-2 max-h-96 overflow-y-auto custom-scroll">
              {redactItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRecordForWhy(item)}
                  className="p-2.5 rounded-xl bg-amber-50/30 border border-amber-200 hover:border-amber-400 cursor-pointer transition-all space-y-1 hover:bg-white"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-950 truncate">{item.fieldName}</span>
                    <span className="text-[9px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-bold">
                      WHY?
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 italic">{item.decisionReason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-amber-50/50 border-t border-amber-100 text-[11px] text-amber-900 text-center font-semibold">
            Third-party personal data protection
          </div>
        </div>

        {/* 3. EXCLUDE (Purple/Gray) */}
        <div className="rounded-2xl bg-white border border-purple-200 overflow-hidden flex flex-col justify-between shadow-sm">
          <div>
            <div className="p-3.5 bg-purple-50 border-b border-purple-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  EXCLUDE ({excludeItems.length})
                </h4>
              </div>
              <span className="text-[10px] font-mono text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200 font-bold">
                Withheld
              </span>
            </div>

            <div className="p-3 space-y-2 max-h-96 overflow-y-auto custom-scroll">
              {excludeItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRecordForWhy(item)}
                  className="p-2.5 rounded-xl bg-purple-50/30 border border-purple-200 hover:border-purple-400 cursor-pointer transition-all space-y-1 hover:bg-white"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-purple-950 truncate">{item.fieldName}</span>
                    <span className="text-[9px] font-mono uppercase bg-purple-100 text-purple-900 border border-purple-200 px-1.5 py-0.2 rounded font-bold">
                      WHY?
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 italic">{item.decisionReason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-purple-50/50 border-t border-purple-100 text-[11px] text-purple-900 text-center font-semibold">
            Legal professional privilege exemption
          </div>
        </div>

        {/* 4. HUMAN REVIEW (Yellow) */}
        <div className="rounded-2xl bg-white border border-yellow-200 overflow-hidden flex flex-col justify-between shadow-sm">
          <div>
            <div className="p-3.5 bg-yellow-50 border-b border-yellow-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-yellow-600" />
                <h4 className="text-xs font-bold text-yellow-900 uppercase tracking-wider">
                  HUMAN REVIEW ({humanReviewItems.length})
                </h4>
              </div>
              <span className="text-[10px] font-mono text-yellow-900 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-300 font-bold">
                Discretionary
              </span>
            </div>

            <div className="p-3 space-y-2 max-h-96 overflow-y-auto custom-scroll">
              {humanReviewItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRecordForWhy(item)}
                  className="p-2.5 rounded-xl bg-yellow-50/30 border border-yellow-200 hover:border-yellow-400 cursor-pointer transition-all space-y-1 hover:bg-white"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-yellow-950 truncate">{item.fieldName}</span>
                    <span className="text-[9px] font-mono uppercase bg-yellow-100 text-yellow-900 border border-yellow-300 px-1.5 py-0.2 rounded font-bold">
                      REVIEW
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 italic">{item.decisionReason}</p>
                </div>
              ))}

              {humanReviewItems.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-slate-700 font-semibold">All records reviewed & ratified!</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-2.5 bg-yellow-50/50 border-t border-yellow-100 text-[11px] text-yellow-900 text-center font-semibold">
            Mixed requester / employee records
          </div>
        </div>

      </div>

      {/* CLIENT APPROVAL & RESPONSE PACKAGE SUMMARY (Prompt Section 16) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-indigo-50/40 border border-blue-200 shadow-sm space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Client Approval & Final Response Package
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              "The client remains the decision-maker and owner of the underlying data."
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            dsrCase.approvalStatus === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            dsrCase.approvalStatus === 'Sent' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
            'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            Status: {dsrCase.approvalStatus === 'Approved' ? 'Approved — Ready to Send' : dsrCase.approvalStatus}
          </span>
        </div>

        {/* 5 KPI Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Records</span>
            <p className="text-xl font-bold font-mono text-slate-900 mt-1">{totalRecords}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">To Disclose</span>
            <p className="text-xl font-bold font-mono text-emerald-800 mt-1">{discloseItems.length}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 shadow-2xs">
            <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">To Redact</span>
            <p className="text-xl font-bold font-mono text-amber-900 mt-1">{redactItems.length}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 shadow-2xs">
            <span className="text-[10px] text-purple-900 font-bold uppercase tracking-wider">To Exclude</span>
            <p className="text-xl font-bold font-mono text-purple-900 mt-1">{excludeItems.length}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 shadow-2xs">
            <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">Human Reviewed</span>
            <p className="text-xl font-bold font-mono text-blue-700 mt-1">{humanReviewedCount}/{totalRecords}</p>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleRequestChanges}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
          >
            Request Department Changes
          </button>

          <div className="w-full sm:w-auto flex items-center space-x-3">
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Preview Response Letter</span>
            </button>

            {dsrCase.approvalStatus !== 'Approved' && dsrCase.approvalStatus !== 'Sent' ? (
              <button
                onClick={handleApproveResponse}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Response Package</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPreviewModalOpen(true)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Response Packet →</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Decision Details Drawer ("Why?") */}
      <DecisionDetailsDrawer
        record={selectedRecordForWhy}
        onClose={() => setSelectedRecordForWhy(null)}
      />

      {/* Response Preview Modal */}
      <ResponsePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        dsrCase={dsrCase}
      />

    </div>
  );
};
