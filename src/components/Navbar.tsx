import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Bike, Lock, UserCheck, Award, Settings, User } from 'lucide-react';

interface NavbarProps {
  onOpenMembership: () => void;
  onOpenQuiz: () => void;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
  onOpenMemberLogin: () => void;
  onOpenMemberPortal: () => void;
}

export default function Navbar({
  onOpenMembership,
  onOpenQuiz,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  onOpenMemberLogin,
  onOpenMemberPortal,
}: NavbarProps) {
  const { isAdminLoggedIn, adminEmail, currentMember } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Le Club 4 Saisons', href: '#club-concept' },
    { label: 'Sorties & Calendrier', href: '#calendrier' },
    { label: 'Voyages & Stages', href: '#voyages' },
    { label: 'Échelle Niveaux', href: '#niveaux' },
    { label: 'L’Esprit Belge', href: '#esprit-belge' },
    { label: 'Tarifs & Adhésion', href: '#adhesion' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Banner: Season Announcement, Member Space & Admin access */}
      <div className="bg-stone-100 text-stone-700 text-xs py-1.5 px-4 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#1e2f47] font-extrabold tracking-wider uppercase text-[11px]">
              Saison Active :
            </span>
            <span className="text-slate-900 font-semibold hidden sm:inline">
              VTT Hivernal en Ardennes &amp; Brabant
            </span>
            <span className="text-slate-900 font-semibold sm:hidden">VTT Hiver</span>
            <span className="text-slate-400 hidden md:inline">·</span>
            <span className="hidden md:inline text-slate-600">
              Gravel &amp; Route au retour du printemps
            </span>
          </div>

          <div className="flex items-center gap-3.5 text-[11px] text-slate-600">
            <button
              onClick={onOpenQuiz}
              className="text-slate-700 hover:text-[#1e2f47] font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Calculer mon niveau KM0</span>
            </button>

            <span className="text-slate-300 hidden sm:inline">|</span>

            {/* Member Portal Link in Top Bar */}
            {currentMember ? (
              <button
                onClick={onOpenMemberPortal}
                className="text-[#1e2f47] hover:text-[#152336] font-bold flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded transition-colors"
              >
                <UserCheck className="w-3 h-3 text-[#1e2f47]" />
                <span>Espace Membre ({currentMember.firstName})</span>
              </button>
            ) : (
              <button
                onClick={onOpenMemberLogin}
                className="text-stone-700 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3 h-3 text-stone-500" />
                <span>Connexion Membre</span>
              </button>
            )}

            <span className="text-stone-300 hidden md:inline">|</span>

            {/* Back-office Direct Link */}
            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAdminDashboard}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                <Settings className="w-3 h-3 text-emerald-600" />
                <span>Back-Office (Guy M.)</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="text-stone-600 hover:text-stone-950 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-stone-400" />
                <span>Accès Référent</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200'
            : 'bg-white/90 backdrop-blur-sm border-b border-stone-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="flex flex-col items-center">
              <img
                src="/assets/aistudio/km0-logobike_Bleu_f5171d81.png"
                alt="KM ZERO Belgique"
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
              {/* Belgian flag stripe under logo */}
              <div className="flex h-1.5 w-14 rounded-full overflow-hidden shadow-xs mt-1 border border-stone-200">
                <div className="w-1/3 bg-black" />
                <div className="w-1/3 bg-[#facc15]" />
                <div className="w-1/3 bg-[#ef4444]" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl sm:text-2xl font-black tracking-wide uppercase text-slate-900">
                  PROJET KM0
                </span>
                <span className="bg-sky-100 text-sky-900 text-[10px] font-black px-1.5 py-0.5 rounded tracking-widest border border-sky-300">
                  BELGIQUE
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Club Cycliste · VTT Hiver · Gravel &amp; Route
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-[#1e2f47] text-sm font-semibold tracking-wide transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#1e2f47] after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Member Portal Button */}
            {currentMember ? (
              <button
                onClick={onOpenMemberPortal}
                className="px-3.5 py-2 text-xs font-bold text-[#1e2f47] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#1e2f47]" />
                <span>Mon Espace ({currentMember.firstName})</span>
              </button>
            ) : (
              <button
                onClick={onOpenMemberLogin}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Connexion Membre</span>
              </button>
            )}

            {isAdminLoggedIn && (
              <button
                onClick={onOpenAdminDashboard}
                className="px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-700" />
                <span>Back-Office</span>
              </button>
            )}

            <button
              onClick={onOpenMembership}
              className="px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white bg-[#1e2f47] hover:bg-[#152336] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Bike className="w-3.5 h-3.5 text-white" />
              <span>Rejoindre le Club</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenMembership}
              className="sm:hidden px-3 py-1.5 text-xs font-bold uppercase text-white bg-[#1e2f47] hover:bg-[#152336] rounded-lg"
            >
              Club
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-stone-800 hover:text-[#1e2f47] py-2 text-base font-semibold border-b border-stone-100"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2.5">
              {currentMember ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMemberPortal();
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold uppercase text-[#1e2f47] bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-[#1e2f47]" />
                  <span>Mon Espace Membre ({currentMember.firstName})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMemberLogin();
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-stone-700 bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-stone-500" />
                  <span>Connexion Espace Membre</span>
                </button>
              )}

              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminDashboard();
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold uppercase text-emerald-900 bg-emerald-100 border border-emerald-300 rounded-xl"
                >
                  Ouvrir le Back-Office (Guy Materne)
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMembership();
                }}
                className="w-full py-3 text-center text-xs font-extrabold uppercase text-white bg-[#1e2f47] hover:bg-[#152336] rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Bike className="w-4 h-4" />
                <span>Adhérer au Club KM0 Belgique</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
