import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Eye, 
  ArrowLeft, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  FileCode,
  Lock,
  Building2,
  Calendar,
  Check
} from 'lucide-react';
import { MASTER_CLIENT, MASTER_CUSTOMER } from '../mockData/initialData';

interface ResponsePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproveAndSend: () => void;
}

export const ResponsePreviewModal: React.FC<ResponsePreviewModalProps> = ({
  isOpen,
  onClose,
  onApproveAndSend
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'data-summary' | 'audit'>('letter');
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight">{MASTER_CLIENT.name.toUpperCase()}</span>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-blue-300 px-2 py-0.5 rounded border border-slate-700">
                  Client Response Preview
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-300">
                  DSR-2001 ({MASTER_CUSTOMER.name})
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Prepared by {MASTER_CLIENT.name} Privacy Team · Final Delivery via Customer Portal
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('letter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'letter'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Disclosure Letter</span>
            </button>

            <button
              onClick={() => setActiveTab('data-summary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'data-summary'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Data Category Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dutro Orchestration Audit</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>{isDownloaded ? 'Downloaded ✓' : 'Export Package'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scroll space-y-6 text-xs text-slate-700 bg-slate-50/50">
          
          {/* TAB 1: FORMAL DISCLOSURE LETTER */}
          {activeTab === 'letter' && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{MASTER_CLIENT.name.toUpperCase()}</h3>
                  <p className="text-[11px] text-slate-500">Data Privacy & Compliance Office</p>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p>Date: <strong>28 September 2026</strong></p>
                  <p>Ref: <strong className="font-mono text-blue-700">DSR-2001</strong></p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-900">To: {MASTER_CUSTOMER.name}</p>
                <p className="text-slate-600 font-mono">{MASTER_CUSTOMER.email}</p>
                <p className="text-slate-500">Customer ID: {MASTER_CUSTOMER.id}</p>
              </div>

              <div className="space-y-3 text-slate-700 leading-relaxed text-xs">
                <p className="font-semibold text-slate-900">
                  Subject: Fulfillment of Right of Access Request (Ref: DSR-2001)
                </p>
                
                <p>
                  Dear {MASTER_CUSTOMER.name},
                </p>
                
                <p>
                  In accordance with statutory privacy regulations (DPDP Act 2023 / GDPR), {MASTER_CLIENT.name} has completed the processing of your Right of Access request submitted on 28 September 2026.
                </p>

                <p>
                  Our internal departments have retrieved and reviewed your personal data records across our Customer Onboarding, Customer Support, Billing & Payments, and Marketing systems.
                </p>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                  <p className="font-bold text-slate-900">Summary of Data Categories Retrieved by {MASTER_CLIENT.name}:</p>
                  <p>• <strong>Customer Profile & KYC:</strong> Customer profile, contact details, account information, and KYC verification records.</p>
                  <p>• <strong>Customer Support:</strong> Inquiries, support requests, and communication history (with third-party staff information redacted).</p>
                  <p>• <strong>Billing & Payments:</strong> Annual fee records, payment history, and tax invoices.</p>
                  <p>• <strong>Marketing & Preferences:</strong> Newsletter subscriptions, consent records, and communication preferences.</p>
                </div>

                <p>
                  You can access your complete personal data response package securely through the {MASTER_CLIENT.name} Customer Portal.
                </p>

                <p className="pt-2">
                  Sincerely,<br />
                  <strong className="text-slate-900">{MASTER_CLIENT.privacyOfficer}</strong><br />
                  <span className="text-slate-500">Data Protection Officer · {MASTER_CLIENT.name}</span>
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: DATA CATEGORY SUMMARY */}
          {activeTab === 'data-summary' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-slate-800">
                <span className="font-bold text-blue-900 block uppercase tracking-wide">
                  CLIENT-SIDE DATA RETRIEVAL SUMMARY
                </span>
                <p className="text-slate-700 mt-0.5">
                  Each internal department retrieved customer records from their respective source systems and confirmed completion. Raw data remains within {MASTER_CLIENT.name}'s secure boundary.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">1. Customer Onboarding & Profile</h4>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">TASK-2001 · Completed</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Source System: Client CRM System · Owner: Rahul Verma</p>
                  <p className="text-xs text-slate-700">Data retrieved: Full name ({MASTER_CUSTOMER.name}), email ({MASTER_CUSTOMER.email}), mobile ({MASTER_CUSTOMER.phone}), account number ({MASTER_CUSTOMER.accountNumber}), KYC status.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">2. Customer Support & Inquiries</h4>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">TASK-2002 · Completed</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Source System: Client Support Desk · Owner: Neha Kapoor</p>
                  <p className="text-xs text-slate-700">Data retrieved: Support inquiries and communication logs. (Third-party employee contact information reviewed and redacted within client environment).</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">3. Billing & Payments</h4>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">TASK-2003 · Completed</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Source System: Client Billing System · Owner: Vikram Shah</p>
                  <p className="text-xs text-slate-700">Data retrieved: Annual service fee records, payment history, and statutory tax invoices.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">4. Marketing & Communication Preferences</h4>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">TASK-2004 · Completed</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Source System: Client Marketing Engine · Owner: Simran Roy</p>
                  <p className="text-xs text-slate-700">Data retrieved: Company newsletter subscriptions, active consent timestamps, communication channel preferences.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DUTRO ORCHESTRATION AUDIT */}
          {activeTab === 'audit' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center space-x-2 text-blue-900 font-bold">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>COMPLIANCE AUDIT TRAIL</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Case Identifier</span>
                  <span className="font-mono font-bold text-slate-900">DSR-2001</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Data Controller</span>
                  <span className="font-bold text-slate-900">{MASTER_CLIENT.name}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Orchestration Platform</span>
                  <span className="font-bold text-blue-700">Dutro Privacy Platform</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Statutory SLA Compliance</span>
                  <span className="font-bold text-emerald-700">30 Calendar Days (Met)</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Preview
          </button>

          <button
            onClick={() => {
              onApproveAndSend();
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Approve & Send to Customer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
