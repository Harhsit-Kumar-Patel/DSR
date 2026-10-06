import React, { useState } from 'react';
import { 
  Settings, 
  FileSpreadsheet, 
  Activity, 
  GitBranch, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  Share2,
  Users
} from 'lucide-react';
import { WebformStudio } from '../IntakeDashboard/WebformStudio';
import { ChannelConnectorsTab } from '../IntakeDashboard/ChannelConnectorsTab';
import { RoutingRulesTab } from '../IntakeDashboard/RoutingRulesTab';
import { SLAConfigTab } from './SLAConfigTab';
import { UsersAndRolesTab } from './UsersAndRolesTab';
import { MASTER_CLIENT } from '../../../mockData/initialData';
import { PlatformUser } from '../../../types';

export type SettingsTab = 
  | 'intake-webform' 
  | 'integrations' 
  | 'routing-rules' 
  | 'sla-config' 
  | 'categories'
  | 'users-roles';

interface SettingsViewProps {
  initialTab?: SettingsTab;
  currentUser?: PlatformUser;
  onSwitchUser?: (user: PlatformUser) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  initialTab = 'intake-webform',
  currentUser,
  onSwitchUser
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  const tabs = [
    { id: 'intake-webform', label: 'Request Intake (Webform)', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations (9 Channels)', icon: <Activity className="w-4 h-4" /> },
    { id: 'routing-rules', label: 'Routing Rules', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'sla-config', label: 'SLA Configuration', icon: <Clock className="w-4 h-4" /> },
    { id: 'categories', label: 'Request Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'users-roles', label: 'Users & Roles', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              PLATFORM SETTINGS
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">{MASTER_CLIENT.name} Administration</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Privacy Operations Configuration
          </h1>
          <p className="text-xs text-slate-500">
            Manage webform builders, omnichannel connectors, auto-routing rules, statutory SLA parameters, and role-based permissions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-200">
            9 Connected Channels Active
          </span>
        </div>
      </div>

      {/* Settings Tab Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-view Content */}
      <div className="pt-2">
        {activeTab === 'intake-webform' && (
          <WebformStudio />
        )}

        {activeTab === 'integrations' && (
          <ChannelConnectorsTab />
        )}

        {activeTab === 'routing-rules' && (
          <RoutingRulesTab />
        )}

        {activeTab === 'sla-config' && (
          <SLAConfigTab />
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs animate-fade-in">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                ACTIVE RIGHT: RIGHT OF ACCESS (DPDP SEC. 11 / GDPR ART. 15)
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Configured Access Request Workflows</h3>
            <p className="text-slate-500 text-xs">
              All intake channels and workflows in this deployment are configured exclusively for statutory Right of Access management.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-blue-700 text-sm">Full Profile &amp; KYC Verification Access</span>
                <p className="text-slate-600 text-xs">DPDP Act 2023 Sec. 11(1)(a) · Master customer profile, registered identity proof, contact credentials, and onboarding records.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-emerald-700 text-sm">Billing, Invoices &amp; Ledger Access</span>
                <p className="text-slate-600 text-xs">DPDP Act 2023 Sec. 11(1)(a) · Fee schedules, payment transaction logs, invoice receipts, and tax accounting statements.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-purple-700 text-sm">Customer Support &amp; Interaction Transcripts</span>
                <p className="text-slate-600 text-xs">DPDP Act 2023 Sec. 11(1)(a) · Support ticketing history, chat inquiries, call notes, and customer dispute communications.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-teal-700 text-sm">Marketing Consents &amp; Preferences Access</span>
                <p className="text-slate-600 text-xs">DPDP Act 2023 Sec. 11(1)(a) · Active consent records, opt-in timestamps, notification preferences, and newsletter subscriptions.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-sky-700 text-sm">Summary of Processing &amp; Disclosures</span>
                <p className="text-slate-600 text-xs">DPDP Act 2023 Sec. 11(1)(b) · Summary of personal data processed and identities of third-party data fiduciaries.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-amber-900 text-sm">Access Grievance &amp; Scope Dispute Redressal</span>
                <p className="text-slate-600 text-xs">DPDP Act 2023 Sec. 13 · Statutory 15-day dispute mechanism for omitted records or turnaround inquiries.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users-roles' && (
          <UsersAndRolesTab 
            currentUser={currentUser}
            onSwitchUser={onSwitchUser}
          />
        )}
      </div>

    </div>
  );
};
