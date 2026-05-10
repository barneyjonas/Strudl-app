export interface CafePin {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  tags: string[]
}

export const VIENNA_CAFES: CafePin[] = [
  { id: 'c1',  name: 'Café Neubau',        address: 'Neubaugasse 18, 1070 Vienna',                lat: 48.2065, lng: 16.3310, tags: ['Third Wave', 'Specialty'] },
  { id: 'c2',  name: 'Bean & Benefit',      address: 'Hernalser Gürtel 6, 1170 Vienna',            lat: 48.2215, lng: 16.3340, tags: ['Popular', 'Open late'] },
  { id: 'c3',  name: 'The Daily Grind',     address: 'Hietzinger Hauptstraße 20, 1130 Vienna',     lat: 48.1870, lng: 16.3150, tags: ['Cozy', 'Garden'] },
  { id: 'c4',  name: 'Cup Circle',          address: 'Favoritenstraße 28, 1100 Vienna',            lat: 48.1870, lng: 16.3670, tags: ['Cross-city favourite', 'Fast scan'] },
  { id: 'c5',  name: 'East Side Drip',      address: 'Simmeringer Hauptstraße 30, 1110 Vienna',    lat: 48.1800, lng: 16.4200, tags: ['Brunch', 'Dog-friendly'] },
  { id: 'c6',  name: 'Grounded Vienna',     address: 'Gentzgasse 8, 1180 Vienna',                  lat: 48.2355, lng: 16.3420, tags: ['Specialty', 'Quiet work spot'] },
  { id: 'c7',  name: 'Slow Drip',           address: 'Floridsdorfer Hauptstraße 6, 1210 Vienna',   lat: 48.2580, lng: 16.4050, tags: ['Third Wave', 'Large space'] },
  { id: 'c8',  name: 'Dark Matter Coffee',  address: 'Wagramer Straße 10, 1220 Vienna',            lat: 48.2240, lng: 16.4480, tags: ['Late night', 'Open late'] },
  { id: 'c9',  name: 'Taborstraße Coffee',  address: 'Taborstraße 22, 1020 Vienna',                lat: 48.2148, lng: 16.3920, tags: ['Popular', 'Fast scan'] },
  { id: 'c10', name: 'Prater Brew',         address: 'Praterstraße 46, 1020 Vienna',               lat: 48.2195, lng: 16.4005, tags: ['Third Wave', 'Brunch'] },
  { id: 'c11', name: 'Landstraße Roast',    address: 'Landstraßer Hauptstraße 24, 1030 Vienna',    lat: 48.1995, lng: 16.3885, tags: ['Specialty', 'Open late'] },
  { id: 'c12', name: 'Rasumofsky Espresso', address: 'Rasumofskygasse 8, 1030 Vienna',             lat: 48.2030, lng: 16.3960, tags: ['Cozy', 'Quiet work spot'] },
  { id: 'c13', name: 'Roast Republic',      address: 'Brigittaplatz 4, 1200 Vienna',               lat: 48.2390, lng: 16.3750, tags: ['Brunch', 'Third Wave'] },
  { id: 'c14', name: 'Wallenstein Kaffee',  address: 'Wallensteinstraße 28, 1200 Vienna',          lat: 48.2340, lng: 16.3700, tags: ['Dog-friendly', 'Large space'] },
  { id: 'c15', name: 'Wieden Coffee',       address: 'Wiedner Hauptstraße 32, 1040 Vienna',        lat: 48.1940, lng: 16.3670, tags: ['Popular', 'Open late'] },
  { id: 'c16', name: 'Kettenbrücke Brew',   address: 'Kettenbrückengasse 4, 1040 Vienna',          lat: 48.1960, lng: 16.3600, tags: ['Specialty', 'Cozy'] },
  { id: 'c17', name: 'Margareten Filter',   address: 'Margaretenstraße 58, 1050 Vienna',           lat: 48.1875, lng: 16.3520, tags: ['Specialty', 'Dog-friendly'] },
  { id: 'c18', name: 'Reinprecht Roast',    address: 'Reinprechtsdorfer Straße 16, 1050 Vienna',   lat: 48.1915, lng: 16.3480, tags: ['Cozy', 'Quiet work spot'] },
]
