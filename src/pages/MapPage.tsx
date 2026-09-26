import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AcquisitionMapComponent } from '../components/map/AcquisitionMapComponent';
import { MapPin, Info, Compass, ShieldCheck, ArrowLeft, LayoutDashboard, FileSpreadsheet } from 'lucide-react';

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parcelIdParam = searchParams.get('parcelId') || 'P-1024';

  return (
    <div className="p-4 lg:p-8 space-y-4 max-w-7xl mx-auto">
      {/* Quick Navigation Breadcrumb & Back Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg font-bold border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Command Center</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-medium hidden sm:inline">GIS Mapping</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="font-bold text-slate-800">Acquisition Map</span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/cases"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Land Cases List →</span>
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Interactive Cadastral GIS Acquisition Map
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial land acquisition visualization with boundary polygons, live stage coloring, and inspection drawer.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg shadow-2xs font-semibold">
            <span>District DLC Rates: meter/sq, fit, acre</span>
          </span>
          <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs font-mono">
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            Corridor GIS Active
          </span>
        </div>
      </div>

      {/* Real Interactive Map Component with 700px viewport */}
      <AcquisitionMapComponent initialSelectedParcelId={parcelIdParam} heightClass="h-[720px]" />
    </div>
  );
};
