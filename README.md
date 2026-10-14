# INS Track — Sales Visit Tracking & Order Management Software

Developed by **iNext Software Solutions Pvt. Ltd. (INS)**  
*Thinking Beyond • "Your Vision, Our Technology."*  
**Quotation Reference**: `INS/260926/IQ034` | **Date**: `13-10-2026`  
**Signatory**: Anshika Dubey, Business Head  
**Address**: Civil Lines, Raipur, Chhattisgarh | **Contact**: +91 7880091996 | **Email**: info@inextsoftware.in  

---

## 🚀 Overview

This software is an enterprise-grade, modern, responsive frontend application built strictly to the specifications of the official **iNext Software Solutions (INS)** Project Quotation.

It facilitates real-time tracking of field sales representatives' daily client visits, automatic check-in/out GPS capture, interaction feedback recording, and basic on-site customer order entry with INR revenue calculations.

---

## 🔑 Demo Access & Role Accounts

| Role | Employee ID | Default Password | Primary Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `INS001` | `Admin@123` | Executive KPI dashboard, all-employee monitoring, employee CRUD, all visits inspection with GPS coordinates, order revenue analytics, daily summaries. |
| **Sales Employee** | `EMP101` | `Sales@123` | Personal field dashboard, check-in GPS capture, active running visit stop-watch, check-out GPS & feedback, order entry, personal visit history. |

> **Evaluator Tip:** The login page features **1-Click Instant Login** buttons (`Instant Admin` and `Instant Sales`) to let you switch roles with zero typing. There is also an interactive role-switch pill inside the top navigation bar.

---

## 📋 Implemented Modules (Quotation Scope)

### 1. Module A — Authentication & Role Selection
- INS brand identity with navy & royal blue enterprise palette.
- Dual demo account shortcuts (Admin `INS001` and Sales Rep `EMP101`).
- Password visibility toggle, form validation, and session persistence in `localStorage`.
- Direct access to the **Quotation Scope Modal** displaying the original PDF details.

### 2. Module B — Admin Dashboard
- **4 Key Performance Indicators (KPIs)**: Total Active Employees, Total Field Visits, Total Orders Booked, and Total Order Revenue in INR (`₹`).
- **Date Filtering Toolbar**: Today (14 Oct), Yesterday (13 Oct), Past dates, or All-Time.
- **Visual Analytics with Recharts**:
  - Daily Field Visits & Orders 5-Day Trend Area Chart.
  - Employee-wise Revenue Generation Bar Chart.
- **Employee-wise Monitoring Table**: Visits made, visits completed, orders booked, and total order revenue generated per representative.
- **Recent Activity Feeds**: Live feeds of latest visits (with status badges and Google Maps links) and latest customer orders.

### 3. Module C — Sales Employee Management
- Searchable, filterable directory of field sales executives.
- Filter by status (`Active` or `Inactive`).
- **Add Employee Modal**: Form validation, auto-generated ID, territory assignment, and safe credential generation.
- **Edit Employee Modal**: Live update employee details.
- **Account Status Toggle**: One-click activate/deactivate with status badges.
- **Slide-over Profile Drawer**: Comprehensive view of lifetime visits, booked orders, assigned territory, and contact details.

### 4. Module D — Visit Tracking & GPS Geolocation
- **Check-in GPS Capture**:
  - Uses the genuine HTML5 `navigator.geolocation.getCurrentPosition` browser API.
  - Transparently indicates whether coordinates are **Genuine Browser GPS** or **Sample Demo GPS (Raipur, C.G.)** with accuracy radius (`±Xm`).
  - Never fabricates coordinates without clear user transparency.
- **Active Visit Running State**:
  - Prominent card with running digital timer (`HH:MM:SS`).
  - Customer name, person met, check-in time, and direct Google Maps link (`https://www.google.com/maps?q=lat,lng`).
  - Guards against duplicate active visits.
- **End Visit Workflow**:
  - Captures check-out GPS coordinates.
  - Customer feedback and remarks.
  - Optional toggle to book an on-site order received during the visit.
  - Success receipt dialog upon completion.
- **Admin Inspection**:
  - Inspect any visit with complete GPS coordinates, map links, and customer feedback.

### 5. Module E — Order Management
- Basic customer order entry: Customer Name, Product Name, Order Amount in INR (`₹`), Order Date.
- Associates orders with the employee and visit reference ID.
- Search orders and filter by employee or date.
- Real-time revenue statistics: Total Orders, Total Revenue, Average Order Value.

### 6. Module F — Sales Employee Dashboard
- Mobile-optimized interface designed for field executives on smartphones.
- Running active visit card with quick "Complete / End Visit" CTA.
- Quick action tiles: Start Visit, Book Order, View History, Daily Summary.
- Personal KPI counters (filtered strictly to the logged-in representative's data).

### 7. Module G — Visit History & Daily Summary
- Date-wise breakdown table: Total visits, completed visits, total order count, and revenue.
- Printable / exportable daily summary report.
- Both executive view (all reps) and personal view (individual rep).

---

## 🚫 Out-of-Scope Boundaries (Per Quotation Note on Page 3)

The following items are explicitly **excluded** in the approved quotation and are therefore intentionally not implemented:
1. **Continuous live background GPS breadcrumb tracking** (only check-in and check-out point capture is included).
2. **Inventory / stock warehouse management**.
3. **Invoicing, GST calculation, or billing generation**.
4. **Advanced predictive sales forecasting / multi-tier CRM pipelines**.

---

## 🛠️ Technology Stack

- **Framework**: React 19 with Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with customized INS Navy Blue design tokens
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Persistence**: `localStorage` (deterministic seed data with instant "Reset Demo Data" capability)

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in your browser
# http://localhost:5173
```

---

## 🏢 Company Contact Information

**iNext Software Solutions Pvt. Ltd.**  
Civil Lines, Raipur, Chhattisgarh, India  
Phone: +91 7880091996  
Email: info@inextsoftware.in  
Website: [www.inextsoftware.in](https://www.inextsoftware.in)  
Ref. No.: `INS/260926/IQ034`
