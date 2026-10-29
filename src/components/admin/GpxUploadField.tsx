import React, { useState, useRef } from 'react';
import { UploadCloud, FileDown, CheckCircle2, Trash2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { formatFileSize, validateGpxContent, downloadGpxFile, generateSampleGpx } from '../../utils/gpxHelper';

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
  defaultTitle = 'Sortie KM0 Belgique',
  defaultDiscipline = 'gravel',
  defaultDistanceKm = 50,
  defaultElevationM = 800,
  defaultLocation = 'Belgique',
}: GpxUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);

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
  };

  const handleTestDownload = () => {
    downloadGpxFile(fileName, gpxData, defaultTitle);
  };

  const hasFile = Boolean(fileName);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Trace GPX Officielle à télécharger
        </label>
        {hasFile && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Fichier prêt pour les adhérents</span>
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
        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
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
              <FileDown className="w-3.5 h-3.5 text-amber-600" />
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
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-500 bg-amber-50/60'
              : 'border-stone-300 bg-stone-50/60 hover:bg-stone-100 hover:border-amber-400'
          }`}
        >
          <UploadCloud className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="text-xs font-bold text-stone-900 mb-1">
            Glissez-déposez votre fichier GPX ici, ou <span className="text-amber-700 underline">parcourez vos dossiers</span>
          </p>
          <p className="text-[11px] text-stone-500 max-w-sm mx-auto mb-3">
            Fichier .gpx officiel compatible avec GPS Garmin, Wahoo, Hammerhead, Karoo, Strava et Komoot.
          </p>

          <div className="pt-2 border-t border-stone-200/80 inline-block" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleGenerateDefault}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg shadow-xs flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Générer automatiquement une trace modèle KM0 pour cette sortie</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
