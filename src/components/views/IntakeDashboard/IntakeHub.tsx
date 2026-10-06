import React from 'react';
import { useIntake } from '../../../context/IntakeContext';
import { IntakeStatsBar } from './IntakeStatsBar';
import { IntakeRequestList } from './IntakeRequestList';
import { WebformStudio } from './WebformStudio';
import { ChannelConnectorsTab } from './ChannelConnectorsTab';
import { RoutingRulesTab } from './RoutingRulesTab';
import { IntakeDetailModal } from './IntakeDetailModal';
import { SimulateIntakeModal } from './SimulateIntakeModal';
import { RequesterFormModal } from './RequesterFormModal';
import { PageTabBar, TabItem } from '../../ui/PageTabBar';
import { 
  Inbox, 
  FileSpreadsheet, 
  Activity, 
  GitBranch, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface IntakeHubProps {
  onPromoteToWorkspace: (dsrId: string) => void;
}

export const IntakeHub: React.FC<IntakeHubProps> = ({ onPromoteToWorkspace }) => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedRequest, 
    setSelectedRequest,
    isSimulatorOpen,
    setIsSimulatorOpen,
    isRequesterFormOpen,
    setIsRequesterFormOpen,
    activeRequesterFormRequestId,
    resetIntakeData,
    toastMessage,
    toastType,
    requests
  } = useIntake();

  const tabs: TabItem[] = [
    { id: 'inbox', label: 'Intake Inbox', icon: <Inbox className="w-4 h-4" />, count: requests.length },
    { id: 'webform-builder', label: 'Webform Studio', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'connectors', label: 'Channel Connectors', icon: <Activity className="w-4 h-4" /> },
    { id: 'routing-rules', label: 'Routing Rules', icon: <GitBranch className="w-4 h-4" /> }
  ];

  return (
    <div 
      style={{
        padding: '32px 40px 80px',
        background: 'var(--bg-page)',
        minHeight: '100%'
      }}
      className="space-y-6"
    >
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold shadow-lg"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border-def)',
            borderRadius: '4px',
            color: 'var(--text-pri)'
          }}
        >
          {toastType === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {toastType === 'info' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
          {toastType === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600" />}
          {toastType === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header sitting directly on page background */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-pri)',
              letterSpacing: '-0.01em'
            }}
          >
            Omnichannel Intake &amp; Request Routing
          </h1>
          <p 
            style={{
              fontSize: '13px',
              fontWeight: 400,
              color: 'var(--text-sec)'
            }}
          >
            Multi-channel request capture across 9 channels with automated categorization, department routing, and acknowledgement dispatch.
          </p>
        </div>

        <button
          onClick={resetIntakeData}
          style={{
            height: '32px',
            padding: '0 10px',
            background: 'var(--bg-page)',
            border: '1px solid var(--border-def)',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-sec)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
          title="Reset intake demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Clean Flat Tab Bar */}
      <PageTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Sub-View Content sitting flat */}
      {activeTab === 'inbox' && (
        <div className="space-y-5">
          <IntakeStatsBar />
          <IntakeRequestList />
        </div>
      )}

      {activeTab === 'webform-builder' && (
        <WebformStudio />
      )}

      {activeTab === 'connectors' && (
        <ChannelConnectorsTab />
      )}

      {activeTab === 'routing-rules' && (
        <RoutingRulesTab />
      )}

      {/* Slide-over Right Panel Triage Details */}
      {selectedRequest && (
        <IntakeDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onPromoteToWorkspace={onPromoteToWorkspace}
        />
      )}

      {/* Simulator Modal */}
      <SimulateIntakeModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* Requester Form Simulator Modal */}
      <RequesterFormModal
        isOpen={isRequesterFormOpen}
        onClose={() => setIsRequesterFormOpen(false)}
        requestId={activeRequesterFormRequestId}
      />

    </div>
  );
};
