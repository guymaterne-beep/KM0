import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MembershipTier, PaymentTransaction } from '../data/club';
import { X, CheckCircle2, Bike, Lock, ShieldCheck } from 'lucide-react';
import { PaymentCheckoutModal } from './payment/PaymentCheckoutModal';

interface MembershipModalProps {
  isOpen: boolean;
  tier: MembershipTier | null;
  onClose: () => void;
  onOpenPortal?: () => void;
}

export default function MembershipModal({
  isOpen,
  tier,
  onClose,
  onOpenPortal,
}: MembershipModalProps) {
  if (!isOpen || !tier) return null;

  const { addRegistration } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    city: '',
    postalCode: '',
    jerseySize: 'M',
    preferredDiscipline: 'all',
    medicalCertOk: true,
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleInitialFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (formData.password.length < 4) {
      setPasswordError('Le mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    // Open checkout modal
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (tx: PaymentTransaction) => {
    setCompletedTx(tx);
    setIsCheckoutOpen(false);

    // Add registration with payment reference
    addRegistration({
      type: 'membership',
      targetId: tier.id,
      targetTitle: `Adhésion : ${tier.name}`,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      paymentId: tx.id,
      paymentMethod: tx.method,
      amountPaid: tx.amount,
      details: {
        city: formData.city,
        postalCode: formData.postalCode,
        jerseySize: formData.jerseySize,
        preferredDiscipline: formData.preferredDiscipline,
        price: tier.pricePerYear,
        reference: tx.reference,
        structuredCommunication: tx.structuredCommunication,
      },
    });

    setSubmitted(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl relative text-stone-900">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bike className="w-5 h-5 text-amber-600" />
              <span className="font-display text-lg font-bold uppercase text-stone-900 tracking-wide">
                Adhésion Club KM0 Belgique
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {submitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Bienvenue dans le peloton !
                  </span>
                  <h3 className="font-display text-3xl font-extrabold uppercase text-stone-950">
                    Félicitations {formData.firstName} !
                  </h3>
                </div>

                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  Votre adhésion à la formule <strong className="text-stone-950">{tier.name}</strong> a bien été enregistrée
                  avec le règlement ({completedTx?.method.replace('_', ' ')}).
                  Votre compte et votre mot de passe sont enregistrés et sécurisés.
                </p>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto font-mono">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Montant cotisation :</span>
                    <span className="text-stone-950 font-bold">{tier.pricePerYear} €</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Référence transaction :</span>
                    <span className="text-stone-800 font-bold">{completedTx?.reference}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Statut :</span>
                    <span className="text-emerald-700 font-bold">
                      {completedTx?.method === 'wire_transfer' ? 'En attente virement' : 'Validé · Prêt à rouler'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                  {onOpenPortal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPortal();
                      }}
                      className="px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs cursor-pointer"
                    >
                      Ouvrir mon Espace Membre
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInitialFormSubmit} className="space-y-5">
                {/* Selected Tier Summary */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-800 font-bold uppercase tracking-widest block">Formule Choisie</span>
                    <h4 className="font-display text-lg font-bold text-stone-900 uppercase">{tier.name}</h4>
                    <p className="text-xs text-stone-600">{tier.period}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-2xl font-black text-amber-700">{tier.pricePerYear} €</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Ex: Eddy"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Ex: Merckx"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="cycliste@exemple.be"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Téléphone mobile *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+32 ..."
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Password Fields for Secure Account Creation */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Sécurisation de votre Compte Adhérent
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Définissez un mot de passe pour vous connecter à votre Espace Membre (téléchargement GPX, reçus, sorties).
                  </p>

                  {passwordError && (
                    <div className="text-xs text-red-600 font-semibold">{passwordError}</div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Mot de passe *</label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Confirmer mot de passe *</label>
                      <input
                        type="password"
                        required
                        value={formData.passwordConfirm}
                        onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Ville</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Bruxelles, Liège..."
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Code Postal</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="1000, 4000..."
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Taille Maillot</label>
                    <select
                      value={formData.jerseySize}
                      onChange={(e) => setFormData({ ...formData, jerseySize: e.target.value })}
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Votre pratique principale
                  </label>
                  <select
                    value={formData.preferredDiscipline}
                    onChange={(e) => setFormData({ ...formData, preferredDiscipline: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="all">4 Saisons (VTT en hiver + Gravel &amp; Route l’été)</option>
                    <option value="vtt-gravel">Priorité VTT &amp; Gravel (chemins &amp; bois)</option>
                    <option value="gravel-route">Priorité Gravel &amp; Route (asphalte &amp; chemins)</option>
                  </select>
                </div>

                <div className="flex items-start gap-2 pt-1 text-xs text-stone-600">
                  <input
                    type="checkbox"
                    id="certifModal"
                    required
                    checked={formData.medicalCertOk}
                    onChange={(e) => setFormData({ ...formData, medicalCertOk: e.target.checked })}
                    className="mt-0.5 rounded text-amber-500 border-stone-300"
                  />
                  <label htmlFor="certifModal">
                    J’atteste être apte à la pratique du cyclisme et accepte la charte de sécurité et de convivialité KM0 Belgique.
                  </label>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Paiement Stripe, Apple Pay ou Virement belge</span>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs cursor-pointer"
                  >
                    Procéder au paiement ({tier.pricePerYear} €) →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Online Payment Modal */}
      {isCheckoutOpen && (
        <PaymentCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          amount={tier.pricePerYear}
          itemTitle={`Adhésion Annuelle : ${tier.name}`}
          itemSubtitle={`Club Cycliste KM0 Belgique - Saison 2026/2027`}
          targetType="membership"
          targetId={tier.id}
          customerName={`${formData.firstName} ${formData.lastName}`.trim()}
          customerEmail={formData.email}
          customerPhone={formData.phone}
          password={formData.password}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
