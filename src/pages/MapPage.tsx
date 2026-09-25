import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AcquisitionMapComponent } from '../components/map/AcquisitionMapComponent';
import { MapPin, Info, Compass, ShieldCheck } from 'lucide-react';

export const MapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const parcelIdParam = searchParams.get('parcelId') || 'P-1024';

  return (
    <div className="p-4 lg:p-8 space-y-4 max-w-7xl mx-auto">
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
