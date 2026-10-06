import React, { useState, useEffect } from 'react';
import { CustomerAccount, ConsultantAccount, AuthRole } from '../../types';
import { 
  DEFAULT_CUSTOMER_ACCOUNT, 
  DEFAULT_CONSULTANT_ACCOUNT, 
  INITIAL_REGISTERED_CUSTOMERS,
  MASTER_CLIENT 
} from '../../mockData/initialData';
import { 
  Shield, 
  UserCheck, 
  Briefcase, 
  Lock, 
  Mail, 
  Phone, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  RefreshCw, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  Fingerprint, 
  CheckCircle,
  Users,
  UserPlus
} from 'lucide-react';

const STORAGE_KEY_REGISTERED_CUSTOMERS = 'dutro_v7_registered_customers';

interface AuthLandingPageProps {
  onAuthenticate: (role: AuthRole, account: CustomerAccount | ConsultantAccount, isNewRegistration?: boolean) => void;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({ onAuthenticate }) => {
  const [selectedRole, setSelectedRole] = useState<AuthRole | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'selection' | 'form' | 'otp' | 'verified'>('selection');

  // Load registered customer accounts from localStorage database
  const [registeredCustomers, setRegisteredCustomers] = useState<CustomerAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REGISTERED_CUSTOMERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load registered customers:', e);
    }
    return INITIAL_REGISTERED_CUSTOMERS;
  });

  // Customer Form State
  const [customerForm, setCustomerForm] = useState({
    name: DEFAULT_CUSTOMER_ACCOUNT.name,
    email: DEFAULT_CUSTOMER_ACCOUNT.email,
    phone: DEFAULT_CUSTOMER_ACCOUNT.phone,
    password: '••••••••••••'
  });

  // Consultant Form State
  const [consultantForm, setConsultantForm] = useState({
    name: DEFAULT_CONSULTANT_ACCOUNT.name,
    email: DEFAULT_CONSULTANT_ACCOUNT.email,
    phone: DEFAULT_CONSULTANT_ACCOUNT.phone,
    password: '••••••••••••',
    consultantId: DEFAULT_CONSULTANT_ACCOUNT.id,
    orgCode: DEFAULT_CONSULTANT_ACCOUNT.organizationCode
  });

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(['8', '4', '9', '2', '0', '1']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');

  // Sync registered customers to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REGISTERED_CUSTOMERS, JSON.stringify(registeredCustomers));
    } catch (e) {
      console.warn('Failed to persist registered customers:', e);
    }
  }, [registeredCustomers]);

  const handleSelectRole = (role: AuthRole) => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleSwitchToRegister = () => {
    setAuthMode('register');
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      password: ''
    });
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
    // Pre-populate with first available registered account
    const defaultAcc = registeredCustomers[0] || DEFAULT_CUSTOMER_ACCOUNT;
    setCustomerForm({
      name: defaultAcc.name,
      email: defaultAcc.email,
      phone: defaultAcc.phone,
      password: '••••••••••••'
    });
  };

  const handleSelectCustomerAccountFromList = (acc: CustomerAccount) => {
    setCustomerForm({
      name: acc.name,
      email: acc.email,
      phone: acc.phone,
      password: '••••••••••••'
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
    setOtpError(null);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      return;
    }
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join('');
    if (code.length < 6 && !showSecurityQuestion) {
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    setTimeout(() => {
      setIsVerifyingOtp(false);
      setStep('verified');
      
      // After brief verification screen, enter platform
      setTimeout(() => {
        if (selectedRole === 'customer') {
          const emailInput = customerForm.email.trim().toLowerCase();
          const phoneInput = customerForm.phone.trim();
          const nameInput = customerForm.name.trim();

          // 1. Check if account already exists in DB
          let existingAcc = registeredCustomers.find(c => 
            (c.email && c.email.toLowerCase() === emailInput) ||
            (c.phone && c.phone === phoneInput)
          );

          let finalAccount: CustomerAccount;

          if (authMode === 'register' || !existingAcc) {
            // Create brand new account in DB
            const uniqueSuffix = Date.now().toString().slice(-4);
            const newCusId = `CUS-${1000 + registeredCustomers.length + 1}-${uniqueSuffix}`;
            const newAccNum = `ACC-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
            const finalName = nameInput || (emailInput.split('@')[0] ? emailInput.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'New Customer');

            finalAccount = {
              id: authMode === 'register' ? newCusId : (existingAcc ? existingAcc.id : newCusId),
              name: finalName,
              email: customerForm.email.trim() || 'user@example.com',
              phone: customerForm.phone.trim() || '+91 98000 00000',
              accountNumber: authMode === 'register' ? newAccNum : (existingAcc ? existingAcc.accountNumber : newAccNum),
              customerType: 'Registered User',
              isVerified: true,
              verificationMethod: showSecurityQuestion ? 'Security Questions' : 'OTP',
              verifiedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
            };

            // Save to DB in localStorage
            setRegisteredCustomers(prev => {
              const filtered = prev.filter(c => c.email.toLowerCase() !== finalAccount.email.toLowerCase() && c.id !== finalAccount.id);
              const updated = [...filtered, finalAccount];
              try {
                localStorage.setItem(STORAGE_KEY_REGISTERED_CUSTOMERS, JSON.stringify(updated));
              } catch (e) {
                console.warn('Failed to save customer account to DB:', e);
              }
              return updated;
            });
          } else {
            // Found existing account in DB (e.g. Amit Singh or Rohan Mehta)
            finalAccount = {
              ...existingAcc,
              isVerified: true,
              verificationMethod: showSecurityQuestion ? 'Security Questions' : 'OTP',
              verifiedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
            };
          }

          onAuthenticate('customer', finalAccount, authMode === 'register');
        } else {
          // Consultant authentication
          const consultantAccount: ConsultantAccount = {
            id: consultantForm.consultantId || DEFAULT_CONSULTANT_ACCOUNT.id,
            name: consultantForm.name || DEFAULT_CONSULTANT_ACCOUNT.name,
            email: consultantForm.email || DEFAULT_CONSULTANT_ACCOUNT.email,
            phone: consultantForm.phone || DEFAULT_CONSULTANT_ACCOUNT.phone,
            organizationCode: consultantForm.orgCode || 'DUTRO-GLOBAL',
            roleTitle: 'Privacy Operations Consultant',
            isVerified: true,
            verifiedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'
          };
          onAuthenticate('consultant', consultantAccount);
        }
      }, 900);
    }, 600);
  };

  const handleQuickDemoLogin = (role: AuthRole, acc?: CustomerAccount) => {
    setSelectedRole(role);
    setStep('verified');
    setTimeout(() => {
      if (role === 'customer') {
        onAuthenticate('customer', acc || DEFAULT_CUSTOMER_ACCOUNT);
      } else {
        onAuthenticate('consultant', DEFAULT_CONSULTANT_ACCOUNT);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col justify-between text-slate-800 font-sans select-none antialiased">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-slate-900">DUTRO</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200 uppercase">
                PRIVACY OPS &amp; DSR
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{MASTER_CLIENT.name} Privacy Operations Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Statutory Basis:</span>
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
            DPDP Act 2023 / GDPR Art. 15
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 z-10">
        <div className="w-full max-w-4xl">
          
          {/* STEP 1: ROLE SELECTION */}
          {step === 'selection' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Single Product • Two Dedicated Role Portals</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  How would you like to continue?
                </h1>
                <p className="text-slate-500 max-w-lg mx-auto text-xs sm:text-sm">
                  Choose your role to access the authenticated portal. Both experiences operate on the same live Dutro DSR engine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                
                {/* ROLE CARD 1: CUSTOMER */}
                <div 
                  onClick={() => handleSelectRole('customer')}
                  className="group bg-white hover:bg-slate-50/50 border-2 border-slate-200 hover:border-blue-500 rounded-2xl p-7 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">ROLE 01</span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.2 rounded border border-blue-200 font-semibold">Data Principal</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mt-1 group-hover:text-blue-700 transition-colors">
                        CUSTOMER
                      </h2>
                      <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                        "I want to submit and track my personal data access request."
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Submit Right of Access / DSAR requests</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Real-time simplified request progress tracking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Download response package &amp; raise grievances</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                    <button 
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <span>Continue as Customer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickDemoLogin('customer', DEFAULT_CUSTOMER_ACCOUNT);
                        }}
                        className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer"
                      >
                        ⚡ 1-Click Demo Login as Rohan Mehta
                      </button>
                    </div>
                  </div>
                </div>

                {/* ROLE CARD 2: DUTRO CONSULTANT */}
                <div 
                  onClick={() => handleSelectRole('consultant')}
                  className="group bg-white hover:bg-slate-50/50 border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-7 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">ROLE 02</span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.2 rounded border border-indigo-200 font-semibold">Advisory &amp; Ops</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">
                        DUTRO CONSULTANT
                      </h2>
                      <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                        "I manage and process DSR requests assigned to me."
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Assignment-aware DSR operational workspace</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Data discovery, redaction review &amp; statutory validation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>DSR-linked Grievance management &amp; statutory SLA radar</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                    <button 
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <span>Continue as Consultant</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickDemoLogin('consultant');
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline font-semibold cursor-pointer"
                      >
                        ⚡ 1-Click Demo Login as Harshit Patel
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: LOGIN / REGISTER FORM */}
          {step === 'form' && selectedRole && (
            <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-md animate-fadeIn">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <button 
                  onClick={() => setStep('selection')}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center space-x-1 font-medium cursor-pointer"
                >
                  <span>← Back to Role Selection</span>
                </button>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  selectedRole === 'customer' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {selectedRole === 'customer' ? 'Customer Portal' : 'Consultant Portal'}
                </span>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {authMode === 'login' ? 'Sign In to Dutro' : 'Create Account'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedRole === 'customer' 
                    ? (authMode === 'login' ? 'Access your personal data requests securely' : 'Register your new customer profile in Dutro database')
                    : 'Log in to your assigned Dutro privacy operations workspace'}
                </p>
              </div>

              {/* Tab Switcher: Login vs Create Account (Customer Role) */}
              {selectedRole === 'customer' && (
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 mb-6">
                  <button
                    type="button"
                    onClick={handleSwitchToLogin}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMode === 'login' 
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchToRegister}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                      authMode === 'register' 
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Create Account</span>
                  </button>
                </div>
              )}

              {/* Quick Account Selector in Login Mode */}
              {selectedRole === 'customer' && authMode === 'login' && registeredCustomers.length > 0 && (
                <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                      <Users className="w-3 h-3 text-blue-600" />
                      <span>Registered DB Accounts ({registeredCustomers.length}):</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">1-Click Select</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto custom-scroll pr-1">
                    {registeredCustomers.map((acc) => {
                      const isSelected = customerForm.email.toLowerCase() === acc.email.toLowerCase();
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => handleSelectCustomerAccountFromList(acc)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="truncate">
                            <span className="font-bold block text-[11px] truncate">{acc.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">{acc.email}</span>
                          </div>
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 ml-2">
                            {acc.id}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {authMode === 'register' && selectedRole === 'customer' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={customerForm.name}
                      onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                      placeholder="e.g. Amit Singh"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-500 shadow-2xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {selectedRole === 'customer' ? 'Email Address' : 'Work Email'}
                  </label>
                  <input 
                    type="email"
                    required
                    value={selectedRole === 'customer' ? customerForm.email : consultantForm.email}
                    onChange={(e) => {
                      if (selectedRole === 'customer') {
                        setCustomerForm({ ...customerForm, email: e.target.value });
                      } else {
                        setConsultantForm({ ...consultantForm, email: e.target.value });
                      }
                    }}
                    placeholder={selectedRole === 'customer' ? 'e.g. amit.singh@example.com' : 'harshit.patel@dutro.example'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input 
                    type="tel"
                    required
                    value={selectedRole === 'customer' ? customerForm.phone : consultantForm.phone}
                    onChange={(e) => {
                      if (selectedRole === 'customer') {
                        setCustomerForm({ ...customerForm, phone: e.target.value });
                      } else {
                        setConsultantForm({ ...consultantForm, phone: e.target.value });
                      }
                    }}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-500 shadow-2xs"
                  />
                </div>

                {selectedRole === 'consultant' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Consultant ID / Organization Code</label>
                    <input 
                      type="text"
                      required
                      value={consultantForm.consultantId}
                      onChange={(e) => setConsultantForm({ ...consultantForm, consultantId: e.target.value })}
                      placeholder="e.g. DUTRO-CON-01"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:bg-white focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input 
                    type="password"
                    required
                    value={selectedRole === 'customer' ? customerForm.password : consultantForm.password}
                    onChange={(e) => {
                      if (selectedRole === 'customer') {
                        setCustomerForm({ ...customerForm, password: e.target.value });
                      } else {
                        setConsultantForm({ ...consultantForm, password: e.target.value });
                      }
                    }}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer ${
                      selectedRole === 'customer'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <span>{authMode === 'login' ? 'Proceed to 2FA Verification' : 'Create Account & Verify OTP'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Demo 1-Click Fast Path */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 mb-1">Want to demo a pre-loaded account?</p>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedRole)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  ⚡ Instant Demo Sign-In as {selectedRole === 'customer' ? 'Rohan Mehta' : 'Harshit Patel'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OTP 2FA VERIFICATION */}
          {step === 'otp' && (
            <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-md animate-fadeIn">
              <div className="text-center space-y-1.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-2">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Verify your account</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We sent a one-time password to your registered email and mobile:
                </p>
                <div className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 py-1 px-3 rounded-lg border border-blue-200 inline-block">
                  {selectedRole === 'customer' ? customerForm.email : consultantForm.email}
                </div>
              </div>

              {!showSecurityQuestion ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-center text-xs font-semibold text-slate-700 mb-2.5">
                      Enter 6-digit One-Time Password (OTP)
                    </label>
                    <div className="flex justify-between gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none text-slate-900 transition-colors"
                        />
                      ))}
                    </div>
                    {otpError && (
                      <p className="text-xs text-red-600 text-center mt-2">{otpError}</p>
                    )}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify &amp; Enter Portal</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setOtpDigits(['8', '4', '9', '2', '0', '1'])}
                      className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSecurityQuestion(true)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 font-semibold cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Use Security Question</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Security Question Alternative */
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Security Question:</span>
                    <p className="text-xs font-semibold text-slate-900 mt-0.5">
                      "What was the name of your first school?"
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Answer</label>
                    <input 
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      placeholder="e.g. St. Xavier High School"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Verify Security Answer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setShowSecurityQuestion(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      ← Back to OTP Verification
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: VERIFICATION SUCCESS */}
          {step === 'verified' && (
            <div className="max-w-md mx-auto bg-white border border-emerald-300 rounded-2xl p-8 shadow-md text-center space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                ✓ {selectedRole === 'customer' ? 'Account Verified' : 'Consultant Verified'}
              </h2>
              <p className="text-xs text-slate-500">
                Authentication successful. Loading your dedicated {selectedRole === 'customer' ? 'Customer' : 'Consultant'} workspace...
              </p>
              <div className="w-40 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-emerald-500 animate-pulse w-full" />
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-xs text-slate-500">
        Dutro Privacy Operations Engine • Single Persistent Data Architecture • DPDP Act 2023 &amp; GDPR Compliant
      </footer>
    </div>
  );
};
