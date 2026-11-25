import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet } from 'lucide-react';

interface ImportTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

export const ImportTransferModal: React.FC<ImportTransferModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartImport = () => {
    if (!selectedFile) return;
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      onImportSuccess(3);
      onClose();
    }, 1000);
  };

  const handleDownloadTemplate = () => {
    // Generate simple sample CSV download
    const csvContent = "data:text/csv;charset=utf-8," + 
      "TransferType,TransferDescription,TransferDate,SourceDistributor,DestinationDistributor,SalesmanCode,SalesPositionCode,WarehouseCode,VanCode\n" +
      "One to one,Transfer A to B,2026-10-13,510001,510002,SM001,SP001,WH01,\n" +
      "One to one,Transfer A to B,2026-10-13,510001,510002,SM002,SP002,WH02,WH02-V01";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "salesman_transfer_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-[#D9D9D9] shadow-xl w-full max-w-lg overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-[#E8E8E8] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#1890FF]" />
            <h3 className="text-sm font-bold text-[#111418]">Import Salesman Transfer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8C8C8C] hover:text-[#333333] hover:bg-[#E8E8E8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-[#E6F7FF] border border-[#91D5FF] rounded flex items-start gap-2.5">
            <Download className="w-4 h-4 text-[#1890FF] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#1890FF]">Need the Excel/CSV format template?</span>
              <p className="text-[11px] text-[#595959]">
                Download our standardized template with pre-filled validation guidelines.
              </p>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-xs text-[#1890FF] font-semibold underline hover:text-[#40A9FF] mt-1 inline-block"
              >
                Download Transfer Template (.csv)
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-[#D9D9D9] rounded-lg p-6 text-center hover:border-[#1890FF] transition-colors bg-[#FAFAFA]">
            <Upload className="w-8 h-8 text-[#8C8C8C] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#333333] mb-1">
              {selectedFile ? selectedFile.name : 'Click or drag Excel / CSV file here to upload'}
            </p>
            <p className="text-[11px] text-[#8C8C8C] mb-3">
              Supports .xlsx, .xls, .csv files up to 10MB
            </p>
            <label className="inline-block px-4 py-1.5 bg-white border border-[#D9D9D9] rounded text-xs font-medium text-[#595959] hover:border-[#1890FF] cursor-pointer shadow-2xs">
              Browse File
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E8E8E8] bg-[#FAFAFA] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#D9D9D9] rounded text-xs font-medium text-[#595959] bg-white hover:border-[#1890FF]"
          >
            Cancel
          </button>
          <button
            onClick={handleStartImport}
            disabled={!selectedFile || isUploading}
            className="px-5 py-2 bg-[#1890FF] text-white rounded text-xs font-semibold hover:bg-[#40A9FF] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isUploading ? 'Uploading...' : 'Start Import'}
          </button>
        </div>
      </div>
    </div>
  );
};
