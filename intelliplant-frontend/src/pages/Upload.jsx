import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import PageHeader from '../components/PageHeader'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import api from '../lib/api'
import { DEPARTMENTS } from '../lib/constants'

export default function Upload() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('HR')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const pickFile = (f) => {
    if (!f) return
    setFile(f)
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''))
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!file) {
      setError('Select a PDF to upload.')
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('department', department)

    setLoading(true)
    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSuccess('Document uploaded. It is being indexed for AI search in the background.')
      setFile(null)
      setTitle('')
      setTimeout(() => navigate('/'), 1600)
    } catch (err) {
      setError(err?.response?.data?.errors?.join(', ') || err?.response?.data?.message || 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader
        eyebrow="ADMIN · DOCUMENT INTAKE"
        title="Upload a document"
        description="PDF files are extracted, chunked and embedded automatically so employees can ask questions about them."
      />

      <div className="px-8 py-6 max-w-xl">
        <Alert type="error">{error}</Alert>
        <Alert type="success">{success}</Alert>

        <form onSubmit={onSubmit}>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`mb-5 rounded-lg border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
              dragging ? 'border-amber-signal bg-amber-signal/5' : 'border-graphite-700 hover:border-graphite-500'
            }`}
            style={dragging ? { borderColor: 'var(--color-amber-signal)', backgroundColor: 'rgba(245,165,36,0.05)' } : {}}
          >
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText size={20} className="text-graphite-300" />
                <div className="text-left">
                  <p className="text-sm text-graphite-100">{file.name}</p>
                  <p className="text-[11px] font-mono text-graphite-500">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null) }}
                  className="text-graphite-500 hover:text-red-signal ml-2"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud size={22} className="mx-auto mb-3 text-graphite-500" />
                <p className="text-sm text-graphite-300">Drop a PDF here, or click to browse</p>
                <p className="text-[11px] font-mono text-graphite-600 mt-1">PDF ONLY · AI INDEXING SUPPORTED</p>
              </>
            )}
          </div>

          <Input
            label="Document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Machine A Safety Manual"
            required
          />
          <Select label="Department" value={department} onChange={(e) => setDepartment(e.target.value)}>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>

          <Button type="submit" className="w-full mt-2" loading={loading}>
            <CheckCircle2 size={15} />
            Upload document
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}
