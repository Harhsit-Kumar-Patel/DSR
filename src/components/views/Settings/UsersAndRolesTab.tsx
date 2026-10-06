import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  ShieldCheck, 
  CheckCircle2, 
  UserCheck, 
  Building2, 
  KeyRound, 
  Lock, 
  Plus, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { DEMO_USERS, MASTER_CLIENT } from '../../../mockData/initialData';
import { PlatformUser, UserRole } from '../../../types';

interface UsersAndRolesTabProps {
  currentUser?: PlatformUser;
  onSwitchUser?: (user: PlatformUser) => void;
}

export const UsersAndRolesTab: React.FC<UsersAndRolesTabProps> = ({
  currentUser,
  onSwitchUser
}) => {
  const [activeUsers] = useState<PlatformUser[]>(DEMO_USERS);

  const rolePermissions: Record<UserRole, { description: string; permissions: string[] }> = {
    'Privacy Officer': {
      description: 'Principal compliance authority for statutory DPDP and GDPR fulfillment.',
      permissions: [
        'Manage full DSR lifecycle & assign tasks',
        'Review and override department disclosures',
        'Issue final validation & delivery sign-off',
        'Full oversight of grievance cases & escalation',
        'Configure statutory SLA rules & integrations'
      ]
    },
    'Operations Team': {
      description: 'Client department teams responsible for locating customer records in department systems.',
      permissions: [
        'View and fulfill assigned tasks in "My Tasks"',
        'Submit Data Found / No Data Found results',
        'Perform Redaction & Disclosure reviews on task records',
        'Attach evidence references and confirmation timestamps',
        'Complete assigned retrieval tasks'
      ]
    },
    'Grievance Officer': {
      description: 'Designated statutory Grievance Officer under DPDP Act 2023 Sec. 13.',
      permissions: [
        'Full access to customer grievances & dispute cases',
        'Automatic access to linked original DSR records & audit history',
        'Conduct Level 1 and Level 2 grievance investigations',
        'Issue grievance resolutions and escalations',
        'Maintain independent statutory 15-day grievance SLA'
      ]
    },
    'Dutro Consultant': {
      description: 'Dutro privacy advisory and operations consultant working alongside the client.',
      permissions: [
        'Workflow validation and compliance clearance checks',
        'Automated RoPA / Basic Location discovery coordination',
        'Redaction guidance recommendation and oversight',
        'Multi-channel intake normalization and orchestration',
        'Non-invasive coordination without raw database access'
      ]
    },
    'Finance Specialist': {
      description: 'Finance operations lead for invoice ledgers, fee receipts, and payment transactions.',
      permissions: [
        'Fulfill Finance Operations tasks in "My Tasks"',
        'Locate and confirm payment records & fee ledgers',
        'Review transaction disclosures for third-party counterparty data',
        'Attach ledger evidence references'
      ]
    }
  };

  return (
    <div className="space-y-6 text-xs animate-fade-in select-none">
      
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            ROLE-BASED GOVERNANCE
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium">{MASTER_CLIENT.name} Authorization</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          Users, Personas &amp; Role-Based Access Control (RBAC)
        </h3>
        <p className="text-slate-500 text-xs">
          All authorized roles operate within the <strong>SAME unified Dutro dashboard</strong> and same DSR case environment, with views and actions tailored to their assigned statutory responsibilities.
        </p>
      </div>

      {/* Demo Persona Switcher Banner */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-900 font-bold">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Active Demonstration Personas</span>
          </div>
          <span className="text-[11px] text-blue-700 font-medium">Click any user to switch active demo session:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeUsers.map((u) => {
            const isCurrent = currentUser?.id === u.id;

            return (
              <div
                key={u.id}
                onClick={() => onSwitchUser && onSwitchUser(u)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCurrent ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {u.avatarInitials}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">{u.name}</h4>
                    <p className={`text-[10px] ${isCurrent ? 'text-blue-100' : 'text-slate-500'}`}>
                      {u.roleTitle}
                    </p>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Capabilities Breakdown Grid */}
      <div className="space-y-3">
        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
          Role Capability &amp; Permission Matrix
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(rolePermissions) as UserRole[]).map((role) => {
            const info = rolePermissions[role];

            return (
              <div key={role} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{role}</h4>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold border border-blue-100">
                    Unified Platform
                  </span>
                </div>

                <p className="text-slate-500 text-xs">{info.description}</p>

                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Assigned Capabilities:
                  </span>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    {info.permissions.map((perm, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
