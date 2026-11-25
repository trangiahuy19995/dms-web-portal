# DMS Web Portal - Salesman Transfer System

Enterprise Distribution Management System (DMS) Web Portal implemented directly from Figma Design: **[South Africa] DMS Web** (Node: `40000042:31524`).

## Live Demo
- **GitHub Pages:** [https://trangiahuy19995.github.io/dms-web-portal/](https://trangiahuy19995.github.io/dms-web-portal/)
- **Repository:** [https://github.com/trangiahuy19995/dms-web-portal](https://github.com/trangiahuy19995/dms-web-portal)

---

## Features Implemented from Figma

### 1. View Salesman Migration List (Figma Node `40000014:14821`)
- **Filter Form:**
  - `Transfer code`: Text filter (`Please Search for transfer Code`)
  - `Transfer date`: Date picker (`Please Search for transfer date`)
  - `Transfer description`: Text filter (`Please Search for transfer description`)
  - `Transfer type`: Dropdown filter (`One to one`, `One to many`, `Many to one`)
  - Actions: `Clear` (reset filters) and `Search`
- **Actions Bar:**
  - `Import`: Batch import salesman transfers via Excel/CSV with template download
  - `Add New`: Initiate new salesman transfer wizard
- **Data Table:**
  - Checkbox selection with Select All
  - Transfer code (clickable link into detail view)
  - Transfer description, Transfer date, Transfer type with status badges
  - Pagination with rows per page selector (10, 20, 50) and page controls

### 2. Add New Salesman Transfer (Figma Nodes `40000038:3526`, `40000042:23561`, `40000042:26651`, `40000042:29365`)
- **Dynamic Transfer Types with Specialized Logic:**
  - **One to one**: Single Source Distributor -> Single Destination Distributor.
  - **Many to one**: Consolidates salesmen from multiple distributors to one destination. The Source distributor dropdown at header is disabled; source distributor is allocated per salesman in the table.
  - **One to many**: Distributes salesmen from one source distributor across multiple destinations. Destination distributor at header is disabled; destination is allocated per salesman in the table.
- **Dynamic Transfer Mapping Table:**
  - Select Salesmen modal integration
  - Position allocation (Pre sales vs Van sales)
  - Warehouse allocation
  - Van allocation (enabled conditionally for Van sales only)
  - Delete selected salesmen
  - Form validation on submission

### 3. Add Salesman Modal Dialog (Figma Node `40000050:31546`)
- Multi-criteria search filter:
  - `Salesman code`
  - `Salesman name`
  - `Salesman type` (Pre sales / Van sales)
  - `Email address`
  - `Distributor`
- Selection table with multi-select checkboxes
- "Save" button to import selected salesmen into the transfer mapping table

### 4. View Salesman Transfer Detail (Figma Node `40000050:34154`)
- Read-only card with complete transfer metadata (Code, Description, Date, Type, Source, Destination, Complete Transfer state)
- Transferred salesmen listing with their destination positions, warehouses, and vans

### 5. Enterprise Portal Layout
- Top navigation with domain simulation (`https://ghana-dms.testwilmar-intl.com/`), account dropdown (`WHANGANUI HIGH SCHOOL STAFFROOM`), notifications, and breadcrumb tracking (`Transfer > Salesman > ...`)
- Collapsible DMS sidebar with quick navigation across all core DMS modules

---

## Tech Stack
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS (Enterprise Design System tokens)
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Deployment:** GitHub Actions + GitHub Pages

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/trangiahuy19995/dms-web-portal.git

# Navigate to project
cd dms-web-portal

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
