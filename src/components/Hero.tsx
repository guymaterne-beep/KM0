import { useState, useRef } from 'react';
import { IMAGES } from '../assets/images';
import {
  ArrowRight,
  Compass,
  Shield,
  Users,
  Coffee,
  Calendar,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Sparkles,
  Award,
} from 'lucide-react';

interface HeroProps {
  onExploreCalendar: () => void;
  onJoinClub: () => void;
  onOpenQuiz: () => void;
}

export default function Hero({ onExploreCalendar, onJoinClub, onOpenQuiz }: HeroProps) {
  const [activeSeason, setActiveSeason] = useState<'vtt' | 'gravel' | 'route'>('vtt');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const seasonConfig = {
    vtt: {
      image: IMAGES.winterMtb,
      titleSeason: 'L’Hiver en VTT',
      datesBadge: 'Novembre à Février · Saison Actuelle',
      tagline: 'Sous les sapins ardennais & les crêtes givrées',
      description:
        'L’hiver belge ne s’arrête jamais : on troque le bitume pour les sous-bois. VTT technique, franchissements ludiques dans la terre noble, singletracks protégés du vent et réconfort d’un grand bol de soupe chaude à l’arrivée.',
      keyStat: '40-60 km',
      statLabel: 'Parcours d’hiver balisés & encadrés',
      highlightBadge: 'Saison Active · 3 sorties/semaine',
    },
    gravel: {
      image: IMAGES.heroGravel,
      titleSeason: 'Printemps & Automne en Gravel',
      datesBadge: 'Mars à Mai & Septembre à Octobre',
      tagline: 'Chemins creux, drailles bocagères & forêts sauvages',
      description:
        'Quand les feuilles bourgeonnent ou rougissent, la Belgique dévoile son plus beau visage gravel : chemins de terre du Brabant, sentiers de l’Ourthe, pavés de ferme et voies de halage méconnues. La liberté pure, loin du trafic.',
      keyStat: '60-90 km',
      statLabel: 'Aventures & bikepacking 100% nature',
      highlightBadge: 'Inscriptions ouvertes pour le printemps',
    },
    route: {
      image: IMAGES.roadPeloton,
      titleSeason: 'L’Été & les Classiques sur Route',
      datesBadge: 'Avril à Août',
      tagline: 'Sur les traces du Ronde et de la Doyenne',
      description:
        'La terre sacrée du cyclisme sur route : enchaînez la Redoute, le Mur de Huy, le Paterberg ou les collines du Condroz en peloton soudé. Conseils de pilotage sur pavés, gestion de braquet et convivialité après l’effort.',
      keyStat: '80-140 km',
      statLabel: 'Groupes d’allure harmonisés & assistance',
      highlightBadge: 'Grands cols ardennais & flandriens',
    },
  };

  const current = seasonConfig[activeSeason];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden bg-slate-100 border-b border-slate-200">
      {/* Background Image with luminous, clean overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.image}
          alt={current.titleSeason}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out filter brightness-[0.88] contrast-[1.03]"
        />
        {/* Soft, bright gradient overlays for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-slate-50/85 to-slate-50/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-white/40" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 w-full flex-1 flex flex-col justify-center">
        {/* Season Selector Tabs */}
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xs max-w-fit mb-6">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 hidden sm:inline">
            Cycle 4 Saisons :
          </span>
          <button
            onClick={() => setActiveSeason('vtt')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSeason === 'vtt'
                ? 'bg-[#1e2f47] text-white shadow-xs font-black'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span>VTT Hiver</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white/20 text-white rounded font-bold">
              En cours
            </span>
          </button>

          <button
            onClick={() => setActiveSeason('gravel')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSeason === 'gravel'
                ? 'bg-[#1e2f47] text-white shadow-xs font-black'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span>Gravel (Printemps / Automne)</span>
          </button>

          <button
            onClick={() => setActiveSeason('route')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSeason === 'route'
                ? 'bg-[#1e2f47] text-white shadow-xs font-black'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span>Route &amp; Pavés (Été)</span>
          </button>
        </div>

        {/* 2-Column Hero: Left Copy, Right Video Teaser */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#1e2f47] font-bold mb-3">
              <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg text-[#1e2f47]">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                {current.datesBadge}
              </span>
              <span className="text-slate-400 hidden sm:inline">·</span>
              <span className="text-slate-600 font-medium">Club &amp; Antenne Officielle Projet KM0</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-slate-950 leading-[0.95] mb-5">
              L’Âme Cycliste Belge, <br />
              <span className="text-[#1e2f47] underline decoration-blue-500 decoration-wavy decoration-2">
                L’Esprit KM0.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed mb-3 max-w-2xl">
              {current.tagline}.
            </p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-7 max-w-2xl">
              {current.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
              <button
                onClick={onJoinClub}
                className="px-6 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white bg-[#1e2f47] hover:bg-[#152336] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Rejoindre le Club KM0 Belgique</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={onExploreCalendar}
                className="px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-800 hover:text-[#1e2f47] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#1e2f47]" />
                <span>Voir les Prochaines Sorties</span>
              </button>

              <button
                onClick={onOpenQuiz}
                className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-[#1e2f47] hover:text-blue-700 underline underline-offset-4 cursor-pointer"
              >
                Calculer mon niveau physique &amp; technique →
              </button>
            </div>
          </div>

          {/* Right Column: Strategic High-Impact KM0 Official Video Teaser */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl overflow-hidden bg-[#0d1622] border-2 border-sky-500/40 shadow-2xl transition-all duration-300 hover:border-sky-400">
              {/* Top Pill / Badge */}
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-400/30 text-white text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span>Clip Officiel KM ZERO</span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] text-slate-300">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>Identité &amp; Énergie</span>
                </div>
              </div>

              {/* The Video Element */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950 cursor-pointer" onClick={togglePlay}>
                <video
                  ref={videoRef}
                  src="/assets/aistudio/km0-video-logo_d4dc285f.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Subtle blue glow reflection at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d1622] via-[#0d1622]/60 to-transparent pointer-events-none" />
              </div>

              {/* Video Bottom Controls & Info Bar */}
              <div className="p-3.5 bg-[#0d1622] border-t border-sky-500/20 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-sky-400" /> : <Play className="w-4 h-4 text-sky-400" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title={isMuted ? 'Activer le son' : 'Couper le son'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
                  </button>

                  <span className="text-[11px] text-slate-300 font-medium pl-1">
                    L'Énergie KM0 en Mouvement
                  </span>
                </div>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 font-bold text-xs transition-colors cursor-pointer"
                  title="Agrandir en plein écran"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Plein écran</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Strip: The 4 Pillars */}
      <div className="relative z-10 w-full border-t border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Rythme 4 Saisons
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  VTT l’hiver · Gravel &amp; route printemps/été/automne
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#1e2f47]/10 border border-[#1e2f47]/20 text-[#1e2f47] shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Standard KM0 Suisse
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Guides certifiés, sécurité, traces GPX vérifiées &amp; secours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  3 Rides par Semaine
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Samedi club, dimanche social ride &amp; afterwork le jeudi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Convivialité Belge
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  « On part ensemble, on rentre ensemble », café &amp; bière d’abbaye
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Video Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden border border-sky-500/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/aistudio/km0-logobike_Bleu_f5171d81.png"
                  alt="KM ZERO"
                  className="h-8 w-auto object-contain"
                />
                <span className="font-display font-bold uppercase tracking-wider text-sm sm:text-base text-white">
                  Film Officiel KM ZERO
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full Player */}
            <div className="aspect-16/9 w-full bg-black">
              <video
                src="/assets/aistudio/km0-video-logo_d4dc285f.mp4"
                autoPlay
                controls
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
