import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      const dest = location.state?.from || '/'
      navigate(dest, { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0] || 'Unable to sign in. Check your credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="ACCESS TERMINAL"
      title="Sign in to your console"
      subtitle="Use the credentials issued for your department."
    >
      <Alert type="error">{error}</Alert>
      <form onSubmit={onSubmit}>
        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={onChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={onChange}
          required
        />
        <Button type="submit" className="w-full mt-2" loading={loading}>
          <LogIn size={15} />
          Sign in
        </Button>
      </form>
      <p className="text-sm text-graphite-400 mt-6 text-center">
        New to this plant?{' '}
        <Link to="/register" className="text-graphite-100 underline underline-offset-4 decoration-graphite-600 hover:decoration-amber-signal" style={{ '--tw-decoration-opacity': 1 }}>
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
