import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, KeyRound, Trash2 } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import PageHeader from '../components/PageHeader'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import StatusDot from '../components/StatusDot'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { DEPARTMENTS, ROLE_LABELS } from '../lib/constants'

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: user?.username || '', department: user?.department || DEPARTMENTS[0] })
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' })
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })
  const [savingPw, setSavingPw] = useState(false)

  const [deleting, setDeleting] = useState(false)

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileMsg({ type: '', text: '' })
    setSavingProfile(true)
    try {
      const res = await api.put('/user/profile', form)
      setUser(res.data.updatedUser)
      setProfileMsg({ type: 'success', text: 'Profile updated.' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: err?.response?.data?.errors?.join(', ') || err?.response?.data?.message || 'Update failed.' })
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setPwMsg({ type: '', text: '' })
    setSavingPw(true)
    try {
      await api.put('/user/change-password', pwForm)
      setPwMsg({ type: 'success', text: 'Password changed successfully.' })
      setPwForm({ oldPassword: '', newPassword: '' })
    } catch (err) {
      setPwMsg({ type: 'error', text: err?.response?.data?.errors?.join(', ') || err?.response?.data?.message || 'Password change failed.' })
    } finally {
      setSavingPw(false)
    }
  }

  const deleteAccount = async () => {
    if (!confirm('Permanently delete your account? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.delete('/user/profile')
      await logout()
      navigate('/login')
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed.')
      setDeleting(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader eyebrow="ACCOUNT" title="My profile" description="Manage your identity and access on the plant console." />

      <div className="px-8 py-6 max-w-lg space-y-8">
        <div className="rounded-lg border border-graphite-700 bg-graphite-900/60 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-graphite-700 flex items-center justify-center text-lg font-display font-semibold text-graphite-100">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-graphite-100">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <StatusDot color={user?.role === 'admin' ? 'amber' : 'teal'} live />
              <p className="text-[11px] font-mono text-graphite-400">
                {ROLE_LABELS[user?.role] || user?.role} · {user?.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
              </p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="font-display text-sm text-graphite-100 mb-1">Profile details</h2>
          <p className="text-xs text-graphite-500 mb-4">Update your display name and department.</p>
          <Alert type={profileMsg.type}>{profileMsg.text}</Alert>
          <form onSubmit={saveProfile}>
            <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} minLength={3} required />
            <Select label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
            <Button type="submit" variant="secondary" loading={savingProfile}>
              <Save size={14} />
              Save changes
            </Button>
          </form>
        </section>

        <section className="pt-2 border-t border-graphite-800">
          <h2 className="font-display text-sm text-graphite-100 mb-1 mt-6">Change password</h2>
          <p className="text-xs text-graphite-500 mb-4">You'll keep using your current session after this.</p>
          <Alert type={pwMsg.type}>{pwMsg.text}</Alert>
          <form onSubmit={changePassword}>
            <Input
              label="Current password"
              type="password"
              value={pwForm.oldPassword}
              onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })}
              required
            />
            <Input
              label="New password"
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              minLength={6}
              required
            />
            <Button type="submit" variant="secondary" loading={savingPw}>
              <KeyRound size={14} />
              Update password
            </Button>
          </form>
        </section>

        <section className="pt-6 border-t border-graphite-800">
          <h2 className="font-display text-sm text-graphite-100 mb-1">Danger zone</h2>
          <p className="text-xs text-graphite-500 mb-4">Permanently delete your account and revoke access.</p>
          <Button variant="danger" onClick={deleteAccount} loading={deleting}>
            <Trash2 size={14} />
            Delete my account
          </Button>
        </section>
      </div>
    </AppLayout>
  )
}
