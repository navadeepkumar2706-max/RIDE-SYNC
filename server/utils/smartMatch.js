/**
 * Calculates great-circle distance between two points in kilometers (Haversine formula)
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Deterministic Ride Match Scoring (0 - 100):
 * - Pickup & Drop Proximity: 40%
 * - Departure Time Compatibility: 35%
 * - Route & Waypoint Detour Suitability: 25%
 */
export function scoreRideMatch(ride, searchParams) {
  const { pickupCoords, dropCoords, preferredTime } = searchParams;

  let proximityScore = 100;
  let timeScore = 100;
  let routeScore = 80;

  // 1. Proximity Scoring (40%)
  if (pickupCoords && ride.source?.coordinates) {
    const pickupDist = calculateDistanceKm(
      pickupCoords.lat,
      pickupCoords.lng,
      ride.source.coordinates.lat,
      ride.source.coordinates.lng
    );
    // Score decays linearly up to 15km
    const pickupScore = Math.max(0, 100 - pickupDist * 6.5);

    let dropScore = 100;
    if (dropCoords && ride.destination?.coordinates) {
      const dropDist = calculateDistanceKm(
        dropCoords.lat,
        dropCoords.lng,
        ride.destination.coordinates.lat,
        ride.destination.coordinates.lng
      );
      dropScore = Math.max(0, 100 - dropDist * 6.5);
    }

    proximityScore = (pickupScore + dropScore) / 2;
  }

  // 2. Departure Time Compatibility (35%)
  if (preferredTime) {
    let prefDate = new Date(preferredTime);
    const rideDate = new Date(ride.departureAt);

    // If preferredTime is "HH:MM" format, apply rideDate's date
    if (isNaN(prefDate.getTime()) && typeof preferredTime === 'string' && preferredTime.includes(':')) {
      const parts = preferredTime.split(':').map((p) => parseInt(p, 10));
      if (!isNaN(parts[0]) && !isNaN(parts[1])) {
        prefDate = new Date(rideDate);
        prefDate.setHours(parts[0], parts[1], 0, 0);
      }
    }

    if (!isNaN(prefDate.getTime()) && !isNaN(rideDate.getTime())) {
      const diffMinutes = Math.abs((rideDate - prefDate) / (1000 * 60));
      // Perfect if within 15 mins, decays to 0 over 3 hours (180 mins)
      if (diffMinutes <= 15) {
        timeScore = 100;
      } else {
        timeScore = Math.max(0, 100 - ((diffMinutes - 15) / 165) * 100);
      }
    } else {
      timeScore = 100;
    }
  }

  // 3. Route Suitability & Waypoints (25%)
  // Check if search pickup or drop is near any of the ride's waypoints
  if (ride.waypoints && ride.waypoints.length > 0 && pickupCoords) {
    const waypointDistances = ride.waypoints.map((w) =>
      calculateDistanceKm(pickupCoords.lat, pickupCoords.lng, w.coordinates.lat, w.coordinates.lng)
    );
    const minWaypointDist = Math.min(...waypointDistances);
    if (minWaypointDist < 3.0) {
      routeScore = 100;
    }
  }

  // Final Weighted Normalization
  const compositeScore = Math.round(
    proximityScore * 0.4 + timeScore * 0.35 + routeScore * 0.25
  );

  return Math.min(100, Math.max(0, compositeScore));
}
