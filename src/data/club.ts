export interface MembershipTier {
  id: string;
  name: string;
  pricePerYear: number;
  period: string;
  badge?: string;
  description: string;
  features: string[];
  ctaText: string;
  recommended?: boolean;
  active?: boolean;
}

export interface ClubMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  city: string;
  postalCode: string;
  role: 'admin' | 'captain' | 'member';
  status: 'active' | 'pending' | 'expired';
  membershipTierId: string;
  membershipTierName: string;
  joinDate: string;
  expirationDate: string;
  jerseySize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  subscribedToNewsletter: boolean;
  preferredDiscipline: 'all' | 'vtt' | 'gravel' | 'route';
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  memberEmail: string;
  memberName: string;
  amount: number;
  description: string;
  method: 'stripe_card' | 'apple_pay' | 'wire_transfer' | 'bancontact';
  status: 'paid' | 'pending' | 'failed';
  reference: string;
  targetType: 'membership' | 'ride' | 'trip';
  targetId: string;
  structuredCommunication?: string;
}

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  mode: 'test' | 'live';
  applePayEnabled: boolean;
}

export interface BankConfig {
  accountHolder: string;
  iban: string;
  bic: string;
  bankName: string;
}

export interface SentEmail {
  id: string;
  dateSent: string;
  subject: string;
  targetSegment: string;
  recipientsCount: number;
  previewSnippet: string;
  sentBy: string;
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'tier-discovery',
    name: 'Formule Découverte 3 Rides',
    pricePerYear: 35,
    period: 'Valable 2 mois',
    badge: 'Idéal pour tester',
    description: 'Venez rouler avec nous et goûter à l’ambiance KM0 Belgique avant de vous engager pour l’année complète.',
    features: [
      'Accès à 3 sorties officielles du club (VTT, Gravel ou Route)',
      'Assurance responsabilité civile incluse pour les 3 sorties',
      'Briefing sécurité et accueil personnalisé par le référent',
      'Accès temporaire au groupe WhatsApp de la sortie',
      'Déductible si vous passez sur l’adhésion annuelle'
    ],
    ctaText: 'Prendre un Pass Découverte',
    recommended: false,
    active: true,
  },
  {
    id: 'tier-annual',
    name: 'Membre Club KM0 Belgique',
    pricePerYear: 160,
    period: 'Par an (saison complète)',
    badge: 'La plus populaire',
    description: 'La formule reine pour vivre le cyclisme 4 saisons : VTT l’hiver, Gravel et route le reste de l’année.',
    features: [
      'Maillot officiel KM0 Belgique (coupe pro endurance, valeur 110€)',
      'Accès illimité à toutes les sorties hebdomadaires du calendrier',
      'Assurance cycliste annuelle tous pays européens',
      'Accès complet au Club Strava privé & communauté WhatsApp',
      'Bibliothèque exclusive de +80 traces GPX belges certifiées',
      '-15% sur tous les stages et voyages KM0 Belgique & Suisse',
      'Remise permanente de 10% chez nos partenaires cycles belges'
    ],
    ctaText: 'Rejoindre le Club (Annuel)',
    recommended: true,
    active: true,
  },
  {
    id: 'tier-pack-pro',
    name: 'Pack Pelotons & Aventures',
    pricePerYear: 290,
    period: 'Par an (tout inclus)',
    badge: 'Expérience Ultime',
    description: 'Pour les cyclistes engagés qui souhaitent l’équipement complet et un accès prioritaire à tous les voyages.',
    features: [
      'Pack textile complet : Maillot + Cuissard Pro + Gilet coupe-vent KM0',
      'Tous les avantages de l’adhésion annuelle club',
      '1 bon de réduction de 100€ sur un voyage ou stage de votre choix',
      'Accès prioritaire garanti sur les voyages limités en places',
      'Bilan d’évaluation de niveau physique & technique personnalisé',
      'Café de spécialité offert à chaque départ depuis le Clubhouse'
    ],
    ctaText: 'Devenir Membre Privilège',
    recommended: false,
    active: true,
  }
];

