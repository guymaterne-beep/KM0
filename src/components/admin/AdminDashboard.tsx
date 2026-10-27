import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ride } from '../../data/rides';
import { Trip } from '../../data/trips';
import RideFormModal from './RideFormModal';
import TripFormModal from './TripFormModal';
import {
  Bike,
  Compass,
  Users,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  LogOut,
  ArrowLeft,
  FileSpreadsheet,
  RotateCcw,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MapPin,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export default function AdminDashboard({ onBackToSite }: AdminDashboardProps) {
  const {
    rides,
    trips,
    registrations,
    adminEmail,
    logoutAdmin,
    addRide,
    updateRide,
    deleteRide,
    addTrip,
    updateTrip,
    deleteTrip,
    updateRegistrationStatus,
    deleteRegistration,
    resetToDefault,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'rides' | 'trips' | 'registrations'>('rides');

  // Modals state
  const [isRideModalOpen, setIsRideModalOpen] = useState(false);
  const [rideToEdit, setRideToEdit] = useState<Ride | null>(null);

  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);

  // Search & Filters in admin tables
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('all');

  // Stats calculation
  const totalRidesCount = rides.length;
  const totalTripsCount = trips.length;
  const totalRegistrationsCount = registrations.length;
  const totalSeats = rides.reduce((acc, r) => acc + r.maxParticipants, 0);
  const totalSeatsBooked = rides.reduce((acc, r) => acc + r.registeredCount, 0);

  // Handlers for Ride
  const handleOpenNewRide = () => {
    setRideToEdit(null);
    setIsRideModalOpen(true);
  };

  const handleEditRide = (ride: Ride) => {
    setRideToEdit(ride);
    setIsRideModalOpen(true);
  };

  const handleSaveRide = (rideData: any) => {
    if (rideToEdit) {
      updateRide(rideToEdit.id, rideData);
    } else {
      addRide(rideData);
    }
  };

  const handleDeleteRide = (id: string, title: string) => {
    if (window.confirm(`Confirmez-vous la suppression de l'activité "${title}" ?`)) {
      deleteRide(id);
    }
  };

  // Handlers for Trip
  const handleOpenNewTrip = () => {
    setTripToEdit(null);
    setIsTripModalOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setTripToEdit(trip);
    setIsTripModalOpen(true);
  };

  const handleSaveTrip = (tripData: any) => {
    if (tripToEdit) {
      updateTrip(tripToEdit.id, tripData);
    } else {
      addTrip(tripData);
    }
  };

  const handleDeleteTrip = (id: string, title: string) => {
    if (window.confirm(`Confirmez-vous la suppression du voyage "${title}" ?`)) {
      deleteTrip(id);
    }
  };

  // CSV Export for registrations
  const exportCsv = () => {
    const headers = ['ID', 'Type', 'Activité / Cible', 'Nom', 'Email', 'Téléphone', 'Date', 'Statut'];
    const rows = registrations.map((r) => [
      r.id,
      r.type,
      `"${r.targetTitle.replace(/"/g, '""')}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      r.email,
      r.phone,
      r.dateCreated,
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KM0_Inscriptions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredRides = rides.filter((r) => {
    if (filterDiscipline !== 'all' && r.discipline !== filterDiscipline) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.startLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredTrips = trips.filter((t) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-display text-xl font-black shadow-xs">
              KM0
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-extrabold uppercase tracking-wide text-stone-900">
                  BACK-OFFICE PROJET KM0
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Actif
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Connecté en tant que <strong className="text-stone-700">{adminEmail}</strong> (Référent Belgique)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToSite}
              className="px-3.5 py-2 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voir le Site Public</span>
            </button>

            <button
              onClick={() => {
                logoutAdmin();
                onBackToSite();
              }}
              className="p-2 text-stone-500 hover:text-red-600 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-stone-100">
          {[
            { id: 'rides', label: 'Gestion des Activités & Sorties', count: rides.length, icon: Bike },
            { id: 'trips', label: 'Gestion des Voyages & Stages', count: trips.length, icon: Compass },
            { id: 'registrations', label: 'Inscriptions & Réservations', count: registrations.length, icon: Users },
            { id: 'overview', label: 'Vue d’ensemble & Chiffres', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold tracking-wide uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-stone-950 font-extrabold bg-amber-50/50'
                    : 'border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-amber-200 text-amber-900 font-bold' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: RIDES MANAGEMENT */}
        {activeTab === 'rides' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrer par titre ou région..."
                    className="pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 w-60"
                  />
                </div>

                <select
                  value={filterDiscipline}
                  onChange={(e) => setFilterDiscipline(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="all">Toutes disciplines ({rides.length})</option>
                  <option value="vtt">VTT Hiver</option>
                  <option value="gravel">Gravel</option>
                  <option value="route">Route &amp; Pavés</option>
                </select>
              </div>

              <button
                onClick={handleOpenNewRide}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une Sortie / Activité</span>
              </button>
            </div>

            {/* Rides Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Activité &amp; Titre</th>
                      <th className="py-3 px-4">Discipline / Saison</th>
                      <th className="py-3 px-4">Date &amp; Heure</th>
                      <th className="py-3 px-4">Distance &amp; D+</th>
                      <th className="py-3 px-4">Région &amp; Départ</th>
                      <th className="py-3 px-4">Niveaux</th>
                      <th className="py-3 px-4">Inscrits</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredRides.map((ride) => (
                      <tr key={ride.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-stone-900 max-w-xs">
                          <div className="font-bold text-stone-900">{ride.title}</div>
                          <div className="text-[11px] text-stone-500 font-normal truncate">
                            Guide : {ride.guideName}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              ride.discipline === 'vtt'
                                ? 'bg-blue-100 text-blue-800'
                                : ride.discipline === 'gravel'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {ride.discipline.toUpperCase()}
                          </span>
                          <span className="text-stone-400 text-[11px] ml-1.5 font-medium capitalize">
                            · {ride.season}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-stone-700">
                          <div>{ride.date}</div>
                          <div className="text-[11px] text-stone-400">{ride.time} ({ride.estimatedHours})</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-stone-700">
                          <span className="font-bold">{ride.distanceKm} km</span>
                          <span className="text-amber-600 font-bold ml-1.5">+{ride.elevationM}m</span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                          <div className="font-medium text-stone-800">{ride.region}</div>
                          <div className="text-[11px] text-stone-400 truncate">{ride.startLocation}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-stone-600">
                          <span>T{ride.technicalLevel}</span> · <span>P{ride.physicalLevel}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-900">
                              {ride.registeredCount} / {ride.maxParticipants}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              ({ride.maxParticipants - ride.registeredCount} rest.)
                            </span>
                          </div>
                          <div className="w-16 bg-stone-100 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${(ride.registeredCount / ride.maxParticipants) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditRide(ride)}
                              className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                              title="Modifier cette activité"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRide(ride.id, ride.title)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer cette activité"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRIPS & CAMPS MANAGEMENT */}
        {activeTab === 'trips' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrer par titre ou destination..."
                  className="pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 w-64"
                />
              </div>

              <button
                onClick={handleOpenNewTrip}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Voyage / Stage</span>
              </button>
            </div>

            {/* Trips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                          {trip.country} · {trip.durationDays} Jours
                        </span>
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

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditTrip(trip)}
                          className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Modifier ce voyage"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(trip.id, trip.title)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer ce voyage"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-display text-xl font-bold uppercase text-stone-900 mb-1">
                      {trip.title}
                    </h4>
                    <p className="text-xs text-amber-700 font-medium mb-3">
                      {trip.subtitle}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-stone-50 rounded-xl border border-stone-200 text-center mb-4 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Dates</span>
                        <span className="font-semibold text-stone-800">{trip.dates}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Groupe</span>
                        <span className="font-semibold text-stone-800">{trip.groupSize}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Tarif</span>
                        <span className="font-bold text-amber-600">{trip.priceEuro} €</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                      {trip.coverDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>Guide responsable : <strong className="text-stone-800">{trip.guide}</strong></span>
                    <button
                      onClick={() => handleEditTrip(trip)}
                      className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Éditer la fiche →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REGISTRATIONS MANAGEMENT */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-stone-900">
                  Inscriptions &amp; Réservations Reçues ({registrations.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Consultez les participants inscrits aux sorties et pré-réservations de voyages.
                </p>
              </div>

              <button
                onClick={exportCsv}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Exporter en CSV</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Participant</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Type &amp; Activité demandée</th>
                      <th className="py-3 px-4">Détails</th>
                      <th className="py-3 px-4">Date demande</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-stone-400">
                          Aucune inscription pour le moment.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-amber-50/20 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-stone-900">
                            {reg.name}
                          </td>
                          <td className="py-3.5 px-4 text-stone-600">
                            <div>{reg.email}</div>
                            <div className="text-[11px] text-stone-400">{reg.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mr-1.5 ${
                                reg.type === 'ride'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {reg.type === 'ride' ? 'SORTIE' : 'VOYAGE'}
                            </span>
                            <span className="font-semibold text-stone-800">{reg.targetTitle}</span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                            {reg.details ? (
                              <span>
                                {reg.details.paceGroup ? `Allure: ${reg.details.paceGroup}` : ''}
                                {reg.details.bikeModel ? ` · Vélo: ${reg.details.bikeModel}` : ''}
                                {reg.details.participantsCount ? ` · Pers: ${reg.details.participantsCount}` : ''}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                            {reg.dateCreated}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={reg.status}
                              onChange={(e) => updateRegistrationStatus(reg.id, e.target.value as any)}
                              className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none ${
                                reg.status === 'confirmé'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : reg.status === 'en_attente'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-red-50 text-red-800 border-red-300'
                              }`}
                            >
                              <option value="confirmé">Confirmé</option>
                              <option value="en_attente">En attente</option>
                              <option value="annulé">Annulé</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Supprimer l'inscription de ${reg.name} ?`)) {
                                  deleteRegistration(reg.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OVERVIEW & KEY METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Activités au Calendrier</span>
                  <Bike className="w-5 h-5 text-amber-500" />
                </div>
                <div className="font-display text-4xl font-black text-stone-900">{totalRidesCount}</div>
                <p className="text-xs text-stone-400 mt-1">VTT Hiver, Gravel &amp; Route</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Voyages &amp; Stages</span>
                  <Compass className="w-5 h-5 text-blue-500" />
                </div>
                <div className="font-display text-4xl font-black text-stone-900">{totalTripsCount}</div>
                <p className="text-xs text-stone-400 mt-1">Belgique, Suisse &amp; Espagne</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Inscriptions Reçues</span>
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="font-display text-4xl font-black text-stone-900">{totalRegistrationsCount}</div>
                <p className="text-xs text-stone-400 mt-1">Participants enregistrés</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Taux de Remplissage</span>
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div className="font-display text-4xl font-black text-amber-600">
                  {Math.round((totalSeatsBooked / (totalSeats || 1)) * 100)} %
                </div>
                <p className="text-xs text-stone-400 mt-1">{totalSeatsBooked} places sur {totalSeats}</p>
              </div>
            </div>

            {/* Quick Actions & Reset demo */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-base font-bold uppercase text-stone-900">
                  Restauration des Données de Démonstration
                </h4>
                <p className="text-xs text-stone-500">
                  Vous pouvez réinitialiser le calendrier et les voyages aux valeurs par défaut si vous souhaitez recommencer une démo.
                </p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Voulez-vous réinitialiser toutes les activités et voyages aux valeurs par défaut ?')) {
                    resetToDefault();
                  }
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser les données initiales</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Ride Form Modal */}
      <RideFormModal
        isOpen={isRideModalOpen}
        rideToEdit={rideToEdit}
        onClose={() => setIsRideModalOpen(false)}
        onSave={handleSaveRide}
      />

      {/* Trip Form Modal */}
      <TripFormModal
        isOpen={isTripModalOpen}
        tripToEdit={tripToEdit}
        onClose={() => setIsTripModalOpen(false)}
        onSave={handleSaveTrip}
      />
    </div>
  );
}
