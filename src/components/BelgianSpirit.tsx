import { Beer, Coffee, Heart, Shield, Users, MapPin } from 'lucide-react';

export default function BelgianSpirit() {
  return (
    <section id="esprit-belge" className="py-20 bg-white text-stone-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[#1e2f47] text-xs font-bold uppercase tracking-wider mb-4">
            <span>Culture &amp; Convivialité</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-stone-950 tracking-tight mb-4">
            L’Âme du Cyclisme Belge <br />
            <span className="text-[#1e2f47]">&amp; la Rigueur KM0</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Ici, le vélo n’est pas un simple sport : c’est un patrimoine, une fierté nationale et une fête partagée.
            Découvrez comment nous faisons vivre l’esprit <strong>Projet KM0</strong> sur nos terres de légendes.
          </p>
        </div>

        {/* 2-Columns: The Belgian Reference (Guy Materne) & The Clubhouse Ritual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
          {/* Column 1: Guy Materne & La Référence Belge */}
          <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1e2f47] text-white flex items-center justify-center font-display text-2xl font-black shadow-xs">
                  GM
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase text-stone-950">
                    Guy Materne
                  </h3>
                  <p className="text-xs text-[#1e2f47] font-bold tracking-wide">
                    Référent Officiel Projet KM0 Belgique · Capitaine de Route
                  </p>
                </div>
              </div>

              <blockquote className="text-stone-700 text-sm leading-relaxed italic mb-6 border-l-3 border-[#1e2f47] pl-4 py-1 font-medium">
                « Quand j’ai découvert Projet KM0 en Suisse, j’ai été frappé par l’exactitude de leur méthode, le respect de la nature et l’humanité des séjours. Mon ambition en créant l’antenne belge est simple : apporter cette précision dans nos Ardennes, nos monts flandriens et nos plaines brabançonnes, avec la chaleur, l’humilité et la franche camaraderie qui font l’ADN du cyclisme en Belgique. »
              </blockquote>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#1e2f47] shrink-0" />
                  <span>Encadrement certifié selon les standards officiels Projet KM0</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#1e2f47] shrink-0" />
                  <span>Traces tracées sur le terrain, continuellement vérifiées et mises à jour</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#1e2f47] shrink-0" />
                  <span>Lien direct et passerelles d’échanges avec le camp de base suisse à Hauteville</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>Contact direct : <strong className="text-stone-700">guymaterne@gmail.com</strong></span>
              <span className="text-[#1e2f47] font-bold">Membre Fondateur BE</span>
            </div>
          </div>

          {/* Column 2: Le Rituel du Clubhouse */}
          <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-4">
                <Beer className="w-4 h-4" />
                <span>Le Rituel d’Après-Ride</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-stone-950 mb-4">
                Pas de Ride sans Troisième Mi-Temps
              </h3>

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Le cyclisme belge ne s’arrête jamais quand le compteur s’éteint. Le moment où l’on déclipse les pédales est sacré :
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                    <Coffee className="w-4 h-4 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase">Avant le départ : L’Espresso Barista</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Rendez-vous 30 minutes avant l’heure H pour le café de spécialité chaud et le briefing météo &amp; sécurité.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                    <Beer className="w-4 h-4 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase">À l’arrivée : Trappistes &amp; Bières Locales</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Orval, Chimay, Val-Dieu, Kwaremont ou bières artisanales des micro-brasseries de nos terroirs (options sans alcool disponibles).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                    <Heart className="w-4 h-4 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase">La Règle d’Or KM0</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      « On part ensemble, on rentre ensemble. » Si quelqu’un crève ou flanche dans une bosse, le peloton s’arrête et fait bloc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
              <span>Clubhouse Mobile &amp; QG Éphémères</span>
              <span className="text-stone-800 font-semibold">Wallonie · Flandres · Bruxelles</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
