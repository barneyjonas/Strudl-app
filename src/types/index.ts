export interface StampHistory {
  id: string
  cafe: string
  city: string
  country: string
  timeAgo: string
  date: string
}

export interface FavoriteCafe {
  id: string
  name: string
  visits: number
  label: string
  city: string
  country: string
}

export interface NearbyCafe {
  id: string
  name: string
  distance: string
  city: string
  country: string
  joined: boolean
}

export interface SavedCafe {
  id: string
  name: string
  lat: number
  lng: number
  city: string
  country: string
}

export interface RewardRecord {
  id: string
  redeemedAt: string
  cafe: string
  code: string
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  notifyPush: boolean
  notifyLapsed: boolean
}

export interface AppState {
  onboarded: boolean
  user: UserProfile
  stamps: number
  lifetimeStamps: number
  lifetimeRewards: number
  stampHistory: StampHistory[]
  favoriteCafes: FavoriteCafe[]
  nearbyCafes: NearbyCafe[]
  savedCafes: SavedCafe[]
  pastRewards: RewardRecord[]
}
