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
  }
];

export interface WeeklyRideSlot {
  day: string;
  seasonContext: string;
  name: string;
  discipline: string;
  time: string;
  paceGroups: string;
  spirit: string;
}

export const WEEKLY_SCHEDULE: WeeklyRideSlot[] = [
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
