import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Clock, Factory } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import SourceTag from '../components/SourceTag'
import Loader from '../components/Loader'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

const SUGGESTED = [
  'What does the safety manual say about PPE requirements?',
  'How many casual leaves are employees entitled to?',
  'What is the maintenance interval for critical equipment?',
]

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [asking, setAsking] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    api
      .get('/chat/history')
      .then((res) => setHistory(res.data.history || []))
      .catch(() => {})
      .finally(() => setHistoryLoading(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, asking])

  const ask = async (question) => {
    const q = (question ?? input).trim()
    if (!q || asking) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setAsking(true)
    try {
      const res = await api.post('/chat/ask', { question: q })
      setMessages((m) => [...m, { role: 'assistant', text: res.data.answer, sources: res.data.sources || [] }])
      setHistory((h) => [{ question: q, answer: res.data.answer, sources: res.data.sources, createdAt: new Date().toISOString() }, ...h])
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong reaching the knowledge index.'
      setMessages((m) => [...m, { role: 'assistant', text: msg, error: true, sources: [] }])
    } finally {
      setAsking(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    ask()
  }

  return (
    <AppLayout>
      <div className="flex h-screen">
        {/* History rail */}
        <div className="w-72 shrink-0 border-r border-graphite-700 flex flex-col h-screen">
          <div className="px-5 py-5 border-b border-graphite-700">
            <p className="font-mono text-[11px] tracking-widest text-graphite-500 mb-1">SESSION LOG</p>
            <p className="text-sm text-graphite-300">Recent questions asked</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            {historyLoading ? (
              <div className="px-2 py-4"><Loader label="Loading" /></div>
            ) : history.length === 0 ? (
              <p className="text-xs text-graphite-500 px-2 py-4">No questions asked yet this account.</p>
            ) : (
              history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => ask(h.question)}
                  className="w-full text-left px-3 py-2.5 rounded-md hover:bg-graphite-800/70 transition-colors group"
                >
                  <p className="text-xs text-graphite-300 group-hover:text-graphite-50 line-clamp-2">{h.question}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-graphite-600">
                    <Clock size={10} />
                    {new Date(h.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 flex flex-col h-screen min-w-0">
          <div className="px-8 py-5 border-b border-graphite-700 flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] tracking-widest text-graphite-500 mb-1">AI KNOWLEDGE ASSISTANT</p>
              <h1 className="font-display text-xl text-graphite-50">Ask IntelliPlant</h1>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-graphite-500 border border-graphite-700 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full indicator-live" style={{ backgroundColor: 'var(--color-teal-signal)' }} />
              SCOPE: {user?.role === 'admin' ? 'ALL DEPARTMENTS' : (user?.department || '').toUpperCase()}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-8">
            {messages.length === 0 ? (
              <div className="max-w-2xl mx-auto text-center pt-12">
                <div className="w-12 h-12 rounded-lg bg-graphite-800 border border-graphite-700 flex items-center justify-center mx-auto mb-4">
                  <Factory size={20} style={{ color: 'var(--color-amber-signal)' }} />
                </div>
                <h2 className="font-display text-lg text-graphite-100 mb-2">Answers, grounded in your plant's documents</h2>
                <p className="text-sm text-graphite-400 mb-8">Every answer cites the source document it came from — nothing is pulled from the open internet.</p>
                <div className="grid gap-2 max-w-lg mx-auto">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="text-left text-sm text-graphite-300 hover:text-graphite-50 border border-graphite-700 hover:border-amber-signal/40 rounded-md px-4 py-3 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'user' ? (
                      <div className="max-w-[80%] bg-graphite-800 border border-graphite-600 rounded-lg rounded-tr-sm px-4 py-2.5 text-sm text-graphite-50">
                        {m.text}
                      </div>
                    ) : (
                      <div className="max-w-[85%]">
                        <div
                          className="rounded-lg rounded-tl-sm px-4 py-3 text-sm leading-relaxed border"
                          style={
                            m.error
                              ? { borderColor: 'rgba(229,72,77,0.3)', backgroundColor: 'rgba(229,72,77,0.06)', color: '#f5a3a5' }
                              : { borderColor: '#242832', backgroundColor: 'rgba(69,214,196,0.05)', color: '#edeef0' }
                          }
                        >
                          {m.text}
                        </div>
                        {m.sources && m.sources.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                            {m.sources.map((s, idx) => (
                              <SourceTag key={idx} title={s} index={idx} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {asking && (
                  <div className="flex justify-start">
                    <div className="rounded-lg rounded-tl-sm px-4 py-3 border border-graphite-700 bg-graphite-900/60">
                      <Loader label="Reading indexed documents" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="px-8 py-5 border-t border-graphite-700">
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Sparkles size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-teal-signal)' }} />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a policy, procedure, or manual…"
                  className="w-full bg-graphite-900 border border-graphite-600 rounded-full pl-9 pr-4 py-3 text-sm text-graphite-50 placeholder-graphite-500 outline-none focus:border-amber-signal focus:ring-1 focus:ring-amber-signal/40"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || asking}
                className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
                style={{ backgroundColor: 'var(--color-amber-signal)', color: '#101216' }}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
