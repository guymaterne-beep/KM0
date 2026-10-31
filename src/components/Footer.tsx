import { Bike, ExternalLink, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin?: () => void;
}

export default function Footer({ onOpenAdminLogin }: FooterProps) {
  return (
    <footer className="bg-stone-100 text-stone-600 border-t border-stone-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Origin */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <img
                  src="/assets/aistudio/km0-logobike_Bleu_f5171d81.png"
                  alt="KM ZERO Belgique"
                  className="h-10 w-auto object-contain"
                />
                <div className="flex h-1.5 w-12 rounded-full overflow-hidden shadow-xs mt-1 border border-stone-200">
                  <div className="w-1/3 bg-black" />
                  <div className="w-1/3 bg-[#facc15]" />
                  <div className="w-1/3 bg-[#ef4444]" />
                </div>
              </div>
              <div>
                <span className="font-display text-lg font-black uppercase text-slate-900 tracking-wide block">
                  PROJET KM0 BELGIQUE
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Club Cycliste · VTT · Gravel · Route
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              L’antenne belge officielle de Projet KM0. Rouler toute l’année avec le standard suisse et la passion du terroir belge : VTT l’hiver, Gravel et Route le reste de l’année.
            </p>

            {/* Belgian Flag subtle accent */}
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Référent Belge : Guy Materne</span>
            </div>
          </div>

          {/* Col 2: Le Club 4 Saisons */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-stone-900">
              Le Club 4 Saisons
            </h4>
            <ul className="space-y-2 text-stone-600">
              <li>
                <a href="#club-concept" className="hover:text-[#1e2f47] transition-colors">
                  VTT Hiver (Novembre — Février)
                </a>
              </li>
              <li>
                <a href="#club-concept" className="hover:text-[#1e2f47] transition-colors">
                  Gravel des Bocages (Printemps &amp; Automne)
                </a>
              </li>
              <li>
                <a href="#club-concept" className="hover:text-[#1e2f47] transition-colors">
                  Route &amp; Pavés Flandriens (Été)
                </a>
              </li>
              <li>
                <a href="#calendrier" className="hover:text-[#1e2f47] transition-colors">
                  Calendrier des Sorties Hebdos
                </a>
              </li>
              <li>
                <a href="#niveaux" className="hover:text-[#1e2f47] transition-colors">
                  Échelle des Niveaux (T1-T5 / P1-P5)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Voyages & Stages */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-stone-900">
              Voyages &amp; Stages KM0
            </h4>
            <ul className="space-y-2 text-stone-600">
              <li>
                <a href="#voyages" className="hover:text-[#1e2f47] transition-colors">
                  Ardennes Epic Bikepacking
                </a>
              </li>
              <li>
                <a href="#voyages" className="hover:text-[#1e2f47] transition-colors">
                  Trans-Suisse Romande &amp; Hauteville
                </a>
              </li>
              <li>
                <a href="#voyages" className="hover:text-[#1e2f47] transition-colors">
                  Stage d’Affûtage Majorque
                </a>
              </li>
              <li>
                <a href="#voyages" className="hover:text-[#1e2f47] transition-colors">
                  Masterclass Pilotage VTT d’Hiver
                </a>
              </li>
              <li>
                <a href="#adhesion" className="hover:text-[#1e2f47] transition-colors">
                  Tarifs &amp; Formules d’Adhésion
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Maison Mère & Admin */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-stone-900">
              Maison Mère &amp; Espace Pro
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              En liaison directe avec l’équipe de fondateurs en Suisse romande :
            </p>
            <a
              href="https://projet-km0.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 hover:text-amber-800 hover:border-amber-400 transition-colors shadow-2xs font-medium"
            >
              <span>Visiter Projet KM0 Suisse</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            </a>
            
            {onOpenAdminLogin && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdminLogin}
                  className="text-stone-500 hover:text-stone-900 flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                >
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span>Connexion Back-Office (Gestion)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            © {new Date().getFullYear()} Projet KM0 Belgique · Club Cycliste &amp; Voyages d’aventure. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a href="#contact" className="hover:text-stone-800">Contact Référent</a>
            <span>·</span>
            <a href="#club-concept" className="hover:text-stone-800">Charte de Convivialité</a>
            <span>·</span>
            <span>« On part ensemble, on rentre ensemble »</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
