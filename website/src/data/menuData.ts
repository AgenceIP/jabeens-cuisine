import type { MenuCategory } from '../types'

const img = (name: string) => `/menu/images/${encodeURIComponent(name)}.jpg`

// ─── DINE-IN — copie exacte du Restaurant MENU.pdf ───────────────────────────

export const dineInMenuData: MenuCategory[] = [
  {
    id: 'tapas',
    label: 'Tapas',
    sublabel: 'Apéritifs',
    items: [
      {
        name: 'Popadum Platter',
        description: '3 variétés de papadum avec chutney de mangue, yaourt à la menthe & betterave',
        descriptionEn: '3 types of papad with mango, mint yogurt & beetroot chutneys',
        vegetarian: true, image: img('Popadum Platter'),
      },
      {
        name: 'Pani Puri',
        description: 'Tout droit des rues de l\'Inde : puris avec chutneys tamarin & menthe, pommes de terre épicées et eau acidulée (8 pcs)',
        descriptionEn: 'From the streets of India: puris with tamarind & mint chutneys, spicy potatoes & tangy spiced water (8 pcs)',
        vegetarian: true, image: img('Pani Puri'),
      },
      {
        name: 'Dahi Puri',
        description: 'Puri de semoule farci de yogourt sucré, pommes de terre épicées, chutney de tamarin & menthe, garni de sev (6 pcs)',
        descriptionEn: 'Semolina puri with sweet yogurt, spicy potatoes, tamarind & mint chutneys, topped with sev (6 pcs)',
        vegetarian: true, image: img('Dahi Puri'),
      },
      {
        name: 'Samosa Chaat',
        description: 'Samosas végé avec channa masala, yogourt sucré, chutneys menthe & tamarin, oignons & sev (2 pcs)',
        descriptionEn: 'Veg samosas with channa masala, sweet yogurt, mint & tamarind chutneys, onions & sev (2 pcs)',
        vegetarian: true, image: img('Samosa Chaat'),
      },
      {
        name: 'Veg Samosas',
        description: 'Servis avec sauces maison au tamarin et à la menthe (2 pcs)',
        descriptionEn: 'Served with homemade tamarind and mint sauces (2 pcs)',
        vegetarian: true,
      },
      {
        name: 'Beef Samosa',
        description: 'Spécialité maison : samosas au bœuf avec sauces tamarin & menthe (3 pcs)',
        descriptionEn: 'House specialty: beef samosas with homemade tamarind & mint sauces (3 pcs)',
        image: img('Beef Samosa'),
      },
      {
        name: 'Veg Pakora',
        description: 'Légumes enrobés de farine de pois chiches, servis avec chutney épicé et acidulé (6 pcs)',
        descriptionEn: 'Mixed veg in gram flour, served with spicy & tangy chutney (6 pcs)',
        vegetarian: true,
      },
      {
        name: 'Quinoa Bhel',
        description: 'Quinoa, riz soufflé & pomme verte, avec chutneys tamarin, betterave & menthe',
        descriptionEn: 'Quinoa, rice puffs & green apple with tamarind, beetroot & mint chutneys',
        vegetarian: true,
      },
      {
        name: 'Desi Style Fish & Chips',
        description: 'Poisson mariné aux épices d\'Amritsar, servi avec frites, chaat masala et sauce spéciale',
        descriptionEn: 'Amritsari spice marinated fish served with fries, chaat masala & special sauce',
        image: img('Desi Style Fish & Chips'),
      },
    ],
  },
  {
    id: 'tapas-plus',
    label: 'Tapas Plus',
    sublabel: 'Grillades & Tandoor',
    items: [
      {
        name: 'Achaari Paneer Tikka',
        description: 'Fromage paneer mariné aux épices de pickle, cuit au four tandoor avec poivrons et oignons',
        descriptionEn: 'Pickle marinated clay oven cooked cottage cheese served with peppers & onions',
        vegetarian: true, image: img('Achaari Paneer Tikka'),
      },
      {
        name: 'Honey Chili Gobhi',
        description: 'Chou-fleur croustillant sauté dans une sauce sucrée et épicée, garni de graines de sésame',
        descriptionEn: 'Crispy cauliflower tossed in sweet spicy sauce topped with sesame seeds',
        vegetarian: true, image: img('Honey Chili Gobhi'),
      },
      {
        name: 'Kaali Mirch Fish Tikka',
        description: 'Poisson mariné au yaourt et poivre noir, cuit lentement au tandoor',
        descriptionEn: 'Yoghurt black pepper marinated fish cooked in tandoor at very low heat',
      },
      {
        name: 'Mushroom Stuffed Tikka',
        description: 'Champignons farcis au fromage, marinés épicés et cuits lentement au tandoor',
        descriptionEn: 'Cheese stuffed spicy marinated mushroom cooked at slow temperature in clay oven',
        vegetarian: true, image: img('Mushroom Stuffed Tikka'),
      },
      {
        name: 'Chicken Tikka',
        description: 'Poulet mariné maison, cuit au tandoor avec saveur de charbon',
        descriptionEn: 'In-house tandoori marinated chicken thigh cooked to perfection with charcoal flavor',
      },
      {
        name: 'Chicken Malai Tikka',
        description: 'Poulet mariné aux noix de cajou et épices douces, cuisiné avec crème et beurre',
        descriptionEn: 'Cashew and mild spices marinated chicken cooked and tossed in cream and butter',
        image: img('Chicken Malai Tikka'),
      },
      {
        name: 'Chili Chicken',
        description: 'Morceaux de poulet croustillants avec poivrons et oignons dans une sauce épicée et acidulée',
        descriptionEn: 'Crispy chicken chunks with peppers and onions in a spicy tangy sauce',
      },
      {
        name: 'Tandoori Prawns',
        description: 'Crevettes tigrées marinées toute la nuit aux épices et cuites à la perfection',
        descriptionEn: 'Overnight marinated red chili tiger prawns cooked to perfection',
      },
      {
        name: 'Beef Seekh Kebab',
        description: 'Bœuf haché mariné aux épices maison, coriandre et piment vert, cuit lentement',
        descriptionEn: 'Grounded beef marinated with our special spices, coriander, green chili cooked at low heat for perfection',
      },
    ],
  },
  {
    id: 'exotic-garden',
    label: 'Exotic Garden',
    sublabel: 'Salades',
    labelFr: 'Jardin Exotique',
    sublabelFr: 'Salades',
    items: [
      {
        name: 'Chicken Tikka Caesar Salad',
        description: 'Laitue iceberg croustillante, parmesan, croûtons et vinaigrette César, garnie de poulet tikka',
        descriptionEn: 'Crispy iceberg lettuce tossed with parmesan, croutons, caesar dressing topped with chicken tikka',
      },
      {
        name: 'Melon Salad',
        description: 'Laitue croustillante, melon & feta, vinaigrette miel-citron — choix : végétarien / crevettes tandoori / poulet tikka',
        descriptionEn: 'Crispy lettuce with melon & feta, honey-lemon dressing — choice of: veg / tandoori prawns / chicken tikka',
        vegetarian: true, image: img('Melon Salad'),
      },
    ],
  },
  {
    id: 'flavor-veg',
    label: 'Vegetarian',
    sublabel: '',
    labelFr: 'Végétarien',
    sublabelFr: '',
    items: [
      {
        name: 'Highway Dal Tadka',
        description: 'Lentilles jaunes aux tomates & oignons, gingembre & huile épicée',
        descriptionEn: 'Yellow lentils with tomato & onion, topped with ginger & spiced oil',
        vegetarian: true,
      },
      {
        name: 'Dal Makhani',
        description: 'Lentilles noires mijotées 48 heures avec beurre et crème',
        descriptionEn: '48 hours slow-cooked black lentil cooked with butter and cream',
        vegetarian: true,
      },
      {
        name: 'Amritsari Cholle',
        description: 'Pois chiches en sauce tomate-oignon épicée, garnis d\'oignon, citron & piment',
        descriptionEn: 'Chickpeas in spiced tomato-onion gravy, topped with onion, lemon & chili',
        vegetarian: true,
      },
      {
        name: 'Kadhai Paneer',
        description: 'Paneer dans une sauce épaisse tomate-oignon avec poivrons croquants',
        descriptionEn: 'Cottage cheese in rustic tomato onion thick gravy cooked with crunchy onion & peppers',
        vegetarian: true,
      },
      {
        name: 'Paneer Tikka Masala',
        description: 'Paneer tikka dans une sauce crémeuse tomate-oignon',
        descriptionEn: 'Cottage cheese tikka served with creamy spiced tomato onion gravy cooked with butter',
        vegetarian: true,
      },
      {
        name: 'Paneer Lababdar',
        description: 'Paneer dans une sauce riche tomate, poivrons et fromage',
        descriptionEn: 'Cottage cheese, chunky pepper, tomato and onion gravy finished with cheese',
        vegetarian: true,
      },
      {
        name: 'Palak Paneer',
        description: 'Épinards crémeux avec paneer',
        descriptionEn: 'Classic palak gravy served with cottage cheese',
        vegetarian: true,
      },
      {
        name: 'Malai Kofta',
        description: 'Boulettes de légumes dans une sauce aux noix de cajou et pétales de rose',
        descriptionEn: 'Mix veg kofta served with rose petals & cashew sauce',
        vegetarian: true,
      },
      {
        name: 'Aloo Gobhi',
        description: 'Pommes de terre et chou-fleur maison dans une sauce tomate-oignon',
        descriptionEn: 'Homestyle potato and cauliflower cooked in tomato and onion gravy',
        vegetarian: true,
      },
      {
        name: 'Exotic Vegetable Masala',
        description: 'Maïs miniature, carottes, brocoli, champignons & tomates cerises en masala',
        descriptionEn: 'Baby corn, carrots, broccoli, mushrooms & cherry tomatoes in masala',
        vegetarian: true,
      },
    ],
  },
  {
    id: 'flavor-meats',
    label: 'Meats',
    sublabel: '',
    labelFr: 'Viandes',
    sublabelFr: '',
    items: [
      {
        name: 'Butter Chicken',
        description: 'Poulet tikka dans une sauce tomate et noix de cajou, fini à la crème',
        descriptionEn: 'Succulent chicken tikka cooked in tomato cashew gravy finished with cream',
        image: img('Butter Chicken'),
      },
      {
        name: 'Chicken Tikka Masala',
        description: 'Poulet mariné tandoori dans une sauce tomate, poivrons et crème de coco',
        descriptionEn: 'Tandoori marinated boneless chicken cooked in chunky tomato pepper coconut cream sauce',
      },
      {
        name: 'Methi Malai Chicken',
        description: 'Poulet crémeux au fenugrec et noix de cajou',
        descriptionEn: 'Malai chicken tikka cooked in Kasuri Methi cashew gravy',
        image: img('Methi Malai Chicken'),
      },
      {
        name: 'Chicken Lababdar',
        description: 'Poulet dans une sauce riche tomate, poivrons et fromage',
        descriptionEn: 'Chicken tikka, chunky pepper, tomato and onion gravy finished with cheese',
        image: img('Chicken Lababdar'),
      },
      {
        name: 'Lahori Kadhai Chicken',
        description: 'Poulet dans une sauce rustique tomate-oignon avec poivrons croquants',
        descriptionEn: 'Spiced rustic onion tomato gravy cooked with crunchy onions and peppers with boneless chicken tikka',
        image: img('Lahori Kadhai Chicken'),
      },
      {
        name: 'Goan Style Prawns Curry',
        description: 'Curry acidulé à base de tomate et lait de coco',
        descriptionEn: 'Tangy coconut cream based tomato curry cooked with prawns',
        image: img('Goan Style Prawns Curry'),
      },
      {
        name: 'Lamb Rogan Josh',
        description: 'Morceaux d\'agneau tendres dans une sauce épicée aux tomates',
        descriptionEn: 'Tender lamb chunks cooked in spiced tomato lamb curry with spiced oil',
      },
      {
        name: 'Lamb Bhuna',
        description: 'Agneau dans une sauce épaisse aux épices et poivrons',
        descriptionEn: 'Chunky thick gravy coated tender lamb chunks cooked with peppers and spices',
        image: img('Lamb Bhuna'),
      },
      {
        name: 'Beef Karahi',
        description: 'Bœuf dans une sauce rustique tomate-oignon avec poivrons',
        descriptionEn: 'Spiced rustic onion tomato gravy cooked with crunchy onions and peppers with boneless tender beef',
      },
      {
        name: 'Beef Bhuna',
        description: 'Bœuf dans une sauce épaisse aux épices et poivrons',
        descriptionEn: 'Chunky thick gravy coated tender beef chunks cooked with peppers and spices',
      },
    ],
  },
  {
    id: 'biryani',
    label: 'Biryani',
    sublabel: 'Servi avec Boondi Raita',
    items: [
      {
        name: 'Vegetarian Biryani',
        description: 'Légumes épicés à la sauce tomate, superposés avec du riz parfumé',
        descriptionEn: 'Spiced veg in tomato gravy, layered with aromatic rice',
        vegetarian: true,
      },
      {
        name: 'Chicken Biryani',
        description: 'Poulet épicé en sauce, superposé avec du riz parfumé',
        descriptionEn: 'Spiced chicken curry layered with aromatic rice',
      },
      {
        name: 'Lamb Biryani',
        description: 'Agneau épicé en sauce, superposé avec du riz parfumé',
        descriptionEn: 'Spiced lamb curry layered with aromatic rice',
      },
      {
        name: 'Beef Biryani',
        description: 'Bœuf en curry épicé, superposé avec du riz parfumé',
        descriptionEn: 'Spiced beef curry layered with aromatic rice',
      },
    ],
  },
  {
    id: 'breads',
    label: 'Breads',
    sublabel: 'Pains',
    labelFr: 'Pains',
    sublabelFr: 'Pains',
    items: [
      { name: 'Tandoori Butter Roti', vegetarian: true },
      { name: 'Butter Naan', vegetarian: true, image: img('Butter Naan') },
      { name: 'Garlic Naan', vegetarian: true },
      { name: 'Cheese Naan', vegetarian: true },
      { name: 'Laccha Paratha', vegetarian: true },
      { name: 'Mushroom Truffle Naan', vegetarian: true },
    ],
  },
  {
    id: 'sides',
    label: 'Sides',
    sublabel: 'Accompagnements',
    labelFr: 'Accompagnements',
    sublabelFr: 'Accompagnements',
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
    labelFr: 'Desserts',
    sublabelFr: 'Desserts',
    items: [
      {
        name: 'New Style Boondi Pak',
        description: 'Perles de boondi superposées avec rabri à la vanille, pistaches et feuille d\'or',
        descriptionEn: 'Boondi caviars layered with vanilla rabri topped with pistachio dust and gold leaf',
        vegetarian: true,
      },
      {
        name: 'Tiramisu Went to South Asia',
        description: 'Rasmalai garni de mousse mascarpone au café et saupoudré de cacao',
        descriptionEn: 'Rasmalai topped with coffee mascarpone mousse and dusted with cocoa',
        vegetarian: true, image: img('South Asian Tiramisu'),
      },
      {
        name: 'Phirni Brûlée',
        description: 'Phirni de riz parfumée au safran, caramélisée façon crème brûlée',
        descriptionEn: 'Traditional rice phirni flavoured with saffron & given a brulée effect',
        vegetarian: true, image: img('Phirni Brûlée'),
      },
    ],
  },
]

