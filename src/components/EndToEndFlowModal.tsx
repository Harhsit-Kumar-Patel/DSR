import React from 'react';
import { 
  X, 
  ArrowDown, 
  User, 
  Building2, 
  ShieldCheck, 
  Database, 
  Users, 
  CheckCircle2, 
  FileCheck, 
  Send, 
  Clock, 
  FileText,
  Lock,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';
import { MASTER_CLIENT, MASTER_CUSTOMER } from '../mockData/initialData';

interface EndToEndFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EndToEndFlowModal: React.FC<EndToEndFlowModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'CUSTOMER REQUEST',
      description: `Customer (${MASTER_CUSTOMER.name}) submits Right of Access request via ${MASTER_CLIENT.name} Customer Portal.`,
      icon: User,
      badge: 'Customer Intake',
      color: 'bg-slate-900 text-white'
    },
    {
      num: '2',
      title: 'DUTRO RECEIVES REQUEST',
      description: `${MASTER_CLIENT.name} sends request metadata to Dutro. Dutro creates DSR-2001 and starts statutory 30-day SLA clock.`,
      icon: ShieldCheck,
      badge: 'DSR Ingestion',
      color: 'bg-blue-600 text-white'
    },
    {
      num: '3',
      title: 'DUTRO MAPS THE REQUEST',
      description: `Dutro checks ${MASTER_CLIENT.name}'s PDI and RoPA to identify 4 relevant business processes containing customer data.`,
      icon: Database,
      badge: 'PDI Discovery',
      color: 'bg-blue-600 text-white'
    },
    {
      num: '4',
      title: 'DUTRO CREATES CLIENT TASKS',
      description: `Dutro creates and dispatches 4 data retrieval tasks (TASK-2001 to TASK-2004) to responsible ${MASTER_CLIENT.name} teams.`,
      icon: Users,
      badge: 'Task Dispatch',
      color: 'bg-blue-600 text-white'
    },
    {
      num: '5',
      title: 'CLIENT RETRIEVES DATA',
      description: `${MASTER_CLIENT.name} internal teams retrieve customer data directly from client source systems (CMS, Zendesk, Billing, Marketing).`,
      icon: Server,
      badge: 'Client Systems',
      color: 'bg-slate-800 text-white'
    },
    {
      num: '6',
      title: 'CLIENT REVIEWS DATA',
      description: `${MASTER_CLIENT.name} reviews actual records and completes necessary third-party redactions within the client environment.`,
      icon: Lock,
      badge: 'Client Review',
      color: 'bg-slate-800 text-white'
    },
    {
      num: '7',
      title: 'DUTRO TRACKS COMPLETION',
      description: 'Dutro records task completion confirmations and verifies full readiness against statutory SLA.',
      icon: CheckCircle2,
      badge: 'SLA Tracking',
      color: 'bg-emerald-600 text-white'
    },
    {
      num: '8',
      title: 'CLIENT SENDS RESPONSE',
      description: `${MASTER_CLIENT.name} Privacy Team approves and delivers the final response package directly to ${MASTER_CUSTOMER.name}.`,
      icon: Send,
      badge: 'Customer Delivery',
      color: 'bg-blue-700 text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                ARCHITECTURE WORKFLOW
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                How Dutro Works With {MASTER_CLIENT.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Workflow Flowchart */}
        <div className="p-6 overflow-y-auto custom-scroll space-y-4 text-xs">
          
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-slate-700 text-xs leading-relaxed space-y-1">
            <strong className="text-blue-900 block font-bold">DSR Orchestration vs. Data Custody Boundary:</strong>
            <p className="font-medium text-[11px]">
              Dutro is the <strong>orchestration platform</strong> (PDI mapping, task dispatch, deadline tracking, audit trail). <strong>{MASTER_CLIENT.name}</strong> is the <strong>data custodian</strong> (owns source systems, retrieves actual data, reviews/redacts, and delivers directly to the customer). Dutro never stores the customer's raw personal data.
            </p>
          </div>

          {/* Stepper Flow Cards */}
          <div className="space-y-2.5 pt-1">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.num}>
                  <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 text-xs">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-7 h-7 rounded-lg ${step.color} flex items-center justify-center font-bold text-xs shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">
                            {step.num}. {step.title}
                          </span>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded shrink-0 ml-2">
                        {step.badge}
                      </span>
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="flex justify-center text-slate-300 py-0.5">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
          >
            Close Architecture Flow
          </button>
        </div>

      </div>
    </div>
  );
};
