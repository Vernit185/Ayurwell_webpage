import React, { useState } from 'react';
import type { EvidenceData, TreatmentData } from '../../types/api';
import { BookOpen, Leaf, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface EvidenceViewerProps {
  evidence: EvidenceData;
  treatments: TreatmentData;
}

export default function EvidenceViewer({ evidence, treatments }: EvidenceViewerProps) {
  const [activeTab, setActiveTab] = useState<'evidence' | 'treatment'>('treatment');
  const [expandedSource, setExpandedSource] = useState<number>(0);

  return (
    <div className="bg-white dark:bg-ayur-900 border border-slate-200 dark:border-ayur-800 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[400px]">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-ayur-800 bg-slate-50 dark:bg-ayur-950">
        <button 
          onClick={() => setActiveTab('treatment')}
          role="tab"
          aria-selected={activeTab === 'treatment'}
          aria-controls="panel-treatment"
          className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ayur-500 ${activeTab === 'treatment' ? 'bg-white dark:bg-ayur-900 text-ayur-700 dark:text-ayur-300 border-b-2 border-ayur-600 dark:border-ayur-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
          <Leaf size={16} aria-hidden="true" /> Treatment Protocols
        </button>
        <button 
          onClick={() => setActiveTab('evidence')}
          role="tab"
          aria-selected={activeTab === 'evidence'}
          aria-controls="panel-evidence"
          className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ayur-500 ${activeTab === 'evidence' ? 'bg-white dark:bg-ayur-900 text-ayur-700 dark:text-ayur-300 border-b-2 border-ayur-600 dark:border-ayur-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
          <BookOpen size={16} aria-hidden="true" /> Government Evidence
        </button>
      </div>

      <div className="p-6 overflow-y-auto" role="tabpanel" id={`panel-${activeTab}`}>
        {activeTab === 'treatment' && (
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Introduction</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{treatments.treatment_intro || "No treatment introduction available."}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-3 text-sm uppercase tracking-wider">Simple Preparations</h4>
                <div className="text-sm text-emerald-700 dark:text-emerald-300 whitespace-pre-wrap leading-relaxed">
                  {treatments.simple_preparations || "None specified."}
                </div>
              </div>
              
              <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-3 text-sm uppercase tracking-wider">Compound Preparations</h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">
                  {treatments.compound_preparations || "None specified."}
                </div>
              </div>

              <div className="bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50">
                <h4 className="font-bold text-purple-800 dark:text-purple-400 mb-3 text-sm uppercase tracking-wider">External Applications</h4>
                <div className="text-sm text-purple-700 dark:text-purple-300 whitespace-pre-wrap leading-relaxed">
                  {treatments.external_applications || "None specified."}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-ayur-950 p-4 rounded-xl border border-slate-200 dark:border-ayur-800">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Diet (Pathya)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{treatments.pathya || "No government-supported dietary recommendations are available for this condition."}</p>
              </div>
              <div className="bg-slate-50 dark:bg-ayur-950 p-4 rounded-xl border border-slate-200 dark:border-ayur-800">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm uppercase tracking-wider text-red-500 dark:text-red-400">Avoid (Apathya)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{treatments.apathya || "No government-supported dietary recommendations are available for this condition."}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="flex flex-col gap-4">
            {evidence.sources.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">No direct textual evidence linked to this prediction.</p>
            )}
            {evidence.sources.map((src, i) => (
              <div key={i} className="border border-slate-200 dark:border-ayur-800 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setExpandedSource(expandedSource === i ? -1 : i)}
                  aria-expanded={expandedSource === i}
                  aria-controls={`evidence-content-${i}`}
                  className="w-full bg-slate-50 dark:bg-ayur-950 p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-ayur-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-slate-400 dark:text-slate-500 h-5 w-5" aria-hidden="true" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{src.source}</span>
                  </div>
                  {expandedSource === i ? <ChevronUp className="text-slate-400 dark:text-slate-500" aria-hidden="true" /> : <ChevronDown className="text-slate-400 dark:text-slate-500" aria-hidden="true" />}
                </button>
                {expandedSource === i && (
                  <div id={`evidence-content-${i}`} className="p-4 bg-white dark:bg-ayur-900 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-ayur-800">
                    {src.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
