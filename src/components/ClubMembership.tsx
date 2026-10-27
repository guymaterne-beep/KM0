import { MEMBERSHIP_TIERS, MembershipTier } from '../data/club';
import { Check, Bike } from 'lucide-react';

interface ClubMembershipProps {
  onSelectTier: (tier: MembershipTier) => void;
}

export default function ClubMembership({ onSelectTier }: ClubMembershipProps) {
  return (
    <section id="adhesion" className="py-20 bg-stone-100/60 border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Adhésion Saison 2026 / 2027</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-stone-950 tracking-tight mb-4">
            Rejoindre le Club KM0 Belgique
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Roulez toute l’année dans un cadre sécurisé, bienveillant et stimulant.
            Du Pass Découverte sans engagement au Pack Pro avec maillot officiel, trouvez la formule qui correspond à votre pratique.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
          {MEMBERSHIP_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
                tier.recommended
                  ? 'bg-white border-2 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                  : 'bg-white border border-stone-200 hover:border-stone-300 shadow-xs'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                  {tier.badge}
                </div>
              )}

              <div>
                {!tier.recommended && tier.badge && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                    {tier.badge}
                  </span>
                )}

                <h3 className="font-display text-2xl font-bold uppercase text-stone-900 mb-2">
                  {tier.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-display text-4xl sm:text-5xl font-black text-amber-600">
                    {tier.pricePerYear} €
                  </span>
                  <span className="text-xs text-stone-500 font-mono font-medium">
                    {tier.period}
                  </span>
                </div>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {tier.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8 text-xs text-stone-700">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
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
                      ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-xs font-extrabold'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {tier.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Club Jersey & Equipment Highlight */}
        <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-2">
              Le Maillot Officiel KM0 Belgique
            </span>
            <h4 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-stone-950 mb-2">
              Sobre, Technique &amp; Élégant
            </h4>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Inclus avec chaque adhésion annuelle : un maillot haut de gamme conçu pour résister aux 4 saisons belges. Tissu italien respirant, coupe aéro endurance confortable, zip intégral YKK, trois poches arrière profondes + poche zippée étanche, et discrets liserés noir-jaune-rouge sur la manche gauche.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center shrink-0">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-2 text-amber-700">
              <Bike className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-stone-900 block uppercase">Valeur boutique : 110 €</span>
            <span className="text-[11px] text-amber-800 font-bold">Offert aux membres annuels</span>
          </div>
        </div>
      </div>
    </section>
  );
}
