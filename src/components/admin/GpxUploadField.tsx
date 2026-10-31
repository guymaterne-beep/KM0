import React, { useState, useRef, useMemo } from 'react';
import {
  UploadCloud,
  FileDown,
  CheckCircle2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Gauge,
  Check,
  Milestone,
} from 'lucide-react';
import {
  formatFileSize,
  validateGpxContent,
  downloadGpxFile,
  generateSampleGpx,
  extractElevationProfileFromGpx,
  GpxProfileExtraction,
} from '../../utils/gpxHelper';

interface GpxUploadFieldProps {
  fileName?: string;
  fileSize?: string;
  gpxData?: string;
  uploadedAt?: string;
  onChange: (gpxInfo: {
    gpxFileName?: string;
    gpxFileSize?: string;
    gpxData?: string;
    gpxUploadedAt?: string;
  }) => void;
  onExtractProfile?: (extracted: GpxProfileExtraction) => void;
  // Metadata used if admin chooses to auto-generate sample GPX
  defaultTitle?: string;
  defaultDiscipline?: string;
  defaultDistanceKm?: number;
  defaultElevationM?: number;
  defaultLocation?: string;
}

export default function GpxUploadField({
  fileName,
  fileSize,
  gpxData,
  uploadedAt,
  onChange,
  onExtractProfile,
  defaultTitle = 'Sortie KM0 Belgique',
  defaultDiscipline = 'gravel',
  defaultDistanceKm = 50,
  defaultElevationM = 800,
  defaultLocation = 'Belgique',
}: GpxUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAppliedProfile, setHasAppliedProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute elevation profile extraction whenever gpxData is present
  const extractedProfile = useMemo<GpxProfileExtraction | null>(() => {
    if (!gpxData || gpxData.trim().length < 20) return null;
    const res = extractElevationProfileFromGpx(gpxData);
    return res.valid ? res : null;
  }, [gpxData]);

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);
    setHasAppliedProfile(false);

    if (!file.name.toLowerCase().endsWith('.gpx') && !file.type.includes('gpx') && !file.type.includes('xml')) {
      setErrorMessage('Veuillez sélectionner un fichier avec l’extension .gpx');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const validation = validateGpxContent(content);

      if (!validation.valid && !content.includes('<gpx')) {
        setErrorMessage('Le fichier sélectionné ne semble pas être un fichier GPX valide.');
        return;
      }

      const formattedSize = formatFileSize(file.size);
      const now = new Date();
      const dateFormatted = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('fr-BE', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

      onChange({
        gpxFileName: file.name,
        gpxFileSize: formattedSize,
        gpxData: content,
        gpxUploadedAt: dateFormatted,
      });

      // Auto-extract profile directly on load if callback provided
      if (onExtractProfile) {
        const extracted = extractElevationProfileFromGpx(content);
        if (extracted.valid) {
          onExtractProfile(extracted);
          setHasAppliedProfile(true);
        }
      }
    };

    reader.onerror = () => {
      setErrorMessage('Erreur lors de la lecture du fichier GPX.');
    };

    reader.readAsText(file);
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
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setHasAppliedProfile(false);
    onChange({
      gpxFileName: undefined,
      gpxFileSize: undefined,
      gpxData: undefined,
      gpxUploadedAt: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateDefault = () => {
    const generatedContent = generateSampleGpx(
      defaultTitle,
      defaultDiscipline,
      defaultDistanceKm,
      defaultElevationM,
      defaultLocation
    );
    const cleanSlug = defaultTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const autoFileName = `trace_km0_${cleanSlug}_${defaultDistanceKm}km.gpx`;
    const now = new Date();
    const dateFormatted = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('fr-BE', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    onChange({
      gpxFileName: autoFileName,
      gpxFileSize: `${(generatedContent.length / 1024).toFixed(1)} KB`,
      gpxData: generatedContent,
      gpxUploadedAt: dateFormatted,
    });

    // Auto extract profile from generated sample
    if (onExtractProfile) {
      const extracted = extractElevationProfileFromGpx(generatedContent);
      if (extracted.valid) {
        onExtractProfile(extracted);
        setHasAppliedProfile(true);
      }
    }
  };

  const handleApplyProfileClick = () => {
    if (!extractedProfile || !onExtractProfile) return;
    onExtractProfile(extractedProfile);
    setHasAppliedProfile(true);
  };

  const handleTestDownload = () => {
    downloadGpxFile(fileName, gpxData, defaultTitle);
  };

  const hasFile = Boolean(fileName);

  // Mini SVG points for extracted elevation preview
  const previewSvg = useMemo(() => {
    if (!extractedProfile || extractedProfile.elevationProfile.length === 0) return null;
    const prof = extractedProfile.elevationProfile;
    const width = 360;
    const height = 80;
    const polyline = prof
      .map((val, idx) => {
        const x = (idx / (prof.length - 1)) * width;
        const y = height - (val / 100) * (height - 10) - 5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    const area = `0,${height} ${polyline} ${width},${height}`;
    return { polyline, area };
  }, [extractedProfile]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Trace GPX &amp; Profil Altimétrique
        </label>
        {hasFile && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Fichier GPX lié à la sortie</span>
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".gpx,application/gpx+xml,text/xml"
        className="hidden"
      />

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {hasFile ? (
        <div className="space-y-3">
          {/* File Card */}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1e2f47] flex items-center justify-center shrink-0 border border-blue-300">
                <span className="font-mono text-xs font-black">GPX</span>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                  {fileName}
                </div>
                <div className="text-[11px] text-stone-500 flex items-center gap-2">
                  <span>{fileSize || 'Taille non renseignée'}</span>
                  {uploadedAt && (
                    <>
                      <span>•</span>
                      <span>Ajouté le {uploadedAt}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleTestDownload}
                className="px-3 py-1.5 text-xs font-bold bg-white text-stone-800 hover:bg-stone-50 border border-stone-300 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Tester le téléchargement du fichier"
              >
                <FileDown className="w-3.5 h-3.5 text-[#1e2f47]" />
                <span>Tester téléchargement</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                title="Remplacer par un autre fichier GPX"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Supprimer la trace GPX"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Elevation Profile Generation Panel */}
          {extractedProfile && (
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-[#1e2f47]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Courbe de relief altimétrique (Visuel)
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Génère la silhouette du relief ({extractedProfile.pointCount} points GPS). Votre D+ officiel reste manuel.
                    </p>
                  </div>
                </div>

                {onExtractProfile && (
                  <button
                    type="button"
                    onClick={handleApplyProfileClick}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                      hasAppliedProfile
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-[#1e2f47] hover:bg-[#152336] text-white border-[#1e2f47] shadow-xs'
                    }`}
                  >
                    {hasAppliedProfile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Courbe de relief synchronisée</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Appliquer la courbe au profil visuel</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Stats badges extracted from GPX */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Dénivelé D+</span>
                  <span className="text-xs font-bold text-amber-800 font-mono">
                    Saisi manuellement
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Distance GPX</span>
                  <span className="text-xs font-bold text-stone-900 font-mono">
                    {extractedProfile.distanceKm} km
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Alt. Min / Max</span>
                  <span className="text-xs font-bold text-stone-800 font-mono">
                    {extractedProfile.minElevationM}m / {extractedProfile.maxElevationM}m
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Points GPS</span>
                  <span className="text-xs font-bold text-stone-600 font-mono">
                    {extractedProfile.pointCount} coordonnées
                  </span>
                </div>
              </div>

              {/* Graphic curve SVG */}
              {previewSvg && (
                <div className="w-full h-20 bg-stone-50 rounded-lg p-2 border border-stone-200 relative overflow-hidden">
                  <svg viewBox="0 0 360 80" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gpxCurveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="20" x2="360" y2="20" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <line x1="0" y1="40" x2="360" y2="40" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="360" y2="60" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <polygon points={previewSvg.area} fill="url(#gpxCurveGradient)" />
                    <polyline points={previewSvg.polyline} fill="none" stroke="#ea580c" strokeWidth="2.5" />
                  </svg>
                  <div className="absolute left-2.5 bottom-1 text-[9px] text-stone-500 font-mono">
                    Départ : {extractedProfile.minElevationM}m
                  </div>
                  <div className="absolute right-2.5 bottom-1 text-[9px] text-stone-500 font-mono">
                    Sommet : {extractedProfile.maxElevationM}m
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#1e2f47] bg-blue-50/60'
              : 'border-stone-300 bg-stone-50/60 hover:bg-stone-100 hover:border-blue-400'
          }`}
        >
          <UploadCloud className="w-8 h-8 text-[#1e2f47] mx-auto mb-2" />
          <p className="text-xs font-bold text-stone-900 mb-1">
            Glissez-déposez votre fichier GPX ici, ou <span className="text-[#1e2f47] underline">parcourez vos dossiers</span>
          </p>
          <p className="text-[11px] text-stone-500 max-w-sm mx-auto mb-3">
            Fichier .gpx officiel. L'altimétrie et le profil de dénivelé seront calculés automatiquement.
          </p>

          <div className="pt-2 border-t border-stone-200/80 inline-block" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleGenerateDefault}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg shadow-xs flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1e2f47]" />
              <span>Générer automatiquement une trace &amp; profil modèle KM0 pour cette sortie</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
