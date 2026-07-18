import React from 'react';
import type { AyurWellResponse } from '../../types/api';
import { ShieldCheck, Crosshair, AlertCircle, AlertTriangle, Wind, Info } from 'lucide-react';

interface ClinicalCardsProps {
  data: AyurWellResponse;
}

export default function ClinicalCards({ data }: ClinicalCardsProps) {
  const { prediction, confidence, reasoning, safety, dosha, llm } = data;
  
  // Calculate width for confidence bar
  const confidencePercent = Math.min(100, Math.max(0, confidence.score));
  
  // Determine color based on confidence
  let confColor = 'bg-emerald-500';
  if (confidencePercent < 50) confColor = 'bg-red-500';
  else if (confidencePercent < 75) confColor = 'bg-amber-500';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-colors">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-ayur-600 dark:text-ayur-500 h-5 w-5" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Diagnostic Prediction</h3>
        </div>
        <div className="text-xs font-medium bg-ayur-100 dark:bg-ayur-900/40 text-ayur-700 dark:text-ayur-400 px-2.5 py-1 rounded-full">
          {prediction.candidates_considered} Candidates Evaluated
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        
        {/* Top Disease */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Primary Match</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{prediction.disease_name}</h2>
            <div className="flex gap-2 mt-2">
              <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">ID: {prediction.disease_id}</span>
              {prediction.top_candidates.length > 1 && (
                <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                  Alts: {prediction.top_candidates.slice(1).join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Confidence Visualization */}
          <div className="w-full md:w-64 flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confidence</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{confidencePercent.toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${confColor} transition-all duration-1000 ease-out`} 
                style={{ width: `${confidencePercent}%` }} 
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-400 mt-1">
              <span>{confidence.level} Level</span>
              {confidence.breakdown?.evidence_completeness !== undefined && (
                <span>Ev. Completeness: {Math.round(confidence.breakdown.evidence_completeness * 100)}%</span>
              )}
            </div>
          </div>
        </div>

        {/* Reasoning Trace */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {/* Positive Matches */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <Crosshair className="text-emerald-500 h-4 w-4" />
              <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Positive Matches</h4>
            </div>
            <div className="flex flex-wrap gap-2 flex-grow content-start">
              {reasoning.matched_symptoms?.length > 0 ? (
                reasoning.matched_symptoms.map((s, i) => (
                  <span key={i} className="text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/50">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500">No core symptoms matched.</span>
              )}
            </div>
          </div>
          
          {/* Denied / Contradictions */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500 h-4 w-4" />
              <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Denied Symptoms</h4>
            </div>
            <div className="flex flex-wrap gap-2 flex-grow content-start">
              {data.explanation?.explicit_negatives?.length > 0 ? (
                data.explanation.explicit_negatives.map((s, i) => (
                  <span key={i} className="text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-md border border-red-200 dark:border-red-800/50">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500">No explicitly denied symptoms.</span>
              )}
            </div>
          </div>

          {/* Missing/Unknown */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="text-amber-500 h-4 w-4" />
              <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Unknown/Missing</h4>
            </div>
            <div className="flex flex-wrap gap-2 flex-grow content-start">
              {data.explanation?.unknown_symptoms?.length > 0 || reasoning.missing_symptoms?.length > 0 ? (
                <>
                  {data.explanation?.unknown_symptoms?.map((s, i) => (
                    <span key={`unk-${i}`} className="text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800/50">
                      {s} ?
                    </span>
                  ))}
                  {reasoning.missing_symptoms?.slice(0, 5).map((s, i) => (
                    <span key={`miss-${i}`} className="text-xs font-medium bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm">
                      {s}
                    </span>
                  ))}
                </>
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500">Provide more symptoms.</span>
              )}
            </div>
          </div>
        </div>

        {/* Dosha & Safety & Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
           <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
             <div className="flex items-center gap-2">
               <Wind className="text-purple-500 h-4 w-4" />
               <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Dosha Imbalance</h4>
             </div>
             <p className="text-sm text-slate-600 dark:text-slate-400">{dosha?.notes || "Insufficient evidence"}</p>
           </div>
           
           <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
             <div className="flex items-center gap-2">
               {safety?.is_emergency ? <AlertTriangle className="text-red-500 h-4 w-4" /> : <ShieldCheck className="text-emerald-500 h-4 w-4" />}
               <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Safety Status</h4>
             </div>
             {safety?.is_emergency ? (
               <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 font-medium">
                 {safety.reasons.map((r, i) => <li key={i}>{r}</li>)}
               </ul>
             ) : (
               <p className="text-sm text-slate-600 dark:text-slate-400">No emergency red-flags detected.</p>
             )}
           </div>
        </div>

        {/* Clinical Explanation */}
        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
           <div className="flex items-center gap-2 mb-2">
             <Info className="text-blue-500 dark:text-blue-400 h-4 w-4" />
             <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-300">Clinical Explanation Engine</h4>
           </div>
           <p className="text-sm text-blue-800 dark:text-blue-200/80 leading-relaxed">
             {llm?.text || "No explanation available."}
           </p>
        </div>

      </div>
    </div>
  );
}
