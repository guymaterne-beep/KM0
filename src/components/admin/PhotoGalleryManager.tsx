import React, { useState, useRef } from 'react';
import {
  ImagePlus,
  UploadCloud,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Check,
  AlertCircle,
  Camera,
} from 'lucide-react';

// Curated KM0 high-definition cycling photos ready to pick with 1 click
export const KM0_PRESET_PHOTOS = [
  {
    category: 'VTT & Forêt Ardennaise',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    title: 'Singletrack VTT sous-bois sauvage',
  },
  {
    category: 'VTT & Action',
    url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
    title: 'Franchissement technique et relance',
  },
  {
    category: 'Gravel & Pistes',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
    title: 'Gravel le long des pistes de terre',
  },
  {
    category: 'Peloton Gravel & Crêtes',
    url: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1200&q=80',
    title: 'Lumière dorée sur les crêtes',
  },
  {
    category: 'Peloton & Camaraderie',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    title: 'Le peloton uni sur les routes belges',
  },
  {
    category: 'Bikepacking & Aventure',
    url: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
    title: 'Vélos équipés en bivouac',
  },
  {
    category: 'Brume & Hautes Fagnes',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    title: 'Atmosphère nordique et sapinière',
  },
  {
    category: 'Sentier du Brabant',
    url: 'https://images.unsplash.com/photo-1502744688674-c619d3864003?auto=format&fit=crop&w=1200&q=80',
    title: 'Allée de sous-bois aux aiguilles de pin',
  },
  {
    category: 'Clubhouse & Après-Ride',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    title: 'Café, bière locale et partage',
  },
];

interface PhotoGalleryManagerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  title?: string;
  subtitle?: string;
}

