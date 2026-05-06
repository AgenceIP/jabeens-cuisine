import type { MenuCategory } from '../types'

const img = (name: string) => `/menu/images/${encodeURIComponent(name)}.jpg`

export const menuData: MenuCategory[] = [
  {
    id: 'fusion-bites',
    label: 'Fusion Bites',
    sublabel: 'Apéritifs',
    items: [
      {
        name: 'Popadum Platter',
        description: '3 types de papad, chutney mangue, yaourt menthe, chutney betterave',
        vegetarian: true,
        image: img('Popadum Platter'),
        menus: ['dineIn'],
      },
      {
        name: 'Pani Puri',
        description: 'Street food indien : puri, seringue de chutney, mélange de pommes de terre épicé',
        vegetarian: true,
        image: img('Pani Puri'),
      },
      {
        name: 'Dahi Puri',
        description: 'Puri de semoule, yaourt sucré, chutney tamarin et menthe, garni de sev',
        vegetarian: true,
        image: img('Dahi Puri'),
      },
      {
        name: 'Samosa Chaat',
        description: 'Samosa végétarien, channa masala, yaourt, sauces, oignons, sev',
        vegetarian: true,
        image: img('Samosa Chaat'),
      },
      {
        name: 'Quinoa Bhel',
        description: 'Quinoa, riz soufflé, pomme verte, chutneys tamarin-betterave-menthe',
        vegetarian: true,
        menus: ['dineIn'],
      },
      {
        name: 'Veg Samosas',
        description: 'Sauce maison tamarin et menthe (2 pcs)',
        vegetarian: true,
      },
      {
        name: 'Beef Samosas',
        description: 'Notre spécialité maison (3 pcs)',
        image: img('Beef Samosa'),
      },
      {
        name: 'Gobhi Fritters',
        description: 'Chou-fleur en tempura épicé, chutney',
        vegetarian: true,
      },
      {
        name: 'Desi Style Fish & Chips',
        description: 'Poisson mariné aux épices Amritsari, frites au chaat masala',
        image: img('Desi Style Fish and Chips'),
      },
      {
        name: 'Veg Spring Rolls',
        description: 'Rouleaux de légumes croustillants, sauce aigre-douce maison',
        vegetarian: true,
        menus: ['takeOut'],
      },
      {
        name: 'Chicken Spring Rolls',
        description: 'Rouleaux de poulet épicé croustillants, sauce chili',
        menus: ['takeOut'],
      },
      {
        name: 'Honey Chili Potato',
        description: 'Pommes de terre croustillantes, sauce miel-piment, sésame',
        vegetarian: true,
        menus: ['takeOut'],
      },
      {
        name: 'Afghani Mantu',
        description: 'Raviolis afghans farcis, sauce tomate et yaourt épicé',
        menus: ['takeOut'],
      },
    ],
  },
  {
    id: 'exotic-garden',
    label: 'Exotic Garden',
    sublabel: 'Salades',
    items: [
      {
        name: 'Chicken Tikka Caesar',
        description: 'Laitue iceberg, parmesan, croutons, vinaigrette César, chicken tikka',
      },
      {
        name: 'Melon Salad',
        description: 'Laitue, melon frais, feta, vinaigrette miel-citron (veg / crevettes / chicken tikka)',
        vegetarian: true,
        image: img('Melon Salad'),
        menus: ['dineIn'],
      },
    ],
  },
  {
    id: 'tried-true',
    label: 'Tried & True',
    sublabel: 'Grillades & Tandoor',
    items: [
      {
        name: 'Achaari Paneer Tikka',
        description: "Fromage cottage mariné en pickles, cuit au four d'argile",
        vegetarian: true,
        image: img('Achaari Paneer Tikka'),
      },
      {
        name: 'Honey Chili Gobhi',
        description: 'Chou-fleur croustillant, sauce aigre-douce, sésame',
        vegetarian: true,
        image: img('Honey Chili Gobhi'),
      },
      {
        name: 'Mushroom Stuffed Tikka',
        description: 'Champignons farcis au fromage, cuits lentement au tandoor',
        vegetarian: true,
        image: img('Mushroom Stuffed Tikka'),
      },
      {
        name: 'Tandoori Prawns',
        description: 'Crevettes au piment rouge, marinées toute la nuit',
      },
      {
        name: 'Kaali Mirch Fish Tikka',
        description: 'Poisson mariné au yaourt et poivre noir, tandoor basse chaleur',
      },
      {
        name: 'Chicken Tikka',
        description: 'Cuisse de poulet marinée maison, saveur de charbon',
      },
      {
        name: 'Chicken Malai Tikka',
        description: 'Marinade cajou et épices douces, crème et beurre',
        image: img('Chicken Malai Tikka'),
      },
      {
        name: 'Chili Chicken',
        description: 'Poulet croustillant, poivrons, sauce épicée-acidulée',
      },
      {
        name: 'Beef Seekh Kebab',
        description: 'Bœuf haché double, épices maison, cuisson lente',
      },
    ],
  },
  {
    id: 'flavor-veg',
    label: 'Flavor Takes Time',
    sublabel: 'Végétarien',
    items: [
      {
        name: 'Highway Dal Tadka',
        description: 'Lentilles jaunes, tomate, oignon, huile épicée au gingembre',
        vegetarian: true,
      },
      {
        name: 'Dal Makhani',
        description: 'Lentilles noires cuites 48h au beurre et à la crème',
        vegetarian: true,
      },
      {
        name: 'Amritsari Cholle',
        description: 'Channa cuit en sauce rustique tomate-oignon',
        vegetarian: true,
      },
      {
        name: 'Kadhai Paneer',
        description: 'Sauce rustique tomate-oignon, poivrons, fromage cottage (épicé)',
        vegetarian: true,
      },
      {
        name: 'Paneer Tikka Masala',
        description: 'Paneer tikka en sauce crémeuse tomate-oignon au beurre',
        vegetarian: true,
      },
      {
        name: 'Paneer Lababdar',
        description: 'Poivrons, tomate, oignon, sauce au fromage',
        vegetarian: true,
      },
      {
        name: 'Palak Paneer',
        description: 'Sauce épinards classique, fromage cottage',
        vegetarian: true,
      },
      {
        name: 'Malai Kofta',
        description: 'Kofta de légumes mélangés, sauce aux pétales de rose et cajou (doux)',
        vegetarian: true,
      },
      {
        name: 'Aloo Gobhi',
        description: 'Pommes de terre et chou-fleur maison en sauce tomate',
        vegetarian: true,
      },
      {
        name: 'Exotic Vegetable Masala',
        description: 'Maïs nain, carotte, brocoli, champignons, tomates cerises',
        vegetarian: true,
      },
      {
        name: 'Shahi Paneer',
        description: 'Fromage cottage en sauce royale crémeuse, noix de cajou et épices douces',
        vegetarian: true,
        menus: ['takeOut'],
      },
    ],
  },
  {
    id: 'flavor-meats',
    label: 'Flavor Takes Time',
    sublabel: 'Viandes',
    items: [
      {
        name: 'Butter Chicken',
        description: 'Poulet tikka, sauce tomate-cajou, crème',
        image: img('Butter Chicken'),
      },
      {
        name: 'Chicken Tikka Masala',
        description: 'Poulet tandoori, sauce tomate-poivron-crème de coco',
      },
      {
        name: 'Chicken Lababdar',
        description: 'Poulet tikka, sauce onion-tomate crémeuse, poivrons',
        image: img('Chicken Lababdar'),
      },
      {
        name: 'Methi Malai Chicken',
        description: 'Malai tikka, sauce kasturi methi et cajou crémeux',
        image: img('Methi Malai Chicken'),
      },
      {
        name: 'Lahori Kadhai Chicken',
        description: 'Sauce rustique oignon-tomate, poivrons, poulet tikka désossé',
        image: img('Lahori Kadhai Chicken'),
      },
      {
        name: 'Goan Style Prawns Curry',
        description: 'Curry tomate et crème de coco, crevettes',
        image: img('Goan Style Prawns Curry'),
      },
      {
        name: 'Lamb Rogan Josh',
        description: "Agneau tendre, curry d'agneau épicé à l'huile aromatique",
      },
      {
        name: 'Lamb Bhuna',
        description: 'Agneau tendre en sauce épaisse, poivrons et épices',
        image: img('Lamb Bhuna'),
      },
      {
        name: 'Beef Karahi',
        description: 'Sauce rustique oignon-tomate, bœuf tendre désossé',
      },
      {
        name: 'Beef Bhuna',
        description: 'Bœuf tendre en sauce épaisse, poivrons et épices',
      },
    ],
  },
  {
    id: 'breads',
    label: 'Breads',
    sublabel: 'Pains',
    items: [
      { name: 'Tandoori Butter Roti', vegetarian: true },
      { name: 'Butter Naan', vegetarian: true, image: img('Butter Naan') },
      { name: 'Garlic Naan', vegetarian: true },
      { name: 'Cheese Naan', vegetarian: true },
      { name: 'Mushroom Truffle Naan', vegetarian: true },
    ],
  },
  {
    id: 'biryani',
    label: 'Biryani',
    sublabel: 'Servi avec Boondi Raita',
    items: [
      {
        name: 'Veg Biryani',
        description: 'Légumes, épices, sauce tomate, riz aromatique',
        vegetarian: true,
      },
      {
        name: 'Chicken Biryani',
        description: 'Poulet, curry, riz en couches aromatiques',
      },
      {
        name: 'Lamb Biryani',
        description: 'Agneau, curry, riz en couches aromatiques',
      },
      {
        name: 'Beef Biryani',
        description: 'Bœuf épicé, curry, riz en couches aromatiques',
      },
    ],
  },
  {
    id: 'karachi-rolls',
    label: 'Karachi Rolls',
    sublabel: 'Rôtis farcis',
    items: [
      {
        name: 'Paneer Tikka Roll',
        description: 'Rôti paratha, paneer tikka, chutney vert, oignons',
        vegetarian: true,
        menus: ['takeOut'],
      },
      {
        name: 'Chicken Roll',
        description: 'Rôti paratha, poulet tikka, oignons, chutney maison',
        menus: ['takeOut'],
      },
      {
        name: 'Beef Seekh Roll',
        description: 'Rôti paratha, seekh kebab de bœuf, oignons, sauce maison',
        menus: ['takeOut'],
      },
      {
        name: 'Malai Chicken Tikka Roll',
        description: 'Rôti paratha, malai tikka, chutney menthe crémeuse',
        menus: ['takeOut'],
      },
      {
        name: 'Butter Chicken Roll',
        description: 'Rôti paratha, butter chicken, sauce tomate-cajou',
        menus: ['takeOut'],
      },
    ],
  },
  {
    id: 'rice-noodles',
    label: 'Rice & Noodles',
    sublabel: 'Riz & Nouilles',
    items: [
      {
        name: 'Veg Fried Rice',
        description: 'Riz sauté aux légumes mélangés, sauce soja, œuf',
        vegetarian: true,
        menus: ['takeOut'],
      },
      {
        name: 'Veg Noodles',
        description: 'Nouilles sautées aux légumes, sauce soja, sésame',
        vegetarian: true,
        menus: ['takeOut'],
      },
    ],
  },
  {
    id: 'sides',
    label: 'Sides',
    sublabel: 'Accompagnements',
    items: [
      { name: 'Steam Rice', vegetarian: true },
      { name: 'Jeera Rice', vegetarian: true },
      { name: 'Boondi Raita', vegetarian: true },
    ],
  },
  {
    id: 'desserts',
    label: 'Sweet Tooth',
    sublabel: 'Desserts',
    items: [
      {
        name: 'New Style Boondi Pak',
        description: "Caviar de boondi, rabri vanille, poudre de pistache, feuille d'or",
        vegetarian: true,
        menus: ['dineIn'],
      },
      {
        name: 'Tiramisu Went to South Asia',
        description: 'Rasmalai, mousse mascarpone café, cacao',
        vegetarian: true,
        image: img('South Asian Tiramisu'),
        menus: ['dineIn'],
      },
      {
        name: 'Phirni Brûlée',
        description: 'Phirni de riz au safran, effet brûlée',
        vegetarian: true,
        image: img('Phirni Brûlée'),
        menus: ['dineIn'],
      },
      {
        name: 'Gulab Jamun',
        description: 'Boulettes de lait frites au sirop de rose et cardamome (2 pcs)',
        vegetarian: true,
        menus: ['takeOut'],
      },
      {
        name: 'Rasmalai',
        description: 'Galettes de fromage frais, crème au lait aromatisée, pistaches',
        vegetarian: true,
        menus: ['takeOut'],
      },
    ],
  },
  {
    id: 'options',
    label: 'Options',
    sublabel: 'Extras',
    items: [
      {
        name: 'Frites + Boisson',
        description: 'Ajoutez des frites et une boisson gazeuse à votre commande — +$4',
        vegetarian: true,
        menus: ['takeOut'],
      },
    ],
  },
  {
    id: 'drinks',
    label: 'Boissons',
    sublabel: 'Drinks',
    items: [
      { name: 'Mojito', description: 'Citron vert, menthe, soda — 9$', vegetarian: true },
      { name: 'Strawberry Mojito', description: 'Citron vert, fraise, mangue — 9$', vegetarian: true },
      { name: 'Bonbon à la mangue', description: 'Citron vert, pulpe de mangue, soda avec crème de noix de coco — 10$', vegetarian: true },
      { name: 'Latte glacé', description: 'Café froid, lait, glace — 7$', vegetarian: true },
      { name: 'Chai', description: 'Thé épicé chaud, lait — 5$', vegetarian: true },
      { name: 'Chai glacé', description: 'Thé épicé froid, lait — 7$', vegetarian: true },
      { name: 'Lassi à la mangue', description: 'Yaourt, mangue kesar — 7$', vegetarian: true },
      { name: 'Canettes', description: 'Boissons gazeuses — 3$', vegetarian: true },
    ],
  },
]
