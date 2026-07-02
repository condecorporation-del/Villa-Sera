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
      minHeight: '100vh', background: 'radial-gradient(120% 100% at 50% 0%, #2C251C 0%, #15110D 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif"
    }}>
      <div className="vs-root vs-fade-item" style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 14, overflow: 'hidden', margin: '0 auto 16px',
            border: '1px solid #4A4032', background: '#0d0b09',
            boxShadow: '0 0 0 1px rgba(227,189,102,0.15), 0 10px 32px -8px rgba(227,189,102,0.45)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Villa Sera" style={{ width: '100%', height: '230%', objectFit: 'cover', objectPosition: '50% 6%', display: 'block' }} />
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#E3BD66', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
            Villa Será · Los Cabos
          </div>
          <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: 'italic', fontSize: 34, color: '#F8F2E7', fontWeight: 500 }}>
            Administración
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#E3BD66,transparent)', marginTop: 16 }} />
        </div>

        {/* Estado de conexión */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
          padding: '10px 16px', borderRadius: 8,
          background: online === null ? '#2C251C' : online ? 'rgba(76,197,133,0.14)' : 'rgba(241,106,82,0.14)',
          border: `1px solid ${online === null ? '#4A4032' : online ? 'rgba(76,197,133,0.35)' : 'rgba(241,106,82,0.35)'}`,
        }}>
          <div className={online ? 'vs-live-dot' : ''} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: online === null ? '#B9AC9B' : online ? '#4CC585' : '#F16A52',
          }} />
          <span style={{ fontSize: 13, color: online === null ? '#B9AC9B' : online ? '#7EDCA6' : '#F7A18E', fontWeight: 600 }}>
            {online === null ? 'Verificando conexión...' : online ? 'Sistema online — Mac Sandbox activa' : 'Sistema offline — Mac Sandbox apagada'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11.5, letterSpacing: '0.14em', color: '#B9AC9B', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
              Usuario
            </label>
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              disabled={!online}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #4A4032',
                background: '#2C251C', color: '#F8F2E7', fontSize: 15, fontWeight: 500, outline: 'none',
                boxSizing: 'border-box', opacity: online ? 1 : 0.5
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11.5, letterSpacing: '0.14em', color: '#B9AC9B', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
              Contraseña
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              disabled={!online}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #4A4032',
                background: '#2C251C', color: '#F8F2E7', fontSize: 15, fontWeight: 500, outline: 'none',
                boxSizing: 'border-box', opacity: online ? 1 : 0.5
              }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(241,106,82,0.14)', border: '1px solid rgba(241,106,82,0.35)', borderRadius: 8, color: '#F7A18E', fontSize: 13, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading || !online}
            className={online ? 'vs-btn vs-btn-gold' : ''}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: online ? undefined : '#2C251C', color: online ? '#231A10' : '#B9AC9B',
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
