export interface Ride {
  id: string;
  title: string;
  discipline: 'vtt' | 'gravel' | 'route';
  season: 'hiver' | 'printemps' | 'ete' | 'automne';
  date: string;
  time: string;
  distanceKm: number;
  elevationM: number;
  estimatedHours: string;
  region: 'Ardennes' | 'Brabant' | 'Flandres' | 'Condroz' | 'Hautes Fagnes';
  startLocation: string;
  startAddress: string;
  technicalLevel: 1 | 2 | 3 | 4 | 5;
  physicalLevel: 1 | 2 | 3 | 4 | 5;
  paceAvgKmH: string;
  maxParticipants: number;
  registeredCount: number;
  guideName: string;
  description: string;
  highlights: string[];
  apresRide: string;
  elevationProfile: number[]; // normalized 0-100 values
  featured?: boolean;
  gpxFileName?: string;
  gpxFileSize?: string;
  gpxData?: string;
  gpxUploadedAt?: string;
  photos?: string[];
}

export const RIDES_DATA: Ride[] = [
  {
    id: 'ride-vtt-aywaille',
    title: 'La Ronde des Bois d’Aywaille & Amblève',
    discipline: 'vtt',
    season: 'hiver',
    date: 'Samedi 14 Novembre 2026',
    time: '09h00',
    distanceKm: 46,
    elevationM: 1180,
    estimatedHours: '3h30',
    region: 'Ardennes',
    startLocation: 'Aywaille - Place du Marché',
    startAddress: 'Place du Marché 12, 4920 Aywaille',
    technicalLevel: 3,
    physicalLevel: 4,
    paceAvgKmH: '14-16 km/h (VTT technique)',
    maxParticipants: 16,
    registeredCount: 12,
    guideName: 'Guy Materne (Référent KM0 BE)',
    description: 'Une vraie rando hivernale ardennaise : singletracks forestiers, passage le long de l’Amblève, pierriers souples et montées raides dans la boue noble. Pression des pneus basse conseillée.',
    highlights: [
      'Singletrack le long du Ninglinspo sauvage',
      'Atelier franchissement de racines mouillées à mi-parcours',
      'Passage en crête avec vue panoramique sur la vallée'
    ],
    apresRide: 'Grand bol de potage à l’oignon chaud & dégustation d’Elfique locale au café des cyclistes.',
    elevationProfile: [15, 22, 45, 60, 52, 78, 65, 88, 70, 95, 75, 50, 40, 65, 30, 15],
    featured: true,
    gpxFileName: 'trace_km0_vtt_aywaille_46k.gpx',
    gpxFileSize: '24.2 KB',
    gpxUploadedAt: '2026-10-24 10:15',
    photos: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ride-vtt-meerdaal',
    title: 'L’Hivernale des Sentiers de Meerdaal & Terrils',
    discipline: 'vtt',
    season: 'hiver',
    date: 'Dimanche 22 Novembre 2026',
    time: '09h30',
    distanceKm: 52,
    elevationM: 690,
    estimatedHours: '3h15',
    region: 'Brabant',
    startLocation: 'Wavre / Ottignies (Clubhouse KM0 BE)',
    startAddress: 'Avenue des Sports 4, 1300 Wavre',
    technicalLevel: 2,
    physicalLevel: 3,
    paceAvgKmH: '16-18 km/h',
    maxParticipants: 20,
    registeredCount: 15,
    guideName: 'Équipe KM0 Belgique',
    description: 'Parcours ludique et rythmé à travers les sous-bois brabançons. Les singles vallonnés de Meerdaal offrent un grip idéal même par temps pluvieux. Idéal pour travailler sa vélocité hivernale.',
    highlights: [
      'Tapis d’aiguilles de pin et sentiers sablonneux drainés',
      'Petits raidards courts typiques du Brabant',
      'Groupe scindé en 2 allures : Tempo & Sport'
    ],
    apresRide: 'Gaufres liégeoises chaudes, café torréfié au clubhouse et bière de Waterloo.',
    elevationProfile: [20, 30, 45, 35, 60, 40, 55, 30, 50, 42, 60, 35, 25, 20],
    featured: false,
    gpxFileName: 'trace_km0_meerdaal_vtt_52km.gpx',
    gpxFileSize: '28.1 KB',
    photos: [
      'https://images.unsplash.com/photo-1502744688674-c619d3864003?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ride-vtt-botrange',
    title: 'Le Défi Fagnes Givré - Signal de Botrange',
    discipline: 'vtt',
    season: 'hiver',
    date: 'Samedi 12 Décembre 2026',
    time: '09h00',
    distanceKm: 42,
    elevationM: 880,
    estimatedHours: '3h45',
    region: 'Hautes Fagnes',
    startLocation: 'Baraque Michel / Botrange',
    startAddress: 'Rue de Botrange 133, 4950 Waimes',
    technicalLevel: 3,
    physicalLevel: 4,
    paceAvgKmH: '13-15 km/h (Neige / Givre)',
    maxParticipants: 14,
    registeredCount: 11,
    guideName: 'Guy Materne',
    description: 'Une sortie légendaire sur le toit de la Belgique. Pistes forestières enneigées, caillebotis autorisés, landes sauvages et fraîcheur mordante. Équipement thermique complet obligatoire.',
    highlights: [
      'Atmosphère nordique unique au Signal de Botrange (694m)',
      'Sentiers sauvages entre tourbières et sapins centenaires',
      'Assistance mécanique mobile et thé chaud en thermos'
    ],
    apresRide: 'Feu de bois dans la taverne d’altitude, vin chaud aux épices et assiette ardennaise.',
    elevationProfile: [40, 55, 70, 85, 92, 100, 88, 75, 80, 70, 60, 45, 40],
    featured: true,
    gpxFileName: 'trace_km0_botrange_fagnes_42km.gpx',
    gpxFileSize: '22.8 KB',
    photos: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ride-gravel-brabant',
    title: 'La Brabançonne des Chemins Creux & Pavés Doux',
    discipline: 'gravel',
    season: 'printemps',
    date: 'Samedi 11 Avril 2026',
    time: '08h45',
    distanceKm: 78,
    elevationM: 820,
    estimatedHours: '3h45',
    region: 'Brabant',
    startLocation: 'Louvain-la-Neuve / Bois des Rêves',
    startAddress: 'Allée du Bois des Rêves 1, 1348 Ottignies',
    technicalLevel: 2,
    physicalLevel: 3,
    paceAvgKmH: '21-23 km/h',
    maxParticipants: 22,
    registeredCount: 18,
    guideName: 'Guy Materne & Guide KM0',
    description: 'Le printemps s’ouvre en grand sur le Gravel : 65% de chemins de terre, allées cavalières, pavés de ferme historiques et faux-plats montants. Parfait pour réveiller les cannes.',
    highlights: [
      'Passage bucolique devant l’Abbaye de Villers-la-Ville',
      'Secteurs de chemins creux sablonneux très fluides',
      'Arrêt espresso de spécialité à mi-parcours'
    ],
    apresRide: 'Terrasse ensoleillée, planche de fromages d’abbaye et bières de ferme.',
    elevationProfile: [10, 25, 40, 30, 55, 45, 70, 50, 65, 40, 30, 15],
    featured: true,
    gpxFileName: 'trace_km0_gravel_brabanconne_78km.gpx',
    gpxFileSize: '39.4 KB',
    photos: [
      'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ride-gravel-herve',
    title: 'Les Drailles du Pays de Herve & Vergers',
    discipline: 'gravel',
    season: 'automne',
    date: 'Dimanche 27 Septembre 2026',
    time: '09h00',
    distanceKm: 85,
    elevationM: 1250,
    estimatedHours: '4h15',
    region: 'Ardennes',
    startLocation: 'Herve / Val-Dieu',
    startAddress: 'Val-Dieu 227, 4880 Aubel',
    technicalLevel: 3,
    physicalLevel: 4,
    paceAvgKmH: '19-21 km/h',
    maxParticipants: 18,
    registeredCount: 9,
    guideName: 'Équipe KM0 Belgique',
    description: 'Une plongée dans les collines vertes du Pays de Herve : chemins de bocage, échaliers typiques (portages courts et amusants), crêtes et vues à 360° vers les Trois Frontières.',
    highlights: [
      'Traversée du domaine de l’Abbaye du Val-Dieu',
      'Pistes gravillonnées rapides bordées de haies vives',
      'Dénivelé généreux avec des pentes courtes mais franches'
    ],
    apresRide: 'Cidre artisanal, fromage de Herve AOP au sirop de Liège et bière Val-Dieu.',
    elevationProfile: [20, 45, 60, 40, 75, 55, 85, 70, 90, 65, 50, 25],
    featured: false,
    photos: [
      'https://images.unsplash.com/photo-1502744688674-c619d3864003?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ride-route-doyenne',
    title: 'L’Hommage à la Doyenne : Redoute, Roche & Forges',
    discipline: 'route',
    season: 'printemps',
    date: 'Samedi 2 Mai 2026',
    time: '08h30',
    distanceKm: 115,
    elevationM: 1850,
    estimatedHours: '4h30',
    region: 'Condroz',
    startLocation: 'Esneux / Vallée de l’Ourthe',
    startAddress: 'Place du Roi Albert, 4130 Esneux',
    technicalLevel: 2,
    physicalLevel: 5,
    paceAvgKmH: '26-28 km/h (Groupe Tempo) / 29-31 km/h (Fast)',
    maxParticipants: 24,
    registeredCount: 20,
    guideName: 'Guy Materne',
    description: 'Le cœur battant du cyclisme mondial. On enchaîne les bergs mythiques de Liège-Bastogne-Liège : Côte de la Redoute, Côte des Forges, Roche-aux-Faucons. Respect du peloton et esprit de camaraderie.',
    highlights: [
      'Ascension de La Redoute avec les inscriptions légendaires sur le bitume',
      'Briefing gestion du braquet et aéro en peloton',
      'Deux groupes de niveaux avec voitures balais / ravitaillement'
    ],
    apresRide: 'Le traditionnel cornet de frites belges croustillantes & bière trappiste Orval bien fraîche.',
    elevationProfile: [10, 30, 20, 65, 45, 80, 50, 95, 70, 85, 40, 15],
    featured: true,
    photos: [
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ride-route-flandrienne',
    title: 'Monts des Flandres & Secteurs Pavés Historiques',
    discipline: 'route',
    season: 'printemps',
    date: 'Samedi 23 Mai 2026',
    time: '08h15',
    distanceKm: 128,
    elevationM: 1450,
    estimatedHours: '4h45',
    region: 'Flandres',
    startLocation: 'Oudenaarde (Centre du Tour des Flandres)',
    startAddress: 'Markt 43, 9700 Oudenaarde',
    technicalLevel: 4,
    physicalLevel: 4,
    paceAvgKmH: '25-27 km/h',
    maxParticipants: 20,
    registeredCount: 17,
    guideName: 'Équipe KM0 Belgique',
    description: 'Vivez la légende des pavés flandriens : Vieux Quaremont, Paterberg, Koppenberg et Taaienberg. Conseils de pilotage sur pavés (position des mains, cadence haute, relâchement du buste).',
    highlights: [
      'Les pavés mythiques du Ronde van Vlaanderen',
      'Arrêt au sommet du Vieux Quaremont pour ravito KM0',
      'Ambiance de kermesse et ferveur populaire garantie'
    ],
    apresRide: 'Kwaremont au fût dans le café historique et gaufres croustillantes.',
    elevationProfile: [15, 35, 20, 70, 40, 85, 60, 95, 50, 75, 35, 15],
    featured: false,
    photos: [
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'ride-gravel-pajottenland',
    title: 'Gravel des Brasseries du Pajottenland & Lambic',
    discipline: 'gravel',
    season: 'ete',
    date: 'Dimanche 21 Juin 2026',
    time: '09h00',
    distanceKm: 70,
    elevationM: 780,
    estimatedHours: '3h30',
    region: 'Flandres',
    startLocation: 'Beersel / Halle',
    startAddress: 'Kasteelstraat 1, 1650 Beersel',
    technicalLevel: 2,
    physicalLevel: 3,
    paceAvgKmH: '20-22 km/h',
    maxParticipants: 25,
    registeredCount: 14,
    guideName: 'Guy Materne',
    description: 'Une balade gravel bucolique et épicurienne dans le pays du Lambic et de la Gueuze. Chemins de terre plats, allées de peupliers, châteaux médiévaux et collines douces de Bruegel.',
    highlights: [
      'Vues sur le Château féodal de Beersel',
      'Secteurs terre et graviers ultra accessibles pour tous',
      'Ambiance club détendue, 100% plaisir'
    ],
    apresRide: 'Visite d’une brasserie traditionnelle de Gueuze artisanale et dégustation au soleil.',
    elevationProfile: [15, 30, 45, 35, 50, 40, 60, 45, 55, 30, 20, 15],
    featured: false,
    photos: [
      'https://images.unsplash.com/photo-1502744688674-c619d3864003?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    ],
  }
];
