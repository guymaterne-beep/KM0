import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Ride } from '../data/rides';
import { PaymentTransaction } from '../data/club';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Gauge,
  CheckCircle2,
  User,
  FileDown,
  Share2,
  Check,
  Lock,
  CreditCard,
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { PaymentCheckoutModal } from './payment/PaymentCheckoutModal';
import { downloadGpxFile } from '../utils/gpxHelper';

interface RideDetailModalProps {
  ride: Ride | null;
  onClose: () => void;
  onOpenPortal?: () => void;
}

export default function RideDetailModal({ ride, onClose, onOpenPortal }: RideDetailModalProps) {
  if (!ride) return null;

  const { addRegistration, currentMember } = useApp();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstName: currentMember ? currentMember.firstName : '',
    lastName: currentMember ? currentMember.lastName : '',
    email: currentMember ? currentMember.email : '',
    password: '',
    phone: currentMember ? currentMember.phone : '',
    bikeModel: '',
    paceGroup: 'tempo',
    isMember: !!currentMember,
    dietaryOrNotes: '',
  });

  useEffect(() => {
    if (currentMember) {
      setFormData((prev) => ({
        ...prev,
        firstName: currentMember.firstName,
        lastName: currentMember.lastName,
        email: currentMember.email,
        phone: currentMember.phone,
        isMember: true,
      }));
    }
  }, [currentMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.isMember) {
      // Non-member: open checkout modal for 15€ discovery ride ticket
      setIsCheckoutOpen(true);
      return;
    }

    // Member: Free entry
    addRegistration({
      type: 'ride',
      targetId: ride.id,
      targetTitle: ride.title,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password || undefined,
      amountPaid: 0,
      paymentMethod: 'member_benefit',
      details: {
        paceGroup: formData.paceGroup,
        bikeModel: formData.bikeModel,
        isMember: true,
        notes: formData.dietaryOrNotes,
      },
    });
    setFormSubmitted(true);
  };

  const handlePaymentSuccess = (tx: PaymentTransaction) => {
    setCompletedTx(tx);
    setIsCheckoutOpen(false);

    addRegistration({
      type: 'ride',
      targetId: ride.id,
      targetTitle: ride.title,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password || undefined,
      paymentId: tx.id,
      paymentMethod: tx.method,
      amountPaid: tx.amount,
      details: {
        paceGroup: formData.paceGroup,
        bikeModel: formData.bikeModel,
        isMember: false,
        notes: formData.dietaryOrNotes,
        reference: tx.reference,
        structuredCommunication: tx.structuredCommunication,
      },
    });
    setFormSubmitted(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadGpx = () => {
    downloadGpxFile(
      ride.gpxFileName,
      ride.gpxData,
      ride.title
    );
  };

  // SVG elevation profile calculation
  const maxElev = 100;
  const elevProfile = ride.elevationProfile || [15, 30, 50, 70, 85, 60, 40, 20];
  const points = elevProfile
    .map((val, idx) => {
      const x = (idx / (elevProfile.length - 1)) * 500;
      const y = 140 - (val / maxElev) * 110;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,140 ${points} 500,140`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative text-stone-900">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                ride.discipline === 'vtt'
                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                  : ride.discipline === 'gravel'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              {ride.discipline.toUpperCase()} · Saison {ride.season}
            </span>
            <span className="text-stone-500 text-xs hidden sm:inline">
              Région : {ride.region}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Copier le lien"
              className="p-2 text-stone-500 hover:text-stone-800 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Title & Guide */}
          <div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase text-stone-950 mb-2">
              {ride.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-600">
              <span className="flex items-center gap-1.5 text-amber-800 font-bold">
                <Calendar className="w-4 h-4" />
                {ride.date}
              </span>
              <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                <Clock className="w-4 h-4 text-stone-400" />
                Départ {ride.time} ({ride.estimatedHours})
              </span>
              <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                <MapPin className="w-4 h-4 text-stone-400" />
                {ride.startLocation}
              </span>
              <span className="flex items-center gap-1.5 text-stone-600">
                <User className="w-4 h-4 text-amber-600" />
                Guide : {ride.guideName}
              </span>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Distance</span>
              <p className="font-display text-2xl font-black text-stone-900">{ride.distanceKm} km</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Dénivelé Positif</span>
              <p className="font-display text-2xl font-black text-amber-700">+{ride.elevationM} m</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Niveau Technique</span>
              <p className="font-display text-2xl font-black text-stone-900">T{ride.technicalLevel} / 5</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Niveau Physique</span>
              <p className="font-display text-2xl font-black text-stone-900">P{ride.physicalLevel} / 5</p>
            </div>
          </div>

          {/* Elevation Profile Graphic */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-stone-900 uppercase tracking-wider">
                  Profil Altimétrique &amp; Relief
                </span>
                {ride.gpxFileName && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    GPX certifié
                  </span>
                )}
              </div>
              <button
                onClick={handleDownloadGpx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold transition-all shadow-xs cursor-pointer text-xs"
                title={ride.gpxFileName ? `Télécharger ${ride.gpxFileName}` : 'Télécharger la trace GPX'}
              >
                <FileDown className="w-3.5 h-3.5 text-stone-950" />
                <span>
                  {ride.gpxFileName
                    ? `Télécharger ${ride.gpxFileName} (${ride.gpxFileSize || 'GPX'})`
                    : 'Télécharger la trace GPX officielle'}
                </span>
              </button>
            </div>

            <div className="w-full h-36 relative bg-white rounded-xl p-2 border border-stone-200/80">
              <svg viewBox="0 0 500 140" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="elevGradLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="35" x2="500" y2="35" stroke="#e5e5e5" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#e5e5e5" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="500" y2="105" stroke="#e5e5e5" strokeDasharray="3 3" />
                <polygon points={areaPoints} fill="url(#elevGradLight)" />
                <polyline points={points} fill="none" stroke="#d97706" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500 mt-2 font-mono">
              <span>0 km (Départ)</span>
              <span>{Math.round(ride.distanceKm / 2)} km (Mi-parcours)</span>
              <span>{ride.distanceKm} km (Arrivée)</span>
            </div>
          </div>

          {/* Description & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold uppercase text-stone-950">
                À propos de cette sortie
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed">
                {ride.description}
              </p>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                  Lieu de Rassemblement
                </h4>
                <p className="text-xs text-stone-700 mb-2">{ride.startAddress}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    ride.startAddress
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-bold"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ouvrir dans Google Maps</span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold uppercase text-stone-950">
                Points forts &amp; Esprit Belge
              </h3>
              <ul className="space-y-2.5">
                {(ride.highlights || []).map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Le Rituel Après-Ride
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {ride.apresRide}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500">Places restantes :</span>
                  <span className="text-stone-950 font-bold ml-1.5">
                    {ride.maxParticipants - ride.registeredCount} sur {ride.maxParticipants}
                  </span>
                </div>
                <div className="w-28 bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{
                      width: `${(ride.registeredCount / ride.maxParticipants) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Registration Section */}
          <div className="pt-6 border-t border-stone-200">
            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-display text-2xl font-bold uppercase text-stone-950">
                  Place réservée avec succès !
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm max-w-lg mx-auto">
                  Bravo {formData.firstName || 'cycliste'} ! Vous êtes inscrit pour <strong className="text-stone-900">{ride.title}</strong> le {ride.date}. Votre réservation est enregistrée dans le système du club.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleDownloadGpx}
                    className="px-4 py-2 text-xs font-bold bg-white text-stone-800 hover:bg-stone-50 border border-stone-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-amber-600" />
                    <span>Télécharger la trace GPX</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-xs font-bold uppercase text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer"
                  >
                    Fermer &amp; Voir les autres sorties
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-stone-950">
                    Réserver ma place dans le peloton
                  </h3>
                  <span className="text-xs text-stone-500 font-medium">
                    Gratuit pour les membres du Club KM0
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Ex: Philippe"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Ex: Gilbert"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.be"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Téléphone mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+32 470 00 00 00"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Modèle de vélo &amp; section de pneus
                    </label>
                    <input
                      type="text"
                      value={formData.bikeModel}
                      onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                      placeholder="Ex: VTT tout-suspendu 2.35 ou Gravel 45mm"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Groupe d’allure souhaité
                    </label>
                    <select
                      value={formData.paceGroup}
                      onChange={(e) => setFormData({ ...formData, paceGroup: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
                    >
                      <option value="tempo">Groupe Tempo / Convivial (rythme régulier)</option>
                      <option value="sport">Groupe Sportif (rythme soutenu)</option>
                      <option value="decouverte">Groupe Découverte &amp; Apprentissage</option>
                    </select>
                  </div>
                </div>

                {!currentMember && (
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-stone-800">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Mot de passe (optionnel pour sécuriser votre compte membre)</span>
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Définir un mot de passe..."
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isMemberModal"
                    checked={formData.isMember}
                    onChange={(e) => setFormData({ ...formData, isMember: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 border-stone-300 focus:ring-0"
                  />
                  <label htmlFor="isMemberModal" className="text-xs text-stone-600">
                    Je suis déjà adhérent au club KM0 Belgique (Gratuit · 0 €)
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-medium">
                    {formData.isMember ? 'Tarif Adhérent : Gratuit' : 'Tarif Pass Découverte : 15 €'}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {!formData.isMember ? (
                        <>
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Payer ma participation (15 €)</span>
                        </>
                      ) : (
                        <span>Confirmer mon Inscription (0 €)</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <PaymentCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          amount={15}
          itemTitle={`Sortie Club : ${ride.title}`}
          itemSubtitle={`${ride.date} à ${ride.time} - ${ride.discipline.toUpperCase()}`}
          targetType="ride"
          targetId={ride.id}
          customerName={`${formData.firstName} ${formData.lastName}`.trim()}
          customerEmail={formData.email}
          customerPhone={formData.phone}
          password={formData.password}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
