export interface Trip {
  id: string;
  title: string;
  subtitle: string;
  discipline: 'gravel' | 'route' | 'vtt' | 'stage';
  destination: string;
  country: string;
  durationDays: number;
  dates: string;
  priceEuro: number;
  physicalLevel: 1 | 2 | 3 | 4 | 5;
  technicalLevel: 1 | 2 | 3 | 4 | 5;
  groupSize: string;
  guide: string;
  status: 'inscriptions-ouvertes' | 'dernieres-places' | 'complet';
  coverDescription: string;
  highlights: string[];
  included: string[];
  dailyProgram: { day: string; title: string; desc: string; stats?: string }[];
  tagKm0Partner?: string;
  gpxFileName?: string;
  gpxFileSize?: string;
  gpxData?: string;
  gpxUploadedAt?: string;
}

export const TRIPS_DATA: Trip[] = [
  {
    id: 'trip-ardennes-epic-bikepacking',
    title: 'Ardennes Epic Bikepacking & Nuits Sous Tente ou Refuge',
    subtitle: '3 jours en autonomie guidée à travers les recoins les plus sauvages de Wallonie',
    discipline: 'gravel',
    destination: 'Ardennes belges, Semois & Hautes Terres',
    country: 'Belgique',
    durationDays: 3,
    dates: '15 - 17 Mai 2026',
    priceEuro: 420,
    physicalLevel: 4,
    technicalLevel: 3,
    groupSize: '8 à 12 riders',
    guide: 'Guy Materne (Référent KM0 BE)',
    status: 'dernieres-places',
    coverDescription: 'L’immersion gravel ultime en Belgique : forêts primaires, crêtes rocheuses le long de la Semois, pistes de terre oubliées, bivouac confort ou auberge authentique et feu de camp le soir.',
    highlights: [
      '300 km et 5 200m D+ sur des pistes 100% gravel',
      'Briefing gestion du paquetage bikepacking & orientation',
      'Repas au feu de bois avec produits du terroir ardennais'
    ],
    included: [
      'Encadrement par 2 guides certifiés',
      'Hébergements (refuges privatifs de charme)',
      'Tous les repas & ravitaillements locaux',
      'Traces GPX exclusives KM0',
      'Véhicule d’assistance & transport des bagages de secours'
    ],
    dailyProgram: [
      { day: 'Jour 1', title: 'Namur à Bouillon via les forêts profondes', desc: 'Départ des bords de Meuse, traversée des crêtes namuroises et plongée dans la forêt de Bouillon.', stats: '105 km · 1 800m D+' },
      { day: 'Jour 2', title: 'Les Méandres sauvages de la Semois', desc: 'Chemins de halage caillouteux, points de vue vertigineux du Tombeau du Géant et monotraces forestières.', stats: '95 km · 1 950m D+' },
      { day: 'Jour 3', title: 'Le Plateau des Hautes Fagnes et retour triomphal', desc: 'Retour par les chemins de crête avec un finish convivial autour de bières d’abbaye.', stats: '100 km · 1 450m D+' }
    ],
    gpxFileName: 'trace_km0_ardennes_epic_bikepacking_300k.gpx',
    gpxFileSize: '112.5 KB',
    gpxUploadedAt: '2026-10-22 14:00',
  },
  {
    id: 'trip-swiss-prealpes-km0',
    title: 'Trans-Suisse Romande & Préalpes Fribourgeoises',
    subtitle: 'L’expédition officielle en partenariat direct avec le camp de base Projet KM0 Suisse (Hauteville)',
    discipline: 'gravel',
    destination: 'Canton de Fribourg, Gruyère & Alpes bernoises',
    country: 'Suisse (Partenariat KM0)',
    durationDays: 5,
    dates: '8 - 12 Juillet 2026',
    priceEuro: 1190,
    physicalLevel: 4,
    technicalLevel: 3,
    groupSize: '6 à 10 riders',
    guide: 'Team Projet KM0 Suisse & Guy Materne',
    status: 'inscriptions-ouvertes',
    coverDescription: 'Partez de Belgique rejoindre nos amis de Projet KM0 Suisse. Un voyage inoubliable sur les terres natales de KM0 : cols alpins confidentiels, chalets d’alpage, singletracks d’altitude et fondue au coucher du soleil.',
    highlights: [
      'Accueil privilégié au camp de base KM0 Hauteville (Fribourg)',
      'Découverte des plus beaux cols méconnus de Romandie',
      'Liaison directe organisée au départ de Belgique'
    ],
    included: [
      'Encadrement par des guides Swiss Cycling & KM0',
      '4 nuits en chalets et hôtels de montagne',
      'Pension complète avec spécialités suisses authentiques',
      'Assistance mécanique et traces officielles KM0',
      'Transferts locaux bagages et cyclistes'
    ],
    dailyProgram: [
      { day: 'Jour 1', title: 'Accueil à Hauteville & Boucle d’acclimatation en Gruyère', desc: 'Prise de contact, réglage des vélos et tour panoramique du Lac de la Gruyère.', stats: '55 km · 900m D+' },
      { day: 'Jour 2', title: 'Les Crêtes des Préalpes fribourgeoises', desc: 'Montée vers les alpages, chemins pastoraux et descentes fluides en sous-bois.', stats: '82 km · 1 750m D+' },
      { day: 'Jour 3', title: 'L’Épopée du Jaunpass & Vallées secrètes', desc: 'Gravel alpin de haute volée au pied des falaises calcaires des Gastlosen.', stats: '90 km · 2 100m D+' },
      { day: 'Jour 4', title: 'Pays d’Enhaut & Lac Léman en toile de fond', desc: 'Vues spectaculaires sur les glaciers et les sommets environnants.', stats: '85 km · 1 800m D+' },
      { day: 'Jour 5', title: 'Grand Tour des Crêtes et Festin KM0 de clôture', desc: 'Dernière chevauchée alpine et repas de célébration avant le retour.', stats: '60 km · 1 100m D+' }
    ],
    tagKm0Partner: 'Connexion directe KM0 Suisse'
  },
  {
    id: 'stage-printemps-majorque',
    title: 'Stage d’Affûtage de Printemps - Majorque Tramuntana',
    subtitle: 'La semaine parfaite de foncier et de dénivelé sous le soleil printanier méditerranéen',
    discipline: 'stage',
    destination: 'Majorque, Sierra de Tramuntana',
    country: 'Espagne',
    durationDays: 7,
    dates: '21 - 28 Mars 2026',
    priceEuro: 1350,
    physicalLevel: 4,
    technicalLevel: 2,
    groupSize: '12 à 16 riders',
    guide: 'Guy Materne & Coach Invité',
    status: 'dernieres-places',
    coverDescription: 'Préparez votre saison belge dans des conditions idéales. Route parfaite, cols mythiques (Sa Calobra, Formentor, Puig Major), analyses de pédalage quotidiennes et ambiance club détendue.',
    highlights: [
      'Séjour en hôtel cycliste 4 étoiles avec spa et buffets adaptés aux sportifs',
      'Groupes d’allure homogènes (2 à 3 allures chaque jour)',
      'Voiture suiveuse avec ravitaillement complet et pièces de rechange'
    ],
    included: [
      'Hôtel 4* en demi-pension + collations retour de sortie',
      'Briefings tactiques quotidiens, conseils nutrition et récupération',
      'Assistance mécanique pro chaque soir',
      'Maillot collector du stage offert'
    ],
    dailyProgram: [
      { day: 'Jour 1-2', title: 'Mise en jambe & Plaines d’Orient', desc: 'Déblocage, travail de relais en éventail et cadence.', stats: '85 km · 750m D+' },
      { day: 'Jour 3-4', title: 'Cap de Formentor & Col de Soller', desc: 'Les grandes montées régulières, gestion du rythme au capteur de puissance ou cardio.', stats: '115 km · 1 850m D+' },
      { day: 'Jour 5-6', title: 'Le Monument de Sa Calobra & Puig Major', desc: 'L’étape reine du séjour, 26 lacets féeriques plongeant dans la mer.', stats: '130 km · 2 400m D+' },
      { day: 'Jour 7', title: 'Tour de récupération et départ', desc: 'Sortie café de 50km très souple avant le vol de retour vers Bruxelles.', stats: '50 km · 350m D+' }
    ]
  },
  {
    id: 'stage-pilotage-vtt-hiver',
    title: 'Masterclass Pilotage VTT d’Hiver & Franchissement',
    subtitle: '2 jours intensifs pour dompter la boue, les devers et les racines mouillées en Ardennes',
    discipline: 'vtt',
    destination: 'Spa-Francorchamps / Hautes Fagnes',
    country: 'Belgique',
    durationDays: 2,
    dates: '5 - 6 Décembre 2026',
    priceEuro: 240,
    physicalLevel: 3,
    technicalLevel: 4,
    groupSize: '8 riders maximum',
    guide: 'Guy Materne & Moniteur breveté',
    status: 'inscriptions-ouvertes',
    coverDescription: 'L’hiver belge forge les meilleurs pilotes du monde ! Ne subissez plus les terrains gras : apprenez à choisir la ligne fluide, à freiner sans bloquer, à cabrer la roue avant et à rouler en confiance absolue.',
    highlights: [
      'Ratio ultra personnalisé : 1 coach pour 4 pilotes',
      'Ateliers vidéo au ralenti sur les sections techniques',
      'Mise en pratique directe sur les plus beaux singles ardennais'
    ],
    included: [
      '2 jours de coaching technique intensif',
      'Déjeuners chauds traiteur & collations énergétiques',
      'Lavage haute pression et atelier réglage suspensions',
      'Pack de bienvenue KM0 Belgique'
    ],
    dailyProgram: [
      { day: 'Jour 1', title: 'Fondamentaux & Virages en terrain meuble', desc: 'Position du corps, répartition des masses, freinage d’urgence et passages de dévers.', stats: '28 km · 650m D+' },
      { day: 'Jour 2', title: 'Franchissements de marches & Rythme en sous-bois', desc: 'Sauts, bunny hops appliqués, relances en bosse raide et descente engagée sécurisée.', stats: '34 km · 850m D+' }
    ]
  }
];
