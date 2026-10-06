import React, { useState } from 'react';
import { DSRCase } from '../../../../types/dsr';
import { useDSR } from '../../../../context/DSRContext';
import { 
  X, 
  ShieldCheck, 
  Send, 
  Download, 
  Printer, 
  Lock, 
  CheckCircle2, 
  FileText, 
  Eye, 
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';

interface ResponsePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dsrCase: DSRCase;
}

export const ResponsePreviewModal: React.FC<ResponsePreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  dsrCase 
}) => {
  const { sendResponsePackage } = useDSR();
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleApproveAndSend = () => {
    setIsSending(true);
    setTimeout(() => {
      sendResponsePackage(dsrCase.id);
      setIsSending(false);
      onClose();
    }, 800);
  };

  // Group records by category
  const disclosedRecords = dsrCase.collectedData.filter(r => r.proposedTreatment === 'DISCLOSE');
  const redactedRecords = dsrCase.collectedData.filter(r => r.proposedTreatment === 'REDACT');
  const excludedRecords = dsrCase.collectedData.filter(r => r.proposedTreatment === 'EXCLUDE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                FINAL RESPONSE PACKAGE PREVIEW
              </span>
              <p className="text-xs text-slate-700 font-bold mt-0.5">
                Formatted Outward Disclosure Packet ({dsrCase.id})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formal Disclosure Document Preview (Clean White / Slate Enterprise Paper Look) */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-100/70 custom-scroll">
          
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-7 text-slate-800 text-xs">
            
            {/* Formal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-2xs">
                    D
                  </div>
                  <span className="font-bold text-xl text-slate-900 tracking-tight">DUTRO</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-2">Dutro Privacy Response Package</h2>
                <p className="text-slate-500 text-xs">Statutory Personal Data Access Fulfillment</p>
              </div>

              <div className="text-right space-y-1 font-mono text-xs">
                <p className="text-slate-500">Reference: <strong className="text-blue-700">{dsrCase.id}</strong></p>
                <p className="text-slate-500">Date: <strong className="text-slate-800">28 September 2026</strong></p>
                <p className="text-slate-500">Entity: <strong className="text-slate-800">{dsrCase.legalEntity}</strong></p>
              </div>
            </div>

            {/* Recipient Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-500">Prepared For Data Principal</p>
              <p className="text-sm font-bold text-slate-900">{dsrCase.requesterName}</p>
              <p className="text-xs text-slate-700 font-mono font-medium">{dsrCase.requesterEmail} • {dsrCase.requesterPhone}</p>
              <p className="text-[11px] text-slate-500 pt-1">
                In response to your formal <strong>{dsrCase.requestType} Request</strong> submitted on {dsrCase.submittedDate}.
              </p>
            </div>

            {/* Introductory Statement */}
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                Dear {dsrCase.requesterName},
              </p>
              <p>
                In accordance with applicable data privacy legislation (including the Digital Personal Data Protection Act and international standards), Dutro India Pvt Ltd has processed your request for access to your personal data held across our systems.
              </p>
              <p>
                Below is the comprehensive summary of the personal data identified within our mapped business processes, along with relevant categories, processing purposes, and retention timelines.
              </p>
            </div>

            {/* SECTION 1: Personal & Account Information */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>1. Personal & Contact Information</span>
                <span className="text-[10px] font-mono text-slate-500">Source: CRM (Salesforce)</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Full Name</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{dsrCase.requesterName}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Official Email</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{dsrCase.requesterEmail}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Direct Phone</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{dsrCase.requesterPhone}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Registered Address</span>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">1402 Tower B, Cyber City, Gurugram, India</p>
                </div>
              </div>
            </div>

            {/* SECTION 2: Customer Support & Communication History */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>2. Customer Support & Communications</span>
                <span className="text-[10px] font-mono text-slate-500">Source: Zendesk Support Platform</span>
              </h4>

              <div className="space-y-2">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Support Ticket #451</span>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Resolved • 14 Aug 2026</span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Inquiry regarding DSR Sandbox API rate limit burst capacity. Triage completed successfully.
                  </p>
                </div>

                {/* REDACTED THIRDPARTY ITEM DEMO */}
                <div className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Support Lead & Escalation Contacts</span>
                    <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                      REDACTED
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white font-mono text-[11px] text-amber-900 border border-amber-200 font-semibold shadow-2xs">
                    [REDACTED — THIRD-PARTY PERSONAL DATA (EMPLOYEE CONTACT EXEMPTION)]
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Financial & Billing Records */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>3. Billing & Invoicing History</span>
                <span className="text-[10px] font-mono text-slate-500">Source: Stripe & NetSuite ERP</span>
              </h4>

              <div className="space-y-2">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Invoice #INV-2048</p>
                    <p className="text-[11px] text-slate-500">Annual Enterprise Privacy Orchestration Tier</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Paid • Card Ending *8832</span>
                </div>
              </div>
            </div>

            {/* SECTION 4: Statutory Redactions & Exclusions Notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Statutory Redactions & Non-Disclosed Records
              </h5>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Pursuant to Section 11(3) of the Digital Personal Data Protection Act and standard privacy principles:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                <li>Third-party personal identifiable information of support personnel has been redacted to protect individual privacy rights.</li>
                <li>Confidential attorney-client privileged legal communications have been excluded under statutory exemption rules.</li>
              </ul>
            </div>

            {/* Formal Footer Signatures */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="space-y-0.5">
                <p className="text-slate-800 font-bold">Prepared by Dutro Privacy Orchestration Engine</p>
                <p className="text-[11px] font-mono">Dutro Case Ref: {dsrCase.id} • Digital Seal Verified</p>
              </div>

              <div className="text-right space-y-0.5">
                <p className="text-slate-800 font-bold">Approved by Dutro India Pvt Ltd</p>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Certified Compliance Package
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            ← Back to Review Tab
          </button>

          <button
            onClick={handleApproveAndSend}
            disabled={isSending}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Transmitting Secure Package...' : 'Approve & Send Final Response'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
