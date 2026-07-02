'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api, logout, checkHealth } from '@/lib/admin-api'

// ── THEME ─────────────────────────────────────────────────
const G = '#C9A84C'       // gold
const BG = '#0a0a0a'      // background
const C1 = '#111111'      // card
const C2 = '#181818'      // card alt
const BD = '#222222'      // border
const TX = '#F8F4EF'      // text
const MU = '#666666'      // muted
const GR = '#22c55e'      // green
const RD = '#ef4444'      // red

// ── TYPES ─────────────────────────────────────────────────
type Tab = 'dashboard' | 'reservas' | 'finanzas' | 'mantenimiento' | 'compras'
type FinTab = 'ingresos' | 'fijos' | 'gastos'

interface Resumen {
  ganancia_neta: number; ingresos_mes: number; gastos_mes: number
  gastos_fijos_mes: number; gastos_variables_mes: number
  ocupacion_porcentaje: number; noches_ocupadas: number
  reservaciones_activas: number; mantenimientos_pendientes: number
  mantenimientos_urgentes: { id: number; titulo: string; prioridad: string; fecha: string | null }[]
}
interface Propiedad { id: number; nombre: string; direccion: string }
interface Reservacion {
  id: number; huesped_nombre: string; check_in: string; check_out: string
  noches: number; monto_total: number; estado: string; notas: string
  propiedad_id: number; fuente: string; codigo_confirmacion: string
}
interface Mantenimiento {
  id: number; titulo: string; estado: string; prioridad: string
  fecha_programada: string | null; costo: number | null; proveedor: string | null
  propiedad_id: number; recurrente: boolean; descripcion: string
}
interface Finanza {
  id: number; tipo: string; categoria: string; descripcion: string
  monto: number; fecha: string; comprobante_nombre: string | null; propiedad_id: number; fuente: string
}
interface GastoFijo {
  id: number; nombre: string; monto: number; categoria: string
  dia_cobro: number | null; propiedad_id: number
}
interface Compra {
  id: number; articulo: string; descripcion: string | null; cantidad: string | null
  prioridad: string; estado: string; costo_estimado: number | null
  costo_real: number | null; categoria: string; propiedad_id: number
}

// ── HELPERS ───────────────────────────────────────────────
const usd = (n: number) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const fDate = (s: string) => s ? new Date(s).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '—'
const fDateLong = (s: string) => s ? new Date(s).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const isOverdue = (s: string | null) => s ? new Date(s) < new Date() : false

