'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, checkHealth } from '@/lib/admin-api'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    checkHealth().then(setOnline)
    if (localStorage.getItem('admin_token')) router.replace('/admin/dashboard')
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!online) return
    setLoading(true); setError('')
    try {
      await login(username, password)
      router.replace('/admin/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>
            Villa Sera
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#F8F4EF', fontWeight: 400 }}>
            Admin
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#C9A84C,transparent)', marginTop: 16 }} />
        </div>

        {/* Estado de conexión */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
          padding: '10px 16px', borderRadius: 6,
          background: online === null ? '#1a1a1a' : online ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${online === null ? '#333' : online ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: online === null ? '#666' : online ? '#22c55e' : '#ef4444',
            boxShadow: online ? '0 0 6px #22c55e' : 'none'
          }} />
          <span style={{ fontSize: 13, color: online === null ? '#888' : online ? '#86efac' : '#fca5a5' }}>
            {online === null ? 'Verificando conexión...' : online ? 'Sistema online — Mac Sandbox activa' : 'Sistema offline — Mac Sandbox apagada'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>
              Usuario
            </label>
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              disabled={!online}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 6, border: '1px solid #2a2a2a',
                background: '#111', color: '#F8F4EF', fontSize: 15, outline: 'none',
                boxSizing: 'border-box', opacity: online ? 1 : 0.5
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              disabled={!online}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 6, border: '1px solid #2a2a2a',
                background: '#111', color: '#F8F4EF', fontSize: 15, outline: 'none',
                boxSizing: 'border-box', opacity: online ? 1 : 0.5
              }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#fca5a5', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading || !online}
            style={{
              width: '100%', padding: '13px', borderRadius: 6, border: 'none',
              background: online ? '#C9A84C' : '#333', color: online ? '#0a0a0a' : '#666',
              fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', cursor: online ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Entrando...' : online ? 'Entrar' : 'Sistema offline'}
          </button>
        </form>
      </div>
    </div>
  )
}
