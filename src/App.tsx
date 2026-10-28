import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SeasonPhilosophy from './components/SeasonPhilosophy';
import WeeklyScheduleSection from './components/WeeklyScheduleSection';
import RideCalendar from './components/RideCalendar';
import RideDetailModal from './components/RideDetailModal';
import TripsSection from './components/TripsSection';
import TripDetailModal from './components/TripDetailModal';
import LevelMatrix from './components/LevelMatrix';
import LevelQuizModal from './components/LevelQuizModal';
import BelgianSpirit from './components/BelgianSpirit';
import ClubMembership from './components/ClubMembership';
import MembershipModal from './components/MembershipModal';
import FaqAndContact from './components/FaqAndContact';
import Footer from './components/Footer';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';

import { Ride } from './data/rides';
import { Trip } from './data/trips';
import { MembershipTier, MEMBERSHIP_TIERS } from './data/club';
import { Settings, ShieldCheck, ArrowRight, LayoutDashboard } from 'lucide-react';

function AppContent() {
  const { isAdminLoggedIn, adminEmail, membershipTiers } = useApp();

  // Navigation mode: public website vs back-office view
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Public modals state
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const handleOpenDefaultMembership = () => {
    const activeTiers = membershipTiers.filter((t) => t.active !== false);
    const recommended = activeTiers.find((t) => t.recommended) || activeTiers[0] || MEMBERSHIP_TIERS[1];
    setSelectedTier(recommended);
  };

  const handleScrollToCalendar = () => {
    const el = document.getElementById('calendrier');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If back-office view is active, render full-featured Admin Dashboard!
  if (isAdminView) {
    return (
      <AdminDashboard onBackToSite={() => setIsAdminView(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Admin Quick Bar when logged in */}
      {isAdminLoggedIn && (
        <div className="bg-amber-400 text-stone-950 px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-amber-500 shadow-xs z-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-stone-900" />
            <span>Mode Gestionnaire Actif · Connecté en tant que <strong>{adminEmail}</strong></span>
          </div>
          <button
            onClick={() => setIsAdminView(true)}
            className="px-3 py-1 bg-stone-950 text-amber-300 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] font-extrabold"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Ouvrir le Back-Office (Éditer Sorties &amp; Voyages)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenMembership={handleOpenDefaultMembership}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminView(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero with Seasonal Switcher */}
        <Hero
          onExploreCalendar={handleScrollToCalendar}
          onJoinClub={handleOpenDefaultMembership}
          onOpenQuiz={() => setIsQuizOpen(true)}
        />

        {/* 4 Seasons Philosophy (VTT l'hiver, Gravel & Route le reste de l'année) */}
        <SeasonPhilosophy />

        {/* Weekly Regular Rides */}
        <WeeklyScheduleSection />

        {/* Rides Agenda & Interactive Calendar (Connected to Back-office) */}
        <RideCalendar
          onSelectRide={(ride) => setSelectedRide(ride)}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        />

        {/* Trips & Training Camps with Projet KM0 Switzerland link (Connected to Back-office) */}
        <TripsSection onSelectTrip={(trip) => setSelectedTrip(trip)} />

        {/* Levels Scale (T1-T5 / P1-P5) */}
        <LevelMatrix onOpenQuiz={() => setIsQuizOpen(true)} />

        {/* The Belgian Reference Guy Materne & Clubhouse Culture */}
        <BelgianSpirit />

        {/* Membership Plans & Official Jersey */}
        <ClubMembership onSelectTier={(tier) => setSelectedTier(tier)} />

        {/* FAQ & Contact Guy Materne */}
        <FaqAndContact />
      </main>

      {/* Footer */}
      <Footer onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />

      {/* Modals */}
      <RideDetailModal
        ride={selectedRide}
        onClose={() => setSelectedRide(null)}
      />

      <TripDetailModal
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />

      <MembershipModal
        isOpen={!!selectedTier}
        tier={selectedTier}
        onClose={() => setSelectedTier(null)}
      />

      <LevelQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectGroup={() => handleScrollToCalendar()}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminView(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
