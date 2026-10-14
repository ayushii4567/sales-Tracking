// Seed Data for INS Sales Visit Tracking & Order Management Software
// Company: iNext Software Solutions Pvt. Ltd. (INS) - Thinking Beyond

export const QUOTATION_INFO = {
  refNo: 'INS/260926/IQ034',
  date: '13-10-2026',
  company: 'iNext Software Solutions Pvt. Ltd.',
  abbreviation: 'INS',
  tagline: 'Thinking Beyond',
  motto: 'Your Vision, Our Technology.',
  address: 'Civil Lines, Raipur, Chhattisgarh, India',
  phone: '+91 7880091996',
  email: 'info@inextsoftware.in',
  website: 'www.inextsoftware.in',
  signatory: 'Anshika Dubey',
  signatoryRole: 'Business Head',
  scope: {
    included: [
      'Admin Dashboard (KPIs, Date-wise summary, Employee performance)',
      'Sales Employee Management (Add/Edit, Active/Inactive, Credentials)',
      'Visit Tracking (GPS Check-in & Check-out, Time, Customer Details, Remarks)',
      'Order Management (Customer, Product, Amount, Date)',
      'Sales Dashboard & History (Personal stats, Previous visits, Daily summary)'
    ],
    excluded: [
      'Continuous Live GPS Tracking (Only check-in and check-out location is captured)',
      'Inventory / Stock Management',
      'Invoicing & GST Billing',
      'Advanced Predictive Sales Forecasting / Multi-tiered CRM'
    ]
  }
};

// Exactly 5 Dummy Employees
export const INITIAL_EMPLOYEES = [
  {
    id: 'EMP101',
    name: 'Rahul Verma',
    email: 'rahul.verma@inextsoftware.in',
    phone: '+91 98271 44521',
    role: 'sales_rep',
    territory: 'Raipur Central & Pandri',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    status: 'Active',
    joinDate: '2025-11-15',
    lastActive: '2026-10-14 11:45 AM'
  },
  {
    id: 'EMP102',
    name: 'Pooja Sharma',
    email: 'pooja.sharma@inextsoftware.in',
    phone: '+91 94252 88190',
    role: 'sales_rep',
    territory: 'Bhilai & Durg Industrial Area',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    status: 'Active',
    joinDate: '2025-12-01',
    lastActive: '2026-10-14 12:10 PM'
  },
  {
    id: 'EMP103',
    name: 'Amit Patel',
    email: 'amit.patel@inextsoftware.in',
    phone: '+91 98930 12345',
    role: 'sales_rep',
    territory: 'Bilaspur Vyapar Vihar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    status: 'Active',
    joinDate: '2026-01-10',
    lastActive: '2026-10-14 10:30 AM'
  },
  {
    id: 'EMP104',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@inextsoftware.in',
    phone: '+91 91790 67890',
    role: 'sales_rep',
    territory: 'Naya Raipur & Abhanpur',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    status: 'Active',
    joinDate: '2026-02-05',
    lastActive: '2026-10-14 11:20 AM'
  },
  {
    id: 'EMP105',
    name: 'Vikram Singh',
    email: 'vikram.s@inextsoftware.in',
    phone: '+91 97521 34567',
    role: 'sales_rep',
    territory: 'Rajnandgaon Commercial Hub',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    status: 'Active',
    joinDate: '2026-03-12',
    lastActive: '2026-10-13 05:40 PM'
  }
];

