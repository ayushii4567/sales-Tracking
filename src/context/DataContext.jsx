import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_EMPLOYEES,
  INITIAL_VISITS,
  INITIAL_ORDERS
} from '../data/seedData';
import { getStoredData, setStoredData, STORAGE_KEYS, clearDemoData } from '../utils/storage';

const DataContext = createContext();

export function DataProvider({ children }) {
  // Employees state
  const [employees, setEmployees] = useState(() => {
    return getStoredData(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  });

  // Visits state
  const [visits, setVisits] = useState(() => {
    return getStoredData(STORAGE_KEYS.VISITS, INITIAL_VISITS);
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    return getStoredData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  });

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Filter date (default to today: 2026-10-14, or 'all')
  const [selectedDate, setSelectedDate] = useState('2026-10-14');

  // Persistence effects
  useEffect(() => {
    setStoredData(STORAGE_KEYS.EMPLOYEES, employees);
  }, [employees]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.VISITS, visits);
  }, [visits]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  // Toast Helpers
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // EMPLOYEE ACTIONS
  const addEmployee = (newEmpData) => {
    const newId = `EMP${100 + employees.length + 1}`;
    const employee = {
      id: newId,
      name: newEmpData.name,
      email: newEmpData.email,
      phone: newEmpData.phone,
      role: 'sales_rep',
      territory: newEmpData.territory || 'Raipur District',
      avatar: newEmpData.avatar || `https://images.unsplash.com/photo-${1534528741775 + employees.length}?auto=format&fit=crop&w=256&q=80`,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now'
    };

    setEmployees((prev) => [employee, ...prev]);
    showToast(`Employee ${employee.name} (${employee.id}) added successfully!`, 'success');
    return employee;
  };

  const updateEmployee = (id, updatedFields) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updatedFields } : emp))
    );
    showToast(`Employee ${id} updated successfully!`, 'success');
  };

  const toggleEmployeeStatus = (id) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const nextStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
          showToast(`Account for ${emp.name} marked as ${nextStatus}.`, nextStatus === 'Active' ? 'success' : 'warning');
          return { ...emp, status: nextStatus };
        }
        return emp;
      })
    );
  };

  // VISIT ACTIONS
  const getActiveVisitForEmployee = (employeeId) => {
    return visits.find(
      (v) => v.employeeId === employeeId && v.status === 'In Progress'
    );
  };

  const startVisit = ({
    employeeId,
    employeeName,
    customerName,
    personMet,
    contactNumber,
    remarks,
    checkInLocation
  }) => {
    // Check if an active visit already exists for this employee
    const existingActive = getActiveVisitForEmployee(employeeId);
    if (existingActive) {
      showToast('You already have an active visit in progress! Please end it first.', 'warning');
      return { success: false, visit: existingActive };
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newVisitId = `VST-${dateStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newVisit = {
      id: newVisitId,
      employeeId,
      employeeName,
      customerName: customerName.trim(),
      personMet: personMet.trim(),
      contactNumber: contactNumber?.trim() || '',
      date: dateStr,
      startTime: timeStr,
      endTime: null,
      durationMinutes: null,
      status: 'In Progress',
      remarks: remarks?.trim() || 'Visit started.',
      checkInLocation: checkInLocation || {
        latitude: 21.2514,
        longitude: 81.6296,
        accuracy: 10,
        address: 'Raipur Commercial Zone',
        isSimulated: true
      },
      checkOutLocation: null,
      orderId: null
    };

    setVisits((prev) => [newVisit, ...prev]);
    showToast(`Visit started at "${customerName}". GPS check-in logged!`, 'success');
    return { success: true, visit: newVisit };
  };

  const endVisit = ({
    visitId,
    checkOutLocation,
    finalRemarks,
    newOrderData = null
  }) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    let createdOrderId = null;
    let orderSuccessMsg = '';

    // If an order was entered during check-out
    if (newOrderData && newOrderData.productName && newOrderData.orderAmount > 0) {
      const targetVisit = visits.find((v) => v.id === visitId);
      const dateStr = targetVisit ? targetVisit.date : now.toISOString().split('T')[0];
      const orderId = `ORD-${dateStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder = {
        id: orderId,
        customerName: newOrderData.customerName || targetVisit?.customerName || 'Customer',
        productName: newOrderData.productName.trim(),
        orderAmount: Number(newOrderData.orderAmount),
        orderDate: dateStr,
        employeeId: targetVisit?.employeeId || 'EMP101',
        employeeName: targetVisit?.employeeName || 'Rahul Verma',
        visitId: visitId,
        notes: newOrderData.notes || 'Order booked during on-site visit.'
      };

      setOrders((prev) => [newOrder, ...prev]);
      createdOrderId = orderId;
      orderSuccessMsg = ` & Order ₹${Number(newOrderData.orderAmount).toLocaleString('en-IN')} booked!`;
    }

    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === visitId) {
          // Estimate duration
          let durationMinutes = 35; // default reasonable estimate
          try {
            const [startHourMin, modifier] = v.startTime.split(' ');
            let [h, m] = startHourMin.split(':').map(Number);
            if (modifier === 'PM' && h < 12) h += 12;
            if (modifier === 'AM' && h === 12) h = 0;
            const startD = new Date();
            startD.setHours(h, m, 0, 0);
            const diff = Math.max(1, Math.round((now - startD) / 60000));
            if (diff > 0 && diff < 720) durationMinutes = diff;
          } catch {
            // fallback
          }

          return {
            ...v,
            endTime: timeStr,
            durationMinutes,
            status: 'Completed',
            remarks: finalRemarks ? `${v.remarks} | ${finalRemarks}` : v.remarks,
            checkOutLocation: checkOutLocation || {
              latitude: 21.2519,
              longitude: 81.6301,
              accuracy: 12,
              address: 'Raipur Commercial Zone',
              isSimulated: true
            },
            orderId: createdOrderId || v.orderId
          };
        }
        return v;
      })
    );

    showToast(`Visit completed successfully${orderSuccessMsg}`, 'success');
    return { success: true, orderId: createdOrderId };
  };

  // ORDER ACTIONS
  const addOrder = (orderData) => {
    const now = new Date();
    const dateStr = orderData.orderDate || now.toISOString().split('T')[0];
    const newOrderId = `ORD-${dateStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: newOrderId,
      customerName: orderData.customerName.trim(),
      productName: orderData.productName.trim(),
      orderAmount: Number(orderData.orderAmount),
      orderDate: dateStr,
      employeeId: orderData.employeeId,
      employeeName: orderData.employeeName,
      visitId: orderData.visitId || null,
      notes: orderData.notes?.trim() || ''
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order #${newOrderId} for ${newOrder.customerName} (₹${newOrder.orderAmount.toLocaleString('en-IN')}) saved!`, 'success');
    return newOrder;
  };

  // RESET ALL DEMO DATA TO PRISTINE SEED STATE
  const resetDemoData = () => {
    clearDemoData();
    setEmployees(INITIAL_EMPLOYEES);
    setVisits(INITIAL_VISITS);
    setOrders(INITIAL_ORDERS);
    setSelectedDate('2026-10-14');
    showToast('Demo data restored to original seed state successfully.', 'info');
  };

  // DERIVED STATS & ANALYTICS HELPER
  const getFilteredData = (targetDate = selectedDate, targetEmpId = null) => {
    let filteredVisits = visits;
    let filteredOrders = orders;

    if (targetDate && targetDate !== 'all') {
      filteredVisits = filteredVisits.filter((v) => v.date === targetDate);
      filteredOrders = filteredOrders.filter((o) => o.orderDate === targetDate);
    }

    if (targetEmpId) {
      filteredVisits = filteredVisits.filter((v) => v.employeeId === targetEmpId);
      filteredOrders = filteredOrders.filter((o) => o.employeeId === targetEmpId);
    }

    const totalEmployeesCount = employees.filter((e) => e.status === 'Active').length;
    const totalVisitsCount = filteredVisits.length;
    const completedVisitsCount = filteredVisits.filter((v) => v.status === 'Completed').length;
    const activeVisitsCount = filteredVisits.filter((v) => v.status === 'In Progress').length;
    const totalOrdersCount = filteredOrders.length;
    const totalOrderAmount = filteredOrders.reduce((sum, o) => sum + (Number(o.orderAmount) || 0), 0);

    return {
      filteredVisits,
      filteredOrders,
      totalEmployeesCount,
      totalVisitsCount,
      completedVisitsCount,
      activeVisitsCount,
      totalOrdersCount,
      totalOrderAmount
    };
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        visits,
        orders,
        toasts,
        showToast,
        removeToast,
        selectedDate,
        setSelectedDate,
        addEmployee,
        updateEmployee,
        toggleEmployeeStatus,
        startVisit,
        endVisit,
        getActiveVisitForEmployee,
        addOrder,
        resetDemoData,
        getFilteredData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
