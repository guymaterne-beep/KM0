import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Ride } from '../data/rides';
import { Calendar, MapPin, Search, ArrowUpRight, Snowflake, Leaf, Sun, Clock, Plus } from 'lucide-react';

interface RideCalendarProps {
  onSelectRide: (ride: Ride) => void;
  onOpenAdminLogin?: () => void;
}

export default function RideCalendar({ onSelectRide, onOpenAdminLogin }: RideCalendarProps) {
  const { rides, isAdminLoggedIn } = useApp();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      if (selectedDiscipline !== 'all' && ride.discipline !== selectedDiscipline) {
        return false;
      }
      if (selectedRegion !== 'all' && ride.region !== selectedRegion) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ride.title.toLowerCase().includes(q);
        const matchesDesc = (ride.description || '').toLowerCase().includes(q);
        const matchesLoc = (ride.startLocation || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }
      return true;
    });
  }, [rides, selectedDiscipline, selectedRegion, searchQuery]);

  return (
    <section id="calendrier" className="py-20 bg-stone-50 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda Officiel du Club</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-stone-950 tracking-tight">
              Sorties &amp; Rides Encadrés
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Choisissez votre sortie, vérifiez les niveaux d’exigence technique et physique selon la charte KM0, et rejoignez le peloton.
            </p>
          </div>

          {/* Quick season filter indicators */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Filtres Rapides :</span>
            <button
              onClick={() => setSelectedDiscipline('vtt')}
              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedDiscipline === 'vtt'
                  ? 'bg-blue-100 text-blue-900 border-blue-300 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-blue-600" />
              <span>VTT Hiver</span>
            </button>
            <button
              onClick={() => setSelectedDiscipline('gravel')}
              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedDiscipline === 'gravel'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-amber-600" />
              <span>Gravel</span>
            </button>
            <button
              onClick={() => setSelectedDiscipline('route')}
              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedDiscipline === 'route'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-emerald-600" />
              <span>Route</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Discipline tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: 'Toutes les disciplines' },
              { id: 'vtt', label: 'VTT (Saison Hiver)' },
              { id: 'gravel', label: 'Gravel' },
              { id: 'route', label: 'Route & Classiques' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedDiscipline(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedDiscipline === tab.id
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Region selector & Search */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="all">Toutes les Régions</option>
              <option value="Ardennes">Ardennes</option>
              <option value="Brabant">Brabant (Wallon &amp; Flamand)</option>
              <option value="Condroz">Condroz &amp; Meuse</option>
              <option value="Flandres">Flandres &amp; Monts</option>
              <option value="Hautes Fagnes">Hautes Fagnes</option>
            </select>

            <div className="relative flex-1 md:w-52">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher une sortie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Rides Grid */}
        {filteredRides.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-sm mb-3">Aucune sortie ne correspond à vos filtres.</p>
            <button
              onClick={() => {
                setSelectedDiscipline('all');
                setSelectedRegion('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-amber-700 underline hover:text-amber-800"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRides.map((ride) => {
              const maxElev = 100;
              const points = (ride.elevationProfile || [10, 30, 60, 40, 70, 30, 10])
                .map((val, idx) => {
                  const arrLen = (ride.elevationProfile || [10, 30, 60, 40, 70, 30, 10]).length;
                  const x = (idx / (arrLen - 1)) * 300;
                  const y = 50 - (val / maxElev) * 40;
                  return `${x},${y}`;
                })
                .join(' ');
              const areaPoints = `0,50 ${points} 300,50`;

              return (
                <div
                  key={ride.id}
                  onClick={() => onSelectRide(ride)}
                  className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Discipline & Season */}
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            ride.discipline === 'vtt'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : ride.discipline === 'gravel'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {ride.discipline.toUpperCase()}
                        </span>
                        <span className="text-stone-500 font-medium text-[11px]">
                          {ride.region}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500 font-semibold">
                        <span title="Niveau Technique">T{ride.technicalLevel}</span>
                        <span>·</span>
                        <span title="Niveau Physique">P{ride.physicalLevel}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-stone-950 mb-2 group-hover:text-amber-700 transition-colors leading-tight">
                      {ride.title}
                    </h3>

                    {/* Date & Time */}
                    <div className="flex items-center gap-3 text-xs text-stone-600 mb-4 font-semibold">
                      <span className="flex items-center gap-1 text-amber-800">
                        <Calendar className="w-3.5 h-3.5" />
                        {ride.date}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="flex items-center gap-1 text-stone-500 font-normal">
                        <Clock className="w-3.5 h-3.5" />
                        {ride.time}
                      </span>
                    </div>

                    {/* Mini Sparkline Elevation SVG */}
                    <div className="w-full h-12 bg-stone-50 rounded-xl p-1.5 border border-stone-200 mb-4 relative overflow-hidden">
                      <svg viewBox="0 0 300 50" className="w-full h-full" preserveAspectRatio="none">
                        <polygon points={areaPoints} fill="#f59e0b" fillOpacity="0.15" />
                        <polyline points={points} fill="none" stroke="#d97706" strokeWidth="2" />
                      </svg>
                      <div className="absolute right-2.5 bottom-1 text-[10px] text-stone-500 font-mono font-bold">
                        +{ride.elevationM}m D+
                      </div>
                    </div>

                    {/* Key Stats Row */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-stone-50 border border-stone-200 mb-4 text-center">
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono">Distance</span>
                        <span className="text-xs font-bold text-stone-900 font-mono">{ride.distanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono">Dénivelé</span>
                        <span className="text-xs font-bold text-amber-700 font-mono">+{ride.elevationM} m</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono">Durée</span>
                        <span className="text-xs font-bold text-stone-900 font-mono">{ride.estimatedHours}</span>
                      </div>
                    </div>

                    {/* Start Location */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{ride.startLocation}</span>
                    </div>
                  </div>

                  {/* Card Bottom CTA & Remaining Slots */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 text-[11px]">
                      <strong className="text-stone-800">
                        {ride.maxParticipants - ride.registeredCount} places
                      </strong>{' '}
                      restantes
                    </span>

                    <span className="text-amber-700 group-hover:text-amber-800 font-bold flex items-center gap-1">
                      <span>Détails &amp; Inscription</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
