import React, { useState, useEffect } from 'react';
import { GrievanceRecord, GrievanceStage, GrievanceStatus, PrivacyRequest } from '../../types';
import { 
  AlertCircle, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  MessageSquareWarning, 
  Sparkles, 
  Search, 
  RotateCcw, 
  Send, 
  AlertTriangle, 
  Plus, 
  Shield, 
  Layers,
  ArrowUpRight,
  Check,
  Building2,
  Calendar,
  Eye,
  FileCheck,
  CheckCircle
} from 'lucide-react';
import { LiveSLABadge } from '../ui/LiveSLABadge';
import { MASTER_CLIENT } from '../../mockData/initialData';

interface GrievancesViewProps {
  grievances: GrievanceRecord[];
  requests: PrivacyRequest[];
  onSelectDSR: (dsrId: string) => void;
  onUpdateGrievanceStage: (grievanceId: string, nextStage: GrievanceStage, nextStatus: GrievanceStatus, note?: string) => void;
  onCreateGrievance?: (newGrievance: Omit<GrievanceRecord, 'id'>) => void;
  selectedGrievanceId?: string;
  onSelectGrievance?: (grievanceId?: string) => void;
}

export const GrievancesView: React.FC<GrievancesViewProps> = ({
  grievances,
  requests,
  onSelectDSR,
  onUpdateGrievanceStage,
  onCreateGrievance,
  selectedGrievanceId,
  onSelectGrievance
}) => {
  // Mode: 'list' (DSR Requests & Grievance Status table by default) or 'detail' (Grievance Case View)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>(selectedGrievanceId ? 'detail' : 'list');
  const [activeGrievanceId, setActiveGrievanceId] = useState<string | null>(selectedGrievanceId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);

  // Sync state ONLY when selectedGrievanceId prop changes from parent navigation
  useEffect(() => {
    if (selectedGrievanceId) {
      // Find matching grievance by ID or linked DSR ID
      const match = grievances.find(g => g.id === selectedGrievanceId || g.linkedDsrId === selectedGrievanceId);
      if (match) {
        setActiveGrievanceId(match.id);
        setViewMode('detail');
      } else {
        setActiveGrievanceId(selectedGrievanceId);
        setViewMode('detail');
      }
    } else {
      setActiveGrievanceId(null);
      setViewMode('list');
    }
  }, [selectedGrievanceId]);

  // New Grievance Modal Form State
  const [targetDsrId, setTargetDsrId] = useState(requests[0]?.id || 'DSR-2001');
  const [newComplaintReason, setNewComplaintReason] = useState('');

  const activeGrievance = grievances.find(g => g.id === activeGrievanceId);
  const linkedDsr = activeGrievance ? requests.find(r => r.id === activeGrievance.linkedDsrId) : null;
  // Streamlined 6-Step Grievance Lifecycle Definition
  const grievanceSteps: Array<{ id: string; label: string; subLabel: string; stageValue: GrievanceStage }> = [
    { id: 'step-1', label: 'Step 1: Raised', subLabel: 'Grievance Raised', stageValue: 'Grievance Raised' },
    { id: 'step-2', label: 'Step 2: Acknowledged', subLabel: 'Notice Issued', stageValue: 'Acknowledged' },
    { id: 'step-3', label: 'Step 3: Initial Review', subLabel: 'Level 1 Inquiry', stageValue: 'Level 1 Review' },
    { id: 'step-4', label: 'Step 4: Senior Review', subLabel: 'Level 2 Escalation', stageValue: 'Senior Review' },
    { id: 'step-5', label: 'Step 5: Final Review', subLabel: 'DPO Determination', stageValue: 'Final Review' },
    { id: 'step-6', label: 'Step 6: Resolved', subLabel: 'Case Closed', stageValue: 'Resolved' }
  ];

  // Map any stage string to normalized 1..6 step index
  const getNormalizedStageIndex = (stage: GrievanceStage | string): number => {
    switch (stage) {
      case 'Grievance Raised':
        return 1;
      case 'Acknowledged':
        return 2;
      case 'Level 1 Review':
      case 'Level 1 — Internal Review':
      case 'Under Level 1 Review':
        return 3;
      case 'Senior Review':
      case 'Level 2 — Escalation':
      case 'Senior Privacy Review':
      case 'Under Senior Review':
      case 'Under Level 2 Review':
        return 4;
      case 'Final Review':
      case 'Final Internal Review':
        return 5;
      case 'Resolved':
      case 'Closed':
        return 6;
      default:
        return 1;
    }
  };

  const currentStepIndex = activeGrievance ? getNormalizedStageIndex(activeGrievance.stage) : 1;
  const isGrievanceResolved = activeGrievance?.stage === 'Resolved' || activeGrievance?.status === 'Resolved' || activeGrievance?.stage === 'Closed' || activeGrievance?.status === 'Closed';

  const getStepStatus = (stepIndex: number) => {
    if (isGrievanceResolved) return 'completed';
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'active';
    return 'pending';
  };

  const handleOpenGrievance = (grievanceId: string) => {
    setActiveGrievanceId(grievanceId);
    setViewMode('detail');
    if (onSelectGrievance) {
      onSelectGrievance(grievanceId);
    }
  };

  const handleBackToList = () => {
    setActiveGrievanceId(null);
    setViewMode('list');
    if (onSelectGrievance) {
      onSelectGrievance(undefined);
    }
  };

  // Step 1 -> Step 2: Acknowledge Grievance
  const handleAcknowledgeGrievance = () => {
    if (!activeGrievance) return;
    onUpdateGrievanceStage(
      activeGrievance.id, 
      'Acknowledged', 
      'Acknowledged', 
      internalNote || 'Formal statutory grievance acknowledgment notice issued to customer. 15-day resolution clock confirmed.'
    );
    setInternalNote('');
  };

  // Step 2 -> Step 3: Proceed to Initial Review (Level 1)
  const handleProceedToInitialReview = () => {
    if (!activeGrievance) return;
    onUpdateGrievanceStage(
      activeGrievance.id, 
      'Level 1 Review', 
      'Under Level 1 Review', 
      internalNote || 'Proceeded to Level 1 Initial Review: Commenced investigation into customer dispute and omitted records claims.'
    );
    setInternalNote('');
  };

  // Step 3 -> Step 4: Escalate for Senior Review (Level 2)
  const handleEscalateToSeniorReview = () => {
    if (!activeGrievance) return;
    onUpdateGrievanceStage(
      activeGrievance.id, 
      'Senior Review', 
      'Under Senior Review', 
      internalNote || 'Escalated to Senior Privacy Review & Legal Counsel for scope re-examination and archival records verification.'
    );
    setInternalNote('');
  };

  // Step 4 -> Step 5: Escalate for Final Review (DPO Determination)
  const handleEscalateToFinalReview = () => {
    if (!activeGrievance) return;
    onUpdateGrievanceStage(
      activeGrievance.id, 
      'Final Review', 
      'Final Review', 
      internalNote || 'Escalated for Final Determination by Data Protection Officer (DPO) and Executive Privacy Leadership.'
    );
    setInternalNote('');
  };

  // Resolve Grievance (Available at any stage or final stage)
  const handleResolveGrievance = () => {
    if (!activeGrievance) return;
    onUpdateGrievanceStage(
      activeGrievance.id, 
      'Resolved', 
      'Resolved', 
      internalNote || 'Grievance investigated by Grievance Redressal Office and resolved with supplementary disclosure package delivered to customer.'
    );
    setInternalNote('');
  };

  // Step 5: Issue Formal Statutory Rejection (Dismissal)
  const handleFormalRejection = () => {
    if (!activeGrievance) return;
    onUpdateGrievanceStage(
      activeGrievance.id, 
      'Closed', 
      'Closed', 
      internalNote || 'Grievance formally dismissed under DPDP Act Sec. 13 statutory grounds with detailed written rationale delivered to customer.'
    );
    setInternalNote('');
  };

  // Re-open Grievance Investigation
  const handleReopenGrievance = () => {
    if (!activeGrievance) return;
    onUpdateGrievanceStage(
      activeGrievance.id, 
      'Level 1 Review', 
      'Under Level 1 Review', 
      'Grievance case re-opened for supplementary review following additional customer submission.'
    );
    setInternalNote('');
  };

  const handleCreateNewGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateGrievance || !newComplaintReason.trim()) return;

    const selectedReq = requests.find(r => r.id === targetDsrId);
    if (!selectedReq) return;

    const newGrv: Omit<GrievanceRecord, 'id'> = {
      linkedDsrId: selectedReq.id,
      customerName: selectedReq.personName,
      customerEmail: selectedReq.email,
      customerPhone: selectedReq.phone,
      originalRequestType: 'Right of Access',
      originalResponseDate: selectedReq.bankClosure?.deliveredAt || selectedReq.receivedDate,
      originalResponseSummary: `Original Right of Access response package.`,
      customerComplaint: newComplaintReason,
      grievanceReason: newComplaintReason,
      originalScopeSummary: `Full statutory Right of Access scope.`,
      whatWasProvidedSummary: `Response delivered on ${selectedReq.bankClosure?.deliveredAt || selectedReq.receivedDate}.`,
      dateRaised: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
      stage: 'Grievance Raised',
      status: 'Grievance Raised',
      assignedReviewer: 'Harshit Patel',
      assignedReviewerRole: 'Dutro Lead Consultant',
      slaStartTimestamp: new Date().toISOString(),
      slaDeadlineTimestamp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      auditTrail: [
        {
          timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST',
          actor: `Customer (${selectedReq.personName})`,
          role: 'Customer',
          action: 'Grievance Lodged against DSR',
          details: `Raised formal grievance against ${selectedReq.id}: "${newComplaintReason}"`
        }
      ]
    };

    onCreateGrievance(newGrv);
    setIsRaiseModalOpen(false);
    setNewComplaintReason('');
  };

  // Metrics Calculation (Section 21)
  const dsrsWithGrievances = requests.filter(r => 
    r.linkedGrievanceId || grievances.some(g => g.linkedDsrId === r.id)
  ).length;

  const openGrievancesCount = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed').length;
  const underReviewCount = grievances.filter(g => g.status === 'Under Level 1 Review' || g.status === 'Acknowledged').length;
  const escalatedCount = grievances.filter(g => g.status.includes('Level 2') || g.status.includes('Escalat')).length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved' || g.status === 'Closed').length;

  // Filtered requests for the DSR Grievance table
  const filteredRequests = requests.filter(r => 
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.linkedGrievanceId && r.linkedGrievanceId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in text-slate-800">
      
      {/* VIEW 1: DSR REQUESTS & GRIEVANCE STATUS (FIRST SCREEN PER REQ #16 & #21) */}
      {viewMode === 'list' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Summary Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                  DPDP SEC. 13 STATUTORY GRIEVANCE REDRESSAL
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Dutro Grievance Management</span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                DSR Requests &amp; Grievance Status
              </h1>
              <p className="text-xs text-slate-500">
                Identify active customer grievances linked to Right of Access DSR cases. Only DSRs with raised grievances permit opening the redressal workflow.
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setIsRaiseModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Raise Grievance (Simulation)</span>
              </button>
            </div>
          </div>

          {/* Top Summary Metrics Cards (Section 21) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">DSRs with Grievances</span>
              <span className="text-2xl font-bold text-purple-900 mt-1 block">{dsrsWithGrievances}</span>
              <span className="text-[10px] text-slate-400">Linked to DSR Cases</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Open Grievances</span>
              <span className="text-2xl font-bold text-amber-600 mt-1 block">{openGrievancesCount}</span>
              <span className="text-[10px] text-amber-600 font-medium">Active investigations</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Under Level 1 Review</span>
              <span className="text-2xl font-bold text-blue-600 mt-1 block">{underReviewCount}</span>
              <span className="text-[10px] text-blue-600 font-medium">Internal inquiry</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Escalated (Level 2)</span>
              <span className="text-2xl font-bold text-rose-600 mt-1 block">{escalatedCount}</span>
              <span className="text-[10px] text-slate-400">Senior privacy review</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Resolved Grievances</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">{resolvedCount}</span>
              <span className="text-[10px] text-emerald-600 font-medium">Closed within SLA</span>
            </div>
          </div>

          {/* DSR Grievance Table Card (Section 16 & 21) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  DSR Requests &amp; Redressal Mapping
                </h2>
                <p className="text-xs text-slate-500">
                  Cross-reference DSR delivery status with statutory grievance records.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search DSR ID, customer, grievance..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-3.5">Request ID</th>
                    <th className="py-3 px-3.5">Customer</th>
                    <th className="py-3 px-3.5">Request Type</th>
                    <th className="py-3 px-3.5">Response Status</th>
                    <th className="py-3 px-3.5">Grievance Status</th>
                    <th className="py-3 px-3.5">Grievance ID</th>
                    <th className="py-3 px-3.5">Last Updated</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRequests.map((req) => {
                    // Find if there is a grievance linked
                    const linkedGrv = grievances.find(g => g.linkedDsrId === req.id || g.id === req.linkedGrievanceId);
                    const hasGrievance = !!linkedGrv;
                    const isDelivered = req.status === 'Closed' || req.bankClosure?.isDelivered || req.currentStage === 'Response Delivered';

                    return (
                      <tr 
                        key={req.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          hasGrievance ? 'bg-purple-50/30' : ''
                        }`}
                      >
                        {/* Request ID */}
                        <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                          <button
                            onClick={() => onSelectDSR(req.id)}
                            className="hover:text-blue-600 hover:underline cursor-pointer inline-flex items-center space-x-1"
                            title="Open DSR Request Workspace"
                          >
                            <span>{req.id}</span>
                          </button>
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-3.5 font-medium text-slate-900">
                          <div>{req.personName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{req.email}</div>
                        </td>

                        {/* Request Type (Strictly Right of Access) */}
                        <td className="py-3 px-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            Right of Access
                          </span>
                        </td>

                        {/* Response Status */}
                        <td className="py-3 px-3.5">
                          {isDelivered ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-800 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Response Delivered</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-blue-800 font-medium text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              <Clock className="w-3 h-3 text-blue-600" />
                              <span>{req.status}</span>
                            </span>
                          )}
                        </td>

                        {/* Grievance Status (Section 16) */}
                        <td className="py-3 px-3.5">
                          {hasGrievance ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                              <AlertCircle className="w-3 h-3 text-purple-600" />
                              <span>{linkedGrv.status}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              No Grievance
                            </span>
                          )}
                        </td>

                        {/* Grievance ID */}
                        <td className="py-3 px-3.5 font-mono text-xs font-semibold">
                          {hasGrievance ? (
                            <span className="text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              {linkedGrv.id}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Last Updated */}
                        <td className="py-3 px-3.5 text-slate-500 text-[11px]">
                          {req.lastUpdated || req.receivedDate}
                        </td>

                        {/* Actions (Section 16 & 21: Only show [Open Grievance] when grievance exists, or [View DSR]) */}
                        <td className="py-3 px-3.5 text-right">
                          {hasGrievance ? (
                            <button
                              onClick={() => handleOpenGrievance(linkedGrv.id)}
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center space-x-1 shadow-2xs transition-all cursor-pointer"
                            >
                              <span>Open Grievance</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onSelectDSR(req.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 text-xs font-semibold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                              title="View DSR Case Details"
                            >
                              <span>View DSR</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GRIEVANCE DETAIL WORKFLOW (SECTION 20: AUTOMATIC ORIGINAL DSR DISPLAY) */}
      {viewMode === 'detail' && activeGrievance && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Back Button & Top Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to DSR Requests &amp; Grievance Status</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">Assigned Reviewer:</span>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {activeGrievance.assignedReviewer} ({activeGrievance.assignedReviewerRole})
              </span>
            </div>
          </div>

          {/* Grievance Header Banner */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-0.5 rounded-lg">
                  {activeGrievance.id}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                  Status: {activeGrievance.status}
                </span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 font-mono">
                  Linked Request: {activeGrievance.linkedDsrId}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {activeGrievance.customerName}
              </h1>
              <p className="text-xs text-slate-500">
                Email: {activeGrievance.customerEmail} • Phone: {activeGrievance.customerPhone || '+91 90000 12345'} • Raised on: {activeGrievance.dateRaised}
              </p>
            </div>

            {/* Independent 15-Day Real-Time Grievance SLA Clock (Section 22) */}
            <div className="bg-purple-950 text-white rounded-xl p-3.5 border border-purple-800 text-right min-w-[170px] shadow-sm">
              <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider flex items-center justify-end space-x-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Statutory Grievance SLA</span>
              </div>
              <div className="pt-1">
                <LiveSLABadge
                  deadlineTimestamp={activeGrievance.slaDeadlineTimestamp}
                  startTimestamp={activeGrievance.slaStartTimestamp}
                  isCompleted={activeGrievance.status === 'Resolved' || activeGrievance.status === 'Closed'}
                  size="lg"
                />
              </div>
              <div className="text-[10px] text-purple-300 mt-0.5">15 Calendar Days Basis</div>
            </div>
          </div>

          {/* SECTION 20: AUTOMATIC ORIGINAL DSR CASE DISPLAY */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 rounded-2xl border-2 border-blue-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  DSR
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    ORIGINAL DSR CASE RECORD ({activeGrievance.linkedDsrId})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Automatically retrieved context from the underlying DSR lifecycle
                  </p>
                </div>
              </div>

              {linkedDsr && (
                <button
                  onClick={() => onSelectDSR(linkedDsr.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Original DSR Workspace</span>
                </button>
              )}
            </div>

            {/* Original DSR Operational Checklist Summary (Section 20) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
              {[
                { label: 'Verification', done: true, desc: 'Identity Verified' },
                { label: 'Data Discovery', done: true, desc: 'Systems Mapped' },
                { label: 'Client Tasks', done: true, desc: 'Tasks Completed' },
                { label: 'Data Retrieval', done: true, desc: 'Records Extracted' },
                { label: 'Redaction Review', done: true, desc: 'Reviewed' },
                { label: 'Validation', done: true, desc: 'Dutro Validated' },
                { label: 'Delivery', done: linkedDsr?.bankClosure?.isDelivered || true, desc: 'Delivered' }
              ].map((chk) => (
                <div 
                  key={chk.label}
                  className="bg-white p-2.5 rounded-xl border border-blue-200/80 shadow-2xs text-center space-y-1"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xs font-bold">
                    ✓
                  </div>
                  <p className="font-bold text-[11px] text-slate-900">{chk.label}</p>
                  <p className="text-[10px] text-slate-500">{chk.desc}</p>
                </div>
              ))}
            </div>

            {/* Original Response Summary & Complaint Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Original Response Package Delivered
                </span>
                <p className="text-slate-800">
                  {activeGrievance.whatWasProvidedSummary || 'Complete customer disclosure package delivered.'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Delivered on: {activeGrievance.originalResponseDate}
                </p>
              </div>

              <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200 space-y-1">
                <span className="font-bold text-purple-900 uppercase tracking-wider text-[10px] block">
                  Customer Grievance &amp; Dispute Statement
                </span>
                <p className="text-purple-950 font-semibold italic">
                  "{activeGrievance.customerComplaint || activeGrievance.grievanceReason}"
                </p>
                <p className="text-[11px] text-purple-700 mt-1">
                  Reason: {activeGrievance.grievanceReason}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 20 & 21: GRIEVANCE WORKFLOW STEPPER & ACTIONS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Grievance Redressal Lifecycle
              </h3>
              <span className="text-xs text-purple-900 font-bold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                Stage: {activeGrievance.stage}
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {grievanceSteps.map((step, idx) => {
                const stepNum = idx + 1;
                const status = getStepStatus(stepNum);
                const isCompleted = status === 'completed';
                const isActive = status === 'active';

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-100 text-purple-900 shadow-2xs'
                        : isCompleted
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold">{step.label}</span>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {isActive && <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />}
                    </div>
                    <p className="font-bold text-xs truncate">{step.subLabel}</p>
                    <p className="text-[10px] mt-0.5 opacity-80">
                      {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Grievance Action Workspace */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="font-bold text-xs text-slate-900 uppercase tracking-wider block">
                    Current Stage Actions • {grievanceSteps[currentStepIndex - 1]?.label || `Step ${currentStepIndex}`}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {currentStepIndex === 1 && 'Customer dispute registered. Issue formal statutory acknowledgment notice to begin investigation.'}
                    {currentStepIndex === 2 && 'Statutory notice issued. Proceed to Level 1 inquiry or resolve with instant supplementary disclosure.'}
                    {currentStepIndex === 3 && 'Initial investigation in progress. Check omitted archival records or escalate for Senior Review.'}
                    {currentStepIndex === 4 && 'Senior Privacy Review in progress. Re-examine legal/department scope or escalate for DPO Determination.'}
                    {currentStepIndex === 5 && 'Final determination stage. DPO must issue final statutory resolution or dismissal justification.'}
                    {currentStepIndex === 6 && 'Statutory redressal concluded and formal resolution certificate delivered.'}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Reviewer:</span>
                  <span className="text-[11px] font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {activeGrievance.assignedReviewer}
                  </span>
                </div>
              </div>

              {!isGrievanceResolved && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Investigation Findings / Stage Note
                  </label>
                  <textarea
                    rows={3}
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder={
                      currentStepIndex === 1
                        ? "Enter acknowledgment notes or specific customer instructions..."
                        : currentStepIndex === 2
                        ? "Record initial review plan or department verification findings..."
                        : currentStepIndex === 3
                        ? "Record Level 1 findings from finance/CRM systems or reason for senior escalation..."
                        : currentStepIndex === 4
                        ? "Record Senior Privacy Counsel review findings and legal scope determinations..."
                        : "Record Data Protection Officer (DPO) final statutory determination..."
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>
              )}

              {/* Contextual Action Buttons for EVERY step */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {/* STEP 1: Grievance Raised */}
                {currentStepIndex === 1 && (
                  <>
                    <button
                      onClick={handleAcknowledgeGrievance}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Acknowledge Grievance &amp; Issue Statutory Notice</span>
                    </button>

                    <button
                      onClick={handleProceedToInitialReview}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Proceed for Initial Review (Level 1) →</span>
                    </button>

                    <button
                      onClick={() => {
                        const note = 'Requested customer clarification regarding missing transaction dates.';
                        setInternalNote(note);
                        alert(`Inquiry notice sent to customer ${activeGrievance.customerName}: "${note}"`);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-500" />
                      <span>Request Customer Clarification</span>
                    </button>
                  </>
                )}

                {/* STEP 2: Acknowledged */}
                {currentStepIndex === 2 && (
                  <>
                    <button
                      onClick={handleProceedToInitialReview}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Proceed for Initial Review (Level 1 Investigation) →</span>
                    </button>

                    <button
                      onClick={handleResolveGrievance}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolve &amp; Issue Supplementary Disclosure</span>
                    </button>

                    <button
                      onClick={() => {
                        const note = 'Dispatched department task to re-examine archival storage and legacy billing logs.';
                        setInternalNote(note);
                        alert('Task dispatched to Finance & CRM teams for records verification.');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Request Department Records Re-check</span>
                    </button>
                  </>
                )}

                {/* STEP 3: Level 1 Review (Initial Review) */}
                {currentStepIndex === 3 && (
                  <>
                    <button
                      onClick={handleEscalateToSeniorReview}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Escalate for Senior Review (Level 2) →</span>
                    </button>

                    <button
                      onClick={handleResolveGrievance}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolve &amp; Issue Supplementary Disclosure</span>
                    </button>

                    <button
                      onClick={() => {
                        const note = 'Level 1 inquiry recorded: Archival storage migration records confirmed in off-site vault.';
                        setInternalNote(note);
                        alert('Recorded Level 1 preliminary investigation progress.');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Record Preliminary Finding</span>
                    </button>
                  </>
                )}

                {/* STEP 4: Senior Review (Level 2 Escalation) */}
                {currentStepIndex === 4 && (
                  <>
                    <button
                      onClick={handleEscalateToFinalReview}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Escalate for Final Review (DPO Determination) →</span>
                    </button>

                    <button
                      onClick={handleResolveGrievance}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolve with Senior Findings &amp; Supplementary Release</span>
                    </button>

                    <button
                      onClick={() => {
                        const note = 'Legal Counsel consulted regarding statutory disclosure scope boundaries under DPDP Act.';
                        setInternalNote(note);
                        alert('Legal counsel opinion requested and logged in audit trail.');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>Consult Legal Counsel</span>
                    </button>
                  </>
                )}

                {/* STEP 5: Final Review (DPO Review) */}
                {currentStepIndex === 5 && (
                  <>
                    <button
                      onClick={handleResolveGrievance}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Final Determination &amp; Resolve Grievance</span>
                    </button>

                    <button
                      onClick={handleFormalRejection}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Issue Formal Rejection with Statutory Justification</span>
                    </button>

                    <button
                      onClick={() => {
                        const note = 'DPO signed off on final statutory determination with written justification attached.';
                        setInternalNote(note);
                        alert('DPO determination recorded.');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Attach DPO Written Determination</span>
                    </button>
                  </>
                )}

                {/* STEP 6: Resolved / Closed */}
                {currentStepIndex === 6 && (
                  <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-300 p-4 rounded-xl">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-emerald-950 text-xs block">
                          Grievance Redressal Completed &amp; Statutory Case Closed
                        </span>
                        <p className="text-[11px] text-emerald-800">
                          {activeGrievance.resolutionSummary || 'Formal resolution and supplementary disclosure package delivered to customer within the 15-day statutory SLA.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          alert(`Generating and downloading Statutory Grievance Resolution Certificate for ${activeGrievance.id} (PDF)...`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Download Certificate (PDF)</span>
                      </button>

                      <button
                        onClick={handleReopenGrievance}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-amber-50 hover:border-amber-300 text-slate-700 hover:text-amber-900 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Re-open Investigation</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grievance Audit History */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-xs text-slate-700 uppercase tracking-wider block">
                Grievance Redressal Audit Trail
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activeGrievance.auditTrail.map((ev, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{ev.action}</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{ev.details}</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 font-mono">
                      {ev.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODAL: SIMULATE RAISING GRIEVANCE (CONSULTANT INTAKE SIMULATOR) */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Raise Customer Grievance (Simulation)</h3>
              </div>
              <button 
                onClick={() => setIsRaiseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewGrievanceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target DSR Case</label>
                <select
                  value={targetDsrId}
                  onChange={(e) => setTargetDsrId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-mono"
                >
                  {requests.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.id} — {r.personName} ({r.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Grievance Reason / Complaint</label>
                <textarea
                  rows={3}
                  required
                  value={newComplaintReason}
                  onChange={(e) => setNewComplaintReason(e.target.value)}
                  placeholder="e.g. Some transaction statements and support notes were missing from the delivered package..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRaiseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
                >
                  Create &amp; Link Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
