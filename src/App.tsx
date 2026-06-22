import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAppState } from './store/appStore'
import BottomNav from './components/BottomNav'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Scan from './screens/Scan'
import Rewards from './screens/Rewards'
import Discover from './screens/Discover'
import Profile from './screens/Profile'
import SharedView from './screens/SharedView'

export default function App() {
  const [state] = useAppState()
  const location = useLocation()

  if (location.pathname === '/shared/v1') {
    return <SharedView />
  }

  if (!state.onboarded) {
    return <Onboarding />
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