// ── MAIN ──────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [finTab, setFinTab] = useState<FinTab>('ingresos')
  const [online, setOnline] = useState(true)
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [pid, setPid] = useState<number | null>(null)
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [reservaciones, setReservaciones] = useState<Reservacion[]>([])
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [finanzas, setFinanzas] = useState<Finanza[]>([])
  const [gastosFijos, setGastosFijos] = useState<GastoFijo[]>([])
  const [compras, setCompras] = useState<Compra[]>([])
  const [modal, setModal] = useState<string | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvLoading, setCsvLoading] = useState(false)
  const [csvResult, setCsvResult] = useState<string | null>(null)
  const csvRef = useRef<HTMLInputElement>(null)
  const pidRef = useRef<number | null>(null)

  const loadAll = useCallback(async (propId?: number) => {
    const p = propId ?? pidRef.current
    try {
      const suffix = p ? `?propiedad_id=${p}` : ''
      const [props, res, mant, fin, gf, sum, cmp] = await Promise.all([
        api.get('/api/propiedades'),
        api.get(`/api/reservaciones${suffix}`),
        api.get(`/api/mantenimientos${suffix}`),
        api.get(`/api/finanzas${suffix}`),
        api.get(`/api/gastos-fijos${suffix}`),
        api.get(`/api/resumen${suffix}`),
        api.get(`/api/compras${suffix}`),
      ])
      setPropiedades(props)
      setReservaciones(res)
      setMantenimientos(mant)
      setFinanzas(fin)
      setGastosFijos(gf)
      setResumen(sum)
      setCompras(cmp)
      if (!pidRef.current && props.length) {
        pidRef.current = props[0].id
        setPid(props[0].id)
      }
    } catch {
      localStorage.removeItem('admin_token')
      router.replace('/admin')
    }
  }, [router])

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.replace('/admin'); return }
    loadAll()
    const iv = setInterval(() => checkHealth().then(setOnline), 30000)
    return () => clearInterval(iv)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function changeProp(id: number) { pidRef.current = id; setPid(id); loadAll(id) }

  async function importCSV() {
    if (!csvFile || !pid) return
    setCsvLoading(true); setCsvResult(null)
    const fd = new FormData()
    fd.append('propiedad_id', String(pid))
    fd.append('archivo', csvFile)
    try {
      const r = await api.postForm('/api/importar-airbnb', fd)
      setCsvResult(`✓ ${r.reservas_creadas} reservas y ${r.ingresos_creados} ingresos importados${r.errores?.length ? ` (${r.errores.length} errores)` : ''}`)
      loadAll()
    } catch (e: unknown) {
      setCsvResult(`Error: ${e instanceof Error ? e.message : 'desconocido'}`)
    } finally { setCsvLoading(false) }
  }

  const ingresos = finanzas.filter(f => f.tipo === 'ingreso')
  const gastos = finanzas.filter(f => f.tipo === 'gasto')
  const pendientes = mantenimientos.filter(m => m.estado !== 'completado')
  const completados = mantenimientos.filter(m => m.estado === 'completado')

  // ── STYLES ──────────────────────────────────────────────
  const s = {
    wrap: { minHeight: '100vh', background: BG, color: TX, fontFamily: "'Inter',system-ui,sans-serif", paddingBottom: 80 } as React.CSSProperties,
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${BD}`, position: 'sticky' as const, top: 0, background: BG, zIndex: 50 },
    card: { background: C1, border: `1px solid ${BD}`, borderRadius: 12, padding: '16px' } as React.CSSProperties,
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${BD}` } as React.CSSProperties,
    btn: (color = G, text = BG) => ({ background: color, color: text, border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 } as React.CSSProperties),
    btnSm: (color = G, text = BG) => ({ background: color, color: text, border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 } as React.CSSProperties),
    btnGhost: { background: 'none', border: `1px solid ${BD}`, color: MU, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 } as React.CSSProperties,
    lbl: { fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: MU, marginBottom: 4, display: 'block' },
    inp: { width: '100%', background: '#0f0f0f', border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' as const },
    section: { padding: '0 16px' } as React.CSSProperties,
    badge: (c: string) => ({ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: c + '20', color: c, fontWeight: 600 }) as React.CSSProperties,
  }

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: G }}>VS</span>
          <select value={pid ?? ''} onChange={e => changeProp(Number(e.target.value))}
            style={{ background: '#111', border: `1px solid ${BD}`, color: TX, padding: '4px 8px', borderRadius: 6, fontSize: 13 }}>
            {propiedades.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: online ? GR : RD, boxShadow: online ? `0 0 5px ${GR}` : 'none' }} />
            <span style={{ fontSize: 11, color: online ? '#86efac' : '#fca5a5' }}>{online ? 'online' : 'offline'}</span>
          </div>
          <button onClick={() => { logout(); router.replace('/admin') }} style={s.btnGhost}>Salir</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 16 }}>

        {/* ── DASHBOARD TAB ── */}
        {tab === 'dashboard' && resumen && (
          <div style={s.section}>
            {/* Ganancia neta — headline */}
            <div style={{ ...s.card, textAlign: 'center', marginBottom: 16, background: 'linear-gradient(135deg,#111,#1a1400)' }}>
              <div style={s.lbl}>Ganancia Neta del Mes</div>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 48, color: resumen.ganancia_neta >= 0 ? G : RD, lineHeight: 1.1 }}>
                {resumen.ganancia_neta < 0 ? '-' : ''}{usd(resumen.ganancia_neta)}
              </div>
              <div style={{ fontSize: 12, color: MU, marginTop: 6 }}>
                {usd(resumen.ingresos_mes)} ingresos − {usd(resumen.gastos_mes)} gastos
              </div>
            </div>

            {/* KPI grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { lbl: 'Ingresos', val: usd(resumen.ingresos_mes), color: GR },
                { lbl: 'Gastos Fijos', val: usd(resumen.gastos_fijos_mes), color: RD },
                { lbl: 'Gastos Variables', val: usd(resumen.gastos_variables_mes), color: '#f97316' },
                { lbl: 'Ocupación', val: `${resumen.ocupacion_porcentaje}%`, color: '#60a5fa' },
              ].map(({ lbl, val, color }) => (
                <div key={lbl} style={{ ...s.card, textAlign: 'center' }}>
                  <div style={s.lbl}>{lbl}</div>
                  <div style={{ fontSize: 22, color, fontFamily: 'Georgia,serif' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Upcoming maintenance alerts */}
            {pendientes.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ ...s.lbl, marginBottom: 8 }}>Mantenimientos Pendientes</div>
                {pendientes.slice(0, 3).map(m => (
                  <div key={m.id} style={{ ...s.card, marginBottom: 8, borderLeft: `3px solid ${m.prioridad === 'alta' ? RD : m.prioridad === 'media' ? G : GR}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{m.titulo}</div>
                        {m.fecha_programada && (
                          <div style={{ fontSize: 12, color: isOverdue(m.fecha_programada) ? RD : MU, marginTop: 2 }}>
                            {isOverdue(m.fecha_programada) ? '⚠ Vencido — ' : ''}{fDateLong(m.fecha_programada)}
                          </div>
                        )}
                      </div>
                      <button onClick={async () => { await api.patch(`/api/mantenimientos/${m.id}/completar`); loadAll() }}
                        style={{ ...s.btnSm(GR, '#000'), fontSize: 18, padding: '4px 10px' }}>✓</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Next check-ins */}
            {reservaciones.filter(r => new Date(r.check_in) > new Date()).slice(0, 2).map(r => (
              <div key={r.id} style={{ ...s.card, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, color: MU, marginBottom: 2 }}>Próximo check-in</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{r.huesped_nombre}</div>
                  <div style={{ fontSize: 12, color: MU }}>{fDate(r.check_in)} · {r.noches} noches</div>
                </div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: GR }}>{r.monto_total ? usd(r.monto_total) : '—'}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── RESERVAS TAB ── */}
        {tab === 'reservas' && (
          <div style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ ...s.lbl, marginBottom: 0 }}>{reservaciones.length} reservaciones</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setModal('csv')} style={s.btnSm('#1a1a1a', G)}>↑ Airbnb CSV</button>
                <button onClick={() => setModal('reservacion')} style={s.btn()}>+ Nueva</button>
              </div>
            </div>
            {reservaciones.map(r => (
              <div key={r.id} style={{ ...s.card, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{r.huesped_nombre}</span>
                      {r.fuente === 'airbnb' && <span style={s.badge('#ff5a5f')}>Airbnb</span>}
                    </div>
                    <div style={{ fontSize: 13, color: MU }}>{fDate(r.check_in)} → {fDate(r.check_out)} · {r.noches} noches</div>
                    {r.notas && <div style={{ fontSize: 12, color: MU, marginTop: 4 }}>{r.notas}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: GR }}>{r.monto_total ? usd(r.monto_total) : '—'}</div>
                    <div style={s.badge(r.estado === 'confirmada' ? GR : r.estado === 'completada' ? '#60a5fa' : MU)}>{r.estado}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button onClick={async () => { await api.delete(`/api/reservaciones/${r.id}`); loadAll() }}
                    style={{ ...s.btnGhost, color: RD, borderColor: RD + '40' }}>Eliminar</button>
                </div>
              </div>
            ))}
            {reservaciones.length === 0 && <Empty msg="No hay reservaciones" />}
          </div>
        )}

        {/* ── FINANZAS TAB ── */}
        {tab === 'finanzas' && (
          <div>
            {/* Sub-tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${BD}`, marginBottom: 16, padding: '0 16px' }}>
              {([['ingresos', 'Ingresos'], ['fijos', 'Gastos Fijos'], ['gastos', 'Variables']] as [FinTab, string][]).map(([key, lbl]) => (
                <button key={key} onClick={() => setFinTab(key)} style={{
                  flex: 1, padding: '11px 4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13,
                  color: finTab === key ? G : MU, borderBottom: finTab === key ? `2px solid ${G}` : '2px solid transparent', fontWeight: finTab === key ? 600 : 400
                }}>{lbl}</button>
              ))}
            </div>

            <div style={s.section}>
              {/* INGRESOS */}
              {finTab === 'ingresos' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: GR }}>{usd(ingresos.reduce((a, f) => a + f.monto, 0))}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setModal('csv')} style={s.btnSm('#1a1a1a', G)}>↑ Airbnb</button>
                      <button onClick={() => setModal('ingreso')} style={s.btn()}>+ Agregar</button>
                    </div>
                  </div>
                  {ingresos.map(f => <FinanzaRow key={f.id} f={f} onDelete={() => { api.delete(`/api/finanzas/${f.id}`).then(() => loadAll()) }} />)}
                  {ingresos.length === 0 && <Empty msg="Sin ingresos este mes" />}
                </>
              )}

              {/* GASTOS FIJOS */}
              {finTab === 'fijos' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <div style={s.lbl}>Total mensual</div>
                      <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: RD }}>{usd(gastosFijos.reduce((a, g) => a + g.monto, 0))}</div>
                    </div>
                    <button onClick={() => setModal('gasto_fijo')} style={s.btn()}>+ Agregar</button>
                  </div>
                  {gastosFijos.map(g => (
                    <div key={g.id} style={{ ...s.card, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{g.nombre}</div>
                        <div style={{ fontSize: 12, color: MU }}>{g.categoria}{g.dia_cobro ? ` · día ${g.dia_cobro}` : ''}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: RD }}>{usd(g.monto)}</div>
                        <button onClick={async () => { await api.delete(`/api/gastos-fijos/${g.id}`); loadAll() }}
                          style={{ background: 'none', border: 'none', color: RD + '80', cursor: 'pointer', fontSize: 18 }}>×</button>
                      </div>
                    </div>
                  ))}
                  {gastosFijos.length === 0 && <Empty msg="Sin gastos fijos registrados" />}
                </>
              )}

              {/* GASTOS VARIABLES */}
              {finTab === 'gastos' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#f97316' }}>{usd(gastos.reduce((a, f) => a + f.monto, 0))}</div>
                    <button onClick={() => setModal('gasto')} style={s.btn()}>+ Agregar</button>
                  </div>
                  {gastos.map(f => <FinanzaRow key={f.id} f={f} onDelete={() => { api.delete(`/api/finanzas/${f.id}`).then(() => loadAll()) }} />)}
                  {gastos.length === 0 && <Empty msg="Sin gastos variables" />}
                </>
              )}

              {/* Resumen footer */}
              {resumen && (
                <div style={{ ...s.card, marginTop: 20, background: '#0d0d0d' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: MU, fontSize: 13 }}>Ingresos</span>
                    <span style={{ color: GR, fontSize: 13, fontWeight: 600 }}>+{usd(resumen.ingresos_mes)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: MU, fontSize: 13 }}>Gastos Fijos</span>
                    <span style={{ color: RD, fontSize: 13 }}>−{usd(resumen.gastos_fijos_mes)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: MU, fontSize: 13 }}>Gastos Variables</span>
                    <span style={{ color: '#f97316', fontSize: 13 }}>−{usd(resumen.gastos_variables_mes)}</span>
                  </div>
                  <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Ganancia Neta</span>
                    <span style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: resumen.ganancia_neta >= 0 ? G : RD, fontWeight: 600 }}>
                      {resumen.ganancia_neta < 0 ? '-' : ''}{usd(resumen.ganancia_neta)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MANTENIMIENTO TAB ── */}
        {tab === 'mantenimiento' && (
          <div style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...s.lbl, marginBottom: 0 }}>{pendientes.length} pendientes</span>
              <button onClick={() => setModal('mantenimiento')} style={s.btn()}>+ Nuevo</button>
            </div>

            {pendientes.length > 0 && (
              <>
                <div style={s.lbl}>Pendientes</div>
                {pendientes.map(m => (
                  <div key={m.id} style={{ ...s.card, marginBottom: 10, borderLeft: `3px solid ${m.prioridad === 'alta' ? RD : m.prioridad === 'media' ? G : GR}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>{m.titulo}</span>
                          <span style={s.badge(m.prioridad === 'alta' ? RD : m.prioridad === 'media' ? G : GR)}>{m.prioridad}</span>
                        </div>
                        {m.descripcion && <div style={{ fontSize: 12, color: MU, marginBottom: 4 }}>{m.descripcion}</div>}
                        <div style={{ fontSize: 12, color: isOverdue(m.fecha_programada) ? RD : MU }}>
                          {m.fecha_programada ? (isOverdue(m.fecha_programada) ? '⚠ Vencido: ' : 'Para: ') + fDateLong(m.fecha_programada) : ''}
                          {m.proveedor ? ` · ${m.proveedor}` : ''}
                          {m.recurrente ? ' · ↻ recurrente' : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <button onClick={async () => { await api.patch(`/api/mantenimientos/${m.id}/completar`); loadAll() }}
                          style={{ ...s.btn(GR, '#000'), padding: '8px 14px', fontSize: 18 }}>✓</button>
                        <button onClick={async () => { await api.delete(`/api/mantenimientos/${m.id}`); loadAll() }}
                          style={{ ...s.btnGhost, color: RD + '80', borderColor: RD + '30', padding: '4px 10px' }}>×</button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {completados.length > 0 && (
              <>
                <div style={{ ...s.lbl, marginTop: 20 }}>Completados ({completados.length})</div>
                {completados.slice(0, 5).map(m => (
                  <div key={m.id} style={{ ...s.card, marginBottom: 8, opacity: 0.6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, textDecoration: 'line-through', color: MU }}>{m.titulo}</span>
                      <span style={{ fontSize: 12, color: GR }}>✓</span>
                    </div>
                  </div>
                ))}
              </>
            )}
            {mantenimientos.length === 0 && <Empty msg="Sin tareas de mantenimiento" />}
          </div>
        )}

        {/* ── COMPRAS TAB ── */}
        {tab === 'compras' && (
          <div style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...s.lbl, marginBottom: 0 }}>{compras.filter(c => c.estado !== 'comprado').length} pendientes</span>
              <button onClick={() => setModal('compra')} style={s.btn()}>+ Agregar</button>
            </div>

            {compras.filter(c => c.estado !== 'comprado').length > 0 && (
              <>
                <div style={s.lbl}>Por comprar</div>
                {compras.filter(c => c.estado !== 'comprado').map(c => (
                  <div key={c.id} style={{ ...s.card, marginBottom: 10, borderLeft: `3px solid ${c.prioridad === 'alta' ? RD : c.prioridad === 'media' ? G : GR}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>{c.articulo}</span>
                          <span style={s.badge(c.prioridad === 'alta' ? RD : c.prioridad === 'media' ? G : GR)}>{c.prioridad}</span>
                          {c.categoria && <span style={s.badge(MU)}>{c.categoria}</span>}
                        </div>
                        {c.descripcion && <div style={{ fontSize: 12, color: MU, marginBottom: 4 }}>{c.descripcion}</div>}
                        <div style={{ fontSize: 12, color: MU }}>
                          {c.cantidad ? `Cantidad: ${c.cantidad}` : ''}
                          {c.costo_estimado ? ` · Est: $${c.costo_estimado.toLocaleString()}` : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <button onClick={async () => { await api.patch(`/api/compras/${c.id}/comprar`); loadAll() }}
                          style={{ ...s.btn(GR, '#000'), padding: '8px 14px', fontSize: 18 }}>✓</button>
                        <button onClick={async () => { await api.delete(`/api/compras/${c.id}`); loadAll() }}
                          style={{ ...s.btnGhost, color: RD + '80', borderColor: RD + '30', padding: '4px 10px' }}>×</button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {compras.filter(c => c.estado === 'comprado').length > 0 && (
              <>
                <div style={{ ...s.lbl, marginTop: 20 }}>Comprado ({compras.filter(c => c.estado === 'comprado').length})</div>
                {compras.filter(c => c.estado === 'comprado').slice(0, 5).map(c => (
                  <div key={c.id} style={{ ...s.card, marginBottom: 8, opacity: 0.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, textDecoration: 'line-through', color: MU }}>{c.articulo}</span>
                      <span style={{ fontSize: 12, color: GR }}>✓</span>
                    </div>
                  </div>
                ))}
              </>
            )}
            {compras.length === 0 && <Empty msg="Sin artículos por comprar" />}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0d0d0d',
        borderTop: `1px solid ${BD}`, display: 'flex', zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}>
        {([
          ['dashboard', '◈', 'Inicio'],
          ['reservas', '⌂', 'Reservas'],
          ['finanzas', '$', 'Finanzas'],
          ['mantenimiento', '⚙', 'Manten.'],
          ['compras', '◎', 'Compras'],
        ] as [Tab, string, string][]).map(([key, icon, lbl]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 4px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3
          }}>
            <span style={{ fontSize: 20, color: tab === key ? G : MU }}>{icon}</span>
            <span style={{ fontSize: 10, color: tab === key ? G : MU, fontWeight: tab === key ? 700 : 400 }}>{lbl}</span>
          </button>
        ))}
      </div>

      {/* ── MODALS ── */}
      {modal && (
        <Modal onClose={() => { setModal(null); setCsvResult(null); setCsvFile(null) }}>
          {/* CSV Import */}
          {modal === 'csv' && (
            <div>
              <ModalTitle>Importar Airbnb CSV</ModalTitle>
              <p style={{ fontSize: 13, color: MU, marginBottom: 16 }}>Descarga el reporte de Airbnb en formato CSV desde Reservaciones → Historial de transacciones → Exportar.</p>
              <input ref={csvRef} type="file" accept=".csv" onChange={e => setCsvFile(e.target.files?.[0] ?? null)}
                style={{ ...s.inp, padding: '8px', color: MU, marginBottom: 12 }} />
              {csvResult && <div style={{ padding: '10px 12px', background: csvResult.startsWith('✓') ? GR + '15' : RD + '15', borderRadius: 8, fontSize: 13, color: csvResult.startsWith('✓') ? GR : RD, marginBottom: 12 }}>{csvResult}</div>}
              <button onClick={importCSV} disabled={!csvFile || csvLoading} style={{ ...s.btn(), width: '100%', opacity: csvFile ? 1 : 0.5 }}>
                {csvLoading ? 'Importando...' : 'Importar'}
              </button>
            </div>
          )}

          {/* Nueva Reservación */}
          {modal === 'reservacion' && pid && (
            <FormReservacion pid={pid} onSaved={() => { setModal(null); loadAll() }} />
          )}

          {/* Nuevo Mantenimiento */}
          {modal === 'mantenimiento' && pid && (
            <FormMantenimiento pid={pid} onSaved={() => { setModal(null); loadAll() }} />
          )}

          {/* Nuevo Ingreso */}
          {modal === 'ingreso' && pid && (
            <FormFinanza pid={pid} tipo="ingreso" onSaved={() => { setModal(null); loadAll() }} />
          )}

          {/* Nuevo Gasto Variable */}
          {modal === 'gasto' && pid && (
            <FormFinanza pid={pid} tipo="gasto" onSaved={() => { setModal(null); loadAll() }} />
          )}

          {/* Nuevo Gasto Fijo */}
          {modal === 'gasto_fijo' && pid && (
            <FormGastoFijo pid={pid} onSaved={() => { setModal(null); loadAll() }} />
          )}

          {/* Nueva Compra */}
          {modal === 'compra' && pid && (
            <FormCompra pid={pid} onSaved={() => { setModal(null); loadAll() }} />
          )}
        </Modal>
      )}
    </div>
  )
}

// ── SUBCOMPONENTS ─────────────────────────────────────────
function Empty({ msg }: { msg: string }) {
  return <div style={{ textAlign: 'center', color: MU, padding: '40px 0', fontSize: 14 }}>{msg}</div>
}

function FinanzaRow({ f, onDelete }: { f: Finanza; onDelete: () => void }) {
  const isIngreso = f.tipo === 'ingreso'
  return (
    <div style={{ background: C1, border: `1px solid ${BD}`, borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{f.descripcion}</div>
          <div style={{ fontSize: 12, color: MU }}>{f.categoria} · {fDate(f.fecha)}</div>
          {f.comprobante_nombre && <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 2 }}>📎 {f.comprobante_nombre}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: isIngreso ? GR : '#f97316' }}>
            {isIngreso ? '+' : '-'}{usd(f.monto)}
          </span>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', color: RD + '60', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      </div>
    </div>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#111', border: `1px solid ${BD}`, borderRadius: '16px 16px 0 0', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '20px 20px 40px' }}>
        <div style={{ width: 36, height: 4, background: BD, borderRadius: 2, margin: '0 auto 20px' }} />
        {children}
      </div>
    </div>
  )
}

function ModalTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: TX }}>{children}</div>
}

