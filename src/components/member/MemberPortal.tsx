import React, { useState } from 'react';
import {
  User,
  Shield,
  Download,
  Calendar,
  Compass,
  CreditCard,
  Settings,
  LogOut,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  FileText,
  Lock,
  Sparkles,
  ChevronRight,
  Bike,
  Receipt,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClubMember } from '../../data/club';

interface MemberPortalProps {
  onClose: () => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({ onClose }) => {
  const {
    currentMember,
    logoutMember,
    updateCurrentMemberProfile,
    rides,
    trips,
    registrations,
    transactions,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rides' | 'trips' | 'receipts' | 'profile'>('rides');

  // Edit profile state
  const [phone, setPhone] = useState(currentMember?.phone || '');
  const [city, setCity] = useState(currentMember?.city || '');
  const [postalCode, setPostalCode] = useState(currentMember?.postalCode || '');
  const [jerseySize, setJerseySize] = useState<ClubMember['jerseySize']>(
    currentMember?.jerseySize || 'M'
  );
  const [newPassword, setNewPassword] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  if (!currentMember) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center space-y-4">
          <p className="text-stone-600">Aucun membre connecté.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold"
          >
            Retourner au site
          </button>
        </div>
      </div>
    );
  }

  // Filter registrations for this member
  const memberRegs = registrations.filter(
    (r) => r.email.toLowerCase() === currentMember.email.toLowerCase()
  );

  // Filter transactions for this member
  const memberTxs = transactions.filter(
    (t) => t.memberEmail.toLowerCase() === currentMember.email.toLowerCase()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<ClubMember> = {
      phone,
      city,
      postalCode,
      jerseySize,
    };
    if (newPassword.trim().length >= 4) {
      updates.password = newPassword.trim();
    }
    updateCurrentMemberProfile(updates);
    setProfileSuccessMsg('Profil et préférences mis à jour avec succès !');
    setTimeout(() => setProfileSuccessMsg(null), 3000);
  };

