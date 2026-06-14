export interface CafeAbout {
  accessibility?: string[]
  serviceOptions?: string[]
  highlights?: string[]
  popularFor?: string[]
  offerings?: string[]
  diningOptions?: string[]
  amenities?: string[]
  atmosphere?: string[]
  crowd?: string[]
  planning?: string[]
  payments?: string[]
  children?: string[]
  parking?: string[]
  pets?: string[]
}

export interface CafePin {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  tags: string[]
  rating: number
  reviewCount: number
  openHours: string
  about: CafeAbout
}

const baseAbout: CafeAbout = {
  serviceOptions: ['Outdoor seating', 'Dine-in', 'Takeaway'],
  offerings: ['Coffee', 'Quick bite'],
  diningOptions: ['Seating'],
  amenities: ['Toilet', 'Wi-Fi', 'Free Wi-Fi'],
  atmosphere: ['Casual', 'Cosy'],
  payments: ['Credit cards', 'Debit cards', 'NFC mobile payments'],
}

export const VIENNA_CAFES: CafePin[] = [
  {
    id: 'c1', name: 'Café Neubau', address: 'Neubaugasse 18, 1070 Vienna',
    lat: 48.2065, lng: 16.3310, tags: ['Third Wave', 'Specialty'],
    rating: 4.7, reviewCount: 312, openHours: 'Mon–Sat 8:00–18:00',
    about: {
      ...baseAbout,
      accessibility: ['Wheelchair-accessible entrance', 'Wheelchair-accessible seating'],
      highlights: ['Great coffee', 'Great dessert'],
      popularFor: ['Solo dining', 'Good for working on laptop'],
      offerings: ['Coffee', 'Organic dishes', 'Vegan options', 'Vegetarian options', 'Quick bite'],
      diningOptions: ['Dessert', 'Seating', 'Table service'],
      amenities: ['Toilet', 'Wi-Fi', 'Free Wi-Fi'],
      atmosphere: ['Casual', 'Cosy', 'Trendy'],
      crowd: ['University students', 'LGBTQ+ friendly'],
      pets: ['Dogs allowed'],
    },
  },
  {
    id: 'c2', name: 'Bean & Benefit', address: 'Hernalser Gürtel 6, 1170 Vienna',
    lat: 48.2215, lng: 16.3340, tags: ['Popular', 'Open late'],
    rating: 4.5, reviewCount: 189, openHours: 'Mon–Fri 7:00–22:00, Sat–Sun 8:00–22:00',
    about: {
      ...baseAbout,
      highlights: ['Great coffee', 'Great tea selection'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Beer', 'Wine', 'Alcohol', 'Small plates', 'Vegetarian options'],
      diningOptions: ['Seating', 'Table service'],
      amenities: ['Bar on site', 'Toilet', 'Wi-Fi', 'Free Wi-Fi'],
      atmosphere: ['Casual', 'Trendy'],
      crowd: ['LGBTQ+ friendly', 'Tourists'],
      planning: ['Accepts reservations'],
      parking: ['Difficult to find a space'],
    },
  },
  {
    id: 'c3', name: 'The Daily Grind', address: 'Hietzinger Hauptstraße 20, 1130 Vienna',
    lat: 48.1870, lng: 16.3150, tags: ['Cozy', 'Garden'],
    rating: 4.6, reviewCount: 276, openHours: 'Daily 7:00–20:00',
    about: {
      ...baseAbout,
      accessibility: ['Wheelchair-accessible entrance', 'Wheelchair-accessible seating', 'Wheelchair-accessible car park'],
      serviceOptions: ['Outdoor seating', 'Dine-in', 'Takeaway'],
      highlights: ['Great coffee', 'Great dessert', 'Great tea selection'],
      popularFor: ['Family friendly', 'Solo dining'],
      offerings: ['Coffee', 'Organic dishes', 'Vegan options', 'Vegetarian options'],
      diningOptions: ['Dessert', 'Seating'],
      atmosphere: ['Casual', 'Cosy'],
      crowd: ['Family friendly', 'Tourists'],
      children: ['Good for kids', 'High chairs', 'Kids\' menu'],
      pets: ['Dogs allowed'],
    },
  },
  {
    id: 'c4', name: 'Cup Circle', address: 'Favoritenstraße 28, 1100 Vienna',
    lat: 48.1870, lng: 16.3670, tags: ['Cross-city favourite', 'Fast scan'],
    rating: 4.4, reviewCount: 451, openHours: 'Mon–Fri 7:30–18:00',
    about: {
      ...baseAbout,
      serviceOptions: ['Takeaway', 'Dine-in'],
      highlights: ['Great coffee'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Quick bite', 'Small plates'],
      diningOptions: ['Seating'],
      atmosphere: ['Casual'],
      crowd: ['University students'],
      payments: ['Credit cards', 'Debit cards', 'NFC mobile payments'],
    },
  },
  {
    id: 'c5', name: 'East Side Drip', address: 'Simmeringer Hauptstraße 30, 1110 Vienna',
    lat: 48.1800, lng: 16.4200, tags: ['Brunch', 'Dog-friendly'],
    rating: 4.3, reviewCount: 143, openHours: 'Daily 8:00–17:00',
    about: {
      ...baseAbout,
      serviceOptions: ['Outdoor seating', 'Dine-in', 'Takeaway'],
      highlights: ['Great coffee', 'Great dessert'],
      popularFor: ['Family friendly', 'Solo dining'],
      offerings: ['Coffee', 'Vegetarian options', 'Small plates'],
      diningOptions: ['Dessert', 'Seating', 'Table service'],
      atmosphere: ['Casual', 'Cosy'],
      crowd: ['Family friendly'],
      children: ['Good for kids', 'High chairs'],
      pets: ['Dogs allowed'],
    },
  },
  {
    id: 'c6', name: 'Grounded Vienna', address: 'Gentzgasse 8, 1180 Vienna',
    lat: 48.2355, lng: 16.3420, tags: ['Specialty', 'Quiet work spot'],
    rating: 4.8, reviewCount: 267, openHours: 'Mon–Fri 7:00–18:00, Sat 9:00–16:00',
    about: {
      ...baseAbout,
      accessibility: ['Wheelchair-accessible entrance'],
      highlights: ['Great coffee', 'Great tea selection'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Organic dishes', 'Vegan options', 'Vegetarian options', 'Quick bite'],
      diningOptions: ['Seating'],
      amenities: ['Toilet', 'Wi-Fi', 'Free Wi-Fi'],
      atmosphere: ['Casual', 'Cosy', 'Trendy'],
      crowd: ['University students', 'LGBTQ+ friendly'],
      parking: ['Difficult to find a space'],
    },
  },
  {
    id: 'c7', name: 'Slow Drip', address: 'Floridsdorfer Hauptstraße 6, 1210 Vienna',
    lat: 48.2580, lng: 16.4050, tags: ['Third Wave', 'Large space'],
    rating: 4.5, reviewCount: 198, openHours: 'Mon–Sat 8:00–20:00',
    about: {
      ...baseAbout,
      accessibility: ['Wheelchair-accessible entrance', 'Wheelchair-accessible seating'],
      serviceOptions: ['Outdoor seating', 'On-site services', 'Dine-in', 'Takeaway'],
      highlights: ['Great coffee', 'Great dessert'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Vegan options', 'Vegetarian options', 'Small plates'],
      diningOptions: ['Dessert', 'Seating', 'Table service'],
      amenities: ['Toilet', 'Wi-Fi', 'Free Wi-Fi'],
      atmosphere: ['Casual', 'Trendy'],
      crowd: ['University students'],
      planning: ['Accepts reservations'],
    },
  },
  {
    id: 'c8', name: 'Dark Matter Coffee', address: 'Wagramer Straße 10, 1220 Vienna',
    lat: 48.2240, lng: 16.4480, tags: ['Late night', 'Open late'],
    rating: 4.6, reviewCount: 334, openHours: 'Daily 10:00–24:00',
    about: {
      ...baseAbout,
      serviceOptions: ['Dine-in', 'Takeaway', 'Delivery'],
      highlights: ['Great coffee', 'Great tea selection'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Beer', 'Wine', 'Alcohol', 'Small plates', 'Vegan options'],
      diningOptions: ['Seating', 'Table service'],
      amenities: ['Bar on site', 'Toilet', 'Wi-Fi', 'Free Wi-Fi'],
      atmosphere: ['Casual', 'Trendy'],
      crowd: ['LGBTQ+ friendly', 'Tourists'],
      payments: ['Credit cards', 'Debit cards', 'NFC mobile payments'],
    },
  },
  {
    id: 'c9', name: 'Taborstraße Coffee', address: 'Taborstraße 22, 1020 Vienna',
    lat: 48.2148, lng: 16.3920, tags: ['Popular', 'Fast scan'],
    rating: 4.4, reviewCount: 521, openHours: 'Mon–Fri 7:00–19:00',
    about: {
      ...baseAbout,
      serviceOptions: ['Takeaway', 'Dine-in'],
      highlights: ['Great coffee'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Quick bite'],
      diningOptions: ['Seating'],
      atmosphere: ['Casual'],
      crowd: ['University students', 'Tourists'],
    },
  },
  {
    id: 'c10', name: 'Prater Brew', address: 'Praterstraße 46, 1020 Vienna',
    lat: 48.2195, lng: 16.4005, tags: ['Third Wave', 'Brunch'],
    rating: 4.7, reviewCount: 289, openHours: 'Daily 9:00–18:00',
    about: {
      ...baseAbout,
      accessibility: ['Wheelchair-accessible entrance', 'Wheelchair-accessible seating'],
      serviceOptions: ['Outdoor seating', 'Dine-in', 'Takeaway'],
      highlights: ['Great coffee', 'Great dessert', 'Great tea selection'],
      popularFor: ['Family friendly', 'Solo dining'],
      offerings: ['Coffee', 'Organic dishes', 'Vegan options', 'Vegetarian options', 'Small plates'],
      diningOptions: ['Dessert', 'Seating', 'Table service'],
      amenities: ['Toilet', 'Wi-Fi', 'Free Wi-Fi'],
      atmosphere: ['Casual', 'Cosy'],
      crowd: ['Family friendly', 'Tourists'],
      planning: ['Accepts reservations'],
      children: ['Good for kids', 'High chairs'],
      pets: ['Dogs allowed'],
    },
  },
  {
    id: 'c11', name: 'Landstraße Roast', address: 'Landstraßer Hauptstraße 24, 1030 Vienna',
    lat: 48.1995, lng: 16.3885, tags: ['Specialty', 'Open late'],
    rating: 4.5, reviewCount: 176, openHours: 'Mon–Fri 7:30–18:30',
    about: {
      ...baseAbout,
      highlights: ['Great coffee', 'Great tea selection'],
      popularFor: ['Good for working on laptop'],
      offerings: ['Coffee', 'Vegan options', 'Vegetarian options'],
      diningOptions: ['Seating'],
      atmosphere: ['Casual', 'Cosy'],
      crowd: ['University students'],
      parking: ['Difficult to find a space'],
    },
  },
  {
    id: 'c12', name: 'Rasumofsky Espresso', address: 'Rasumofskygasse 8, 1030 Vienna',
    lat: 48.2030, lng: 16.3960, tags: ['Cozy', 'Quiet work spot'],
    rating: 4.8, reviewCount: 412, openHours: 'Mon–Sat 8:00–19:00',
    about: {
      ...baseAbout,
      accessibility: ['Wheelchair-accessible entrance'],
      highlights: ['Great coffee', 'Great dessert'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Organic dishes', 'Vegan options', 'Vegetarian options', 'Quick bite'],
      diningOptions: ['Dessert', 'Seating', 'Table service'],
      amenities: ['Toilet', 'Wi-Fi', 'Free Wi-Fi'],
      atmosphere: ['Casual', 'Cosy', 'Trendy'],
      crowd: ['University students', 'LGBTQ+ friendly'],
    },
  },
  {
    id: 'c13', name: 'Roast Republic', address: 'Brigittaplatz 4, 1200 Vienna',
    lat: 48.2390, lng: 16.3750, tags: ['Brunch', 'Third Wave'],
    rating: 4.6, reviewCount: 238, openHours: 'Daily 8:00–17:00',
    about: {
      ...baseAbout,
      serviceOptions: ['Outdoor seating', 'Dine-in', 'Takeaway'],
      highlights: ['Great coffee', 'Great dessert', 'Great tea selection'],
      popularFor: ['Family friendly', 'Solo dining'],
      offerings: ['Coffee', 'Organic dishes', 'Vegan options', 'Vegetarian options'],
      diningOptions: ['Dessert', 'Seating', 'Table service'],
      atmosphere: ['Casual', 'Cosy'],
      crowd: ['Family friendly', 'Tourists'],
      children: ['Good for kids', 'High chairs', 'Kids\' menu'],
      pets: ['Dogs allowed'],
    },
  },
  {
    id: 'c14', name: 'Wallenstein Kaffee', address: 'Wallensteinstraße 28, 1200 Vienna',
    lat: 48.2340, lng: 16.3700, tags: ['Dog-friendly', 'Large space'],
    rating: 4.3, reviewCount: 167, openHours: 'Mon–Sat 9:00–18:00',
    about: {
      ...baseAbout,
      serviceOptions: ['Outdoor seating', 'On-site services', 'Dine-in', 'Takeaway'],
      highlights: ['Great coffee'],
      popularFor: ['Family friendly', 'Solo dining'],
      offerings: ['Coffee', 'Vegetarian options', 'Small plates'],
      diningOptions: ['Seating', 'Table service'],
      atmosphere: ['Casual', 'Cosy'],
      crowd: ['Family friendly'],
      children: ['Good for kids', 'High chairs'],
      pets: ['Dogs allowed'],
    },
  },
  {
    id: 'c15', name: 'Wieden Coffee', address: 'Wiedner Hauptstraße 32, 1040 Vienna',
    lat: 48.1940, lng: 16.3670, tags: ['Popular', 'Open late'],
    rating: 4.5, reviewCount: 298, openHours: 'Mon–Fri 7:00–21:00, Sat–Sun 8:00–21:00',
    about: {
      ...baseAbout,
      accessibility: ['Wheelchair-accessible entrance', 'Wheelchair-accessible seating'],
      serviceOptions: ['Dine-in', 'Takeaway', 'Delivery'],
      highlights: ['Great coffee', 'Great tea selection'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Beer', 'Wine', 'Alcohol', 'Vegan options', 'Vegetarian options'],
      diningOptions: ['Seating', 'Table service'],
      amenities: ['Bar on site', 'Toilet', 'Wi-Fi', 'Free Wi-Fi'],
      atmosphere: ['Casual', 'Trendy'],
      crowd: ['LGBTQ+ friendly', 'University students', 'Tourists'],
      planning: ['Accepts reservations'],
      payments: ['Credit cards', 'Debit cards', 'NFC mobile payments'],
      parking: ['Difficult to find a space'],
    },
  },
  {
    id: 'c16', name: 'Kettenbrücke Brew', address: 'Kettenbrückengasse 4, 1040 Vienna',
    lat: 48.1960, lng: 16.3600, tags: ['Specialty', 'Cozy'],
    rating: 4.7, reviewCount: 345, openHours: 'Mon–Fri 7:00–18:00',
    about: {
      ...baseAbout,
      highlights: ['Great coffee', 'Great dessert'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Organic dishes', 'Vegan options', 'Vegetarian options'],
      diningOptions: ['Dessert', 'Seating'],
      atmosphere: ['Casual', 'Cosy', 'Trendy'],
      crowd: ['University students'],
      parking: ['Difficult to find a space'],
    },
  },
  {
    id: 'c17', name: 'Margareten Filter', address: 'Margaretenstraße 58, 1050 Vienna',
    lat: 48.1875, lng: 16.3520, tags: ['Specialty', 'Dog-friendly'],
    rating: 4.6, reviewCount: 223, openHours: 'Mon–Sat 8:00–18:00',
    about: {
      ...baseAbout,
      serviceOptions: ['Outdoor seating', 'Dine-in', 'Takeaway'],
      highlights: ['Great coffee', 'Great tea selection'],
      popularFor: ['Good for working on laptop', 'Solo dining'],
      offerings: ['Coffee', 'Vegan options', 'Vegetarian options', 'Small plates'],
      diningOptions: ['Seating', 'Table service'],
      atmosphere: ['Casual', 'Cosy'],
      crowd: ['University students', 'LGBTQ+ friendly'],
      pets: ['Dogs allowed'],
    },
  },
  {
    id: 'c18', name: 'Reinprecht Roast', address: 'Reinprechtsdorfer Straße 16, 1050 Vienna',
    lat: 48.1915, lng: 16.3480, tags: ['Cozy', 'Quiet work spot'],
    rating: 4.4, reviewCount: 156, openHours: 'Mon–Fri 8:00–17:00',
    about: {
      ...baseAbout,
      highlights: ['Great coffee', 'Great dessert'],
      popularFor: ['Good for working on laptop'],
      offerings: ['Coffee', 'Organic dishes', 'Vegan options'],
      diningOptions: ['Seating'],
      atmosphere: ['Casual', 'Cosy'],
      crowd: ['University students'],
    },
  },
]
