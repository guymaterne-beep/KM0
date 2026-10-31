import React, { useState, useMemo } from 'react';
import {
  X,
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  Clock3,
  XCircle,
  Plus,
  Bike,
  Download,
  AlertCircle,
  CreditCard,
  Building,
} from 'lucide-react';
import { Ride } from '../../data/rides';
import { Registration } from '../../context/AppContext';
import { ClubMember } from '../../data/club';

interface RideAttendeesModalProps {
  isOpen: boolean;
  ride: Ride | null;
  onClose: () => void;
  registrations: Registration[];
  members: ClubMember[];
  onUpdateRegistrationStatus: (id: string, status: Registration['status']) => void;
  onDeleteRegistration: (id: string) => void;
  onAddManualRegistration: (reg: Omit<Registration, 'id' | 'dateCreated' | 'status'>) => void;
}

export default function RideAttendeesModal({
  isOpen,
  ride,
  onClose,
  registrations = [],
  members = [],
  onUpdateRegistrationStatus,
  onDeleteRegistration,
  onAddManualRegistration,
}: RideAttendeesModalProps) {
  // ALL HOOKS MUST RUN UNCONDITIONALLY AT THE TOP
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Manual rider addition form
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderEmail, setNewRiderEmail] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderPace, setNewRiderPace] = useState('sport');
  const [newRiderBike, setNewRiderBike] = useState('');
  const [newRiderNotes, setNewRiderNotes] = useState('');
  const [newRiderPaid, setNewRiderPaid] = useState<number>(0);

  // Filter registrations for this specific ride (safe check)
  const rideRegistrations = useMemo(() => {
    if (!ride || !Array.isArray(registrations)) return [];
    return registrations.filter((r) => r && r.type === 'ride' && r.targetId === ride.id);
  }, [registrations, ride?.id]);

  // Search and status filtering (safe check)
  const filteredAttendees = useMemo(() => {
    if (!Array.isArray(rideRegistrations)) return [];
    return rideRegistrations.filter((reg) => {
      if (!reg) return false;
      if (statusFilter !== 'all' && reg.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (reg.name || '').toLowerCase();
        const email = (reg.email || '').toLowerCase();
        const phone = (reg.phone || '').toLowerCase();
        const bike = (reg.details?.bikeModel || '').toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q) || bike.includes(q);
      }
      return true;
    });
  }, [rideRegistrations, statusFilter, searchQuery]);

  // Cross-reference with registered club members safely
  const getMemberDetails = (email?: string) => {
    if (!email || !Array.isArray(members)) return undefined;
    return members.find((m) => m && m.email && m.email.toLowerCase() === email.toLowerCase().trim());
  };

  // Safe early exit only AFTER all hooks have executed
  if (!isOpen || !ride) {
    return null;
  }

  // Export CSV for the ride captain / guide
  const handleExportCsv = () => {
    const headers = [
      'Nom_Participant',
      'Email',
      'Telephone',
      'Statut_Inscription',
      'Membre_KM0',
      'Role_Club',
      'Groupe_Allure',
      'Velo_Materiel',
      'Notes_Dietetique',
      'Date_Inscription',
      'Mode_Paiement',
      'Montant_Paye_EUR',
    ];

    const rows = rideRegistrations.map((r) => {
      const member = getMemberDetails(r.email);
      return [
        `"${(r.name || '').replace(/"/g, '""')}"`,
        r.email || '',
        `"${r.phone || ''}"`,
        r.status || 'confirmé',
        member ? 'OUI' : 'NON',
        member?.role || 'visiteur',
        `"${r.details?.paceGroup || 'standard'}"`,
        `"${(r.details?.bikeModel || '').replace(/"/g, '""')}"`,
        `"${(r.details?.notes || '').replace(/"/g, '""')}"`,
        `"${r.dateCreated || ''}"`,
        r.paymentMethod || 'gratuit',
        r.amountPaid ?? 0,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const cleanTitle = (ride.title || 'sortie').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KM0_Inscrits_${cleanTitle}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group mailto
  const handleSendGroupEmail = () => {
    const validEmails = rideRegistrations
      .filter((r) => r.status !== 'annulé' && r.email)
      .map((r) => r.email);

    if (validEmails.length === 0) {
      alert('Aucun participant avec un email valide à contacter.');
      return;
    }

    const bccList = validEmails.join(',');
    const subject = encodeURIComponent(`[KM0 Belgique] Informations pour : ${ride.title} (${ride.date})`);
    const body = encodeURIComponent(
      `Bonjour chers cyclistes,\n\nVoici les dernières consignes pour notre sortie "${ride.title}" prévue le ${ride.date} à ${ride.time}.\n\nRendez-vous : ${ride.startAddress}\nCapitaine de route : ${ride.guideName}\n\nÀ très bientôt sur les sentiers !\nL'équipe KM0 Belgique`
    );

    window.location.href = `mailto:contact@projet-km0.ch?bcc=${bccList}&subject=${subject}&body=${body}`;
  };

  // Submit manual registration
  const handleAddManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiderName.trim() || !newRiderEmail.trim()) return;

    onAddManualRegistration({
      type: 'ride',
      targetId: ride.id,
      targetTitle: ride.title,
      name: newRiderName.trim(),
      email: newRiderEmail.trim(),
      phone: newRiderPhone.trim() || '+32 470 00 00 00',
      amountPaid: newRiderPaid,
      paymentMethod: newRiderPaid > 0 ? 'stripe_card' : 'gratuit',
      details: {
        paceGroup: newRiderPace,
        bikeModel: newRiderBike.trim() || 'Vélo personnel',
        notes: newRiderNotes.trim() || 'Ajout manuel depuis le back-office',
        isManualAdminAdd: true,
      },
    });

    setNewRiderName('');
    setNewRiderEmail('');
    setNewRiderPhone('');
    setNewRiderBike('');
    setNewRiderNotes('');
    setNewRiderPaid(0);
    setShowAddForm(false);
  };

  const confirmedCount = rideRegistrations.filter((r) => r.status === 'confirmé').length;
  const pendingCount = rideRegistrations.filter((r) => r.status === 'en_attente').length;
  const totalAmount = rideRegistrations.reduce((acc, r) => acc + (r.amountPaid || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-stone-950 truncate">
                  Liste des Inscrits · {ride.title}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Vue Back-office Sécurisée</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-0.5">
                <span className="flex items-center gap-1 font-semibold text-amber-800">
                  <Calendar className="w-3.5 h-3.5" />
                  {ride.date} à {ride.time}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {ride.startLocation}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-amber-600" />
                  Capitaine : {ride.guideName}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confidentiality Notice */}
        <div className="px-6 py-2.5 bg-amber-50/70 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Confidentialité des membres :</strong> Cette liste nominative est strictement réservée à l'administrateur et aux capitaines de route. Les visiteurs du site public ne voient jamais les noms ni les identités des participants (uniquement le compteur d'inscrits).
            </span>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="p-6 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 border-b border-stone-200">
          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Total Inscrits</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-2xl font-black text-stone-900">{rideRegistrations.length}</span>
              <span className="text-xs text-[#1e2f47] font-bold">(ouvert sans limite)</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#1e2f47] h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(15, rideRegistrations.length * 8))}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Confirmés</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-display text-2xl font-black text-emerald-700">{confirmedCount}</span>
              {pendingCount > 0 && (
                <span className="text-[11px] font-bold text-blue-700">({pendingCount} en attente)</span>
              )}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              Sortie ouverte à tous · Sans limite
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Adhérents Club KM0</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-2xl font-black text-amber-800">
                {rideRegistrations.filter((r) => getMemberDetails(r.email)).length}
              </span>
              <span className="text-xs text-stone-500 font-medium">membres actifs</span>
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Peloton prioritaire</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Paiements / Reçus</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-2xl font-black text-stone-900">{totalAmount} €</span>
              <span className="text-xs text-stone-500 font-medium">encaissés</span>
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Stripe / Bancontact / Virement</span>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-6 pb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-stone-100">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, téléphone, vélo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:outline-none"
            >
              <option value="all">Tous les statuts ({rideRegistrations.length})</option>
              <option value="confirmé">Confirmés uniquement ({confirmedCount})</option>
              <option value="en_attente">En attente ({pendingCount})</option>
              <option value="annulé">Annulés</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 text-xs font-bold bg-[#1e2f47] hover:bg-[#152336] text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inscrire un coureur</span>
            </button>

            <button
              onClick={handleSendGroupEmail}
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Envoyer un email groupé à tous les inscrits"
            >
              <Mail className="w-3.5 h-3.5 text-[#1e2f47]" />
              <span>Email au peloton</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Télécharger la feuille d'émargement CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exporter CSV</span>
            </button>
          </div>
        </div>

        {/* Collapsible Manual Rider Add Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddManualSubmit}
            className="p-5 mx-6 my-2 bg-amber-50/50 rounded-2xl border border-amber-300 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-700" />
                <span>Inscription manuelle d’un coureur (Back-office)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maxime Van Belleghem"
                  value={newRiderName}
                  onChange={(e) => setNewRiderName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: m.vanbelleghem@skynet.be"
                  value={newRiderEmail}
                  onChange={(e) => setNewRiderEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Téléphone mobile</label>
                <input
                  type="text"
                  placeholder="+32 470 12 34 56"
                  value={newRiderPhone}
                  onChange={(e) => setNewRiderPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Groupe d’allure</label>
                <select
                  value={newRiderPace}
                  onChange={(e) => setNewRiderPace(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                >
                  <option value="sport">Allure Sport (Tempo soutenu)</option>
                  <option value="cool">Allure Découverte / Conviviale</option>
                  <option value="inter">Allure Intermédiaire</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Modèle de vélo</label>
                <input
                  type="text"
                  placeholder="Ex: Specialized Diverge / BMC Fourstroke"
                  value={newRiderBike}
                  onChange={(e) => setNewRiderBike(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Montant payé (€)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newRiderPaid}
                  onChange={(e) => setNewRiderPaid(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-[#1e2f47] hover:bg-[#152336] text-white rounded-lg shadow-xs cursor-pointer"
              >
                Valider l'inscription
              </button>
            </div>
          </form>
        )}

        {/* Attendees List / Table */}
        <div className="p-6 flex-1">
          {filteredAttendees.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <Users className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="font-bold text-stone-800 text-sm">
                {searchQuery ? 'Aucun participant ne correspond à votre recherche' : 'Aucun inscrit pour le moment'}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {searchQuery
                  ? 'Essayez de modifier votre terme de recherche ou le filtre de statut.'
                  : 'Vous pouvez inscrire un membre manuellement ou partager le lien de la sortie.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 text-xs font-bold bg-amber-400 text-stone-950 rounded-xl hover:bg-amber-300 cursor-pointer"
                >
                  Inscrire le premier coureur
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Coureur / Contact</th>
                      <th className="py-3 px-4">Statut Club KM0</th>
                      <th className="py-3 px-4">Allure &amp; Vélo</th>
                      <th className="py-3 px-4">Date d'inscription</th>
                      <th className="py-3 px-4">Paiement</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredAttendees.map((reg) => {
                      const member = getMemberDetails(reg.email);
                      const initials = ((reg.name || 'C')
                        .trim()
                        .split(/\s+/)
                        .map((n) => n[0] || '')
                        .filter(Boolean)
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()) || 'KM';

                      return (
                        <tr key={reg.id} className="hover:bg-amber-50/20 transition-colors">
                          {/* Name & Contact */}
                          <td className="py-3.5 px-4 font-semibold text-stone-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-300 text-stone-800 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-stone-900 text-sm">{reg.name || 'Participant'}</div>
                                <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                                  {reg.email && (
                                    <a
                                      href={`mailto:${reg.email}`}
                                      className="hover:text-amber-700 flex items-center gap-1 font-medium underline"
                                    >
                                      <Mail className="w-3 h-3 text-stone-400" />
                                      <span>{reg.email}</span>
                                    </a>
                                  )}
                                  {reg.phone && (
                                    <>
                                      <span>•</span>
                                      <a
                                        href={`tel:${reg.phone}`}
                                        className="hover:text-amber-700 flex items-center gap-1 font-mono"
                                      >
                                        <Phone className="w-3 h-3 text-stone-400" />
                                        <span>{reg.phone}</span>
                                      </a>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Member Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {member ? (
                              <div>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    member.role === 'admin'
                                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                      : member.role === 'captain'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  }`}
                                >
                                  {member.role === 'admin'
                                    ? 'Administrateur'
                                    : member.role === 'captain'
                                    ? 'Capitaine de route'
                                    : 'Adhérent KM0'}
                                </span>
                                <div className="text-[10px] text-stone-500 mt-0.5">
                                  {member.membershipTierName || 'Adhérent actif'}
                                </div>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
                                Visiteur
                              </span>
                            )}
                          </td>

                          {/* Pace group & Bike */}
                          <td className="py-3.5 px-4 text-stone-700">
                            <div className="font-medium text-xs capitalize">
                              Groupe : {reg.details?.paceGroup || 'Standard'}
                            </div>
                            <div className="text-[11px] text-stone-500 truncate max-w-[160px]">
                              {reg.details?.bikeModel || 'Vélo non renseigné'}
                            </div>
                            {reg.details?.notes && (
                              <div
                                className="text-[10px] text-amber-700 italic truncate max-w-[160px]"
                                title={reg.details.notes}
                              >
                                Note : {reg.details.notes}
                              </div>
                            )}
                          </td>

                          {/* Date Created */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-stone-600 font-mono text-[11px]">
                            {reg.dateCreated || 'Récente'}
                          </td>

                          {/* Payment */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-stone-900">
                              {reg.amountPaid ? `${reg.amountPaid} €` : 'Inclus / Gratuit'}
                            </div>
                            <div className="text-[10px] text-stone-500 capitalize">
                              {reg.paymentMethod
                                ? reg.paymentMethod.replace('_', ' ')
                                : 'Compte club'}
                            </div>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={reg.status || 'confirmé'}
                              onChange={(e) =>
                                onUpdateRegistrationStatus(reg.id, e.target.value as any)
                              }
                              className={`px-2 py-1 text-[11px] font-bold rounded-lg border focus:outline-none ${
                                reg.status === 'confirmé'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : reg.status === 'en_attente'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-red-50 text-red-800 border-red-200'
                              }`}
                            >
                              <option value="confirmé">Confirmé</option>
                              <option value="en_attente">En attente</option>
                              <option value="annulé">Annulé</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Désinscrire ${reg.name || 'ce coureur'} de cette sortie ? Cela libérera une place dans le peloton.`
                                  )
                                ) {
                                  onDeleteRegistration(reg.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Désinscrire ce participant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-stone-500">
            Affichage de <strong className="text-stone-800">{filteredAttendees.length}</strong> coureurs sur{' '}
            <strong className="text-stone-800">{rideRegistrations.length}</strong> inscrits au total.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-200 hover:bg-stone-300 rounded-xl transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
