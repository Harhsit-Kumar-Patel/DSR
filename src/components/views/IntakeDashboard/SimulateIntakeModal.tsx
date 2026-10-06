import React, { useState } from 'react';
import { useIntake } from '../../../context/IntakeContext';
import { IntakeChannel } from '../../../types/intake';
import { SIMULATION_PRESETS } from '../../../mockData/intakeData';
import { SectionLabel } from '../../ui/SectionLabel';
import { X, Sparkles } from 'lucide-react';

interface SimulateIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulateIntakeModal: React.FC<SimulateIntakeModalProps> = ({
  isOpen,
  onClose
}) => {
  const { simulateInboundRequest } = useIntake();

  const [activeChannel, setActiveChannel] = useState<IntakeChannel>('whatsapp');
  const [requesterName, setRequesterName] = useState('Anand Kumar');
  const [requesterEmail, setRequesterEmail] = useState('anand.kumar@techventures.in');
  const [requesterPhone, setRequesterPhone] = useState('+91 98450 11223');
  const [persona, setPersona] = useState<'Customer' | 'Employee' | 'Job Candidate' | 'Partner/Vendor' | 'Anonymous User'>('Customer');
  const [rawPayload, setRawPayload] = useState(
    'Hello, please delete all my financial records and marketing contacts from your servers immediately under DPDP right to be forgotten. I closed my credit card account last week.'
  );

  if (!isOpen) return null;

  const channels: { id: IntakeChannel; label: string }[] = [
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'email', label: 'Email' },
    { id: 'chatbot', label: 'Chatbot' },
    { id: 'webform', label: 'Webform' },
    { id: 'calls', label: 'Customer Call' },
    { id: 'social', label: 'Social Media' },
    { id: 'app_stores', label: 'App Stores' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'google_web', label: 'Google / Home' }
  ];

  const handleApplyPreset = (preset: typeof SIMULATION_PRESETS[0]) => {
    setActiveChannel(preset.channel);
    setRequesterName(preset.requesterName);
    setRequesterEmail(preset.requesterEmail);
    setRequesterPhone(preset.requesterPhone);
    setPersona(preset.persona);
    setRawPayload(preset.rawPayload);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateInboundRequest({
      channel: activeChannel,
      requesterName,
      requesterEmail,
      requesterPhone,
      persona,
      rawPayload
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-[1px] animate-fade-in select-none">
      <div 
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border-def)',
          borderRadius: '4px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          maxWidth: '640px',
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
              Simulate Inbound Request
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Select a channel or 1-click preset to test ingestion.
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
        <div style={{ padding: '20px' }} className="overflow-y-auto custom-scroll space-y-5 flex-1">
          
          {/* Quick 1-Click Presets */}
          <div className="space-y-1.5">
            <SectionLabel>Quick Presets</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {SIMULATION_PRESETS.slice(0, 5).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-def)',
                    color: 'var(--text-sec)',
                    cursor: 'pointer'
                  }}
                  className="hover:border-blue-300 transition-colors"
                >
                  {preset.channel.toUpperCase()}: {preset.expectedCategory.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Channel Selection */}
            <div className="space-y-1.5">
              <SectionLabel>Select Channel (9 Channels)</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {channels.map(ch => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveChannel(ch.id)}
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      padding: '5px 9px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: activeChannel === ch.id ? 'var(--accent)' : 'var(--accent-sub)',
                      color: activeChannel === ch.id ? '#ffffff' : 'var(--accent)',
                      border: activeChannel === ch.id ? '1px solid var(--accent)' : '1px solid var(--accent-bdr)'
                    }}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <SectionLabel>Requester Name</SectionLabel>
                <input
                  type="text"
                  required
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
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
                <SectionLabel>Email Address</SectionLabel>
                <input
                  type="email"
                  required
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
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
              <SectionLabel>Inbound Message Payload / Transcript</SectionLabel>
              <textarea
                rows={3}
                required
                value={rawPayload}
                onChange={(e) => setRawPayload(e.target.value)}
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
                  cursor: 'pointer'
                }}
              >
                Inject Request
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
