import { useState, useEffect } from 'react'
import type { AppState } from '../types'

const STORAGE_KEY = 'strudl_app_state'
const STATE_CHANGE_EVENT = 'strudl_state_change'

const DEFAULT: AppState = {
  onboarded: false,
  user: {
    name: 'Alex',
    email: 'alex@example.com',
    phone: '+43 650 123 4567',
    notifyPush: true,
    notifyLapsed: false,
  },
  stamps: 8,
  lifetimeStamps: 44,
  lifetimeRewards: 4,
  stampHistory: [
    { id: '1', cafe: 'The Corner Brew', city: 'Vienna', country: 'AUT', timeAgo: 'Yesterday', date: '2026-04-25' },
    { id: '2', cafe: 'The Corner Brew', city: 'Vienna', country: 'AUT', timeAgo: '3 days ago', date: '2026-04-23' },
    { id: '3', cafe: 'Café Zentral', city: 'Graz', country: 'AUT', timeAgo: '5 days ago', date: '2026-04-21' },
    { id: '4', cafe: 'Kaffee Alt', city: 'Salzburg', country: 'AUT', timeAgo: '1 week ago', date: '2026-04-19' },
    { id: '5', cafe: 'The Corner Brew', city: 'Vienna', country: 'AUT', timeAgo: '1 week ago', date: '2026-04-18' },
    { id: '6', cafe: 'Café Zentral', city: 'Graz', country: 'AUT', timeAgo: '2 weeks ago', date: '2026-04-12' },
    { id: '7', cafe: 'Kaffee Alt', city: 'Salzburg', country: 'AUT', timeAgo: '2 weeks ago', date: '2026-04-11' },
    { id: '8', cafe: 'The Corner Brew', city: 'Vienna', country: 'AUT', timeAgo: '3 weeks ago', date: '2026-04-05' },
  ],
  favoriteCafes: [
    { id: 'fav1', name: 'The Corner Brew',    visits: 4, label: 'Your home café ☕', city: 'Vienna',   country: 'AUT' },
    { id: 'c9',   name: 'Taborstraße Coffee', visits: 2, label: '',                  city: 'Vienna',   country: 'AUT' },
    { id: 'c10',  name: 'Prater Brew',        visits: 1, label: '',                  city: 'Vienna',   country: 'AUT' },
    { id: 'c11',  name: 'Landstraße Roast',   visits: 1, label: '',                  city: 'Vienna',   country: 'AUT' },
    { id: 'fav2', name: 'Café Zentral',       visits: 2, label: '',                  city: 'Graz',     country: 'AUT' },
    { id: 'fav3', name: 'Kaffee Bauer',       visits: 1, label: '',                  city: 'Graz',     country: 'AUT' },
    { id: 'fav4', name: 'Kaffee Alt',         visits: 2, label: '',                  city: 'Salzburg', country: 'AUT' },
  ],
  nearbyCafes: [
    { id: 'n1', name: 'Aida Café', distance: '0.4 km', city: 'Vienna', country: 'AUT', joined: false },
    { id: 'n2', name: 'Phil', distance: '0.8 km', city: 'Vienna', country: 'AUT', joined: false },
    { id: 'n3', name: 'Kleines Café', distance: '1.2 km', city: 'Vienna', country: 'AUT', joined: false },
    { id: 'n4', name: 'Café Sperl', distance: '1.5 km', city: 'Vienna', country: 'AUT', joined: false },
    { id: 'n5', name: 'Demel', distance: '2.1 km', city: 'Vienna', country: 'AUT', joined: false },
  ],
  savedCafes: [
    { id: 'c11', name: 'Landstraße Roast',    lat: 48.1995, lng: 16.3885, city: 'Vienna', country: 'AUT' },
    { id: 'c9',  name: 'Taborstraße Coffee',  lat: 48.2148, lng: 16.3920, city: 'Vienna', country: 'AUT' },
    { id: 'c15', name: 'Wieden Coffee',       lat: 48.1940, lng: 16.3670, city: 'Vienna', country: 'AUT' },
    { id: 'c12', name: 'Rasumofsky Espresso', lat: 48.2030, lng: 16.3960, city: 'Vienna', country: 'AUT' },
  ],
  pastRewards: [
    { id: 'r1', redeemedAt: '2026-03-10', cafe: 'The Corner Brew', code: 'STRDL-A1B2' },
    { id: 'r2', redeemedAt: '2026-02-14', cafe: 'Café Zentral', code: 'STRDL-C3D4' },
    { id: 'r3', redeemedAt: '2026-01-22', cafe: 'The Corner Brew', code: 'STRDL-E5F6' },
    { id: 'r4', redeemedAt: '2025-12-30', cafe: 'Kaffee Alt', code: 'STRDL-G7H8' },
  ],
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT }
    const parsed = JSON.parse(raw) as AppState
    if (!parsed.savedCafes) parsed.savedCafes = DEFAULT.savedCafes
    if (parsed.favoriteCafes.length < 4) parsed.favoriteCafes = DEFAULT.favoriteCafes
    return parsed
  } catch {
    return { ...DEFAULT }
  }
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

let _state: AppState = loadState()

export function getState(): AppState {
  return _state
}

export function setState(partial: Partial<AppState>): void {
  _state = { ..._state, ...partial }
  saveState(_state)
  window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT))
}

export function useAppState(): [AppState, (partial: Partial<AppState>) => void] {
  const [state, setLocalState] = useState<AppState>(() => loadState())

  useEffect(() => {
    const handler = () => {
      setLocalState({ ..._state })
    }
    window.addEventListener(STATE_CHANGE_EVENT, handler)
    return () => window.removeEventListener(STATE_CHANGE_EVENT, handler)
  }, [])

  return [state, setState]
}
