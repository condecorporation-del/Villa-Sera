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
      minHeight: '100vh', background: 'radial-gradient(120% 100% at 50% 0%, #2A241D 0%, #171310 55%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif"
    }}>
      <div className="vs-fade-item" style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14, overflow: 'hidden', margin: '0 auto 16px',
            border: '1px solid #3A322A', background: '#0d0b09',
            boxShadow: '0 8px 28px -8px rgba(201,168,76,0.35)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Villa Sera" style={{ width: '100%', height: '230%', objectFit: 'cover', objectPosition: '50% 6%', display: 'block' }} />
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>
            Villa Será · Los Cabos
          </div>
          <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: 'italic', fontSize: 34, color: '#F8F4EF', fontWeight: 500 }}>
            Administración
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#C9A84C,transparent)', marginTop: 16 }} />
        </div>

        {/* Estado de conexión */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
          padding: '10px 16px', borderRadius: 8,
          background: online === null ? '#211C17' : online ? 'rgba(124,148,115,0.12)' : 'rgba(192,69,58,0.12)',
          border: `1px solid ${online === null ? '#3A322A' : online ? 'rgba(124,148,115,0.35)' : 'rgba(192,69,58,0.35)'}`,
        }}>
          <div className={online ? 'vs-live-dot' : ''} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: online === null ? '#8A8074' : online ? '#7C9473' : '#C0453A',
          }} />
          <span style={{ fontSize: 13, color: online === null ? '#8A8074' : online ? '#7C9473' : '#C0453A' }}>
            {online === null ? 'Verificando conexión...' : online ? 'Sistema online — Mac Sandbox activa' : 'Sistema offline — Mac Sandbox apagada'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: '#8A8074', textTransform: 'uppercase', marginBottom: 6 }}>
              Usuario
            </label>
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              disabled={!online}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #3A322A',
                background: '#211C17', color: '#F8F4EF', fontSize: 15, outline: 'none',
                boxSizing: 'border-box', opacity: online ? 1 : 0.5
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', color: '#8A8074', textTransform: 'uppercase', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              disabled={!online}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #3A322A',
                background: '#211C17', color: '#F8F4EF', fontSize: 15, outline: 'none',
                boxSizing: 'border-box', opacity: online ? 1 : 0.5
              }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(192,69,58,0.12)', border: '1px solid rgba(192,69,58,0.35)', borderRadius: 8, color: '#E29088', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading || !online}
            className={online ? 'vs-btn vs-btn-gold' : ''}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: online ? undefined : '#2A241D', color: online ? '#171310' : '#8A8074',
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
