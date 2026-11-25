import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  ArrowLeftRight, 
  Truck, 
  Warehouse, 
  FileText, 
  Settings, 
  ShoppingBag,
  HelpCircle,
  Menu
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeItem: string;
  onSelectItem: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  activeItem,
  onSelectItem,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Outlets', icon: Users },
    { id: 'routes', label: 'Route & Territory', icon: MapPin },
    { id: 'transfer', label: 'Salesman Transfer', icon: ArrowLeftRight, highlight: true },
    { id: 'vans', label: 'Van Management', icon: Truck },
    { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
    { id: 'orders', label: 'Orders & Deliveries', icon: ShoppingBag },
    { id: 'reports', label: 'Analytics & Reports', icon: FileText },
    { id: 'settings', label: 'Portal Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white border-r border-[#E8E8E8] transition-all duration-200 flex flex-col justify-between shrink-0 select-none ${
        collapsed ? 'w-[70px]' : 'w-60'
      }`}
    >
      <div>
        {/* Toggle Collapse button */}
        <div className="h-10 border-b border-[#F0F0F0] flex items-center justify-end px-4">
          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded text-[#8C8C8C] hover:text-[#1890FF] hover:bg-[#F0F7FF] transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="py-3 px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#E6F7FF] text-[#1890FF] font-semibold border-r-2 border-[#1890FF]'
                    : 'text-[#595959] hover:bg-[#FAFAFA] hover:text-[#1890FF]'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1890FF]' : 'text-[#8C8C8C]'}`} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!collapsed && item.highlight && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#1890FF]"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer support */}
      <div className="p-3 border-t border-[#F0F0F0]">
        <button 
          title="Support & Docs"
          className={`w-full flex items-center gap-2 p-2 rounded text-xs text-[#8C8C8C] hover:text-[#1890FF] hover:bg-[#F5F5F5] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          {!collapsed && <span>DMS Help Center</span>}
        </button>
      </div>
    </aside>
  );
};
