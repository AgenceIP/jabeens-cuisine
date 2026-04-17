import type { MenuCategory } from '../types'

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
      },
      {
        name: 'Pani Puri',
        description: 'Street food indien : puri, seringue de chutney, mélange de pommes de terre épicé',
        vegetarian: true,
      },
      {
        name: 'Dahi Puri',
        description: 'Puri de semoule, yaourt sucré, chutney tamarin et menthe, garni de sev',
        vegetarian: true,
      },
      {
        name: 'Samosa Chaat',
        description: 'Samosa végétarien, channa masala, yaourt, sauces, oignons, sev',
        vegetarian: true,
      },
      {
        name: 'Quinoa Bhel',
        description: 'Quinoa, riz soufflé, pomme verte, chutneys tamarin-betterave-menthe',
        vegetarian: true,
      },
      {
        name: 'Veg Samosas',
        description: 'Sauce maison tamarin et menthe (2 pcs)',
        vegetarian: true,
      },
      {
        name: 'Beef Samosas',
        description: 'Notre spécialité maison (3 pcs)',
      },
      {
        name: 'Gobhi Fritters',
        description: 'Chou-fleur en tempura épicé, chutney',
        vegetarian: true,
      },
      {
        name: 'Desi Style Fish & Chips',
        description: 'Poisson mariné aux épices Amritsari, frites au chaat masala',
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
        description: 'Fromage cottage mariné en pickles, cuit au four d\'argile',
        vegetarian: true,
      },
      {
        name: 'Honey Chili Gobhi',
        description: 'Chou-fleur croustillant, sauce aigre-douce, sésame',
        vegetarian: true,
      },
      {
        name: 'Mushroom Stuffed Tikka',
        description: 'Champignons farcis au fromage, cuits lentement au tandoor',
        vegetarian: true,
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
      },
      {
        name: 'Chicken Tikka Masala',
        description: 'Poulet tandoori, sauce tomate-poivron-crème de coco',
      },
      {
        name: 'Methi Malai Chicken',
        description: 'Malai tikka, sauce kasturi methi et cajou crémeux',
      },
      {
        name: 'Lahori Kadhai Chicken',
        description: 'Sauce rustique oignon-tomate, poivrons, poulet tikka désossé',
      },
      {
        name: 'Goan Style Prawns Curry',
        description: 'Curry tomate et crème de coco, crevettes',
      },
      {
        name: 'Lamb Rogan Josh',
        description: 'Agneau tendre, curry d\'agneau épicé à l\'huile aromatique',
      },
      {
        name: 'Lamb Bhuna',
        description: 'Agneau tendre en sauce épaisse, poivrons et épices',
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
      { name: 'Butter Naan', vegetarian: true },
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
        description: 'Caviar de boondi, rabri vanille, poudre de pistache, feuille d\'or',
        vegetarian: true,
      },
      {
        name: 'Tiramisu Went to South Asia',
        description: 'Rasmalai, mousse mascarpone café, cacao',
        vegetarian: true,
      },
      {
        name: 'Phirni Brûlée',
        description: 'Phirni de riz au safran, effet brûlée',
        vegetarian: true,
      },
    ],
  },
]