export const INITIAL_MEMBERS: ClubMember[] = [
  {
    id: 'mem-001',
    firstName: 'Guy',
    lastName: 'Materne',
    email: 'guymaterne@gmail.com',
    password: 'belgique2026',
    phone: '+32 470 11 22 33',
    city: 'Wavre',
    postalCode: '1300',
    role: 'admin',
    status: 'active',
    membershipTierId: 'tier-pack-pro',
    membershipTierName: 'Pack Pelotons & Aventures',
    joinDate: '2026-01-01',
    expirationDate: '2027-12-31',
    jerseySize: 'L',
    subscribedToNewsletter: true,
    preferredDiscipline: 'all',
    notes: 'Référent officiel KM0 Belgique & Administrateur Principal',
  },
  {
    id: 'mem-002',
    firstName: 'Alexandre',
    lastName: 'De Backer',
    email: 'alex.debacker@skynet.be',
    password: 'km0belgique',
    phone: '+32 475 22 33 44',
    city: 'Aywaille',
    postalCode: '4920',
    role: 'captain',
    status: 'active',
    membershipTierId: 'tier-annual',
    membershipTierName: 'Membre Club KM0 Belgique',
    joinDate: '2026-02-15',
    expirationDate: '2027-02-14',
    jerseySize: 'M',
    subscribedToNewsletter: true,
    preferredDiscipline: 'vtt',
    notes: 'Capitaine de route référent pour la vallée de l’Amblève et les Ardennes',
  },
  {
    id: 'mem-003',
    firstName: 'Céline',
    lastName: 'Vandenameele',
    email: 'celine.vdm@proximus.be',
    password: 'km0belgique',
    phone: '+32 486 99 88 77',
    city: 'Louvain-la-Neuve',
    postalCode: '1348',
    role: 'captain',
    status: 'active',
    membershipTierId: 'tier-annual',
    membershipTierName: 'Membre Club KM0 Belgique',
    joinDate: '2026-03-01',
    expirationDate: '2027-02-28',
    jerseySize: 'S',
    subscribedToNewsletter: true,
    preferredDiscipline: 'gravel',
    notes: 'Capitaine de route Gravel Brabant & animatrice du Social Coffee Ride',
  },
  {
    id: 'mem-004',
    firstName: 'Julien',
    lastName: 'Renard',
    email: 'j.renard@telenet.be',
    password: 'km0belgique',
    phone: '+32 494 55 44 33',
    city: 'Liège',
    postalCode: '4000',
    role: 'member',
    status: 'active',
    membershipTierId: 'tier-annual',
    membershipTierName: 'Membre Club KM0 Belgique',
    joinDate: '2026-04-10',
    expirationDate: '2027-04-09',
    jerseySize: 'XL',
    subscribedToNewsletter: true,
    preferredDiscipline: 'route',
    notes: 'Inscrit pour les classiques et sorties Redoute',
  },
  {
    id: 'mem-005',
    firstName: 'Sophie',
    lastName: 'Lemoine',
    email: 'sophie.lemoine@outlook.be',
    password: 'km0belgique',
    phone: '+32 478 66 11 22',
    city: 'Namur',
    postalCode: '5000',
    role: 'member',
    status: 'active',
    membershipTierId: 'tier-discovery',
    membershipTierName: 'Formule Découverte 3 Rides',
    joinDate: '2026-09-12',
    expirationDate: '2026-11-12',
    jerseySize: 'M',
    subscribedToNewsletter: true,
    preferredDiscipline: 'vtt',
    notes: 'A débuté avec la sortie VTT d’Aywaille',
  },
  {
    id: 'mem-006',
    firstName: 'Marc',
    lastName: 'Dubois',
    email: 'marc.dubois@voo.be',
    password: 'km0belgique',
    phone: '+32 471 33 55 77',
    city: 'Oudenaarde',
    postalCode: '9700',
    role: 'member',
    status: 'pending',
    membershipTierId: 'tier-annual',
    membershipTierName: 'Membre Club KM0 Belgique',
    joinDate: '2026-10-20',
    expirationDate: '2027-10-19',
    jerseySize: 'L',
    subscribedToNewsletter: false,
    preferredDiscipline: 'route',
    notes: 'En attente de virement pour valider son adhésion',
  }
];

