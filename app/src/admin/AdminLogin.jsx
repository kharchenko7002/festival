import { useState } from 'react'
import { apiLogin, setToken } from '../utils/apiClient.js'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200'
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700'

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token } = await apiLogin(username.trim(), password)
      setToken(token)
      onLogin()
    } catch (err) {
      setError(
        err.status === 401
          ? 'Feil brukernavn eller passord.'
          : 'Serveren svarer ikke akkurat nå.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-navy-900">Logg inn som festivalsjef</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-brukernavn" className={labelClass}>
              Brukernavn
            </label>
            <input
              id="admin-brukernavn"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="admin-passord" className={labelClass}>
              Passord
            </label>
            <input
              id="admin-passord"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="btn-blue w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Logger inn …' : 'Logg inn'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
