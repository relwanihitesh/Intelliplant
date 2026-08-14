import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Sparkles, FileText, Trash2, ExternalLink, UploadCloud, X } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import Button from '../components/ui/Button'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

function DeptBadge({ department }) {
  if (!department) return null
  return (
    <span className="inline-flex items-center rounded border border-graphite-600 bg-graphite-800 px-1.5 py-0.5 text-[10px] font-mono text-graphite-300 tracking-wide">
      {department.toUpperCase()}
    </span>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('browse') // browse | basic | semantic
  const [searching, setSearching] = useState(false)
  const [semanticResults, setSemanticResults] = useState(null)

  const [deletingId, setDeletingId] = useState(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await api.get('/documents/all')
      setDocuments(res.data.documents || [])
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Could not load documents.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const runBasicSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) {
      setMode('browse')
      return
    }
    setSearching(true)
    setMode('basic')
    setErrorMsg('')
    try {
      const res = await api.get('/search/documents', { params: { keyword: query } })
      setDocuments(res.data.documents || [])
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Search failed.')
    } finally {
      setSearching(false)
    }
  }

  const runSemanticSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    setMode('semantic')
    setErrorMsg('')
    try {
      const res = await api.get('/search/semantic', { params: { q: query } })
      setSemanticResults(res.data.results || [])
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Semantic search failed.')
      setSemanticResults([])
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setMode('browse')
    setSemanticResults(null)
    loadAll()
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this document and its indexed knowledge? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/documents/${id}`)
      setDocuments((docs) => docs.filter((d) => d._id !== id))
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed.')
    } finally {
      setDeletingId(null)
    }
  }

  const showingSemantic = mode === 'semantic'

  return (
    <AppLayout>
      <PageHeader
        eyebrow="DOCUMENT LIBRARY"
        title="Indexed documents"
        description={isAdmin ? 'Every document uploaded across all departments.' : `Documents indexed for ${user?.department || 'your department'}.`}
        action={
          isAdmin && (
            <Link to="/upload">
              <Button variant="primary">
                <UploadCloud size={15} />
                Upload
              </Button>
            </Link>
          )
        }
      />

      <div className="px-8 py-6">
        <form onSubmit={runBasicSearch} className="flex items-center gap-2 mb-6">
          <div className="relative flex-1 max-w-xl">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, or ask a concept…"
              className="w-full bg-graphite-900 border border-graphite-600 rounded-md pl-9 pr-9 py-2.5 text-sm text-graphite-50 placeholder-graphite-500 outline-none focus:border-amber-signal focus:ring-1 focus:ring-amber-signal/40"
            />
            {query && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-500 hover:text-graphite-200">
                <X size={14} />
              </button>
            )}
          </div>
          <Button type="submit" variant="secondary" loading={searching && mode === 'basic'}>
            Search
          </Button>
          <Button type="button" variant="ghost" onClick={runSemanticSearch} loading={searching && mode === 'semantic'}>
            <Sparkles size={14} style={{ color: 'var(--color-teal-signal)' }} />
            Ask by meaning
          </Button>
        </form>

        {errorMsg && (
          <div className="mb-4 text-sm rounded-md border px-3 py-2" style={{ borderColor: 'rgba(229,72,77,0.35)', backgroundColor: 'rgba(229,72,77,0.08)', color: '#f5a3a5' }}>
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="py-16 flex justify-center"><Loader label="Reading index" /></div>
        ) : showingSemantic ? (
          semanticResults && semanticResults.length > 0 ? (
            <div className="space-y-3">
              <p className="text-[11px] font-mono text-graphite-500 tracking-wide">{semanticResults.length} MATCHING PASSAGE{semanticResults.length !== 1 ? 'S' : ''}</p>
              {semanticResults.map((r, i) => (
                <div key={i} className="rounded-lg border border-graphite-700 bg-graphite-900/60 p-4 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-graphite-400" />
                      <span className="text-sm text-graphite-100 font-medium">{r.title}</span>
                      <DeptBadge department={r.department} />
                    </div>
                    <span className="text-[10px] font-mono text-graphite-500">
                      MATCH {Math.round((r.similarityScore || 0) * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-graphite-400 leading-relaxed">{r.textSnippet}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Sparkles} title="No conceptual matches" description="Try rephrasing, or switch to a keyword search." />
          )
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={mode === 'basic' ? 'No documents match that keyword' : 'No documents yet'}
            description={mode === 'basic' ? 'Try a different term, or ask by meaning instead.' : 'Once documents are uploaded for your department, they will appear here.'}
            action={isAdmin && mode !== 'basic' ? <Link to="/upload"><Button variant="secondary"><UploadCloud size={14} />Upload the first one</Button></Link> : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc, i) => (
              <div
                key={doc._id}
                className="group rounded-lg border border-graphite-700 bg-graphite-900/60 p-4 hover:border-graphite-500 transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-md bg-graphite-800 border border-graphite-700 flex items-center justify-center">
                    <FileText size={16} className="text-graphite-400" />
                  </div>
                  <DeptBadge department={doc.department} />
                </div>
                <p className="text-sm font-medium text-graphite-100 mb-1 line-clamp-2">{doc.title}</p>
                <p className="text-[11px] font-mono text-graphite-500 mb-4 truncate">{doc.filename}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-graphite-800">
                  <a
                    href={doc.filepath}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs text-graphite-300 hover:text-graphite-50 border border-graphite-700 hover:border-graphite-500 rounded px-2.5 py-1.5 transition-colors"
                  >
                    <ExternalLink size={12} />
                    Open
                  </a>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(doc._id)}
                      disabled={deletingId === doc._id}
                      className="inline-flex items-center justify-center border border-graphite-700 hover:border-red-signal/50 text-graphite-400 hover:text-red-signal rounded px-2.5 py-1.5 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
