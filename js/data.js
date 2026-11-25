// Mock Data for Wilmar DMS Web Portal - Salesman Transfer System
// Directly reflecting Figma design: [South Africa] DMS Web (Node: 40000042:31524)

const mockDistributors = [
  { code: '510001', name: 'Distributor A' },
  { code: '510002', name: 'Distributor B' },
  { code: '510003', name: 'Distributor C' },
  { code: '5100001850', name: 'FIO Distribution' },
  { code: '5100001852', name: 'Cape Town Central Distributors' },
  { code: '5100001855', name: 'Johannesburg Mega Hub' }
];

const mockWarehouses = [
  { code: 'WH01', name: 'South Warehouse' },
  { code: 'WH02', name: 'North Warehouse' },
  { code: 'WH03', name: 'East Logistics Center' },
  { code: 'WH04', name: 'West Distribution Depot' }
];

const mockPositions = [
  { code: 'SP001', name: 'Pre sale 1', type: 'Pre sales' },
  { code: 'SP002', name: 'Van sales 1', type: 'Van sales' },
  { code: 'SP003', name: 'Van sales 2', type: 'Van sales' },
  { code: 'SP004', name: 'Key Account Specialist', type: 'Pre sales' }
];

const mockVans = [
  { code: 'WH02-V01', name: 'Van 1' },
  { code: 'WH02-V02', name: 'Van 2' },
  { code: 'WH01-V01', name: 'Van 3 (Refrigerated)' },
  { code: 'WH03-V01', name: 'Van 4' }
];

const mockSalesmenPool = [
  {
    code: 'FIO_V01',
    name: 'JEFF',
    type: 'Van sales',
    email: 'abc@gmail.com',
    distributorCode: '5100001850',
    distributorName: 'FIO Distribution'
  },
  {
    code: 'FIO_V02',
    name: 'LANTANA',
    type: 'Pre sales',
    email: 'xya@gmail.com',
    distributorCode: '5100001850',
    distributorName: 'FIO Distribution'
  },
  {
    code: 'FIO_V03',
    name: 'MICA',
    type: 'Van sales',
    email: 'def@gmail.com',
    distributorCode: '5100001850',
    distributorName: 'FIO Distribution'
  },
  {
    code: 'SM001',
    name: 'Salesman A',
    type: 'Pre sales',
    email: 'salesman.a@wilmar-intl.com',
    distributorCode: '510001',
    distributorName: 'Distributor A'
  },
  {
    code: 'SM002',
    name: 'Salesman B',
    type: 'Van sales',
    email: 'salesman.b@wilmar-intl.com',
    distributorCode: '510001',
    distributorName: 'Distributor A'
  },
  {
    code: 'SM003',
    name: 'Salesman C',
    type: 'Van sales',
    email: 'salesman.c@wilmar-intl.com',
    distributorCode: '510001',
    distributorName: 'Distributor A'
  },
  {
    code: 'SM004',
    name: 'David Nkosi',
    type: 'Pre sales',
    email: 'david.nkosi@wilmar-intl.com',
    distributorCode: '510002',
    distributorName: 'Distributor B'
  },
  {
    code: 'SM005',
    name: 'Thabo Mbeki',
    type: 'Van sales',
    email: 'thabo.m@wilmar-intl.com',
    distributorCode: '510003',
    distributorName: 'Distributor C'
  }
];

const initialSalesmanTransfers = [
  {
    id: 'ST-001',
    transferCode: 'ST2610130001',
    transferDescription: 'Transfer salesman from A to B',
    transferDate: '10/13/2026',
    transferType: 'One to one',
    sourceDistributorCode: '510001',
    sourceDistributorName: 'Distributor A',
    destinationDistributorCode: '510002',
    destinationDistributorName: 'Distributor B',
    completeTransfer: true,
    status: 'Completed',
    createdAt: '2026-10-13 09:30:00',
    items: [
      {
        id: 'map-1',
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
        vanCode: '',
        vanName: ''
      },
      {
        id: 'map-2',
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
        vanName: 'Van 1'
      }
    ]
  },
  {
    id: 'ST-002',
    transferCode: 'ST2610130002',
    transferDescription: 'Transfer salesman from B to C',
    transferDate: '10/13/2026',
    transferType: 'One to many',
    sourceDistributorCode: '510001',
    sourceDistributorName: 'Distributor A',
    destinationDistributorCode: '',
    destinationDistributorName: '',
    completeTransfer: true,
    status: 'Completed',
    createdAt: '2026-10-13 11:15:00',
    items: [
      {
        id: 'map-3',
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
        vanCode: '',
        vanName: ''
      },
      {
        id: 'map-4',
        salesmanCode: 'SM002',
        salesmanName: 'Salesman B',
        salesmanType: 'Van sales',
        email: 'salesman.b@wilmar-intl.com',
        sourceDistributorCode: '510001',
        sourceDistributorName: 'Distributor A',
        destinationDistributorCode: '510003',
        destinationDistributorName: 'Distributor C',
        salesPositionCode: 'SP002',
        salesPositionName: 'Van sales 1',
        mainWarehouseCode: 'WH02',
        mainWarehouseName: 'North Warehouse',
        vanCode: 'WH02-V01',
        vanName: 'Van 1'
      }
    ]
  },
  {
    id: 'ST-003',
    transferCode: 'ST2610130003',
    transferDescription: 'Transfer salesman from C to D',
    transferDate: '10/13/2026',
    transferType: 'Many to one',
    sourceDistributorCode: '',
    sourceDistributorName: '',
    destinationDistributorCode: '510003',
    destinationDistributorName: 'Distributor C',
    completeTransfer: true,
    status: 'Approved',
    createdAt: '2026-10-13 14:00:00',
    items: [
      {
        id: 'map-5',
        salesmanCode: 'SM001',
        salesmanName: 'Salesman A',
        salesmanType: 'Pre sales',
        email: 'salesman.a@wilmar-intl.com',
        sourceDistributorCode: '510001',
        sourceDistributorName: 'Distributor A',
        destinationDistributorCode: '510003',
        destinationDistributorName: 'Distributor C',
        salesPositionCode: 'SP001',
        salesPositionName: 'Pre sale 1',
        mainWarehouseCode: 'WH01',
        mainWarehouseName: 'South Warehouse',
        vanCode: '',
        vanName: ''
      },
      {
        id: 'map-6',
        salesmanCode: 'SM004',
        salesmanName: 'David Nkosi',
        salesmanType: 'Pre sales',
        email: 'david.nkosi@wilmar-intl.com',
        sourceDistributorCode: '510002',
        sourceDistributorName: 'Distributor B',
        destinationDistributorCode: '510003',
        destinationDistributorName: 'Distributor C',
        salesPositionCode: 'SP004',
        salesPositionName: 'Key Account Specialist',
        mainWarehouseCode: 'WH03',
        mainWarehouseName: 'East Logistics Center',
        vanCode: '',
        vanName: ''
      }
    ]
  }
];
