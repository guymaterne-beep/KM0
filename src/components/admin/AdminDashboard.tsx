import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Ride } from '../../data/rides';
import { Trip } from '../../data/trips';
import { ClubMember, MembershipTier, PaymentTransaction, StripeConfig, BankConfig } from '../../data/club';

import RideFormModal from './RideFormModal';
import TripFormModal from './TripFormModal';
import MemberFormModal from './MemberFormModal';
import TierFormModal from './TierFormModal';
import EmailComposerModal from './EmailComposerModal';

import {
  Bike,
  Compass,
  Users,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  LogOut,
  ArrowLeft,
  FileSpreadsheet,
  RotateCcw,
  Search,
  Tag,
  Mail,
  Shield,
  Send,
  UserCheck,
  Check,
  DollarSign,
  TrendingUp,
  Sparkles,
  CreditCard,
  Building2,
  Lock,
  Smartphone,
  ExternalLink,
  Receipt,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export default function AdminDashboard({ onBackToSite }: AdminDashboardProps) {
  const {
    rides,
    trips,
    registrations,
    members,
    membershipTiers,
    sentEmails,
    transactions,
    stripeConfig,
    bankConfig,
    confirmWirePayment,
    updateStripeConfig,
    updateBankConfig,
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
    addMember,
    updateMember,
    deleteMember,
    updateMemberRole,
    toggleNewsletterSubscription,
    addMembershipTier,
    updateMembershipTier,
    deleteMembershipTier,
    toggleTierActive,
    setRecommendedTier,
    resetToDefault,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'members' | 'tiers' | 'mailing' | 'payments' | 'rides' | 'trips' | 'registrations' | 'overview'>('members');

  // Modals state
  const [isRideModalOpen, setIsRideModalOpen] = useState(false);
  const [rideToEdit, setRideToEdit] = useState<Ride | null>(null);

  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<ClubMember | null>(null);

  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [tierToEdit, setTierToEdit] = useState<MembershipTier | null>(null);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Search & Filters in admin tables
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterMemberStatus, setFilterMemberStatus] = useState('all');
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<'all' | 'paid' | 'pending'>('all');

  // Stripe & Bank local settings state
  const [stripeForm, setStripeForm] = useState<StripeConfig>(stripeConfig);
  const [bankForm, setBankForm] = useState<BankConfig>(bankConfig);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  useEffect(() => {
    setStripeForm(stripeConfig);
  }, [stripeConfig]);

  useEffect(() => {
    setBankForm(bankConfig);
  }, [bankConfig]);

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStripeConfig(stripeForm);
    updateBankConfig(bankForm);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  // Stats calculation
  const totalMembersCount = members.length;
  const activeMembersCount = members.filter((m) => m.status === 'active').length;
  const captainsCount = members.filter((m) => m.role === 'captain').length;
  const subscribersCount = members.filter((m) => m.subscribedToNewsletter).length;
  const totalRidesCount = rides.length;
  const totalTripsCount = trips.length;
  const totalRegistrationsCount = registrations.length;
  const totalIncome = transactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingWireCount = transactions.filter((t) => t.status === 'pending').length;

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

  // Handlers for Members
  const handleOpenNewMember = () => {
    setMemberToEdit(null);
    setIsMemberModalOpen(true);
  };

  const handleEditMember = (member: ClubMember) => {
    setMemberToEdit(member);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (memberData: any) => {
    if (memberToEdit) {
      updateMember(memberToEdit.id, memberData);
    } else {
      addMember(memberData);
    }
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous la suppression du membre "${name}" ?`)) {
      deleteMember(id);
    }
  };

  // Handlers for Membership Tiers
  const handleOpenNewTier = () => {
    setTierToEdit(null);
    setIsTierModalOpen(true);
  };

  const handleEditTier = (tier: MembershipTier) => {
    setTierToEdit(tier);
    setIsTierModalOpen(true);
  };

  const handleSaveTier = (tierData: any) => {
    if (tierToEdit) {
      updateMembershipTier(tierToEdit.id, tierData);
    } else {
      addMembershipTier(tierData);
    }
  };

  const handleDeleteTier = (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous la suppression de la formule "${name}" ?`)) {
      deleteMembershipTier(id);
    }
  };

  // CSV Exports
  const exportMembersCsv = () => {
    const headers = ['ID', 'Nom', 'Prenom', 'Email', 'Telephone', 'Ville', 'Role', 'Statut', 'Formule', 'Echeance', 'MailingList'];
    const rows = members.map((m) => [
      m.id,
      `"${m.lastName.replace(/"/g, '""')}"`,
      `"${m.firstName.replace(/"/g, '""')}"`,
      m.email,
      m.phone,
      `"${m.city}"`,
      m.role,
      m.status,
      `"${m.membershipTierName}"`,
      m.expirationDate,
      m.subscribedToNewsletter ? 'OUI' : 'NON',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KM0_Membres_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMailingListCsv = () => {
    const subscribers = members.filter((m) => m.subscribedToNewsletter);
    const headers = ['Nom', 'Prenom', 'Email', 'Ville', 'Role', 'Statut'];
    const rows = subscribers.map((m) => [
      `"${m.lastName.replace(/"/g, '""')}"`,
      `"${m.firstName.replace(/"/g, '""')}"`,
      m.email,
      `"${m.city}"`,
      m.role,
      m.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KM0_MailingList_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTransactionsCsv = () => {
    const headers = ['ID', 'Date', 'Nom', 'Email', 'Montant_EUR', 'Objet', 'Mode', 'Statut', 'Reference', 'Communication_Structuree'];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.date}"`,
      `"${t.memberName.replace(/"/g, '""')}"`,
      t.memberEmail,
      t.amount,
      `"${t.description.replace(/"/g, '""')}"`,
      t.method,
      t.status,
      `"${t.reference}"`,
      `"${t.structuredCommunication || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KM0_Paiements_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    if (filterRole !== 'all' && m.role !== filterRole) return false;
    if (filterMemberStatus !== 'all' && m.status !== filterMemberStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered rides
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

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filterPaymentStatus !== 'all' && t.status !== filterPaymentStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        t.memberName.toLowerCase().includes(q) ||
        t.memberEmail.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q)
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
                  Administrateur
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Connecté en tant que <strong className="text-stone-700">{adminEmail}</strong> (Guy Materne)
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

        {/* Tab Navigation with ALL requested features */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-stone-100">
          {[
            { id: 'members', label: 'Membres & Rôles', count: members.length, icon: Users },
            { id: 'tiers', label: 'Abonnements & Tarifs', count: membershipTiers.length, icon: Tag },
            { id: 'mailing', label: 'Mailing List & Newsletters', count: subscribersCount, icon: Mail },
            { id: 'payments', label: 'Paiements & Stripe', count: transactions.length, icon: CreditCard },
            { id: 'rides', label: 'Activités & Sorties', count: rides.length, icon: Bike },
            { id: 'trips', label: 'Voyages & Stages', count: trips.length, icon: Compass },
            { id: 'registrations', label: 'Inscriptions Reçues', count: registrations.length, icon: UserCheck },
            { id: 'overview', label: 'Vue d’ensemble', icon: TrendingUp },
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
        {/* ========================================================= */}
        {/* TAB 1: MEMBERS & ROLES MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'members' && (
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
                    placeholder="Rechercher nom, ville, email..."
                    className="pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 w-56"
                  />
                </div>

                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Administrateurs</option>
                  <option value="captain">Capitaines de route</option>
                  <option value="member">Membres adhérents</option>
                </select>

                <select
                  value={filterMemberStatus}
                  onChange={(e) => setFilterMemberStatus(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="all">Tous statuts</option>
                  <option value="active">Actifs</option>
                  <option value="pending">En attente</option>
                  <option value="expired">Expirés</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportMembersCsv}
                  className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exporter CSV</span>
                </button>

                <button
                  onClick={handleOpenNewMember}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Membre</span>
                </button>
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Membre &amp; Contact</th>
                      <th className="py-3 px-4">Rôle &amp; Droits</th>
                      <th className="py-3 px-4">Statut Cotisation</th>
                      <th className="py-3 px-4">Formule d’adhésion</th>
                      <th className="py-3 px-4">Mailing List</th>
                      <th className="py-3 px-4">Échéance</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-amber-50/20 transition-colors">
                        {/* Member Identity */}
                        <td className="py-3.5 px-4 font-semibold text-stone-900">
                          <div className="font-bold text-stone-900 text-sm">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-[11px] text-stone-500 font-normal">
                            {member.email} · {member.phone}
                          </div>
                          <div className="text-[10px] text-stone-400 font-medium">
                            {member.city} ({member.postalCode}) · Maillot {member.jerseySize}
                          </div>
                        </td>

                        {/* Role selector dropdown in place */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={member.role}
                            onChange={(e) => updateMemberRole(member.id, e.target.value as any)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none ${
                              member.role === 'admin'
                                ? 'bg-purple-50 text-purple-900 border-purple-200'
                                : member.role === 'captain'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            }`}
                          >
                            <option value="member">Membre adhérent</option>
                            <option value="captain">Capitaine de route</option>
                            <option value="admin">Administrateur</option>
                          </select>
                        </td>

                        {/* Membership Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              member.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : member.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {member.status === 'active'
                              ? 'Cotisation Active'
                              : member.status === 'pending'
                              ? 'En attente'
                              : 'Expiré'}
                          </span>
                        </td>

                        {/* Tier */}
                        <td className="py-3.5 px-4 text-stone-700">
                          <div className="font-semibold">{member.membershipTierName}</div>
                          <div className="text-[11px] text-stone-400 capitalize">
                            Pratique : {member.preferredDiscipline}
                          </div>
                        </td>

                        {/* Newsletter Toggle */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleNewsletterSubscription(member.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              member.subscribedToNewsletter
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                            }`}
                            title="Cliquer pour basculer l'inscription à la newsletter"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{member.subscribedToNewsletter ? 'Abonné' : 'Désabonné'}</span>
                          </button>
                        </td>

                        {/* Expiration date */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                          {member.expirationDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditMember(member)}
                              className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                              title="Modifier la fiche membre"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id, `${member.firstName} ${member.lastName}`)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer ce membre"
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

        {/* ========================================================= */}
        {/* TAB 2: MEMBERSHIP TIERS & DYNAMIC PRICING */}
        {/* ========================================================= */}
        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-stone-900">
                  Formules d’Adhésion &amp; Tarifs du Club ({membershipTiers.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Créez librement de nouvelles formules, ajustez les prix en euros et gérez les avantages inclus. Les modifications sont répercutées en direct sur le site public.
                </p>
              </div>

              <button
                onClick={handleOpenNewTier}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Formule d’Adhésion</span>
              </button>
            </div>

            {/* Tiers Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between relative ${
                    tier.recommended
                      ? 'border-2 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                      : tier.active === false
                      ? 'border-stone-200 opacity-60 bg-stone-50'
                      : 'border-stone-200 shadow-xs'
                  }`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-3 left-6 bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-2xs">
                      Recommandée
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {tier.badge || 'Formule Club'}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditTier(tier)}
                          className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Modifier les tarifs et textes"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTier(tier.id, tier.name)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer cette formule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-display text-2xl font-bold uppercase text-stone-900 mb-1">
                      {tier.name}
                    </h4>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-display text-4xl font-black text-amber-600">
                        {tier.pricePerYear} €
                      </span>
                      <span className="text-xs text-stone-500 font-mono">
                        {tier.period}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {tier.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">Statut affichage :</span>
                      <button
                        onClick={() => toggleTierActive(tier.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                          tier.active !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {tier.active !== false ? 'Actif sur le site' : 'Désactivé'}
                      </button>
                    </div>

                    {!tier.recommended && (
                      <button
                        onClick={() => setRecommendedTier(tier.id)}
                        className="w-full py-1.5 text-[11px] font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Définir comme Formule Recommandée
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MAILING LIST & EMAIL BROADCAST */}
        {/* ========================================================= */}
        {activeTab === 'mailing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-stone-900">
                  Mailing List du Club KM0 Belgique ({subscribersCount} abonnés)
                </h3>
                <p className="text-xs text-stone-500">
                  Communiquez directement avec vos coureurs : briefings météo du samedi, convocations, ouvertures de stages.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportMailingListCsv}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exporter la Liste en CSV</span>
                </button>

                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Rédiger un Email / Broadcast</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Abonnés Actifs
                </span>
                <div className="font-display text-3xl font-black text-stone-900">
                  {subscribersCount} / {members.length}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {Math.round((subscribersCount / (members.length || 1)) * 100)}% de taux d’inscription
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Capitaines de Route Inscrits
                </span>
                <div className="font-display text-3xl font-black text-amber-600">
                  {captainsCount}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Guides brevetés pour les rides hebdos</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Campagnes &amp; Messages Envoyés
                </span>
                <div className="font-display text-3xl font-black text-stone-900">
                  {sentEmails.length}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Historique des broadcasts récents</p>
              </div>
            </div>

            {/* Sent Emails History Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
              <h4 className="font-display text-base font-bold uppercase text-stone-900">
                Historique des Broadcasts Récents
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase">
                      <th className="py-2.5 px-3">Date d’envoi</th>
                      <th className="py-2.5 px-3">Objet</th>
                      <th className="py-2.5 px-3">Segment Cible</th>
                      <th className="py-2.5 px-3">Destinataires</th>
                      <th className="py-2.5 px-3">Aperçu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {sentEmails.map((email) => (
                      <tr key={email.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3 font-mono text-stone-500 whitespace-nowrap">
                          {email.dateSent}
                        </td>
                        <td className="py-3 px-3 font-bold text-stone-900">
                          {email.subject}
                        </td>
                        <td className="py-3 px-3 text-stone-600">
                          {email.targetSegment}
                        </td>
                        <td className="py-3 px-3 font-bold text-amber-700 font-mono">
                          {email.recipientsCount}
                        </td>
                        <td className="py-3 px-3 text-stone-500 max-w-xs truncate">
                          {email.previewSnippet}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PAYMENTS & STRIPE CONFIGURATION */}
        {/* ========================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Total Encaissé
                </span>
                <div className="font-display text-3xl font-black text-amber-600">
                  {totalIncome} €
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  {transactions.filter((t) => t.status === 'paid').length} transactions validées
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Virements en attente
                </span>
                <div className={`font-display text-3xl font-black ${pendingWireCount > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
                  {pendingWireCount}
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  {pendingWireCount > 0 ? 'À valider manuellement' : 'Aucun virement en souffrance'}
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Passerelle Stripe
                </span>
                <div className="font-display text-xl font-black text-stone-900 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stripeConfig.mode === 'live' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  <span>{stripeConfig.mode === 'live' ? 'Mode Production' : 'Mode Test Démo'}</span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Apple Pay &amp; Cartes actives
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Compte Bancaire Belge
                </span>
                <div className="font-mono text-sm font-bold text-stone-900 truncate">
                  {bankConfig.iban}
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  {bankConfig.accountHolder}
                </p>
              </div>
            </div>

            {/* Gateway & Banking Settings Form */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-100">
                <div>
                  <h3 className="font-display text-base font-bold uppercase text-stone-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Configuration Passerelle Stripe &amp; Coordonnées Bancaires</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Renseignez vos clés API Stripe (compte existant) et le compte du club pour les virements belges sans frais.
                  </p>
                </div>
                {saveSettingsSuccess && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Paramètres enregistrés !</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleSavePaymentSettings} className="space-y-6">
                {/* Stripe Config */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Paramètres Stripe</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Mode Stripe
                      </label>
                      <select
                        value={stripeForm.mode}
                        onChange={(e) =>
                          setStripeForm({ ...stripeForm, mode: e.target.value as 'test' | 'live' })
                        }
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                      >
                        <option value="test">Mode Test (Développement &amp; Essais)</option>
                        <option value="live">Mode Live (Production Réelle)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Clé Publique Stripe (Publishable Key)
                      </label>
                      <input
                        type="text"
                        value={stripeForm.publishableKey}
                        onChange={(e) =>
                          setStripeForm({ ...stripeForm, publishableKey: e.target.value })
                        }
                        placeholder="pk_test_... ou pk_live_..."
                        className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Clé Secrète Stripe (Secret Key)
                      </label>
                      <input
                        type="password"
                        value={stripeForm.secretKey}
                        onChange={(e) =>
                          setStripeForm({ ...stripeForm, secretKey: e.target.value })
                        }
                        placeholder="sk_test_... ou sk_live_..."
                        className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="applePayToggle"
                        checked={stripeForm.applePayEnabled}
                        onChange={(e) =>
                          setStripeForm({ ...stripeForm, applePayEnabled: e.target.checked })
                        }
                        className="rounded text-amber-500 border-stone-300"
                      />
                      <label htmlFor="applePayToggle" className="text-xs font-semibold text-stone-700">
                        Activer Apple Pay &amp; Google Pay
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bank Config */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                    <Building2 className="w-4 h-4 text-stone-800" />
                    <span>Coordonnées Bancaires Belges (Virements)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Titulaire du Compte
                      </label>
                      <input
                        type="text"
                        value={bankForm.accountHolder}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, accountHolder: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        IBAN Club
                      </label>
                      <input
                        type="text"
                        value={bankForm.iban}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, iban: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        BIC / SWIFT
                      </label>
                      <input
                        type="text"
                        value={bankForm.bic}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, bic: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Établissement Bancaire
                      </label>
                      <input
                        type="text"
                        value={bankForm.bankName}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, bankName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Enregistrer les clés &amp; paramètres de paiement
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions Ledger & Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher nom, email ou réf..."
                      className="pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 w-64"
                    />
                  </div>

                  <select
                    value={filterPaymentStatus}
                    onChange={(e) => setFilterPaymentStatus(e.target.value as any)}
                    className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="all">Tous les statuts ({transactions.length})</option>
                    <option value="paid">Payé en ligne</option>
                    <option value="pending">En attente de virement</option>
                  </select>
                </div>

                <button
                  onClick={exportTransactionsCsv}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exporter les transactions (CSV)</span>
                </button>
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Date &amp; Réf</th>
                        <th className="py-3 px-4">Adhérent / Payeur</th>
                        <th className="py-3 px-4">Objet &amp; Destination</th>
                        <th className="py-3 px-4">Mode</th>
                        <th className="py-3 px-4">Montant</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4 text-right">Action Virement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900 block">{tx.date}</span>
                            <span className="font-mono text-[11px] text-stone-400 block">{tx.reference}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900 block">{tx.memberName}</span>
                            <span className="text-[11px] text-stone-500">{tx.memberEmail}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-800 block">{tx.description}</span>
                            {tx.structuredCommunication && (
                              <span className="inline-block mt-0.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                                Comm: {tx.structuredCommunication}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 capitalize">
                            <span className="inline-flex items-center gap-1 text-stone-700 font-medium">
                              {tx.method === 'stripe_card' && <CreditCard className="w-3.5 h-3.5 text-amber-600" />}
                              {tx.method === 'apple_pay' && <span className="font-bold"> Pay</span>}
                              {tx.method === 'bancontact' && <Smartphone className="w-3.5 h-3.5 text-blue-600" />}
                              {tx.method === 'wire_transfer' && <Building2 className="w-3.5 h-3.5 text-stone-600" />}
                              <span>{tx.method.replace('_', ' ')}</span>
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-black text-sm text-stone-900">{tx.amount} €</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${
                              tx.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {tx.status === 'paid' ? 'Payé' : 'En attente virement'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            {tx.status === 'pending' ? (
                              <button
                                onClick={() => confirmWirePayment(tx.id)}
                                className="px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                                title="Valider la réception sur le compte bancaire"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Valider virement</span>
                              </button>
                            ) : (
                              <span className="text-stone-400 text-xs font-medium">✓ Acquitté</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: RIDES MANAGEMENT (EXISTING PRESERVED) */}
        {/* ========================================================= */}
        {activeTab === 'rides' && (
          <div className="space-y-6">
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
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-stone-900">
                            {ride.registeredCount} / {ride.maxParticipants}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditRide(ride)}
                              className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRide(ride.id, ride.title)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer"
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

        {/* ========================================================= */}
        {/* TAB 5: TRIPS & CAMPS */}
        {/* ========================================================= */}
        {activeTab === 'trips' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <h3 className="font-display text-lg font-bold uppercase text-stone-900">
                Voyages &amp; Stages KM0 ({trips.length})
              </h3>
              <button
                onClick={handleOpenNewTrip}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Voyage / Stage</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {trip.country} · {trip.durationDays} Jours
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditTrip(trip)}
                          className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(trip.id, trip.title)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                    <div className="text-sm font-bold text-amber-600 font-mono mb-2">
                      {trip.priceEuro} € · {trip.dates}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: REGISTRATIONS */}
        {/* ========================================================= */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <h3 className="font-display text-lg font-bold uppercase text-stone-900">
                Inscriptions &amp; Réservations ({registrations.length})
              </h3>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase">
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Activité</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {registrations.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 px-4 font-bold">{r.name} ({r.email})</td>
                      <td className="py-3 px-4">{r.targetTitle}</td>
                      <td className="py-3 px-4 font-mono">{r.dateCreated}</td>
                      <td className="py-3 px-4">
                        <select
                          value={r.status}
                          onChange={(e) => updateRegistrationStatus(r.id, e.target.value as any)}
                          className="px-2 py-0.5 rounded border text-xs"
                        >
                          <option value="confirmé">Confirmé</option>
                          <option value="en_attente">En attente</option>
                          <option value="annulé">Annulé</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase text-stone-500 block mb-1">Membres Adhérents</span>
                <div className="font-display text-4xl font-black text-stone-900">{totalMembersCount}</div>
                <p className="text-xs text-stone-400 mt-1">{activeMembersCount} cotisations actives</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase text-stone-500 block mb-1">Formules d’Adhésion</span>
                <div className="font-display text-4xl font-black text-amber-600">{membershipTiers.length}</div>
                <p className="text-xs text-stone-400 mt-1">Tarifs modifiables en direct</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase text-stone-500 block mb-1">Abonnés Mailing List</span>
                <div className="font-display text-4xl font-black text-emerald-600">{subscribersCount}</div>
                <p className="text-xs text-stone-400 mt-1">Prêts à recevoir les broadcasts</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase text-stone-500 block mb-1">Sorties au Calendrier</span>
                <div className="font-display text-4xl font-black text-stone-900">{totalRidesCount}</div>
                <p className="text-xs text-stone-400 mt-1">VTT, Gravel &amp; Route</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold uppercase text-stone-900">
                  Réinitialiser les données de démonstration
                </h4>
                <p className="text-xs text-stone-500">
                  Restaure les membres, formules, sorties et voyages à leur état initial.
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Réinitialiser toutes les données aux valeurs par défaut ?')) {
                    resetToDefault();
                  }
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <RideFormModal
        isOpen={isRideModalOpen}
        rideToEdit={rideToEdit}
        onClose={() => setIsRideModalOpen(false)}
        onSave={handleSaveRide}
      />

      <TripFormModal
        isOpen={isTripModalOpen}
        tripToEdit={tripToEdit}
        onClose={() => setIsTripModalOpen(false)}
        onSave={handleSaveTrip}
      />

      <MemberFormModal
        isOpen={isMemberModalOpen}
        memberToEdit={memberToEdit}
        onClose={() => setIsMemberModalOpen(false)}
        onSave={handleSaveMember}
      />

      <TierFormModal
        isOpen={isTierModalOpen}
        tierToEdit={tierToEdit}
        onClose={() => setIsTierModalOpen(false)}
        onSave={handleSaveTier}
      />

      <EmailComposerModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
}
