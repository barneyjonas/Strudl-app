# Strudl

A cross-café digital loyalty app for independent cafés.

---

## What It Is

Strudl gives independent cafés a simple shared loyalty system — no expensive hardware, no building their own app. Customers collect stamps across any participating café using one digital loyalty card.

**Core MVP:**
- Digital loyalty card for customers
- Works across multiple independent cafés
- Cross-café reward logic

---

## Status

Early MVP — in active development. Applying to AWS First Incubator 2026.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + TypeScript | UI and logic |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router DOM | Navigation |
| Leaflet | Map functionality |
| vite-plugin-pwa | Progressive Web App |

---

## Project Structure

```
src/
  screens/       # Page-level components (Home, Scan, Rewards, Discover, Profile, Onboarding, SharedView)
  components/    # Reusable UI components including BottomNav
  data/          # Static data files
  store/         # App state (useAppState hook)
  types/         # TypeScript type definitions
public/          # Static assets
```

---

## Screens

| Screen | Description |
|---|---|
| Onboarding | First-time user setup flow |
| Home | Main dashboard |
| Scan | Scan a café's QR code to collect a stamp |
| Rewards | View and redeem rewards |
| Discover | Browse participating cafés |
| Profile | User profile and settings |
| SharedView | Shareable card view (`/shared/v1`) |

---

## Getting Started

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

---

## Key Files

| File | Purpose |
|---|---|
| `src/App.tsx` | Root component — routing and onboarding logic |
| `src/store/` | Global app state via `useAppState` hook |
| `src/screens/` | All main screens |
| `vite.config.ts` | Vite and PWA configuration |
| `tailwind.config.js` | Tailwind setup |

---

## Current Known Issues

- No backend yet — data is local/static
- PWA features require a production build to test fully

---

## Not in MVP

- Café admin / dashboard interface
- POS system integration
- Donation or social-impact features
- Booking or payment
- User authentication

---

## Next Steps

- Connect to a backend / database
- Build café-facing admin interface
- Pilot with independent cafés in [city]
- Submit to AWS First Incubator 2026
