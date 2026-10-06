import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Sparkles, 
  FileText, 
  Upload, 
  Send, 
  Shield, 
  Building2, 
  HelpCircle,
  Clock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { RequestType, VerificationMethod, IntakeChannel, PrivacyRequest } from '../types';
import { MASTER_CLIENT } from '../mockData/initialData';

interface CustomerAuthAndIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newRequest: Partial<PrivacyRequest>) => void;
}

type Step = 'auth' | 'two-factor' | 'verified' | 'intake' | 'success';

export const CustomerAuthAndIntakeModal: React.FC<CustomerAuthAndIntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess
}) => {
  // Step State
  const [currentStep, setCurrentStep] = useState<Step>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Customer Credentials
  const [fullName, setFullName] = useState('Rohan Mehta');
  const [email, setEmail] = useState('rohan.mehta@example.com');
  const [phone, setPhone] = useState('+91 90000 12345');
  const [password, setPassword] = useState('••••••••••••');
  const [accountNumber, setAccountNumber] = useState('ACC-7842109812');

  // 2FA State
  const [twoFaMethod, setTwoFaMethod] = useState<'otp' | 'security-question'>('otp');
  const [otpDigits, setOtpDigits] = useState<string[]>(['8', '4', '9', '2', '0', '1']);
  const [securityAnswer, setSecurityAnswer] = useState('Mumbai Main Branch');
  const [verificationToken, setVerificationToken] = useState('AUTH-2FA-OTP-78421-PASS');
  const [verificationTime, setVerificationTime] = useState('');

  // DSR Intake Form State
  const [requestCategory, setRequestCategory] = useState<RequestType>('Right of Access');
  const [description, setDescription] = useState(
    'I request a full summary and export of all personal data, CRM profile records, billing invoices, and customer support transcripts held by Client Organization.'
  );
  const [preferredChannel, setPreferredChannel] = useState<IntakeChannel>('Client Customer Portal');
  const [attachedFile, setAttachedFile] = useState<string | null>('id_proof_masked_aadhaar.pdf');
  const [createdDsrId, setCreatedDsrId] = useState<string>('DSR-2010');

  if (!isOpen) return null;

  // Preset switchers for rapid demo
  const handleSelectPreset = (name: string, mail: string, ph: string, acc: string) => {
    setFullName(name);
    setEmail(mail);
    setPhone(ph);
    setAccountNumber(acc);
  };

  // Step 1 -> Step 2
  const handleAuthContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('two-factor');
  };

  // Step 2 -> Step 3
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }) + ' IST';
    
    setVerificationTime(timestamp);
    setVerificationToken(`AUTH-${twoFaMethod.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}-PASS`);
    setCurrentStep('verified');
  };

  // Step 3 -> Step 4
  const handleContinueToIntake = () => {
    setCurrentStep('intake');
  };

  // Step 4 -> Step 5 (Submit DSR)
  const handleSubmitDSR = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `DSR-${Math.floor(2010 + Math.random() * 90)}`;
    setCreatedDsrId(newId);

    const newReqData: Partial<PrivacyRequest> = {
      id: newId,
      personName: fullName,
      email: email,
      phone: phone,
      accountNumber: accountNumber,
      accountTier: 'Verified Registered User',
      type: requestCategory,
      role: 'Active Customer',
      clientEntity: MASTER_CLIENT.name,
      channel: preferredChannel,
      priority: 'High',
      status: 'In Progress',
      currentStage: 'Data Discovery',
      assignedTeam: 'Privacy & Compliance Office',
      assignedOwner: 'Ananya Mehta (Privacy Officer)',
      receivedDate: verificationTime || '06 Oct 2026, 10:15 IST',
      dueDate: '30 calendar days',
      dueText: '30 calendar days SLA',
      customerSince: 'March 2024',
      slaStartTimestamp: new Date().toISOString(),
      slaDeadlineTimestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      slaDaysRemaining: 30,
      statutoryBasis: 'DPDP Act 2023 Sec. 11 / GDPR Art. 15',
      verificationStatus: 'Verified',
      verificationMethod: twoFaMethod === 'otp' ? 'OTP' : 'Security Questions',
      verificationToken: verificationToken,
      auditTrail: [
        {
          timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
          actor: `Customer (${fullName})`,
          role: 'Verified Requester',
          action: 'Customer Registered & 2FA Completed',
          details: `Authenticated via ${twoFaMethod === 'otp' ? 'OTP 2-Factor' : 'Security Question'} (Token: ${verificationToken}). Identity verified prior to DSR intake.`
        },
        {
          timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
          actor: `Customer (${fullName})`,
          role: 'Verified Requester',
          action: 'DSR Submitted via Customer Portal',
          details: `Submitted ${requestCategory} request with pre-associated verified credentials. Description: "${description.substring(0, 70)}..."`
        }
      ]
    };

    setCurrentStep('success');
    onSubmitSuccess(newReqData);
  };

  const handleOtpChange = (index: number, val: string) => {
    const next = [...otpDigits];
    next[index] = val.slice(-1);
    setOtpDigits(next);
  };

  const fillQuickOtp = () => {
    setOtpDigits(['8', '4', '9', '2', '0', '1']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Flow Indicator */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-tight">Customer Portal &amp; 2FA DSR Intake</span>
                <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                  New Customer Flow
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Registration / Login → 2FA Verification → Verified Identity → DSR Submission
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center space-x-1 sm:space-x-2 w-full justify-between">
            <div className={`flex items-center space-x-1.5 ${currentStep === 'auth' ? 'text-blue-700 font-bold' : 'text-slate-500 font-medium'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 'auth' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
              <span className="hidden sm:inline">Register / Login</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-400" />

            <div className={`flex items-center space-x-1.5 ${currentStep === 'two-factor' ? 'text-blue-700 font-bold' : 'text-slate-500 font-medium'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 'two-factor' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
              <span className="hidden sm:inline">2FA (OTP)</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-400" />

            <div className={`flex items-center space-x-1.5 ${currentStep === 'verified' ? 'text-emerald-700 font-bold' : 'text-slate-500 font-medium'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 'verified' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
              <span className="hidden sm:inline">Verified</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-400" />

            <div className={`flex items-center space-x-1.5 ${currentStep === 'intake' ? 'text-blue-700 font-bold' : 'text-slate-500 font-medium'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 'intake' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>4</span>
              <span className="hidden sm:inline">DSR Intake</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-400" />

            <div className={`flex items-center space-x-1.5 ${currentStep === 'success' ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>5</span>
              <span className="hidden sm:inline">Created</span>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* ========================================================= */}
          {/* STEP 1: CUSTOMER REGISTRATION / LOGIN */}
          {/* ========================================================= */}
          {currentStep === 'auth' && (
            <form onSubmit={handleAuthContinue} className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Customer Authentication</h3>
                  <p className="text-xs text-slate-500">Sign in to your client customer account or register as a verified individual.</p>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      authMode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      authMode === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Demo Quick Presets */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Quick Demo Preset Profile:</span>
                  </span>
                  <span className="text-[10px] text-blue-600">Click to fill</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('Rohan Mehta', 'rohan.mehta@example.com', '+91 90000 12345', 'ACC-7842109812')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100/70 border border-blue-200 text-slate-800 text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    Rohan Mehta (Standard User)
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rohan Mehta"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Registered Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 90000 12345"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Account / Customer ID</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="ACC-7842109812"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg p-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Account Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Continue to 2-Factor Authentication</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 2: 2-FACTOR AUTHENTICATION (OTP / SECURITY QUESTION) */}
          {/* ========================================================= */}
          {currentStep === 'two-factor' && (
            <form onSubmit={handleVerify2FA} className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">VERIFY YOUR IDENTITY (2FA)</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Statutory verification requirement: Client Organization authenticates the data subject prior to privacy request intake.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Requester:</span>
                  <span className="font-bold text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Destination:</span>
                  <span className="font-mono text-slate-700">{phone} / {email}</span>
                </div>
              </div>

              {twoFaMethod === 'otp' ? (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-700 font-medium">
                    Enter the 6-digit One-Time Password (OTP) sent to your registered mobile and email.
                  </p>

                  <div className="flex items-center justify-center space-x-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-11 h-12 text-center text-lg font-mono font-bold bg-white border-2 border-slate-300 focus:border-blue-600 rounded-xl focus:outline-none shadow-2xs"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center space-x-3 text-xs">
                    <button
                      type="button"
                      onClick={fillQuickOtp}
                      className="text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      Fill OTP: 849201
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setTwoFaMethod('security-question')}
                      className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                    >
                      Use Security Question instead
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                    <span className="font-bold block">Security Question:</span>
                    <span className="text-slate-700">"What was the name of your first account opening branch?"</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Your Security Answer</label>
                    <input
                      type="text"
                      required
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setTwoFaMethod('otp')}
                      className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
                    >
                      ← Back to OTP verification
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep('auth')}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Identity &amp; Proceed</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 3: IDENTITY VERIFIED SCREEN */}
          {/* ========================================================= */}
          {currentStep === 'verified' && (
            <div className="space-y-6 text-center animate-fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full font-bold">
                  2-FACTOR AUTHENTICATION PASSED
                </span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Identity Successfully Verified</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  You are verified as <strong className="text-slate-900">{fullName}</strong> ({email}). You can now submit your statutory privacy request.
                </p>
              </div>

              {/* Recorded verification details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Verification Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Verification Method:</span>
                  <span className="font-semibold text-slate-800">
                    {twoFaMethod === 'otp' ? 'OTP (2-Factor Authentication)' : 'Security Question'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="font-mono text-slate-700">{verificationTime}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Auth Token Reference:</span>
                  <span className="font-mono text-blue-700 font-bold">{verificationToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Identity Source:</span>
                  <span className="text-slate-700 font-medium">Client Organization Identity Gateway (Client-Controlled)</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-left text-[11px] text-slate-600 max-w-lg mx-auto">
                <span className="font-bold text-blue-900 block">Dutro Privacy Governance Note:</span>
                The actual identity source remains client-controlled. Dutro records the verification status, method, timestamp, and reference token without becoming the source of truth for identity.
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleContinueToIntake}
                  className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Continue to Privacy Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: DSR INTAKE (SUBMIT A PRIVACY REQUEST) */}
          {/* ========================================================= */}
          {currentStep === 'intake' && (
            <form onSubmit={handleSubmitDSR} className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Submit a Privacy Request</h3>
                <p className="text-xs text-slate-500">
                  Select your privacy right and specify the information scope. Your verified credentials are automatically associated with this request.
                </p>
              </div>

              {/* Verified Requester Pill */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950 block">{fullName}</span>
                    <span className="text-[11px] text-emerald-700 font-mono">{email} • {phone} • {accountNumber}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold border border-emerald-300">
                  Verified via 2FA
                </span>
              </div>

              {/* Category Options */}
              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  1. Request Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Right of Access', label: 'Right of Access', badge: 'DPDP Sec. 11 / GDPR Art. 15' },
                    { id: 'Right to Correction', label: 'Right to Correction', badge: 'DPDP Sec. 12(1)' },
                    { id: 'Right to Erasure / Deletion', label: 'Right to Erasure', badge: 'DPDP Sec. 12(3)' },
                    { id: 'Consent Withdrawal / Opt-Out', label: 'Consent Opt-Out', badge: 'DPDP Sec. 6' },
                    { id: 'Grievance / Escalation', label: 'Grievance / Dispute', badge: 'DPDP Sec. 13' },
                    { id: 'Other Privacy Request', label: 'Other Privacy Request', badge: 'General Query' }
                  ].map((cat) => {
                    const isSelected = requestCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setRequestCategory(cat.id as RequestType)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 border-blue-400 shadow-2xs font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs">{cat.label}</span>
                        <span className={`text-[9px] mt-1 font-mono ${isSelected ? 'text-blue-700 font-semibold' : 'text-slate-400'}`}>
                          {cat.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Request Description */}
              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  2. Request Description &amp; Scope
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the personal data or records you wish to access or rectify..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg p-3 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Preferred Communication Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    3. Preferred Delivery Channel
                  </label>
                  <select
                    value={preferredChannel}
                    onChange={(e) => setPreferredChannel(e.target.value as IntakeChannel)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Client Customer Portal">Client Customer Portal (Encrypted Download)</option>
                    <option value="Inbound Email">Secure Registered Email</option>
                    <option value="WhatsApp Assistant">WhatsApp Privacy Assistant</option>
                    <option value="Website Webform">Website Webform Portal</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    4. Attachments (Optional)
                  </label>
                  <div className="p-2 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 truncate font-mono">{attachedFile || 'No file attached'}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(attachedFile ? null : 'supplementary_proof.pdf')}
                      className="text-blue-600 font-bold hover:underline cursor-pointer shrink-0 ml-2"
                    >
                      {attachedFile ? 'Remove' : '+ Attach'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep('verified')}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Privacy Request</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 5: SUBMISSION SUCCESS & ROUTING */}
          {/* ========================================================= */}
          {currentStep === 'success' && (
            <div className="space-y-6 text-center animate-fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-300 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full font-bold">
                  DSR REQUEST CREATED
                </span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Privacy Request Ingested</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Case <strong className="text-blue-700 font-mono font-bold">{createdDsrId}</strong> has been initialized with verified status and routed directly into the unified Dutro DSR Workspace.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Case Identifier:</span>
                  <span className="font-mono font-bold text-blue-700">{createdDsrId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Request Type:</span>
                  <span className="font-bold text-slate-800">{requestCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-medium text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Identity Verification:</span>
                  <span className="text-emerald-700 font-bold">✓ Verified via 2FA ({twoFaMethod.toUpperCase()})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statutory SLA:</span>
                  <span className="font-mono text-slate-700">30 calendar days (Clock Started)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Done / Return to Portal</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
