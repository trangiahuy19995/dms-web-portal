import React from 'react';
import { 
  Globe, 
  ChevronRight, 
  Bell, 
  User, 
  ChevronDown, 
  Search,
  Building2,
  RefreshCw
} from 'lucide-react';

interface TopNavigationProps {
  currentView: 'list' | 'add' | 'detail';
  onNavigateBreadcrumb: (view: 'list') => void;
  transferTypeTitle?: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentView,
  onNavigateBreadcrumb,
  transferTypeTitle
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8E8E8] shadow-sm">
      {/* Enterprise Browser Domain Indicator (from Figma 40000014:14823) */}
      <div className="bg-[#F5F5F5] border-b border-[#E0E0E0] px-4 py-1.5 flex items-center justify-between text-xs text-[#666666]">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[#1890FF]" />
          <span className="font-mono text-[#555555]">https://ghana-dms.testwilmar-intl.com/transfer/salesman</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Production Environment • South Africa DMS
          </span>
          <span className="text-[#999999]">|</span>
          <span className="text-[#666666]">v2.4.10-SP4</span>
        </div>
      </div>

      {/* Main Top Header */}
      <div className="px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#1890FF] flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm">
              DMS
            </div>
            <div>
              <span className="text-base font-bold text-[#111418] tracking-tight">Wilmar DMS Web</span>
              <span className="hidden md:inline-block ml-2 text-xs text-[#8C8C8C] font-normal">Distribution Portal</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center bg-[#F5F5F5] border border-[#D9D9D9] rounded px-3 py-1.5 w-64 text-xs text-[#999999] focus-within:border-[#1890FF] focus-within:bg-white transition-all">
            <Search className="w-3.5 h-3.5 text-[#8C8C8C] mr-2" />
            <input 
              type="text" 
              placeholder="Search features, routes, salesmen..." 
              className="bg-transparent border-none outline-none text-xs text-[#333333] w-full"
            />
          </div>
        </div>

        {/* Right side controls (Account Selector from Figma 40000014:14855) */}
        <div className="flex items-center gap-4 text-xs">
          {/* Account Dropdown */}
          <div className="flex items-center gap-2 bg-[#FAFAFA] border border-[#D9D9D9] rounded px-3 py-1.5 hover:border-[#1890FF] cursor-pointer transition-colors">
            <Building2 className="w-3.5 h-3.5 text-[#1890FF]" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#8C8C8C] uppercase font-semibold">Account:</span>
              <span className="font-semibold text-[#111418] max-w-[200px] truncate">
                WHANGANUI HIGH SCHOOL STAFFROOM
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C8C8C] ml-1" />
          </div>

          <button 
            title="Refresh System Data"
            className="p-2 text-[#595959] hover:text-[#1890FF] hover:bg-[#F0F7FF] rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button 
            title="Notifications"
            className="p-2 text-[#595959] hover:text-[#1890FF] hover:bg-[#F0F7FF] rounded relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4D4F] rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#E8E8E8]">
            <div className="w-7 h-7 rounded-full bg-[#1890FF]/10 text-[#1890FF] flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-semibold text-[#333333] text-xs">Admin Manager</span>
              <span className="text-[10px] text-[#8C8C8C]">Regional Supervisor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Row (from Figma 40000014:14824) */}
      <div className="bg-[#FAFAFA] border-t border-[#E8E8E8] px-6 py-2 flex items-center justify-between text-xs">
        <nav className="flex items-center gap-1.5 text-[#666666]">
          <span className="hover:text-[#1890FF] cursor-pointer">Transfer</span>
          <ChevronRight className="w-3 h-3 text-[#BFBFBF]" />
          <span 
            onClick={() => onNavigateBreadcrumb('list')} 
            className="hover:text-[#1890FF] cursor-pointer font-medium"
          >
            Salesman
          </span>
          <ChevronRight className="w-3 h-3 text-[#BFBFBF]" />
          <span className="text-[#1890FF] font-semibold">
            {currentView === 'list' && 'Salesman Transfer List'}
            {currentView === 'add' && (transferTypeTitle ? `Add New Salesman Transfer (${transferTypeTitle})` : 'Add New Salesman Transfer')}
            {currentView === 'detail' && 'View Salesman Transfer Detail'}
          </span>
        </nav>

        <div className="flex items-center gap-3 text-xs text-[#8C8C8C]">
          <span>Module: <strong className="text-[#333333] font-medium">Sales & Distribution Core</strong></span>
          <span>•</span>
          <span>Region: <strong className="text-[#333333] font-medium">South Africa - Western Cape</strong></span>
        </div>
      </div>
    </header>
  );
};
