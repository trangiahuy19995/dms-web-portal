import React, { useState } from 'react';
import { X, Search, RotateCcw, Check, Users } from 'lucide-react';
import { Salesman } from '../../types';
import { mockSalesmenPool, mockDistributors } from '../../data/mockData';

interface AddSalesmanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSalesmen: (selected: Salesman[]) => void;
  alreadySelectedCodes: string[];
  filterDistributorCode?: string; // Optional constraint if One to one / One to many
}

export const AddSalesmanModal: React.FC<AddSalesmanModalProps> = ({
  isOpen,
  onClose,
  onSelectSalesmen,
  alreadySelectedCodes,
  filterDistributorCode,
}) => {
  // Modal filter states (matching Figma 40000050:31546)
  const [codeQuery, setCodeQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [distributorQuery, setDistributorQuery] = useState(filterDistributorCode || '');

  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  if (!isOpen) return null;

  // Filter pool
  const filteredSalesmen = mockSalesmenPool.filter((s) => {
    if (codeQuery && !s.code.toLowerCase().includes(codeQuery.toLowerCase())) {
      return false;
    }
    if (nameQuery && !s.name.toLowerCase().includes(nameQuery.toLowerCase())) {
      return false;
    }
    if (typeQuery && s.type !== typeQuery) {
      return false;
    }
    if (emailQuery && !s.email.toLowerCase().includes(emailQuery.toLowerCase())) {
      return false;
    }
    if (distributorQuery && s.distributorCode !== distributorQuery) {
      return false;
    }
    return true;
  });

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCodes(filteredSalesmen.map(s => s.code));
    } else {
      setSelectedCodes([]);
    }
  };

  const handleToggleRow = (code: string) => {
    setSelectedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSave = () => {
    const selectedObjects = mockSalesmenPool.filter(s => selectedCodes.includes(s.code));
    onSelectSalesmen(selectedObjects);
    onClose();
  };

  const handleClear = () => {
    setCodeQuery('');
    setNameQuery('');
    setTypeQuery('');
    setEmailQuery('');
    if (!filterDistributorCode) {
      setDistributorQuery('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-[#D9D9D9] shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-[#E8E8E8] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1890FF]" />
            <h3 className="text-sm font-bold text-[#111418]">Add Salesman</h3>
            <span className="text-[#8C8C8C] text-xs font-normal">• Select salesmen for transfer</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8C8C8C] hover:text-[#333333] hover:bg-[#E8E8E8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters Form (Figma 40000050:31546) */}
        <div className="p-5 border-b border-[#E8E8E8] bg-white space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Salesman code */}
            <div>
              <label className="block text-[#595959] font-medium mb-1">Salesman code</label>
              <input
                type="text"
                placeholder="Search For Salesman code"
                value={codeQuery}
                onChange={(e) => setCodeQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none"
              />
            </div>

            {/* Salesman name */}
            <div>
              <label className="block text-[#595959] font-medium mb-1">Salesman name</label>
              <input
                type="text"
                placeholder="Search For Salesman name"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none"
              />
            </div>

            {/* Salesman type */}
            <div>
              <label className="block text-[#595959] font-medium mb-1">Salesman type</label>
              <select
                value={typeQuery}
                onChange={(e) => setTypeQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none bg-white"
              >
                <option value="">Search For Salesman type</option>
                <option value="Pre sales">Pre sales</option>
                <option value="Van sales">Van sales</option>
              </select>
            </div>

            {/* Email address */}
            <div>
              <label className="block text-[#595959] font-medium mb-1">Email address</label>
              <input
                type="text"
                placeholder="Search For Email Address"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none"
              />
            </div>

            {/* Distributor */}
            <div>
              <label className="block text-[#595959] font-medium mb-1">Distributor</label>
              <select
                value={distributorQuery}
                onChange={(e) => setDistributorQuery(e.target.value)}
                disabled={Boolean(filterDistributorCode)}
                className="w-full px-2.5 py-1.5 border border-[#D9D9D9] rounded text-xs text-[#333333] focus:border-[#1890FF] focus:outline-none bg-white disabled:bg-[#F5F5F5] disabled:text-[#8C8C8C]"
              >
                <option value="">Search for Distributor</option>
                {mockDistributors.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code} | {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleClear}
              className="px-3 py-1.5 border border-[#D9D9D9] rounded text-xs text-[#595959] hover:border-[#1890FF] flex items-center gap-1 font-medium bg-white"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
            <button
              onClick={() => {}}
              className="px-4 py-1.5 bg-[#1890FF] text-white rounded text-xs font-semibold hover:bg-[#40A9FF] flex items-center gap-1"
            >
              <Search className="w-3 h-3" />
              Search
            </button>
          </div>
        </div>

        {/* Salesmen Table */}
        <div className="overflow-y-auto max-h-[380px] p-4">
          <table className="w-full text-left border-collapse border border-[#E8E8E8]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[#595959] font-semibold">
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedCodes.length > 0 && selectedCodes.length === filteredSalesmen.length}
                    onChange={handleToggleSelectAll}
                    className="rounded border-[#D9D9D9] text-[#1890FF] focus:ring-[#1890FF]"
                  />
                </th>
                <th className="py-2.5 px-3">Salesman code</th>
                <th className="py-2.5 px-3">Salesman name</th>
                <th className="py-2.5 px-3">Salesman type</th>
                <th className="py-2.5 px-3">Email address</th>
                <th className="py-2.5 px-3">Distributor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {filteredSalesmen.map((s) => {
                const isSelected = selectedCodes.includes(s.code);
                const isAlreadyAdded = alreadySelectedCodes.includes(s.code);

                return (
                  <tr
                    key={s.code}
                    onClick={() => !isAlreadyAdded && handleToggleRow(s.code)}
                    className={`cursor-pointer transition-colors ${
                      isAlreadyAdded
                        ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#E6F7FF]'
                        : 'hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected || isAlreadyAdded}
                        disabled={isAlreadyAdded}
                        onChange={() => {}}
                        className="rounded border-[#D9D9D9] text-[#1890FF] focus:ring-[#1890FF]"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-[#1890FF]">
                      {s.code}
                      {isAlreadyAdded && <span className="ml-2 text-[10px] text-gray-500">(Already Added)</span>}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#111418]">{s.name}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        s.type === 'Pre sales' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#595959]">{s.email}</td>
                    <td className="py-2.5 px-3 text-[#333333]">
                      {s.distributorCode} | {s.distributorName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer (Figma 40000050:31546 Save & Cancel) */}
        <div className="px-6 py-3 border-t border-[#E8E8E8] bg-[#FAFAFA] flex items-center justify-between">
          <span className="text-xs text-[#595959] font-medium">
            {selectedCodes.length} salesman(men) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#D9D9D9] rounded text-xs font-medium text-[#595959] hover:border-[#1890FF] bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={selectedCodes.length === 0}
              className="px-5 py-2 bg-[#1890FF] text-white rounded text-xs font-semibold hover:bg-[#40A9FF] active:bg-[#096DD9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
