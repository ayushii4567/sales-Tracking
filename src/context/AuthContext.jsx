import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_ACCOUNTS } from '../data/seedData';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredData(STORAGE_KEYS.AUTH_USER, DEMO_ACCOUNTS.admin);
  });

  useEffect(() => {
    if (currentUser) {
      setStoredData(STORAGE_KEYS.AUTH_USER, currentUser);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [currentUser]);

  /**
   * Simulated authentication for frontend demonstration
   */
  const login = (identifier, password, employeesList = []) => {
    const trimmedId = (identifier || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    // Check Admin demo account
    if (
      (trimmedId === 'ins001' || trimmedId === 'admin@inextsoftware.in' || trimmedId === 'anshika.dubey@inextsoftware.in')
    ) {
      if (trimmedPass === 'Admin@123' || trimmedPass === 'admin') {
        const adminUser = { ...DEMO_ACCOUNTS.admin };
        setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      }
      return { success: false, error: 'Invalid password. For Admin demo, use: Admin@123' };
    }

    // Check Sales Employee default demo account
    if (
      (trimmedId === 'emp101' || trimmedId === 'rahul.verma@inextsoftware.in')
    ) {
      if (trimmedPass === 'Sales@123' || trimmedPass === 'sales') {
        const salesUser = { ...DEMO_ACCOUNTS.sales };
        setCurrentUser(salesUser);
        return { success: true, user: salesUser };
      }
      return { success: false, error: 'Invalid password. For Sales demo, use: Sales@123' };
    }

    // Check other registered employees in data
    const matchedEmp = employeesList.find(
      (e) => e.id.toLowerCase() === trimmedId || e.email.toLowerCase() === trimmedId
    );

    if (matchedEmp) {
      if (matchedEmp.status === 'Inactive') {
        return {
          success: false,
          error: 'This employee account is Inactive. Please contact system administrator.'
        };
      }
      // Demo accepts standard employee password or matches default
      if (trimmedPass === 'Sales@123' || trimmedPass === 'password123' || trimmedPass === 'sales') {
        const empUser = {
          id: matchedEmp.id,
          name: matchedEmp.name,
          role: 'sales_rep',
          designation: 'Field Sales Representative',
          email: matchedEmp.email,
          avatar: matchedEmp.avatar,
          territory: matchedEmp.territory
        };
        setCurrentUser(empUser);
        return { success: true, user: empUser };
      }
      return { success: false, error: 'Invalid password. For employee accounts, default demo password is: Sales@123' };
    }

    return {
      success: false,
      error: 'Account not found. Use Demo account: INS001 (Admin) or EMP101 (Sales Rep).'
    };
  };

  /**
   * One-click demo switch helper
   */
  const switchDemoRole = (role) => {
    if (role === 'admin') {
      setCurrentUser(DEMO_ACCOUNTS.admin);
    } else {
      setCurrentUser(DEMO_ACCOUNTS.sales);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  };

  const updateCurrentUser = (updatedProfile) => {
    setCurrentUser((prev) => {
      const nextUser = { ...prev, ...updatedProfile };
      setStoredData(STORAGE_KEYS.AUTH_USER, nextUser);
      return nextUser;
    });
  };

  const isAdmin = currentUser?.role === 'admin';
  const isSales = currentUser?.role === 'sales_rep';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchDemoRole,
        updateCurrentUser,
        isAdmin,
        isSales,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
