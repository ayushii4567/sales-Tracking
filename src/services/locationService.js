// Geolocation Service for Browser Location Capture
// Implements HTML5 Geolocation API with graceful permission handling & clear simulated fallback

export async function getCurrentBrowserLocation() {
  if (!navigator.geolocation) {
    return {
      success: false,
      error: 'Geolocation is not supported by your browser.',
      code: 'UNSUPPORTED'
    };
  }

  return new Promise((resolve) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          isSimulated: false,
          timestamp: new Date().toISOString(),
          statusText: 'Genuine Browser GPS Captured'
        });
      },
      (error) => {
        let errorMsg = 'Unable to retrieve location.';
        let code = 'ERROR';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'GPS location permission denied. You can enable location in browser settings or use Demo Raipur coordinates for testing.';
            code = 'PERMISSION_DENIED';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is currently unavailable on this device.';
            code = 'POSITION_UNAVAILABLE';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Please check device GPS/network.';
            code = 'TIMEOUT';
            break;
          default:
            errorMsg = error.message || 'Unknown location error.';
        }

        resolve({
          success: false,
          error: errorMsg,
          code
        });
      },
      options
    );
  });
}

/**
 * Fallback sample location for testing/demo when device GPS is unavailable or permission denied.
 * Always explicitly marked with isSimulated: true.
 */
export function getSimulatedDemoLocation(areaName = 'Raipur Commercial Market') {
  // Variations around Raipur coordinates (21.2514° N, 81.6296° E)
  const jitterLat = (Math.random() - 0.5) * 0.008;
  const jitterLng = (Math.random() - 0.5) * 0.008;

  return {
    success: true,
    latitude: Number((21.2497 + jitterLat).toFixed(4)),
    longitude: Number((81.6365 + jitterLng).toFixed(4)),
    accuracy: Math.floor(10 + Math.random() * 15),
    isSimulated: true,
    timestamp: new Date().toISOString(),
    statusText: 'Sample Demo Location (Raipur, C.G.)'
  };
}
