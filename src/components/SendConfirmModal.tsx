import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { MASTER_CUSTOMER, MASTER_CLIENT } from '../mockData/initialData';

interface SendConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSending: boolean;
}

export const SendConfirmModal: React.FC<SendConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSending
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-5">
        
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
          <Send className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            DELIVER CLIENT RESPONSE?
          </h3>
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Request:</span>
              <span className="font-mono font-bold text-blue-700">DSR-2001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-900">{MASTER_CUSTOMER.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Channel:</span>
              <span className="font-semibold text-slate-800">{MASTER_CLIENT.name} Portal</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-1">
            "Once approved, {MASTER_CLIENT.name} will deliver the response directly to the customer."
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={onClose}
            disabled={isSending}
            className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isSending}
            className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            {isSending ? 'Delivering...' : 'Approve & Send'}
          </button>
        </div>

      </div>
    </div>
  );
};
