import React, { useState } from 'react';
import { 
  Plus, 
  Upload, 
  Search, 
  RotateCcw, 
  Eye, 
  Trash2, 
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  FileSpreadsheet
} from 'lucide-react';
import { SalesmanTransfer, TransferType } from '../../types';

interface SalesmanTransferListProps {
  transfers: SalesmanTransfer[];
  onAddNew: () => void;
  onOpenImport: () => void;
  onViewDetail: (transfer: SalesmanTransfer) => void;
  onDeleteTransfer: (id: string) => void;
}

export const SalesmanTransferList: React.FC<SalesmanTransferListProps> = ({
  transfers,
  onAddNew,
  onOpenImport,
  onViewDetail,
  onDeleteTransfer,
}) => {
  // Filter states (matching Figma 40000014:14874)
  const [filterCode, setFilterCode] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  
  // Pagination & selection
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtering logic
  const filteredList = transfers.filter((item) => {
    if (filterCode && !item.transferCode.toLowerCase().includes(filterCode.toLowerCase())) {
      return false;
    }
    if (filterDesc && !item.transferDescription.toLowerCase().includes(filterDesc.toLowerCase())) {
      return false;
    }
    if (filterDate && !item.transferDate.includes(filterDate)) {
      return false;
    }
    if (filterType && item.transferType !== filterType) {
      return false;
    }
    return true;
  });

  const handleClearFilters = () => {
    setFilterCode('');
    setFilterDate('');
    setFilterDesc('');
    setFilterType('');
  };

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredList.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Helper for type styling
  const getTypeBadge = (type: TransferType) => {
    switch (type) {
      case 'One to one':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            One to one
          </span>
        );
      case 'One to many':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            One to many
          </span>
        );
      case 'Many to one':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Many to one
          </span>
        );
      default:
        return <span>{type}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Form Container (Figma 40000014:14874) */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F0F0F0]">
          <Filter className="w-4 h-4 text-[#1890FF]" />
          <h2 className="text-sm font-semibold text-[#111418]">Filter & Search Transfers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Transfer Code */}
          <div>
            <label className="block text-[#595959] font-medium mb-1.5">Transfer code</label>
            <input
              type="text"
              placeholder="Please Search for transfer Code"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              className="w-full px-3 py-2 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none focus:ring-1 focus:ring-[#1890FF]/20"
            />
          </div>

          {/* Transfer Date */}
          <div>
            <label className="block text-[#595959] font-medium mb-1.5">Transfer date</label>
            <input
              type="date"
              placeholder="Please Search for transfer date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none focus:ring-1 focus:ring-[#1890FF]/20"
            />
          </div>

          {/* Transfer Description */}
          <div>
            <label className="block text-[#595959] font-medium mb-1.5">Transfer description</label>
            <input
              type="text"
              placeholder="Please Search for transfer description"
              value={filterDesc}
              onChange={(e) => setFilterDesc(e.target.value)}
              className="w-full px-3 py-2 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none focus:ring-1 focus:ring-[#1890FF]/20"
            />
          </div>

          {/* Transfer Type */}
          <div>
            <label className="block text-[#595959] font-medium mb-1.5">Transfer type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none focus:ring-1 focus:ring-[#1890FF]/20 bg-white"
            >
              <option value="">Please Select transfer type</option>
              <option value="One to one">One to one</option>
              <option value="One to many">One to many</option>
              <option value="Many to one">Many to one</option>
            </select>
          </div>
        </div>

        {/* Buttons (Figma 40000014:14963 & 14966) */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#F0F0F0]">
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-[#D9D9D9] rounded text-xs text-[#595959] hover:text-[#1890FF] hover:border-[#1890FF] transition-colors bg-white font-medium shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-5 py-1.5 bg-[#1890FF] text-white rounded text-xs font-medium hover:bg-[#40A9FF] active:bg-[#096DD9] transition-colors shadow-2xs"
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>
        </div>
      </div>

      {/* Main Table Container (Figma 40000014:14973) */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] shadow-xs overflow-hidden">
        {/* Table Top Actions Bar */}
        <div className="p-4 flex items-center justify-between border-b border-[#E8E8E8] bg-[#FAFAFA]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#111418]">Salesman Transfer Records</h3>
            <span className="text-xs text-[#8C8C8C] bg-[#F0F0F0] px-2 py-0.5 rounded-full font-medium">
              {filteredList.length} total
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenImport}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#D9D9D9] rounded text-xs font-medium text-[#595959] bg-white hover:text-[#1890FF] hover:border-[#1890FF] transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Import
            </button>
            <button
              onClick={onAddNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1890FF] text-white rounded text-xs font-semibold hover:bg-[#40A9FF] active:bg-[#096DD9] transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[#595959] font-semibold">
                <th className="py-3 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredList.length}
                    onChange={handleToggleSelectAll}
                    className="rounded border-[#D9D9D9] text-[#1890FF] focus:ring-[#1890FF]"
                  />
                </th>
                <th className="py-3 px-4 min-w-[150px]">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#1890FF]">
                    <span>Transfer code</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[220px]">Transfer description</th>
                <th className="py-3 px-4 min-w-[120px]">Transfer date</th>
                <th className="py-3 px-4 min-w-[140px]">Transfer type</th>
                <th className="py-3 px-4 min-w-[120px]">Transferred Salesmen</th>
                <th className="py-3 px-4 min-w-[110px]">Status</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8C8C8C]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSpreadsheet className="w-8 h-8 text-[#BFBFBF]" />
                      <p className="text-sm font-medium">No salesman transfer records found</p>
                      <p className="text-xs text-[#BFBFBF]">Try adjusting your search criteria or add a new transfer</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-[#F0F7FF] transition-colors ${isSelected ? 'bg-[#E6F7FF]/50' : ''}`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRow(item.id)}
                          className="rounded border-[#D9D9D9] text-[#1890FF] focus:ring-[#1890FF]"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">
                        <button
                          onClick={() => onViewDetail(item)}
                          className="text-[#1890FF] hover:underline hover:text-[#40A9FF] font-semibold text-left"
                        >
                          {item.transferCode}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-[#333333] font-medium">
                        {item.transferDescription}
                      </td>
                      <td className="py-3 px-4 text-[#595959]">
                        {item.transferDate}
                      </td>
                      <td className="py-3 px-4">
                        {getTypeBadge(item.transferType)}
                      </td>
                      <td className="py-3 px-4 text-[#595959]">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                          {item.items.length} salesmen
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.status === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onViewDetail(item)}
                            title="View Detail"
                            className="p-1 text-[#1890FF] hover:bg-[#E6F7FF] rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTransfer(item.id)}
                            title="Delete Record"
                            className="p-1 text-[#FF4D4F] hover:bg-[#FFF1F0] rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Figma 40000014:15065) */}
        <div className="p-4 border-t border-[#E8E8E8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#595959]">
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredList.length > 0 ? 1 : 0} to {filteredList.length} of {filteredList.length} entries
            </span>
            <span className="text-[#BFBFBF]">|</span>
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border border-[#D9D9D9] rounded px-2 py-1 text-xs bg-white text-[#333333]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-2.5 py-1 border border-[#D9D9D9] rounded bg-white text-xs text-[#595959] hover:border-[#1890FF] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-[#1890FF] text-white rounded text-xs font-semibold">
              1
            </span>
            <button
              disabled={true}
              className="px-2.5 py-1 border border-[#D9D9D9] rounded bg-white text-xs text-[#595959] hover:border-[#1890FF] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