// Exactly 5 Dummy Visits
export const INITIAL_VISITS = [
  // Visit 1: Active In Progress (Rahul Verma)
  {
    id: 'VST-2026-1014-01',
    employeeId: 'EMP101',
    employeeName: 'Rahul Verma',
    customerName: 'Shree Balaji Electricals & Hardware',
    personMet: 'Mr. Rajesh Agarwal (Owner)',
    contactNumber: '+91 98271 22334',
    date: '2026-10-14',
    startTime: '11:15 AM',
    endTime: null,
    durationMinutes: null,
    status: 'In Progress',
    remarks: 'Demonstrating modular switchgear range and festive replenishment.',
    checkInLocation: {
      latitude: 21.2497,
      longitude: 81.6365,
      accuracy: 12,
      address: 'Pandri Cloth & Hardware Market, Raipur, C.G.',
      isSimulated: false
    },
    checkOutLocation: null,
    orderId: null
  },
  // Visit 2: Completed with Order (Rahul Verma)
  {
    id: 'VST-2026-1014-02',
    employeeId: 'EMP101',
    employeeName: 'Rahul Verma',
    customerName: 'Mahavir Cable Corporation',
    personMet: 'Mr. Vardhman Jain',
    contactNumber: '+91 94252 11223',
    date: '2026-10-14',
    startTime: '09:30 AM',
    endTime: '10:45 AM',
    durationMinutes: 75,
    status: 'Completed',
    remarks: 'Client finalized bulk order for copper wiring spools. Urgent delivery requested.',
    checkInLocation: {
      latitude: 21.2514,
      longitude: 81.6296,
      accuracy: 10,
      address: 'Ganj Para, Station Road, Raipur, C.G.',
      isSimulated: false
    },
    checkOutLocation: {
      latitude: 21.2519,
      longitude: 81.6301,
      accuracy: 14,
      address: 'Ganj Para, Station Road, Raipur, C.G.',
      isSimulated: false
    },
    orderId: 'ORD-2026-1014-01'
  },
  // Visit 3: Completed with Order (Pooja Sharma)
  {
    id: 'VST-2026-1014-03',
    employeeId: 'EMP102',
    employeeName: 'Pooja Sharma',
    customerName: 'Bhilai Steel Spares & Tools',
    personMet: 'Sanjay Kumar (Procurement Manager)',
    contactNumber: '+91 98930 44556',
    date: '2026-10-14',
    startTime: '10:00 AM',
    endTime: '11:20 AM',
    durationMinutes: 80,
    status: 'Completed',
    remarks: 'Annual rate contract discussion. Received PO for industrial bearings.',
    checkInLocation: {
      latitude: 21.1938,
      longitude: 81.3509,
      accuracy: 15,
      address: 'Light Industrial Area, Bhilai, C.G.',
      isSimulated: false
    },
    checkOutLocation: {
      latitude: 21.1942,
      longitude: 81.3514,
      accuracy: 18,
      address: 'Light Industrial Area, Bhilai, C.G.',
      isSimulated: false
    },
    orderId: 'ORD-2026-1014-02'
  },
  // Visit 4: Completed routine inspection (Amit Patel)
  {
    id: 'VST-2026-1014-04',
    employeeId: 'EMP103',
    employeeName: 'Amit Patel',
    customerName: 'Keshri Agro Equipments',
    personMet: 'Sunil Keshri',
    contactNumber: '+91 97521 99001',
    date: '2026-10-14',
    startTime: '09:45 AM',
    endTime: '10:30 AM',
    durationMinutes: 45,
    status: 'Completed',
    remarks: 'Routine inspection visit. Client asked for quote for 5HP solar submersible pumps.',
    checkInLocation: {
      latitude: 22.0797,
      longitude: 82.1409,
      accuracy: 20,
      address: 'Vyapar Vihar, Bilaspur, C.G.',
      isSimulated: true
    },
    checkOutLocation: {
      latitude: 22.0801,
      longitude: 82.1415,
      accuracy: 22,
      address: 'Vyapar Vihar, Bilaspur, C.G.',
      isSimulated: true
    },
    orderId: null
  },
  // Visit 5: Completed with Order (Sneha Kulkarni)
  {
    id: 'VST-2026-1014-05',
    employeeId: 'EMP104',
    employeeName: 'Sneha Kulkarni',
    customerName: 'Capital Pharma & Surgical Store',
    personMet: 'Dr. Vivek Sahu',
    contactNumber: '+91 91790 33445',
    date: '2026-10-14',
    startTime: '10:15 AM',
    endTime: '11:10 AM',
    durationMinutes: 55,
    status: 'Completed',
    remarks: 'Demonstrated automated hospital sanitizer units. Order confirmed.',
    checkInLocation: {
      latitude: 21.1611,
      longitude: 81.7876,
      accuracy: 11,
      address: 'Sector 24, Nava Raipur Atal Nagar, C.G.',
      isSimulated: true
    },
    checkOutLocation: {
      latitude: 21.1614,
      longitude: 81.7881,
      accuracy: 12,
      address: 'Sector 24, Nava Raipur Atal Nagar, C.G.',
      isSimulated: true
    },
    orderId: 'ORD-2026-1014-03'
  }
];

