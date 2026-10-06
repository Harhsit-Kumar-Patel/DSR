import React, { useState } from 'react';
import { useDSR } from '../../context/DSRContext';
import { 
  Search, 
  ChevronRight, 
  UserCheck, 
  Mail, 
  Cpu, 
  Globe, 
  Sparkles, 
  Plus, 
  RefreshCw,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const DSRList: React.FC = () => {
  const { dsrCases, navigateToDSR, setCurrentView } = useDSR();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPersona, setSelectedPersona] = useState<string>('ALL');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');

  const filteredCases = dsrCases.filter((c) => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.requesterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesPersona = selectedPersona === 'ALL' || c.persona === selectedPersona;
    const matchesChannel = selectedChannel === 'ALL' || c.channel === selectedChannel;

    return matchesSearch && matchesStatus && matchesPersona && matchesChannel;
  });

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Customer Portal':
        return <UserCheck className="w-3.5 h-3.5 text-blue-600" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-indigo-600" />;
      case 'API':
        return <Cpu className="w-3.5 h-3.5 text-purple-600" />;
      case 'Website':
        return <Globe className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Subject Access Requests (DSAR) Inbox</h1>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
              {filteredCases.length} DSAR Cases
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized orchestration inbox for all statutory Right of Access (DSAR) requests across enterprise ingestion channels.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('portal-intake')}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Simulate Customer DSAR Intake (/request)</span>
          </button>

          <button
            onClick={() => navigateToDSR('DSR-1024', 'discovery')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Open Demo Case (DSR-1024)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search DSARs by ID, name, email, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none font-medium"
            >
              <option value="ALL">All DSAR Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Verification">Awaiting Verification</option>
              <option value="Ready to Send">Ready to Send</option>
              <option value="Response Sent">Response Sent</option>
              <option value="At Risk">At Risk (SLA Warning)</option>
            </select>
          </div>

          {/* Persona Filter */}
          <div>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none font-medium"
            >
              <option value="ALL">All Personas</option>
              <option value="Customer">Customer</option>
              <option value="Employee">Employee</option>
              <option value="Candidate">Candidate</option>
            </select>
          </div>

        </div>

        {/* Quick Filter Channels */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Ingestion Channel:</span>
            {['ALL', 'Customer Portal', 'Email', 'API', 'Website'].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  selectedChannel === ch 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          {(selectedStatus !== 'ALL' || selectedPersona !== 'ALL' || selectedChannel !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('ALL');
                setSelectedPersona('ALL');
                setSelectedChannel('ALL');
              }}
              className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Enterprise Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="py-3 px-4">DSAR ID</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Persona</th>
                <th className="py-3 px-4">Statutory Right</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Legal Entity</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">SLA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => (
                <tr 
                  key={c.id}
                  onClick={() => navigateToDSR(c.id, 'overview')}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors group ${
                    c.id === 'DSR-1024' ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* DSR ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 group-hover:text-blue-700">
                    <div className="flex items-center space-x-1.5">
                      <span>{c.id}</span>
                      {c.id === 'DSR-1024' && (
                        <span className="text-[9px] font-mono uppercase bg-blue-100 text-blue-800 px-1 rounded font-bold">
                          DEMO
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Requester */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {c.requesterName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {c.requesterEmail}
                    </div>
                  </td>

                  {/* Persona */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {c.persona}
                    </span>
                  </td>

                  {/* Statutory Right */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                      Right of Access (DSAR)
                    </span>
                  </td>

                  {/* Channel */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 font-medium">
                      {getChannelIcon(c.channel)}
                      <span>{c.channel}</span>
                    </div>
                  </td>

                  {/* Legal Entity */}
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                    {c.legalEntity}
                  </td>

                  {/* Submitted */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {c.submittedDate}
                  </td>

                  {/* Stage */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                      {c.currentStage}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {c.owner}
                  </td>

                  {/* SLA */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      c.slaDaysRemaining <= 3 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {c.slaDaysRemaining}d remaining
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      c.status === 'Ready to Send' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      c.status === 'Response Sent' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                      'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {c.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToDSR(c.id, 'overview');
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Workspace →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
