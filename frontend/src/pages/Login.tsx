import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const form = new FormData(e.currentTarget)

    try {
      const { data } = await api.post('/login', {
        email: form.get('email'),
        password: form.get('password'),
      })
      localStorage.setItem('auth_token', data.token)
      navigate('/')
    } catch {
      setError('Identifiants incorrects.')
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
            Email
            <input type="email" name="email" required className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Mot de passe
            <input type="password" name="password" required className="input" />
          </label>
          {error && <p className="text-sm text-loss">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </div>
      </form>
    </div>
  )
}
