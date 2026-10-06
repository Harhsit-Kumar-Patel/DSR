import React from 'react';
import { useIntake } from '../../../context/IntakeContext';
import { IntakeRequest, RequestCategory, TargetDepartment } from '../../../types/intake';
import { DataTable, ColumnDef } from '../../ui/DataTable';
import { SearchInput } from '../../ui/SearchInput';
import { PriorityBadge } from '../../ui/PriorityBadge';
import { ChevronRight } from 'lucide-react';

export const IntakeRequestList: React.FC = () => {
  const { 
    requests, 
    selectedChannelFilter, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter,
    selectedDepartmentFilter, 
    setSelectedDepartmentFilter,
    searchQuery, 
    setSearchQuery,
    setSelectedRequest
  } = useIntake();

  // Filter requests
  const filteredRequests = requests.filter((req: IntakeRequest) => {
    if (selectedChannelFilter !== 'all' && req.channel !== selectedChannelFilter) return false;
    if (selectedCategoryFilter !== 'all' && req.category !== selectedCategoryFilter) return false;
    if (selectedDepartmentFilter !== 'all' && req.transferredTo.department !== selectedDepartmentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.requesterName.toLowerCase().includes(q);
      const matchId = req.id.toLowerCase().includes(q);
      const matchPayload = req.rawPayload.toLowerCase().includes(q);
      const matchCategory = req.category.toLowerCase().includes(q);
      const matchDept = req.transferredTo.department.toLowerCase().includes(q);
      return matchName || matchId || matchPayload || matchCategory || matchDept;
    }
    return true;
  });

  const columns: ColumnDef<IntakeRequest>[] = [
    {
      header: 'Case ID',
      width: '110px',
      cell: (row) => (
        <span 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--accent)'
          }}
        >
          {row.id}
        </span>
      )
    },
    {
      header: 'Channel',
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
      header: 'Requester',
      cell: (row) => (
        <div className="space-y-0.5">
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-pri)', display: 'block' }}>
            {row.requesterName}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {row.requesterPersona}
          </span>
        </div>
      )
    },
    {
      header: 'Categorization',
      cell: (row) => (
        <div className="space-y-0.5 max-w-[200px]">
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-pri)', display: 'block' }}>
            {row.category}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {row.categoryConfidence}% confidence
          </span>
        </div>
      )
    },
    {
      header: 'Whom to Transfer',
      cell: (row) => (
        <div className="space-y-0.5">
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-sec)', display: 'block' }}>
            {row.transferredTo.department}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {row.transferredTo.assignedOwner.split(' ')[0]} {row.transferredTo.assignedOwner.split(' ')[1]}
          </span>
        </div>
      )
    },
    {
      header: 'Urgency',
      width: '100px',
      cell: (row) => <PriorityBadge urgency={row.urgency} />
    },
    {
      header: 'Acknowledgement',
      width: '130px',
      cell: (row) => (
        /* Status labels: Plain colored text only — no dot prefix, no background, no border, no pill shape */
        <span 
          style={{ 
            fontSize: '12px', 
            fontWeight: 500, 
            color: row.acknowledgement.status === 'Delivered' ? '#16a34a' : 'var(--text-sec)' 
          }}
        >
          {row.acknowledgement.status}
        </span>
      )
    },
    {
      header: 'Attached Form',
      width: '140px',
      cell: (row) => {
        const isVerified = row.attachedForm.status === 'Completed & Verified';
        return (
          /* Plain colored text only */
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 500, 
              color: isVerified ? '#16a34a' : '#ea580c' 
            }}
          >
            {isVerified ? 'Verified' : 'Pending Submission'}
          </span>
        );
      }
    },
    {
      header: '',
      width: '50px',
      align: 'right',
      cell: () => (
        <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      )
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ID, requester, keyword..."
          width="280px"
        />

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value as RequestCategory | 'all')}
            style={{
              height: '36px',
              padding: '0 11px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-def)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 400,
              color: 'var(--text-pri)',
              outline: 'none'
            }}
          >
            <option value="all">All Categories</option>
            <option value="Right of Access (DSAR)">Right of Access (DSAR)</option>
            <option value="Right to Erasure / Deletion">Right to Erasure</option>
            <option value="Right to Rectification / Correction">Right to Correction</option>
            <option value="Consent Revocation / Opt-Out">Consent Revocation</option>
            <option value="Data Portability">Data Portability</option>
            <option value="Grievance / Escalation">Grievance / Escalation</option>
            <option value="Security & Breach Inquiry">Security & Breach</option>
            <option value="General Privacy Query">General Privacy</option>
          </select>

          {/* Department Dropdown */}
          <select
            value={selectedDepartmentFilter}
            onChange={(e) => setSelectedDepartmentFilter(e.target.value as TargetDepartment | 'all')}
            style={{
              height: '36px',
              padding: '0 11px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-def)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 400,
              color: 'var(--text-pri)',
              outline: 'none'
            }}
          >
            <option value="all">All Departments</option>
            <option value="Privacy & Compliance Office">Privacy & Compliance</option>
            <option value="Customer Support Operations">Customer Support</option>
            <option value="HR & Talent Privacy">HR & Talent</option>
            <option value="IT & Security Engineering">IT & Security</option>
            <option value="Billing & Accounts Operations">Billing & Accounts</option>
            <option value="Legal & Regulatory Counsel">Legal & Regulatory</option>
          </select>

          {/* Reset Filters */}
          {(selectedCategoryFilter !== 'all' || selectedDepartmentFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                setSelectedDepartmentFilter('all');
                setSearchQuery('');
              }}
              style={{
                fontSize: '12px',
                color: 'var(--accent)',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: '0 6px'
              }}
              className="hover:underline"
            >
              Clear
            </button>
          )}
        </div>

      </div>

      {/* Flat Data Table */}
      <DataTable
        columns={columns}
        data={filteredRequests}
        onRowClick={(row) => setSelectedRequest(row)}
        emptyMessage="No requests match your current filters."
      />

    </div>
  );
};
