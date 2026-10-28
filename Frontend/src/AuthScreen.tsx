
import { useState, type FormEvent } from 'react'
import { login, signup, type AuthUser } from './api/auth'
import './AuthScreen.css'

type Props = {
  onAuthenticated: (user: AuthUser, token: string) => void
}

export default function AuthScreen({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result =
        mode === 'signup'
          ? await signup({ username, email, password, displayName })
          : await login({ email, password })

      onAuthenticated(result.user, result.token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand" aria-label="ATOMOU branding">
        <div className="brand-chat-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <h2 className="brand-wordmark">
          AT<span>O</span>MOU
        </h2>

        <p className="brand-tagline">Chat. Connect. Stay Close.</p>
      </section>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">
          {mode === 'login' ? (
            <>Welcome <span>Back</span></>
          ) : (
            <>Join <span>ATOMOU</span></>
          )}
        </h1>

        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to your ATOMOU account'
            : 'Create your account and connect with friends'}
        </p>

        {mode === 'signup' && (
          <>
            <label className="auth-field">
              Display name
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={50}
                required
                placeholder="Enter your name"
                autoComplete="name"
              />
            </label>

            <label className="auth-field">
              Username
              <input
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value.toLowerCase())
                }
                minLength={3}
                maxLength={30}
                pattern="[a-z0-9_]+"
                required
                placeholder="Choose a username"
                autoComplete="username"
              />
            </label>
          </>
        )}

        <label className="auth-field">
          Email
          <span className="auth-input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </span>
        </label>

        <label className="auth-field">
          Password
          <span className="auth-input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              <path d="M12 14v3" />
            </svg>

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              maxLength={72}
              required
              placeholder="Enter your password"
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
            />

            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3 21 21" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 5 9 7-.2.8-1.2 2.5-2.8 3.9" />
                  <path d="M6.2 6.2C3.9 7.7 2.3 10.3 2 12c.5 2 4 7 10 7a10 10 0 0 0 3-.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </span>
        </label>

        {error && (
          <div className="auth-error" role="alert">
            <span className="error-symbol">!</span>
            <span>{error}</span>
            <button
              type="button"
              className="error-close"
              aria-label="Dismiss error"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        )}

        <button className="auth-submit" disabled={loading} type="submit">
          {loading
            ? 'Please wait...'
            : mode === 'login'
              ? 'Login'
              : 'Create Account'}
        </button>

        <div className="auth-divider">
          <span />
          <strong>OR</strong>
          <span />
        </div>

        <p className="auth-switch">
          {mode === 'login'
            ? 'Don’t have an account?'
            : 'Already have an account?'}
          <button
            type="button"
            onClick={() => {
              setMode((value) => value === 'login' ? 'signup' : 'login')
              setError('')
              setShowPassword(false)
            }}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </main>
  )
}
