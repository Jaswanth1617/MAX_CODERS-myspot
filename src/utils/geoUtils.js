// Utility functions for Geographic calculations, Routing, and Dynamic Slots

// Haversine formula to calculate real distance between two lat/lng coordinates in km
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
};

// Calculate driving ETA in minutes
export const calculateEtaMinutes = (distanceKm) => {
  const avgCitySpeedKmH = 22; // average city driving speed
  const timeHours = distanceKm / avgCitySpeedKmH;
  const timeMinutes = Math.round(timeHours * 60);
  return Math.max(2, timeMinutes);
};

// Calculate walking time in minutes
export const calculateWalkingTimeMinutes = (distanceKm) => {
  const avgWalkingSpeedKmH = 4.8;
  const timeMinutes = Math.round((distanceKm / avgWalkingSpeedKmH) * 60);
  return Math.max(1, timeMinutes);
};

// Reverse geocode lat/lng to readable location using OpenStreetMap Nominatim
export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'User-Agent': 'myspot-smart-mobility-app' } }
    );
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    const addr = data.address || {};
    const road = addr.road || addr.suburb || addr.neighbourhood || addr.city_district || 'Current Location';
    const city = addr.city || addr.town || addr.state || '';
    return `${road}${city ? ', ' + city : ''}`;
  } catch (err) {
    return `Live GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
};

// Generate nearby parking slots anchored dynamically to user's live coordinates
export const generateNearbySlotsForLocation = (userLat, userLng, baseSlots) => {
  // Offsets in degrees (approx 300m to 2.5km away)
  const offsets = [
    { dLat: 0.0035, dLng: 0.0042, suffix: 'Smart Plaza & Multi-Level Hub' },
    { dLat: -0.0048, dLng: 0.0055, suffix: 'Grand Mall Basement Parking' },
    { dLat: 0.0062, dLng: -0.0038, suffix: 'Metro Transit Express Spot' },
    { dLat: -0.0075, dLng: -0.0062, suffix: 'Tech Park SafePark Zone' },
    { dLat: 0.0089, dLng: 0.0078, suffix: 'City Center Premium Covered Slot' },
    { dLat: -0.0030, dLng: -0.0045, suffix: 'Express Bike & Compact Lot' },
  ];

  return baseSlots.map((slot, idx) => {
    const offset = offsets[idx % offsets.length];
    const slotLat = userLat + offset.dLat;
    const slotLng = userLng + offset.dLng;
    const distanceKm = calculateDistanceKm(userLat, userLng, slotLat, slotLng);
    const etaMins = calculateEtaMinutes(distanceKm);
    const walkingMins = calculateWalkingTimeMinutes(distanceKm);

    return {
      ...slot,
      lat: slotLat,
      lng: slotLng,
      distanceKm,
      drivingEtaMins: etaMins,
      walkingTimeMins: walkingMins,
    };
  });
};
