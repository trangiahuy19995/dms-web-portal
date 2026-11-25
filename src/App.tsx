import { useState } from 'react';
import { TopNavigation } from './components/layout/TopNavigation';
import { Sidebar } from './components/layout/Sidebar';
import { SalesmanTransferList } from './components/transfer/SalesmanTransferList';
import { AddSalesmanTransfer } from './components/transfer/AddSalesmanTransfer';
import { ViewSalesmanTransferDetail } from './components/transfer/ViewSalesmanTransferDetail';
import { ImportTransferModal } from './components/transfer/ImportTransferModal';
import { initialSalesmanTransfers } from './data/mockData';
import { SalesmanTransfer } from './types';
import { CheckCircle2, X } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'detail'>('list');
  const [selectedTransfer, setSelectedTransfer] = useState<SalesmanTransfer | null>(null);
  const [transfers, setTransfers] = useState<SalesmanTransfer[]>(initialSalesmanTransfers);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('transfer');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleAddNew = () => {
    setCurrentView('add');
  };

  const handleViewDetail = (transfer: SalesmanTransfer) => {
    setSelectedTransfer(transfer);
    setCurrentView('detail');
  };

  const handleDeleteTransfer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this salesman transfer record?')) {
      setTransfers(prev => prev.filter(t => t.id !== id));
      showNotification('Salesman transfer record deleted successfully.');
    }
  };

  const handleSubmitNewTransfer = (transferData: any) => {
    const newRecord: SalesmanTransfer = {
      id: `ST-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...transferData,
    };

    setTransfers(prev => [newRecord, ...prev]);
    setCurrentView('list');
    showNotification(`Salesman transfer ${newRecord.transferCode} created & synchronized successfully!`);
  };

  const handleImportSuccess = (count: number) => {
    showNotification(`Successfully imported ${count} salesman transfer records!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F5]">
      {/* Top Navigation Bar */}
      <TopNavigation
        currentView={currentView}
        onNavigateBreadcrumb={() => setCurrentView('list')}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeItem={activeSidebarItem}
          onSelectItem={(item) => {
            setActiveSidebarItem(item);
            if (item === 'transfer') {
              setCurrentView('list');
            }
          }}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-6 max-w-[1728px] mx-auto w-full">
          {/* Notification Toast */}
          {notification && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-xs text-emerald-800 shadow-sm animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{notification}</span>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-emerald-700 hover:text-emerald-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentView === 'list' && (
            <SalesmanTransferList
              transfers={transfers}
              onAddNew={handleAddNew}
              onOpenImport={() => setIsImportModalOpen(true)}
              onViewDetail={handleViewDetail}
              onDeleteTransfer={handleDeleteTransfer}
            />
          )}

          {currentView === 'add' && (
            <AddSalesmanTransfer
              onCancel={() => setCurrentView('list')}
              onSubmit={handleSubmitNewTransfer}
            />
          )}

          {currentView === 'detail' && selectedTransfer && (
            <ViewSalesmanTransferDetail
              transfer={selectedTransfer}
              onBack={() => setCurrentView('list')}
            />
          )}
        </main>
      </div>

      {/* Import Modal */}
      <ImportTransferModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}

export default App;
