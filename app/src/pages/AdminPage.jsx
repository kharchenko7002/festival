import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken, clearToken } from '../utils/apiClient.js'
import AdminLogin from '../admin/AdminLogin.jsx'
import ProgramEditor from '../admin/ProgramEditor.jsx'
import RegistrationsList from '../admin/RegistrationsList.jsx'

const TABS = [
  { id: 'program', label: 'Programredigering' },
  { id: 'pamelding', label: 'Påmeldinger' },
]

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getToken()))
  const [activeTab, setActiveTab] = useState('program')

  const handleLogin = () => setLoggedIn(true)

  const handleLogout = () => {
    clearToken()
    setLoggedIn(false)
    setActiveTab('program')
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
            Administrer rom, tidspunkt, ledige plasser og påmeldinger.
          </p>
        </div>

        {loggedIn ? (
          <>
            {/* Tab navigation */}
            <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1 sm:w-fit">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-white text-navy-900 shadow-sm'
                      : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'program' && <ProgramEditor onLogout={handleLogout} />}
            {activeTab === 'pamelding' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <RegistrationsList onLogout={handleLogout} />
              </div>
            )}
          </>
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
      </main>
    </div>
  )
}

export default AdminPage
