export type Category = 'Energie' | 'Eclairage' | 'Alimentation' | 'Divers' | 'Lecture';

export interface Product {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  amazonLink: string;
  category: Category;
}

export const categories: Category[] = [
  'Energie',
  'Eclairage',
  'Alimentation',
  'Divers',
  'Lecture'
];

export const products: Product[] = [
  {
    id: 'p1',
    title: 'BigBlue 28W',
    summary: 'Chargeur Solaire Pliable avec 2 USB C + 1 USB A Ports(5V/4,8A au Total) Panneau Solaire Portable Imperméable IP44.',
    imageUrl: '/images/solar-panel.jpg',
    amazonLink: 'https://www.amazon.fr/gp/aw/d/B01KGXYG14?tag=zequipement-21&th=1',
    category: 'Energie'
  },
  {
    id: 'p2',
    title: 'Anker SOLIX C300 DC PowerBank',
    summary: 'Station électrique, 288 Wh (90 000 mAh) pour Plusieurs appareils, Batterie LiFePO4, générateur Solaire 300 W, Camping, Voyage et urgences.',
    imageUrl: '/images/generator.jpg',
    amazonLink: 'https://www.amazon.fr/dp/B0D62PMB3R?tag=zequipement-21&th=1',
    category: 'Energie'
  },
  {
    id: 'p3',
    title: 'Nitecore NU25 MTC',
    summary: 'La lampe frontale NU25MCT offre 400 lumens (portée 132 m), une autonomie jusqu’à 45 h avec indicateur de batterie, 3 températures de couleur + modes ultra-faible (6 lumens) et rouge, le tout dans un format ultra-léger de 50 g, étanche IP66 et verrouillable.',
    imageUrl: '/images/NU25MTC.jpg',
    amazonLink: 'https://www.amazon.fr/Nitecore-NU25-dext%C3%A9rieur-rechargeable-temp%C3%A9ratures/dp/B0F18YZ5X5?tag=zequipement-21&th=1',
    category: 'Eclairage'
  },
  {
    id: 'p4',
    title: 'Radio Portable Survie XHDATA D608WB',
    summary: 'Solaire Dynamo Survival Batterie Rechargeable 3000 mAh du Téléphone par USB Bluetooth/TF Lampe de Poche Lampe de Lecture SOS Camping Situations d\'urgence.',
    imageUrl: '/images/Radio.jpg',
    amazonLink: 'https://www.amazon.fr/dp/B0CTMGQ2PF?tag=zequipement-21&th=1',
    category: 'Eclairage'
  },
  {
    id: 'p5',
    title: 'NRG-5 nourriture d\'urgence - 24 x 2300 kcal',
    summary: 'La ration de secours NRG-5 est une solution nutritionnelle complète conçue pour les situations d’urgence.',
    imageUrl: '/images/NRG5.jpg',
    amazonLink: 'https://www.amazon.fr/NRG-5-nourriture-durgence-24x-500g/dp/B00AGUZAC2?tag=zequipement-21&th=1',
    category: 'Alimentation'
  },
  {
    id: 'p6',
    title: 'GRAYL GeoPress 710 ml',
    summary: 'Filtre à eau pour l\'extérieur, Élimine 99,99% de toutes les bactéries et virus.',
    imageUrl: '/images/Grayl.jpg',
    amazonLink: 'https://www.amazon.fr/GRAYL-Geopress-Purifier-Bottle-noir/dp/B0C1M2VZ9T?tag=zequipement-21&th=1',
    category: 'Alimentation'
  },
  {
    id: 'p7',
    title: 'Survivre à l\'effondrement économique',
    summary: 'Comment se préparer ? Comment survivre à ces prochaines années de grands changements qui seront à la fois soudains, rapides et violents ? Êtes-vous prêts ?',
    imageUrl: '/images/survivre-a-l-effondrement-economique.jpg',
    amazonLink: 'https://www.amazon.fr/Survivre-leffondrement-%C3%A9conomique-Piero-Giorgio/dp/2491861038?tag=zequipement-21&th=1',
    category: 'Lecture'
  },
  {
    id: 'p8',
    title: 'Trousse de Premiers Secours Complète LEWIS-PLAST',
    summary: 'Grande trousse de premiers secours tout usage 224 pièces.',
    imageUrl: '/images/trousse.jpg',
    amazonLink: 'https://www.amazon.fr/Lewis-Plast-Grand-premiers-secours-pi%C3%A8ces/dp/B08XKY1QNR?tag=zequipement-21&th=1',
    category: 'Divers'
  },
  {
    id: 'p9',
    title: 'Lepro Lampe LED',
    summary: ' Lampe Camping LED [Jusqu\'à 200h d\'éclairage ] , Lanterne Camping Puissante 1000lm, Alimentation par pile, Luminosité Réglable, Etanche, pour Camping, Bivouac, Pêche, Randonnée, Cave, 2pcs.',
    imageUrl: '/images/lanterneLepro.jpg',
    amazonLink: 'https://www.amazon.fr/Lighting-EVER-Puissante-Luminosit%C3%A9-Eclairage/dp/B07D4GS3NL?tag=zequipement-21&th=1',
    category: 'Eclairage'
  },
  {
    id: 'p10',
    title: 'AFERIY Generateur Electrique Portable 2400W',
    summary: 'Batterie Nomade LiFePO4, Charge en 1,5H, Prise UE 220-240V, Fonction UPS, Station électrique Portable pour Camping/Maison/Bureau, Garantie 7 Ans.',
    imageUrl: '/images/generator2.jpg',
    amazonLink: 'https://www.amazon.fr/dp/B0FGD89DRZ?tag=zequipement-21&th=1',
    category: 'Energie'
  },
  {
    id: 'p11',
    title: 'ECO-WORTHY Bluetooth 280A',
    summary: 'Batterie Lithium 12V 280AH LiFePO4 avec BMS Protection, Plus de 6000 Cycles, 3584Wh Batterie Lithium pour Camping-Car, Bateau, Système Solaire, Maison, Panneau Solaire',
    imageUrl: '/images/batterie.jpg',
    amazonLink: 'https://www.amazon.fr/ECO-WORTHY-Bluetooth-Batterie-Protection-Camping-Car/dp/B0DB7VBZ7J?tag=zequipement-21&th=1',
    category: 'Energie'
  },
  {
    id: 'p12',
    title: 'Filtre à Eau Sawyer Mini',
    summary: 'Filtre à eau pour l\'extérieur, Élimine 99,99% de toutes les bactéries et virus.',
    imageUrl: '/images/sawyer-water-filter-1.jpg',
    amazonLink: 'https://www.amazon.fr/Sawyer-MINI-Filtre-eau-filtration/dp/B00FA2RLX2?tag=zequipement-21&th=1',
    category: 'Alimentation'
  },
  {
    id: 'p13',
    title: 'Rues Barbares : survivre en ville',
    summary: 'Comment survivre en ville ? Si vous ne lisez pas ce livre, nous ne donnons pas cher de votre peau de citadin !',
    imageUrl: '/images/rue-barbare.jpg',
    amazonLink: 'https://www.amazon.fr/Rues-Barbares-survivre-%C3%A9dition-actualis%C3%A9e/dp/2491861046?tag=zequipement-21&th=1',
    category: 'Lecture'
  },
  {
    id: 'p14',
    title: 'Pâte combustible HENDI',
    summary: 'Cette Pâte Combustible pour Chafing Dish en Boîte. Le lot se compose de 12 boîtes de 200 g pour une durée de combustion de 3h.',
    imageUrl: '/images/pate.jpg',
    amazonLink: 'https://www.amazon.fr/dp/B09GPS4SQN?tag=zequipement-21&th=1',
    category: 'Divers'
  },
  {
    id: 'p15',
    title: 'Résilience! L\'eau - Manuel Pratique',
    summary: 'Manuel survivaliste 100% pratique dédié entièrement au sujet fondamental de l’eau.',
    imageUrl: '/public/images/Leau.jpg',
    amazonLink: 'https://www.amazon.fr/dp/2501170261?tag=zequipement-21&th=1',
    category: 'Lecture'
  },
  {
    id: 'p16',
    title: 'L\'autonomie énergétique: Les panneaux photovoltaïques',
    summary: 'Ce livre vous guide, pas-à-pas, dans votre quête d’autonomie électrique.',
    imageUrl: '/public/images/Lchaillot.jpg',
    amazonLink: 'https://www.amazon.fr/dp/2501170261?tag=zequipement-21&th=1',
    category: 'Lecture'
  }
];
