import { useState } from 'react'
import type { FormEvent } from 'react'

type LoginProps = {
  onSuccess: () => void
}

type LoginErrors = {
  email?: string
  password?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (): LoginErrors => {
    const nextErrors: LoginErrors = {}

    if (!email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.'
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    return nextErrors
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitted(true)

    if (Object.keys(nextErrors).length === 0) {
      window.setTimeout(() => onSuccess(), 250)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to your account</h1>
          <p className="login-subtitle">Use any valid email and a password with at least 8 characters.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field" htmlFor="email">
            <span className="field-label">Email</span>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={errors.email ? 'input invalid' : 'input'}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email && <p id="email-error" className="input-error">{errors.email}</p>}
          </label>

          <label className="form-field" htmlFor="password">
            <span className="field-label">Password</span>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className={errors.password ? 'input invalid' : 'input'}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              autoComplete="current-password"
            />
            {errors.password && <p id="password-error" className="input-error">{errors.password}</p>}
          </label>

          <button type="submit" className="login-button">
            {submitted && Object.keys(errors).length === 0 ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
