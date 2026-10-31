import { useState, useEffect } from 'react';
import { MembershipTier } from '../../data/club';
import { X, Tag, Save, Check, Plus, Trash2 } from 'lucide-react';

interface TierFormModalProps {
  isOpen: boolean;
  tierToEdit: MembershipTier | null;
  onClose: () => void;
  onSave: (tierData: any) => void;
}

export default function TierFormModal({ isOpen, tierToEdit, onClose, onSave }: TierFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    pricePerYear: 150,
    period: 'Par an (saison complète)',
    badge: '',
    description: '',
    features: [
      'Accès aux sorties hebdos du club',
      'Assurance cycliste incluse',
      'Maillot officiel du club offert',
      'Accès Strava & WhatsApp',
    ],
    ctaText: 'Rejoindre le Club',
    recommended: false,
    active: true,
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (tierToEdit) {
      setFormData({
        name: tierToEdit.name,
        pricePerYear: tierToEdit.pricePerYear,
        period: tierToEdit.period,
        badge: tierToEdit.badge || '',
        description: tierToEdit.description,
        features: tierToEdit.features || [],
        ctaText: tierToEdit.ctaText,
        recommended: !!tierToEdit.recommended,
        active: tierToEdit.active !== false,
      });
    } else {
      setFormData({
        name: '',
        pricePerYear: 150,
        period: 'Par an (saison complète)',
        badge: 'Nouvelle Formule',
        description: 'Formule d’adhésion pour les cyclistes du club KM0 Belgique.',
        features: [
          'Accès illimité à toutes les sorties officielles',
          'Assurance responsabilité civile incluse',
          'Traces GPX exclusives du club',
          'Remise de 10% sur les stages KM0',
        ],
        ctaText: 'Rejoindre le Club',
        recommended: false,
        active: true,
      });
    }
  }, [tierToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (idx: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            <h3 className="font-display text-xl font-bold uppercase text-stone-900">
              {tierToEdit ? `Modifier la Formule "${tierToEdit.name}"` : 'Créer une Nouvelle Formule d’Adhésion'}
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
          {/* Name & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Nom de la Formule *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Membre Club KM0 Belgique"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Badge Mis en avant (optionnel)
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Ex: La plus populaire, Idéal pour tester..."
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Price, Period, CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Tarif en Euros (€) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.pricePerYear}
                onChange={(e) => setFormData({ ...formData, pricePerYear: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-mono font-bold text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Période de validité *
              </label>
              <input
                type="text"
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="Par an (saison complète)"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Texte du Bouton CTA *
              </label>
              <input
                type="text"
                required
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="Rejoindre le Club (Annuel)"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Description de la formule
            </label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Expliquez à qui s'adresse cette adhésion et ce qu'elle apporte..."
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Features List */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Avantages Inclus dans cette Formule
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Ajouter un avantage (ex: Maillot officiel offert, -15% voyages)..."
                className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 text-xs font-bold bg-[#1e2f47] hover:bg-[#152336] text-white rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-1 text-stone-400 hover:text-red-600 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Options: Recommended & Active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="isRec"
                checked={formData.recommended}
                onChange={(e) => setFormData({ ...formData, recommended: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 border-stone-300 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="isRec" className="text-xs text-stone-800 font-bold cursor-pointer">
                Mettre en avant comme « Formule Recommandée »
              </label>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 border-stone-300 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-xs text-stone-800 font-bold cursor-pointer">
                Formule Active (affichée sur le site public)
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#1e2f47] hover:bg-[#152336] rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{tierToEdit ? 'Enregistrer le tarif' : 'Créer la formule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
