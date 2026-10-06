import React, { useState } from 'react';
import { useIntake } from '../../../context/IntakeContext';
import { IntakeChannel, ChannelSummary } from '../../../types/intake';
import { DataTable, ColumnDef } from '../../ui/DataTable';
import { SectionLabel } from '../../ui/SectionLabel';

export const ChannelConnectorsTab: React.FC = () => {
  const { channelConfigs, setIsSimulatorOpen } = useIntake();

  const [selectedChannel, setSelectedChannel] = useState<IntakeChannel>('whatsapp');

  const getSamplePayload = (ch: IntakeChannel) => {
    switch (ch) {
      case 'email':
        return `{\n  "event": "email.received",\n  "message_id": "msg_992144",\n  "from": "requester@example.com",\n  "to": "privacy@client.example",\n  "subject": "DPDP Sec 11 Right of Access Request",\n  "spf_pass": true,\n  "dkim_pass": true\n}`;
      case 'whatsapp':
        return `{\n  "object": "whatsapp_business_account",\n  "entry": [{\n    "changes": [{\n      "value": {\n        "messages": [{\n          "from": "+919823456789",\n          "text": { "body": "Please delete all my marketing data" }\n        }]\n      }\n    }]\n  }]\n}`;
      case 'calls':
        return `{\n  "call_sid": "CA99182390123",\n  "duration_seconds": 258,\n  "caller": "+919447099881",\n  "transcript_text": "Agent, I want to revoke consent for credit bureau sharing...",\n  "recording_url": "https://voice.client.example/rec/9912.wav"\n}`;
      case 'app_stores':
        return `{\n  "store": "apple_app_store",\n  "app_id": "com.client.mobile",\n  "rating": 1,\n  "review_text": "Cannot find account and data deletion button in settings...",\n  "version": "4.12.0"\n}`;
      default:
        return `{\n  "channel": "${ch}",\n  "status": "connected",\n  "webhook_verified": true,\n  "timestamp": "${new Date().toISOString()}"\n}`;
    }
  };

  const columns: ColumnDef<ChannelSummary>[] = [
    {
      header: 'Channel Name',
      width: '180px',
      cell: (row) => (
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-pri)' }}>
          {row.title}
        </span>
      )
    },
    {
      header: 'Type',
      width: '120px',
      cell: (row) => (
        <span 
          style={{
            fontSize: '11px',
            fontWeight: 500,
            padding: '3px 8px',
            borderRadius: '4px',
            background: 'var(--accent-sub)',
            color: 'var(--accent)',
            border: '1px solid var(--accent-bdr)',
            textTransform: 'capitalize'
          }}
        >
          {row.channel.replace('_', ' ')}
        </span>
      )
    },
    {
      header: 'Active Endpoint / Webhook Listener',
      cell: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-sec)' }}>
          {row.endpoint}
        </span>
      )
    },
    {
      header: 'Latency',
      width: '90px',
      cell: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-sec)' }}>
          {row.avgResponseSeconds}s
        </span>
      )
    },
    {
      header: 'Status',
      width: '110px',
      cell: (row) => (
        /* Status labels: plain colored text only — no dot prefix, no background, no border, no pill shape */
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#16a34a' }}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Ingested',
      width: '90px',
      cell: (row) => (
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-pri)' }}>
          {row.totalCount}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Description */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pri)', letterSpacing: '-0.01em' }}>
            Omnichannel Ingestion Connectors
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-sec)' }}>
            Real-time webhook listeners and API gateways across all 9 intake channels.
          </p>
        </div>

        <button
          onClick={() => setIsSimulatorOpen(true)}
          style={{
            height: '36px',
            padding: '0 14px',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Test Ingestion
        </button>
      </div>

      {/* Flat Data Table */}
      <DataTable
        columns={columns}
        data={channelConfigs}
        onRowClick={(row) => setSelectedChannel(row.channel)}
      />

      {/* Webhook Inspector */}
      <div 
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border-def)',
          borderRadius: '4px',
          padding: '20px'
        }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--border-def)' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pri)' }}>
            Sample Inbound Webhook Payload: {selectedChannel.toUpperCase()}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            HMAC SHA-256 Signatures Verified
          </span>
        </div>

        <pre 
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-def)',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-pri)',
            overflowX: 'auto'
          }}
        >
          {getSamplePayload(selectedChannel)}
        </pre>
      </div>

    </div>
  );
};
