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
      minHeight: '100vh', background: 'radial-gradient(120% 100% at 50% 0%, #FFFFFF 0%, #FAF6EE 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif"
    }}>
      <div className="vs-root vs-fade-item" style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14, overflow: 'hidden', margin: '0 auto 16px',
            border: '1px solid #E8DCC6', background: '#0d0b09',
            boxShadow: '0 8px 28px -8px rgba(207,162,59,0.4)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Villa Sera" style={{ width: '100%', height: '230%', objectFit: 'cover', objectPosition: '50% 6%', display: 'block' }} />
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#CFA23B', textTransform: 'uppercase', marginBottom: 8 }}>
            Villa Será · Los Cabos
          </div>
          <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: 'italic', fontSize: 34, color: '#2A211A', fontWeight: 500 }}>
            Administración
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#CFA23B,transparent)', marginTop: 16 }} />
        </div>

        {/* Estado de conexión */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
          padding: '10px 16px', borderRadius: 8,
          background: online === null ? '#F4ECDD' : online ? 'rgba(46,158,91,0.1)' : 'rgba(226,84,63,0.1)',
          border: `1px solid ${online === null ? '#E8DCC6' : online ? 'rgba(46,158,91,0.3)' : 'rgba(226,84,63,0.3)'}`,
        }}>
          <div className={online ? 'vs-live-dot' : ''} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: online === null ? '#93857A' : online ? '#2E9E5B' : '#E2543F',
          }} />
          <span style={{ fontSize: 13, color: online === null ? '#93857A' : online ? '#227A46' : '#C43F2C' }}>
            {online === null ? 'Verificando conexión...' : online ? 'Sistema online — Mac Sandbox activa' : 'Sistema offline — Mac Sandbox apagada'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: '#93857A', textTransform: 'uppercase', marginBottom: 6 }}>
              Usuario
            </label>
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              disabled={!online}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #E8DCC6',
                background: '#FFFFFF', color: '#2A211A', fontSize: 15, outline: 'none',
                boxSizing: 'border-box', opacity: online ? 1 : 0.5
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: '#93857A', textTransform: 'uppercase', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              disabled={!online}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #E8DCC6',
                background: '#FFFFFF', color: '#2A211A', fontSize: 15, outline: 'none',
                boxSizing: 'border-box', opacity: online ? 1 : 0.5
              }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(226,84,63,0.1)', border: '1px solid rgba(226,84,63,0.3)', borderRadius: 8, color: '#C43F2C', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading || !online}
            className={online ? 'vs-btn vs-btn-gold' : ''}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: online ? undefined : '#F4ECDD', color: online ? '#231A10' : '#93857A',
              fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', cursor: online ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Entrando...' : online ? 'Entrar' : 'Sistema offline'}
          </button>
        </form>
      </div>
    </div>
  )
}
