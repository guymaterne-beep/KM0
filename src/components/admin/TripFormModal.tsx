import { useState, useEffect } from 'react';
import { Trip } from '../../data/trips';
import { X, Compass, Save } from 'lucide-react';
import GpxUploadField from './GpxUploadField';
import PhotoGalleryManager from './PhotoGalleryManager';

interface TripFormModalProps {
  isOpen: boolean;
  tripToEdit: Trip | null;
  onClose: () => void;
  onSave: (tripData: any) => void;
}

export default function TripFormModal({ isOpen, tripToEdit, onClose, onSave }: TripFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    discipline: 'gravel' as Trip['discipline'],
    destination: '',
    country: 'Belgique',
    durationDays: 3,
    dates: '12 - 14 Juin 2026',
    priceEuro: 450,
    physicalLevel: 3 as Trip['physicalLevel'],
    technicalLevel: 3 as Trip['technicalLevel'],
    groupSize: '8 à 12 riders',
    guide: 'Guy Materne (Référent KM0 BE)',
    status: 'inscriptions-ouvertes' as Trip['status'],
    coverDescription: '',
    highlights: ['Parcours exclusif balisé', 'Hébergement de charme', 'Repas du terroir'],
    included: ['Encadrement certifié KM0', 'Hébergement & demi-pension', 'Traces GPX', 'Assistance mécanique'],
    dailyProgram: [
      { day: 'Jour 1', title: 'Étape inaugurale & immersion', desc: 'Première prise de contact et parcours de mise en jambe.', stats: '75 km · 1 200m D+' },
      { day: 'Jour 2', title: 'L’Étape Reine', desc: 'Le grand défi du séjour sur les pistes sauvages.', stats: '95 km · 1 800m D+' },
      { day: 'Jour 3', title: 'Finish & Célébration', desc: 'Dernière boucle panoramique et débrief convivial.', stats: '60 km · 900m D+' },
    ] as Trip['dailyProgram'],
    tagKm0Partner: 'Connexion officielle KM0',
    gpxFileName: '' as string | undefined,
    gpxFileSize: '' as string | undefined,
    gpxData: '' as string | undefined,
    gpxUploadedAt: '' as string | undefined,
    photos: [] as string[],
  });

  const [highlightInput, setHighlightInput] = useState('');
  const [includedInput, setIncludedInput] = useState('');

  useEffect(() => {
    if (tripToEdit) {
      setFormData({
        title: tripToEdit.title,
        subtitle: tripToEdit.subtitle,
        discipline: tripToEdit.discipline,
        destination: tripToEdit.destination,
        country: tripToEdit.country,
        durationDays: tripToEdit.durationDays,
        dates: tripToEdit.dates,
        priceEuro: tripToEdit.priceEuro,
        physicalLevel: tripToEdit.physicalLevel,
        technicalLevel: tripToEdit.technicalLevel,
        groupSize: tripToEdit.groupSize,
        guide: tripToEdit.guide,
        status: tripToEdit.status,
        coverDescription: tripToEdit.coverDescription,
        highlights: tripToEdit.highlights || [],
        included: tripToEdit.included || [],
        dailyProgram: tripToEdit.dailyProgram || [],
        tagKm0Partner: tripToEdit.tagKm0Partner || '',
        gpxFileName: tripToEdit.gpxFileName || '',
        gpxFileSize: tripToEdit.gpxFileSize || '',
        gpxData: tripToEdit.gpxData || '',
        gpxUploadedAt: tripToEdit.gpxUploadedAt || '',
        photos: tripToEdit.photos || [],
      });
    } else {
      setFormData({
        title: '',
        subtitle: 'Une aventure cycliste d’exception encadrée par KM0',
        discipline: 'gravel',
        destination: 'Ardennes belges & Semois',
        country: 'Belgique',
        durationDays: 3,
        dates: '18 - 20 Septembre 2026',
        priceEuro: 450,
        physicalLevel: 3,
        technicalLevel: 3,
        groupSize: '8 à 12 riders',
        guide: 'Guy Materne (Référent KM0 BE)',
        status: 'inscriptions-ouvertes',
        coverDescription: 'Partez à la conquête des plus beaux paysages sur plusieurs jours avec une logistique irréprochable.',
        highlights: ['Parcours exclusif balisé', 'Hébergement de charme', 'Repas du terroir'],
        included: ['Encadrement certifié KM0', 'Hébergement & demi-pension', 'Traces GPX', 'Assistance mécanique'],
        dailyProgram: [
          { day: 'Jour 1', title: 'Étape inaugurale', desc: 'Départ le matin et traversée des sous-bois profonds.', stats: '75 km · 1 200m D+' },
          { day: 'Jour 2', title: 'L’Étape Reine', desc: 'Le grand défi du séjour sur les crêtes panoramiques.', stats: '95 km · 1 800m D+' },
          { day: 'Jour 3', title: 'Finish & Célébration', desc: 'Dernière boucle et repas de clôture avec bières locales.', stats: '60 km · 900m D+' },
        ],
        tagKm0Partner: 'Projet KM0 Belgique',
        gpxFileName: '',
        gpxFileSize: '',
        gpxData: '',
        gpxUploadedAt: '',
        photos: [],
      });
    }
  }, [tripToEdit, isOpen]);

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

  const addIncluded = () => {
    if (includedInput.trim()) {
      setFormData({ ...formData, included: [...formData.included, includedInput.trim()] });
      setIncludedInput('');
    }
  };

  const removeIncluded = (idx: number) => {
    setFormData({
      ...formData,
      included: formData.included.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <h3 className="font-display text-xl font-bold uppercase text-stone-900">
              {tripToEdit ? 'Modifier le Voyage / Stage' : 'Créer un Nouveau Voyage / Stage'}
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
          {/* Title & Subtitle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Titre du Voyage / Stage *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Trans-Ardennes Gravel Bikepacking"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Sous-titre / Accroche
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Ex: 3 jours d'aventure sauvage et nuits insolites en Wallonie"
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Discipline, Country, Destination */}
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
                <option value="gravel">Gravel Bikepacking</option>
                <option value="vtt">VTT Stage &amp; Expédition</option>
                <option value="route">Route &amp; Classiques</option>
                <option value="stage">Stage d’Affûtage Foncier</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Pays / Région *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Ex: Belgique, Suisse, Espagne..."
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Statut Inscriptions *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="inscriptions-ouvertes">Inscriptions Ouvertes</option>
                <option value="dernieres-places">Dernières Places</option>
                <option value="complet">Complet</option>
              </select>
            </div>
          </div>

          {/* Dates, Duration, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Dates prévues *
              </label>
              <input
                type="text"
                required
                value={formData.dates}
                onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                placeholder="Ex: 15 - 17 Mai 2026"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Durée (jours) *
              </label>
              <input
                type="number"
                required
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Prix par personne (€) *
              </label>
              <input
                type="number"
                required
                value={formData.priceEuro}
                onChange={(e) => setFormData({ ...formData, priceEuro: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Description globale du séjour
            </label>
            <textarea
              rows={3}
              value={formData.coverDescription}
              onChange={(e) => setFormData({ ...formData, coverDescription: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              placeholder="Décrivez l'expérience, les paysages, l'ambiance et les souvenirs forts..."
            />
          </div>

          {/* Highlights & Inclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Points forts
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="Ex: 300km de pistes sauvages..."
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-3 py-1.5 text-xs font-bold bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg"
                >
                  +
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Services Inclus
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={includedInput}
                  onChange={(e) => setIncludedInput(e.target.value)}
                  placeholder="Ex: Demi-pension & ravitaillements..."
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addIncluded}
                  className="px-3 py-1.5 text-xs font-bold bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.included.map((inc, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-stone-100 border border-stone-300 text-stone-800"
                  >
                    <span>{inc}</span>
                    <button
                      type="button"
                      onClick={() => removeIncluded(i)}
                      className="text-stone-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* GPX File Upload for Trips */}
          <div className="pt-2">
            <GpxUploadField
              fileName={formData.gpxFileName}
              fileSize={formData.gpxFileSize}
              gpxData={formData.gpxData}
              uploadedAt={formData.gpxUploadedAt}
              defaultTitle={formData.title || 'Voyage Cycliste KM0'}
              defaultDiscipline={formData.discipline}
              defaultDistanceKm={formData.durationDays * 85}
              defaultElevationM={formData.durationDays * 1400}
              defaultLocation={formData.destination || formData.country}
              onChange={({ gpxFileName, gpxFileSize, gpxData, gpxUploadedAt }) =>
                setFormData({
                  ...formData,
                  gpxFileName,
                  gpxFileSize,
                  gpxData,
                  gpxUploadedAt,
                })
              }
            />
          </div>

          {/* Photo Gallery Manager */}
          <div className="pt-2 border-t border-stone-200">
            <PhotoGalleryManager
              photos={formData.photos}
              onChange={(newPhotos) => setFormData((prev) => ({ ...prev, photos: newPhotos }))}
              title="Galerie Photos du Voyage"
              subtitle="Photos des étapes, hébergements, paysages ou moments forts de l'aventure (affichées dans la fiche du voyage)."
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
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer font-bold"
            >
              <Save className="w-4 h-4" />
              <span>{tripToEdit ? 'Enregistrer les modifications' : 'Créer le voyage'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
