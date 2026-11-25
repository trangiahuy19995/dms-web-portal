/**
 * Wilmar DMS Web Portal - Salesman Transfer System
 * Interactive Logic adhering to Figma design: [South Africa] DMS Web (Node: 40000042:31524)
 * Pure JavaScript + Bootstrap 5.3.3
 */

(function () {
  'use strict';

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    transfers: JSON.parse(JSON.stringify(initialSalesmanTransfers)),
    salesmenPool: JSON.parse(JSON.stringify(mockSalesmenPool)),
    activeDistributor: '5100001850',
    selectedTransferIds: new Set(),
    filter: {
      code: '',
      date: '',
      desc: '',
      type: ''
    },
    modalFilter: {
      dist: '',
      type: '',
      code: '',
      name: '',
      email: ''
    },
    modalSelectedCodes: new Set(),
    addTransfer: {
      transferCode: '',
      transferDate: '',
      transferType: 'One to one',
      transferDescription: '',
      sourceDistributorCode: '',
      destinationDistributorCode: '',
      completeTransfer: true,
      items: []
    },
    currentDetail: null,
    importParsedRows: []
  };

  // Helper lookups
  function getDistributorName(code) {
    if (!code) return '';
    const d = mockDistributors.find(item => item.code === code);
    return d ? `${d.code} - ${d.name}` : code;
  }

  function getWarehouseName(code) {
    if (!code) return '';
    const w = mockWarehouses.find(item => item.code === code);
    return w ? w.name : code;
  }

  function getPositionName(code) {
    if (!code) return '';
    const p = mockPositions.find(item => item.code === code);
    return p ? p.name : code;
  }

  function getVanName(code) {
    if (!code) return 'N/A';
    const v = mockVans.find(item => item.code === code);
    return v ? v.name : code;
  }

  function generateTransferCode() {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `ST${dateStr}${randNum}`;
  }

  function getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'primary') {
    const toastEl = document.getElementById('appToast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    if (!toastEl || !toastMsg) return;

    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastMsg.textContent = message;

    if (type === 'success' || type === 'primary') {
      toastIcon.className = 'bi bi-check-circle-fill fs-5';
    } else if (type === 'danger') {
      toastIcon.className = 'bi bi-exclamation-triangle-fill fs-5';
    } else {
      toastIcon.className = 'bi bi-info-circle-fill fs-5';
    }

    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
    toast.show();
  }

  // ==========================================
  // VIEW SWITCHING
  // ==========================================
  function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
    }

    const breadcrumb = document.getElementById('breadcrumb-current');
    if (breadcrumb) {
      if (viewId === 'view-list') breadcrumb.textContent = 'Salesman Migration List';
      else if (viewId === 'view-add') breadcrumb.textContent = 'Add New Salesman Transfer';
      else if (viewId === 'view-detail') breadcrumb.textContent = 'Salesman Transfer Detail';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // 1. SALESMAN MIGRATION LIST VIEW
  // ==========================================
  function renderTransferList() {
    const tbody = document.getElementById('transfer-table-body');
    const emptyState = document.getElementById('list-empty-state');
    const totalCount = document.getElementById('total-records-count');
    const selectedBadge = document.getElementById('selected-count-badge');
    const bulkDeleteBtn = document.getElementById('btn-bulk-delete');
    const checkAllBox = document.getElementById('check-all-transfers');

    if (!tbody) return;

    // Filter transfers
    const filtered = state.transfers.filter(item => {
      if (state.filter.code && !item.transferCode.toLowerCase().includes(state.filter.code.toLowerCase())) {
        return false;
      }
      if (state.filter.date && item.transferDate !== state.filter.date) {
        return false;
      }
      if (state.filter.desc && !item.transferDescription.toLowerCase().includes(state.filter.desc.toLowerCase())) {
        return false;
      }
      if (state.filter.type && item.transferType !== state.filter.type) {
        return false;
      }
      return true;
    });

    totalCount.textContent = filtered.length;

    // Update pagination counters
    const pStart = document.getElementById('pagination-start');
    const pEnd = document.getElementById('pagination-end');
    const pTotal = document.getElementById('pagination-total');
    if (pStart && pEnd && pTotal) {
      pStart.textContent = filtered.length > 0 ? 1 : 0;
      pEnd.textContent = filtered.length;
      pTotal.textContent = filtered.length;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      emptyState.classList.remove('d-none');
    } else {
      emptyState.classList.add('d-none');
      tbody.innerHTML = filtered.map((item, index) => {
        const isChecked = state.selectedTransferIds.has(item.id);
        
        let typeBadgeClass = 'badge-one-to-one';
        if (item.transferType === 'One to many') typeBadgeClass = 'badge-one-to-many';
        if (item.transferType === 'Many to one') typeBadgeClass = 'badge-many-to-one';

        const statusBadgeClass = item.status === 'Completed' ? 'badge-status-completed' : 'badge-status-approved';

        const sourceLabel = item.transferType === 'Many to one'
          ? '<span class="text-muted fst-italic">Multiple Sources (Per row)</span>'
          : (item.sourceDistributorName ? `${item.sourceDistributorCode} - ${item.sourceDistributorName}` : item.sourceDistributorCode || '-');

        const destLabel = item.transferType === 'One to many'
          ? '<span class="text-muted fst-italic">Multiple Destinations (Per row)</span>'
          : (item.destinationDistributorName ? `${item.destinationDistributorCode} - ${item.destinationDistributorName}` : item.destinationDistributorCode || '-');

        return `
          <tr>
            <td class="text-center">
              <input type="checkbox" class="form-check-input transfer-row-check" data-id="${item.id}" ${isChecked ? 'checked' : ''}>
            </td>
            <td class="text-muted">${index + 1}</td>
            <td>
              <a href="#" class="fw-semibold text-primary text-decoration-none btn-view-detail" data-id="${item.id}">
                ${item.transferCode}
              </a>
            </td>
            <td>
              <div class="fw-medium text-dark">${item.transferDescription}</div>
              <small class="text-muted">Created: ${item.createdAt || 'N/A'}</small>
            </td>
            <td>${item.transferDate}</td>
            <td>
              <span class="badge ${typeBadgeClass} px-2 py-1">${item.transferType}</span>
            </td>
            <td><small>${sourceLabel}</small></td>
            <td><small>${destLabel}</small></td>
            <td class="text-center">
              <span class="badge bg-light text-dark border px-2 py-1">
                <i class="bi bi-people me-1 text-primary"></i>${item.items ? item.items.length : 0}
              </span>
            </td>
            <td>
              <span class="badge ${statusBadgeClass} px-2 py-1">${item.status}</span>
            </td>
            <td class="text-center">
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-light btn-view-detail" data-id="${item.id}" title="View Transfer Detail">
                  <i class="bi bi-eye text-primary"></i>
                </button>
                <button type="button" class="btn btn-light btn-delete-single" data-id="${item.id}" title="Delete Transfer">
                  <i class="bi bi-trash text-danger"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Update bulk selection controls
    const selectedCount = state.selectedTransferIds.size;
    if (selectedCount > 0) {
      selectedBadge.classList.remove('d-none');
      selectedBadge.textContent = `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`;
      bulkDeleteBtn.classList.remove('d-none');
    } else {
      selectedBadge.classList.add('d-none');
      bulkDeleteBtn.classList.add('d-none');
    }

    if (checkAllBox) {
      checkAllBox.checked = filtered.length > 0 && filtered.every(item => state.selectedTransferIds.has(item.id));
    }
  }

  // ==========================================
  // 2. ADD NEW TRANSFER VIEW
  // ==========================================
  function initAddTransfer() {
    state.addTransfer = {
      transferCode: generateTransferCode(),
      transferDate: getTodayString(),
      transferType: 'One to one',
      transferDescription: '',
      sourceDistributorCode: '',
      destinationDistributorCode: '',
      completeTransfer: true,
      items: []
    };

    // Fill form elements
    document.getElementById('add-transfer-code').value = state.addTransfer.transferCode;
    document.getElementById('add-transfer-date').value = state.addTransfer.transferDate;
    document.getElementById('add-transfer-type').value = state.addTransfer.transferType;
    document.getElementById('add-transfer-desc').value = '';
    document.getElementById('add-complete-transfer').checked = true;

    // Populate Distributors dropdowns
    const sourceSelect = document.getElementById('add-source-dist');
    const destSelect = document.getElementById('add-dest-dist');

    const distOptionsHtml = `
      <option value="">-- Select Distributor --</option>
      ${mockDistributors.map(d => `<option value="${d.code}">${d.code} - ${d.name}</option>`).join('')}
    `;

    sourceSelect.innerHTML = distOptionsHtml;
    destSelect.innerHTML = distOptionsHtml;

    // Set default source to Cape Town or Distributor A
    sourceSelect.value = '510001';
    destSelect.value = '510002';
    state.addTransfer.sourceDistributorCode = '510001';
    state.addTransfer.destinationDistributorCode = '510002';

    updateTransferTypeMode();
    renderAssignedSalesmen();
  }

  function updateTransferTypeMode() {
    const type = document.getElementById('add-transfer-type').value;
    state.addTransfer.transferType = type;

    const sourceSelect = document.getElementById('add-source-dist');
    const destSelect = document.getElementById('add-dest-dist');
    const banner = document.getElementById('transfer-type-banner-text');
    const helpSource = document.getElementById('help-source-dist');
    const helpDest = document.getElementById('help-dest-dist');

    if (type === 'One to one') {
      banner.innerHTML = `<strong>One to one Mode:</strong> Transferring salesmen from 1 single Source Distributor to 1 single Destination Distributor. Both distributors must be selected above.`;
      sourceSelect.disabled = false;
      destSelect.disabled = false;
      helpSource.textContent = 'All assigned salesmen will be transferred out from this distributor.';
      helpDest.textContent = 'All assigned salesmen will be transferred into this distributor.';
      if (!sourceSelect.value) sourceSelect.value = '510001';
      if (!destSelect.value) destSelect.value = '510002';
    } else if (type === 'One to many') {
      banner.innerHTML = `<strong>One to many Mode:</strong> 1 Source Distributor to Multiple Destination Distributors. Destination Distributor is configured per salesman in the table below.`;
      sourceSelect.disabled = false;
      destSelect.disabled = true;
      destSelect.value = '';
      state.addTransfer.destinationDistributorCode = '';
      helpSource.textContent = 'Source distributor is fixed for all salesmen.';
      helpDest.textContent = 'Destination distributor is disabled here and selected individually for each salesman below.';
    } else if (type === 'Many to one') {
      banner.innerHTML = `<strong>Many to one Mode:</strong> Multiple Source Distributors to 1 single Destination Distributor. Source Distributor is configured per salesman in the table below.`;
      sourceSelect.disabled = true;
      sourceSelect.value = '';
      state.addTransfer.sourceDistributorCode = '';
      destSelect.disabled = false;
      helpSource.textContent = 'Source distributor is disabled here and selected individually for each salesman below.';
      helpDest.textContent = 'Destination distributor is fixed for all salesmen.';
      if (!destSelect.value) destSelect.value = '510003';
    }

    renderAssignedSalesmen();
  }

  function renderAssignedSalesmen() {
    const tbody = document.getElementById('assigned-salesmen-table-body');
    const emptyState = document.getElementById('add-empty-state');
    const countBadge = document.getElementById('badge-salesmen-count');
    const type = state.addTransfer.transferType;

    const items = state.addTransfer.items;
    countBadge.textContent = `${items.length} Salesman${items.length === 1 ? '' : 's'}`;

    if (items.length === 0) {
      tbody.innerHTML = '';
      emptyState.classList.remove('d-none');
      return;
    }

    emptyState.classList.add('d-none');

    const sourceDistSelect = document.getElementById('add-source-dist');
    const destDistSelect = document.getElementById('add-dest-dist');
    const topSourceCode = sourceDistSelect.value;
    const topDestCode = destDistSelect.value;

    tbody.innerHTML = items.map((item, index) => {
      // Source Distributor Cell
      let sourceCellHtml = '';
      if (type === 'Many to one') {
        sourceCellHtml = `
          <select class="form-select form-select-sm map-source-dist" data-index="${index}">
            <option value="">-- Select Source --</option>
            ${mockDistributors.map(d => `<option value="${d.code}" ${item.sourceDistributorCode === d.code ? 'selected' : ''}>${d.code} - ${d.name}</option>`).join('')}
          </select>
        `;
      } else {
        const dName = getDistributorName(topSourceCode);
        sourceCellHtml = `<small class="fw-medium text-dark">${dName || '<span class="text-danger">Select above</span>'}</small>`;
      }

      // Destination Distributor Cell
      let destCellHtml = '';
      if (type === 'One to many') {
        destCellHtml = `
          <select class="form-select form-select-sm map-dest-dist" data-index="${index}">
            <option value="">-- Select Destination --</option>
            ${mockDistributors.map(d => `<option value="${d.code}" ${item.destinationDistributorCode === d.code ? 'selected' : ''}>${d.code} - ${d.name}</option>`).join('')}
          </select>
        `;
      } else {
        const dName = getDistributorName(topDestCode);
        destCellHtml = `<small class="fw-medium text-dark">${dName || '<span class="text-danger">Select above</span>'}</small>`;
      }

      // Filter positions based on salesmanType
      const filteredPositions = mockPositions.filter(p => p.type === item.salesmanType);

      // Positions dropdown
      const posSelectHtml = `
        <select class="form-select form-select-sm map-position" data-index="${index}">
          <option value="">-- Select Position --</option>
          ${filteredPositions.map(p => `<option value="${p.code}" ${item.salesPositionCode === p.code ? 'selected' : ''}>${p.name}</option>`).join('')}
        </select>
      `;

      // Main Warehouses dropdown
      const whSelectHtml = `
        <select class="form-select form-select-sm map-warehouse" data-index="${index}">
          <option value="">-- Select Warehouse --</option>
          ${mockWarehouses.map(w => `<option value="${w.code}" ${item.mainWarehouseCode === w.code ? 'selected' : ''}>${w.name}</option>`).join('')}
        </select>
      `;

      // Van Dropdown (Enabled only for Van sales)
      let vanSelectHtml = '';
      if (item.salesmanType === 'Van sales') {
        vanSelectHtml = `
          <select class="form-select form-select-sm map-van" data-index="${index}">
            <option value="">-- Select Van --</option>
            ${mockVans.map(v => `<option value="${v.code}" ${item.vanCode === v.code ? 'selected' : ''}>${v.name}</option>`).join('')}
          </select>
        `;
      } else {
        vanSelectHtml = `
          <select class="form-select form-select-sm bg-light text-muted" disabled>
            <option>N/A (Pre-sales)</option>
          </select>
        `;
      }

      return `
        <tr>
          <td class="text-muted">${index + 1}</td>
          <td class="fw-semibold text-primary">${item.salesmanCode}</td>
          <td class="fw-medium text-dark">${item.salesmanName}</td>
          <td>
            <span class="badge ${item.salesmanType === 'Van sales' ? 'bg-info text-dark' : 'bg-secondary'}">
              ${item.salesmanType}
            </span>
          </td>
          <td><small class="text-muted">${item.email}</small></td>
          <td>${sourceCellHtml}</td>
          <td>${destCellHtml}</td>
          <td>${posSelectHtml}</td>
          <td>${whSelectHtml}</td>
          <td>${vanSelectHtml}</td>
          <td class="text-center">
            <button type="button" class="btn btn-sm btn-light btn-remove-assigned-salesman" data-index="${index}" title="Remove salesman">
              <i class="bi bi-trash text-danger"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================
  // 3. ADD SALESMAN MODAL
  // ==========================================
  function openSalesmanModal() {
    state.modalSelectedCodes.clear();

    // Populate distributor filter dropdown in modal
    const distSelect = document.getElementById('modal-filter-dist');
    distSelect.innerHTML = `
      <option value="">All Distributors</option>
      ${mockDistributors.map(d => `<option value="${d.code}">${d.code} - ${d.name}</option>`).join('')}
    `;

    // Reset filters
    document.getElementById('modal-filter-type').value = '';
    document.getElementById('modal-filter-code').value = '';
    document.getElementById('modal-filter-name').value = '';
    document.getElementById('modal-filter-email').value = '';

    renderModalPool();

    const modal = new bootstrap.Modal(document.getElementById('addSalesmanModal'));
    modal.show();
  }

  function renderModalPool() {
    const tbody = document.getElementById('modal-salesman-pool-body');
    const emptyState = document.getElementById('modal-empty-state');
    const countBadge = document.getElementById('modal-selected-count');
    const checkAll = document.getElementById('check-all-modal-salesmen');

    // Filter pool
    const assignedCodes = new Set(state.addTransfer.items.map(i => i.salesmanCode));

    const pool = state.salesmenPool.filter(sm => {
      // Exclude already assigned
      if (assignedCodes.has(sm.code)) return false;

      if (state.modalFilter.dist && sm.distributorCode !== state.modalFilter.dist) return false;
      if (state.modalFilter.type && sm.type !== state.modalFilter.type) return false;
      if (state.modalFilter.code && !sm.code.toLowerCase().includes(state.modalFilter.code.toLowerCase())) return false;
      if (state.modalFilter.name && !sm.name.toLowerCase().includes(state.modalFilter.name.toLowerCase())) return false;
      if (state.modalFilter.email && !sm.email.toLowerCase().includes(state.modalFilter.email.toLowerCase())) return false;

      return true;
    });

    countBadge.textContent = state.modalSelectedCodes.size;

    if (pool.length === 0) {
      tbody.innerHTML = '';
      emptyState.classList.remove('d-none');
    } else {
      emptyState.classList.add('d-none');
      tbody.innerHTML = pool.map(sm => {
        const isChecked = state.modalSelectedCodes.has(sm.code);
        return `
          <tr>
            <td class="text-center">
              <input type="checkbox" class="form-check-input modal-pool-check" data-code="${sm.code}" ${isChecked ? 'checked' : ''}>
            </td>
            <td class="fw-semibold text-primary">${sm.code}</td>
            <td class="fw-medium text-dark">${sm.name}</td>
            <td>
              <span class="badge ${sm.type === 'Van sales' ? 'bg-info text-dark' : 'bg-secondary'}">
                ${sm.type}
              </span>
            </td>
            <td><small class="text-muted">${sm.email}</small></td>
            <td><small>${sm.distributorCode} - ${sm.distributorName}</small></td>
          </tr>
        `;
      }).join('');
    }

    if (checkAll) {
      checkAll.checked = pool.length > 0 && pool.every(sm => state.modalSelectedCodes.has(sm.code));
    }
  }

  function confirmAddSalesmen() {
    const selectedList = state.salesmenPool.filter(sm => state.modalSelectedCodes.has(sm.code));

    if (selectedList.length === 0) {
      showToast('Please select at least one salesman to transfer.', 'danger');
      return;
    }

    const type = state.addTransfer.transferType;
    const topSource = document.getElementById('add-source-dist').value;
    const topDest = document.getElementById('add-dest-dist').value;

    selectedList.forEach(sm => {
      // Find default position matching salesman type
      const defaultPos = mockPositions.find(p => p.type === sm.type) || mockPositions[0];

      state.addTransfer.items.push({
        id: `map-${Date.now()}-${sm.code}`,
        salesmanCode: sm.code,
        salesmanName: sm.name,
        salesmanType: sm.type,
        email: sm.email,
        sourceDistributorCode: type === 'Many to one' ? sm.distributorCode : topSource,
        sourceDistributorName: type === 'Many to one' ? sm.distributorName : getDistributorName(topSource),
        destinationDistributorCode: type === 'One to many' ? '' : topDest,
        destinationDistributorName: type === 'One to many' ? '' : getDistributorName(topDest),
        salesPositionCode: defaultPos ? defaultPos.code : '',
        salesPositionName: defaultPos ? defaultPos.name : '',
        mainWarehouseCode: mockWarehouses[0] ? mockWarehouses[0].code : '',
        mainWarehouseName: mockWarehouses[0] ? mockWarehouses[0].name : '',
        vanCode: sm.type === 'Van sales' && mockVans[0] ? mockVans[0].code : '',
        vanName: sm.type === 'Van sales' && mockVans[0] ? mockVans[0].name : ''
      });
    });

    renderAssignedSalesmen();

    const modalEl = document.getElementById('addSalesmanModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    showToast(`Added ${selectedList.length} salesman${selectedList.length > 1 ? 's' : ''} to assignment table!`, 'success');
  }

  // ==========================================
  // 4. SAVE NEW TRANSFER
  // ==========================================
  function saveTransfer() {
    const code = document.getElementById('add-transfer-code').value.trim();
    const date = document.getElementById('add-transfer-date').value;
    const type = document.getElementById('add-transfer-type').value;
    const desc = document.getElementById('add-transfer-desc').value.trim();
    const isComplete = document.getElementById('add-complete-transfer').checked;

    const sourceDist = document.getElementById('add-source-dist').value;
    const destDist = document.getElementById('add-dest-dist').value;

    if (!desc) {
      showToast('Please enter a transfer description.', 'danger');
      document.getElementById('add-transfer-desc').focus();
      return;
    }

    if (type !== 'Many to one' && !sourceDist) {
      showToast('Please select a Source Distributor.', 'danger');
      document.getElementById('add-source-dist').focus();
      return;
    }

    if (type !== 'One to many' && !destDist) {
      showToast('Please select a Destination Distributor.', 'danger');
      document.getElementById('add-dest-dist').focus();
      return;
    }

    if (type === 'One to one' && sourceDist === destDist) {
      showToast('Source and Destination distributors must be different in One-to-one transfer.', 'danger');
      return;
    }

    if (state.addTransfer.items.length === 0) {
      showToast('Please assign at least one salesman before saving.', 'danger');
      return;
    }

    // Validate mappings
    for (let i = 0; i < state.addTransfer.items.length; i++) {
      const item = state.addTransfer.items[i];
      if (type === 'Many to one' && !item.sourceDistributorCode) {
        showToast(`Please select Source Distributor for row #${i + 1} (${item.salesmanName}).`, 'danger');
        return;
      }
      if (type === 'One to many' && !item.destinationDistributorCode) {
        showToast(`Please select Destination Distributor for row #${i + 1} (${item.salesmanName}).`, 'danger');
        return;
      }
      if (!item.salesPositionCode) {
        showToast(`Please select Sales Position for row #${i + 1} (${item.salesmanName}).`, 'danger');
        return;
      }
      if (!item.mainWarehouseCode) {
        showToast(`Please select Main Warehouse for row #${i + 1} (${item.salesmanName}).`, 'danger');
        return;
      }
    }

    // Create record
    const newRecord = {
      id: `ST-${Date.now()}`,
      transferCode: code,
      transferDescription: desc,
      transferDate: date,
      transferType: type,
      sourceDistributorCode: type === 'Many to one' ? '' : sourceDist,
      sourceDistributorName: type === 'Many to one' ? '' : getDistributorName(sourceDist),
      destinationDistributorCode: type === 'One to many' ? '' : destDist,
      destinationDistributorName: type === 'One to many' ? '' : getDistributorName(destDist),
      completeTransfer: isComplete,
      status: isComplete ? 'Completed' : 'Approved',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      items: JSON.parse(JSON.stringify(state.addTransfer.items))
    };

    state.transfers.unshift(newRecord);

    showToast(`Transfer record ${code} created successfully!`, 'success');
    renderTransferList();
    switchView('view-list');
  }

  // ==========================================
  // 5. DETAIL VIEW
  // ==========================================
  function showTransferDetail(transferId) {
    const item = state.transfers.find(t => t.id === transferId);
    if (!item) return;

    state.currentDetail = item;

    document.getElementById('detail-code-label').textContent = item.transferCode;
    document.getElementById('detail-code').textContent = item.transferCode;
    document.getElementById('detail-date').textContent = item.transferDate;
    document.getElementById('detail-type').textContent = item.transferType;
    document.getElementById('detail-desc').textContent = item.transferDescription;
    document.getElementById('detail-status').textContent = item.status;

    // Badges
    const typeBadge = document.getElementById('detail-type-badge');
    let typeClass = 'badge-one-to-one';
    if (item.transferType === 'One to many') typeClass = 'badge-one-to-many';
    if (item.transferType === 'Many to one') typeClass = 'badge-many-to-one';
    typeBadge.className = `badge ${typeClass}`;
    typeBadge.textContent = item.transferType;

    const statusBadge = document.getElementById('detail-status-badge');
    statusBadge.className = `badge ${item.status === 'Completed' ? 'badge-status-completed' : 'badge-status-approved'}`;
    statusBadge.textContent = item.status;

    // Distributor labels
    const sourceLabel = item.transferType === 'Many to one'
      ? 'Multiple Sources (Defined individually per salesman below)'
      : (item.sourceDistributorName ? `${item.sourceDistributorCode} - ${item.sourceDistributorName}` : item.sourceDistributorCode || '-');

    const destLabel = item.transferType === 'One to many'
      ? 'Multiple Destinations (Defined individually per salesman below)'
      : (item.destinationDistributorName ? `${item.destinationDistributorCode} - ${item.destinationDistributorName}` : item.destinationDistributorCode || '-');

    document.getElementById('detail-source-dist').textContent = sourceLabel;
    document.getElementById('detail-dest-dist').textContent = destLabel;

    document.getElementById('detail-count-badge').textContent = `${item.items ? item.items.length : 0} Salesmen`;

    // Transferred salesmen table
    const tbody = document.getElementById('detail-salesmen-table-body');
    if (tbody) {
      if (!item.items || item.items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted py-3">No salesmen mapped in this transfer.</td></tr>`;
      } else {
        tbody.innerHTML = item.items.map((sm, index) => {
          const sDist = sm.sourceDistributorName ? `${sm.sourceDistributorCode} - ${sm.sourceDistributorName}` : sm.sourceDistributorCode || sourceLabel;
          const dDist = sm.destinationDistributorName ? `${sm.destinationDistributorCode} - ${sm.destinationDistributorName}` : sm.destinationDistributorCode || destLabel;

          return `
            <tr>
              <td class="text-muted">${index + 1}</td>
              <td class="fw-semibold text-primary">${sm.salesmanCode}</td>
              <td class="fw-medium text-dark">${sm.salesmanName}</td>
              <td>
                <span class="badge ${sm.salesmanType === 'Van sales' ? 'bg-info text-dark' : 'bg-secondary'}">
                  ${sm.salesmanType}
                </span>
              </td>
              <td><small class="text-muted">${sm.email || '-'}</small></td>
              <td><small>${sDist}</small></td>
              <td><small>${dDist}</small></td>
              <td><span class="badge bg-light text-dark border">${sm.salesPositionName || getPositionName(sm.salesPositionCode) || '-'}</span></td>
              <td><small class="fw-medium">${sm.mainWarehouseName || getWarehouseName(sm.mainWarehouseCode) || '-'}</small></td>
              <td><small>${sm.vanName || getVanName(sm.vanCode)}</small></td>
            </tr>
          `;
        }).join('');
      }
    }

    switchView('view-detail');
  }

  // ==========================================
  // 6. IMPORT CSV MODAL
  // ==========================================
  function downloadSampleTemplate() {
    const csvContent =
      'SalesmanCode,SalesmanName,SalesmanType,Email,SourceDistributorCode,DestinationDistributorCode,SalesPositionCode,WarehouseCode,VanCode\n' +
      'SM001,Salesman A,Pre sales,salesman.a@wilmar-intl.com,510001,510002,SP001,WH01,\n' +
      'SM002,Salesman B,Van sales,salesman.b@wilmar-intl.com,510001,510002,SP002,WH02,WH02-V01\n' +
      'SM003,Salesman C,Van sales,salesman.c@wilmar-intl.com,510001,510003,SP003,WH02,WH02-V02\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'salesman_transfer_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Downloaded salesman_transfer_template.csv', 'info');
  }

  function handleFileSelect(file) {
    if (!file) return;

    const fileInfo = document.getElementById('import-file-info');
    const fileName = document.getElementById('import-filename');
    const previewContainer = document.getElementById('import-preview-container');
    const previewCount = document.getElementById('import-preview-count');
    const previewBody = document.getElementById('import-preview-body');
    const execBtn = document.getElementById('btn-execute-import');

    fileName.textContent = file.name;
    fileInfo.classList.remove('d-none');

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

      if (lines.length < 2) {
        showToast('The CSV file is empty or does not contain data rows.', 'danger');
        return;
      }

      state.importParsedRows = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length >= 7) {
          state.importParsedRows.push({
            salesmanCode: cols[0],
            salesmanName: cols[1],
            salesmanType: cols[2],
            email: cols[3],
            sourceDistributorCode: cols[4],
            destinationDistributorCode: cols[5],
            salesPositionCode: cols[6],
            mainWarehouseCode: cols[7] || 'WH01',
            vanCode: cols[8] || ''
          });
        }
      }

      previewCount.textContent = state.importParsedRows.length;
      previewBody.innerHTML = state.importParsedRows.map(row => `
        <tr>
          <td class="fw-semibold text-primary">${row.salesmanCode}</td>
          <td>${row.salesmanName}</td>
          <td><span class="badge ${row.salesmanType === 'Van sales' ? 'bg-info text-dark' : 'bg-secondary'}">${row.salesmanType}</span></td>
          <td>${row.sourceDistributorCode}</td>
          <td>${row.destinationDistributorCode}</td>
          <td>${row.salesPositionCode}</td>
          <td>${row.mainWarehouseCode}</td>
        </tr>
      `).join('');

      previewContainer.classList.remove('d-none');
      execBtn.disabled = false;
    };

    reader.readAsText(file);
  }

  function executeImport() {
    if (state.importParsedRows.length === 0) return;

    const newTransfer = {
      id: `ST-${Date.now()}`,
      transferCode: generateTransferCode(),
      transferDescription: `Batch Import from CSV (${state.importParsedRows.length} salesmen)`,
      transferDate: getTodayString(),
      transferType: 'One to many',
      sourceDistributorCode: state.importParsedRows[0].sourceDistributorCode || '510001',
      sourceDistributorName: getDistributorName(state.importParsedRows[0].sourceDistributorCode),
      destinationDistributorCode: '',
      destinationDistributorName: '',
      completeTransfer: true,
      status: 'Completed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      items: state.importParsedRows.map((r, idx) => ({
        id: `map-imp-${idx}`,
        salesmanCode: r.salesmanCode,
        salesmanName: r.salesmanName,
        salesmanType: r.salesmanType,
        email: r.email,
        sourceDistributorCode: r.sourceDistributorCode,
        sourceDistributorName: getDistributorName(r.sourceDistributorCode),
        destinationDistributorCode: r.destinationDistributorCode,
        destinationDistributorName: getDistributorName(r.destinationDistributorCode),
        salesPositionCode: r.salesPositionCode,
        salesPositionName: getPositionName(r.salesPositionCode),
        mainWarehouseCode: r.mainWarehouseCode,
        mainWarehouseName: getWarehouseName(r.mainWarehouseCode),
        vanCode: r.vanCode,
        vanName: getVanName(r.vanCode)
      }))
    };

    state.transfers.unshift(newTransfer);

    const modalEl = document.getElementById('importTransferModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    showToast(`Successfully imported ${state.importParsedRows.length} salesman transfer records!`, 'success');
    renderTransferList();
  }

  // ==========================================
  // 7. EVENT LISTENERS SETUP
  // ==========================================
  function setupEventListeners() {
    // Live date display
    const dateDisplay = document.getElementById('live-datetime');
    if (dateDisplay) {
      dateDisplay.textContent = new Date().toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }

    // Sidebar Toggle
    const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');
    const collapseSidebarBtn = document.getElementById('btn-sidebar-collapse');
    const sidebar = document.getElementById('sidebar');
    const sidebarIcon = document.getElementById('btn-sidebar-icon');

    function toggleSidebar() {
      sidebar.classList.toggle('collapsed');
      if (sidebar.classList.contains('collapsed')) {
        sidebarIcon.className = 'bi bi-chevron-right';
      } else {
        sidebarIcon.className = 'bi bi-chevron-left';
      }
    }

    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', toggleSidebar);
    if (collapseSidebarBtn) collapseSidebarBtn.addEventListener('click', toggleSidebar);

    // Distributor Switcher Menu
    document.querySelectorAll('#distributor-switch-menu .dropdown-item').forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('#distributor-switch-menu .dropdown-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        const code = this.getAttribute('data-dist-code');
        state.activeDistributor = code;
        document.getElementById('current-distributor-label').textContent = this.textContent;
        showToast(`Switched active distributor context to ${this.textContent}`, 'info');
      });
    });

    // Navigation breadcrumbs & menu links
    document.getElementById('breadcrumb-home').addEventListener('click', (e) => {
      e.preventDefault();
      switchView('view-list');
    });

    document.getElementById('nav-salesman-transfer').addEventListener('click', (e) => {
      e.preventDefault();
      switchView('view-list');
    });

    // Filter Form
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
      filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.filter.code = document.getElementById('filter-transfer-code').value.trim();
        state.filter.date = document.getElementById('filter-transfer-date').value;
        state.filter.desc = document.getElementById('filter-transfer-desc').value.trim();
        state.filter.type = document.getElementById('filter-transfer-type').value;
        renderTransferList();
      });
    }

    document.getElementById('btn-clear-filters').addEventListener('click', () => {
      document.getElementById('filter-transfer-code').value = '';
      document.getElementById('filter-transfer-date').value = '';
      document.getElementById('filter-transfer-desc').value = '';
      document.getElementById('filter-transfer-type').value = '';
      state.filter = { code: '', date: '', desc: '', type: '' };
      renderTransferList();
    });

    document.getElementById('btn-reset-empty-search').addEventListener('click', () => {
      document.getElementById('btn-clear-filters').click();
    });

    // Quick Search in Top Nav
    const navSearch = document.getElementById('nav-quick-search');
    if (navSearch) {
      navSearch.addEventListener('input', (e) => {
        state.filter.desc = e.target.value.trim();
        renderTransferList();
      });
    }

    // Check All Transfers
    const checkAllTransfers = document.getElementById('check-all-transfers');
    if (checkAllTransfers) {
      checkAllTransfers.addEventListener('change', function () {
        if (this.checked) {
          state.transfers.forEach(t => state.selectedTransferIds.add(t.id));
        } else {
          state.selectedTransferIds.clear();
        }
        renderTransferList();
      });
    }

    // Row selection and actions via delegation
    document.getElementById('transfer-table-body').addEventListener('change', (e) => {
      if (e.target.classList.contains('transfer-row-check')) {
        const id = e.target.getAttribute('data-id');
        if (e.target.checked) state.selectedTransferIds.add(id);
        else state.selectedTransferIds.delete(id);
        renderTransferList();
      }
    });

    document.getElementById('transfer-table-body').addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.btn-view-detail');
      if (viewBtn) {
        e.preventDefault();
        const id = viewBtn.getAttribute('data-id');
        showTransferDetail(id);
        return;
      }

      const deleteBtn = e.target.closest('.btn-delete-single');
      if (deleteBtn) {
        e.preventDefault();
        const id = deleteBtn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this salesman transfer record?')) {
          state.transfers = state.transfers.filter(t => t.id !== id);
          state.selectedTransferIds.delete(id);
          showToast('Transfer record deleted.', 'info');
          renderTransferList();
        }
      }
    });

    // Bulk Delete
    document.getElementById('btn-bulk-delete').addEventListener('click', () => {
      if (state.selectedTransferIds.size === 0) return;
      if (confirm(`Delete ${state.selectedTransferIds.size} selected transfer records?`)) {
        state.transfers = state.transfers.filter(t => !state.selectedTransferIds.has(t.id));
        state.selectedTransferIds.clear();
        showToast('Selected transfer records deleted.', 'info');
        renderTransferList();
      }
    });

    // Export Transfers List CSV
    document.getElementById('btn-export-list').addEventListener('click', () => {
      let csv = 'TransferCode,Description,Date,Type,SourceDistributor,DestinationDistributor,SalesmenCount,Status\n';
      state.transfers.forEach(t => {
        csv += `"${t.transferCode}","${t.transferDescription}","${t.transferDate}","${t.transferType}","${t.sourceDistributorCode || ''}","${t.destinationDistributorCode || ''}",${t.items ? t.items.length : 0},"${t.status}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salesman_transfers_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Exported transfer list to CSV', 'success');
    });

    // Go to Add View
    document.getElementById('btn-go-add').addEventListener('click', () => {
      initAddTransfer();
      switchView('view-add');
    });

    // Back to List from Add
    document.getElementById('btn-back-to-list').addEventListener('click', () => {
      switchView('view-list');
    });
    document.getElementById('btn-cancel-add').addEventListener('click', () => {
      switchView('view-list');
    });

    // Add Form Field changes
    document.getElementById('add-transfer-type').addEventListener('change', updateTransferTypeMode);
    document.getElementById('add-source-dist').addEventListener('change', () => {
      state.addTransfer.sourceDistributorCode = document.getElementById('add-source-dist').value;
      renderAssignedSalesmen();
    });
    document.getElementById('add-dest-dist').addEventListener('change', () => {
      state.addTransfer.destinationDistributorCode = document.getElementById('add-dest-dist').value;
      renderAssignedSalesmen();
    });

    // Save Transfer Button
    document.getElementById('btn-save-transfer').addEventListener('click', saveTransfer);

    // Add Salesman Modal triggers
    document.getElementById('btn-open-add-salesman-modal').addEventListener('click', openSalesmanModal);
    document.getElementById('btn-empty-add-salesman').addEventListener('click', openSalesmanModal);

    // Modal Search & Reset
    document.getElementById('modal-salesman-filter-form').addEventListener('submit', (e) => {
      e.preventDefault();
      state.modalFilter.dist = document.getElementById('modal-filter-dist').value;
      state.modalFilter.type = document.getElementById('modal-filter-type').value;
      state.modalFilter.code = document.getElementById('modal-filter-code').value.trim();
      state.modalFilter.name = document.getElementById('modal-filter-name').value.trim();
      state.modalFilter.email = document.getElementById('modal-filter-email').value.trim();
      renderModalPool();
    });

    document.getElementById('btn-modal-filter-reset').addEventListener('click', () => {
      document.getElementById('modal-filter-dist').value = '';
      document.getElementById('modal-filter-type').value = '';
      document.getElementById('modal-filter-code').value = '';
      document.getElementById('modal-filter-name').value = '';
      document.getElementById('modal-filter-email').value = '';
      state.modalFilter = { dist: '', type: '', code: '', name: '', email: '' };
      renderModalPool();
    });

    // Modal Check All
    document.getElementById('check-all-modal-salesmen').addEventListener('change', function () {
      const assignedCodes = new Set(state.addTransfer.items.map(i => i.salesmanCode));
      const pool = state.salesmenPool.filter(sm => !assignedCodes.has(sm.code));

      if (this.checked) {
        pool.forEach(sm => state.modalSelectedCodes.add(sm.code));
      } else {
        state.modalSelectedCodes.clear();
      }
      renderModalPool();
    });

    // Modal row selection delegation
    document.getElementById('modal-salesman-pool-body').addEventListener('change', (e) => {
      if (e.target.classList.contains('modal-pool-check')) {
        const code = e.target.getAttribute('data-code');
        if (e.target.checked) state.modalSelectedCodes.add(code);
        else state.modalSelectedCodes.delete(code);
        document.getElementById('modal-selected-count').textContent = state.modalSelectedCodes.size;
      }
    });

    // Confirm Add Salesmen from Modal
    document.getElementById('btn-confirm-add-salesmen').addEventListener('click', confirmAddSalesmen);

    // Assigned Salesmen Table interactions (Delegation for select updates & remove)
    const assignedBody = document.getElementById('assigned-salesmen-table-body');
    assignedBody.addEventListener('change', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      if (isNaN(idx) || !state.addTransfer.items[idx]) return;

      if (e.target.classList.contains('map-source-dist')) {
        state.addTransfer.items[idx].sourceDistributorCode = e.target.value;
        state.addTransfer.items[idx].sourceDistributorName = getDistributorName(e.target.value);
      } else if (e.target.classList.contains('map-dest-dist')) {
        state.addTransfer.items[idx].destinationDistributorCode = e.target.value;
        state.addTransfer.items[idx].destinationDistributorName = getDistributorName(e.target.value);
      } else if (e.target.classList.contains('map-position')) {
        state.addTransfer.items[idx].salesPositionCode = e.target.value;
        state.addTransfer.items[idx].salesPositionName = getPositionName(e.target.value);
      } else if (e.target.classList.contains('map-warehouse')) {
        state.addTransfer.items[idx].mainWarehouseCode = e.target.value;
        state.addTransfer.items[idx].mainWarehouseName = getWarehouseName(e.target.value);
      } else if (e.target.classList.contains('map-van')) {
        state.addTransfer.items[idx].vanCode = e.target.value;
        state.addTransfer.items[idx].vanName = getVanName(e.target.value);
      }
    });

    assignedBody.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.btn-remove-assigned-salesman');
      if (removeBtn) {
        const idx = parseInt(removeBtn.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          state.addTransfer.items.splice(idx, 1);
          renderAssignedSalesmen();
        }
      }
    });

    // Detail Back buttons
    document.getElementById('btn-detail-back').addEventListener('click', () => switchView('view-list'));
    document.getElementById('btn-detail-return').addEventListener('click', () => switchView('view-list'));

    // Import Modal interactions
    document.getElementById('btn-download-sample-template').addEventListener('click', downloadSampleTemplate);

    const dropzone = document.getElementById('import-dropzone');
    const fileInput = document.getElementById('import-file-input');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileSelect(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileSelect(e.target.files[0]);
        }
      });
    }

    document.getElementById('btn-execute-import').addEventListener('click', executeImport);
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    setupEventListeners();
    renderTransferList();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
