import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trip } from '../data/trips';
import { PaymentTransaction } from '../data/club';
import { X, Calendar, MapPin, Users, CheckCircle2, Shield, Compass, Send, CreditCard, Lock, FileDown } from 'lucide-react';
import { PaymentCheckoutModal } from './payment/PaymentCheckoutModal';
import { downloadGpxFile } from '../utils/gpxHelper';

interface TripDetailModalProps {
  trip: Trip | null;
  onClose: () => void;
  onOpenPortal?: () => void;
}

export default function TripDetailModal({ trip, onClose, onOpenPortal }: TripDetailModalProps) {
  if (!trip) return null;

  const { addRegistration, currentMember } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const depositAmount = 150; // Acompte standard

  const [formData, setFormData] = useState({
    name: currentMember ? `${currentMember.firstName} ${currentMember.lastName}` : '',
    email: currentMember ? currentMember.email : '',
    password: '',
    phone: currentMember ? currentMember.phone : '',
    participantsCount: '1',
    bikeType: 'gravel',
    notes: '',
  });

  const handlePayDepositClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(true);
  };

  const handleFreePreReservation = (e: React.FormEvent) => {
    e.preventDefault();
    addRegistration({
      type: 'trip',
      targetId: trip.id,
      targetTitle: trip.title,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password || undefined,
      details: {
        participantsCount: formData.participantsCount,
        bikeType: formData.bikeType,
        notes: formData.notes,
        mode: 'pre_reservation_sans_acompte',
      },
    });
    setSubmitted(true);
  };

  const handlePaymentSuccess = (tx: PaymentTransaction) => {
    setCompletedTx(tx);
    setIsCheckoutOpen(false);

    addRegistration({
      type: 'trip',
      targetId: trip.id,
      targetTitle: trip.title,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password || undefined,
      paymentId: tx.id,
      paymentMethod: tx.method,
      amountPaid: tx.amount,
      details: {
        participantsCount: formData.participantsCount,
        bikeType: formData.bikeType,
        notes: formData.notes,
        reference: tx.reference,
        structuredCommunication: tx.structuredCommunication,
        mode: 'acompte_regle',
      },
    });
    setSubmitted(true);
  };

  const handleDownloadGpx = () => {
    downloadGpxFile(
      trip.gpxFileName || `KM0-Voyage-${trip.id}.gpx`,
      trip.gpxData,
      trip.title
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative text-stone-900">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                {trip.country} · {trip.durationDays} Jours
              </span>
              {trip.tagKm0Partner && (
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                  {trip.tagKm0Partner}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase text-stone-950 mb-2">
                {trip.title}
              </h2>
              <p className="text-amber-800 text-sm sm:text-base font-bold mb-3">
                {trip.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  {trip.dates}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  {trip.destination}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-amber-600" />
                  {trip.groupSize}
                </span>
                <span className="text-stone-950 font-extrabold font-display text-2xl ml-auto">
                  {trip.priceEuro} € <span className="text-xs font-normal text-stone-500">/ pers.</span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <p className="text-stone-700 text-sm leading-relaxed">
                {trip.coverDescription}
              </p>
            </div>

            {/* Day by Day Program */}
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold uppercase text-stone-950">
                Programme Jour par Jour
              </h3>
              <div className="space-y-3">
                {(trip.dailyProgram || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                      <span>{item.day} · {item.title}</span>
                      {item.stats && (
                        <span className="text-stone-600 font-mono text-[11px] bg-white border border-stone-200 px-2 py-0.5 rounded">
                          {item.stats}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Included / Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Ce qui est inclus</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {(trip.included || []).map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>Points Clés du Séjour</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {(trip.highlights || []).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-stone-500 font-medium">
                  Encadrement certifié par des guides officiels KM0 Belgique &amp; Swiss Cycling.
                </div>
              </div>
            </div>

            {/* GPX Trace Section */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-900 border border-amber-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  GPX
                </div>
                <div>
                  <span className="font-bold text-xs text-stone-900 block">
                    {trip.gpxFileName ? `Trace officielle : ${trip.gpxFileName}` : 'Traces GPX exclusives KM0 pour GPS'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {trip.gpxFileSize ? `Taille : ${trip.gpxFileSize} · ` : ''}Fichier certifié pour Garmin, Wahoo, Hammerhead, Strava
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadGpx}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Télécharger la trace GPX</span>
              </button>
            </div>

            {/* Registration Form */}
            <div className="pt-6 border-t border-stone-200">
              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-display text-2xl font-bold uppercase text-stone-950">
                    {completedTx ? 'Acompte Réglé & Place Garantie !' : 'Demande d’inscription transmise !'}
                  </h3>
                  <p className="text-stone-700 text-xs sm:text-sm max-w-md mx-auto">
                    {completedTx
                      ? `Merci ${formData.name} ! Votre acompte de ${completedTx.amount} € a bien été enregistré (Réf: ${completedTx.reference}). Guy Materne vous envoie la feuille de route et l'accès membre.`
                      : `Merci ${formData.name} ! Guy Materne et l’équipe Projet KM0 prendront contact avec vous sous 24h avec le dossier complet.`}
                  </p>

                  <div className="flex gap-3 justify-center pt-2">
                    {onOpenPortal && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenPortal();
                        }}
                        className="px-5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer"
                      >
                        Voir dans mon Espace Membre
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="px-5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                <form className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold uppercase text-stone-950">
                      Réservation de votre place pour ce séjour
                    </h3>
                    <span className="text-xs text-amber-800 font-bold">
                      Acompte de confirmation : {depositAmount} €
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Prénom Nom"
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="cycliste@domaine.be"
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Téléphone *
                      </label>
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

                  {!currentMember && (
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-xs font-bold text-stone-800">
                          Mot de passe Espace Membre (optionnel pour suivre votre voyage)
                        </span>
                      </div>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Créer un mot de passe..."
                        className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nombre de participants
                      </label>
                      <select
                        value={formData.participantsCount}
                        onChange={(e) => setFormData({ ...formData, participantsCount: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
                      >
                        <option value="1">1 cycliste</option>
                        <option value="2">2 cyclistes</option>
                        <option value="3">3 cyclistes ou +</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Remarques ou besoins particuliers
                      </label>
                      <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Régime alimentaire, prêt de vélo..."
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleFreePreReservation}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
                    >
                      Pré-réserver sans acompte
                    </button>
                    <button
                      type="button"
                      onClick={handlePayDepositClick}
                      className="px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Régler l'acompte en ligne ({depositAmount} €)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <PaymentCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          amount={depositAmount}
          itemTitle={`Acompte Séjour : ${trip.title}`}
          itemSubtitle={`Destination ${trip.destination} - ${trip.dates}`}
          targetType="trip"
          targetId={trip.id}
          customerName={formData.name}
          customerEmail={formData.email}
          customerPhone={formData.phone}
          password={formData.password}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
