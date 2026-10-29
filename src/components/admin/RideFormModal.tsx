import { useState, useEffect } from 'react';
import { Ride } from '../../data/rides';
import { X, Bike, Save, CheckCircle2 } from 'lucide-react';
import GpxUploadField from './GpxUploadField';

interface RideFormModalProps {
  isOpen: boolean;
  rideToEdit: Ride | null;
  onClose: () => void;
  onSave: (rideData: any) => void;
}

export default function RideFormModal({ isOpen, rideToEdit, onClose, onSave }: RideFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    discipline: 'vtt' as Ride['discipline'],
    season: 'hiver' as Ride['season'],
    date: 'Samedi 28 Novembre 2026',
    time: '09h00',
    distanceKm: 50,
    elevationM: 850,
    estimatedHours: '3h30',
    region: 'Ardennes' as Ride['region'],
    startLocation: '',
    startAddress: '',
    technicalLevel: 3 as Ride['technicalLevel'],
    physicalLevel: 3 as Ride['physicalLevel'],
    paceAvgKmH: '16-18 km/h',
    maxParticipants: 18,
    guideName: 'Guy Materne (Référent KM0 BE)',
    description: '',
    highlights: ['Singletracks forestiers techniques', 'Atelier pilotage à mi-parcours', 'Point de vue panoramique'],
    apresRide: 'Grand bol de soupe chaude et bière locale partagée au clubhouse.',
    elevationProfile: [20, 35, 50, 45, 70, 60, 85, 70, 90, 65, 40, 20],
    gpxFileName: '' as string | undefined,
    gpxFileSize: '' as string | undefined,
    gpxData: '' as string | undefined,
    gpxUploadedAt: '' as string | undefined,
  });

  const [highlightInput, setHighlightInput] = useState('');
  const [gpxSyncNotice, setGpxSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    if (rideToEdit) {
      setFormData({
        title: rideToEdit.title,
        discipline: rideToEdit.discipline,
        season: rideToEdit.season,
        date: rideToEdit.date,
        time: rideToEdit.time,
        distanceKm: rideToEdit.distanceKm,
        elevationM: rideToEdit.elevationM,
        estimatedHours: rideToEdit.estimatedHours,
        region: rideToEdit.region,
        startLocation: rideToEdit.startLocation,
        startAddress: rideToEdit.startAddress,
        technicalLevel: rideToEdit.technicalLevel,
        physicalLevel: rideToEdit.physicalLevel,
        paceAvgKmH: rideToEdit.paceAvgKmH,
        maxParticipants: rideToEdit.maxParticipants,
        guideName: rideToEdit.guideName,
        description: rideToEdit.description,
        highlights: rideToEdit.highlights || [],
        apresRide: rideToEdit.apresRide,
        elevationProfile: rideToEdit.elevationProfile || [20, 40, 60, 80, 50, 30, 15],
        gpxFileName: rideToEdit.gpxFileName || '',
        gpxFileSize: rideToEdit.gpxFileSize || '',
        gpxData: rideToEdit.gpxData || '',
        gpxUploadedAt: rideToEdit.gpxUploadedAt || '',
      });
    } else {
      setFormData({
        title: '',
        discipline: 'vtt',
        season: 'hiver',
        date: 'Samedi 28 Novembre 2026',
        time: '09h00',
        distanceKm: 48,
        elevationM: 850,
        estimatedHours: '3h30',
        region: 'Ardennes',
        startLocation: 'Aywaille - Place du Marché',
        startAddress: 'Place du Marché 12, 4920 Aywaille',
        technicalLevel: 3,
        physicalLevel: 3,
        paceAvgKmH: '15-17 km/h',
        maxParticipants: 16,
        guideName: 'Guy Materne (Référent KM0 BE)',
        description: 'Parcours soigné sur les plus beaux chemins de la région, alternant sous-bois préservés et relances.',
        highlights: ['Singletracks forestiers techniques', 'Atelier pilotage à mi-parcours', 'Pause espresso'],
        apresRide: 'Grand bol de soupe chaude et bière d’abbaye locale partagée.',
        elevationProfile: [20, 35, 55, 45, 75, 60, 90, 70, 50, 30, 20],
        gpxFileName: '',
        gpxFileSize: '',
        gpxData: '',
        gpxUploadedAt: '',
      });
    }
  }, [rideToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const removeHighlight = (idx: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="w-5 h-5 text-amber-600" />
            <h3 className="font-display text-xl font-bold uppercase text-stone-900">
              {rideToEdit ? 'Modifier la Sortie / Activité' : 'Créer une Nouvelle Sortie / Activité'}
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
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Titre de l’activité *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: L'Hivernale des Vallons de Spa & Amblève"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* Discipline, Season & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Discipline *
              </label>
              <select
                value={formData.discipline}
                onChange={(e) => setFormData({ ...formData, discipline: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="vtt">VTT (Saison Hiver)</option>
                <option value="gravel">Gravel (Printemps / Automne)</option>
                <option value="route">Route &amp; Pavés (Printemps / Été)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Saison *
              </label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="hiver">Hiver</option>
                <option value="printemps">Printemps</option>
                <option value="ete">Été</option>
                <option value="automne">Automne</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Région belge *
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="Ardennes">Ardennes</option>
                <option value="Brabant">Brabant (Wallon &amp; Flamand)</option>
                <option value="Condroz">Condroz &amp; Meuse</option>
                <option value="Flandres">Flandres &amp; Monts</option>
                <option value="Hautes Fagnes">Hautes Fagnes</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Date *
              </label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="Ex: Samedi 19 Décembre 2026"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Heure de départ *
              </label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="Ex: 09h00"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Durée estimée *
              </label>
              <input
                type="text"
                required
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                placeholder="Ex: 3h30"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Distance, Elevation, Levels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                required
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Dénivelé D+ (m) *
                </label>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                  Manuel
                </span>
              </div>
              <input
                type="number"
                required
                value={formData.elevationM}
                onChange={(e) => setFormData({ ...formData, elevationM: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-bold"
                placeholder="Ex: 850"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">Dénivelé officiel saisi par vous</span>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Niveau Technique
              </label>
              <select
                value={formData.technicalLevel}
                onChange={(e) => setFormData({ ...formData, technicalLevel: Number(e.target.value) as any })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value={1}>T1 - Débutant / Facile</option>
                <option value={2}>T2 - Intermédiaire</option>
                <option value={3}>T3 - Confirmé</option>
                <option value={4}>T4 - Avancé / Pavés</option>
                <option value={5}>T5 - Expert / Engagé</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Niveau Physique
              </label>
              <select
                value={formData.physicalLevel}
                onChange={(e) => setFormData({ ...formData, physicalLevel: Number(e.target.value) as any })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value={1}>P1 - Accessible</option>
                <option value={2}>P2 - Modéré</option>
                <option value={3}>P3 - Sportif</option>
                <option value={4}>P4 - Confirmé</option>
                <option value={5}>P5 - Ultra</option>
              </select>
            </div>
          </div>

          {/* Location & Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Lieu de rendez-vous (court)
              </label>
              <input
                type="text"
                required
                value={formData.startLocation}
                onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                placeholder="Ex: Wavre - Clubhouse KM0"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Adresse complète (pour GPS)
              </label>
              <input
                type="text"
                required
                value={formData.startAddress}
                onChange={(e) => setFormData({ ...formData, startAddress: e.target.value })}
                placeholder="Ex: Avenue des Sports 4, 1300 Wavre"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Capitaine de Route / Guide
              </label>
              <input
                type="text"
                value={formData.guideName}
                onChange={(e) => setFormData({ ...formData, guideName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Allure Moyenne indicative
              </label>
              <input
                type="text"
                value={formData.paceAvgKmH}
                onChange={(e) => setFormData({ ...formData, paceAvgKmH: e.target.value })}
                placeholder="Ex: 21-24 km/h"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Capacité Max (Riders)
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Description de la sortie
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              placeholder="Expliquez l’esprit, le type de terrain, la météo et l'équipement recommandé..."
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Points forts du parcours
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Ajouter un point fort..."
                className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-3 py-1.5 text-xs font-bold bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg"
              >
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-stone-100 border border-stone-300 text-stone-800"
                >
                  <span>{h}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(i)}
                    className="text-stone-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Après-ride */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Rituel d’Après-Ride Belge
            </label>
            <input
              type="text"
              value={formData.apresRide}
              onChange={(e) => setFormData({ ...formData, apresRide: e.target.value })}
              placeholder="Ex: Gaufres liégeoises chaudes, dégustation d'une bière locale..."
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* GPX File Upload */}
          <div className="pt-2 space-y-2">
            {gpxSyncNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{gpxSyncNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setGpxSyncNotice(null)}
                  className="text-emerald-700 hover:text-emerald-950 font-bold px-1.5"
                >
                  ×
                </button>
              </div>
            )}

            <GpxUploadField
              fileName={formData.gpxFileName}
              fileSize={formData.gpxFileSize}
              gpxData={formData.gpxData}
              uploadedAt={formData.gpxUploadedAt}
              defaultTitle={formData.title || 'Sortie Cycliste KM0'}
              defaultDiscipline={formData.discipline}
              defaultDistanceKm={formData.distanceKm}
              defaultElevationM={formData.elevationM}
              defaultLocation={formData.startLocation || formData.region}
              onChange={({ gpxFileName, gpxFileSize, gpxData, gpxUploadedAt }) =>
                setFormData((prev) => ({
                  ...prev,
                  gpxFileName,
                  gpxFileSize,
                  gpxData,
                  gpxUploadedAt,
                }))
              }
              onExtractProfile={(extracted) => {
                setFormData((prev) => ({
                  ...prev,
                  elevationProfile: extracted.elevationProfile,
                  // NOTE: formData.elevationM & distanceKm are preserved as entered manually by the user
                }));
                setGpxSyncNotice(
                  `Courbe de profil altimétrique générée d'après la trace GPX pour le graphique de relief. Votre dénivelé officiel reste celui saisi manuellement (${formData.elevationM}m D+).`
                );
              }}
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{rideToEdit ? 'Enregistrer les modifications' : 'Créer l’activité'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
