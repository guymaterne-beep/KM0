import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  ArrowRight,
  Smartphone,
  Receipt,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentTransaction } from '../../data/club';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  itemTitle: string;
  itemSubtitle?: string;
  targetType: 'membership' | 'ride' | 'trip';
  targetId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  password?: string;
  onPaymentSuccess?: (transaction: PaymentTransaction) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  amount,
  itemTitle,
  itemSubtitle,
  targetType,
  targetId,
  customerName,
  customerEmail,
  customerPhone = '',
  password,
  onPaymentSuccess,
}) => {
  const { stripeConfig, bankConfig, processPayment } = useApp();

  const [activeTab, setActiveTab] = useState<'stripe' | 'wire' | 'bancontact'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form fields for Stripe Card
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(customerName || 'Guy Materne');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStripePay = (isApplePay = false) => {
    setIsProcessing(true);
    setTimeout(() => {
      const tx = processPayment({
        amount,
        description: itemTitle,
        method: isApplePay ? 'apple_pay' : 'stripe_card',
        targetType,
        targetId,
        memberEmail: customerEmail,
        memberName: customerName,
        password,
      });
      setIsProcessing(false);
      setCompletedTx(tx);
      if (onPaymentSuccess) {
        onPaymentSuccess(tx);
      }
    }, 1200);
  };

  const handleBancontactPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const tx = processPayment({
        amount,
        description: itemTitle,
        method: 'bancontact',
        targetType,
        targetId,
        memberEmail: customerEmail,
        memberName: customerName,
        password,
      });
      setIsProcessing(false);
      setCompletedTx(tx);
      if (onPaymentSuccess) {
        onPaymentSuccess(tx);
      }
    }, 1500);
  };

  const handleWireTransferSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const tx = processPayment({
        amount,
        description: itemTitle,
        method: 'wire_transfer',
        targetType,
        targetId,
        memberEmail: customerEmail,
        memberName: customerName,
        password,
      });
      setIsProcessing(false);
      setCompletedTx(tx);
      if (onPaymentSuccess) {
        onPaymentSuccess(tx);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Paiement Sécurisé KM0 Belgique
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {completedTx ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-stone-900">
                {completedTx.method === 'wire_transfer'
                  ? 'Réservation / Inscription prise en compte !'
                  : 'Paiement confirmé avec succès !'}
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                {completedTx.method === 'wire_transfer'
                  ? 'Votre place est pré-réservée. Dès réception du virement sur le compte du club, Guy Materne validera définitivement votre dossier.'
                  : 'Votre paiement a été traité et votre compte membre KM0 Belgique est activé.'}
              </p>
            </div>

            {/* Receipt details */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-left space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-xs text-stone-500 uppercase font-medium">Référence</span>
                <span className="text-xs font-mono font-bold text-stone-800">{completedTx.reference}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500">Objet</span>
                <span className="text-sm font-semibold text-stone-900">{completedTx.description}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500">Bénéficiaire</span>
                <span className="text-xs text-stone-800">{customerName} ({customerEmail})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500">Mode de règlement</span>
                <span className="text-xs font-medium text-amber-700 capitalize">
                  {completedTx.method.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                <span className="text-sm font-bold text-stone-900">Montant total</span>
                <span className="text-lg font-black text-amber-600">{completedTx.amount} €</span>
              </div>

              {completedTx.structuredCommunication && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-xs font-bold text-amber-900 mb-1">
                    À mentionner impérativement sur votre virement :
                  </div>
                  <div className="text-sm font-mono font-black text-amber-800 tracking-wider">
                    {completedTx.structuredCommunication}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20"
              >
                Accéder à mon Espace Membre
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Summary Banner */}
            <div className="flex items-start justify-between p-4 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Récapitulatif de commande
                </span>
                <h4 className="text-base font-bold text-stone-900 mt-0.5">{itemTitle}</h4>
                {itemSubtitle && <p className="text-xs text-stone-600 mt-0.5">{itemSubtitle}</p>}
                <div className="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5">
                  <span>Adhérent :</span>
                  <span className="font-semibold text-stone-800">{customerName}</span>
                  <span>({customerEmail})</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-stone-900">{amount} €</span>
                <span className="block text-[11px] text-stone-500 font-medium">TTC</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Choisissez votre mode de paiement
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('stripe')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    activeTab === 'stripe'
                      ? 'border-amber-500 bg-amber-50/60 text-stone-900 font-bold shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1.5 text-amber-600" />
                  <span className="text-xs leading-tight">Carte / Apple Pay</span>
                  <span className="text-[10px] text-stone-400 font-normal">Stripe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('bancontact')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    activeTab === 'bancontact'
                      ? 'border-amber-500 bg-amber-50/60 text-stone-900 font-bold shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mb-1.5 text-blue-600" />
                  <span className="text-xs leading-tight">Bancontact</span>
                  <span className="text-[10px] text-stone-400 font-normal">Payconiq QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('wire')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    activeTab === 'wire'
                      ? 'border-amber-500 bg-amber-50/60 text-stone-900 font-bold shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-1.5 text-stone-700" />
                  <span className="text-xs leading-tight">Virement</span>
                  <span className="text-[10px] text-stone-400 font-normal">Gratuit BE</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Stripe Card & Apple Pay */}
            {activeTab === 'stripe' && (
              <div className="space-y-4">
                {stripeConfig.applePayEnabled && (
                  <button
                    type="button"
                    onClick={() => handleStripePay(true)}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl bg-black hover:bg-stone-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
                  >
                    <span>Payer avec</span>
                    <span className="text-base font-semibold"> Pay</span>
                    <span className="text-stone-400">/ Google Pay</span>
                  </button>
                )}

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-3 text-[11px] text-stone-400 uppercase font-semibold">
                    ou par carte bancaire
                  </span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Numéro de carte
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 pl-9 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-amber-500"
                        placeholder="4242 4242 4242 4242"
                      />
                      <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Date d’expiration
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-amber-500"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        CVC / Cryptogramme
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-amber-500"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nom sur la carte
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-amber-500"
                      placeholder="Prénom Nom"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chiffrement AES 256 bits via Stripe</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-stone-200 text-stone-700 font-mono">
                    Mode {stripeConfig.mode === 'test' ? 'Test Démo' : 'Live'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleStripePay(false)}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Traitement Stripe sécurisé...</span>
                    </div>
                  ) : (
                    <>
                      <span>Payer {amount} € en ligne</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: Bancontact / Payconiq */}
            {activeTab === 'bancontact' && (
              <div className="space-y-4 text-center">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center">
                  <div className="w-36 h-36 bg-white p-3 rounded-xl border border-stone-300 shadow-sm flex items-center justify-center mb-3">
                    <QrCode className="w-28 h-28 text-stone-800" />
                  </div>
                  <div className="text-xs font-bold text-stone-800">
                    Scannez avec votre application bancaire belge ou Payconiq
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Compatible Belfius, BNP Paribas Fortis, ING, KBC/CBC, etc.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBancontactPay}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connexion à l’application Bancontact...</span>
                    </div>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Valider via l'App Bancontact ({amount} €)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: Belgian Wire Transfer */}
            {activeTab === 'wire' && (
              <div className="space-y-4">
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/70 text-xs text-amber-900">
                  <p className="font-semibold mb-1">
                    🇧🇪 Virement bancaire belge classique (Sans frais de transaction)
                  </p>
                  <p className="text-amber-800">
                    Effectuez le virement depuis votre application bancaire (BNP Fortis, Belfius, KBC, ING, etc.)
                    en renseignant les coordonnées ci-dessous :
                  </p>
                </div>

                <div className="space-y-2.5 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">Bénéficiaire :</span>
                    <span className="font-semibold text-stone-800">{bankConfig.accountHolder}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">Banque :</span>
                    <span className="font-medium text-stone-700">{bankConfig.bankName}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-stone-200">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">IBAN Club</span>
                      <span className="font-mono font-bold text-stone-900 text-sm tracking-wide">
                        {bankConfig.iban}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(bankConfig.iban, 'iban')}
                      className="px-2 py-1 text-xs font-semibold rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'iban' ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500">Code BIC / SWIFT :</span>
                    <span className="font-mono font-bold text-stone-700">{bankConfig.bic}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <span className="text-[10px] text-amber-800 uppercase font-bold block">
                        Communication Structurée
                      </span>
                      <span className="font-mono font-black text-amber-900 text-sm tracking-wider">
                        +++104/8921/33492+++
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('+++104/8921/33492+++', 'comm')}
                      className="px-2 py-1 text-xs font-semibold rounded bg-amber-200/70 hover:bg-amber-300 text-amber-950 flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'comm' ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Validation manuelle dès réception par Guy Materne (administrateur KM0 Belgique).</span>
                </div>

                <button
                  type="button"
                  onClick={handleWireTransferSubmit}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enregistrement de la demande...</span>
                    </div>
                  ) : (
                    <>
                      <span>Confirmer mon engagement par virement</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
