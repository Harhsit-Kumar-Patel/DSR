import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  Search, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Globe, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MASTER_CLIENT } from '../../mockData/initialData';

interface DataSourceRecord {
  id: string;
  name: string;
  category: string;
  department: string;
  owner: string;
  ownerEmail: string;
  storageRegion: string;
  dataClassification: 'Confidential / PII' | 'Financial / Restricted' | 'Internal Operations' | 'Public / Marketing';
  encryption: string;
  retention: string;
  connectedSystems: string[];
  elementsStored: string[];
}

export const DataSourcesCatalogView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const sources: DataSourceRecord[] = [
    {
      id: 'SYS-CRM-01',
      name: 'Client CRM System',
      category: 'Customer Relationship',
      department: 'Operations',
      owner: 'Rahul Verma',
      ownerEmail: 'rahul.verma@client.example',
      storageRegion: 'AWS Mumbai (ap-south-1)',
      dataClassification: 'Confidential / PII',
      encryption: 'AES-256 (At Rest & In Transit)',
      retention: '7 Years post account closure',
      connectedSystems: ['Core Banking Gateway', 'Support Desk', 'Marketing Engine'],
      elementsStored: ['Customer Full Name', 'Registered Mobile', 'Official Email', 'Account Number', 'KYC Proof Reference', 'Address History']
    },
    {
      id: 'SYS-BILL-02',
      name: 'Client Billing & Payment Ledger',
      category: 'Financial Ledger',
      department: 'Finance Operations',
      owner: 'Vikram Shah',
      ownerEmail: 'vikram.shah@client.example',
      storageRegion: 'Private On-Premise Data Center (Mumbai Tier-4)',
      dataClassification: 'Financial / Restricted',
      encryption: 'FIPS 140-2 Level 3 Hardware Security Module',
      retention: '10 Years (Statutory Tax & Accounting)',
      connectedSystems: ['Payment Gateways', 'General Ledger', 'Tax Auditing Module'],
      elementsStored: ['Transaction IDs', 'Payment Timestamps', 'Fee Invoices', 'Bank Account References', 'Tax Invoices', 'Currency Codes']
    },
    {
      id: 'SYS-SUPP-03',
      name: 'Client Support Platform',
      category: 'Customer Support & Ticketing',
      department: 'Customer Support',
      owner: 'Neha Kapoor',
      ownerEmail: 'neha.kapoor@client.example',
      storageRegion: 'Secure Cloud (ap-south-1)',
      dataClassification: 'Internal Operations',
      encryption: 'TLS 1.3 / AES-256',
      retention: '3 Years post ticket closure',
      connectedSystems: ['Client CRM System', 'Email Relay', 'Telephony Ingest'],
      elementsStored: ['Support Tickets', 'Customer Chat Transcripts', 'Issue Categories', 'Agent Resolution Notes', 'Call Recording Metadata']
    },
    {
      id: 'SYS-MKTG-04',
      name: 'Client Marketing Platform',
      category: 'Marketing & Consents',
      department: 'Marketing Operations',
      owner: 'Simran Roy',
      ownerEmail: 'simran.roy@client.example',
      storageRegion: 'Secure Enterprise Cloud',
      dataClassification: 'Public / Marketing',
      encryption: 'AES-256',
      retention: 'Until Consent Revocation or 2 Years Inactivity',
      connectedSystems: ['Website Webform', 'Mobile App SDK', 'Newsletter Engine'],
      elementsStored: ['Communication Opt-In Records', 'Newsletter Preferences', 'Campaign Click Logs', 'Consent Timestamps']
    },
    {
      id: 'SYS-COMP-05',
      name: 'Client Compliance & Risk Engine',
      category: 'Regulatory & Risk',
      department: 'Risk & Compliance',
      owner: 'Arjun Gupta',
      ownerEmail: 'arjun.gupta@client.example',
      storageRegion: 'Private Secure Cloud Region',
      dataClassification: 'Confidential / PII',
      encryption: 'AES-256 with KMS Key Rotation',
      retention: '10 Years post business relationship',
      connectedSystems: ['Identity Verification API', 'AML Screening Module'],
      elementsStored: ['Identity Verification Records', 'Risk Scores', 'Audit Logs', 'DSR Request History']
    }
  ];

  const filtered = sources.filter(s => {
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.owner.toLowerCase().includes(q) ||
        s.elementsStored.some(el => el.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              BASIC DATA MAP &amp; SOURCES
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">{MASTER_CLIENT.name} Enterprise Catalog</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Data Sources &amp; Systems Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive register of client systems containing customer personal data, statutory owners, retention rules, and security classifications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
            {sources.length} Registered Enterprise Systems
          </span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search systems by name, ID, department, owner, or data elements..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {filtered.map((sys) => (
          <div key={sys.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {sys.id}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{sys.name}</h3>
                <p className="text-slate-500 text-[11px]">{sys.category} · {sys.department}</p>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                sys.dataClassification.includes('Restricted') || sys.dataClassification.includes('Confidential')
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {sys.dataClassification}
              </span>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">System Owner:</span>
                <span className="font-semibold text-slate-800">{sys.owner} ({sys.ownerEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Storage Region:</span>
                <span className="font-mono text-slate-700">{sys.storageRegion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Statutory Retention:</span>
                <span className="font-mono text-slate-700">{sys.retention}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Encryption:</span>
                <span className="text-slate-700">{sys.encryption}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Personal Data Elements Stored:
              </span>
              <div className="flex flex-wrap gap-1">
                {sys.elementsStored.map((elem, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    • {elem}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
