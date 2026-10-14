// Formatting Utilities for INS Sales Visit Tracking

/**
 * Format amount in Indian Rupees (INR)
 * @param {number} amount
 * @returns {string} e.g. "₹1,42,000"
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format YYYY-MM-DD to readable date (e.g. "14 Oct 2026")
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    return dateString;
  } catch {
    return dateString;
  }
}

/**
 * Format coordinates for clean display
 * @param {number} lat
 * @param {number} lng
 * @returns {string} e.g. "21.2497° N, 81.6365° E"
 */
export function formatCoordinates(lat, lng) {
  if (lat === undefined || lng === undefined || lat === null || lng === null) return 'Not Available';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

/**
 * Generate Google Maps URL for given coordinates
 * @param {number} lat
 * @param {number} lng
 * @returns {string}
 */
export function getGoogleMapsUrl(lat, lng) {
  if (!lat || !lng) return '#';
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * Calculate difference between start and current or end time
 * @param {string} startTimeStr (e.g., "11:15 AM")
 * @param {string} dateStr (YYYY-MM-DD)
 * @returns {string} e.g., "45m" or "1h 15m"
 */
export function getElapsedTime(startTimeStr, dateStr) {
  if (!startTimeStr) return '0m';
  try {
    // If we have dateStr and startTimeStr, estimate elapsed minutes
    const now = new Date();
    // Parse time
    const [time, modifier] = startTimeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    let diffMs = now - startDate;
    if (diffMs < 0) diffMs = 0;

    const totalMinutes = Math.floor(diffMs / 60000);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  } catch {
    return '0m';
  }
}