// Exactly 5 Dummy Orders
export const INITIAL_ORDERS = [
  // Order 1 (Rahul Verma)
  {
    id: 'ORD-2026-1014-01',
    customerName: 'Mahavir Cable Corporation',
    productName: 'FR Copper Wire Spool 2.5 sq mm (50 Bundles)',
    orderAmount: 84500,
    orderDate: '2026-10-14',
    employeeId: 'EMP101',
    employeeName: 'Rahul Verma',
    visitId: 'VST-2026-1014-02',
    notes: 'Urgent delivery required within 48 hours for township contract.'
  },
  // Order 2 (Pooja Sharma)
  {
    id: 'ORD-2026-1014-02',
    customerName: 'Bhilai Steel Spares & Tools',
    productName: 'Heavy Industrial Ball Bearings & Valve Set (Lot of 12)',
    orderAmount: 142000,
    orderDate: '2026-10-14',
    employeeId: 'EMP102',
    employeeName: 'Pooja Sharma',
    visitId: 'VST-2026-1014-03',
    notes: 'Advance 50% paid via NEFT, balance against delivery.'
  },
  // Order 3 (Sneha Kulkarni)
  {
    id: 'ORD-2026-1014-03',
    customerName: 'Capital Pharma & Surgical Store',
    productName: 'Automated Hospital Sanitizer Units (10 units)',
    orderAmount: 48500,
    orderDate: '2026-10-14',
    employeeId: 'EMP104',
    employeeName: 'Sneha Kulkarni',
    visitId: 'VST-2026-1014-05',
    notes: 'Includes 1-year replacement warranty.'
  },
  // Order 4 (Rahul Verma)
  {
    id: 'ORD-2026-1013-01',
    customerName: 'Chhappan Bhog Commercial Kitchen Supplies',
    productName: 'Commercial Stainless Steel Gas Burner 3-Burner (3 units)',
    orderAmount: 62000,
    orderDate: '2026-10-13',
    employeeId: 'EMP101',
    employeeName: 'Rahul Verma',
    visitId: null,
    notes: 'Includes heavy-duty connector hoses.'
  },
  // Order 5 (Vikram Singh)
  {
    id: 'ORD-2026-1013-02',
    customerName: 'Rajnandgaon Plywood & Timber',
    productName: 'BWP Marine Grade Plywood 18mm 8x4 (100 Sheets)',
    orderAmount: 185000,
    orderDate: '2026-10-13',
    employeeId: 'EMP105',
    employeeName: 'Vikram Singh',
    visitId: null,
    notes: 'Trailer dispatch scheduled.'
  }
];

export const DEMO_ACCOUNTS = {
  admin: {
    id: 'INS001',
    name: 'Anshika Dubey',
    role: 'admin',
    designation: 'Business Head & Administrator',
    email: 'anshika.dubey@inextsoftware.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    defaultPassword: 'Admin@123'
  },
  sales: {
    id: 'EMP101',
    name: 'Rahul Verma',
    role: 'sales_rep',
    designation: 'Senior Field Sales Executive',
    email: 'rahul.verma@inextsoftware.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    defaultPassword: 'Sales@123'
  }
};
