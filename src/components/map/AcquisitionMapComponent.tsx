import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Parcel, RiskLevel, ParcelStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ExternalLink,
  Clock,
  Layers,
  Search,
  Filter,
  Eye,
  FileText,
  AlertTriangle,
  Compass,
  ArrowRight,
  BrainCircuit,
  CheckCircle,
  X,
  Coins,
  MapPin,
  Building,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Calculator,
  Satellite,
  Globe,
  Maximize2,
  Minimize2,
  Ruler,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import { DISTRICT_LAND_RATES } from '../../data/districtLandRates';

interface AcquisitionMapProps {
  initialSelectedParcelId?: string;
  heightClass?: string;
}

// Coordinates for district centers
const DISTRICT_CENTERS: Record<string, [number, number]> = {
  Jaipur: [26.9124, 75.7873],
  Alwar: [27.553, 76.6346],
  Ajmer: [26.4499, 74.6399],
  Kota: [25.2138, 75.8648],
  Dausa: [26.8932, 76.3374],
  Jodhpur: [26.2389, 73.0243],
  Bikaner: [28.0229, 73.3119],
  Bundi: [25.4415, 75.6441],
  Sikar: [27.6094, 75.1399],
  Udaipur: [24.5854, 73.7125],
};

// Controller to fly to coordinates when target changes
const MapFlyTo: React.FC<{ targetLat?: number; targetLng?: number; zoom?: number }> = ({
  targetLat,
  targetLng,
  zoom = 13,
}) => {
  const map = useMap();
  React.useEffect(() => {
    if (targetLat && targetLng) {
      map.flyTo([targetLat, targetLng], zoom, { duration: 1.2 });
    }
  }, [targetLat, targetLng, zoom, map]);
  return null;
};

