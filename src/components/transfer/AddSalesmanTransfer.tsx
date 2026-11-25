import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Send, 
  AlertCircle,
  Layers
} from 'lucide-react';
import { 
  TransferType, 
  SalesmanTransferMapping, 
  Salesman 
} from '../../types';
import { 
  mockDistributors, 
  mockWarehouses, 
  mockPositions, 
  mockVans 
} from '../../data/mockData';
import { AddSalesmanModal } from './AddSalesmanModal';

interface AddSalesmanTransferProps {
  onCancel: () => void;
  onSubmit: (transferData: any) => void;
}

export const AddSalesmanTransfer: React.FC<AddSalesmanTransferProps> = ({
  onCancel,
  onSubmit,
}) => {
  // General Info Form
  const [transferType, setTransferType] = useState<TransferType>('One to one');
  const [transferDesc, setTransferDesc] = useState('Transfer A to B');
  const [transferDate, setTransferDate] = useState('2026-10-13');
  const [sourceDistributor, setSourceDistributor] = useState('510001');
  const [destinationDistributor, setDestinationDistributor] = useState('510002');
  const [completeTransfer, setCompleteTransfer] = useState(true);

  // Table items state
  const [items, setItems] = useState<SalesmanTransferMapping[]>([
    {
      id: 'm1',
      salesmanCode: 'SM001',
      salesmanName: 'Salesman A',
      salesmanType: 'Pre sales',
      email: 'salesman.a@wilmar-intl.com',
      sourceDistributorCode: '510001',
      sourceDistributorName: 'Distributor A',
      destinationDistributorCode: '510002',
      destinationDistributorName: 'Distributor B',
      salesPositionCode: 'SP001',
      salesPositionName: 'Pre sale 1',
      mainWarehouseCode: 'WH01',
      mainWarehouseName: 'South Warehouse',
    },
    {
      id: 'm2',
      salesmanCode: 'SM002',
      salesmanName: 'Salesman B',
      salesmanType: 'Van sales',
      email: 'salesman.b@wilmar-intl.com',
      sourceDistributorCode: '510001',
      sourceDistributorName: 'Distributor A',
      destinationDistributorCode: '510002',
      destinationDistributorName: 'Distributor B',
      salesPositionCode: 'SP002',
      salesPositionName: 'Van sales 1',
      mainWarehouseCode: 'WH02',
      mainWarehouseName: 'North Warehouse',
      vanCode: 'WH02-V01',
      vanName: 'Van 1',
    },
  ]);

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // When transfer type changes, adapt description & defaults
  const handleTypeChange = (newType: TransferType) => {
    setTransferType(newType);
    if (newType === 'One to one') {
      setTransferDesc('Transfer A to B');
      setSourceDistributor('510001');
      setDestinationDistributor('510002');
    } else if (newType === 'Many to one') {
      setTransferDesc('Transfer A, B to C');
      setDestinationDistributor('510003');
    } else if (newType === 'One to many') {
      setTransferDesc('Transfer A to B, C');
      setSourceDistributor('510001');
    }
  };

  // Add Salesmen from Modal
  const handleAddSalesmenFromModal = (salesmen: Salesman[]) => {
    const newItems: SalesmanTransferMapping[] = salesmen.map((s, index) => {
      const srcCode = transferType === 'Many to one' ? s.distributorCode : sourceDistributor;
      const srcName = mockDistributors.find(d => d.code === srcCode)?.name || s.distributorName;
      
      const dstCode = transferType === 'One to many' ? '' : destinationDistributor;
      const dstName = mockDistributors.find(d => d.code === dstCode)?.name || '';

      return {
        id: `map-${Date.now()}-${index}`,
        salesmanCode: s.code,
        salesmanName: s.name,
        salesmanType: s.type,
        email: s.email,
        sourceDistributorCode: srcCode,
        sourceDistributorName: srcName,
        destinationDistributorCode: dstCode,
        destinationDistributorName: dstName,
        salesPositionCode: '',
        salesPositionName: '',
        mainWarehouseCode: '',
        mainWarehouseName: '',
        vanCode: '',
        vanName: '',
      };
    });

    setItems(prev => [...prev, ...newItems]);
  };

  // Row selection
  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(items.map(i => i.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    setItems(prev => prev.filter(i => !selectedRowIds.includes(i.id)));
    setSelectedRowIds([]);
  };

  // Update item field
  const updateItemField = (id: string, field: keyof SalesmanTransferMapping, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;

      const updated = { ...item, [field]: value };

      if (field === 'destinationDistributorCode') {
        const found = mockDistributors.find(d => d.code === value);
        updated.destinationDistributorName = found ? found.name : '';
      }
      if (field === 'sourceDistributorCode') {
        const found = mockDistributors.find(d => d.code === value);
        updated.sourceDistributorName = found ? found.name : '';
      }
      if (field === 'salesPositionCode') {
        const found = mockPositions.find(p => p.code === value);
        updated.salesPositionName = found ? found.name : '';
      }
      if (field === 'mainWarehouseCode') {
        const found = mockWarehouses.find(w => w.code === value);
        updated.mainWarehouseName = found ? found.name : '';
      }
      if (field === 'vanCode') {
        const found = mockVans.find(v => v.code === value);
        updated.vanName = found ? found.name : '';
      }

      return updated;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!transferDesc.trim()) {
      setValidationError('Please input transfer description.');
      return;
    }

    if (items.length === 0) {
      setValidationError('Please add at least one salesman to transfer.');
      return;
    }

    if (transferType === 'One to one') {
      if (!sourceDistributor || !destinationDistributor) {
        setValidationError('Please select both source and destination distributors.');
        return;
      }
      if (sourceDistributor === destinationDistributor) {
        setValidationError('Source and destination distributors must be different.');
        return;
      }
    }

    if (transferType === 'Many to one' && !destinationDistributor) {
      setValidationError('Please select destination distributor.');
      return;
    }

    if (transferType === 'One to many' && !sourceDistributor) {
      setValidationError('Please select source distributor.');
      return;
    }

    // Check if each item has position and warehouse
    for (const it of items) {
      if (!it.salesPositionCode) {
        setValidationError(`Please select Sales position for salesman ${it.salesmanCode} - ${it.salesmanName}`);
        return;
      }
      if (!it.mainWarehouseCode) {
        setValidationError(`Please select Main warehouse for salesman ${it.salesmanCode} - ${it.salesmanName}`);
        return;
      }
      if (it.salesmanType === 'Van sales' && !it.vanCode) {
        setValidationError(`Please select Van for Van Salesman ${it.salesmanCode} - ${it.salesmanName}`);
        return;
      }
      if (transferType === 'One to many' && !it.destinationDistributorCode) {
        setValidationError(`Please select Destination distributor for ${it.salesmanCode} - ${it.salesmanName}`);
        return;
      }
    }

    const payload = {
      transferCode: `ST261013${Math.floor(1000 + Math.random() * 9000)}`,
      transferDescription: transferDesc.trim(),
      transferDate,
      transferType,
      sourceDistributorCode: transferType !== 'Many to one' ? sourceDistributor : undefined,
      sourceDistributorName: transferType !== 'Many to one' ? mockDistributors.find(d => d.code === sourceDistributor)?.name : undefined,
      destinationDistributorCode: transferType !== 'One to many' ? destinationDistributor : undefined,
      destinationDistributorName: transferType !== 'One to many' ? mockDistributors.find(d => d.code === destinationDistributor)?.name : undefined,
      completeTransfer,
      items,
      status: 'Completed',
    };

    onSubmit(payload);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Breadcrumb Info */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-gray-100 text-[#595959] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-[#111418]">Add New Salesman Transfer</h2>
            <p className="text-xs text-[#8C8C8C]">Configure transfer mapping rules and destination allocations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#D9D9D9] rounded text-xs font-medium text-[#595959] hover:border-[#1890FF] bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#1890FF] text-white rounded text-xs font-semibold hover:bg-[#40A9FF] active:bg-[#096DD9] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            Submit
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* General Information Card (Figma 40000038:3526 & 40000042:23561) */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1890FF]" />
            <h3 className="text-sm font-bold text-[#111418]">General Information</h3>
          </div>
          <span className="text-[11px] text-[#8C8C8C] italic">Fields marked with * are mandatory</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Transfer Type */}
          <div>
            <label className="block text-[#333333] font-semibold mb-1.5">
              Transfer Type <span className="text-red-500">*</span>
            </label>
            <select
              value={transferType}
              onChange={(e) => handleTypeChange(e.target.value as TransferType)}
              className="w-full px-3 py-2 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none bg-white font-medium"
            >
              <option value="One to one">One to one (Single Source & Single Dest)</option>
              <option value="Many to one">Many to one (Multiple Sources & Single Dest)</option>
              <option value="One to many">One to many (Single Source & Multiple Dests)</option>
            </select>
            <p className="mt-1 text-[11px] text-[#8C8C8C]">
              {transferType === 'One to one' && 'Moves salesmen between 2 specific distributors'}
              {transferType === 'Many to one' && 'Consolidates salesmen from multiple distributors to 1 destination'}
              {transferType === 'One to many' && 'Distributes salesmen from 1 source across multiple destinations'}
            </p>
          </div>

          {/* Transfer Description */}
          <div>
            <label className="block text-[#333333] font-semibold mb-1.5">
              Transfer description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Please input transfer description"
              value={transferDesc}
              onChange={(e) => setTransferDesc(e.target.value)}
              className="w-full px-3 py-2 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none"
            />
          </div>

          {/* Transfer Date */}
          <div>
            <label className="block text-[#333333] font-semibold mb-1.5">
              Transfer date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none"
              />
            </div>
          </div>

          {/* Source Distributor */}
          <div>
            <label className="block text-[#333333] font-semibold mb-1.5 flex items-center justify-between">
              <span>Source distributor {transferType !== 'Many to one' && <span className="text-red-500">*</span>}</span>
              {transferType === 'Many to one' && (
                <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-normal">
                  Specified per row below
                </span>
              )}
            </label>
            <select
              value={sourceDistributor}
              onChange={(e) => setSourceDistributor(e.target.value)}
              disabled={transferType === 'Many to one'}
              className="w-full px-3 py-2 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none bg-white disabled:bg-[#F5F5F5] disabled:text-[#8C8C8C]"
            >
              <option value="">Please select source distributor</option>
              {mockDistributors.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} | {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Distributor */}
          <div>
            <label className="block text-[#333333] font-semibold mb-1.5 flex items-center justify-between">
              <span>Destination distributor {transferType !== 'One to many' && <span className="text-red-500">*</span>}</span>
              {transferType === 'One to many' && (
                <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-normal">
                  Specified per row below
                </span>
              )}
            </label>
            <select
              value={destinationDistributor}
              onChange={(e) => setDestinationDistributor(e.target.value)}
              disabled={transferType === 'One to many'}
              className="w-full px-3 py-2 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none bg-white disabled:bg-[#F5F5F5] disabled:text-[#8C8C8C]"
            >
              <option value="">Please select destination distributor</option>
              {mockDistributors.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} | {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Complete Transfer Checkbox (Figma 40000038:3526) */}
          <div className="flex items-center pt-6">
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={completeTransfer}
                onChange={(e) => setCompleteTransfer(e.target.checked)}
                className="w-4 h-4 rounded border-[#D9D9D9] text-[#1890FF] focus:ring-[#1890FF]"
              />
              <span className="text-xs font-semibold text-[#111418]">Complete Transfer</span>
            </label>
          </div>
        </div>
      </div>

      {/* Salesman Transfer Table Card (Figma 40000042:23561) */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E8E8] bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#333333]">
              {selectedRowIds.length} items selected
            </span>
            {selectedRowIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded text-xs font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1890FF] text-white rounded text-xs font-semibold hover:bg-[#40A9FF] active:bg-[#096DD9] transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              Add Salesman
            </button>
          </div>
        </div>

        {/* Data Table with Dynamic Columns */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[#595959] font-semibold">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && selectedRowIds.length === items.length}
                    onChange={handleToggleSelectAll}
                    className="rounded border-[#D9D9D9] text-[#1890FF] focus:ring-[#1890FF]"
                  />
                </th>
                <th className="py-3 px-3 min-w-[150px]">Salesman</th>
                <th className="py-3 px-3 min-w-[100px]">Salesman type</th>
                
                {/* Source distributor column (if Many to one) */}
                {transferType === 'Many to one' && (
                  <th className="py-3 px-3 min-w-[170px]">Source distributor *</th>
                )}

                {/* Destination distributor column (if One to many) */}
                {transferType === 'One to many' && (
                  <th className="py-3 px-3 min-w-[170px]">Destination distributor *</th>
                )}

                <th className="py-3 px-3 min-w-[170px]">Sales position *</th>
                <th className="py-3 px-3 min-w-[170px]">Main warehouse *</th>
                <th className="py-3 px-3 min-w-[160px]">Van Name</th>
                <th className="py-3 px-3 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#8C8C8C]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-xs font-medium">No salesmen added yet</p>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs text-[#1890FF] hover:underline font-semibold"
                      >
                        Click "Add Salesman" to select salesmen for transfer
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isSelected = selectedRowIds.includes(item.id);
                  const isVanSales = item.salesmanType === 'Van sales';
                  const availablePositions = mockPositions.filter(p => p.type === item.salesmanType);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#F9FBFF] transition-colors ${isSelected ? 'bg-[#E6F7FF]/40' : ''}`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRow(item.id)}
                          className="rounded border-[#D9D9D9] text-[#1890FF] focus:ring-[#1890FF]"
                        />
                      </td>

                      {/* Salesman code & name */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#111418]">
                          {item.salesmanCode} | {item.salesmanName}
                        </div>
                        {item.email && (
                          <div className="text-[11px] text-[#8C8C8C]">{item.email}</div>
                        )}
                      </td>

                      {/* Salesman type */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.salesmanType === 'Pre sales' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {item.salesmanType}
                        </span>
                      </td>

                      {/* Source distributor (if Many to one) */}
                      {transferType === 'Many to one' && (
                        <td className="py-3 px-3">
                          <select
                            value={item.sourceDistributorCode}
                            onChange={(e) => updateItemField(item.id, 'sourceDistributorCode', e.target.value)}
                            className="w-full px-2 py-1.5 border border-[#D9D9D9] rounded text-xs bg-white focus:border-[#1890FF] focus:outline-none"
                          >
                            <option value="">Please select source distributor</option>
                            {mockDistributors.map((d) => (
                              <option key={d.code} value={d.code}>
                                {d.code} | {d.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}

                      {/* Destination distributor (if One to many) */}
                      {transferType === 'One to many' && (
                        <td className="py-3 px-3">
                          <select
                            value={item.destinationDistributorCode}
                            onChange={(e) => updateItemField(item.id, 'destinationDistributorCode', e.target.value)}
                            className="w-full px-2 py-1.5 border border-[#D9D9D9] rounded text-xs bg-white focus:border-[#1890FF] focus:outline-none"
                          >
                            <option value="">Please select destination distributor</option>
                            {mockDistributors.map((d) => (
                              <option key={d.code} value={d.code}>
                                {d.code} | {d.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}

                      {/* Sales Position */}
                      <td className="py-3 px-3">
                        <select
                          value={item.salesPositionCode || ''}
                          onChange={(e) => updateItemField(item.id, 'salesPositionCode', e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#D9D9D9] rounded text-xs bg-white focus:border-[#1890FF] focus:outline-none"
                        >
                          <option value="">Please select sales position</option>
                          {availablePositions.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.code} | {p.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Main Warehouse */}
                      <td className="py-3 px-3">
                        <select
                          value={item.mainWarehouseCode || ''}
                          onChange={(e) => updateItemField(item.id, 'mainWarehouseCode', e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#D9D9D9] rounded text-xs bg-white focus:border-[#1890FF] focus:outline-none"
                        >
                          <option value="">Please select warehouse</option>
                          {mockWarehouses.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.code} | {w.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Van Name */}
                      <td className="py-3 px-3">
                        {isVanSales ? (
                          <select
                            value={item.vanCode || ''}
                            onChange={(e) => updateItemField(item.id, 'vanCode', e.target.value)}
                            className="w-full px-2 py-1.5 border border-[#D9D9D9] rounded text-xs bg-white focus:border-[#1890FF] focus:outline-none"
                          >
                            <option value="">Please select van name</option>
                            {mockVans.map((v) => (
                              <option key={v.code} value={v.code}>
                                {v.code} | {v.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-[#8C8C8C] italic text-[11px]">N/A (Pre sales)</span>
                        )}
                      </td>

                      {/* Row Delete */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                          className="p-1 text-[#8C8C8C] hover:text-[#FF4D4F] transition-colors"
                          title="Remove Salesman"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Salesman Modal */}
      <AddSalesmanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectSalesmen={handleAddSalesmenFromModal}
        alreadySelectedCodes={items.map(i => i.salesmanCode)}
        filterDistributorCode={transferType !== 'Many to one' ? sourceDistributor : undefined}
      />
    </div>
  );
};
