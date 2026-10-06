import React, { useState } from 'react';
import { X, Plus, ShieldCheck, User, Mail, FileText, CheckCircle2 } from 'lucide-react';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, email: string) => void;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('Vikram Malhotra');
  const [email, setEmail] = useState('vikram.m@example.com');
  const [relationship, setRelationship] = useState('Customer');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name, email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                New Privacy Request
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Ingest Access Request
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Request Type</label>
            <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-blue-900 font-semibold flex items-center justify-between">
              <span>Access Request (Right of Access)</span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">DPDP / GDPR</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none font-medium"
            >
              <option value="Customer">Customer</option>
              <option value="Employee">Employee</option>
              <option value="Candidate">Candidate</option>
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
            <p>
              Once submitted, Dutro will automatically verify identity and match the requester's persona against the <strong>Personal Data Inventory (PDI)</strong>.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Create Request
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
