import { WEEKLY_SCHEDULE } from '../data/club';
import { Calendar, Users, Coffee } from 'lucide-react';

export default function WeeklyScheduleSection() {
  return (
    <section className="py-16 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>La Routine du Club</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-stone-950 tracking-tight">
              3 Rendez-Vous Hebdomadaires Fixes
            </h2>
          </div>
          <p className="text-stone-600 text-sm max-w-md">
            Des points de rendez-vous fixes en Wallonie, Bruxelles et Brabant, tracés et encadrés par nos capitaines de route.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WEEKLY_SCHEDULE.map((slot, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-display text-lg font-black uppercase text-amber-800 tracking-wider">
                    {slot.day}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200 shadow-2xs">
                    {slot.time}
                  </span>
                </div>

                <div className="text-xs text-amber-700 font-semibold mb-2">
                  {slot.seasonContext}
                </div>

                <h3 className="font-display text-xl font-bold uppercase text-stone-900 mb-3">
                  {slot.name}
                </h3>

                <p className="text-stone-600 text-xs leading-relaxed mb-4">
                  {slot.spirit}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/80 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{slot.paceGroups}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Débrief &amp; verre de l’amitié garanti</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