export const AcquisitionMapComponent: React.FC<AcquisitionMapProps> = ({
  initialSelectedParcelId,
  heightClass = 'h-[700px]',
}) => {
  const navigate = useNavigate();
  const { parcels, projects } = useApp();

  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(() => {
    if (initialSelectedParcelId) {
      return parcels.find((p) => p.parcelId === initialSelectedParcelId) || null;
    }
    return parcels.find((p) => p.parcelId === 'P-1024') || parcels[0] || null;
  });

  // District Intelligence Drawer State
  const [selectedDistrictDetail, setSelectedDistrictDetail] = useState<string | null>(null);

  // Map view mode: 'parcels' | 'rates'
  const [activeLayerMode, setActiveLayerMode] = useState<'parcels' | 'rates'>('parcels');

  // Base map satellite & imagery layer selector: 'satellite' | 'hybrid' | 'streets' | 'topo'
  const [baseMapLayer, setBaseMapLayer] = useState<'satellite' | 'hybrid' | 'streets' | 'topo'>('satellite');

  // Place names toggle: strictly false in pure satellite mode to hide city, district, and village names
  const [showPlaceLabels, setShowPlaceLabels] = useState<boolean>(false);

  // Satellite imagery engine: 'google' (Ultra-HD 0.3m resolution) | 'esri'
  const [satelliteProvider, setSatelliteProvider] = useState<'google' | 'esri'>('google');

  // HD clarity enhancer filter: boosts contrast and sharpens landscape features (removes haze)
  const [enhanceSatelliteClarity, setEnhanceSatelliteClarity] = useState<boolean>(true);

  // New Map Features toggles
  const [showSurveyPegs, setShowSurveyPegs] = useState<boolean>(true);
  const [showHighContrastBoundaries, setShowHighContrastBoundaries] = useState<boolean>(true);
  const [showMeasurementTool, setShowMeasurementTool] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [measuredDistanceMeters, setMeasuredDistanceMeters] = useState<number>(145.8);

  // Filters
  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [filterDistrict, setFilterDistrict] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Status to Color mapping
  const getParcelColor = (parcel: Parcel): { stroke: string; fill: string } => {
    if (parcel.ownerType === 'Government Land') {
      return { stroke: '#2563eb', fill: '#3b82f6' }; // BLUE
    }
    if (parcel.status === 'DISPUTED' || parcel.riskLevel === 'HIGH') {
      return { stroke: '#dc2626', fill: '#ef4444' }; // RED
    }
    if (parcel.status === 'DELAYED' || parcel.delayDays > 0) {
      return { stroke: '#ea580c', fill: '#f97316' }; // ORANGE
    }
    if (parcel.riskLevel === 'MEDIUM') {
      return { stroke: '#ca8a04', fill: '#eab308' }; // YELLOW
    }
    if (parcel.status === 'ACQUIRED' || parcel.status === 'IN_PROGRESS') {
      return { stroke: '#16a34a', fill: '#22c55e' }; // GREEN
    }
    return { stroke: '#64748b', fill: '#94a3b8' }; // GREY
  };

  // Filtered parcels
  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      if (filterProject !== 'ALL' && p.projectId !== filterProject) return false;
      if (filterDistrict !== 'ALL' && p.district !== filterDistrict) return false;
      if (filterRisk !== 'ALL' && p.riskLevel !== filterRisk) return false;
      if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          p.parcelId.toLowerCase().includes(query) ||
          p.khasraNumber.toLowerCase().includes(query) ||
          p.village.toLowerCase().includes(query) ||
          p.project.toLowerCase().includes(query) ||
          p.currentOfficer.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [parcels, filterProject, filterDistrict, filterRisk, filterStatus, searchQuery]);

  // Unique list of districts with status counts
  const districtSummaries = useMemo(() => {
    const list = ['Jaipur', 'Alwar', 'Ajmer', 'Kota', 'Dausa', 'Jodhpur', 'Bikaner', 'Bundi', 'Sikar', 'Udaipur'];
    return list.map((dist) => {
      const distParcels = parcels.filter((p) => p.district === dist);
      const delayed = distParcels.filter((p) => p.status === 'DELAYED' || p.delayDays > 0).length;
      const onTrack = distParcels.filter((p) => p.status === 'ACQUIRED' || (p.status === 'IN_PROGRESS' && p.delayDays === 0)).length;
      const disputed = distParcels.filter((p) => p.status === 'DISPUTED' || p.riskLevel === 'HIGH').length;
      return {
        name: dist,
        totalParcels: distParcels.length,
        delayed,
        onTrack,
        disputed,
      };
    });
  }, [parcels]);

  // District details when a district is selected
  const activeDistrictInfo = useMemo(() => {
    if (!selectedDistrictDetail) return null;
    const distParcels = parcels.filter((p) => p.district === selectedDistrictDetail);
    const delayedParcels = distParcels.filter((p) => p.status === 'DELAYED' || p.delayDays > 0);
    const onTrackParcels = distParcels.filter(
      (p) => p.status === 'ACQUIRED' || (p.status === 'IN_PROGRESS' && p.delayDays === 0)
    );
    const disputedParcels = distParcels.filter((p) => p.status === 'DISPUTED' || p.riskLevel === 'HIGH');

    // Projects active in this district
    const districtProjects = projects.filter((prj) => prj.districts.includes(selectedDistrictDetail));

    // Categorize projects into delayed in this district vs on-track
    const delayedProjects = districtProjects.filter((prj) => {
      return delayedParcels.some((p) => p.projectId === prj.projectId);
    });

    const onTrackProjects = districtProjects.filter((prj) => {
      return !delayedProjects.some((dp) => dp.projectId === prj.projectId);
    });

    // Land rates for this district
    const rateData = DISTRICT_LAND_RATES.find((d) => d.district === selectedDistrictDetail);

    const totalAreaHa = distParcels.reduce((sum, p) => sum + p.area, 0);

    return {
      district: selectedDistrictDetail,
      totalParcels: distParcels.length,
      totalAreaHa: Number(totalAreaHa.toFixed(2)),
      delayedParcels,
      onTrackParcels,
      disputedParcels,
      delayedProjects,
      onTrackProjects,
      allDistrictProjects: districtProjects,
      rateData,
    };
  }, [selectedDistrictDetail, parcels, projects]);

  // Current flyTo target
  const currentFlyTarget = useMemo(() => {
    if (selectedDistrictDetail && DISTRICT_CENTERS[selectedDistrictDetail]) {
      return {
        lat: DISTRICT_CENTERS[selectedDistrictDetail][0],
        lng: DISTRICT_CENTERS[selectedDistrictDetail][1],
        zoom: 12,
      };
    }
    if (selectedParcel) {
      return {
        lat: selectedParcel.latitude,
        lng: selectedParcel.longitude,
        zoom: 14,
      };
    }
    return null;
  }, [selectedDistrictDetail, selectedParcel]);

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* District Quick-Access Bar with On-Track & Delayed Badges */}
      <div className="bg-slate-900 text-white px-3.5 py-2.5 flex items-center justify-between overflow-x-auto gap-2 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2 shrink-0 pr-2 border-r border-slate-800">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-extrabold uppercase tracking-wide text-[11px] text-slate-300">
            District Intelligence:
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 overflow-x-auto py-0.5">
          {districtSummaries.map((dist) => {
            const isSelected = selectedDistrictDetail === dist.name;
            return (
              <button
                key={dist.name}
                onClick={() => {
                  setSelectedDistrictDetail(dist.name);
                  setFilterDistrict(dist.name);
                  setSelectedParcel(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <span>{dist.name}</span>
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  {dist.delayed > 0 && (
                    <span className="px-1 py-0.2 bg-rose-500/80 text-white rounded font-bold">
                      {dist.delayed} Delayed
                    </span>
                  )}
                  <span className="px-1 py-0.2 bg-emerald-500/80 text-white rounded font-bold">
                    {dist.onTrack} On Track
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setSelectedDistrictDetail(null);
            setFilterDistrict('ALL');
          }}
          className="shrink-0 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-[11px] font-mono"
        >
          View All
        </button>
      </div>

      {/* Main Filter and Control Toolbar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search box */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Khasra, Village, Project..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Government Project filter - Prominently Displaying Full Govt Project Names */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-hidden max-w-[260px] truncate"
          >
            <option value="ALL">All Govt Projects ({projects.length})</option>
            {projects.map((prj) => (
              <option key={prj.projectId} value={prj.projectId}>
                {prj.name} ({prj.code})
              </option>
            ))}
          </select>

          {/* District filter */}
          <select
            value={filterDistrict}
            onChange={(e) => {
              setFilterDistrict(e.target.value);
              if (e.target.value !== 'ALL') {
                setSelectedDistrictDetail(e.target.value);
              } else {
                setSelectedDistrictDetail(null);
              }
            }}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="ALL">All Districts</option>
            {districtSummaries.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} District ({d.totalParcels} parcels)
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="ALL">All Project Statuses</option>
            <option value="IN_PROGRESS">On Track / In Progress</option>
            <option value="DELAYED">Delayed Parcels</option>
            <option value="DISPUTED">Disputed / High Risk</option>
            <option value="ACQUIRED">Acquired</option>
          </select>

          {/* Land Rates Quick Link Button */}
          <button
            onClick={() => navigate('/land-rates')}
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Land Rates (₹/sq.m, ₹/ac, ₹/ft)</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-600 shrink-0 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> On Track
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Delayed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> High Risk / Disputed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Govt Land
          </span>
        </div>
      </div>

      {/* Main Map Body with Real Leaflet + Interactive Drawers */}
      <div
        className={`relative ${
          isFullscreen
            ? 'fixed inset-2 z-50 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700'
            : heightClass
        } w-full transition-all`}
      >
        {/* Floating Base Map & Feature Controls Toolbar */}
        <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2 pointer-events-auto">
          {/* Base Map Switcher Pill */}
          <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl flex items-center space-x-1 text-xs">
            <button
              onClick={() => {
                setBaseMapLayer('satellite');
                setShowPlaceLabels(false);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                baseMapLayer === 'satellite' && !showPlaceLabels
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Clean High-Resolution Satellite View — No city, district, or village names"
            >
              <Satellite className="w-3.5 h-3.5 text-sky-300" />
              <span>Satellite (No Labels)</span>
            </button>

            <button
              onClick={() => {
                setBaseMapLayer('hybrid');
                setShowPlaceLabels(true);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                baseMapLayer === 'hybrid' || (baseMapLayer === 'satellite' && showPlaceLabels)
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Satellite View with City, District & Village Labels"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>Hybrid (With Labels)</span>
            </button>

            <button
              onClick={() => setBaseMapLayer('streets')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                baseMapLayer === 'streets'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="OpenStreetMap Standard Street Layer"
            >
              <span>Streets</span>
            </button>

            <button
              onClick={() => setBaseMapLayer('topo')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                baseMapLayer === 'topo'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Topographic Elevation & Contours"
            >
              <span>Terrain</span>
            </button>
          </div>

          {/* Quick Feature Toggles Bar */}
          <div className="bg-slate-900/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-700 shadow-xl flex flex-wrap items-center space-x-2 text-[11px] text-slate-200">
            {/* Satellite Engine & Clarity Options */}
            {baseMapLayer === 'satellite' && (
              <>
                {/* Engine Selector: Google vs Esri */}
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  <button
                    onClick={() => setSatelliteProvider('google')}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      satelliteProvider === 'google'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Google Ultra-HD Satellite (Sub-meter 0.3m resolution, highest clarity)"
                  >
                    Google HD
                  </button>
                  <button
                    onClick={() => setSatelliteProvider('esri')}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      satelliteProvider === 'esri'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Esri World Imagery"
                  >
                    Esri
                  </button>
                </div>

                {/* HD Clarity Enhancer Filter Toggle */}
                <button
                  onClick={() => setEnhanceSatelliteClarity(!enhanceSatelliteClarity)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg font-semibold transition-all ${
                    enhanceSatelliteClarity
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-2xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Enhance satellite sharpness and contrast to highlight field boundaries and eliminate haze"
                >
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>HD Sharpness {enhanceSatelliteClarity ? 'ON' : 'OFF'}</span>
                </button>
              </>
            )}

            {/* Satellite Place Names Indicator & Toggle */}
            {(baseMapLayer === 'satellite' || baseMapLayer === 'hybrid') && (
              <button
                onClick={() => {
                  if (showPlaceLabels) {
                    setShowPlaceLabels(false);
                    setBaseMapLayer('satellite');
                  } else {
                    setShowPlaceLabels(true);
                    setBaseMapLayer('hybrid');
                  }
                }}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg font-semibold transition-all ${
                  !showPlaceLabels
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title={
                  showPlaceLabels
                    ? 'Click to hide city, district, and village names'
                    : 'City, district & village names are hidden (Clean Satellite Mode)'
                }
              >
                {!showPlaceLabels ? (
                  <span>🚫 Names Hidden</span>
                ) : (
                  <span>🏷️ Names Shown</span>
                )}
              </button>
            )}

            {/* DGPS Pegs Toggle */}
            <button
              onClick={() => setShowSurveyPegs(!showSurveyPegs)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg font-semibold transition-all ${
                showSurveyPegs
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle DGPS Survey Pegs & Coordinates"
            >
              <Crosshair className="w-3 h-3 text-amber-400" />
              <span>Survey Pegs</span>
            </button>

            {/* Measurement Ruler Tool Toggle */}
            <button
              onClick={() => setShowMeasurementTool(!showMeasurementTool)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg font-semibold transition-all ${
                showMeasurementTool
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Interactive Corridor & Boundary Ruler"
            >
              <Ruler className="w-3 h-3 text-emerald-400" />
              <span>Ruler Tool</span>
            </button>

            {/* Fullscreen Expand Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Full Screen' : 'Expand Full Screen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Measurement Floating Readout */}
          {showMeasurementTool && (
            <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-emerald-500/50 shadow-2xl text-xs text-white space-y-1 w-64 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between font-bold text-emerald-400 border-b border-slate-700 pb-1">
                <span className="flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" /> Corridor Measurement
                </span>
                <span className="text-[10px] text-slate-400 font-mono">DGPS Calibrated</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Row Width</span>
                  <span className="font-bold text-white text-sm">{measuredDistanceMeters} m</span>
                  <span className="text-[10px] text-slate-400 block">
                    ({(measuredDistanceMeters * 3.28084).toFixed(1)} ft)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Survey Area</span>
                  <span className="font-bold text-emerald-300 text-sm">
                    {selectedParcel ? selectedParcel.area : '1.45'} Ha
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ({selectedParcel ? (selectedParcel.area * 2.47105).toFixed(2) : '3.58'} Acres)
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 leading-snug">
                Click any parcel polygon to snap coordinates and verify statutory corridor clearance.
              </p>
            </div>
          )}
        </div>

        <MapContainer
          center={[26.8245, 75.8122]}
          zoom={11}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* Dynamic Base Map Imagery Layers */}
          {baseMapLayer === 'satellite' && (
            <>
              {/* Ultra-Clear High-Resolution Satellite Imagery without city, district, or village names */}
              {satelliteProvider === 'google' ? (
                <TileLayer
                  key={`sat-google-${enhanceSatelliteClarity}`}
                  attribution="&copy; Google Satellite Imagery (High-Definition)"
                  url="https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                  subdomains={['0', '1', '2', '3']}
                  maxZoom={21}
                  maxNativeZoom={20}
                  className={enhanceSatelliteClarity ? 'contrast-[1.08] brightness-[1.02] saturate-[1.12]' : ''}
                />
              ) : (
                <TileLayer
                  key={`sat-esri-${enhanceSatelliteClarity}`}
                  attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={20}
                  maxNativeZoom={18}
                  className={enhanceSatelliteClarity ? 'contrast-[1.08] brightness-[1.02] saturate-[1.12]' : ''}
                />
              )}

              {/* Only render administrative place labels if user explicitly toggled them on */}
              {showPlaceLabels && (
                <TileLayer
                  attribution="&copy; Reference Labels"
                  url="https://mt{s}.google.com/vt/lyrs=h&x={x}&y={y}&z={z}"
                  subdomains={['0', '1', '2', '3']}
                  maxZoom={21}
                  maxNativeZoom={20}
                />
              )}
            </>
          )}

          {baseMapLayer === 'hybrid' && (
            <>
              <TileLayer
                attribution="&copy; Google Satellite Imagery"
                url="https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                subdomains={['0', '1', '2', '3']}
                maxZoom={21}
                maxNativeZoom={20}
              />
            </>
          )}

          {baseMapLayer === 'streets' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}

          {baseMapLayer === 'topo' && (
            <TileLayer
              attribution='Map data &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          )}

          {currentFlyTarget && (
            <MapFlyTo
              targetLat={currentFlyTarget.lat}
              targetLng={currentFlyTarget.lng}
              zoom={currentFlyTarget.zoom}
            />
          )}

          {/* Render All Parcels as Real Interactive GeoJSON Polygons / Markers */}
          {filteredParcels.map((parcel) => {
            const colors = getParcelColor(parcel);
            const isSelected = selectedParcel?.parcelId === parcel.parcelId;
            const isSatellite = baseMapLayer === 'satellite' || baseMapLayer === 'hybrid';

            const polyCoords: [number, number][] = parcel.polygonCoordinates || [
              [parcel.latitude + 0.002, parcel.longitude - 0.002],
              [parcel.latitude + 0.002, parcel.longitude + 0.002],
              [parcel.latitude - 0.002, parcel.longitude + 0.002],
              [parcel.latitude - 0.002, parcel.longitude - 0.002],
            ];

            return (
              <React.Fragment key={parcel.parcelId}>
                {/* Visual Polygon Boundary with high-contrast borders for satellite photography */}
                <Polygon
                  positions={polyCoords}
                  pathOptions={{
                    color: isSelected
                      ? '#38bdf8'
                      : isSatellite
                      ? '#facc15'
                      : colors.stroke,
                    fillColor: colors.fill,
                    fillOpacity: isSelected ? 0.75 : isSatellite ? 0.4 : 0.45,
                    weight: isSelected ? 3.5 : isSatellite ? 2 : 1.5,
                    dashArray: isSatellite && !isSelected ? '4, 4' : undefined,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedParcel(parcel);
                      setSelectedDistrictDetail(null);
                      if (showMeasurementTool) {
                        setMeasuredDistanceMeters(
                          Math.round((parcel.area * 120 + 35) * 10) / 10
                        );
                      }
                    },
                  }}
                />

                {/* Optional DGPS Corner Peg Markers */}
                {showSurveyPegs &&
                  polyCoords.map((coord, idx) => (
                    <CircleMarker
                      key={`peg-${parcel.parcelId}-${idx}`}
                      center={coord}
                      radius={isSelected ? 4.5 : 3}
                      pathOptions={{
                        color: '#0f172a',
                        fillColor: '#38bdf8',
                        fillOpacity: 0.9,
                        weight: 1.5,
                      }}
                    >
                      <Popup>
                        <div className="text-[10px] font-mono p-1">
                          <strong>Peg #{idx + 1}</strong> · {parcel.parcelId}
                          <br />
                          Lat: {coord[0].toFixed(5)}, Lng: {coord[1].toFixed(5)}
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}

                {/* Center Clickable Marker / Circle */}
                <CircleMarker
                  center={[parcel.latitude, parcel.longitude]}
                  radius={isSelected ? 9 : 6}
                  pathOptions={{
                    color: '#ffffff',
                    fillColor: colors.fill,
                    fillOpacity: 1,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedParcel(parcel);
                      setSelectedDistrictDetail(null);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[210px] text-xs space-y-1">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{parcel.parcelId}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            parcel.riskLevel === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : parcel.riskLevel === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {parcel.riskLevel}
                        </span>
                      </div>
                      {baseMapLayer === 'satellite' && !showPlaceLabels ? (
                        <p className="text-slate-600">
                          Khasra: <strong>{parcel.khasraNumber}</strong> · Area: <strong>{parcel.area} Ha</strong> ({(parcel.area * 2.47105).toFixed(2)} Ac)
                        </p>
                      ) : (
                        <p className="text-slate-600">
                          Khasra: <strong>{parcel.khasraNumber}</strong> · {parcel.village} ({parcel.district})
                        </p>
                      )}
                      <p className="text-slate-500 text-[11px] truncate">
                        Project: {parcel.project}
                      </p>
                      <p className="text-blue-700 font-semibold">
                        Stage: {parcel.currentStage}
                      </p>
                      <div className="grid grid-cols-2 gap-1 pt-1">
                        <button
                          onClick={() => {
                            setSelectedParcel(parcel);
                            setSelectedDistrictDetail(null);
                          }}
                          className="py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold"
                        >
                          Inspect Parcel
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDistrictDetail(parcel.district);
                            setSelectedParcel(null);
                          }}
                          className="py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-bold"
                        >
                          {baseMapLayer === 'satellite' && !showPlaceLabels ? 'SLA Summary' : 'District Status'}
                        </button>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Clean Satellite Mode Indicator Pill */}
        {baseMapLayer === 'satellite' && !showPlaceLabels && (
          <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 flex items-center space-x-2 shadow-lg pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">
              {satelliteProvider === 'google' ? 'Google 0.3m Ultra-HD Satellite' : 'Esri Clarity Satellite'}
            </span>
            <span className="text-slate-400">• Names Hidden</span>
            {enhanceSatelliteClarity && (
              <span className="text-cyan-300 font-medium bg-cyan-950/70 border border-cyan-800/80 px-1.5 py-0.2 rounded text-[10px]">
                ✨ Sharpness ON
              </span>
            )}
          </div>
        )}

        {/* DISTRICT INTELLIGENCE & ACQUISITION STATUS DRAWER */}
        {activeDistrictInfo && (
          <div className="absolute top-3 right-3 bottom-3 w-88 sm:w-[420px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 z-[1000] flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <h3 className="font-extrabold text-base tracking-tight">
                    {activeDistrictInfo.district} District Intelligence
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rajasthan · Total Land: {activeDistrictInfo.totalAreaHa} Ha ({activeDistrictInfo.totalParcels} Parcels)
                </p>
              </div>
              <button
                onClick={() => setSelectedDistrictDetail(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Quick Status KPI Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[10px] text-rose-700 font-bold uppercase block">Delayed Cases</span>
                  <span className="font-mono text-xl font-extrabold text-rose-700">
                    {activeDistrictInfo.delayedParcels.length}
                  </span>
                  <span className="text-[10px] text-rose-600 block mt-0.5">Projects Stuck</span>
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">On Track</span>
                  <span className="font-mono text-xl font-extrabold text-emerald-700">
                    {activeDistrictInfo.onTrackParcels.length}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">SLA Compliant</span>
                </div>

                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl">
                  <span className="text-[10px] text-purple-700 font-bold uppercase block">Disputed</span>
                  <span className="font-mono text-xl font-extrabold text-purple-700">
                    {activeDistrictInfo.disputedParcels.length}
                  </span>
                  <span className="text-[10px] text-purple-600 block mt-0.5">Court Stays</span>
                </div>
              </div>

              {/* 1. DELAYED PROJECTS IN THIS DISTRICT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Delayed Govt Projects in {activeDistrictInfo.district}</span>
                  </span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {activeDistrictInfo.delayedProjects.length} Projects Impacted
                  </span>
                </div>

                {activeDistrictInfo.delayedProjects.length === 0 ? (
                  <p className="text-slate-400 italic p-3 bg-slate-50 rounded-xl text-center">
                    No delayed projects in this district. All cases within SLA.
                  </p>
                ) : (
                  activeDistrictInfo.delayedProjects.map((prj) => {
                    const prjDelayedParcels = activeDistrictInfo.delayedParcels.filter(
                      (p) => p.projectId === prj.projectId
                    );
                    const maxDelay = Math.max(...prjDelayedParcels.map((p) => p.delayDays), 0);

                    return (
                      <div
                        key={prj.projectId}
                        className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5 hover:border-rose-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-xs leading-snug">{prj.name}</h4>
                          <span className="font-mono text-[10px] bg-rose-200 text-rose-800 font-extrabold px-1.5 py-0.5 rounded shrink-0">
                            +{maxDelay}d delay
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                          <span>
                            Code: <strong className="font-mono">{prj.code}</strong>
                          </span>
                          <span>
                            Parcels Delayed: <strong>{prjDelayedParcels.length}</strong>
                          </span>
                          <span>
                            Target: <strong className="font-mono">{prj.targetCompletionDate}</strong>
                          </span>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] text-rose-700 font-medium">
                            Bottleneck: {prjDelayedParcels[0]?.currentStage || 'Objection Scrutiny'}
                          </span>
                          <button
                            onClick={() => {
                              setFilterProject(prj.projectId);
                              setFilterStatus('DELAYED');
                              setSelectedDistrictDetail(null);
                            }}
                            className="text-[10px] font-bold text-blue-700 hover:underline flex items-center gap-0.5"
                          >
                            <span>Filter on Map</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 2. ON-TRACK PROJECTS IN THIS DISTRICT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>On-Track Projects in {activeDistrictInfo.district}</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {activeDistrictInfo.onTrackProjects.length} Projects Moving
                  </span>
                </div>

                {activeDistrictInfo.onTrackProjects.length === 0 ? (
                  <p className="text-slate-400 italic p-3 bg-slate-50 rounded-xl text-center">
                    All current projects in this district are undergoing reviews.
                  </p>
                ) : (
                  activeDistrictInfo.onTrackProjects.map((prj) => (
                    <div
                      key={prj.projectId}
                      className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">{prj.name}</h4>
                        <span className="font-mono text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded shrink-0">
                          {Math.round((prj.acquiredParcels / (prj.totalParcels || 1)) * 100)}% Acquired
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex justify-between">
                        <span>Target: {prj.targetCompletionDate}</span>
                        <span className="font-mono font-bold text-slate-800">
                          Budget: ₹{prj.budgetCr} Cr
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 3. OFFICIAL LAND PRICE BENCHMARKS FOR EVERY DISTRICT AND CITY */}
              {activeDistrictInfo.rateData && (
                <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{activeDistrictInfo.district} DLC Land Rates (meter/sq, fit, acre)</span>
                    </span>
                    <button
                      onClick={() => navigate('/land-rates')}
                      className="text-[10px] text-blue-700 font-bold hover:underline"
                    >
                      Full Registry →
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Official benchmark rates used for Solatium and statutory award computation under RFCTLARR 2013:
                  </p>

                  <div className="space-y-2">
                    {activeDistrictInfo.rateData.cities.map((city, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-900">{city.cityName}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                            {city.category}
                          </span>
                        </div>

                        {/* Multi-unit rates row */}
                        <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-1 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400 block">₹ / Sq.M</span>
                            <span className="font-mono font-bold text-slate-900">
                              ₹{city.ratePerSqMeter.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">₹ / Sq.Ft</span>
                            <span className="font-mono font-bold text-slate-700">
                              ₹{city.ratePerSqFoot.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">₹ / Acre</span>
                            <span className="font-mono font-bold text-indigo-700">
                              ₹{(city.ratePerAcre / 100000).toFixed(1)} L
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">₹ / Bigha</span>
                            <span className="font-mono font-bold text-emerald-700">
                              ₹{(city.ratePerBigha / 100000).toFixed(1)} L
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Actions */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setFilterDistrict(activeDistrictInfo.district);
                  navigate(`/cases?district=${activeDistrictInfo.district}`);
                }}
                className="flex-1 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold text-center transition-colors"
              >
                View All {activeDistrictInfo.district} Cases ({activeDistrictInfo.totalParcels})
              </button>
              <button
                onClick={() => navigate('/land-rates')}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Award</span>
              </button>
            </div>
          </div>
        )}

        {/* Selected Parcel Slide-Over Inspection Drawer */}
        {selectedParcel && (
          <div className="absolute top-3 right-3 bottom-3 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 z-[1000] flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base text-slate-900 font-mono">
                    PARCEL {selectedParcel.parcelId}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      selectedParcel.riskLevel === 'HIGH'
                        ? 'bg-red-100 text-red-700'
                        : selectedParcel.riskLevel === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {selectedParcel.riskLevel} RISK
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Khasra: {selectedParcel.khasraNumber}</p>
              </div>
              <button
                onClick={() => setSelectedParcel(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Star Banner on P-1024 */}
              {selectedParcel.parcelId === 'P-1024' && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                  <span className="font-bold text-amber-900 block flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Document Mismatch Flagged (2.40 ha vs 2.10 ha)
                  </span>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Deed states 2.40 Ha while State Revenue Portal records 2.10 Ha. Requires administrative reconciliation.
                  </p>
                </div>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Project</span>
                  <span className="font-bold text-slate-900 truncate block">{selectedParcel.project}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                  <span className="font-bold text-slate-900">
                    {selectedParcel.village}, {selectedParcel.district}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Area</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedParcel.area} Ha ({(selectedParcel.area * 2.471).toFixed(2)} Acres)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ownership</span>
                  <span className="font-bold text-slate-900">{selectedParcel.ownerType}</span>
                </div>
              </div>

              {/* Progress & Current Stage */}
              <div className="space-y-1.5 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Acquisition Progress</span>
                  <span className="font-mono font-bold text-blue-700">{selectedParcel.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${selectedParcel.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                  <span>Current: <strong>{selectedParcel.currentStage}</strong></span>
                  {selectedParcel.delayDays > 0 ? (
                    <span className="text-orange-600 font-bold">+{selectedParcel.delayDays}d overdue</span>
                  ) : (
                    <span className="text-emerald-600 font-bold">On Schedule</span>
                  )}
                </div>
              </div>

              {/* Custody Information */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">File Custodian</span>
                <p className="font-bold text-slate-800 text-xs">{selectedParcel.currentOfficer}</p>
                <p className="text-[11px] text-slate-500">{selectedParcel.currentDepartment}</p>
              </div>

              {/* Link to District Intelligence */}
              <button
                onClick={() => {
                  setSelectedDistrictDetail(selectedParcel.district);
                  setSelectedParcel(null);
                }}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Inspect {selectedParcel.district} District Projects & Land Rates</span>
              </button>
            </div>

            {/* Drawer Action Button */}
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => navigate(`/cases/${selectedParcel.parcelId}`)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <span>Open Full Dossier (Audit & Workflow)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
