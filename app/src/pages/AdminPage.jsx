import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken, clearToken } from '../utils/apiClient.js'
import AdminLogin from '../admin/AdminLogin.jsx'
import ProgramEditor from '../admin/ProgramEditor.jsx'

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getToken()))

  const handleLogin = () => setLoggedIn(true)

  const handleLogout = () => {
    clearToken()
    setLoggedIn(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xl font-extrabold tracking-tight text-navy-900">
              2INF&nbsp;<span className="text-brand-600">Festival</span>
            </p>
            <p className="text-xs text-slate-500">Festivalsjefpanel</p>
          </div>
          <Link to="/" className="btn-ghost !py-2 !text-sm">
            ← Tilbake til forsiden
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy-900">Festivalsjefpanel</h1>
          <p className="mt-1 text-slate-600">
            Administrer rom, tidspunkt og ledige plasser for foredrag.
          </p>
        </div>

        {loggedIn ? (
          <ProgramEditor onLogout={handleLogout} />
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
      </main>
    </div>
  )
}

export default AdminPage
