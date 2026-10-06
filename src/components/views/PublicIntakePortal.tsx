import React, { useState } from 'react';
import { useDSR } from '../../context/DSRContext';
import { Persona, RequestChannel } from '../../types/dsr';
import { 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  FileText, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
  Clock
} from 'lucide-react';

export const PublicIntakePortal: React.FC = () => {
  const { createDSRFromPortal, navigateToDSR, setCurrentView } = useDSR();

  const [fullName, setFullName] = useState('Anand Kumar');
  const [email, setEmail] = useState('anand.kumar@techventures.in');
  const [phone, setPhone] = useState('+91 98450 11223');
  const [persona, setPersona] = useState<Persona>('Customer');
  const [channel, setChannel] = useState<RequestChannel>('Customer Portal');
  const [description, setDescription] = useState(
    'I would like to receive a comprehensive copy and summary of all personal data, support tickets, and billing histories held by Dutro India Pvt Ltd.'
  );

  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = createDSRFromPortal({
      fullName,
      email,
      phone,
      persona,
      requestType: 'Access',
      channel,
      description,
    });
    setSubmittedCaseId(newId);
  };

  return (
    <div className="min-h-full p-6 lg:p-12 flex flex-col justify-center items-center bg-slate-50">
      
      {/* Container Box */}
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Top Switcher Back to Admin */}
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setCurrentView('overview')}
            className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Dutro Admin Console</span>
          </button>

          <span className="font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
            Route: /privacy/request
          </span>
        </div>

        {submittedCaseId ? (
          /* Submission Success Card */
          <div className="p-8 rounded-2xl bg-white border border-emerald-200 text-center space-y-5 shadow-sm animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                DSAR SUBMISSION CONFIRMED
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Data Subject Access Request has been Submitted</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                We have dispatched a verification email to <strong className="text-slate-900">{email}</strong>. Once verified, our privacy operations team will fulfill your request within the statutory 30-day window.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Assigned Case ID:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">{submittedCaseId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Request Type:</span>
                <span className="font-bold text-blue-800">Right of Access (DSAR)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-semibold text-blue-800">Received (Awaiting Verification)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ingestion Channel:</span>
                <span className="font-mono text-slate-800 font-semibold">{channel}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmittedCaseId(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Submit Another Access Request
              </button>

              <button
                onClick={() => {
                  setSubmittedCaseId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Return to Intake Form</span>
              </button>
            </div>
          </div>
        ) : (
          /* Intake Form */
          <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-7">
            
            {/* Header */}
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Subject Access Request (DSAR)</h1>
                  <p className="text-xs text-slate-500">Dutro India Pvt Ltd • Statutory Privacy Portal</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                Under <strong>Section 11 of the Digital Personal Data Protection (DPDP) Act 2023</strong> and <strong>Article 15 of GDPR</strong>, you have the statutory right to obtain confirmation and receive a comprehensive copy of all personal data held about you by our organization.
              </p>
            </div>

            {/* DSAR Scope Notice Box */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center space-x-2 text-blue-900 font-bold">
                <Database className="w-4 h-4 text-blue-600" />
                <span>What information is included in your DSAR fulfillment?</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                <li>Summary of all personal data being processed across enterprise systems</li>
                <li>Categories of personal data and statutory processing purposes</li>
                <li>Identities of third-party vendors and sub-processors with whom data has been shared</li>
                <li>Retention periods and statutory storage rules</li>
              </ul>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                1. Your Identity & Verification Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Official Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Your Relationship with Dutro</label>
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value as Persona)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  >
                    <option value="Customer">Current / Former Customer</option>
                    <option value="Employee">Current / Former Employee</option>
                    <option value="Candidate">Job Applicant / Candidate</option>
                    <option value="Vendor/Partner">Vendor or Partner Contact</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Ingestion Channel selector for demo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  2. Ingestion Channel (Demo Simulation Option)
                </label>
                <span className="text-[10px] font-mono text-blue-700 font-semibold">Multi-Channel DSAR Orchestration</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(['Customer Portal', 'Email', 'API', 'Website'] as RequestChannel[]).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`p-2 rounded-xl font-mono text-xs border transition-all cursor-pointer ${
                      channel === ch
                        ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                3. Access Request Scope / Specific Information Requested
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Access Request (DSAR)</span>
            </button>

          </form>
        )}

      </div>

    </div>
  );
};
