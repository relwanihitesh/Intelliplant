import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { useAuth } from '../context/AuthContext'

export default function VerifyEmail() {
  const { verifyEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: location.state?.email || '', code: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await verifyEmail(form)
      setSuccess('Email verified. Redirecting to sign in…')
      setTimeout(() => navigate('/login'), 1400)
    } catch (err) {
      setError(err?.response?.data?.message || 'Verification failed. Check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="VERIFICATION"
      title="Confirm your email"
      subtitle="Enter the 6-digit code we sent to your inbox."
    >
      <Alert type="error">{error}</Alert>
      <Alert type="success">{success}</Alert>
      <form onSubmit={onSubmit}>
        <Input
          label="Email address"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <Input
          label="Verification code"
          name="code"
          placeholder="482913"
          value={form.code}
          onChange={onChange}
          required
          maxLength={6}
          className="font-mono tracking-[0.3em] text-center"
        />
        <Button type="submit" className="w-full mt-2" loading={loading}>
          <ShieldCheck size={15} />
          Verify email
        </Button>
      </form>
      <p className="text-sm text-graphite-400 mt-6 text-center">
        Wrong account?{' '}
        <Link to="/login" className="text-graphite-100 underline underline-offset-4 decoration-graphite-600 hover:decoration-amber-signal">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
