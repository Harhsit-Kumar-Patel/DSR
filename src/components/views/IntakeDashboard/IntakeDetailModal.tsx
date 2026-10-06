import React, { useState } from 'react';
import { useIntake } from '../../../context/IntakeContext';
import { 
  IntakeRequest, 
  RequestCategory, 
  TargetDepartment 
} from '../../../types/intake';
import { RightPanel } from '../../ui/RightPanel';
import { SectionLabel } from '../../ui/SectionLabel';
import { PriorityBadge } from '../../ui/PriorityBadge';
import { 
  ArrowRight, 
  FileCheck, 
  RotateCcw, 
  Play, 
  Pause 
} from 'lucide-react';

interface IntakeDetailModalProps {
  request: IntakeRequest;
  onClose: () => void;
  onPromoteToWorkspace: (dsrId: string) => void;
}

export const IntakeDetailModal: React.FC<IntakeDetailModalProps> = ({
  request,
  onClose,
  onPromoteToWorkspace
}) => {
  const { 
    updateRequestCategory, 
    transferRequest, 
    resendAcknowledgement,
    setIsRequesterFormOpen,
    setActiveRequesterFormRequestId,
    promoteToDSRCase
  } = useIntake();

  // Category Override state
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [tempCategory, setTempCategory] = useState<RequestCategory>(request.category);
  const [categoryReason, setCategoryReason] = useState('');

  // Department Transfer state
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedDept, setSelectedDept] = useState<TargetDepartment>(request.transferredTo.department);
  const [transferReason, setTransferReason] = useState('');

  // Voice player simulator state (for calls)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const departmentsList: {
    dept: TargetDepartment;
    owner: string;
    role: string;
    email: string;
  }[] = [
    {
      dept: 'Privacy & Compliance Office',
      owner: 'Ananya Mehta (Privacy Officer)',
      role: 'Data Protection Officer',
      email: 'privacy@client.example'
    },
    {
      dept: 'Customer Support Operations',
      owner: 'Neha Kapoor (Support Lead)',
      role: 'Customer Operations Manager',
      email: 'support-ops@client.example'
    },
    {
      dept: 'HR & Talent Privacy',
      owner: 'Vikram Singhania (Head of HR Operations)',
      role: 'HR Privacy Lead',
      email: 'hr-privacy@client.example'
    },
    {
      dept: 'IT & Security Engineering',
      owner: 'Amit Shah (Head of Information Security)',
      role: 'CISO / Lead Security Engineer',
      email: 'infosec@client.example'
    },
    {
      dept: 'Billing & Accounts Operations',
      owner: 'Rahul Verma (Operations)',
      role: 'Operations Lead',
      email: 'operations@client.example'
    },
    {
      dept: 'Legal & Regulatory Counsel',
      owner: 'Meera Sen (Chief Legal Officer)',
      role: 'Head of Legal & Regulatory Affairs',
      email: 'legal-privacy@client.example'
    }
  ];

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    updateRequestCategory(request.id, tempCategory, categoryReason || 'Manual adjustment by Privacy Officer');
    setIsEditingCategory(false);
    setCategoryReason('');
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const target = departmentsList.find(d => d.dept === selectedDept) || departmentsList[0];
    transferRequest(
      request.id,
      target.dept,
      target.owner,
      target.role,
      target.email,
      transferReason || `Transferred to ${target.dept} by Privacy Operations`
    );
    setIsTransferring(false);
    setTransferReason('');
  };

  const handleOpenFormSimulator = () => {
    setActiveRequesterFormRequestId(request.id);
    setIsRequesterFormOpen(true);
  };

  const handlePromote = () => {
    const dsrId = promoteToDSRCase(request.id);
    onClose();
    onPromoteToWorkspace(dsrId);
  };

  return (
    <RightPanel
      isOpen={Boolean(request)}
      onClose={onClose}
      title={`${request.id} — Triage & Transfer`}
      subtitle={`Received from ${request.requesterName} (${request.channel.replace('_', ' ')}) • ${request.receivedAt}`}
      width="480px"
      footer={
        <>
          <button
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
            Close
          </button>
          <button
            onClick={handlePromote}
            style={{
              height: '36px',
              padding: '0 16px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Promote to DSR Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </>
      }
    >
      {/* 1. Inbound Raw Payload */}
      <div className="space-y-1.5">
        <SectionLabel>1. Inbound Raw Payload ({request.channel.replace('_', ' ')})</SectionLabel>
        
        {request.channel === 'calls' && (
          <div 
            className="flex items-center justify-between p-2.5 mb-2"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-def)',
              borderRadius: '4px'
            }}
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-pri)' }}>
                IVR Call Recording ({request.audioDuration || '03:42 mins'})
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {isPlayingAudio ? 'Playing...' : 'Audio Ready'}
            </span>
          </div>
        )}

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-def)',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '12px',
            lineHeight: 1.5,
            color: 'var(--text-pri)',
            whiteSpace: 'pre-wrap'
          }}
        >
          {request.callTranscript || request.rawPayload}
        </div>

        {/* Entities */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {request.extractedEntities.statutoryKeywords.map((kw: string, i: number) => (
            <span
              key={i}
              style={{
                fontSize: '11px',
                fontWeight: 500,
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'var(--accent-sub)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-bdr)'
              }}
            >
              {kw}
            </span>
          ))}
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>
            Sentiment: {request.extractedEntities.sentiment}
          </span>
        </div>
      </div>

      {/* 2. Categorization */}
      <div className="space-y-1.5 pt-2" style={{ borderTop: '1px solid var(--border-muted)' }}>
        <div className="flex items-center justify-between">
          <SectionLabel>2. Request Categorization</SectionLabel>
          <button
            onClick={() => setIsEditingCategory(!isEditingCategory)}
            style={{ fontSize: '11px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            {isEditingCategory ? 'Cancel' : 'Change Category'}
          </button>
        </div>

        {isEditingCategory ? (
          <form onSubmit={handleSaveCategory} className="space-y-2.5 pt-1">
            <select
              value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value as RequestCategory)}
              style={{
                width: '100%',
                height: '36px',
                padding: '0 11px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-def)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--text-pri)',
                outline: 'none'
              }}
            >
              <option value="Right of Access (DSAR)">Right of Access (DSAR)</option>
              <option value="Right to Erasure / Deletion">Right to Erasure</option>
              <option value="Right to Rectification / Correction">Right to Correction</option>
              <option value="Consent Revocation / Opt-Out">Consent Revocation</option>
              <option value="Data Portability">Data Portability</option>
              <option value="Grievance / Escalation">Grievance / Escalation</option>
              <option value="Security & Breach Inquiry">Security & Breach Inquiry</option>
              <option value="General Privacy Query">General Privacy Query</option>
            </select>

            <input
              type="text"
              required
              placeholder="Reason for change..."
              value={categoryReason}
              onChange={(e) => setCategoryReason(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                padding: '8px 11px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-def)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--text-pri)',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              style={{
                height: '32px',
                padding: '0 12px',
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Save Re-classification
            </button>
          </form>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pri)' }}>
                {request.category}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#16a34a' }}>
                {request.categoryConfidence}% Confidence
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {request.statutoryAct} • {request.slaDays} calendar days SLA
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-sec)', marginTop: '4px' }}>
              {request.categoryReasoning}
            </p>
          </div>
        )}
      </div>

      {/* 3. Whom to Transfer */}
      <div className="space-y-1.5 pt-2" style={{ borderTop: '1px solid var(--border-muted)' }}>
        <div className="flex items-center justify-between">
          <SectionLabel>3. Whom to Transfer</SectionLabel>
          <button
            onClick={() => setIsTransferring(!isTransferring)}
            style={{ fontSize: '11px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            {isTransferring ? 'Cancel' : 'Re-assign'}
          </button>
        </div>

        {isTransferring ? (
          <form onSubmit={handleExecuteTransfer} className="space-y-2.5 pt-1">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as TargetDepartment)}
              style={{
                width: '100%',
                height: '36px',
                padding: '0 11px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-def)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--text-pri)',
                outline: 'none'
              }}
            >
              {departmentsList.map(d => (
                <option key={d.dept} value={d.dept}>
                  {d.dept} — {d.owner}
                </option>
              ))}
            </select>

            <input
              type="text"
              required
              placeholder="Transfer note / instruction..."
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                padding: '8px 11px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-def)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--text-pri)',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              style={{
                height: '32px',
                padding: '0 12px',
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Execute Transfer
            </button>
          </form>
        ) : (
          <div className="space-y-0.5">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pri)', display: 'block' }}>
              {request.transferredTo.department}
            </span>
            <p style={{ fontSize: '12px', color: 'var(--text-sec)' }}>
              Assigned Lead: {request.transferredTo.assignedOwner} ({request.transferredTo.ownerRole})
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Routing Note: {request.transferredTo.transferReason}
            </p>
          </div>
        )}
      </div>

      {/* 4. Automated Acknowledgement */}
      <div className="space-y-1.5 pt-2" style={{ borderTop: '1px solid var(--border-muted)' }}>
        <div className="flex items-center justify-between">
          <SectionLabel>4. Automated Acknowledgement</SectionLabel>
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#16a34a' }}>
            {request.acknowledgement.status}
          </span>
        </div>

        <div 
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-def)',
            borderRadius: '4px',
            padding: '10px 12px',
            fontSize: '12px'
          }}
          className="space-y-1"
        >
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Delivered via:</span>
            <span style={{ color: 'var(--text-pri)', fontWeight: 500, textTransform: 'capitalize' }}>{request.acknowledgement.channel}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Tracking Token:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 500 }}>{request.acknowledgement.trackingToken}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Recipient:</span>
            <span style={{ color: 'var(--text-pri)' }}>{request.acknowledgement.recipientContact}</span>
          </div>
        </div>

        <button
          onClick={() => resendAcknowledgement(request.id)}
          style={{
            fontSize: '11px',
            color: 'var(--accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '4px'
          }}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Resend Acknowledgement</span>
        </button>
      </div>

      {/* 5. Attached Supplementary Form */}
      <div className="space-y-1.5 pt-2" style={{ borderTop: '1px solid var(--border-muted)' }}>
        <div className="flex items-center justify-between">
          <SectionLabel>5. Attached Supplementary Form</SectionLabel>
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 500, 
              color: request.attachedForm.status === 'Completed & Verified' ? '#16a34a' : '#ea580c' 
            }}
          >
            {request.attachedForm.status === 'Completed & Verified' ? 'Verified' : 'Pending Submission'}
          </span>
        </div>

        <div className="space-y-0.5">
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-pri)', display: 'block' }}>
            {request.attachedForm.formTitle}
          </span>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Type: {request.attachedForm.formType}
          </p>
        </div>

        <button
          onClick={handleOpenFormSimulator}
          style={{
            width: '100%',
            height: '36px',
            background: 'var(--accent-sub)',
            color: 'var(--accent)',
            border: '1px solid var(--accent-bdr)',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '8px'
          }}
        >
          <FileCheck className="w-4 h-4" />
          <span>Test &amp; Fill Form (Requester Simulator)</span>
        </button>
      </div>

    </RightPanel>
  );
};
