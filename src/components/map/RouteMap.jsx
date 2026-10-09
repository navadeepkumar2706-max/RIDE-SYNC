import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create modern custom SVG pin icons
const createPinIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: ${color};
        color: white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 11px;
          font-weight: 700;
          font-family: sans-serif;
        ">${label}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const sourceIcon = createPinIcon('#059669', 'A');
const destIcon = createPinIcon('#0f172a', 'B');
const waypointIcon = createPinIcon('#d97706', '•');

// Component to dynamically fit map bounds to all markers
function MapBoundsUpdater({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
    try {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } catch (e) {}
  }, [map, points]);

  return null;
}

export function RouteMap({
  sourceCoords,
  destCoords,
  waypoints = [],
  sourceName = 'Pickup',
  destName = 'Destination',
  interactive = false,
  onLocationSelect = null,
  height = '360px',
}) {
  // Default center: Hyderabad (near HITEC City / Gachibowli)
  const defaultCenter = [17.4455, 78.3489];
  const center = sourceCoords ? [sourceCoords.lat, sourceCoords.lng] : defaultCenter;

  const validPoints = [];
  if (sourceCoords?.lat && sourceCoords?.lng) validPoints.push([sourceCoords.lat, sourceCoords.lng]);
  waypoints.forEach((w) => {
    if (w.coordinates?.lat && w.coordinates?.lng) {
      validPoints.push([w.coordinates.lat, w.coordinates.lng]);
    }
  });
  if (destCoords?.lat && destCoords?.lng) validPoints.push([destCoords.lat, destCoords.lng]);

  return (
    <div style={{ height }} className="w-full relative rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validPoints.length > 0 && <MapBoundsUpdater points={validPoints} />}

        {/* Source Marker */}
        {sourceCoords?.lat && sourceCoords?.lng && (
          <Marker position={[sourceCoords.lat, sourceCoords.lng]} icon={sourceIcon}>
            <Popup>
              <div className="font-sans text-xs">
                <strong className="text-emerald-700 block mb-1">Pickup (Origin)</strong>
                {sourceName}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Waypoint Markers */}
        {waypoints.map((w, idx) => (
          <Marker
            key={idx}
            position={[w.coordinates.lat, w.coordinates.lng]}
            icon={waypointIcon}
          >
            <Popup>
              <div className="font-sans text-xs">
                <strong className="text-amber-700 block mb-1">Pickup Stop #{idx + 1}</strong>
                {w.name}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Destination Marker */}
        {destCoords?.lat && destCoords?.lng && (
          <Marker position={[destCoords.lat, destCoords.lng]} icon={destIcon}>
            <Popup>
              <div className="font-sans text-xs">
                <strong className="text-slate-900 block mb-1">Destination (Drop)</strong>
                {destName}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {validPoints.length >= 2 && (
          <Polyline
            positions={validPoints}
            color="#059669"
            weight={4}
            opacity={0.8}
            dashArray="6, 8"
          />
        )}
      </MapContainer>
    </div>
  );
}
