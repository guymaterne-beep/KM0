import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trip } from '../data/trips';
import { Compass, ArrowRight, Camera } from 'lucide-react';

interface TripsSectionProps {
  onSelectTrip: (trip: Trip) => void;
}

export default function TripsSection({ onSelectTrip }: TripsSectionProps) {
  const { trips } = useApp();
  const [filterDiscipline, setFilterDiscipline] = useState<'all' | 'gravel' | 'vtt' | 'stage'>('all');

  const filteredTrips = trips.filter(
    (t) => filterDiscipline === 'all' || t.discipline === filterDiscipline
  );

  return (
    <section id="voyages" className="py-20 bg-stone-100/70 border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Aventures &amp; Stages KM0</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-stone-950 tracking-tight">
              Voyages &amp; Stages d’Entraînement
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
              Au-delà des sorties hebdomadaires belges, vivez des expériences immersives inoubliables : expéditions bikepacking en Wallonie, passerelle directe avec les Alpes suisses (Projet KM0 Hauteville) et stages de préparation au soleil.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 shadow-xs">
            {[
              { id: 'all', label: 'Tous les séjours' },
              { id: 'gravel', label: 'Gravel Bikepacking' },
              { id: 'vtt', label: 'VTT Pilotage' },
              { id: 'stage', label: 'Stages & Foncier' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterDiscipline(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterDiscipline === tab.id
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className="group p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-200">
                      {trip.country}
                    </span>
                    <span className="text-stone-500 font-medium text-xs">
                      {trip.durationDays} jours
                    </span>
                    {trip.photos && trip.photos.length > 0 && (
                      <span
                        className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                        title={`${trip.photos.length} photos du séjour`}
                      >
                        <Camera className="w-3 h-3 text-sky-600" />
                        <span>{trip.photos.length}</span>
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      trip.status === 'dernieres-places'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {trip.status === 'dernieres-places' ? 'Dernières places' : 'Inscriptions ouvertes'}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-stone-950 mb-2 group-hover:text-amber-700 transition-colors">
                  {trip.title}
                </h3>

                <p className="text-xs text-amber-800 font-bold mb-3">
                  {trip.subtitle}
                </p>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {trip.coverDescription}
                </p>

                {/* Highlights bullets */}
                <div className="space-y-2 mb-6">
                  {(trip.highlights || []).slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Meta & Price */}
              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block">
                    Dates prévues
                  </span>
                  <span className="text-xs font-bold text-stone-800">
                    {trip.dates}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-500 block">À partir de</span>
                  <span className="font-display text-2xl sm:text-3xl font-black text-amber-600">
                    {trip.priceEuro} €
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 group-hover:text-amber-800 font-bold">
                <span>Voir le programme complet &amp; réserver</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
