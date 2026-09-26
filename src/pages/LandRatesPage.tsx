import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  Search,
  Calculator,
  Download,
  Info,
  Building,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Scale,
  RefreshCw,
} from 'lucide-react';
import {
  DISTRICT_LAND_RATES,
  AREA_CONVERSION_TO_SQM,
  UNIT_LABELS,
  AreaUnit,
  convertAreaToAll,
  calculateRfctlarrAward,
} from '../data/districtLandRates';
import { LandCategory } from '../types';

export const LandRatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculator State
  const [calcDistrict, setCalcDistrict] = useState<string>('Jaipur');
  const [calcCityIndex, setCalcCityIndex] = useState<number>(0);
  const [calcAreaValue, setCalcAreaValue] = useState<number>(2.5);
  const [calcAreaUnit, setCalcAreaUnit] = useState<AreaUnit>('acre');
  const [calcElapsedMonths, setCalcElapsedMonths] = useState<number>(12);

  // Available cities for the calculator
  const activeDistrictData = useMemo(() => {
    return (
      DISTRICT_LAND_RATES.find((d) => d.district === calcDistrict) || DISTRICT_LAND_RATES[0]
    );
  }, [calcDistrict]);

  const activeCityRate = useMemo(() => {
    return activeDistrictData.cities[calcCityIndex] || activeDistrictData.cities[0];
  }, [activeDistrictData, calcCityIndex]);

  // Dynamic Calculator Conversions
  const convertedAreas = useMemo(() => {
    return convertAreaToAll(calcAreaValue, calcAreaUnit);
  }, [calcAreaValue, calcAreaUnit]);

  // Compensation breakdown under RFCTLARR Act 2013
  const compensationAward = useMemo(() => {
    return calculateRfctlarrAward(
      convertedAreas.sqMeter,
      activeCityRate.ratePerSqMeter,
      activeDistrictData.rfctlarrRuralMultiplier,
      calcElapsedMonths
    );
  }, [convertedAreas.sqMeter, activeCityRate, activeDistrictData, calcElapsedMonths]);

  // Flat list of all city rates for the searchable table
  const allCityRates = useMemo(() => {
    const list: Array<{
      district: string;
      state: string;
      cityName: string;
      tehsil: string;
      category: LandCategory;
      ratePerSqMeter: number;
      ratePerSqFoot: number;
      ratePerAcre: number;
      ratePerHectare: number;
      ratePerBigha: number;
      ratePerGaj: number;
      marketRateMultiplier: number;
      lastUpdated: string;
      dlcNotificationNo: string;
    }> = [];

    DISTRICT_LAND_RATES.forEach((d) => {
      d.cities.forEach((c) => {
        list.push({
          district: d.district,
          state: d.state,
          ...c,
        });
      });
    });

    return list.filter((item) => {
      if (selectedDistrict !== 'ALL' && item.district !== selectedDistrict) return false;
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.district.toLowerCase().includes(q) ||
          item.cityName.toLowerCase().includes(q) ||
          item.tehsil.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.dlcNotificationNo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedDistrict, selectedCategory, searchQuery]);

  const handleExportRatesCSV = () => {
    const headers = [
      'District',
      'City / Tehsil',
      'Tehsil',
      'Land Category',
      'Rate Per Sq Meter (INR)',
      'Rate Per Sq Foot (INR)',
      'Rate Per Acre (INR)',
      'Rate Per Hectare (INR)',
      'Rate Per Bigha (INR)',
      'Rate Per Gaj / Sq Yard (INR)',
      'Market Multiplier',
      'DLC Notification No',
      'Last Revision Date',
    ];

    const rows = allCityRates.map((r) => [
      `"${r.district}"`,
      `"${r.cityName}"`,
      `"${r.tehsil}"`,
      `"${r.category}"`,
      r.ratePerSqMeter,
      r.ratePerSqFoot,
      r.ratePerAcre,
      r.ratePerHectare,
      r.ratePerBigha,
      r.ratePerGaj,
      r.marketRateMultiplier,
      `"${r.dlcNotificationNo}"`,
      `"${r.lastUpdated}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `official_district_dlc_land_rates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
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
          <span className="font-bold text-slate-800">District DLC Land Rates</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View on Map →</span>
          </button>
        </div>
      </div>

      {/* Page Title & Mission Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Coins className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              District Land Price & Valuation Intelligence Registry
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative Government DLC (District Level Committee) / Circle Rates & Statutory Land Acquisition Multi-Unit Converter.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportRatesCSV}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export District Rates CSV</span>
          </button>
        </div>
      </div>

      {/* Multi-Unit Valuation & Compensation Estimator Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                Statutory Land Valuation & Compensation Estimator
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              RFCTLARR Act 2013 Compliant: Instant conversion across Sq.M, Sq.Ft, Acre, Hectare & Bigha with Solatium.
            </p>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 bg-white/10 rounded-full border border-white/20 text-slate-200">
            Govt Circular: Sec 26 to Sec 30 Compliance
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            {/* District Selector */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">1. Select District</label>
              <select
                value={calcDistrict}
                onChange={(e) => {
                  setCalcDistrict(e.target.value);
                  setCalcCityIndex(0);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                {DISTRICT_LAND_RATES.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district} District ({d.cities.length} Land Belts)
                  </option>
                ))}
              </select>
            </div>

            {/* City / Tehsil & Category Selector */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">2. Select City / Tehsil / Zone</label>
              <select
                value={calcCityIndex}
                onChange={(e) => setCalcCityIndex(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                {activeDistrictData.cities.map((city, idx) => (
                  <option key={idx} value={idx}>
                    {city.cityName} — {city.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Land Area Input and Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">3. Enter Land Area</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.05"
                  value={calcAreaValue}
                  onChange={(e) => setCalcAreaValue(Math.max(0.001, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Input Unit</label>
                <select
                  value={calcAreaUnit}
                  onChange={(e) => setCalcAreaUnit(e.target.value as AreaUnit)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-semibold focus:outline-hidden"
                >
                  <option value="acre">Acres (ac)</option>
                  <option value="hectare">Hectares (ha)</option>
                  <option value="bigha">Pucca Bigha (बीघा)</option>
                  <option value="sqMeter">Square Meters (m²)</option>
                  <option value="sqFoot">Square Feet (ft²)</option>
                  <option value="gaj">Gaj / Sq.Yard (गज)</option>
                </select>
              </div>
            </div>

            {/* Elapsed Months for Statutory 12% Interest */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">
                  Elapsed Time from Section 11 Notification:
                </label>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {calcElapsedMonths} Months
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="36"
                step="1"
                value={calcElapsedMonths}
                onChange={(e) => setCalcElapsedMonths(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">
                Statutory interest @ 12% p.a under Section 30(3) of RFCTLARR Act 2013
              </span>
            </div>

            {/* Selected Zone Benchmark Pill */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Official DLC Notification:</span>
              <p className="font-mono font-bold text-slate-800">{activeCityRate.dlcNotificationNo}</p>
              <p className="text-[11px] text-slate-500">
                Market Multiplier: <strong>{activeCityRate.marketRateMultiplier}x</strong> · Rural Multiplier:{' '}
                <strong>{activeDistrictData.rfctlarrRuralMultiplier}x</strong>
              </p>
            </div>
          </div>

          {/* Real-time Multi-Unit Conversion & Award Breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50/80 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-5">
            {/* Unit Conversion Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  Real-time Equivalent Area in All Standard Units
                </span>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  Synchronized
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Square Meters</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {convertedAreas.sqMeter.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                  </span>
                  <span className="text-[10px] text-slate-400 block">m²</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Square Feet</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {convertedAreas.sqFoot.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-[10px] text-slate-400 block">ft²</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Acres</span>
                  <span className="font-mono font-bold text-indigo-700 text-xs">
                    {convertedAreas.acre.toFixed(3)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">acres</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hectares</span>
                  <span className="font-mono font-bold text-blue-700 text-xs">
                    {convertedAreas.hectare.toFixed(4)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">ha</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pucca Bigha</span>
                  <span className="font-mono font-bold text-emerald-700 text-xs">
                    {convertedAreas.bigha.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">बीघा</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Square Yard (Gaj)</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {convertedAreas.gaj.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-[10px] text-slate-400 block">वर्ग गज</span>
                </div>
              </div>
            </div>

            {/* Applicable Benchmark Rates for Selected Land */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Official Benchmark DLC Rates for {activeCityRate.cityName}:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Rate per Sq. Meter</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{activeCityRate.ratePerSqMeter.toLocaleString('en-IN')}/m²
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rate per Sq. Foot</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{activeCityRate.ratePerSqFoot.toLocaleString('en-IN')}/ft²
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rate per Acre</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{(activeCityRate.ratePerAcre / 100000).toFixed(2)} Lakhs/ac
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rate per Bigha</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{(activeCityRate.ratePerBigha / 100000).toFixed(2)} Lakhs/बीघा
                  </span>
                </div>
              </div>
            </div>

            {/* Compensation Award Breakdown */}
            <div className="bg-emerald-950 text-white p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Statutory Acquisition Award (Sec 30 RFCTLARR 2013)
                </span>
                <span className="text-[10px] bg-emerald-800 text-emerald-100 font-mono px-2 py-0.5 rounded">
                  Official Estimation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-b border-emerald-800/80 pb-3">
                <div>
                  <span className="text-emerald-400 text-[10px] block">Base Market Value (w/ factor)</span>
                  <span className="font-mono font-bold text-sm">
                    ₹{(compensationAward.marketValueWithMultiplier / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <div>
                  <span className="text-emerald-400 text-[10px] block">+ 100% Solatium (Mandatory)</span>
                  <span className="font-mono font-bold text-sm">
                    ₹{(compensationAward.solatium / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <div>
                  <span className="text-emerald-400 text-[10px] block">+ 12% Statutory Interest</span>
                  <span className="font-mono font-bold text-sm">
                    ₹{(compensationAward.additionalInterest / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-xs text-emerald-300 block">Total Statutory Compensation Payable:</span>
                  <span className="text-[10px] text-emerald-400">
                    Payable via Direct Benefit Transfer (DBT) to landholders
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold font-mono text-emerald-300">
                    ₹{(compensationAward.totalAward / 10000000).toFixed(3)} Cr
                  </span>
                  <span className="text-[11px] text-emerald-200 block font-mono">
                    (₹{(compensationAward.totalAward / 100000).toFixed(2)} Lakhs)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive District & City Land Rate Registry Table */}
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-xs">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search District, City, Tehsil, DLC code..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* District filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="ALL">All Districts ({DISTRICT_LAND_RATES.length})</option>
              {DISTRICT_LAND_RATES.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district} District
                </option>
              ))}
            </select>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="ALL">All Land Categories</option>
              <option value="Agricultural (Irrigated / Chahi)">Agricultural (Irrigated / Chahi)</option>
              <option value="Agricultural (Unirrigated / Barani)">Agricultural (Unirrigated / Barani)</option>
              <option value="Residential Urban">Residential Urban</option>
              <option value="Residential Suburban / Rural">Residential Suburban / Rural</option>
              <option value="Commercial (Highway / Main Road)">Commercial (Highway / Main Road)</option>
              <option value="Industrial (RIICO / SEZ Corridor)">Industrial (RIICO / SEZ Corridor)</option>
            </select>
          </div>

          <span className="font-mono text-slate-500 shrink-0 font-semibold">
            Showing {allCityRates.length} Official Land Valuation Zones
          </span>
        </div>

        {/* Master Registry Table with meter\sq, fit\acre, and other units */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">District & City / Tehsil</th>
                  <th className="py-3.5 px-4">Land Category</th>
                  <th className="py-3.5 px-4 text-right">₹ / Sq. Meter</th>
                  <th className="py-3.5 px-4 text-right">₹ / Sq. Foot</th>
                  <th className="py-3.5 px-4 text-right">₹ / Acre</th>
                  <th className="py-3.5 px-4 text-right">₹ / Hectare</th>
                  <th className="py-3.5 px-4 text-right">₹ / Bigha</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allCityRates.map((rate, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{rate.district}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 block pl-5 font-medium">
                        {rate.cityName}
                      </span>
                      <span className="text-[10px] text-slate-400 pl-5 font-mono">
                        Tehsil: {rate.tehsil} · {rate.dlcNotificationNo}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          rate.category.includes('Agricultural')
                            ? 'bg-emerald-100 text-emerald-800'
                            : rate.category.includes('Commercial')
                            ? 'bg-purple-100 text-purple-800'
                            : rate.category.includes('Industrial')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rate.category}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Market: {rate.marketRateMultiplier}x DLC
                      </span>
                    </td>

                    {/* ₹ / Sq. Meter */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{rate.ratePerSqMeter.toLocaleString('en-IN')}
                    </td>

                    {/* ₹ / Sq. Foot */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                      ₹{rate.ratePerSqFoot.toLocaleString('en-IN')}
                    </td>

                    {/* ₹ / Acre */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700">
                      ₹{(rate.ratePerAcre / 100000).toFixed(2)} L
                    </td>

                    {/* ₹ / Hectare */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      ₹{(rate.ratePerHectare / 100000).toFixed(2)} L
                    </td>

                    {/* ₹ / Bigha */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      ₹{(rate.ratePerBigha / 100000).toFixed(2)} L
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setCalcDistrict(rate.district);
                          const cityIdx = activeDistrictData.cities.findIndex(
                            (c) => c.cityName === rate.cityName
                          );
                          if (cityIdx !== -1) setCalcCityIndex(cityIdx);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Calculate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
