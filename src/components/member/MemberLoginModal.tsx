import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPortal: () => void;
}

export const MemberLoginModal: React.FC<MemberLoginModalProps> = ({
  isOpen,
  onClose,
  onOpenPortal,
}) => {
  const { loginMember, members } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = loginMember(email, password);
    if (success) {
      onClose();
      onOpenPortal();
    } else {
      setError('Email ou mot de passe incorrect. Vérifiez vos identifiants ou contactez le club.');
    }
  };

  const handleQuickDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    const success = loginMember(demoEmail, demoPass);
    if (success) {
      onClose();
      onOpenPortal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Espace Membre KM0</h3>
              <p className="text-xs text-stone-500">Connexion adhérent & cycliste</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Adresse Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.be"
                  className="w-full px-3.5 py-2.5 pl-10 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Mot de passe
                </label>
                <span className="text-[11px] text-amber-700 hover:underline cursor-pointer">
                  Mot de passe oublié ?
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pl-10 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <span>Me connecter à mon Espace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-center gap-1.5 mb-2 text-stone-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Comptes démo disponibles (clic rapide) :
              </span>
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('alex.debacker@skynet.be', 'km0belgique')}
                className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-amber-50/60 border border-stone-200 text-xs flex justify-between items-center transition-colors"
              >
                <div>
                  <span className="font-semibold text-stone-800">Alexandre De Backer</span>
                  <span className="text-[10px] text-stone-500 block">Capitaine VTT & Ardennes</span>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  Connecter
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('celine.vdm@proximus.be', 'km0belgique')}
                className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-amber-50/60 border border-stone-200 text-xs flex justify-between items-center transition-colors"
              >
                <div>
                  <span className="font-semibold text-stone-800">Céline Vandenameele</span>
                  <span className="text-[10px] text-stone-500 block">Capitaine Gravel Brabant</span>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  Connecter
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
