import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import {
  Navigation,
  Compass,
  MapPin,
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
  CornerUpRight,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  Layers,
  Lock,
  Unlock,
  LocateFixed,
  X,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { calculateDistanceKm, calculateEtaMinutes, calculateWalkingTimeMinutes } from '../../utils/geoUtils';

// Map controller to handle programmatic panning, zooming, bounds, and custom button triggers
const MapController = ({ center, zoom, bounds, triggerFitAll, triggerRecenter, triggerZoomIn, triggerZoomOut }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    } else if (center) {
      map.flyTo(center, zoom || 14, { duration: 1.2 });
    }
  }, [center, zoom, bounds, map]);

  useEffect(() => {
    if (triggerFitAll && triggerFitAll > 0 && bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [triggerFitAll, bounds, map]);

  useEffect(() => {
    if (triggerRecenter && triggerRecenter > 0 && center) {
      map.flyTo(center, 15, { duration: 1.2 });
    }
  }, [triggerRecenter, center, map]);

  useEffect(() => {
    if (triggerZoomIn && triggerZoomIn > 0) {
      map.zoomIn();
    }
  }, [triggerZoomIn, map]);

  useEffect(() => {
    if (triggerZoomOut && triggerZoomOut > 0) {
      map.zoomOut();
    }
  }, [triggerZoomOut, map]);

  return null;
};

// Pulsing User Live Location Marker Icon
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center w-9 h-9">
        <div class="absolute w-9 h-9 rounded-full bg-purple-500/30 animate-ping"></div>
        <div class="relative w-6 h-6 rounded-full bg-gradient-to-tr from-myspot-700 via-myspot-600 to-indigo-600 border-2 border-white shadow-glow flex items-center justify-center text-white">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

// Destination Slot Marker with Price & Status Pill
const createSlotIcon = (slot, isSelected) => {
  const isAlmostFull = slot.availableSlots <= 2;
  const statusColor = isAlmostFull ? 'bg-amber-500' : 'bg-emerald-500';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-110 ${
        isSelected ? 'scale-115 z-30' : 'z-20'
      }">
        <div class="px-2.5 py-1 rounded-full ${
          isSelected
            ? 'bg-gradient-to-r from-myspot-700 via-myspot-600 to-indigo-600 text-white ring-3 ring-purple-300 shadow-glow'
            : 'bg-white text-slate-900 border border-purple-200 shadow-md'
        } flex items-center gap-1.5 text-xs font-black">
          <span class="w-2 h-2 rounded-full ${statusColor}"></span>
          <span>₹${slot.pricePerHour}/h</span>
        </div>
        <div class="w-2.5 h-2.5 rotate-45 ${
          isSelected ? 'bg-myspot-700' : 'bg-white'
        } -mt-1 shadow-sm"></div>
      </div>
    `,
    iconSize: [64, 38],
    iconAnchor: [32, 38],
    popupAnchor: [0, -38],
  });
};

// Map Tile Layer Presets
const TILE_LAYERS = {
  streets: {
    name: 'Streets',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  clean: {
    name: 'Clean Light',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  }
};

export const ParkingMap = ({
  heightClass = null,
  highlightSlot = null,
  showRoute = false,
  collapsible = true,
}) => {
  const { userLocation, slots, selectedSlot, setSelectedSlot, requestUserLocation, isLocating } = useApp();

  // Flexibility States
  // 'compact' (170px) | 'standard' (320px) | 'expanded' (560px)
  const [sizeMode, setSizeMode] = useState('standard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isScrollZoomEnabled, setIsScrollZoomEnabled] = useState(false);
  const [activeLayer, setActiveLayer] = useState('streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Trigger counters for controller commands
  const [triggerFitAll, setTriggerFitAll] = useState(0);
  const [triggerRecenter, setTriggerRecenter] = useState(0);
  const [triggerZoomIn, setTriggerZoomIn] = useState(0);
  const [triggerZoomOut, setTriggerZoomOut] = useState(0);

  const activeSlot = highlightSlot || selectedSlot;

  // Real-time live distance & ETA calculation from user to destination
  const distanceToDest = activeSlot
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, activeSlot.lat, activeSlot.lng)
    : null;

  const drivingEta = distanceToDest ? calculateEtaMinutes(distanceToDest) : null;
  const walkingEta = distanceToDest ? calculateWalkingTimeMinutes(distanceToDest) : null;

  // Route waypoints polyline from user's live position to destination slot
  const routePoints = activeSlot
    ? [
        [userLocation.lat, userLocation.lng],
        [
          userLocation.lat + (activeSlot.lat - userLocation.lat) * 0.35 + 0.0004,
          userLocation.lng + (activeSlot.lng - userLocation.lng) * 0.25 - 0.0003
        ],
        [
          userLocation.lat + (activeSlot.lat - userLocation.lat) * 0.7 - 0.0002,
          userLocation.lng + (activeSlot.lng - userLocation.lng) * 0.65 + 0.0004
        ],
        [activeSlot.lat, activeSlot.lng],
      ]
    : [];

  const routeBounds = activeSlot
    ? [
        [userLocation.lat, userLocation.lng],
        [activeSlot.lat, activeSlot.lng]
      ]
    : null;

  // All slots bounds for "Fit All" action
  const allSlotsBounds = [
    [userLocation.lat, userLocation.lng],
    ...slots.map(s => [s.lat, s.lng])
  ];

  // Resolve height class dynamically if not explicitly forced by parent
  const computedHeightClass = heightClass
    ? heightClass
    : sizeMode === 'compact'
    ? 'h-44 sm:h-48'
    : sizeMode === 'expanded'
    ? 'h-[62vh] min-h-[480px]'
    : 'h-[34vh] sm:h-[38vh] min-h-[270px] max-h-[400px]';

  const handleFitAll = () => {
    setTriggerFitAll(prev => prev + 1);
  };

  const handleRecenter = () => {
    requestUserLocation();
    setTriggerRecenter(prev => prev + 1);
  };

  const handleToggleSize = () => {
    if (sizeMode === 'standard') setSizeMode('expanded');
    else if (sizeMode === 'expanded') setSizeMode('compact');
    else setSizeMode('standard');
  };

  // If collapsed mode is active (minimal header view)
  if (collapsible && isCollapsed) {
    return (
      <div className="w-full p-3.5 rounded-3xl bg-white border border-purple-100 shadow-card flex items-center justify-between gap-3 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-myspot-700 to-indigo-600 text-white flex items-center justify-center shadow-glow-sm shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">Interactive Map (Minimized)</h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                {slots.length} Spots Nearby
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
              Live Location: {userLocation.address}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(false)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white text-xs font-extrabold shadow-glow flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Show Map</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative isolate z-0 w-full ${computedHeightClass} rounded-3xl overflow-hidden shadow-card border border-purple-100/90 bg-purple-50 transition-all duration-300`}
    >
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        scrollWheelZoom={isScrollZoomEnabled}
        zoomControl={false}
        className="w-full h-full"
      >
        <MapController
          center={activeSlot ? [activeSlot.lat, activeSlot.lng] : [userLocation.lat, userLocation.lng]}
          zoom={activeSlot ? 15 : 14}
          bounds={showRoute && routeBounds ? routeBounds : null}
          triggerFitAll={triggerFitAll}
          triggerRecenter={triggerRecenter}
          triggerZoomIn={triggerZoomIn}
          triggerZoomOut={triggerZoomOut}
        />

        {/* Selected Tile Layer */}
        <TileLayer
          attribution={TILE_LAYERS[activeLayer].attribution}
          url={TILE_LAYERS[activeLayer].url}
        />

        {/* Route Polyline (Live User -> Destination Slot) */}
        {(showRoute || activeSlot) && routePoints.length > 0 && (
          <>
            {/* Glow Polyline Background */}
            <Polyline
              positions={routePoints}
              pathOptions={{
                color: '#C084FC',
                weight: 8,
                opacity: 0.45,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Solid Route Line */}
            <Polyline
              positions={routePoints}
              pathOptions={{
                color: '#7C3AED',
                weight: 4.5,
                opacity: 0.95,
                dashArray: '8, 8',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          </>
        )}

        {/* User Current Live Location Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()}>
          <Popup>
            <div className="p-3 text-center">
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase">
                Your Live Origin
              </span>
              <p className="font-bold text-xs text-slate-900 mt-1">{userLocation.address}</p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Nearby Destination Parking Slots Markers */}
        {slots.map((slot) => {
          const isSelected = activeSlot?.id === slot.id;
          return (
            <Marker
              key={slot.id}
              position={[slot.lat, slot.lng]}
              icon={createSlotIcon(slot, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedSlot(slot);
                }
              }}
            >
              <Popup>
                <div className="w-60 p-3">
                  <img
                    src={slot.images[0]}
                    alt={slot.name}
                    className="w-full h-24 rounded-xl object-cover mb-2"
                  />
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h5 className="font-bold text-xs text-slate-900 truncate">{slot.name}</h5>
                    <span className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                      {slot.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mb-2">{slot.address}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-purple-50">
                    <div>
                      <span className="text-xs font-black text-purple-900">₹{slot.pricePerHour}</span>
                      <span className="text-[10px] text-slate-400">/hr</span>
                    </div>
                    <button
                      onClick={() => setSelectedSlot(slot)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Control Toolbar (Top-Left): Status Pill */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 max-w-[calc(100%-140px)]">
        <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-purple-100 text-xs font-bold text-slate-800 flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate">
            {activeSlot ? `Route: ${activeSlot.name}` : `GPS: ${userLocation.address.split(',')[0]}`}
          </span>
        </div>
      </div>

      {/* Floating Control Toolbar (Top-Right): Flexibility & Map Tools */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
        {/* Top Action Row */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-purple-100">
          {/* Tile Layer Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="w-8 h-8 rounded-xl hover:bg-purple-50 text-slate-700 flex items-center justify-center transition-colors"
              title="Change Map View Style"
              aria-label="Map style switcher"
            >
              <Layers className="w-4 h-4 text-purple-700" />
            </button>

            {/* Layer Dropdown */}
            {showLayerMenu && (
              <div className="absolute right-0 mt-2 w-32 rounded-2xl bg-white shadow-card border border-purple-100 p-1.5 z-20 space-y-1 animate-in fade-in">
                {Object.entries(TILE_LAYERS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveLayer(key);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      activeLayer === key
                        ? 'bg-purple-100 text-purple-900'
                        : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fit All Slots Button */}
          <button
            onClick={handleFitAll}
            className="w-8 h-8 rounded-xl hover:bg-purple-50 text-slate-700 flex items-center justify-center transition-colors"
            title="Fit all parking spots in view"
            aria-label="Fit all parking slots"
          >
            <LocateFixed className="w-4 h-4 text-purple-700" />
          </button>

          {/* Recenter & GPS Button */}
          <button
            onClick={handleRecenter}
            disabled={isLocating}
            className="w-8 h-8 rounded-xl hover:bg-purple-50 text-slate-700 flex items-center justify-center transition-colors"
            title="Recenter to Live GPS Location"
            aria-label="Recenter to GPS"
          >
            <Compass className={`w-4 h-4 text-purple-700 ${isLocating ? 'animate-spin' : ''}`} />
          </button>

          {/* Size Mode Toggle (Compact / Standard / Expanded) */}
          {collapsible && !heightClass && (
            <button
              onClick={handleToggleSize}
              className="w-8 h-8 rounded-xl hover:bg-purple-50 text-slate-700 flex items-center justify-center transition-colors"
              title={`Toggle map size (Current: ${sizeMode})`}
              aria-label="Toggle map size"
            >
              {sizeMode === 'expanded' ? (
                <Minimize2 className="w-4 h-4 text-purple-700" />
              ) : (
                <Maximize2 className="w-4 h-4 text-purple-700" />
              )}
            </button>
          )}

          {/* Collapse Map Button */}
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="w-8 h-8 rounded-xl hover:bg-purple-50 text-slate-700 flex items-center justify-center transition-colors"
              title="Minimize / Collapse Map"
              aria-label="Collapse map"
            >
              <ChevronUp className="w-4 h-4 text-slate-600" />
            </button>
          )}
        </div>

        {/* Secondary Control Column: Zoom In / Out & Scroll Zoom Lock */}
        <div className="flex flex-col gap-1 p-1 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-purple-100">
          <button
            onClick={() => setTriggerZoomIn(prev => prev + 1)}
            className="w-7 h-7 rounded-xl hover:bg-purple-50 text-slate-700 flex items-center justify-center transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={() => setTriggerZoomOut(prev => prev + 1)}
            className="w-7 h-7 rounded-xl hover:bg-purple-50 text-slate-700 flex items-center justify-center transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={() => setIsScrollZoomEnabled(!isScrollZoomEnabled)}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
              isScrollZoomEnabled
                ? 'bg-purple-100 text-purple-900'
                : 'hover:bg-purple-50 text-slate-400'
            }`}
            title={isScrollZoomEnabled ? 'Scroll zoom is ON (Click to lock)' : 'Scroll zoom is OFF (Click to enable)'}
            aria-label="Toggle scroll zoom"
          >
            {isScrollZoomEnabled ? (
              <Unlock className="w-3.5 h-3.5 text-purple-700" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Bottom Navigation & Route Banner */}
      {activeSlot && (
        <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-center animate-in slide-in-from-bottom-2 duration-200">
          <div className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-purple-200/90 shadow-card flex items-center justify-between gap-3 w-full max-w-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-myspot-700 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CornerUpRight className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 truncate">
                  {distanceToDest} km • ~{drivingEta}m drive ({walkingEta}m walk)
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  To {activeSlot.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${activeSlot.lat},${activeSlot.lng}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-myspot-700 to-indigo-600 hover:from-myspot-800 hover:to-indigo-700 text-white text-xs font-extrabold shadow-glow flex items-center gap-1.5 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Directions</span>
              </a>

              <button
                onClick={() => setSelectedSlot(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                title="Clear route selection"
                aria-label="Clear route"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
