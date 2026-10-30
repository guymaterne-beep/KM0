import { useState, useEffect, useMemo, useRef } from 'react';
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
  Users,
} from 'lucide-react';
import { PaymentCheckoutModal } from './payment/PaymentCheckoutModal';
import { downloadGpxFile, extractElevationProfileFromGpx } from '../utils/gpxHelper';

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

  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; distKm: number; eleM: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.isMember) {
      // Non-member: open checkout modal for 3€ discovery ride ticket
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

  // Extract true high-resolution profile from GPX if present, or use high-res profile array
  const gpxExt = useMemo(() => {
    if (ride.gpxData && ride.gpxData.trim().length > 10) {
      const res = extractElevationProfileFromGpx(ride.gpxData);
      if (res.valid && res.elevationProfile.length > 5) {
        return res;
      }
    }
    return null;
  }, [ride.gpxData]);

  const elevProfile = gpxExt ? gpxExt.elevationProfile : (ride.elevationProfile || [15, 30, 50, 70, 85, 60, 40, 20]);
  const minAlt = gpxExt?.minElevationM ?? (ride.minElevationM ?? 110);
  const maxAlt = gpxExt?.maxElevationM ?? (ride.maxElevationM ?? (110 + ride.elevationM));

  const maxElev = 100;
  const points = elevProfile
    .map((val, idx) => {
      const x = (idx / (elevProfile.length - 1)) * 500;
      const y = 140 - (val / maxElev) * 115;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const areaPoints = `0,140 ${points} 500,140`;

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = Math.max(0, Math.min(500, (clientX / rect.width) * 500));
    const ratio = svgX / 500;
    const distKm = Math.round(ratio * ride.distanceKm * 10) / 10;
    const sampleIdx = Math.min(elevProfile.length - 1, Math.round(ratio * (elevProfile.length - 1)));
    const normVal = elevProfile[sampleIdx];
    const svgY = 140 - (normVal / maxElev) * 115;
    const eleM = Math.round(minAlt + (normVal / 100) * (maxAlt - minAlt));
    setHoverPoint({ x: svgX, y: svgY, distKm, eleM });
  };

  const handleSvgMouseLeave = () => {
    setHoverPoint(null);
  };

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Distance</span>
              <p className="font-display text-2xl font-black text-slate-900">{ride.distanceKm} km</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Dénivelé Positif</span>
              <p className="font-display text-2xl font-black text-[#1e2f47]">+{ride.elevationM} m</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Niveau Technique</span>
              <p className="font-display text-2xl font-black text-slate-900">T{ride.technicalLevel} / 5</p>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Niveau Physique</span>
              <p className="font-display text-2xl font-black text-slate-900">P{ride.physicalLevel} / 5</p>
            </div>
          </div>

          {/* Precision Elevation Profile Graphic */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#1e2f47]" />
                <span className="font-bold text-slate-900 uppercase tracking-wider">
                  Profil Altimétrique &amp; Relief GPX Haute Précision
                </span>
                {ride.gpxFileName && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-950 px-2 py-0.5 rounded-full border border-blue-200">
                    GPX Officiel ({elevProfile.length} points)
                  </span>
                )}
              </div>
              <button
                onClick={handleDownloadGpx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e2f47] hover:bg-[#152336] text-white font-bold transition-all shadow-xs cursor-pointer text-xs"
                title={ride.gpxFileName ? `Télécharger ${ride.gpxFileName}` : 'Télécharger la trace GPX'}
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>
                  {ride.gpxFileName
                    ? `Télécharger ${ride.gpxFileName}`
                    : 'Télécharger la trace GPX officielle'}
                </span>
              </button>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative w-full h-44 bg-white rounded-xl p-3 border border-slate-200 shadow-xs select-none">
              {/* Altitude Scale Badges */}
              <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-500 font-bold bg-white/90 px-1.5 py-0.5 rounded border border-slate-200">
                Max : {maxAlt} m
              </div>
              <div className="absolute bottom-6 left-3 text-[10px] font-mono text-slate-500 font-bold bg-white/90 px-1.5 py-0.5 rounded border border-slate-200">
                Min : {minAlt} m
              </div>
              <div className="absolute top-2 right-3 text-[10px] font-mono text-[#1e2f47] font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                D+ : +{ride.elevationM} m
              </div>

              <svg
                ref={svgRef}
                viewBox="0 0 500 140"
                className="w-full h-full cursor-crosshair overflow-visible"
                preserveAspectRatio="none"
                onMouseMove={handleSvgMouseMove}
                onMouseLeave={handleSvgMouseLeave}
              >
                <defs>
                  <linearGradient id="elevGradNavy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e2f47" stopOpacity="0.38" />
                    <stop offset="50%" stopColor="#1e2f47" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#1e2f47" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Horizontal guide grids */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="500" y2="65" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

                {/* Filled profile polygon */}
                <polygon points={areaPoints} fill="url(#elevGradNavy)" />

                {/* Precise profile line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke="#1e2f47"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive cursor line & indicator */}
                {hoverPoint && (
                  <g>
                    <line
                      x1={hoverPoint.x}
                      y1="10"
                      x2={hoverPoint.x}
                      y2="140"
                      stroke="#1e2f47"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={hoverPoint.x}
                      cy={hoverPoint.y}
                      r="5"
                      fill="#1e2f47"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>

              {/* Floating Tooltip following hover */}
              {hoverPoint && (
                <div
                  className="absolute pointer-events-none -top-1 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-lg border border-sky-400 transform -translate-x-1/2 flex items-center gap-1.5 z-30"
                  style={{ left: `${(hoverPoint.x / 500) * 100}%` }}
                >
                  <span className="text-sky-300 font-mono">Km {hoverPoint.distKm}</span>
                  <span>·</span>
                  <span className="text-white font-mono">{hoverPoint.eleM} m</span>
                </div>
              )}
            </div>

            {/* Distance Axis Checkpoints */}
            <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
              <span>0 km (Départ)</span>
              <span>{Math.round(ride.distanceKm * 0.25)} km</span>
              <span>{Math.round(ride.distanceKm * 0.5)} km (Mi-parcours)</span>
              <span>{Math.round(ride.distanceKm * 0.75)} km</span>
              <span>{ride.distanceKm} km (Arrivée)</span>
            </div>
          </div>

          {/* Description & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold uppercase text-slate-950">
                À propos de cette sortie
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {ride.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-[#1e2f47] uppercase tracking-wider mb-2">
                  Lieu de Rassemblement
                </h4>
                <p className="text-xs text-slate-700 mb-2">{ride.startAddress}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    ride.startAddress
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1e2f47] hover:text-blue-700 hover:underline flex items-center gap-1 font-bold"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ouvrir dans Google Maps</span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold uppercase text-slate-950">
                Points forts &amp; Esprit Belge
              </h3>
              <ul className="space-y-2.5">
                {(ride.highlights || []).map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1e2f47] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <h4 className="text-xs font-bold text-[#1e2f47] uppercase tracking-wider mb-1">
                  Le Rituel Après-Ride
                </h4>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {ride.apresRide}
                </p>
              </div>

              {/* Attendees count - No limit */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1e2f47]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Cyclistes inscrits :</span>
                    <span className="text-slate-950 font-bold text-sm">
                      {ride.registeredCount} participant{ride.registeredCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#1e2f47] bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200">
                  Ouvert à tous · Sans limite
                </span>
              </div>
            </div>
          </div>

          {/* Photo Gallery Section */}
          {ride.photos && ride.photos.length > 0 && (
            <div className="pt-6 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-600" />
                  <h4 className="font-display text-base font-bold uppercase text-stone-900 tracking-wide">
                    Galerie Photos du Parcours
                  </h4>
                </div>
                <span className="text-xs text-stone-500 font-semibold">
                  {ride.photos.length} photo{ride.photos.length > 1 ? 's' : ''} disponibles
                </span>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {ride.photos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className="group relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-xs hover:shadow-md transition-all"
                  >
                    <img
                      src={photoUrl}
                      alt={`${ride.title} - photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-lg bg-stone-900/80 text-white backdrop-blur-xs">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-sky-900/80 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                        Vue principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                    className="px-4 py-2 text-xs font-bold bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-[#1e2f47]" />
                    <span>Télécharger la trace GPX</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-xs font-bold uppercase text-white bg-[#1e2f47] hover:bg-[#152336] rounded-xl cursor-pointer"
                  >
                    Fermer &amp; Voir les autres sorties
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-slate-950">
                    Réserver ma place dans le peloton
                  </h3>
                  <span className="text-xs text-[#1e2f47] font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Gratuit pour les membres · 3 € non-membres
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Ex: Philippe"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-[#1e2f47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Ex: Gilbert"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-[#1e2f47]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.be"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-[#1e2f47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Téléphone mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+32 470 00 00 00"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-[#1e2f47]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Modèle de vélo &amp; section de pneus
                    </label>
                    <input
                      type="text"
                      value={formData.bikeModel}
                      onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                      placeholder="Ex: VTT tout-suspendu 2.35 ou Gravel 45mm"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-[#1e2f47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Groupe d’allure souhaité
                    </label>
                    <select
                      value={formData.paceGroup}
                      onChange={(e) => setFormData({ ...formData, paceGroup: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-[#1e2f47] font-medium"
                    >
                      <option value="tempo">Groupe Tempo / Convivial (rythme régulier)</option>
                      <option value="sport">Groupe Sportif (rythme soutenu)</option>
                      <option value="decouverte">Groupe Découverte &amp; Apprentissage</option>
                    </select>
                  </div>
                </div>

                {!currentMember && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-slate-800">
                      <Lock className="w-3.5 h-3.5 text-[#1e2f47]" />
                      <span>Mot de passe (optionnel pour sécuriser votre compte membre)</span>
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Définir un mot de passe..."
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#1e2f47]"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isMemberModal"
                    checked={formData.isMember}
                    onChange={(e) => setFormData({ ...formData, isMember: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1e2f47] border-slate-300 focus:ring-0"
                  />
                  <label htmlFor="isMemberModal" className="text-xs text-slate-700 font-medium">
                    Je suis déjà adhérent au club KM0 Belgique (Gratuit · 0 €)
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {formData.isMember ? (
                      <span className="text-emerald-700 font-bold">Tarif Membre Club : Gratuit (0 €)</span>
                    ) : (
                      <span className="text-[#1e2f47] font-bold">Tarif Non-Membre : 3 €</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white bg-[#1e2f47] hover:bg-[#152336] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {!formData.isMember ? (
                        <>
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Payer ma participation (3 €)</span>
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
          amount={3}
          itemTitle={`Sortie Club : ${ride.title}`}
          itemSubtitle={`${ride.date} à ${ride.time} - 3 € non-membre (Gratuit membres)`}
          targetType="ride"
          targetId={ride.id}
          customerName={`${formData.firstName} ${formData.lastName}`.trim()}
          customerEmail={formData.email}
          customerPhone={formData.phone}
          password={formData.password}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Full-screen Photo Lightbox Modal */}
      {activePhotoIndex !== null && ride.photos && ride.photos.length > 0 && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setActivePhotoIndex(null)}
        >
          {/* Lightbox Top Bar */}
          <div
            className="flex items-center justify-between text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-display uppercase text-sm sm:text-base font-bold tracking-wider text-white">
                {ride.title}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {activePhotoIndex + 1} / {ride.photos.length}
              </span>
            </div>

            <button
              onClick={() => setActivePhotoIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Fermer (Échap)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Main Image & Arrows */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {ride.photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) =>
                    prev !== null
                      ? prev === 0
                        ? (ride.photos?.length || 1) - 1
                        : prev - 1
                      : 0
                  );
                }}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
                title="Photo précédente"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={ride.photos[activePhotoIndex]}
              alt={`${ride.title} - photo ${activePhotoIndex + 1}`}
              className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
            />

            {ride.photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) =>
                    prev !== null
                      ? prev === (ride.photos?.length || 1) - 1
                        ? 0
                        : prev + 1
                      : 0
                  );
                }}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
                title="Photo suivante"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Strip */}
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {ride.photos.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activePhotoIndex === idx
                    ? 'border-sky-400 scale-105 opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={thumb}
                  alt={`Vignette ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
