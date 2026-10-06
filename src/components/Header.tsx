import React, { useState } from 'react';
import { 
  ChevronRight, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  ChevronDown, 
  Check, 
  Sparkles,
  Users,
  LogOut
} from 'lucide-react';
import { PlatformUser, MainNavigationSection, DSRWorkspaceFilter } from '../types';
import { DEMO_USERS, MASTER_CLIENT } from '../mockData/initialData';

interface HeaderProps {
  currentMainView: MainNavigationSection;
  activeFilterTab?: DSRWorkspaceFilter;
  currentUser: PlatformUser;
  onSwitchUser: (user: PlatformUser) => void;
  onNavigateToWorkspace: (tab?: DSRWorkspaceFilter) => void;
  onNavigateToSettings: (tab?: string) => void;
  onOpenCustomerIntakeModal: () => void;
  onSwitchToCustomerView?: () => void;
  onLogout?: () => void;
  activeRequestId?: string;
  activePersonName?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentMainView, 
  activeFilterTab = 'inbox',
  currentUser,
  onSwitchUser,
  onNavigateToWorkspace,
  onNavigateToSettings,
  onOpenCustomerIntakeModal,
  onSwitchToCustomerView,
  onLogout,
  activeRequestId = 'DSR-2001',
  activePersonName = 'Rohan Mehta'
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (currentMainView) {
      case 'overview': return 'Overview Dashboard';
      case 'my-tasks': return 'My Tasks & Department Actions';
      case 'data-discovery': return 'Data Discovery';
      case 'data-sources': return 'Data Sources Catalog';
      case 'redaction-reviews': return 'Redaction Reviews';
      case 'sla-deadlines': return 'SLA & Deadlines';
      case 'audit-trail': return 'Platform Audit Trail';
      case 'settings': return 'Settings & Integrations';
      case 'grievances': return 'Grievances Redressal';
      case 'history': return 'DSR History Archive';
      case 'workspace': {
        switch (activeFilterTab) {
          case 'pending-verification': return 'Pending Verification';
          case 'pending-client-action': return 'Pending Client Action';
          case 'completed': return 'Completed Requests';
          case 'inbox':
          default:
            return 'Request Inbox';
        }
      }
      case 'details': return 'DSR Case Workspace';
      default: return 'DSR Workspace';
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-2xs select-none relative z-30">
      
      {/* Left: Breadcrumbs & Client Organization Context */}
      <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 truncate mr-2">
        <span className="text-slate-400 hidden sm:inline">Dutro Platform</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
        <span className="font-semibold text-slate-700">{MASTER_CLIENT.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        
        <button 
          onClick={() => onNavigateToWorkspace(activeFilterTab)}
          className={`hover:text-blue-600 transition-colors cursor-pointer font-semibold ${
            currentMainView === 'workspace' || currentMainView === 'overview' ? 'text-blue-700 font-bold' : 'text-slate-600'
          }`}
        >
          {getBreadcrumbTitle()}
        </button>

        {currentMainView === 'details' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-blue-700 font-bold font-mono bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
              {activeRequestId}
            </span>
            <span className="text-slate-600 font-medium hidden md:inline">({activePersonName})</span>
          </>
        )}
      </div>

      {/* Right: Customer Intake Action & Logged-In User Profile Switcher */}
      <div className="flex items-center space-x-2.5 shrink-0">
        
        {/* Customer Registration & 2FA Flow Launcher Button */}
        <button
          onClick={onOpenCustomerIntakeModal}
          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
          title="Demonstrate Customer Registration, 2FA OTP, and DSR Intake"
        >
          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Customer 2FA Intake</span>
          <span className="sm:hidden">Intake</span>
        </button>

        {/* Direct Sign Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer text-xs font-semibold shadow-2xs"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        )}

        {/* Unified User Profile & Role Switcher (Section 1) */}
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center space-x-2.5 pl-2.5 pr-2 py-1 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight flex items-center justify-end space-x-1">
                <span>{currentUser.name}</span>
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {currentUser.role} · {currentUser.organization}
              </p>
            </div>

            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.avatarInitials}
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Role Persona Switcher Dropdown */}
          {isUserDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsUserDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-1 animate-fade-in text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    SWITCH DEMO ROLE (ONE DASHBOARD)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Switch role views without leaving the unified Dutro platform.
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  {DEMO_USERS.map((user) => {
                    const isSelected = user.id === currentUser.id;

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          onSwitchUser(user);
                          setIsUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {user.avatarInitials}
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-semibold block leading-tight">{user.name}</span>
                            <span className="text-[10px] text-slate-400 block">{user.role} ({user.organization})</span>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 px-2 pb-1 space-y-1">
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onNavigateToSettings('users-roles');
                    }}
                    className="w-full text-center text-[11px] text-blue-600 font-semibold hover:underline block"
                  >
                    Manage Role Permissions in Settings →
                  </button>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full py-1 text-center text-[11px] text-rose-600 font-semibold hover:bg-rose-50 rounded-lg transition-colors block"
                    >
                      Sign Out / Switch Authentication
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </header>
  );
};
