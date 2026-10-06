import React, { useState } from 'react';
import { useIntake } from '../../../context/IntakeContext';
import { IntakeRequest } from '../../../types/intake';
import { SectionLabel } from '../../ui/SectionLabel';
import { X, CheckCircle2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequesterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
}

export const RequesterFormModal: React.FC<RequesterFormModalProps> = ({
  isOpen,
  onClose,
  requestId
}) => {
  const { requests, submitSupplementaryForm } = useIntake();

  const currentReq = requests.find((r: IntakeRequest) => r.id === requestId);

  const [idProofType, setIdProofType] = useState('National ID / Aadhaar (Masked)');
  const [uploadedFileName] = useState('govt_id_proof_scan.pdf');
  const [requesterNotes, setRequesterNotes] = useState(
    'I confirm my identity and verify that the requested scope applies to all accounts registered under my mobile number.'
  );
  const [declaredConsent, setDeclaredConsent] = useState(true);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isOpen || !currentReq) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSupplementaryForm(currentReq.id, {
      idProofUploaded: true,
      idProofType,
      idProofFileName: uploadedFileName,
      requesterNotes
    });

    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log(err);
    }

    setIsSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-[1px] animate-fade-in select-none">
      <div 
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border-def)',
          borderRadius: '4px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh'
        }}
        className="flex flex-col overflow-hidden text-slate-900"
      >
        
        {/* Header */}
        <div 
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-muted)'
          }}
          className="flex items-center justify-between"
        >
          <div className="space-y-0.5">
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-pri)' }}>
              Requester Simulator: {currentReq.attachedForm.formTitle}
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Case Reference: {currentReq.id} • {currentReq.requesterName}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }} className="overflow-y-auto custom-scroll space-y-4 flex-1">
          
          {isSubmittedSuccess ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-pri)' }}>
                Verification Complete
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-sec)' }}>
                Thank you, {currentReq.requesterName}. Your uploaded verification proof has been registered and verified for Case ID <strong>{currentReq.id}</strong>.
              </p>
              <button
                onClick={onClose}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  background: 'var(--accent)',
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '12px'
                }}
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div 
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-def)',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: 'var(--text-sec)'
                }}
              >
                Under the DPDP Act 2023, identity confirmation is required before personal records are disclosed or erased.
              </div>

              <div className="space-y-1">
                <SectionLabel>Identity Verification Document</SectionLabel>
                <select
                  value={idProofType}
                  onChange={(e) => setIdProofType(e.target.value)}
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
                  <option value="National ID / Aadhaar (Masked)">National ID / Aadhaar (Masked)</option>
                  <option value="Passport (First & Last Page)">Passport (First &amp; Last Page)</option>
                  <option value="Driver License">Driver License</option>
                  <option value="Voter Identity Card">Voter Identity Card</option>
                </select>
              </div>

              <div className="space-y-1">
                <SectionLabel>Attached File Proof</SectionLabel>
                <div 
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-def)',
                    borderRadius: '4px',
                    padding: '8px 11px',
                    fontSize: '12px',
                    color: 'var(--text-sec)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{uploadedFileName}</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#16a34a' }}>Attached</span>
                </div>
              </div>

              <div className="space-y-1">
                <SectionLabel>Scope Notes &amp; Declarations</SectionLabel>
                <textarea
                  rows={2}
                  value={requesterNotes}
                  onChange={(e) => setRequesterNotes(e.target.value)}
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

              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  required
                  checked={declaredConsent}
                  onChange={(e) => setDeclaredConsent(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="consentCheckbox" style={{ fontSize: '11px', color: 'var(--text-sec)', lineHeight: 1.4 }}>
                  I confirm that I am the data principal authorized to verify this request with Client Organization.
                </label>
              </div>

              <div 
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-muted)',
                  gap: '8px'
                }}
                className="flex items-center justify-end"
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    height: '36px',
                    padding: '0 14px',
                    background: 'var(--bg-page)',
                    border: '1px solid var(--border-def)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-sec)',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    height: '36px',
                    padding: '0 16px',
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Form</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
