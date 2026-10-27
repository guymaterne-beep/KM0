import { useState } from 'react';
import { TECHNICAL_LEVELS, PHYSICAL_LEVELS } from '../data/club';
import { Award, Gauge, Zap, HelpCircle } from 'lucide-react';

interface LevelMatrixProps {
  onOpenQuiz: () => void;
}

export default function LevelMatrix({ onOpenQuiz }: LevelMatrixProps) {
  const [activeTab, setActiveTab] = useState<'tech' | 'phys'>('tech');

  return (
    <section id="niveaux" className="py-20 bg-stone-50 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Standard Officiel KM0</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-stone-950 tracking-tight">
              L’Échelle des Niveaux KM0
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
              Héritée de la rigueur de <strong>Projet KM0 Suisse</strong> (normes Swiss Cycling), notre échelle d’évaluation garantit des pelotons homogènes, zéro frustration et un plaisir maximal sur chaque sortie.
            </p>
          </div>

          <button
            onClick={onOpenQuiz}
            className="px-5 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Faire le Test : Quel est mon niveau ?</span>
          </button>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-2 mb-8 border-b border-stone-200 pb-4">
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tech'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>Niveau Technique (T1 à T5)</span>
          </button>

          <button
            onClick={() => setActiveTab('phys')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'phys'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Niveau Physique &amp; Allure (P1 à P5)</span>
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'tech' ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {TECHNICAL_LEVELS.map((lvl) => (
              <div
                key={lvl.level}
                className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-2xl font-black text-amber-600">
                      T{lvl.level}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-bold">
                      Niveau {lvl.level}/5
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold uppercase text-stone-900 mb-2 leading-tight">
                    {lvl.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {lvl.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-400 font-mono font-medium">
                  Standard KM0 Belgique
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PHYSICAL_LEVELS.map((lvl) => (
              <div
                key={lvl.level}
                className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-2xl font-black text-amber-600">
                      P{lvl.level}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-bold">
                      Niveau {lvl.level}/5
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold uppercase text-stone-900 mb-1 leading-tight">
                    {lvl.title}
                  </h4>
                  <div className="text-[11px] font-mono text-amber-800 mb-2 font-bold">
                    {lvl.distance} · {lvl.dPlus}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {lvl.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-400 font-mono font-medium">
                  Cadence &amp; Allure Club
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
