import { useState } from 'react';
import { IMAGES } from '../assets/images';
import { ArrowRight, Compass, Shield, Users, Coffee, Calendar, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreCalendar: () => void;
  onJoinClub: () => void;
  onOpenQuiz: () => void;
}

export default function Hero({ onExploreCalendar, onJoinClub, onOpenQuiz }: HeroProps) {
  const [activeSeason, setActiveSeason] = useState<'vtt' | 'gravel' | 'route'>('vtt');

  const seasonConfig = {
    vtt: {
      image: IMAGES.winterMtb,
      titleSeason: 'L’Hiver en VTT',
      datesBadge: 'Novembre à Février · Saison Actuelle',
      tagline: 'Sous les sapins ardennais & les crêtes givrées',
      description: 'L’hiver belge ne s’arrête jamais : on troque le bitume pour les sous-bois. VTT technique, franchissements ludiques dans la terre noble, singletracks protégés du vent et réconfort d’un grand bol de soupe chaude à l’arrivée.',
      keyStat: '40-60 km',
      statLabel: 'Parcours d’hiver balisés & encadrés',
      highlightBadge: 'Saison Active · 3 sorties/semaine',
    },
    gravel: {
      image: IMAGES.heroGravel,
      titleSeason: 'Printemps & Automne en Gravel',
      datesBadge: 'Mars à Mai & Septembre à Octobre',
      tagline: 'Chemins creux, drailles bocagères & forêts sauvages',
      description: 'Quand les feuilles bourgeonnent ou rougissent, la Belgique dévoile son plus beau visage gravel : chemins de terre du Brabant, sentiers de l’Ourthe, pavés de ferme et voies de halage méconnues. La liberté pure, loin du trafic.',
      keyStat: '60-90 km',
      statLabel: 'Aventures & bikepacking 100% nature',
      highlightBadge: 'Inscriptions ouvertes pour le printemps',
    },
    route: {
      image: IMAGES.roadPeloton,
      titleSeason: 'L’Été & les Classiques sur Route',
      datesBadge: 'Avril à Août',
      tagline: 'Sur les traces du Ronde et de la Doyenne',
      description: 'La terre sacrée du cyclisme sur route : enchaînez la Redoute, le Mur de Huy, le Paterberg ou les collines du Condroz en peloton soudé. Conseils de pilotage sur pavés, gestion de braquet et convivialité après l’effort.',
      keyStat: '80-140 km',
      statLabel: 'Groupes d’allure harmonisés & assistance',
      highlightBadge: 'Grands cols ardennais & flandriens',
    },
  };

  const current = seasonConfig[activeSeason];

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden bg-stone-100 border-b border-stone-200">
      {/* Background Image with luminous, clean overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.image}
          alt={current.titleSeason}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out filter brightness-[0.90] contrast-[1.02]"
        />
        {/* Soft, bright gradient overlays for high legibility without pitch blackness */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-50/95 via-stone-50/85 to-stone-50/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-100 via-transparent to-white/40" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 w-full flex-1 flex flex-col justify-center">
        {/* Season Selector Tabs */}
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-sm max-w-fit mb-6">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-2 hidden sm:inline">
            Cycle 4 Saisons :
          </span>
          <button
            onClick={() => setActiveSeason('vtt')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSeason === 'vtt'
                ? 'bg-amber-400 text-stone-950 shadow-xs font-black'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <span>VTT Hiver</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-stone-900/10 text-stone-800 rounded font-bold">
              En cours
            </span>
          </button>

          <button
            onClick={() => setActiveSeason('gravel')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSeason === 'gravel'
                ? 'bg-amber-400 text-stone-950 shadow-xs font-black'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <span>Gravel (Printemps / Automne)</span>
          </button>

          <button
            onClick={() => setActiveSeason('route')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSeason === 'route'
                ? 'bg-amber-400 text-stone-950 shadow-xs font-black'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <span>Route &amp; Pavés (Été)</span>
          </button>
        </div>

        {/* Hero Copy */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-xs text-amber-800 font-bold mb-3">
            <span className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {current.datesBadge}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-600 font-medium">Club &amp; Antenne Officielle Projet KM0</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-stone-950 leading-[0.95] mb-5">
            L’Âme Cycliste Belge, <br />
            <span className="text-amber-600">
              L’Esprit KM0.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-800 font-semibold leading-relaxed mb-3 max-w-2xl">
            {current.tagline}.
          </p>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-8 max-w-2xl">
            {current.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={onJoinClub}
              className="px-6 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Rejoindre le Club KM0 Belgique</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreCalendar}
              className="px-5 py-3.5 text-xs sm:text-sm font-bold text-stone-800 hover:text-stone-950 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Voir les Prochaines Sorties</span>
            </button>

            <button
              onClick={onOpenQuiz}
              className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-stone-700 hover:text-amber-700 underline underline-offset-4 cursor-pointer"
            >
              Calculer mon niveau physique &amp; technique →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Features Strip: The 4 Pillars */}
      <div className="relative z-10 w-full border-t border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wide">
                  Rythme 4 Saisons
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  VTT l’hiver · Gravel &amp; route printemps/été/automne
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wide">
                  Standard KM0 Suisse
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Guides certifiés, sécurité, traces GPX vérifiées &amp; secours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wide">
                  3 Rides par Semaine
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Samedi club, dimanche social ride &amp; afterwork le jeudi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wide">
                  Convivialité Belge
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  « On part ensemble, on rentre ensemble », café &amp; bière d’abbaye
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