export default function PhotoGalleryManager({
  photos = [],
  onChange,
  title = 'Galerie Photos',
  subtitle = 'Ces photos seront visibles sur le site dans la fiche détaillée de l’activité.',
}: PhotoGalleryManagerProps) {
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [previewingPhoto, setPreviewingPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add photo from URL
  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    const trimmed = urlInput.trim();
    if (!trimmed.startsWith('http') && !trimmed.startsWith('data:image')) {
      setErrorMessage('L’adresse URL doit commencer par http:// ou https://');
      return;
    }

    onChange([...photos, trimmed]);
    setUrlInput('');
    setErrorMessage(null);
  };

  // Process uploaded files
  const handleFiles = (files: FileList | File[]) => {
    setErrorMessage(null);
    const fileArray = Array.from(files);

    const validImageFiles = fileArray.filter((file) => file.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      setErrorMessage('Veuillez sélectionner des fichiers images valides (JPG, PNG, WebP).');
      return;
    }

    const readPromises = validImageFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        // Warning if file is > 4MB
        if (file.size > 4.5 * 1024 * 1024) {
          reject(new Error(`Le fichier "${file.name}" dépasse 4 Mo. Privilégiez des photos optimisées.`));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Erreur de lecture.'));
          }
        };
        reader.onerror = () => reject(new Error('Erreur de lecture.'));
        reader.readAsDataURL(file);
      });
    });

    Promise.allSettled(readPromises).then((results) => {
      const newUrls: string[] = [];
      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          newUrls.push(res.value);
        } else {
          setErrorMessage(res.reason?.message || 'Erreur lors du traitement d’une photo.');
        }
      });

      if (newUrls.length > 0) {
        onChange([...photos, ...newUrls]);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const item = photos[index];
    const remaining = photos.filter((_, i) => i !== index);
    onChange([item, ...remaining]);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const copy = [...photos];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onChange(copy);
  };

  const handleAddPreset = (url: string) => {
    if (!photos.includes(url)) {
      onChange([...photos, url]);
    }
  };

  const handleAddAllPresets = () => {
    const sampleToAdd = KM0_PRESET_PHOTOS.slice(0, 4).map((p) => p.url);
    const unique = Array.from(new Set([...photos, ...sampleToAdd]));
    onChange(unique);
    setShowPresetsModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-600" />
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-900">
              {title}
            </label>
            {photos.length > 0 && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                {photos.length} photo{photos.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPresetsModal(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ouvrir la bibliothèque de photos cyclistes KM0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Bibliothèque KM0</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
          }
        }}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-700 hover:text-red-950 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Drop Zone & URL input row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`sm:col-span-2 p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[90px] ${
            isDragging
              ? 'border-amber-500 bg-amber-50'
              : 'border-stone-300 bg-stone-50/70 hover:bg-stone-100 hover:border-amber-400'
          }`}
        >
          <UploadCloud className="w-6 h-6 text-amber-600 mb-1" />
          <p className="text-xs font-bold text-stone-800">
            Cliquez pour parcourir ou glissez vos photos ici
          </p>
          <p className="text-[10px] text-stone-500">JPG, PNG, WebP (sélection multiple supportée)</p>
        </div>

        {/* URL Add box */}
        <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex flex-col justify-between gap-2">
          <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-stone-400" />
            <span>Ajouter par lien URL</span>
          </div>
          <div className="space-y-1.5">
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => handleAddUrl()}
              disabled={!urlInput.trim()}
              className="w-full py-1 text-xs font-bold bg-[#1e2f47] hover:bg-[#152336] disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
            >
              + Ajouter la photo
            </button>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {photos.map((photoUrl, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 aspect-4/3 shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={photoUrl}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute(
                    'src',
                    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80'
                  );
                }}
              />

              {/* Cover Badge on index 0 */}
              {idx === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 z-10">
                  <Star className="w-3 h-3 fill-stone-950" />
                  <span>Couverture</span>
                </div>
              )}

              {/* Hover Overlay with Controls */}
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewingPhoto(photoUrl)}
                    className="p-1 rounded bg-white/80 hover:bg-white text-stone-900 transition-colors"
                    title="Agrandir la photo"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1 rounded bg-red-600/90 hover:bg-red-600 text-white transition-colors"
                    title="Supprimer cette photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-1">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded shadow-xs"
                      title="Mettre en photo de couverture principale"
                    >
                      ★ Couverture
                    </button>
                  )}

                  <div className="flex items-center gap-1 ml-auto">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'left')}
                        className="p-1 rounded bg-white/80 hover:bg-white text-stone-900"
                        title="Déplacer vers la gauche"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                    )}
                    {idx < photos.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'right')}
                        className="p-1 rounded bg-white/80 hover:bg-white text-stone-900"
                        title="Déplacer vers la droite"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-center text-xs text-stone-600">
          <p>
            Aucune photo ajoutée pour le moment. Vous pouvez en téléverser depuis votre ordinateur, coller des URL ou utiliser les photos modèles de la{' '}
            <button
              type="button"
              onClick={() => setShowPresetsModal(true)}
              className="text-amber-800 font-bold underline cursor-pointer"
            >
              bibliothèque KM0
            </button>
            .
          </p>
        </div>
      )}

      {/* Presets Modal */}
      {showPresetsModal && (
        <div className="fixed inset-0 z-60 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="font-display text-lg font-bold uppercase text-stone-950">
                  Bibliothèque de Photos Cyclistes KM0
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPresetsModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Cliquez sur une photo pour l’ajouter immédiatement à la galerie de cette activité, ou ajoutez un pack complet.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {KM0_PRESET_PHOTOS.map((preset, i) => {
                const isAlreadyAdded = photos.includes(preset.url);
                return (
                  <div
                    key={i}
                    onClick={() => handleAddPreset(preset.url)}
                    className={`group relative rounded-xl overflow-hidden aspect-4/3 border cursor-pointer transition-all ${
                      isAlreadyAdded
                        ? 'border-emerald-500 ring-2 ring-emerald-400/40'
                        : 'border-stone-200 hover:border-amber-400 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                      <span className="text-[10px] font-bold truncate">{preset.title}</span>
                      <span className="text-[9px] text-amber-300 truncate">{preset.category}</span>
                    </div>

                    {isAlreadyAdded && (
                      <div className="absolute top-2 right-2 p-1 rounded-full bg-emerald-500 text-white shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={handleAddAllPresets}
                className="px-3.5 py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#1e2f47] border border-blue-200 rounded-xl transition-colors cursor-pointer"
              >
                + Ajouter la sélection recommandée (4 photos)
              </button>

              <button
                type="button"
                onClick={() => setShowPresetsModal(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-200 hover:bg-stone-300 rounded-xl cursor-pointer"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      {previewingPhoto && (
        <div
          onClick={() => setPreviewingPhoto(null)}
          className="fixed inset-0 z-70 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[85vh]">
            <img
              src={previewingPhoto}
              alt="Aperçu grand format"
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl border border-stone-800"
            />
            <button
              onClick={() => setPreviewingPhoto(null)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-white text-stone-950 shadow-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
