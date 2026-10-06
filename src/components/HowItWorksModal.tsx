import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { MASTER_CLIENT, MASTER_CUSTOMER } from '../mockData/initialData';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const steps = [
    { num: 1, title: 'Customer submits request', desc: `${MASTER_CUSTOMER.name} submits Right of Access request via ${MASTER_CLIENT.name} Customer Portal.` },
    { num: 2, title: 'Dutro receives the request', desc: 'Dutro initializes DSR-2001, starts 30-day statutory SLA clock, and verifies requester authentication.' },
    { num: 3, title: `Dutro checks ${MASTER_CLIENT.name}'s PDI`, desc: `Dutro scans the Personal Data Inventory (PDI) and RoPA records to map data locations.` },
    { num: 4, title: 'Dutro identifies relevant teams', desc: 'Identifies 4 processes: Customer Onboarding, Customer Support, Billing & Payments, Marketing & Communication.' },
    { num: 5, title: `Dutro sends tasks to ${MASTER_CLIENT.name} teams`, desc: 'Creates TASK-2001 to TASK-2004 for responsible client departments.' },
    { num: 6, title: `${MASTER_CLIENT.name} teams retrieve data from internal systems`, desc: 'Employees access internal systems (Customer CMS, Support Platform, Billing, Marketing) inside client systems.' },
    { num: 7, title: `${MASTER_CLIENT.name} reviews and redacts records`, desc: 'Client teams review customer data and redact third-party employee details within the client environment.' },
    { num: 8, title: 'Teams confirm task completion to Dutro', desc: 'Client employees confirm data retrieval. Dutro receives only completion status—never raw customer files.' },
    { num: 9, title: `${MASTER_CLIENT.name} Privacy Officer approves response`, desc: `${MASTER_CLIENT.privacyOfficer} reviews compliance readiness and signs off on the final response.` },
    { num: 10, title: 'Customer receives response directly from Client', desc: `${MASTER_CLIENT.name} delivers the final response package directly to ${MASTER_CUSTOMER.name} via customer portal.` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                ARCHITECTURE GUIDE
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                HOW DUTRO WORKS WITH {MASTER_CLIENT.name.toUpperCase()}
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

        {/* 10-Step Content */}
        <div className="p-6 overflow-y-auto custom-scroll space-y-3 text-xs text-slate-700">
          
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-slate-800 text-[11px] leading-relaxed font-medium">
            <strong>Core Principle:</strong> Dutro is the <em>orchestration and governance layer</em>. {MASTER_CLIENT.name} owns and controls its systems, retrieves actual customer data, and delivers the response directly to the customer.
          </div>

          <div className="space-y-2 pt-1">
            {steps.map((s) => (
              <div key={s.num} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {s.num}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">{s.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