  const handleDownloadGpx = (rideTitle: string) => {
    const dummyGpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="KM0 Belgique Cycling Club" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${rideTitle}</name>
    <desc>Trace officielle certifiée KM0 Belgique</desc>
    <author><name>KM0 Belgique - Guy Materne</name></author>
  </metadata>
  <trk>
    <name>${rideTitle}</name>
    <trkseg>
      <trkpt lat="50.4892" lon="5.6743"><ele>210</ele></trkpt>
      <trkpt lat="50.4921" lon="5.6812"><ele>245</ele></trkpt>
      <trkpt lat="50.5015" lon="5.6980"><ele>320</ele></trkpt>
      <trkpt lat="50.5120" lon="5.7100"><ele>380</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;
    const blob = new Blob([dummyGpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `km0-belgique-${rideTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      {/* Top Banner Navigation */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              ← Retour au site
            </button>
            <div className="h-4 w-px bg-stone-200"></div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="font-bold text-sm tracking-tight text-stone-900">
                Espace Adhérent KM0 Belgique
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 hidden sm:inline">
              Connecté en tant que <strong className="text-stone-800">{currentMember.firstName} {currentMember.lastName}</strong>
            </span>
            <button
              onClick={() => {
                logoutMember();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Profile Card & Digital License Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: User Welcome */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {currentMember.membershipTierName}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                  Rôle : {currentMember.role === 'admin' ? 'Administrateur' : currentMember.role === 'captain' ? 'Capitaine de Route' : 'Membre Actif'}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  currentMember.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {currentMember.status === 'active' ? 'Adhésion Active' : 'En attente de virement'}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
                  Bienvenue, {currentMember.firstName} {currentMember.lastName}
                </h1>
                <p className="text-sm text-stone-600 mt-1">
                  Accédez à vos sorties vélo en Belgique, téléchargez vos traces GPX certifiées, consultez vos reçus de cotisations et vos inscriptions aux voyages.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-100 flex flex-wrap gap-4 text-xs text-stone-500">
              <div>
                <span className="block font-medium text-stone-400">Date d'adhésion</span>
                <span className="font-bold text-stone-800">{currentMember.joinDate}</span>
              </div>
              <div>
                <span className="block font-medium text-stone-400">Valable jusqu'au</span>
                <span className="font-bold text-stone-800">{currentMember.expirationDate}</span>
              </div>
              <div>
                <span className="block font-medium text-stone-400">Taille maillot club</span>
                <span className="font-bold text-stone-800">{currentMember.jerseySize}</span>
              </div>
              <div>
                <span className="block font-medium text-stone-400">Discipline de cœur</span>
                <span className="font-bold text-stone-800 uppercase">{currentMember.preferredDiscipline}</span>
              </div>
            </div>
          </div>

          {/* Right: Digital Member License Card */}
          <div className="relative rounded-2xl overflow-hidden p-6 text-white shadow-xl flex flex-col justify-between bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 border border-stone-700">
            {/* Belgian Flag Mini Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="w-1/3 bg-black"></div>
              <div className="w-1/3 bg-amber-400"></div>
              <div className="w-1/3 bg-red-600"></div>
            </div>

            <div className="flex justify-between items-start pt-1">
              <div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                  LICENCE MEMBRE OFFICIELLE
                </div>
                <div className="text-lg font-black tracking-tight">KM0 BELGIQUE</div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Bike className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div className="my-4 space-y-1">
              <div className="text-xs text-stone-400">Titulaire de la licence</div>
              <div className="text-lg font-bold tracking-wide">
                {currentMember.firstName} {currentMember.lastName}
              </div>
              <div className="text-xs font-mono text-amber-300">
                ID : BE-KM0-{currentMember.id.replace('mem-', '')}
              </div>
            </div>

            <div className="flex justify-between items-end pt-3 border-t border-white/10 text-[11px]">
              <div>
                <span className="text-stone-400 block text-[9px] uppercase">Saison</span>
                <span className="font-semibold">2026 / 2027</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[9px] uppercase">Localisation</span>
                <span className="font-semibold">{currentMember.city || 'Belgique'}</span>
              </div>
              <div className="p-1.5 bg-white rounded-md">
                <QrCode className="w-6 h-6 text-stone-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-stone-200 pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('rides')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'rides'
                ? 'border-amber-500 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Mes Sorties & Traces GPX</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-stone-100 text-stone-700">
              {rides.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('trips')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'trips'
                ? 'border-amber-500 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Voyages & Stages KM0</span>
          </button>

          <button
            onClick={() => setActiveTab('receipts')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'receipts'
                ? 'border-amber-500 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cotisations & Reçus de Paiement</span>
            {memberTxs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">
                {memberTxs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'border-amber-500 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Mon Profil & Sécurité</span>
          </button>
        </div>

        {/* TAB 1: RIDES & GPX DOWNLOADS */}
        {activeTab === 'rides' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Bibliothèque des Sorties & Traces GPX Adhérents
                </h3>
                <p className="text-xs text-stone-500">
                  En tant que membre KM0 Belgique, vous bénéficiez du téléchargement illimité des traces GPX certifiées.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rides.map((ride) => {
                const isRegistered = memberRegs.some(
                  (r) => r.type === 'ride' && r.targetId === ride.id
                );

                return (
                  <div
                    key={ride.id}
                    className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                              {ride.discipline}
                            </span>
                            <span className="text-xs font-semibold text-stone-600">
                              {ride.date} • {ride.time}
                            </span>
                          </div>
                          <h4 className="font-bold text-stone-900 text-base">{ride.title}</h4>
                        </div>
                        {isRegistered && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Inscrit</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                        <div>
                          <span className="text-stone-400 block text-[10px]">Distance</span>
                          <span className="font-bold text-stone-800">{ride.distanceKm} km</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">Dénivelé</span>
                          <span className="font-bold text-stone-800">{ride.elevationM} m D+</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">Départ</span>
                          <span className="font-medium text-stone-700 truncate max-w-[130px] block">
                            {ride.startLocation}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2">{ride.description}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-medium">
                        Guide : {ride.guideName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadGpx(ride.title)}
                        className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Télécharger GPX</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TRIPS & EXPEDITIONS */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Voyages & Stages d'Exception</h3>
              <p className="text-xs text-stone-500">
                Bénéficiez de votre remise adhérent permanente (-15%) sur l’ensemble de nos séjours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map((trip) => {
                const isRegistered = memberRegs.some(
                  (r) => r.type === 'trip' && r.targetId === trip.id
                );

                return (
                  <div
                    key={trip.id}
                    className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                            {trip.durationDays} Jours
                          </span>
                          <h4 className="font-bold text-stone-900 text-base mt-1">{trip.title}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-amber-600">{trip.priceEuro} €</span>
                          <span className="block text-[10px] text-stone-400">Prix public</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 mb-3">{trip.subtitle}</p>

                      <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 text-xs text-amber-900 space-y-1">
                        <div className="font-bold">Tarif Membre KM0 : {Math.round(trip.priceEuro * 0.85)} € (-15%)</div>
                        <div className="text-[11px] text-stone-600">Dates : {trip.dates}</div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                      {isRegistered ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Dossier réservé</span>
                        </span>
                      ) : (
                        <span className="text-xs text-stone-500">Groupe : {trip.groupSize}</span>
                      )}
                      <button
                        onClick={onClose}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-colors"
                      >
                        Voir la fiche séjour
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: RECEIPTS & TRANSACTIONS */}
        {activeTab === 'receipts' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Historique des Cotisations & Paiements</h3>
              <p className="text-xs text-stone-500">
                Retrouvez l’ensemble de vos factures acquittées et justificatifs pour votre club ou assurance.
              </p>
            </div>

            {memberTxs.length === 0 ? (
              <div className="p-8 text-center text-stone-500 space-y-2">
                <Receipt className="w-8 h-8 mx-auto text-stone-400" />
                <p className="text-sm">Aucun historique de paiement pour l'instant.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {memberTxs.map((tx) => (
                  <div key={tx.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{tx.description}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tx.status === 'paid' ? 'Payé' : 'En attente de virement'}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 flex items-center gap-3">
                        <span>Date : {tx.date}</span>
                        <span>•</span>
                        <span>Réf : <span className="font-mono">{tx.reference}</span></span>
                        <span>•</span>
                        <span className="capitalize">Mode : {tx.method.replace('_', ' ')}</span>
                      </div>
                      {tx.structuredCommunication && (
                        <div className="text-xs text-amber-900 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded inline-block">
                          Communication virement : {tx.structuredCommunication}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 sm:justify-end">
                      <span className="text-lg font-black text-stone-900">{tx.amount} €</span>
                      <button
                        type="button"
                        onClick={() => {
                          window.print();
                        }}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Imprimer Reçu</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm max-w-2xl">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Mes Coordonnées & Sécurité du Compte</h3>
            <p className="text-xs text-stone-500 mb-6">
              Mettez à jour votre mot de passe, vos coordonnées d'urgence et votre taille de maillot club.
            </p>

            {profileSuccessMsg && (
              <div className="p-3 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Prénom & Nom
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentMember.firstName} ${currentMember.lastName}`}
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-lg text-sm text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Adresse Email (identifiant)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentMember.email}
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-lg text-sm text-stone-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Téléphone (WhatsApp sorties)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-amber-500"
                    placeholder="+32 470 00 00 00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Taille du Maillot Officiel
                  </label>
                  <select
                    value={jerseySize}
                    onChange={(e) => setJerseySize(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-amber-500"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Ville de résidence
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Code Postal
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Nouveau mot de passe (laisser vide pour ne pas modifier)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe sécurisé..."
                    className="w-full px-3.5 py-2.5 pl-10 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Enregistrer les modifications
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
