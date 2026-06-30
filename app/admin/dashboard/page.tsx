'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api, logout, checkHealth } from '@/lib/admin-api'

const GOLD = '#C9A84C'
const BG = '#0a0a0a'
const CARD = '#111111'
const BORDER = '#1e1e1e'
const TEXT = '#F8F4EF'
const MUTED = '#888'

type Tab = 'resumen' | 'reservaciones' | 'mantenimiento' | 'finanzas'

interface Resumen {
  propiedades: number
  reservaciones_activas: number
  mantenimientos_pendientes: number
  mantenimientos_urgentes: string[]
  ingresos_mes: number
  gastos_mes: number
  balance_mes: number
}

interface Propiedad { id: number; nombre: string; direccion: string }
interface Reservacion {
  id: number; huesped_nombre: string; check_in: string; check_out: string
  monto_total: number; estado: string; notas: string; propiedad_id: number
}
interface Mantenimiento {
  id: number; titulo: string; estado: string; prioridad: string
  fecha_programada: string; costo: number; proveedor: string; propiedad_id: number; recurrente: boolean
}
interface Finanza {
  id: number; tipo: string; categoria: string; descripcion: string
  monto: number; fecha: string; comprobante_nombre: string; propiedad_id: number
}

export default function Dashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('resumen')
  const [online, setOnline] = useState(true)
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [propiedadSel, setPropiedadSel] = useState<number | null>(null)
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [reservaciones, setReservaciones] = useState<Reservacion[]>([])
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [finanzas, setFinanzas] = useState<Finanza[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<'reservacion' | 'mantenimiento' | 'finanza' | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [props, res, mant, fin, sum] = await Promise.all([
        api.get('/api/propiedades'),
        api.get('/api/reservaciones'),
        api.get('/api/mantenimientos'),
        api.get('/api/finanzas'),
        api.get('/api/resumen'),
      ])
      setPropiedades(props)
      setReservaciones(res)
      setMantenimientos(mant)
      setFinanzas(fin)
      setResumen(sum)
      if (props.length > 0 && !propiedadSel) setPropiedadSel(props[0].id)
    } catch {
      router.replace('/admin')
    }
  }, [router, propiedadSel])

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.replace('/admin'); return }
    loadData()
    const interval = setInterval(async () => {
      const h = await checkHealth()
      setOnline(h)
    }, 30000)
    return () => clearInterval(interval)
  }, [router, loadData])

  function handleLogout() { logout(); router.replace('/admin') }

  const fmt = (n: number) => n?.toLocaleString('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) ?? '$0'
  const fmtDate = (s: string) => s ? new Date(s).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  const prioColor = (p: string) => p === 'alta' ? '#ef4444' : p === 'media' ? GOLD : '#22c55e'
  const estadoColor = (e: string) => e === 'completado' ? '#22c55e' : e === 'en_proceso' ? GOLD : '#888'

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: GOLD }}>VS</span>
          <span style={{ fontSize: 13, color: MUTED }}>Admin</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: online ? '#22c55e' : '#ef4444', boxShadow: online ? '0 0 4px #22c55e' : 'none' }} />
            <span style={{ fontSize: 11, color: online ? '#86efac' : '#fca5a5' }}>{online ? 'online' : 'offline'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <select
            value={propiedadSel ?? ''}
            onChange={e => setPropiedadSel(Number(e.target.value))}
            style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, color: TEXT, padding: '6px 10px', borderRadius: 6, fontSize: 13 }}
          >
            {propiedades.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          <button onClick={handleLogout} style={{ background: 'none', border: `1px solid ${BORDER}`, color: MUTED, padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
            Salir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 24px', display: 'flex', gap: 0 }}>
        {(['resumen', 'reservaciones', 'mantenimiento', 'finanzas'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: tab === t ? GOLD : MUTED,
            borderBottom: tab === t ? `2px solid ${GOLD}` : '2px solid transparent',
            textTransform: 'capitalize', transition: 'color 0.2s'
          }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>

        {/* RESUMEN */}
        {tab === 'resumen' && resumen && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Propiedades', value: resumen.propiedades, color: GOLD },
                { label: 'Reservaciones activas', value: resumen.reservaciones_activas, color: '#60a5fa' },
                { label: 'Mantenimientos pendientes', value: resumen.mantenimientos_pendientes, color: resumen.mantenimientos_pendientes > 0 ? '#facc15' : '#22c55e' },
                { label: 'Ingresos este mes', value: fmt(resumen.ingresos_mes), color: '#22c55e' },
                { label: 'Gastos este mes', value: fmt(resumen.gastos_mes), color: '#ef4444' },
                { label: 'Balance del mes', value: fmt(resumen.balance_mes), color: resumen.balance_mes >= 0 ? '#22c55e' : '#ef4444' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '20px 22px' }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.15em', color: MUTED, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 28, fontFamily: 'Georgia,serif', color, fontWeight: 400 }}>{value}</div>
                </div>
              ))}
            </div>
            {resumen.mantenimientos_urgentes.length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '16px 20px' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#ef4444', textTransform: 'uppercase', marginBottom: 10 }}>Mantenimientos urgentes</div>
                {resumen.mantenimientos_urgentes.map((t, i) => (
                  <div key={i} style={{ fontSize: 14, color: '#fca5a5', padding: '4px 0' }}>• {t}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESERVACIONES */}
        {tab === 'reservaciones' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', color: MUTED, textTransform: 'uppercase' }}>
                {reservaciones.filter(r => !propiedadSel || r.propiedad_id === propiedadSel).length} reservaciones
              </div>
              <button onClick={() => { setFormType('reservacion'); setShowForm(true) }} style={{
                background: GOLD, color: '#0a0a0a', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}>+ Nueva</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reservaciones
                .filter(r => !propiedadSel || r.propiedad_id === propiedadSel)
                .map(r => (
                  <div key={r.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 120px 100px', gap: 16, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{r.huesped_nombre}</div>
                      {r.notas && <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{r.notas}</div>}
                    </div>
                    <div style={{ fontSize: 13, color: MUTED }}>
                      {fmtDate(r.check_in)} → {fmtDate(r.check_out)}
                    </div>
                    <div style={{ fontSize: 15, color: '#22c55e', fontFamily: 'Georgia,serif' }}>{r.monto_total ? fmt(r.monto_total) : '—'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: r.estado === 'confirmada' ? 'rgba(34,197,94,0.1)' : 'rgba(201,168,76,0.1)', color: r.estado === 'confirmada' ? '#86efac' : GOLD }}>
                        {r.estado}
                      </span>
                      <button onClick={async () => { await api.delete(`/api/reservaciones/${r.id}`); loadData() }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>×</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* MANTENIMIENTO */}
        {tab === 'mantenimiento' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', color: MUTED, textTransform: 'uppercase' }}>
                {mantenimientos.filter(m => m.estado !== 'completado').length} pendientes
              </div>
              <button onClick={() => { setFormType('mantenimiento'); setShowForm(true) }} style={{
                background: GOLD, color: '#0a0a0a', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}>+ Nuevo</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mantenimientos
                .filter(m => !propiedadSel || m.propiedad_id === propiedadSel)
                .map(m => (
                  <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${prioColor(m.prioridad)}`, borderRadius: 8, padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 140px 120px auto', gap: 16, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{m.titulo}</div>
                      {m.proveedor && <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Proveedor: {m.proveedor}</div>}
                      {m.recurrente && <div style={{ fontSize: 11, color: GOLD, marginTop: 3 }}>↻ recurrente</div>}
                    </div>
                    <div style={{ fontSize: 13, color: MUTED }}>{fmtDate(m.fecha_programada)}</div>
                    <span style={{ fontSize: 11, color: estadoColor(m.estado) }}>{m.estado.replace('_', ' ')}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {m.estado !== 'completado' && (
                        <button onClick={async () => { await api.patch(`/api/mantenimientos/${m.id}/completar`); loadData() }}
                          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                          ✓
                        </button>
                      )}
                      <button onClick={async () => { await api.delete(`/api/mantenimientos/${m.id}`); loadData() }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>×</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* FINANZAS */}
        {tab === 'finanzas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', color: MUTED, textTransform: 'uppercase' }}>
                Movimientos
              </div>
              <button onClick={() => { setFormType('finanza'); setShowForm(true) }} style={{
                background: GOLD, color: '#0a0a0a', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}>+ Registrar</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {finanzas
                .filter(f => !propiedadSel || f.propiedad_id === propiedadSel)
                .map(f => (
                  <div key={f.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '14px 20px', display: 'grid', gridTemplateColumns: '1fr 120px 140px 100px auto', gap: 16, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{f.descripcion}</div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{f.categoria}</div>
                    </div>
                    <div style={{ fontSize: 13, color: MUTED }}>{fmtDate(f.fecha)}</div>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: f.tipo === 'ingreso' ? '#22c55e' : '#ef4444' }}>
                      {f.tipo === 'ingreso' ? '+' : '-'}{fmt(f.monto)}
                    </div>
                    <div style={{ fontSize: 12, color: MUTED }}>{f.comprobante_nombre ? '📎 ' + f.comprobante_nombre.slice(0, 12) + '...' : ''}</div>
                    <button onClick={async () => { await api.delete(`/api/finanzas/${f.id}`); loadData() }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>×</button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL FORMS */}
      {showForm && <FormModal type={formType!} propiedades={propiedades} propiedadSel={propiedadSel} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); loadData() }} />}
    </div>
  )
}

function FormModal({ type, propiedades, propiedadSel, onClose, onSaved }: {
  type: 'reservacion' | 'mantenimiento' | 'finanza'
  propiedades: Propiedad[]
  propiedadSel: number | null
  onClose: () => void
  onSaved: () => void
}) {
  const [pid, setPid] = useState(propiedadSel ?? propiedades[0]?.id ?? 1)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const CARD = '#111111'; const BORDER = '#1e1e1e'; const TEXT = '#F8F4EF'; const MUTED = '#888'; const GOLD = '#C9A84C'
  const input: React.CSSProperties = { width: '100%', background: '#0a0a0a', border: `1px solid ${BORDER}`, color: TEXT, padding: '10px 12px', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: '0.12em', color: MUTED, textTransform: 'uppercase', display: 'block', marginBottom: 5 }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    fd.set('propiedad_id', String(pid))
    try {
      if (type === 'reservacion') await api.post('/api/reservaciones', Object.fromEntries(fd))
      else if (type === 'mantenimiento') await api.post('/api/mantenimientos', Object.fromEntries(fd))
      else if (type === 'finanza') {
        if (file) fd.set('comprobante', file)
        await api.postForm('/api/finanzas', fd)
      }
      onSaved()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 28, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            {type === 'reservacion' ? 'Nueva Reservación' : type === 'mantenimiento' ? 'Nuevo Mantenimiento' : 'Registrar Movimiento'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUTED, fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={label}>Propiedad</label>
            <select value={pid} onChange={e => setPid(Number(e.target.value))} style={input}>
              {propiedades.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>

          {type === 'reservacion' && <>
            <div><label style={label}>Nombre del huésped</label><input name="huesped_nombre" required style={input} /></div>
            <div><label style={label}>Email</label><input name="huesped_email" type="email" style={input} /></div>
            <div><label style={label}>Teléfono</label><input name="huesped_telefono" style={input} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={label}>Check-in</label><input name="check_in" type="datetime-local" required style={input} /></div>
              <div><label style={label}>Check-out</label><input name="check_out" type="datetime-local" required style={input} /></div>
            </div>
            <div><label style={label}>Monto total (USD)</label><input name="monto_total" type="number" step="0.01" style={input} /></div>
            <div><label style={label}>Estado</label>
              <select name="estado" style={input}><option value="confirmada">Confirmada</option><option value="pendiente">Pendiente</option><option value="cancelada">Cancelada</option></select>
            </div>
            <div><label style={label}>Notas</label><textarea name="notas" style={{ ...input, minHeight: 80 }} /></div>
          </>}

          {type === 'mantenimiento' && <>
            <div><label style={label}>Título</label><input name="titulo" required style={input} /></div>
            <div><label style={label}>Descripción</label><textarea name="descripcion" style={{ ...input, minHeight: 80 }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={label}>Prioridad</label>
                <select name="prioridad" style={input}><option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option></select>
              </div>
              <div><label style={label}>Fecha programada</label><input name="fecha_programada" type="datetime-local" style={input} /></div>
            </div>
            <div><label style={label}>Proveedor</label><input name="proveedor" style={input} /></div>
            <div><label style={label}>Costo estimado (USD)</label><input name="costo" type="number" step="0.01" style={input} /></div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input name="recurrente" type="checkbox" id="rec" />
              <label htmlFor="rec" style={{ color: TEXT, fontSize: 14 }}>Es recurrente</label>
            </div>
            <div><label style={label}>Cada cuántos días (si es recurrente)</label><input name="frecuencia_dias" type="number" style={input} /></div>
          </>}

          {type === 'finanza' && <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={label}>Tipo</label>
                <select name="tipo" style={input}><option value="ingreso">Ingreso</option><option value="gasto">Gasto</option></select>
              </div>
              <div><label style={label}>Fecha</label><input name="fecha" type="date" required style={input} defaultValue={new Date().toISOString().split('T')[0]} /></div>
            </div>
            <div><label style={label}>Categoría</label>
              <select name="categoria" style={input}>
                <option>Renta</option><option>Mantenimiento</option><option>Servicios</option><option>Personal</option><option>Impuestos</option><option>Seguros</option><option>Otro</option>
              </select>
            </div>
            <div><label style={label}>Descripción</label><input name="descripcion" required style={input} /></div>
            <div><label style={label}>Monto (USD)</label><input name="monto" type="number" step="0.01" required style={input} /></div>
            <div>
              <label style={label}>Comprobante (opcional)</label>
              <input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files?.[0] ?? null)}
                style={{ ...input, padding: '8px 12px', color: MUTED }} />
            </div>
            <div><label style={label}>Notas</label><textarea name="notas" style={{ ...input, minHeight: 60 }} /></div>
          </>}

          <button type="submit" disabled={loading} style={{
            background: GOLD, color: '#0a0a0a', border: 'none', padding: '12px', borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, marginTop: 8
          }}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  )
}
