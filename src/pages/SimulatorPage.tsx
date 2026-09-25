import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, RotateCcw, AlertCircle, TrendingUp, Calendar, Layers, ShieldAlert } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const { parcels } = useApp();

  // Simulation slider states
  const [legalDelayIncrease, setLegalDelayIncrease] = useState<number>(20); // 20%
  const [mismatchRateIncrease, setMismatchRateIncrease] = useState<number>(15); // 15%
  const [financeWorkloadIncrease, setFinanceWorkloadIncrease] = useState<number>(25); // 25%
  const [surveySlowdown, setSurveySlowdown] = useState<number>(10); // 10% slowdown

  // Baseline metrics
  const baselineMonths = 8.4;
  const baselineParcelsAffected = 18;

  // Dynamic simulation calculations
  const simulatedMonths = Number(
    (
      baselineMonths *
      (1 +
        (legalDelayIncrease * 0.004 +
          mismatchRateIncrease * 0.0035 +
          financeWorkloadIncrease * 0.003 +
          surveySlowdown * 0.0025))
    ).toFixed(1)
  );

  const additionalParcelsAffected = Math.round(
    legalDelayIncrease * 0.8 +
      mismatchRateIncrease * 1.2 +
      financeWorkloadIncrease * 0.6 +
      surveySlowdown * 0.5
  );

  const totalSimulatedAffected = baselineParcelsAffected + additionalParcelsAffected;
  const estimatedCostEscalationCr = Number(((simulatedMonths - baselineMonths) * 4.2).toFixed(2));

  const resetSliders = () => {
    setLegalDelayIncrease(0);
    setMismatchRateIncrease(0);
    setFinanceWorkloadIncrease(0);
    setSurveySlowdown(0);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              ACQUISITION SCENARIO SIMULATOR
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate downstream timeline elasticity and financial exposure under variable regulatory friction.
          </p>
        </div>

        <button
          onClick={resetSliders}
          className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Mandatory Prototype Label */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start space-x-2.5">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong>Notice:</strong> These figures are prototype simulation estimates computed for decision-modeling
          demonstrations and do not constitute official statutory forecasts.
        </p>
      </div>

      {/* Results Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Baseline vs Simulated Timeline */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">Projected Completion Timeline</span>
          <div className="flex items-baseline space-x-3 my-2">
            <div>
              <span className="text-xs text-slate-400 block">Baseline</span>
              <span className="text-2xl font-extrabold text-slate-700 font-mono">{baselineMonths}</span>
              <span className="text-xs text-slate-500"> mos</span>
            </div>
            <span className="text-xl font-bold text-slate-300">→</span>
            <div>
              <span className="text-xs text-rose-500 font-semibold block">Simulated</span>
              <span className="text-3xl font-extrabold text-rose-600 font-mono">{simulatedMonths}</span>
              <span className="text-xs text-rose-600 font-bold"> mos</span>
            </div>
          </div>
          <div className="text-[11px] text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded">
            +{((simulatedMonths - baselineMonths)).toFixed(1)} months delay drift
          </div>
        </div>

        {/* Affected Parcels */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">Affected Land Parcels</span>
          <div className="flex items-baseline space-x-3 my-2">
            <div>
              <span className="text-xs text-slate-400 block">Current Delayed</span>
              <span className="text-2xl font-extrabold text-slate-700 font-mono">{baselineParcelsAffected}</span>
            </div>
            <span className="text-xl font-bold text-slate-300">→</span>
            <div>
              <span className="text-xs text-orange-600 font-semibold block">Simulated Stall</span>
              <span className="text-3xl font-extrabold text-orange-600 font-mono">{totalSimulatedAffected}</span>
            </div>
          </div>
          <div className="text-[11px] text-orange-700 font-semibold bg-orange-50 px-2.5 py-1 rounded">
            +{additionalParcelsAffected} additional parcels falling out of SLA
          </div>
        </div>

        {/* Cost Escalation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Cost Drift Exposure</span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              ₹{estimatedCostEscalationCr} Cr
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">
              Idle capital & compounding statutory interest (Sec 30 RFCTLARR)
            </span>
          </div>
          <div className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded">
            Approx ₹{((estimatedCostEscalationCr / simulatedMonths) * 100).toFixed(0)} Lakhs / month
          </div>
        </div>
      </div>

      {/* Interactive Sliders Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900">Simulation Variables & Friction Factors</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Slider 1: Legal delays */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">Increase Legal & Dispute Review Delays</span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                +{legalDelayIncrease}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={legalDelayIncrease}
              onChange={(e) => setLegalDelayIncrease(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Simulates High Court stay filings and Section 15 objection scrutiny backlogs.
            </p>
          </div>

          {/* Slider 2: Document mismatch cases */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">Increase Document Mismatch Incidents</span>
              <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                +{mismatchRateIncrease}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={mismatchRateIncrease}
              onChange={(e) => setMismatchRateIncrease(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Simulates physical deed vs revenue database discrepancies requiring field re-examinations.
            </p>
          </div>

          {/* Slider 3: Finance Workload */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">Increase Finance & Treasury Approval Load</span>
              <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                +{financeWorkloadIncrease}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={financeWorkloadIncrease}
              onChange={(e) => setFinanceWorkloadIncrease(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Simulates Treasury escrow verification bottlenecks and solatium calculation auditing.
            </p>
          </div>

          {/* Slider 4: Survey completion slowdown */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">Survey Cadastral Slowdown (Monsoon / Inundation)</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                +{surveySlowdown}% delay
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={surveySlowdown}
              onChange={(e) => setSurveySlowdown(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Simulates adverse terrain, missing boundary stones, and DGPS triangulation retakes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
