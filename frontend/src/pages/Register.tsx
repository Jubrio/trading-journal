import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const form = new FormData(e.currentTarget)

    try {
      const { data } = await api.post('/register', {
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
      })
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('trading_account_id', String(data.trading_account_id))
      navigate('/')
    } catch (err: any) {
      const message = err?.response?.data?.errors?.email?.[0]
      setError(message ?? 'Impossible de créer le compte.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-line bg-white p-6 sm:p-8">
        <p className="mb-6 font-mono text-sm text-ink">
          My<span className="text-accent">Trade</span>Journal
        </p>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Nom
            <input type="text" name="name" required className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input type="email" name="email" required className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Mot de passe
            <input type="password" name="password" required minLength={8} className="input" />
          </label>
          {error && <p className="text-sm text-loss">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Création…' : 'Créer mon compte'}
          </button>
          <p className="text-center text-sm text-ink/60">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
