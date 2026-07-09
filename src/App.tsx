import { Routes, Route, Outlet } from 'react-router-dom'
import ViewSwitcher from './components/ViewSwitcher'

import EntryPage from './pages/EntryPage'

// 老人端页面
import ElderHomePage from './pages/elder/HomePage'
import MedicineScanPage from './pages/elder/MedicineScanPage'
import MedicinePlanPage from './pages/elder/MedicinePlanPage'
import CompanionChatPage from './pages/elder/CompanionChatPage'
import TaxiPage from './pages/elder/TaxiPage'
import WeatherPage from './pages/elder/WeatherPage'
import SosPage from './pages/elder/SosPage'

// 子女端页面
import FamilyHomePage from './pages/family/HomePage'
import MedicineDashboardPage from './pages/family/MedicineDashboardPage'
import SafetyPage from './pages/family/SafetyPage'
import MoodPage from './pages/family/MoodPage'
import ReportPage from './pages/family/ReportPage'

/** 老人端布局:壳 + 视角切换 */
function ElderLayout() {
  return (
    <div className="app-shell">
      <ViewSwitcher />
      <Outlet />
    </div>
  )
}

/** 子女端布局:壳 + 视角切换 */
function FamilyLayout() {
  return (
    <div className="family-shell">
      <ViewSwitcher />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPage />} />

      {/* 老人端 */}
      <Route path="/elder" element={<ElderLayout />}>
        <Route index element={<ElderHomePage />} />
        <Route path="medicine/scan" element={<MedicineScanPage />} />
        <Route path="medicine/plan" element={<MedicinePlanPage />} />
        <Route path="companion/chat" element={<CompanionChatPage />} />
        <Route path="life/taxi" element={<TaxiPage />} />
        <Route path="life/weather" element={<WeatherPage />} />
        <Route path="sos" element={<SosPage />} />
      </Route>

      {/* 子女端 */}
      <Route path="/family" element={<FamilyLayout />}>
        <Route index element={<FamilyHomePage />} />
        <Route path="medicine" element={<MedicineDashboardPage />} />
        <Route path="safety" element={<SafetyPage />} />
        <Route path="mood" element={<MoodPage />} />
        <Route path="report" element={<ReportPage />} />
      </Route>

      {/* 兜底 */}
      <Route path="*" element={<EntryPage />} />
    </Routes>
  )
}
