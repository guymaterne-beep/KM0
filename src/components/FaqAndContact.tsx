import { useState } from 'react';
import { ChevronDown, Send, CheckCircle2, Mail, MessageSquare } from 'lucide-react';

export default function FaqAndContact() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'question-club',
    message: '',
  });

  const faqs = [
    {
      q: 'Quel type de vélo faut-il posséder pour adhérer au club ?',
      a: 'Pour profiter pleinement de notre philosophie 4 saisons, l’idéal est d’avoir un VTT pour la période hivernale (novembre à février) et un vélo Gravel ou Route pour le reste de l’année (mars à octobre). Si vous ne possédez qu’un gravel avec des pneus larges (42mm+) bien cramponnés, vous pouvez aussi participer à de nombreuses sorties hivernales. Nous avons également des partenariats de location avec des magasins de cycles belges.',
    },
    {
      q: 'Comment s’organise la liaison avec Projet KM0 en Suisse ?',
      a: 'Projet KM0 est né en Suisse (projet-km0.ch). En tant que référent officiel belge, Guy Materne anime l’antenne nationale et le club cycliste belge selon les mêmes normes de qualité, de sécurité et d’encadrement certifié. Les membres du club KM0 Belgique bénéficient d’un tarif préférentiel et d’un accès direct aux expéditions et stages organisés en Suisse (canton de Fribourg, Alpes valaisannes, etc.).',
    },
    {
      q: 'Je débute en VTT hivernal : est-ce accessible ?',
      a: 'Absolument ! L’hiver en forêt est le meilleur moment pour acquérir une vraie aisance technique en toute sécurité. Les sols meubles absorbent les petites pertes d’adhérence et on roule à des allures douces. Sur chaque sortie, nous proposons au moins deux groupes d’allure (Découverte/Tempo et Sport).',
    },
    {
      q: 'Puis-je participer à une sortie d’essai avant d’adhérer à l’année ?',
      a: 'Oui, tout à fait. Vous pouvez souscrire notre "Formule Découverte" (3 sorties d’essai avec assurance incluse pour 35€), qui est ensuite intégralement déductible si vous décidez de prendre votre adhésion annuelle.',
    },
    {
      q: 'Où se font les départs des sorties ?',
      a: 'Nos sorties rayonnent principalement depuis le Brabant wallon (Wavre/Ottignies), les Ardennes liégeoises (Aywaille, Spa, Esneux), la région namuroise et les monts flandriens (Oudenaarde). Le lieu exact et l’adresse avec lien GPS sont communiqués à l’avance pour chaque événement.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-stone-50 text-stone-900 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* FAQ Column */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1e2f47] mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Questions Fréquentes</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-stone-950 tracking-tight mb-6">
              Tout Savoir sur le Club
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-stone-200 shadow-xs overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-stone-900 hover:text-[#1e2f47] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180 text-[#1e2f47]' : ''
                      }`}
                    />
                  </button>

                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Référent Belge</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-stone-950 mb-2">
              Une Question ? Un Projet de Groupe ?
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
              Contactez Guy Materne et l’équipe d’encadrement pour toute demande concernant le club, des sorties privatisées pour entreprises, ou des informations sur les voyages KM0.
            </p>

            {contactSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-display text-xl font-bold uppercase text-stone-950">
                  Message envoyé avec succès !
                </h4>
                <p className="text-stone-600 text-xs">
                  Merci {contactForm.name}. Nous vous répondrons dans les plus brefs délais.
                </p>
                <button
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactForm({ name: '', email: '', subject: 'question-club', message: '' });
                  }}
                  className="px-4 py-2 text-xs font-bold text-amber-700 underline hover:text-amber-800 cursor-pointer"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Votre Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Prénom Nom"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="votre@email.be"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Objet de la demande
                  </label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="question-club">Question générale sur le Club Cycliste</option>
                    <option value="vtt-hiver">Sorties VTT d’hiver en Ardennes / Brabant</option>
                    <option value="voyages">Voyages KM0 (Ardennes, Suisse, Majorque)</option>
                    <option value="corporate">Teambuilding &amp; Sortie Entreprise sur-mesure</option>
                    <option value="partenariat">Proposition de Partenariat Vélo / Brasserie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Votre Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Dites-nous ce qui vous ferait plaisir..."
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-[#1e2f47]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#1e2f47] hover:bg-[#152336] rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer ma Demande</span>
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2">
              <span>Référent : <strong className="text-stone-700">Guy Materne</strong></span>
              <span>Email : <strong className="text-stone-700">guymaterne@gmail.com</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
