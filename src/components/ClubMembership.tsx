import { useApp } from '../context/AppContext';
import { MembershipTier } from '../data/club';
import { Check, Bike } from 'lucide-react';

interface ClubMembershipProps {
  onSelectTier: (tier: MembershipTier) => void;
}

export default function ClubMembership({ onSelectTier }: ClubMembershipProps) {
  const { membershipTiers } = useApp();

  // Filter only active tiers on public website
  const activeTiers = membershipTiers.filter((t) => t.active !== false);

  return (
    <section id="adhesion" className="py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 border border-orange-300 rounded-full text-orange-950 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Adhésion Saison 2026 / 2027</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-slate-950 tracking-tight mb-4">
            Rejoindre le Club KM0 Belgique
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Roulez toute l’année dans un cadre sécurisé, bienveillant et stimulant.
            Du Pass Découverte sans engagement au Pack Pro avec maillot officiel, trouvez la formule qui correspond à votre pratique.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
          {activeTiers.map((tier) => (
            <div
              key={tier.id}
              className={`p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
                tier.recommended
                  ? 'bg-white border-2 border-orange-500 shadow-md ring-2 ring-orange-400/20'
                  : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-xs">
                  {tier.badge || 'Recommandée'}
                </div>
              )}

              <div>
                {!tier.recommended && tier.badge && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    {tier.badge}
                  </span>
                )}

                <h3 className="font-display text-2xl font-bold uppercase text-slate-900 mb-2">
                  {tier.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-display text-4xl sm:text-5xl font-black text-orange-600">
                    {tier.pricePerYear} €
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-medium">
                    {tier.period}
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {tier.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8 text-xs text-slate-700">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  onClick={() => onSelectTier(tier)}
                  className={`w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs ${
                    tier.recommended
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs font-black'
                      : 'bg-[#1e2f47] hover:bg-[#162335] text-white font-bold'
                  }`}
                >
                  {tier.ctaText || 'Rejoindre le Club'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Club Jersey & Equipment Highlight */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 block mb-2">
              Le Maillot Officiel KM0 Belgique
            </span>
            <h4 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-slate-950 mb-2">
              Sobre, Technique &amp; Élégant
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Inclus avec chaque adhésion annuelle : un maillot haut de gamme conçu pour résister aux 4 saisons belges. Tissu italien respirant, coupe aéro endurance confortable, zip intégral YKK, trois poches arrière profondes + poche zippée étanche, et discrets liserés noir-jaune-rouge sur la manche gauche.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 text-center shrink-0">
            <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center mx-auto mb-2 text-sky-700">
              <Bike className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-slate-900 block uppercase">Valeur boutique : 110 €</span>
            <span className="text-[11px] text-sky-800 font-bold">Offert aux membres annuels</span>
          </div>
        </div>
      </div>
    </section>
  );
}
