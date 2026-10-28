import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Mail, Users, CheckCircle2, Eye, Sparkles } from 'lucide-react';

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailComposerModal({ isOpen, onClose }: EmailComposerModalProps) {
  const { members, sendBroadcastEmail, adminEmail } = useApp();

  const [segment, setSegment] = useState<'all_subscribers' | 'active_members' | 'captains' | 'vtt_riders'>('all_subscribers');
  const [subject, setSubject] = useState('🚴‍♂️ Sortie Hivernale du Samedi : Conditions & Heure de Rendez-vous');
  const [emailType, setEmailType] = useState('sortie');
  const [message, setMessage] = useState(
    `Bonjour {{prenom}},\n\nCe samedi, le peloton de Projet KM0 Belgique se retrouve pour notre grande boucle VTT hivernale dans les sous-bois ardennais.\n\nPoints clés pour samedi :\n- Départ : 09h00 précises au Clubhouse\n- Conditions : terrain gras et meuble, prévoir pression basse (1.4-1.6 bar) et tenue thermique\n- À l'arrivée : marmite de soupe aux légumes chauds et verre de l'amitié partagé !\n\nConfirmez votre présence directement via le calendrier sur le site.\n\nÀ samedi sur les pédales,\nGuy Materne · Référent KM0 Belgique`
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate recipients according to selected segment
  const getRecipients = () => {
    switch (segment) {
      case 'active_members':
        return members.filter((m) => m.status === 'active');
      case 'captains':
        return members.filter((m) => m.role === 'captain' || m.role === 'admin');
      case 'vtt_riders':
        return members.filter((m) => m.preferredDiscipline === 'vtt' || m.preferredDiscipline === 'all');
      case 'all_subscribers':
      default:
        return members.filter((m) => m.subscribedToNewsletter);
    }
  };

  const recipients = getRecipients();
  const segmentLabel =
    segment === 'active_members'
      ? `Membres actifs uniquement (${recipients.length})`
      : segment === 'captains'
      ? `Capitaines de route & Staff (${recipients.length})`
      : segment === 'vtt_riders'
      ? `Pratiquants VTT (${recipients.length})`
      : `Tous les abonnés à la mailing list (${recipients.length})`;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendBroadcastEmail({
      subject,
      targetSegment: segmentLabel,
      body: message,
      recipientsCount: recipients.length,
    });
    setSentSuccess(true);
  };

  const insertTag = (tag: string) => {
    setMessage((prev) => prev + tag);
  };

  const previewRendered = message
    .replace(/{{prenom}}/g, 'Philippe')
    .replace(/{{nom}}/g, 'Gilbert')
    .replace(/{{club}}/g, 'Projet KM0 Belgique');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-600" />
            <h3 className="font-display text-xl font-bold uppercase text-stone-900">
              Rédiger un Email / Broadcast au Club
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {sentSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-display text-2xl font-bold uppercase text-stone-900">
                Email envoyé avec succès !
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Votre communication a été transmise à <strong className="text-stone-900">{recipients.length} destinataires</strong> ({segmentLabel}). L’historique d’envoi a été mis à jour dans le tableau de bord.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => {
                    setSentSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-5">
              {/* Target Segment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>Segment Destinataires *</span>
                  </label>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="all_subscribers">Tous les abonnés à la Mailing List</option>
                    <option value="active_members">Membres actifs uniquement (cotisation valide)</option>
                    <option value="captains">Capitaines de route &amp; Staff uniquement</option>
                    <option value="vtt_riders">Pratiquants VTT d'Hiver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Nombre de destinataires ciblés
                  </label>
                  <div className="h-9 px-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-600">Total calculé en direct :</span>
                    <span className="font-bold text-amber-700 text-sm">{recipients.length} membres</span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Objet de l’Email *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Sortie Hivernale du Samedi : Conditions & Rendez-vous"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              {/* Editor Toolbar with tags */}
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Corps du Message
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-stone-400">Insérer variable :</span>
                  <button
                    type="button"
                    onClick={() => insertTag(' {{prenom}} ')}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[10px]"
                  >
                    {"{{prenom}}"}
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTag(' {{nom}} ')}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[10px]"
                  >
                    {"{{nom}}"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="ml-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{previewMode ? 'Mode Rédaction' : 'Aperçu Rendu'}</span>
                  </button>
                </div>
              </div>

              {previewMode ? (
                /* Live Email Mockup Preview */
                <div className="p-6 rounded-2xl bg-stone-100 border border-stone-300">
                  <div className="max-w-lg mx-auto bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden text-xs text-stone-800">
                    <div className="bg-stone-900 p-4 text-white flex items-center justify-between">
                      <span className="font-display font-black tracking-wide text-lg">PROJET KM0 BELGIQUE</span>
                      <span className="text-[10px] text-amber-400 font-mono">CLUB CYCLISTE</span>
                    </div>
                    <div className="p-5 space-y-3 whitespace-pre-wrap leading-relaxed">
                      {previewRendered}
                    </div>
                    <div className="p-4 bg-stone-50 border-t border-stone-100 text-[10px] text-stone-500 text-center">
                      Vous recevez cet email car vous êtes membre de Projet KM0 Belgique · <span className="underline">Se désabonner</span>
                    </div>
                  </div>
                </div>
              ) : (
                <textarea
                  rows={8}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-3 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                />
              )}

              {/* Action buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Expéditeur : <strong className="text-stone-800">Guy Materne (guymaterne@gmail.com)</strong>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer aux {recipients.length} destinataires</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
