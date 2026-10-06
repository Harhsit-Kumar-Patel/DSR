import React from 'react';
import { DataTable, ColumnDef } from '../../ui/DataTable';
import { SectionLabel } from '../../ui/SectionLabel';

interface RoutingRuleItem {
  id: string;
  category: string;
  statute: string;
  keywords: string[];
  department: string;
  owner: string;
  sla: string;
  formAttached: string;
}

export const RoutingRulesTab: React.FC = () => {
  const rules: RoutingRuleItem[] = [
    {
      id: 'RULE-101',
      category: 'Right of Access (DSAR)',
      statute: 'DPDP Act 2023 Sec. 11 / GDPR Art. 15',
      keywords: ['access request', 'copy of data', 'personal data summary', 'loan files'],
      department: 'Privacy & Compliance Office',
      owner: 'Ananya Mehta (Privacy Officer)',
      sla: '30 Days',
      formAttached: 'Identity Verification & Scope Form'
    },
    {
      id: 'RULE-102',
      category: 'Right to Erasure / Deletion',
      statute: 'DPDP Act 2023 Sec. 12 / GDPR Art. 17',
      keywords: ['delete my data', 'erasure', 'right to be forgotten', 'purge account'],
      department: 'Privacy & Compliance Office',
      owner: 'Ananya Mehta (Privacy Officer)',
      sla: '30 Days',
      formAttached: 'Erasure Scope Declaration Form'
    },
    {
      id: 'RULE-103',
      category: 'Right to Rectification / Correction',
      statute: 'DPDP Act 2023 Sec. 12',
      keywords: ['update address', 'wrong name spelling', 'correct PAN', 'phone change'],
      department: 'Customer Support Operations',
      owner: 'Neha Kapoor (Support Lead)',
      sla: '30 Days',
      formAttached: 'KYC Rectification & Address Proof Form'
    },
    {
      id: 'RULE-104',
      category: 'Consent Revocation / Opt-Out',
      statute: 'DPDP Act 2023 Sec. 6(4)',
      keywords: ['stop calling', 'revoke consent', 'telemarketing', 'opt-out'],
      department: 'Privacy & Compliance Office',
      owner: 'Ananya Mehta (Privacy Officer)',
      sla: '15 Days',
      formAttached: 'Marketing Preference Center Form'
    },
    {
      id: 'RULE-105',
      category: 'Employee / Candidate Privacy',
      statute: 'DPDP Act 2023 (Applicant/Staff)',
      keywords: ['candidate CV', 'interview scores', 'ex-employee payroll', 'PF slips'],
      department: 'HR & Talent Privacy',
      owner: 'Vikram Singhania (Head of HR Operations)',
      sla: '30 Days',
      formAttached: 'Ex-Employee / Candidate Scope Form'
    },
    {
      id: 'RULE-106',
      category: 'Security & Breach Inquiry',
      statute: 'DPDP Act 2023 Sec. 8(5)',
      keywords: ['tracking tags', 'Meta pixel', 'SDK telemetry', 'data breach'],
      department: 'IT & Security Engineering',
      owner: 'Amit Shah (Head of Information Security)',
      sla: '7 Days',
      formAttached: 'SDK & Telemetry Statement Form'
    },
    {
      id: 'RULE-107',
      category: 'Grievance / Escalation',
      statute: 'DPDP Act 2023 Sec. 13',
      keywords: ['Data Protection Board of India', 'DPBI', 'illegal', 'violation'],
      department: 'Legal & Regulatory Counsel',
      owner: 'Meera Sen (Chief Legal Officer)',
      sla: '7 Days',
      formAttached: 'Formal Privacy Grievance Statement'
    }
  ];

  const columns: ColumnDef<RoutingRuleItem>[] = [
    {
      header: 'Category & Statute',
      width: '240px',
      cell: (row) => (
        <div className="space-y-0.5">
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-pri)', display: 'block' }}>
            {row.category}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {row.statute}
          </span>
        </div>
      )
    },
    {
      header: 'Trigger Keywords',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.keywords.map((kw, i) => (
            <span
              key={i}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-def)',
                color: 'var(--text-sec)'
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Whom to Transfer',
      width: '220px',
      cell: (row) => (
        <div className="space-y-0.5">
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-sec)', display: 'block' }}>
            {row.department}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {row.owner}
          </span>
        </div>
      )
    },
    {
      header: 'Attached Form',
      width: '240px',
      cell: (row) => (
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-pri)' }}>
          {row.formAttached}
        </span>
      )
    },
    {
      header: 'SLA',
      width: '80px',
      cell: (row) => (
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-sec)' }}>
          {row.sla}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Description */}
      <div className="space-y-0.5">
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pri)', letterSpacing: '-0.01em' }}>
          Smart Routing &amp; "Whom to Transfer" Decision Matrix
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-sec)' }}>
          Automated rules governing request categorization, department assignment, and dynamic form dispatch.
        </p>
      </div>

      {/* Flat Data Table */}
      <DataTable
        columns={columns}
        data={rules}
      />

    </div>
  );
};
