export type TransferType = 'One to one' | 'One to many' | 'Many to one';

export interface Distributor {
  code: string;
  name: string;
}

export interface Warehouse {
  code: string;
  name: string;
}

export interface SalesPosition {
  code: string;
  name: string;
  type: 'Pre sales' | 'Van sales';
}

export interface Van {
  code: string;
  name: string;
}

export interface Salesman {
  code: string;
  name: string;
  type: 'Pre sales' | 'Van sales';
  email: string;
  distributorCode: string;
  distributorName: string;
}

export interface SalesmanTransferMapping {
  id: string;
  salesmanCode: string;
  salesmanName: string;
  salesmanType: 'Pre sales' | 'Van sales';
  email?: string;
  sourceDistributorCode: string;
  sourceDistributorName: string;
  destinationDistributorCode: string;
  destinationDistributorName: string;
  salesPositionCode?: string;
  salesPositionName?: string;
  mainWarehouseCode?: string;
  mainWarehouseName?: string;
  vanCode?: string;
  vanName?: string;
}

export interface SalesmanTransfer {
  id: string;
  transferCode: string;
  transferDescription: string;
  transferDate: string;
  transferType: TransferType;
  sourceDistributorCode?: string;
  sourceDistributorName?: string;
  destinationDistributorCode?: string;
  destinationDistributorName?: string;
  completeTransfer: boolean;
  items: SalesmanTransferMapping[];
  status: 'Draft' | 'Submitted' | 'Approved' | 'Completed';
  createdAt: string;
}
