import { Navigate, Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import MobileNav from './components/layout/MobileNav'
import Dashboard from './pages/Dashboard'
import NewAnalysis from './pages/NewAnalysis'
import Analyses from './pages/Analyses'
import AnalysisDetail from './pages/AnalysisDetail'
import Login from './pages/Login'
import Register from './pages/Register'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token')
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 pb-24 sm:px-8 sm:py-6 md:pb-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analyses" element={<Analyses />} />
                    <Route path="/analyses/new" element={<NewAnalysis />} />
                    <Route path="/analyses/:id" element={<AnalysisDetail />} />
                  </Routes>
                </main>
              </div>
              <MobileNav />
            </div>
          </RequireAuth>
        }
      />
    </Routes>
  )
}
