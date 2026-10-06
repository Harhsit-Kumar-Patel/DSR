import React, { useState } from 'react';
import { useIntake } from '../../../context/IntakeContext';
import { TargetDepartment } from '../../../types/intake';
import { SectionLabel } from '../../ui/SectionLabel';
import { 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  Code, 
  Eye, 
  Settings2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WebformStudio: React.FC = () => {
  const { 
    webformConfig, 
    updateWebformConfig, 
    submitWebformPublic
  } = useIntake();

  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'builder' | 'embed'>('preview');

  // Preview form test inputs
  const [testFullName, setTestFullName] = useState('Ananya Sen');
  const [testEmail, setTestEmail] = useState('ananya.sen@mumbaidesign.com');
  const [testPhone, setTestPhone] = useState('+91 98200 44551');
  const [testPersona, setTestPersona] = useState('Registered User');
  const [testCategory, setTestCategory] = useState('Right of Access (DSAR) - DPDP Sec. 11 / GDPR Art. 15');
  const [testAccountNumber, setTestAccountNumber] = useState('ACC-88190021');
  const [testDescription, setTestDescription] = useState(
    'I would like a copy of all my credit card transaction records, loan repayment logs, and support dispute history held by Client Organization.'
  );

  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCaseId = submitWebformPublic({
      fullName: testFullName,
      email: testEmail,
      phone: testPhone,
      persona: testPersona,
      requestCategory: testCategory,
      accountNumber: testAccountNumber,
      description: testDescription
    });

    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }

    setSubmittedCaseId(newCaseId);
  };

  const handleCopyEmbed = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const iframeSnippet = `<iframe
  src="https://privacy.client.example/embed/request-form"
  width="100%"
  height="700px"
  frameborder="0"
  style="border-radius: 4px; border: 1px solid #E5E3DF;"
></iframe>`;

  const reactSnippet = `import { DutroPrivacyWebform } from '@dutro/privacy-react';

export function PrivacyPortal() {
  return (
    <DutroPrivacyWebform
      organizationId="CLIENT-001"
      themeColor="${webformConfig.themeColor}"
      requireOtpVerification={${webformConfig.requireOtpVerification}}
      requireIdProof={${webformConfig.requireIdProof}}
      onSuccess={(caseId) => console.log('Case Ingested:', caseId)}
    />
  );
}`;

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pri)', letterSpacing: '-0.01em' }}>
            Statutory Webform Studio
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-sec)' }}>
            Configure and test public statutory DSAR webforms for your website.
          </p>
        </div>

        {/* View Switcher Chips */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('preview')}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: activeSubTab === 'preview' ? 'var(--accent)' : 'var(--accent-sub)',
              color: activeSubTab === 'preview' ? '#ffffff' : 'var(--accent)',
              border: activeSubTab === 'preview' ? '1px solid var(--accent)' : '1px solid var(--accent-bdr)'
            }}
          >
            Live Preview &amp; Test
          </button>

          <button
            onClick={() => setActiveSubTab('builder')}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: activeSubTab === 'builder' ? 'var(--accent)' : 'var(--accent-sub)',
              color: activeSubTab === 'builder' ? '#ffffff' : 'var(--accent)',
              border: activeSubTab === 'builder' ? '1px solid var(--accent)' : '1px solid var(--accent-bdr)'
            }}
          >
            Form Settings
          </button>

          <button
            onClick={() => setActiveSubTab('embed')}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: activeSubTab === 'embed' ? 'var(--accent)' : 'var(--accent-sub)',
              color: activeSubTab === 'embed' ? '#ffffff' : 'var(--accent)',
              border: activeSubTab === 'embed' ? '1px solid var(--accent)' : '1px solid var(--accent-bdr)'
            }}
          >
            Embed Codes
          </button>
        </div>
      </div>

      {/* Subtab: Preview & Test */}
      {activeSubTab === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Form preview sitting on white card (8 cols) */}
          <div className="lg:col-span-8">
            <div 
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border-def)',
                borderRadius: '4px',
                padding: '28px'
              }}
              className="space-y-6"
            >
              <div className="space-y-1.5 pb-4" style={{ borderBottom: '1px solid var(--border-def)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pri)' }}>
                  {webformConfig.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-sec)' }}>
                  {webformConfig.organizationName} • DPDP Compliance Portal
                </p>
                <div 
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-def)',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: 'var(--text-sec)',
                    marginTop: '8px'
                  }}
                >
                  {webformConfig.statutoryNotice}
                </div>
              </div>

              {submittedCaseId ? (
                <div className="p-8 text-center space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pri)' }}>
                    Request Registered ({submittedCaseId})
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-sec)' }}>
                    An automated acknowledgement and 2FA verification token have been dispatched to <strong>{testEmail}</strong>.
                  </p>
                  <button
                    onClick={() => setSubmittedCaseId(null)}
                    style={{
                      height: '36px',
                      padding: '0 16px',
                      background: 'var(--accent)',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Submit Another Test Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTestSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <SectionLabel>Full Legal Name *</SectionLabel>
                      <input
                        type="text"
                        required
                        value={testFullName}
                        onChange={(e) => setTestFullName(e.target.value)}
                        style={{
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-def)',
                          borderRadius: '4px',
                          height: '36px',
                          padding: '8px 11px',
                          fontSize: '13px',
                          color: 'var(--text-pri)',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <SectionLabel>Email Address *</SectionLabel>
                      <input
                        type="email"
                        required
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        style={{
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-def)',
                          borderRadius: '4px',
                          height: '36px',
                          padding: '8px 11px',
                          fontSize: '13px',
                          color: 'var(--text-pri)',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <SectionLabel>Mobile Phone *</SectionLabel>
                      <input
                        type="text"
                        required
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        style={{
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-def)',
                          borderRadius: '4px',
                          height: '36px',
                          padding: '8px 11px',
                          fontSize: '13px',
                          color: 'var(--text-pri)',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <SectionLabel>Relationship Persona *</SectionLabel>
                      <select
                        value={testPersona}
                        onChange={(e) => setTestPersona(e.target.value)}
                        style={{
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-def)',
                          borderRadius: '4px',
                          height: '36px',
                          padding: '0 11px',
                          fontSize: '13px',
                          color: 'var(--text-pri)',
                          width: '100%',
                          outline: 'none'
                        }}
                      >
                        <option value="Registered User">Registered User</option>
                        <option value="Corporate Client Representative">Corporate Client Representative</option>
                        <option value="Former Customer">Former Customer</option>
                        <option value="Job Applicant / Candidate">Job Applicant / Candidate</option>
                        <option value="Current / Former Employee">Current / Former Employee</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <SectionLabel>Request Category *</SectionLabel>
                      <select
                        value={testCategory}
                        onChange={(e) => setTestCategory(e.target.value)}
                        style={{
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-def)',
                          borderRadius: '4px',
                          height: '36px',
                          padding: '0 11px',
                          fontSize: '13px',
                          color: 'var(--text-pri)',
                          width: '100%',
                          outline: 'none'
                        }}
                      >
                        <option value="Right of Access (DSAR) - DPDP Sec. 11 / GDPR Art. 15">Right of Access (DSAR)</option>
                        <option value="Right to Erasure / Account Deletion - DPDP Sec. 12 / GDPR Art. 17">Right to Erasure</option>
                        <option value="Right to Rectification / Correction - DPDP Sec. 12">Right to Rectification</option>
                        <option value="Revoke Marketing & Telemarketing Consent">Revoke Marketing Consent</option>
                        <option value="Data Portability (Export Machine-Readable Records)">Data Portability (Export)</option>
                        <option value="Formal Privacy Grievance / Complaint">Formal Privacy Grievance</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <SectionLabel>Account Number (Optional)</SectionLabel>
                      <input
                        type="text"
                        value={testAccountNumber}
                        onChange={(e) => setTestAccountNumber(e.target.value)}
                        style={{
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-def)',
                          borderRadius: '4px',
                          height: '36px',
                          padding: '8px 11px',
                          fontSize: '13px',
                          color: 'var(--text-pri)',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <SectionLabel>Request Description *</SectionLabel>
                    <textarea
                      rows={3}
                      required
                      value={testDescription}
                      onChange={(e) => setTestDescription(e.target.value)}
                      style={{
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-def)',
                        borderRadius: '4px',
                        padding: '8px 11px',
                        fontSize: '13px',
                        color: 'var(--text-pri)',
                        width: '100%',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      height: '36px',
                      padding: '0 20px',
                      background: 'var(--accent)',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '12px'
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request</span>
                  </button>

                </form>
              )}
            </div>
          </div>

          {/* Right: Clean Specs Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border-def)',
                borderRadius: '4px',
                padding: '20px'
              }}
              className="space-y-3"
            >
              <SectionLabel>Webform Specifications</SectionLabel>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Target Department:</span>
                  <span style={{ color: 'var(--text-pri)', fontWeight: 500 }}>{webformConfig.defaultAssignedDepartment}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>OTP Required:</span>
                  <span style={{ color: '#16a34a', fontWeight: 500 }}>Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Govt ID Proof:</span>
                  <span style={{ color: '#16a34a', fontWeight: 500 }}>Required</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>SLA Window:</span>
                  <span style={{ color: 'var(--text-pri)', fontWeight: 500 }}>30 Days</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Subtab: Settings */}
      {activeSubTab === 'builder' && (
        <div 
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border-def)',
            borderRadius: '4px',
            padding: '24px'
          }}
          className="space-y-5 max-w-2xl"
        >
          <div className="space-y-1 pb-3" style={{ borderBottom: '1px solid var(--border-def)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-pri)' }}>
              Webform Configuration
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Update form title, legal notice, and default routing department.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <SectionLabel>Webform Title</SectionLabel>
              <input
                type="text"
                value={webformConfig.title}
                onChange={(e) => updateWebformConfig({ title: e.target.value })}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-def)',
                  borderRadius: '4px',
                  height: '36px',
                  padding: '8px 11px',
                  fontSize: '13px',
                  color: 'var(--text-pri)',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>

            <div className="space-y-1">
              <SectionLabel>Default Target Department</SectionLabel>
              <select
                value={webformConfig.defaultAssignedDepartment}
                onChange={(e) => updateWebformConfig({ defaultAssignedDepartment: e.target.value as TargetDepartment })}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-def)',
                  borderRadius: '4px',
                  height: '36px',
                  padding: '0 11px',
                  fontSize: '13px',
                  color: 'var(--text-pri)',
                  width: '100%',
                  outline: 'none'
                }}
              >
                <option value="Privacy & Compliance Office">Privacy & Compliance Office</option>
                <option value="Customer Support Operations">Customer Support Operations</option>
                <option value="HR & Talent Privacy">HR & Talent Privacy</option>
                <option value="IT & Security Engineering">IT & Security Engineering</option>
                <option value="Billing & Accounts Operations">Billing & Accounts Operations</option>
                <option value="Legal & Regulatory Counsel">Legal & Regulatory Counsel</option>
              </select>
            </div>

            <div className="space-y-1">
              <SectionLabel>Statutory Notice Text</SectionLabel>
              <textarea
                rows={3}
                value={webformConfig.statutoryNotice}
                onChange={(e) => updateWebformConfig({ statutoryNotice: e.target.value })}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-def)',
                  borderRadius: '4px',
                  padding: '8px 11px',
                  fontSize: '13px',
                  color: 'var(--text-pri)',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Subtab: Embed Codes */}
      {activeSubTab === 'embed' && (
        <div 
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border-def)',
            borderRadius: '4px',
            padding: '24px'
          }}
          className="space-y-6 max-w-3xl"
        >
          <div className="space-y-1 pb-3" style={{ borderBottom: '1px solid var(--border-def)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-pri)' }}>
              Embed Snippets
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Copy HTML or React code to embed this form on external portals.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-pri)' }}>
                1. Responsive HTML iFrame
              </span>
              <button
                onClick={() => handleCopyEmbed(iframeSnippet)}
                style={{
                  fontSize: '11px',
                  color: 'var(--accent)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {isCopied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre 
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-def)',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-pri)'
              }}
            >
              {iframeSnippet}
            </pre>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-pri)' }}>
                2. React SDK Component
              </span>
              <button
                onClick={() => handleCopyEmbed(reactSnippet)}
                style={{
                  fontSize: '11px',
                  color: 'var(--accent)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {isCopied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre 
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-def)',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-pri)'
              }}
            >
              {reactSnippet}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