function FormReservacion({ pid, onSaved }: { pid: number; onSaved: () => void }) {
  const [v, setV] = useState({ huesped_nombre: '', huesped_telefono: '', check_in: '', check_out: '', monto_total: '', estado: 'confirmada', notas: '' })
  const [loading, setLoading] = useState(false)
  const inp: React.CSSProperties = { width: '100%', background: '#0f0f0f', border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
  const lbl: React.CSSProperties = { fontSize: 11, color: MU, display: 'block', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      await api.post('/api/reservaciones', { ...v, propiedad_id: pid, monto_total: parseFloat(v.monto_total) || null, check_in: new Date(v.check_in).toISOString(), check_out: new Date(v.check_out).toISOString() })
      onSaved()
    } finally { setLoading(false) }
  }
  return (
    <form onSubmit={submit}>
      <ModalTitle>Nueva Reservación</ModalTitle>
      <label style={lbl}>Nombre del huésped *</label>
      <input required style={inp} value={v.huesped_nombre} onChange={e => setV({ ...v, huesped_nombre: e.target.value })} />
      <label style={lbl}>Teléfono</label>
      <input style={inp} value={v.huesped_telefono} onChange={e => setV({ ...v, huesped_telefono: e.target.value })} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={lbl}>Check-in *</label><input required type="datetime-local" style={inp} value={v.check_in} onChange={e => setV({ ...v, check_in: e.target.value })} /></div>
        <div><label style={lbl}>Check-out *</label><input required type="datetime-local" style={inp} value={v.check_out} onChange={e => setV({ ...v, check_out: e.target.value })} /></div>
      </div>
      <label style={lbl}>Monto total (USD)</label>
      <input type="number" step="0.01" style={inp} value={v.monto_total} onChange={e => setV({ ...v, monto_total: e.target.value })} />
      <label style={lbl}>Estado</label>
      <select style={{ ...inp }} value={v.estado} onChange={e => setV({ ...v, estado: e.target.value })}>
        <option value="confirmada">Confirmada</option><option value="pendiente">Pendiente</option><option value="cancelada">Cancelada</option>
      </select>
      <label style={lbl}>Notas</label>
      <textarea style={{ ...inp, minHeight: 70 }} value={v.notas} onChange={e => setV({ ...v, notas: e.target.value })} />
      <button type="submit" disabled={loading} style={{ background: G, color: BG, border: 'none', padding: 14, borderRadius: 10, width: '100%', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}

function FormMantenimiento({ pid, onSaved }: { pid: number; onSaved: () => void }) {
  const [v, setV] = useState({ titulo: '', descripcion: '', prioridad: 'media', fecha_programada: '', proveedor: '', costo: '', recurrente: false, frecuencia_dias: '' })
  const [loading, setLoading] = useState(false)
  const inp: React.CSSProperties = { width: '100%', background: '#0f0f0f', border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
  const lbl: React.CSSProperties = { fontSize: 11, color: MU, display: 'block', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      await api.post('/api/mantenimientos', {
        ...v, propiedad_id: pid, costo: parseFloat(v.costo) || null,
        frecuencia_dias: parseInt(v.frecuencia_dias) || null,
        fecha_programada: v.fecha_programada ? new Date(v.fecha_programada).toISOString() : null
      })
      onSaved()
    } finally { setLoading(false) }
  }
  return (
    <form onSubmit={submit}>
      <ModalTitle>Nuevo Mantenimiento</ModalTitle>
      <label style={lbl}>Título *</label>
      <input required style={inp} value={v.titulo} onChange={e => setV({ ...v, titulo: e.target.value })} />
      <label style={lbl}>Descripción</label>
      <textarea style={{ ...inp, minHeight: 60 }} value={v.descripcion} onChange={e => setV({ ...v, descripcion: e.target.value })} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={lbl}>Prioridad</label>
          <select style={inp} value={v.prioridad} onChange={e => setV({ ...v, prioridad: e.target.value })}>
            <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta ⚠</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Fecha programada</label>
          <input type="datetime-local" style={inp} value={v.fecha_programada} onChange={e => setV({ ...v, fecha_programada: e.target.value })} />
        </div>
      </div>
      <label style={lbl}>Proveedor / Técnico</label>
      <input style={inp} value={v.proveedor} onChange={e => setV({ ...v, proveedor: e.target.value })} />
      <label style={lbl}>Costo estimado (USD)</label>
      <input type="number" step="0.01" style={inp} value={v.costo} onChange={e => setV({ ...v, costo: e.target.value })} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <input type="checkbox" id="rec" checked={v.recurrente} onChange={e => setV({ ...v, recurrente: e.target.checked })} />
        <label htmlFor="rec" style={{ color: TX, fontSize: 14 }}>Es recurrente</label>
      </div>
      {v.recurrente && (
        <><label style={lbl}>Repetir cada (días)</label><input type="number" style={inp} value={v.frecuencia_dias} onChange={e => setV({ ...v, frecuencia_dias: e.target.value })} /></>
      )}
      <button type="submit" disabled={loading} style={{ background: G, color: BG, border: 'none', padding: 14, borderRadius: 10, width: '100%', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}

function FormFinanza({ pid, tipo, onSaved }: { pid: number; tipo: string; onSaved: () => void }) {
  const [v, setV] = useState({ descripcion: '', categoria: tipo === 'ingreso' ? 'Renta' : 'Mantenimiento', monto: '', fecha: new Date().toISOString().split('T')[0], notas: '' })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const inp: React.CSSProperties = { width: '100%', background: '#0f0f0f', border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
  const lbl: React.CSSProperties = { fontSize: 11, color: MU, display: 'block', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }
  const cats = tipo === 'ingreso' ? ['Renta', 'Depósito', 'Otro'] : ['Mantenimiento', 'Limpieza', 'Servicios', 'Suministros', 'Personal', 'Impuestos', 'Seguros', 'Otro']
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const fd = new FormData()
      fd.append('propiedad_id', String(pid)); fd.append('tipo', tipo)
      fd.append('categoria', v.categoria); fd.append('descripcion', v.descripcion)
      fd.append('monto', v.monto); fd.append('fecha', v.fecha)
      if (v.notas) fd.append('notas', v.notas)
      if (file) fd.append('comprobante', file)
      await api.postForm('/api/finanzas', fd)
      onSaved()
    } finally { setLoading(false) }
  }
  return (
    <form onSubmit={submit}>
      <ModalTitle>{tipo === 'ingreso' ? 'Nuevo Ingreso' : 'Nuevo Gasto'}</ModalTitle>
      <label style={lbl}>Descripción *</label>
      <input required style={inp} value={v.descripcion} onChange={e => setV({ ...v, descripcion: e.target.value })} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={lbl}>Monto (USD) *</label>
          <input required type="number" step="0.01" style={inp} value={v.monto} onChange={e => setV({ ...v, monto: e.target.value })} />
        </div>
        <div>
          <label style={lbl}>Fecha *</label>
          <input required type="date" style={inp} value={v.fecha} onChange={e => setV({ ...v, fecha: e.target.value })} />
        </div>
      </div>
      <label style={lbl}>Categoría</label>
      <select style={inp} value={v.categoria} onChange={e => setV({ ...v, categoria: e.target.value })}>
        {cats.map(c => <option key={c}>{c}</option>)}
      </select>
      <label style={lbl}>Comprobante (foto / PDF)</label>
      <input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files?.[0] ?? null)}
        style={{ ...inp, padding: '8px', color: MU }} />
      <label style={lbl}>Notas</label>
      <textarea style={{ ...inp, minHeight: 60 }} value={v.notas} onChange={e => setV({ ...v, notas: e.target.value })} />
      <button type="submit" disabled={loading} style={{ background: G, color: BG, border: 'none', padding: 14, borderRadius: 10, width: '100%', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}

function FormGastoFijo({ pid, onSaved }: { pid: number; onSaved: () => void }) {
  const [v, setV] = useState({ nombre: '', monto: '', categoria: 'Servicios', dia_cobro: '' })
  const [loading, setLoading] = useState(false)
  const inp: React.CSSProperties = { width: '100%', background: '#0f0f0f', border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
  const lbl: React.CSSProperties = { fontSize: 11, color: MU, display: 'block', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      await api.post('/api/gastos-fijos', { ...v, propiedad_id: pid, monto: parseFloat(v.monto), dia_cobro: parseInt(v.dia_cobro) || null })
      onSaved()
    } finally { setLoading(false) }
  }
  return (
    <form onSubmit={submit}>
      <ModalTitle>Nuevo Gasto Fijo</ModalTitle>
      <p style={{ fontSize: 13, color: MU, marginBottom: 16 }}>Gastos que se repiten cada mes (internet, alberca, HOA, limpieza...).</p>
      <label style={lbl}>Nombre *</label>
      <input required style={inp} placeholder="Ej: Servicio de alberca" value={v.nombre} onChange={e => setV({ ...v, nombre: e.target.value })} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={lbl}>Monto mensual (USD) *</label>
          <input required type="number" step="0.01" style={inp} value={v.monto} onChange={e => setV({ ...v, monto: e.target.value })} />
        </div>
        <div>
          <label style={lbl}>Día de cobro</label>
          <input type="number" min="1" max="31" style={inp} placeholder="1–31" value={v.dia_cobro} onChange={e => setV({ ...v, dia_cobro: e.target.value })} />
        </div>
      </div>
      <label style={lbl}>Categoría</label>
      <select style={inp} value={v.categoria} onChange={e => setV({ ...v, categoria: e.target.value })}>
        {['Servicios', 'HOA', 'Limpieza', 'Seguridad', 'Seguros', 'Impuestos', 'Otro'].map(c => <option key={c}>{c}</option>)}
      </select>
      <button type="submit" disabled={loading} style={{ background: G, color: BG, border: 'none', padding: 14, borderRadius: 10, width: '100%', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}

function FormCompra({ pid, onSaved }: { pid: number; onSaved: () => void }) {
  const [v, setV] = useState({ articulo: '', descripcion: '', cantidad: '', prioridad: 'media', categoria: 'General', costo_estimado: '' })
  const [loading, setLoading] = useState(false)
  const inp: React.CSSProperties = { width: '100%', background: '#0f0f0f', border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
  const lbl: React.CSSProperties = { fontSize: 11, color: MU, display: 'block', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      await api.post('/api/compras', {
        propiedad_id: pid,
        articulo: v.articulo,
        descripcion: v.descripcion || null,
        cantidad: v.cantidad || null,
        prioridad: v.prioridad,
        categoria: v.categoria,
        costo_estimado: v.costo_estimado ? parseFloat(v.costo_estimado) : null,
      })
      onSaved()
    } finally { setLoading(false) }
  }
  return (
    <form onSubmit={submit}>
      <ModalTitle>Nueva Compra</ModalTitle>
      <label style={lbl}>Artículo *</label>
      <input required style={inp} placeholder="Ej: Almohadas King" value={v.articulo} onChange={e => setV({ ...v, articulo: e.target.value })} />
      <label style={lbl}>Descripción</label>
      <input style={inp} placeholder="Notas adicionales..." value={v.descripcion} onChange={e => setV({ ...v, descripcion: e.target.value })} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={lbl}>Cantidad</label>
          <input style={inp} placeholder="Ej: 4 piezas" value={v.cantidad} onChange={e => setV({ ...v, cantidad: e.target.value })} />
        </div>
        <div>
          <label style={lbl}>Costo estimado (USD)</label>
          <input type="number" step="0.01" style={inp} placeholder="0.00" value={v.costo_estimado} onChange={e => setV({ ...v, costo_estimado: e.target.value })} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={lbl}>Prioridad</label>
          <select style={inp} value={v.prioridad} onChange={e => setV({ ...v, prioridad: e.target.value })}>
            {['alta', 'media', 'baja'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Categoría</label>
          <select style={inp} value={v.categoria} onChange={e => setV({ ...v, categoria: e.target.value })}>
            {['General', 'Cocina', 'Baño', 'Habitación', 'Alberca', 'Limpieza', 'Mantenimiento', 'Decoración', 'Otro'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading} style={{ background: G, color: BG, border: 'none', padding: 14, borderRadius: 10, width: '100%', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Guardando...' : 'Agregar a lista'}
      </button>
    </form>
  )
}
