import { useState } from 'react';
import { Snowflake, Sun, Leaf, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export default function SeasonPhilosophy() {
  const [activeTab, setActiveTab] = useState<'hiver' | 'printemps-automne' | 'ete'>('hiver');

  return (
    <section id="club-concept" className="py-20 bg-stone-50 text-stone-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 border border-sky-300 rounded-full text-sky-900 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Le Concept KM0 Belgique</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-slate-950 mb-4">
            VTT l’hiver, Gravel &amp; Route <br />
            <span className="text-[#1e2f47] underline decoration-sky-400 decoration-2">le reste de l’année.</span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            En Belgique, la météo ne dicte pas si nous roulons, mais <span className="text-slate-950 font-bold">comment</span> nous roulons.
            Inspiré de l’exigence suisse de <strong className="text-slate-950">Projet KM0</strong> et nourri de notre amour indéfectible pour le vélo,
            notre club vit au diapason des saisons.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Hiver VTT */}
          <div
            onClick={() => setActiveTab('hiver')}
            className={`p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'hiver'
                ? 'bg-white border-blue-400 shadow-lg ring-2 ring-blue-400/20'
                : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                  Novembre — Février
                </span>
                <Snowflake className="w-6 h-6 text-blue-600" />
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-stone-950 mb-3">
                01. VTT Hivernal &amp; Terres Ardennaises
              </h3>

              <p className="text-stone-700 text-sm leading-relaxed mb-6">
                Sur route en hiver, le vent glacial et l’humidité glacent les os. En forêt, abrités par les grands hêtres et sapins, le corps reste chaud et l’adrénaline est au sommet.
              </p>

              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Pilotage fin : franchissement de racines, ornières &amp; devers gras</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Sorties protégées du vent dans les vallées de l’Amblève, l’Ourthe et Meerdaal</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Ravitos d’hiver : marmite de soupe aux légumes chauds et feu réconfortant</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Voir le programme VTT</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Printemps/Automne Gravel */}
          <div
            onClick={() => setActiveTab('printemps-automne')}
            className={`p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'printemps-automne'
                ? 'bg-white border-amber-400 shadow-lg ring-2 ring-amber-400/20'
                : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  Mars — Mai &amp; Sept — Oct
                </span>
                <Leaf className="w-6 h-6 text-orange-600" />
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-stone-950 mb-3">
                02. Gravel d’Aventure &amp; Chemins Creux
              </h3>

              <p className="text-stone-700 text-sm leading-relaxed mb-6">
                Le terrain de jeu roi. Quand la terre sèche doucement ou que l’été indien dore les collines, on enfourche les montures gravel pour explorer les chemins interdits aux voitures.
              </p>

              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Traversée des chemins creux du Brabant, drailles de Herve et Condroz</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Format expédition &amp; bikepacking 2 à 3 jours avec bivouac ou auberge</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Rythme polyvalent : rouler dynamique sans la monotonie du bitume</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Voir le programme Gravel</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Été Route */}
          <div
            onClick={() => setActiveTab('ete')}
            className={`p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'ete'
                ? 'bg-white border-emerald-400 shadow-lg ring-2 ring-emerald-400/20'
                : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Avril — Août
                </span>
                <Sun className="w-6 h-6 text-emerald-600" />
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-stone-950 mb-3">
                03. Route, Pavés &amp; Grandes Classiques
              </h3>

              <p className="text-stone-700 text-sm leading-relaxed mb-6">
                Les journées sont longues, l’asphalte vibre sous les boyaux. On prend la route pour les cyclosportives légendaires, les monts de Flandres et les côtes ardennaises à pleine vitesse.
              </p>

              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Pelotons ordonnés en double file, relais souples et apprentissage des bordures</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Les monuments : Redoute, Roche-aux-Faucons, Koppenberg, Mur de Huy</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Sorties longues 100 à 150 km avec assistance et arrêts brasserie</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Voir le programme Route</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* The KM0 Guarantee & Swiss-Belgian Synergy Banner */}
        <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
                <span>Partenariat Officiel</span>
                <span>·</span>
                <span>Projet KM0 Suisse &amp; Belgique</span>
              </div>
              <h4 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-stone-950 mb-3">
                Rigueur Helvétique, Cœur Flandrien &amp; Convivialité Ardennaise
              </h4>
              <p className="text-stone-700 text-sm leading-relaxed">
                Fondée en Suisse par des passionnés d’aventures alpines, la structure <strong>Projet KM0</strong> (projet-km0.ch) s’implante en Belgique pour vous offrir le meilleur des deux mondes : la méthode d’encadrement rigoureuse, la sécurité et la pédagogie suisse, couplées à la culture cycliste la plus vibrante d’Europe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <a
                href="#calendrier"
                className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Rejoindre la Prochaine Sortie
              </a>
              <a
                href="https://projet-km0.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-center text-xs font-bold text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Découvrir KM0 Suisse (projet-km0.ch)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
