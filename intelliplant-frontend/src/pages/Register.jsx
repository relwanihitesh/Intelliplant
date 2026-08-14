import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { useAuth } from '../context/AuthContext'
import { DEPARTMENTS } from '../lib/constants'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', department: 'IT' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/verify-email', { state: { email: form.email } })
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.join(', ') ||
        err?.response?.data?.message ||
        'Registration failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="NEW OPERATOR"
      title="Create your account"
      subtitle="You'll get access to your department's documents once verified."
    >
      <Alert type="error">{error}</Alert>
      <form onSubmit={onSubmit}>
        <Input
          label="Username"
          name="username"
          placeholder="j.doe"
          value={form.username}
          onChange={onChange}
          required
          minLength={3}
        />
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
          placeholder="At least 6 characters"
          value={form.password}
          onChange={onChange}
          required
          minLength={6}
        />
        <Select label="Department" name="department" value={form.department} onChange={onChange}>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
        <Button type="submit" className="w-full mt-2" loading={loading}>
          <UserPlus size={15} />
          Create account
        </Button>
      </form>
      <p className="text-sm text-graphite-400 mt-6 text-center">
        Already onboarded?{' '}
        <Link to="/login" className="text-graphite-100 underline underline-offset-4 decoration-graphite-600 hover:decoration-amber-signal">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
