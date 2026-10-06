import React from 'react';
import { useIntake } from '../../../context/IntakeContext';
import { IntakeChannel, IntakeRequest, ChannelSummary } from '../../../types/intake';
import { MetaStrip } from '../../ui/MetaStrip';
import { Plus } from 'lucide-react';

export const IntakeStatsBar: React.FC = () => {
  const { 
    requests, 
    channelConfigs, 
    selectedChannelFilter, 
    setSelectedChannelFilter,
    setIsSimulatorOpen 
  } = useIntake();

  const totalRequests = requests.length;
  const verifiedCount = requests.filter((r: IntakeRequest) => r.attachedForm.status === 'Completed & Verified').length;
  const autoCategorizedCount = requests.filter((r: IntakeRequest) => r.categoryConfidence >= 90).length;
  const autoCategorizationRate = totalRequests > 0 ? Math.round((autoCategorizedCount / totalRequests) * 100) : 100;
  const avgRoutingTime = '1.2s';

  const metaFields = [
    { label: 'Total Ingested', value: totalRequests, hint: 'across 9 channels' },
    { label: 'AI Categorized', value: `${autoCategorizationRate}%`, hint: 'confidence > 90%' },
    { label: 'Avg Routing', value: avgRoutingTime, hint: 'auto-transferred' },
    { label: 'Forms Verified', value: `${verifiedCount} / ${totalRequests}`, hint: 'KYC & scope' },
  ];

  return (
    <div className="space-y-4">
      
      {/* Metric Strip */}
      <MetaStrip fields={metaFields} />

      {/* 9 Ingestion Channels Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {/* All Channels Tag */}
          <button
            onClick={() => setSelectedChannelFilter('all')}
            style={{
              fontSize: '11px',
              fontWeight: 500,
              padding: '6px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: selectedChannelFilter === 'all' ? 'var(--accent)' : 'var(--accent-sub)',
              color: selectedChannelFilter === 'all' ? '#ffffff' : 'var(--accent)',
              border: selectedChannelFilter === 'all' ? '1px solid var(--accent)' : '1px solid var(--accent-bdr)'
            }}
            className="transition-colors"
          >
            <span>All Channels ({totalRequests})</span>
          </button>

          {/* 9 Individual Channel Chips */}
          {channelConfigs.map((cfg: ChannelSummary) => {
            const count = requests.filter((r: IntakeRequest) => r.channel === cfg.channel).length;
            const isSelected = selectedChannelFilter === cfg.channel;

            return (
              <button
                key={cfg.channel}
                onClick={() => setSelectedChannelFilter(cfg.channel)}
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--accent)' : 'var(--accent-sub)',
                  color: isSelected ? '#ffffff' : 'var(--accent)',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--accent-bdr)'
                }}
                className="transition-colors"
              >
                <span>{cfg.title.split(' ')[0]}</span>
                <span style={{ opacity: 0.8, marginLeft: '4px' }}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Simulate Inbound Button */}
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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          className="hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate Inbound</span>
        </button>

      </div>

    </div>
  );
};
