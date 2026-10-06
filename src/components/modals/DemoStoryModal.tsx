import React, { useState } from 'react';
import { useDSR, WorkspaceTab } from '../../context/DSRContext';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Layers, 
  Database, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface DemoStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  tagline: string;
  description: string;
  actionText: string;
  view: 'overview' | 'dsr-list' | 'dsr-workspace' | 'grievances' | 'gap-analysis' | 'portal-intake';
  tab?: WorkspaceTab;
  highlightNote: string;
}

export const DemoStoryModal: React.FC<DemoStoryModalProps> = ({ isOpen, onClose }) => {
  const { 
    navigateToDSR, 
    setCurrentView, 
    resetDemoData, 
    setActiveWorkspaceTab 
  } = useDSR();

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!isOpen) return null;

  const demoSteps: DemoStep[] = [
    {
      stepNumber: 1,
      title: '1. Privacy Operations Command Center',
      tagline: 'High-level DSR orchestration pipeline and health metrics',
      description: 'Show how DSR is natively embedded into Dutro. Highlight the 7-stage Request Pipeline (Received → Response), the Action Required feed, and the Data Map Health stats (87% coverage).',
      actionText: 'Go to Overview Dashboard',
      view: 'overview',
      highlightNote: 'Notice how Dutro tracks not just case counts, but real-time Data Map Health & PDI coverage.',
    },
    {
      stepNumber: 2,
      title: '2. Multi-Channel DSR Central Inbox',
      tagline: 'Centralized ingestion regardless of origin',
      description: 'Review incoming requests from diverse channels (Customer Portal, Email, API, Website). Identify our primary demo case: DSR-2001 (Rohan Mehta, Right of Access, In Discovery).',
      actionText: 'View DSR Inbox',
      view: 'dsr-list',
      highlightNote: 'Demonstrates Dutro as the centralized orchestration layer across all enterprise touchpoints.',
    },
    {
      stepNumber: 3,
      title: '3. DSR Case Workspace — Identity & Overview',
      tagline: 'Verified requester profile and lifecycle stepper',
      description: 'Open DSR-2001. Point out the verified identity status (Authenticated Customer Portal, 100% confidence), legal entity context, and the visual progress tracker.',
      actionText: 'Open DSR-2001 Overview',
      view: 'dsr-workspace',
      tab: 'overview',
      highlightNote: 'Clear ownership, statutory SLA countdown (30 days remaining), and immutable case metadata.',
    },
    {
      stepNumber: 4,
      title: '4. The Dutro Differentiator: PDI-Guided Discovery',
      tagline: 'No blind searching — query existing RoPA & PDI knowledge',
      description: 'Explain the core innovation: Because Dutro already mapped the client’s data ecosystem, it knows exactly which 4 business processes hold Rohan’s data (Onboarding, Support, Billing, Marketing). Open any process drawer to see purpose, legal basis & sources.',
      actionText: 'Open Discovery Tab & Architecture Flow',
      view: 'dsr-workspace',
      tab: 'discovery',
      highlightNote: 'Dutro is not blindly crawling databases. It intelligently routes requests to mapped business processes.',
    },
    {
      stepNumber: 5,
      title: '5. Department Orchestration & Task Fulfillment',
      tagline: 'Assigning targeted data retrieval tasks to department owners',
      description: 'Inspect the Tasks tab. Show how Rohit Sharma (Sales) and Anjali Verma (Support) submitted evidence, while Karan Mehta (Finance) is pending. Click "View Task" and "Submit Data" to complete the task and watch data populate live.',
      actionText: 'Open Tasks & Complete Billing Task',
      view: 'dsr-workspace',
      tab: 'tasks',
      highlightNote: 'Click "View Task" on Finance or Marketing, then click [Submit Data] to see live fulfillment!',
    },
    {
      stepNumber: 6,
      title: '6. Collected Data & Explainable Data Provenance',
      tagline: 'Every data record knows where it came from and why',
      description: 'Switch to the Data tab. Notice records grouped by process/source with Evidence IDs (EV-1092, EV-2048). Click any record (e.g. Manager Phone) to open the Data Provenance Drawer showing exact source, department, relationship, and proposed treatment.',
      actionText: 'Explore Collected Data & Provenance',
      view: 'dsr-workspace',
      tab: 'data',
      highlightNote: 'Click on "Manager Phone" to see why Dutro classifies it as third-party personal data.',
    },
    {
      stepNumber: 7,
      title: '7. Response Review & Explainable "Why?" Redaction',
      tagline: 'Categorized into Disclose, Redact, Exclude, and Human Review',
      description: 'Inspect the Review tab. See automated legal recommendations (Redacting third-party manager info, Excluding privileged internal legal advice). Click any treatment to open the Decision Details drawer, approve the decisions, and click [Approve Response].',
      actionText: 'Review Treatments & Approve Package',
      view: 'dsr-workspace',
      tab: 'review',
      highlightNote: 'Explainable AI/Policy logic: every redaction is backed by statutory references and reviewable in 1-click.',
    },
    {
      stepNumber: 8,
      title: '8. Client Approval, Response Preview & Dispatch',
      tagline: 'Generate clean final response and complete audit trail',
      description: 'Click [Preview Response] in the Review tab to inspect the formal disclosure letter with clean [REDACTED] masks. Click [Approve & Send] to dispatch the package, celebrate with confetti, and check the Activity audit log.',
      actionText: 'Preview Final Response Letter',
      view: 'dsr-workspace',
      tab: 'review',
      highlightNote: 'Preserves complete evidence & timeline trail for regulatory defense under DPDP/GDPR.',
    },
    {
      stepNumber: 9,
      title: '9. The "Wow Moment": PDI Conflict / Data Map Gap',
      tagline: 'Every DSR validates and improves the client privacy map',
      description: 'Return to Discovery. Point out the amber alert: Support revealed phone numbers also stored in an unmapped SharePoint Excel file. Click [Create Gap] to create GAP-304 in Dutro Gap Analysis module!',
      actionText: 'Resolve PDI Conflict in Discovery',
      view: 'dsr-workspace',
      tab: 'discovery',
      highlightNote: 'DSRs continuously find data shadow-copy leaks and feed the core Dutro data governance loop.',
    },
    {
      stepNumber: 10,
      title: '10. Grievance Redressal & Public Request Portal',
      tagline: 'End-to-end statutory compliance with connected modules',
      description: 'Demonstrate Grievances (GRV-201 linked to DSR-2001) and switch to the public Data Principal Portal to submit a live request and see it appear instantly in the DSR inbox.',
      actionText: 'View Grievance Workspace',
      view: 'grievances',
      highlightNote: 'Complete statutory coverage: RoPA, PDI, Tasks, Evidence, Review, Audit, Grievances, and Gaps.',
    },
  ];

  const currentStep = demoSteps[activeStepIndex];

  const handleExecuteStep = (step: DemoStep) => {
    if (step.view === 'dsr-workspace') {
      navigateToDSR('DSR-2001', step.tab || 'discovery');
    } else {
      setCurrentView(step.view);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-50 via-white to-indigo-50/50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900">Dutro DSR Interactive Demo Script</h3>
                <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
                  5-10 MIN PRESENTATION
                </span>
              </div>
              <p className="text-xs text-slate-500">Step-by-step walkthrough for Founders, Product, and Engineering leadership</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Two Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          {/* Step list sidebar */}
          <div className="p-3 space-y-1 bg-slate-50/70 overflow-y-auto max-h-[55vh]">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-1.5">
              Demo Storyline
            </p>
            {demoSteps.map((s, idx) => (
              <button
                key={s.stepNumber}
                onClick={() => setActiveStepIndex(idx)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start space-x-2.5 cursor-pointer ${
                  activeStepIndex === idx 
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 font-bold ${
                  activeStepIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {s.stepNumber}
                </span>
                <div className="truncate">
                  <p className="truncate font-semibold">{s.title.split('. ')[1]}</p>
                  <p className="text-[10px] text-slate-500 truncate">{s.tagline}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Details */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between bg-white space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-blue-700 font-bold uppercase tracking-wider">
                  Step {currentStep.stepNumber} of {demoSteps.length}
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">{currentStep.title}</h4>
                <p className="text-xs text-blue-700 font-semibold mt-0.5">{currentStep.tagline}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                {currentStep.description}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">Presenter Tip / Key Takeaway</p>
                  <p className="text-slate-700 mt-0.5">{currentStep.highlightNote}</p>
                </div>
              </div>
            </div>

            {/* Jump Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-xs text-slate-700 font-semibold transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={activeStepIndex === demoSteps.length - 1}
                  onClick={() => setActiveStepIndex(prev => Math.min(demoSteps.length - 1, prev + 1))}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-xs text-slate-700 font-semibold transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>

              <button
                onClick={() => handleExecuteStep(currentStep)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <span>{currentStep.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
