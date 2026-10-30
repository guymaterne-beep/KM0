import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClubMember } from '../../data/club';
import { X, UserPlus, Save, Shield, Mail, CheckCircle2 } from 'lucide-react';

interface MemberFormModalProps {
  isOpen: boolean;
  memberToEdit: ClubMember | null;
  onClose: () => void;
  onSave: (memberData: any) => void;
}

export default function MemberFormModal({ isOpen, memberToEdit, onClose, onSave }: MemberFormModalProps) {
  const { membershipTiers } = useApp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    postalCode: '',
    role: 'member' as ClubMember['role'],
    status: 'active' as ClubMember['status'],
    membershipTierId: 'tier-annual',
    membershipTierName: 'Membre Club KM0 Belgique',
    expirationDate: '2027-10-31',
    jerseySize: 'M' as ClubMember['jerseySize'],
    subscribedToNewsletter: true,
    preferredDiscipline: 'all' as ClubMember['preferredDiscipline'],
    notes: '',
  });

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        firstName: memberToEdit.firstName,
        lastName: memberToEdit.lastName,
        email: memberToEdit.email,
        phone: memberToEdit.phone,
        city: memberToEdit.city,
        postalCode: memberToEdit.postalCode,
        role: memberToEdit.role,
        status: memberToEdit.status,
        membershipTierId: memberToEdit.membershipTierId,
        membershipTierName: memberToEdit.membershipTierName,
        expirationDate: memberToEdit.expirationDate,
        jerseySize: memberToEdit.jerseySize,
        subscribedToNewsletter: memberToEdit.subscribedToNewsletter,
        preferredDiscipline: memberToEdit.preferredDiscipline,
        notes: memberToEdit.notes || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: 'Bruxelles',
        postalCode: '1000',
        role: 'member',
        status: 'active',
        membershipTierId: membershipTiers[0]?.id || 'tier-annual',
        membershipTierName: membershipTiers[0]?.name || 'Membre Club KM0 Belgique',
        expirationDate: '2027-10-31',
        jerseySize: 'M',
        subscribedToNewsletter: true,
        preferredDiscipline: 'all',
        notes: '',
      });
    }
  }, [memberToEdit, isOpen, membershipTiers]);

  if (!isOpen) return null;

  const handleTierChange = (tierId: string) => {
    const selected = membershipTiers.find((t) => t.id === tierId);
    setFormData({
      ...formData,
      membershipTierId: tierId,
      membershipTierName: selected ? selected.name : formData.membershipTierName,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-600" />
            <h3 className="font-display text-xl font-bold uppercase text-stone-900">
              {memberToEdit ? `Modifier le Profil de ${memberToEdit.firstName} ${memberToEdit.lastName}` : 'Ajouter un Nouveau Membre / Utilisateur'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Ex: Philippe"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Ex: Gilbert"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Adresse Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="cycliste@club.be"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Numéro de Téléphone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+32 470 00 00 00"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Role & Status (CRITICAL FOR USER REQUIREMENT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Rôle &amp; Droits d’Accès *</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white border border-amber-300 rounded-xl text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="member">Membre Adhérent (Accès rides, club, remises)</option>
                <option value="captain">Capitaine de Route (Encadrement, guide de sorties)</option>
                <option value="admin">Administrateur (Gestion complète back-office &amp; tarifs)</option>
              </select>
              <p className="text-[11px] text-amber-800 mt-1">
                {formData.role === 'admin'
                  ? 'Accès illimité au Back-Office, modification des prix, gestion des membres.'
                  : formData.role === 'captain'
                  ? 'Peut mener des pelotons, être désigné guide et assister le staff.'
                  : 'Membre régulier avec licence et accès au calendrier.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-900 mb-1">
                Statut de la Cotisation *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white border border-amber-300 rounded-xl text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="active">Actif (Cotisation réglée &amp; valide)</option>
                <option value="pending">En attente (Virement ou certificat en cours)</option>
                <option value="expired">Expiré (Nécessite un renouvellement)</option>
              </select>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-800 font-mono">
                <span>Échéance :</span>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="px-2 py-0.5 bg-white border border-amber-300 rounded text-xs text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Membership Tier & Discipline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Formule d’adhésion
              </label>
              <select
                value={formData.membershipTierId}
                onChange={(e) => handleTierChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                {membershipTiers.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name} ({tier.pricePerYear} €)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Taille Maillot Officiel
              </label>
              <select
                value={formData.jerseySize}
                onChange={(e) => setFormData({ ...formData, jerseySize: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Pratique Favorite
              </label>
              <select
                value={formData.preferredDiscipline}
                onChange={(e) => setFormData({ ...formData, preferredDiscipline: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="all">4 Saisons (VTT + Gravel + Route)</option>
                <option value="vtt">VTT Hiver</option>
                <option value="gravel">Gravel</option>
                <option value="route">Route &amp; Classiques</option>
              </select>
            </div>
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ex: Wavre, Liège, Namur..."
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Code Postal
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="Ex: 1300"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Newsletter Subscription Toggle */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  Abonnement à la Mailing List &amp; Newsletters
                </span>
                <span className="text-[11px] text-stone-500">
                  Recevoir les annonces de sorties hebdos, météo et invitations voyages.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              id="newsSub"
              checked={formData.subscribedToNewsletter}
              onChange={(e) => setFormData({ ...formData, subscribedToNewsletter: e.target.checked })}
              className="w-5 h-5 rounded text-amber-500 border-stone-300 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Notes internes du club
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ex: Passionné d'Ardennes, capitaine adjoint sur les hivernales..."
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{memberToEdit ? 'Enregistrer les modifications' : 'Créer le membre'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