export const INITIAL_SENT_EMAILS: SentEmail[] = [
  {
    id: 'mail-01',
    dateSent: '2026-10-22 17:30',
    subject: '🚴‍♂️ Programme VTT d’Hiver & Ouverture des Inscriptions Ardennes',
    targetSegment: 'Tous les membres adhérents (5)',
    recipientsCount: 5,
    previewSnippet: 'Bonjour à tous, les feuilles tombent et la boue ardennaise nous attend ! Voici le calendrier des 4 prochaines sorties VTT encadrées...',
    sentBy: 'Guy Materne',
  },
  {
    id: 'mail-02',
    dateSent: '2026-10-14 09:15',
    subject: '☕ Briefing Capitaines de Route : Gestion des Allures et Sécurité Hiver',
    targetSegment: 'Capitaines de route uniquement (2)',
    recipientsCount: 2,
    previewSnippet: 'Chers capitaines, petit point sur le protocole d’arrêt et le matériel de secours à emporter pour les hivernales...',
    sentBy: 'Guy Materne',
  }
];

export const WEEKLY_SCHEDULE = [
  {
    day: 'Samedi Matin',
    seasonContext: 'Hiver (Nov-Fév) : VTT / Mars-Octobre : Gravel & Route',
    name: 'Le Grand Ride KM0 Belgique',
    discipline: 'VTT (hiver) ou Gravel/Route alterné (belle saison)',
    time: '09h00 (départ roues qui tournent)',
    paceGroups: '3 groupes d’allure : Découverte / Tempo / Sport',
    spirit: 'Le rendez-vous phare de la semaine. 3h30 à 4h d’effort dans les plus beaux terroirs de Belgique. Ravitaillement et débrief convivial.'
  },
  {
    day: 'Dimanche Matin',
    seasonContext: 'Toute l’année (4 saisons)',
    name: 'The Sunday Social Coffee Ride',
    discipline: 'Gravel doux, route de campagne ou VTT rando tranquille',
    time: '09h30',
    paceGroups: 'Groupe unique solidaire (rythme adapté au peloton)',
    spirit: 'Zéro pression du chrono. On roule ensemble, on papote, et pause obligatoire dans une brûlerie de café ou boulangerie artisanale.'
  },
  {
    day: 'Jeudi Soir',
    seasonContext: 'Printemps & Été (Avril à Septembre)',
    name: 'Afterwork Ride & Sunset Brasserie',
    discipline: 'Gravel & Route rapide',
    time: '18h30',
    paceGroups: 'Allure soutenue et groupe de rentrée plus souple',
    spirit: 'Décrocher de l’écran, chasser la fatigue de la semaine sur les chemins de traverse, et trinquer au retour avec une bonne bière belge au coucher du soleil.'
  }
];

export const TECHNICAL_LEVELS = [
  { level: 1, title: 'Débutant / Pistes faciles', desc: 'Routes asphaltées secondaires, voies vertes lisses, pistes cyclables sans obstacles ni ornières.' },
  { level: 2, title: 'Intermédiaire / Chemins variés', desc: 'Chemins de terre stabilisés, petits graviers, racines isolées, virages doux en descente.' },
  { level: 3, title: 'Confirmé / Terrains belges typiques', desc: 'Singletracks sinueux, ornières de boue ardennaise, devers glissants, petites marches rocheuses.' },
  { level: 4, title: 'Avancé / Terrains engagés & Pavés', desc: 'Secteurs pavés rudes à pleine vitesse, pierriers raides, descentes humides techniques, franchissements.' },
  { level: 5, title: 'Expert / Enduro & Pente forte', desc: 'Pistes noires, épingles très serrées, gros sauts ou marches, conditions extrêmes (neige, glace, pierriers alpins).' }
];