// ─── TAKE-OUT — copie exacte du TAKE OUT MENU.pdf ────────────────────────────

export const takeOutMenuData: MenuCategory[] = [
  {
    id: 'to-appetizers',
    label: 'Appetizers',
    sublabel: 'Entrées',
    labelFr: 'Entrées',
    sublabelFr: 'Entrées',
    items: [
      {
        name: 'Pani Puri',
        description: 'Plat de rue indien servi avec puri, chutneys sucrés et épicés, mélange de pommes de terre épicé et eau à la menthe acidulée (8 pcs)',
        descriptionEn: 'From the streets of India: puri with sweet & spicy chutney syringe, spicy potato mix and tangy minty water (8 pcs)',
        vegetarian: true, image: img('Pani Puri'),
      },
      {
        name: 'Dahi Puri',
        description: 'Puri de semoule farci de yogourt sucré, mélange de pommes de terre épicé, chutney de tamarin et sauce à la menthe, garni de sev (6 pcs)',
        descriptionEn: 'Semolina puri stuffed with sweet yoghurt, spicy potato mix, tamarind chutney and mint sauce, garnished with sev (6 pcs)',
        vegetarian: true, image: img('Dahi Puri'),
      },
      {
        name: 'Samosa Chaat',
        description: 'Samosas végé garnis de channa masala, yogourt sucré, sauce à la menthe, sauce au tamarin, oignons hachés et sev (2 pcs)',
        descriptionEn: 'Veg samosa topped with channa masala, sweet yoghurt, mint sauce, tamarind sauce, chopped onions and garnished with sev (2 pcs)',
        vegetarian: true, image: img('Samosa Chaat'),
      },
      {
        name: 'Veg Pakora',
        description: 'Légumes variés enrobés de farine de pois chiches, servis avec chutney épicé et acidulé (6 pcs)',
        descriptionEn: 'Mix veg gram flour coated served with spicy and tangy chutney (6 pcs)',
        vegetarian: true,
      },
      {
        name: 'Veg Spring Rolls',
        description: 'Chou frais assaisonné, roulé dans une feuille de rouleau impérial (3 pcs)',
        descriptionEn: 'Fresh cabbage cooked with seasoning rolled in a spring roll sheet (3 pcs)',
        vegetarian: true,
      },
      {
        name: 'Chicken Spring Rolls',
        description: 'Poulet haché assaisonné, roulé dans une feuille de rouleau impérial (3 pcs)',
        descriptionEn: 'Chicken mince cooked with seasoning rolled in a spring roll sheet (3 pcs)',
      },
      {
        name: 'Veg Samosas',
        description: 'Servis avec sauces maison au tamarin et à la menthe (2 pcs)',
        descriptionEn: 'Veg samosa served with homemade tamarind and mint sauce (2 pcs)',
        vegetarian: true,
      },
      {
        name: 'Beef Samosa',
        description: 'Spécialité maison : 3 samosas au bœuf avec sauces tamarin & menthe (3 pcs)',
        descriptionEn: 'Our in-house specialty: 3 beef samosas served with homemade tamarind and mint sauce (3 pcs)',
        image: img('Beef Samosa'),
      },
      {
        name: 'Desi Style Fish & Chips',
        description: 'Poisson frit mariné aux épices d\'Amritsar, servi avec frites, chaat masala et sauce spéciale',
        descriptionEn: 'Amritsari spice marinated fried fish served with fries, topped with chaat masala, served with special sauce',
        image: img('Desi Style Fish & Chips'),
      },
      {
        name: 'Kaali Mirch Fish Tikka',
        description: 'Poisson mariné au yogourt et poivre noir, cuit au tandoor à basse température',
        descriptionEn: 'Yoghurt black pepper marinated fish cooked in a tandoor at very low heat',
      },
      {
        name: 'Chicken Tikka',
        description: 'Poulet mariné maison, cuit au charbon pour une saveur fumée',
        descriptionEn: 'In-house tandoori-marinated chicken thigh cooked to perfection with charcoal flavor',
      },
      {
        name: 'Chicken Malai Tikka',
        description: 'Poulet mariné aux noix de cajou et épices douces, cuisiné avec crème et beurre',
        descriptionEn: 'Cashew and mild spices marinated chicken cooked and tossed in cream and butter',
        image: img('Chicken Malai Tikka'),
      },
      {
        name: 'Achaari Paneer Tikka',
        description: 'Fromage paneer mariné style pickle, cuit au four tandoor avec poivrons et oignons',
        descriptionEn: 'Pickle marinated clay oven cooked cottage cheese served with peppers and onions',
        vegetarian: true, image: img('Achaari Paneer Tikka'),
      },
      {
        name: 'Beef Seekh Kebab',
        description: 'Bœuf doublement haché mariné aux épices maison, cuit lentement',
        descriptionEn: 'Double minced beef marinated with our special spices and cooked at low heat for perfection',
      },
      {
        name: 'Mushroom Stuffed Tikka',
        description: 'Champignons farcis au fromage, marinés épicés et cuits lentement au tandoor',
        descriptionEn: 'Cheese-stuffed spicy marinated mushroom cooked at slow temperature in a clay oven',
        vegetarian: true, image: img('Mushroom Stuffed Tikka'),
      },
      {
        name: 'Tandoori Prawns',
        description: 'Crevettes marinées toute la nuit au piment rouge, cuites à la perfection',
        descriptionEn: 'Overnight marinated red chilli prawns cooked to perfection',
      },
      {
        name: 'Honey Chili Potato',
        description: 'Pommes de terre croustillantes dans une sauce sucrée et épicée, garnies de graines de sésame',
        descriptionEn: 'Crispy potatoes tossed in sweet spicy sauce, topped with sesame seeds',
        vegetarian: true,
      },
      {
        name: 'Honey Chili Gobhi',
        description: 'Chou-fleur croustillant sauté dans une sauce sucrée et épicée, garni de graines de sésame',
        descriptionEn: 'Crispy cauliflower tossed in sweet spicy sauce, topped with sesame seeds',
        vegetarian: true, image: img('Honey Chili Gobhi'),
      },
      {
        name: 'Chili Chicken',
        description: 'Morceaux de poulet croustillants avec poivrons et oignons dans une sauce épicée et acidulée',
        descriptionEn: 'Crispy chicken chunks along with peppers and onions cooked in spicy, tangy sauce',
      },
      {
        name: 'Afghani Mantu',
        description: 'Raviolis vapeur au bœuf haché, servis avec yogourt et sauce aux lentilles (10 / 15 / 25 pcs)',
        descriptionEn: 'Ground beef steamed dumplings served with yoghurt and lentil sauce (10 / 15 / 25 pcs)',
      },
    ],
  },
  {
    id: 'to-salads',
    label: 'Salads',
    sublabel: 'Salades',
    labelFr: 'Salades',
    sublabelFr: 'Salades',
    items: [
      {
        name: 'Caesar Salad',
        description: 'Laitue iceberg croustillante, parmesan, croûtons, vinaigrette César, garnie de poulet tikka',
        descriptionEn: 'Crispy iceberg lettuce tossed with parmesan, croutons, caesar dressing, topped with chicken tikka slices',
      },
    ],
  },
  {
    id: 'to-main-veg',
    label: 'Main Course',
    sublabel: 'Végétarien',
    labelFr: 'Plat Principal',
    sublabelFr: 'Végétarien',
    items: [
      {
        name: 'Highway Dal Tadka',
        description: 'Lentilles jaunes avec tomate et oignon, légèrement épicées, garnies de gingembre et huile épicée',
        descriptionEn: 'Yellow lentil cooked with tomato and onion with little spices, topped with ginger and spice oil',
        vegetarian: true,
      },
      {
        name: 'Dal Makhani',
        description: 'Lentilles noires mijotées 48 heures avec beurre et crème',
        descriptionEn: '48 hours slow-cooked black lentil cooked with butter and cream',
        vegetarian: true,
      },
      {
        name: 'Amritsari Cholle',
        description: 'Pois chiches Kabuli cuits dans une sauce épicée rustique tomate-oignon, garnis d\'oignons, citron et piment vert frais',
        descriptionEn: 'Kabuli channa cooked in rustic tomato and onion spiced gravy topped with onion, lemon and fresh green chili',
        vegetarian: true,
      },
      {
        name: 'Paneer Tikka Masala',
        description: 'Paneer tikka dans une sauce crémeuse tomate-oignon',
        descriptionEn: 'Cottage cheese tikka served with creamy spiced tomato onion gravy cooked with butter',
        vegetarian: true,
      },
      {
        name: 'Paneer Lababdar',
        description: 'Sauce épaisse aux poivrons, tomates et oignons, garnie de fromage pour apporter une saveur riche',
        descriptionEn: 'Chunky pepper, tomato and onion gravy finished with cheese to give rich flavor to the dish',
        vegetarian: true,
      },
      {
        name: 'Palak Paneer',
        description: 'Épinards en sauce avec paneer',
        descriptionEn: 'Classic palak gravy served with cottage cheese',
        vegetarian: true,
      },
      {
        name: 'Malai Kofta',
        description: 'Boulettes de légumes dans une sauce aux noix de cajou et pétales de rose',
        descriptionEn: 'Mix veg kofta served with rose petals and cashew sauce',
        vegetarian: true,
      },
      {
        name: 'Aloo Gobhi',
        description: 'Pommes de terre et chou-fleur maison dans une sauce tomate-oignon',
        descriptionEn: 'Homestyle potato and cauliflower cooked in tomato and onion gravy',
        vegetarian: true,
      },
      {
        name: 'Shahi Paneer',
        description: 'Fromage paneer dans une sauce tomate et noix de cajou, avec crème',
        descriptionEn: 'Cottage cheese cubes cooked in tomato cashew gravy finished with cream',
        vegetarian: true,
      },
    ],
  },
  {
    id: 'to-main-meats',
    label: 'Main Course',
    sublabel: 'Non Végétarien',
    labelFr: 'Plat Principal',
    sublabelFr: 'Non Végétarien',
    items: [
      {
        name: 'Butter Chicken',
        description: 'Poulet tikka dans une sauce tomate et noix de cajou, avec crème',
        descriptionEn: 'Succulent chicken tikka cooked in tomato cashew gravy finished with cream',
        image: img('Butter Chicken'),
      },
      {
        name: 'Chicken Tikka Masala',
        description: 'Poulet tandoori dans une sauce tomate, poivrons et crème de coco',
        descriptionEn: 'Tandoori marinated boneless chicken cooked in chunky tomato pepper coconut cream sauce',
      },
      {
        name: 'Methi Malai Chicken',
        description: 'Poulet dans une sauce crémeuse aux noix de cajou et fenugrec',
        descriptionEn: 'Malai tikka cooked in Kasuri Methi cashew creamy gravy',
        image: img('Methi Malai Chicken'),
      },
      {
        name: 'Lahori Kadhai Chicken',
        description: 'Poulet dans une sauce rustique tomate-oignon avec poivrons',
        descriptionEn: 'Spiced rustic onion tomato gravy cooked with crunchy onions and peppers with boneless chicken tikka',
        image: img('Lahori Kadhai Chicken'),
      },
      {
        name: 'Chicken Lababdar',
        description: 'Poulet dans une sauce riche tomate, poivrons et fromage',
        descriptionEn: 'Chicken in a rich tomato, pepper, and cheese sauce',
        image: img('Chicken Lababdar'),
      },
      {
        name: 'Goan Style Prawns Curry',
        description: 'Curry à base de crème de coco, acidulé',
        descriptionEn: 'Tangy coconut cream-based tomato curry cooked with prawns',
        image: img('Goan Style Prawns Curry'),
      },
      {
        name: 'Lamb Rogan Josh',
        description: 'Morceaux d\'agneau dans une sauce tomate épicée',
        descriptionEn: 'Tender lamb chunks cooked in spiced tomato lamb curry with spiced oil',
      },
      {
        name: 'Lamb Bhuna',
        description: 'Agneau dans une sauce épaisse avec poivrons et épices',
        descriptionEn: 'Chunky thick gravy-coated tender lamb chunks cooked with peppers and spices',
        image: img('Lamb Bhuna'),
      },
      {
        name: 'Beef Karahi',
        description: 'Bœuf dans une sauce rustique tomate-oignon avec poivrons',
        descriptionEn: 'Spiced rustic onion tomato gravy cooked with crunchy onions and peppers with boneless tender beef',
      },
      {
        name: 'Beef Bhuna',
        description: 'Bœuf dans une sauce épaisse avec poivrons et épices',
        descriptionEn: 'Chunky thick gravy-coated tender beef chunks cooked with peppers and spices',
      },
    ],
  },
  {
    id: 'to-biryani',
    label: 'Biryani',
    sublabel: 'Servi avec Boondi Raita',
    items: [
      {
        name: 'Vegetarian Biryani',
        description: 'Mélange de légumes cuits avec des épices et une sauce tomate, superposé avec du riz parfumé',
        descriptionEn: 'Mix vegetarian cooked with spices and tomato gravy, layered with rice and given aromatic flavor',
        vegetarian: true,
      },
      {
        name: 'Chicken Biryani',
        description: 'Poulet cuisiné avec des épices et du curry, superposé avec du riz parfumé',
        descriptionEn: 'Chicken cooked with spices and chicken curry layered with rice and given aromatic flavor',
      },
      {
        name: 'Lamb Biryani',
        description: 'Agneau cuisiné avec des épices, superposé avec du riz parfumé',
        descriptionEn: 'Lamb cooked with spices and lamb curry layered with rice and given aromatic flavor',
      },
      {
        name: 'Beef Biryani',
        description: 'Bœuf cuisiné dans un curry épicé, superposé avec du riz parfumé',
        descriptionEn: 'Beef chunks cooked with spicy curry, layered with rice and given aromatic flavor',
      },
    ],
  },
  {
    id: 'to-karachi-rolls',
    label: 'Karachi Rolls',
    sublabel: 'Rouleaux Karachi',
    items: [
      {
        name: 'Paneer Tikka Roll',
        description: 'Achaari paneer tikka, laitue croustillante, tranches d\'oignon, enveloppé dans un naan avec sauce spéciale',
        descriptionEn: 'Achaari paneer tikka, crispy lettuce, onion slices wrapped in naan topped with our special sauce',
        vegetarian: true,
      },
      {
        name: 'Chicken Roll',
        description: 'Poulet tikka, laitue croustillante, tranches d\'oignon, enveloppé dans un naan avec sauce spéciale',
        descriptionEn: 'Chicken tikka, crispy lettuce, onion slices, wrapped in naan, topped with our special sauce',
      },
      {
        name: 'Beef Seekh Roll',
        description: 'Bœuf seekh, laitue croustillante, tranches d\'oignon, enveloppé dans un naan avec sauce spéciale',
        descriptionEn: 'Beef seekh, crispy lettuce, onion slices, wrapped in naan, topped with our special sauce',
      },
      {
        name: 'Malai Chicken Tikka Roll',
        description: 'Poulet tikka malai mariné aux noix de cajou, laitue croustillante, tranches d\'oignon, enveloppé dans un naan avec sauce spéciale',
        descriptionEn: 'Cashew-marinated malai chicken tikka, crispy lettuce, onion slices, wrapped in naan, topped with our special sauce',
      },
      {
        name: 'Butter Chicken Roll',
        description: 'Poulet au beurre, laitue croustillante, tranches d\'oignon, enveloppé dans un naan avec sauce à la menthe',
        descriptionEn: 'Butter chicken, crispy lettuce, onion slices, wrapped in naan, topped with mint sauce',
      },
    ],
  },
  {
    id: 'to-indo-chinese',
    label: 'Indo Chinese',
    sublabel: 'Indo-Chinois',
    labelFr: 'Indo-Chinois',
    sublabelFr: 'Indo Chinese',
    items: [
      {
        name: 'Veg Noodles',
        description: 'Nouilles sautées au wok avec des légumes, sauce soja, sauce épicée et vinaigre · Ajouter poulet +$2 · crevettes +$4',
        descriptionEn: 'Wok tossed noodles with vegetables along with soy sauce, spicy sauce and vinegar · Add chicken +$2 · prawns +$4',
        vegetarian: true,
      },
      {
        name: 'Veg Fried Rice',
        description: 'Riz sauté au wok avec des légumes, sauce soja, sauce épicée et vinaigre · Ajouter poulet +$2 · crevettes +$4',
        descriptionEn: 'Wok tossed rice with vegetables along with soy sauce, spicy sauce and vinegar · Add chicken +$2 · prawns +$4',
        vegetarian: true,
      },
    ],
  },
  {
    id: 'to-breads',
    label: 'Breads',
    sublabel: 'Pains',
    labelFr: 'Pains',
    sublabelFr: 'Pains',
    items: [
      { name: 'Tandoori Butter Roti', vegetarian: true },
      { name: 'Butter Naan', vegetarian: true, image: img('Butter Naan') },
      { name: 'Garlic Naan', vegetarian: true },
      { name: 'Cheese Naan', vegetarian: true },
      { name: 'Laccha Paratha', vegetarian: true },
    ],
  },
  {
    id: 'to-sides',
    label: 'Sides',
    sublabel: 'Accompagnements',
    labelFr: 'Accompagnements',
    sublabelFr: 'Accompagnements',
    items: [
      { name: 'Steam Rice', vegetarian: true },
      { name: 'Jeera Rice', vegetarian: true },
      { name: 'Boondi Raita', vegetarian: true },
    ],
  },
  {
    id: 'to-desserts',
    label: 'Desserts',
    items: [
      {
        name: 'Gulab Jamun',
        description: 'Boulettes de lait frites au sirop de rose et cardamome (2 pcs)',
        descriptionEn: 'Fried milk dumplings in rose and cardamom syrup (2 pcs)',
        vegetarian: true,
      },
      {
        name: 'Rasmalai',
        description: 'Galettes de fromage frais, crème au lait aromatisée, pistaches (2 pcs)',
        descriptionEn: 'Fresh cheese patties in aromatic flavored milk cream, pistachios (2 pcs)',
        vegetarian: true,
      },
    ],
  },
]

// Legacy export
export const menuData = dineInMenuData
