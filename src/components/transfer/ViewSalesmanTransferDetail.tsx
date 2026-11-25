import React from 'react';
import { ArrowLeft, CheckCircle2, Clock, Layers, Users, Calendar, Building2 } from 'lucide-react';
import { SalesmanTransfer } from '../../types';

interface ViewSalesmanTransferDetailProps {
  transfer: SalesmanTransfer;
  onBack: () => void;
}

export const ViewSalesmanTransferDetail: React.FC<ViewSalesmanTransferDetailProps> = ({
  transfer,
  onBack,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-gray-100 text-[#595959] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#111418]">View Salesman Transfer Detail</h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#1890FF] border border-blue-200">
                {transfer.transferCode}
              </span>
            </div>
            <p className="text-xs text-[#8C8C8C]">Created on {transfer.createdAt} • System verified</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 border border-[#D9D9D9] rounded text-xs font-medium text-[#595959] hover:border-[#1890FF] bg-white transition-colors"
        >
          Back to List
        </button>
      </div>

      {/* General Information Card (Figma 40000050:34154) */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#F0F0F0]">
          <Layers className="w-4 h-4 text-[#1890FF]" />
          <h3 className="text-sm font-bold text-[#111418]">General Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {/* Transfer Code */}
          <div>
            <span className="block text-[#8C8C8C] mb-1 font-medium">Transfer code</span>
            <span className="font-mono font-bold text-sm text-[#111418]">{transfer.transferCode}</span>
          </div>

          {/* Transfer Type */}
          <div>
            <span className="block text-[#8C8C8C] mb-1 font-medium">Transfer type</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {transfer.transferType}
            </span>
          </div>

          {/* Transfer Date */}
          <div>
            <span className="block text-[#8C8C8C] mb-1 font-medium">Transfer date</span>
            <span className="font-semibold text-sm text-[#333333] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1890FF]" />
              {transfer.transferDate}
            </span>
          </div>

          {/* Transfer Description */}
          <div>
            <span className="block text-[#8C8C8C] mb-1 font-medium">Transfer description</span>
            <span className="font-medium text-[#111418] text-sm">{transfer.transferDescription}</span>
          </div>

          {/* Source Distributor */}
          <div>
            <span className="block text-[#8C8C8C] mb-1 font-medium">Source distributor</span>
            <span className="font-medium text-[#333333] text-sm flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#8C8C8C]" />
              {transfer.sourceDistributorCode 
                ? `${transfer.sourceDistributorCode} | ${transfer.sourceDistributorName}` 
                : 'Multiple Distributors (See table below)'}
            </span>
          </div>

          {/* Destination Distributor */}
          <div>
            <span className="block text-[#8C8C8C] mb-1 font-medium">Destination distributor</span>
            <span className="font-medium text-[#333333] text-sm flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#8C8C8C]" />
              {transfer.destinationDistributorCode 
                ? `${transfer.destinationDistributorCode} | ${transfer.destinationDistributorName}` 
                : 'Multiple Distributors (See table below)'}
            </span>
          </div>

          {/* Complete Transfer */}
          <div>
            <span className="block text-[#8C8C8C] mb-1 font-medium">Complete Transfer</span>
            {transfer.completeTransfer ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed & Synchronized
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-600 font-semibold text-xs bg-amber-50 px-2.5 py-1 rounded">
                <Clock className="w-3.5 h-3.5" />
                Pending Confirmation
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Transferred Salesmen Table Card */}
      <div className="bg-white rounded-lg border border-[#E8E8E8] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8E8E8] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1890FF]" />
            <h3 className="text-sm font-bold text-[#111418]">Transferred Salesmen ({transfer.items.length})</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[#595959] font-semibold">
                <th className="py-3 px-4">Salesman</th>
                <th className="py-3 px-4">Salesman type</th>
                <th className="py-3 px-4">Source distributor</th>
                <th className="py-3 px-4">Destination distributor</th>
                <th className="py-3 px-4">Sales position</th>
                <th className="py-3 px-4">Main warehouse</th>
                <th className="py-3 px-4">Van Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {transfer.items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F9FBFF] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#111418]">
                    {item.salesmanCode} | {item.salesmanName}
                    {item.email && <div className="text-[11px] text-[#8C8C8C] font-normal">{item.email}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.salesmanType === 'Pre sales' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {item.salesmanType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#333333]">
                    {item.sourceDistributorCode} | {item.sourceDistributorName}
                  </td>
                  <td className="py-3 px-4 text-[#333333]">
                    {item.destinationDistributorCode} | {item.destinationDistributorName}
                  </td>
                  <td className="py-3 px-4 text-[#111418] font-medium">
                    {item.salesPositionCode} | {item.salesPositionName}
                  </td>
                  <td className="py-3 px-4 text-[#111418]">
                    {item.mainWarehouseCode} | {item.mainWarehouseName}
                  </td>
                  <td className="py-3 px-4">
                    {item.vanCode ? (
                      <span className="font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.vanCode} | {item.vanName}
                      </span>
                    ) : (
                      <span className="text-[#8C8C8C] italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
