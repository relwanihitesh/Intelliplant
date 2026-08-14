import { useEffect, useState } from 'react'
import { Building2, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import api from '../lib/api'

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/department/all')
      setDepartments(res.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load departments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const createDepartment = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/department/create', form)
      setDepartments((d) => [...d, res.data])
      setForm({ name: '', description: '' })
      setShowForm(false)
    } catch (err) {
      setError(err?.response?.data?.errors?.join(', ') || err?.response?.data?.message || 'Could not create department.')
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (dept) => {
    setEditingId(dept._id)
    setEditForm({ name: dept.name, description: dept.description || '' })
  }

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/department/update/${id}`, editForm)
      setDepartments((ds) => ds.map((d) => (d._id === id ? res.data.updatedDepartment : d)))
      setEditingId(null)
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed.')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this department?')) return
    try {
      await api.delete(`/department/delete/${id}`)
      setDepartments((ds) => ds.filter((d) => d._id !== id))
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <AppLayout>
      <PageHeader
        eyebrow="ADMIN · ORGANIZATION"
        title="Departments"
        description="Departments control who can see which documents across the plant."
        action={
          <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'secondary' : 'primary'}>
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? 'Cancel' : 'New department'}
          </Button>
        }
      />

      <div className="px-8 py-6 max-w-2xl">
        <Alert type="error">{error}</Alert>

        {showForm && (
          <form onSubmit={createDepartment} className="mb-6 rounded-lg border border-graphite-700 bg-graphite-900/60 p-5 animate-fade-up">
            <Input
              label="Department name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Quality"
              required
              minLength={2}
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What this department is responsible for"
              required
              minLength={5}
            />
            <Button type="submit" loading={submitting}>
              <Plus size={14} />
              Create department
            </Button>
          </form>
        )}

        {loading ? (
          <div className="py-16 flex justify-center"><Loader label="Loading departments" /></div>
        ) : departments.length === 0 ? (
          <EmptyState icon={Building2} title="No departments yet" description="Create your first department to start organizing documents." />
        ) : (
          <div className="space-y-2">
            {departments.map((dept) => (
              <div key={dept._id} className="rounded-lg border border-graphite-700 bg-graphite-900/60 p-4">
                {editingId === dept._id ? (
                  <div className="space-y-2">
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-graphite-900 border border-graphite-600 rounded px-2.5 py-1.5 text-sm text-graphite-50 outline-none focus:border-amber-signal"
                    />
                    <input
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-graphite-900 border border-graphite-600 rounded px-2.5 py-1.5 text-sm text-graphite-50 outline-none focus:border-amber-signal"
                    />
                    <div className="flex gap-2 pt-1">
                      <Button variant="primary" onClick={() => saveEdit(dept._id)} className="!py-1.5 !px-3 text-xs">
                        <Check size={12} /> Save
                      </Button>
                      <Button variant="ghost" onClick={() => setEditingId(null)} className="!py-1.5 !px-3 text-xs">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-md bg-graphite-800 border border-graphite-700 flex items-center justify-center shrink-0">
                        <Building2 size={15} className="text-graphite-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-graphite-100">{dept.name}</p>
                        <p className="text-xs text-graphite-400 mt-0.5">{dept.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => startEdit(dept)} className="p-2 text-graphite-500 hover:text-graphite-100 hover:bg-graphite-800 rounded transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => remove(dept._id)} className="p-2 text-graphite-500 hover:text-red-signal hover:bg-graphite-800 rounded transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
