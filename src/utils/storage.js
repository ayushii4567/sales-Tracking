// LocalStorage persistence manager for INS Sales Tracker demo

const STORAGE_KEYS = {
  EMPLOYEES: 'ins_tracker_employees_v2',
  VISITS: 'ins_tracker_visits_v2',
  ORDERS: 'ins_tracker_orders_v2',
  AUTH_USER: 'ins_tracker_auth_user_v2',
  ACTIVE_VISIT: 'ins_tracker_active_visit_v2'
};

export function getStoredData(key, fallbackData) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallbackData;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallbackData;
  }
}

export function setStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error writing ${key} to localStorage:`, err);
  }
}

export function clearDemoData() {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Error clearing localStorage:', err);
  }
}

export { STORAGE_KEYS };