export const PHYSICAL_LEVELS = [
  { level: 1, title: 'Allure Douce', distance: '30 - 45 km', dPlus: '< 400 m', desc: 'Sortie plaisir, arrêts fréquents, accessible à toute personne avec une forme de base.' },
  { level: 2, title: 'Allure Modérée', distance: '45 - 65 km', dPlus: '400 - 750 m', desc: 'Sortie régulière, gestion de l’effort sur 2 à 3h, côte passée au train sans s’épuiser.' },
  { level: 3, title: 'Allure Sportive', distance: '65 - 90 km', dPlus: '750 - 1300 m', desc: 'Bonne endurance, habitude des relances après les virages, capacité à tenir 3 à 4 heures actives.' },
  { level: 4, title: 'Allure Confirmée', distance: '90 - 130 km', dPlus: '1300 - 2200 m', desc: 'Pour cyclistes entraînés, capables d’enchaîner les bosses ardennaises à bon rythme.' },
  { level: 5, title: 'Endurance Ultra', distance: '130 km+', dPlus: '2200 m+', desc: 'Sorties épiques, classiques complètes, brevets et bikepacking longue distance.' }
];

export const INITIAL_STRIPE_CONFIG: StripeConfig = {
  publishableKey: 'pk_test_51KM0BelgiqueCyclingClubPublicStripeKeyDemo2026',
  secretKey: 'sk_test_51KM0BelgiqueCyclingClubSecretKeyDemo2026',
  mode: 'test',
  applePayEnabled: true,
};

export const INITIAL_BANK_CONFIG: BankConfig = {
  accountHolder: 'KM0 Belgique ASBL - Guy Materne',
  iban: 'BE76 0012 3456 7890',
  bic: 'GEBABEBB',
  bankName: 'BNP Paribas Fortis Belgique',
};

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-1001',
    date: '2026-10-24 15:10',
    memberEmail: 'p.gilbert@cyclisme.be',
    memberName: 'Philippe Gilbert',
    amount: 15,
    description: 'Participation Sortie VTT Aywaille & Amblève',
    method: 'stripe_card',
    status: 'paid',
    reference: 'ch_3N8kL92eZvKYlo2C0KM0Be01',
    targetType: 'ride',
    targetId: 'ride-vtt-aywaille',
  },
  {
    id: 'tx-1002',
    date: '2026-10-22 11:45',
    memberEmail: 'sarah.d@skynet.be',
    memberName: 'Sarah Dumont',
    amount: 420,
    description: 'Acompte Voyage Ardennes Epic Bikepacking',
    method: 'bancontact',
    status: 'paid',
    reference: 'bc_8819203912903',
    targetType: 'trip',
    targetId: 'trip-ardennes-epic-bikepacking',
  },
  {
    id: 'tx-1003',
    date: '2026-10-20 09:30',
    memberEmail: 'marc.dubois@voo.be',
    memberName: 'Marc Dubois',
    amount: 160,
    description: 'Cotisation Membre Club KM0 Belgique (Annuel)',
    method: 'wire_transfer',
    status: 'pending',
    reference: 'VIR-2026-10-20-001',
    targetType: 'membership',
    targetId: 'tier-annual',
    structuredCommunication: '+++104/8921/33492+++',
  },
  {
    id: 'tx-1004',
    date: '2026-10-18 16:20',
    memberEmail: 'alex.debacker@skynet.be',
    memberName: 'Alexandre De Backer',
    amount: 160,
    description: 'Renouvellement Adhésion Annuelle Club',
    method: 'apple_pay',
    status: 'paid',
    reference: 'ch_3N8aP202eZvKYlo2C0KM0Be02',
    targetType: 'membership',
    targetId: 'tier-annual',
  }
];

