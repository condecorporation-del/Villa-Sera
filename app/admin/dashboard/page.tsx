'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api, logout, checkHealth } from '@/lib/admin-api'

// ── THEME ─────────────────────────────────────────────────
// Villa Sera brand tokens, warmed for a dark console (echoes the public site's
// cream/terracotta/gold/ocean palette instead of a generic dev-tool dark mode)
const G = '#C9A84C'        // gold — brand accent, CTAs
const GL = '#DFC07A'       // gold light — hover/highlight
const BG = '#171310'       // ink — canvas, warmed black (not neutral #0a0a0a)
const C1 = '#211C17'       // surface — card
const C2 = '#2A241D'       // surface-2 — elevated / inputs
const BD = '#3A322A'       // hairline — warm border
const TX = '#F8F4EF'       // cream — primary text (site's brand cream)
const MU = '#8A8074'       // muted — warm grey-brown secondary text
const GR = '#7C9473'       // sage — positive figures (not a generic bright green)
const RD = '#C0453A'       // terracotta — negative/expense (site's brand terracotta)
const OC = '#4E96B8'       // ocean, lightened for dark bg — informational accent
const AM = '#C08A3E'       // amber — variable-expense distinction from fixed (terracotta)
const FONT_DISPLAY = "'Cormorant Garamond', Georgia, serif"

// ── TYPES ─────────────────────────────────────────────────
type Tab = 'dashboard' | 'reservas' | 'finanzas' | 'mantenimiento' | 'compras' | 'inventario'
type FinTab = 'ingresos' | 'fijos' | 'gastos' | 'caja'

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
  dia_cobro: number | null; propiedad_id: number; ultimo_pago: string | null
  ultimo_monto_pagado: number | null
}
interface ResumenAnual {
  year: number; meses_transcurridos: number
  ingresos_anual: number; gastos_variables_anual: number
  gastos_fijos_anual: number; ganancia_neta_anual: number
  noches_ocupadas_anual: number
}
interface Compra {
  id: number; articulo: string; descripcion: string | null; cantidad: string | null
  prioridad: string; estado: string; costo_estimado: number | null
  costo_real: number | null; categoria: string; propiedad_id: number
}
interface InventarioItem {
  id: number; articulo: string; categoria: string; cantidad: number
  estado: string; costo: number | null; ubicacion: string | null
  notas: string | null; propiedad_id: number
}

// ── HELPERS ───────────────────────────────────────────────
const usd = (n: number) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const fDate = (s: string) => s ? new Date(s).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '—'
const fDateLong = (s: string) => s ? new Date(s).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const isOverdue = (s: string | null) => s ? new Date(s) < new Date() : false
const isPagadoEstePeriodo = (ultimoPago: string | null) => {
  if (!ultimoPago) return false
  const p = new Date(ultimoPago), n = new Date()
  return p.getFullYear() === n.getFullYear() && p.getMonth() === n.getMonth()
}
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
const CURRENT_MONTH_KEY = monthKey(new Date())
const monthLabel = (key: string) => {
  const [y, m] = key.split('-').map(Number)
  const s = new Date(y, m - 1, 1).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function groupByMonth(reservaciones: Reservacion[]) {
  const map = new Map<string, Reservacion[]>()
  reservaciones.forEach(r => {
    const key = monthKey(new Date(r.check_in))
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(r)
  })
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}
function monthlyNetSeries(finanzas: Finanza[], months = 6) {
  const now = new Date()
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    return { key: monthKey(d), label: d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', ''), ingresos: 0, gastos: 0 }
  })
  const idx = new Map(buckets.map((b, i) => [b.key, i]))
  finanzas.forEach(f => {
    if (f.categoria === 'Caja Chica') return
    const i = idx.get(monthKey(new Date(f.fecha)))
    if (i === undefined) return
    if (f.tipo === 'ingreso') buckets[i].ingresos += f.monto
    else buckets[i].gastos += f.monto
  })
  return buckets
}
function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(target)
  const first = useRef(true)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target); return
    }
    const from = first.current ? 0 : value
    first.current = false
    let raf = 0
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + (target - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs])
  return value
}
function TrendChart({ data, color }: { data: { key: string; label: string; ingresos: number; gastos: number }[]; color: (net: number) => string }) {
  const nets = data.map(d => d.ingresos - d.gastos)
  const max = Math.max(1, ...nets.map(n => Math.abs(n)))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 70, marginTop: 14 }}>
      {data.map((d, i) => {
        const h = Math.max(4, (Math.abs(nets[i]) / max) * 56)
        const isLast = i === data.length - 1
        return (
          <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
            <div className="vs-bar" style={{ width: '100%', maxWidth: 20, height: h, borderRadius: 4, background: color(nets[i]), opacity: isLast ? 1 : 0.5, animationDelay: `${i * 70}ms` }} />
            <span style={{ fontSize: 9, color: isLast ? MU : MU, textTransform: 'capitalize', opacity: isLast ? 1 : 0.7, fontWeight: isLast ? 700 : 400 }}>{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [finTab, setFinTab] = useState<FinTab>('ingresos')
  const [online, setOnline] = useState(true)
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [pid, setPid] = useState<number | null>(null)
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [resumenAnual, setResumenAnual] = useState<ResumenAnual | null>(null)
  const [reservaciones, setReservaciones] = useState<Reservacion[]>([])
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [finanzas, setFinanzas] = useState<Finanza[]>([])
  const [gastosFijos, setGastosFijos] = useState<GastoFijo[]>([])
  const [compras, setCompras] = useState<Compra[]>([])
  const [inventario, setInventario] = useState<InventarioItem[]>([])
  const [modal, setModal] = useState<string | null>(null)
  const [pagandoGasto, setPagandoGasto] = useState<GastoFijo | null>(null)
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(() => new Set([CURRENT_MONTH_KEY]))
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvLoading, setCsvLoading] = useState(false)
  const [csvResult, setCsvResult] = useState<string | null>(null)
  const csvRef = useRef<HTMLInputElement>(null)
  const pidRef = useRef<number | null>(null)

  const loadAll = useCallback(async (propId?: number) => {
    const p = propId ?? pidRef.current
    try {
      const suffix = p ? `?propiedad_id=${p}` : ''
      const [props, res, mant, fin, gf, sum, cmp, inv, sumAnual] = await Promise.all([
        api.get('/api/propiedades'),
        api.get(`/api/reservaciones${suffix}`),
        api.get(`/api/mantenimientos${suffix}`),
        api.get(`/api/finanzas${suffix}`),
        api.get(`/api/gastos-fijos${suffix}`),
        api.get(`/api/resumen${suffix}`),
        api.get(`/api/compras${suffix}`),
        api.get(`/api/inventario${suffix}`),
        api.get(`/api/resumen-anual${suffix}`),
      ])
      setPropiedades(props)
      setReservaciones(res)
      setMantenimientos(mant)
      setFinanzas(fin)
      setGastosFijos(gf)
      setResumen(sum)
      setCompras(cmp)
      setInventario(inv)
      setResumenAnual(sumAnual)
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
  function toggleMonth(key: string) {
    setExpandedMonths(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }

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

  const ingresos = finanzas.filter(f => f.tipo === 'ingreso' && f.categoria !== 'Caja Chica')
  const gastos = finanzas.filter(f => f.tipo === 'gasto' && f.categoria !== 'Caja Chica' && f.fuente !== 'gasto_fijo')
  const cajaChicaMovs = finanzas.filter(f => f.categoria === 'Caja Chica').sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  const cajaChicaBalance = cajaChicaMovs.reduce((a, f) => a + (f.tipo === 'ingreso' ? f.monto : -f.monto), 0)
  const pendientes = mantenimientos.filter(m => m.estado !== 'completado')
  const completados = mantenimientos.filter(m => m.estado === 'completado')
  const gananciaAnimada = useCountUp(resumen?.ganancia_neta ?? 0)
  const gananciaAnualAnimada = useCountUp(resumenAnual?.ganancia_neta_anual ?? 0)
  const trendData = monthlyNetSeries(finanzas, 6)
  const reservasPorMes = groupByMonth(reservaciones)

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
      <div style={{ ...s.header, background: `linear-gradient(180deg, ${BG} 0%, ${BG}ee 100%)`, backdropFilter: 'blur(6px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: `1px solid ${BD}`, background: '#0d0b09' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Villa Sera" style={{ width: '100%', height: '230%', objectFit: 'cover', objectPosition: '50% 6%', display: 'block' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, letterSpacing: '0.02em', color: TX, lineHeight: 1.1, whiteSpace: 'nowrap' }}>Villa Será</div>
            <div style={{ fontSize: 8.5, letterSpacing: '0.22em', color: G, textTransform: 'uppercase' }}>Administración</div>
          </div>
          <select value={pid ?? ''} onChange={e => changeProp(Number(e.target.value))}
            style={{ background: C2, border: `1px solid ${BD}`, color: TX, padding: '4px 8px', borderRadius: 6, fontSize: 12, marginLeft: 4 }}>
            {propiedades.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div className={online ? 'vs-live-dot' : ''} style={{ width: 7, height: 7, borderRadius: '50%', background: online ? GR : RD }} />
            <span style={{ fontSize: 11, color: online ? GR : RD }}>{online ? 'online' : 'offline'}</span>
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
            <div className="vs-fade-item vs-card" style={{ ...s.card, textAlign: 'center', marginBottom: 16, background: `radial-gradient(120% 100% at 50% 0%, ${C2} 0%, ${C1} 60%)`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 2, background: `linear-gradient(90deg, transparent, ${G}, transparent)` }} />
              <div style={s.lbl}>Ganancia Neta del Mes</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 600, fontSize: 46, color: gananciaAnimada >= 0 ? G : RD, lineHeight: 1.1 }}>
                {gananciaAnimada < 0 ? '-' : ''}{usd(gananciaAnimada)}
              </div>
              <div style={{ fontSize: 12, color: MU, marginTop: 6 }}>
                {usd(resumen.ingresos_mes)} ingresos − {usd(resumen.gastos_mes)} gastos
              </div>
              <TrendChart data={trendData} color={net => net >= 0 ? G : RD} />
            </div>

            {/* Ganancia neta anual (YTD) */}
            {resumenAnual && (
              <div className="vs-fade-item vs-card" style={{ ...s.card, textAlign: 'center', marginBottom: 16, animationDelay: '80ms' }}>
                <div style={s.lbl}>Ganancia Neta {resumenAnual.year} (acumulado)</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 600, fontSize: 30, color: gananciaAnualAnimada >= 0 ? G : RD, lineHeight: 1.1 }}>
                  {gananciaAnualAnimada < 0 ? '-' : ''}{usd(gananciaAnualAnimada)}
                </div>
                <div style={{ fontSize: 12, color: MU, marginTop: 6 }}>
                  {usd(resumenAnual.ingresos_anual)} ingresos − {usd(resumenAnual.gastos_variables_anual + resumenAnual.gastos_fijos_anual)} gastos · {resumenAnual.meses_transcurridos} meses
                </div>
              </div>
            )}

            {/* KPI grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { lbl: 'Ingresos', val: usd(resumen.ingresos_mes), color: GR },
                { lbl: 'Gastos Fijos', val: usd(resumen.gastos_fijos_mes), color: RD },
                { lbl: 'Gastos Variables', val: usd(resumen.gastos_variables_mes), color: AM },
                { lbl: 'Ocupación', val: `${resumen.ocupacion_porcentaje}%`, color: OC },
              ].map(({ lbl, val, color }) => (
                <div key={lbl} style={{ ...s.card, textAlign: 'center' }}>
                  <div style={s.lbl}>{lbl}</div>
                  <div style={{ fontSize: 22, color, fontFamily: FONT_DISPLAY }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Caja Chica quick view */}
            <div onClick={() => { setTab('finanzas'); setFinTab('caja') }}
              style={{ ...s.card, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={s.lbl}>Caja Chica</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: cajaChicaBalance >= 0 ? G : RD }}>{usd(cajaChicaBalance)}</div>
              </div>
              <span style={{ color: MU, fontSize: 20 }}>›</span>
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
                        className="vs-btn" style={{ ...s.btnSm(GR, '#000'), fontSize: 18, padding: '4px 10px' }}>✓</button>
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
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: GR }}>{r.monto_total ? usd(r.monto_total) : '—'}</div>
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
                <button onClick={() => setModal('csv')} className="vs-btn" style={s.btnSm('#1a1a1a', G)}>↑ Airbnb CSV</button>
                <button onClick={() => setModal('reservacion')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Nueva</button>
              </div>
            </div>
            {reservasPorMes.map(([key, items], gi) => {
              const isCurrent = key === CURRENT_MONTH_KEY
              const isPast = key < CURRENT_MONTH_KEY
              const expanded = expandedMonths.has(key)
              const subtotal = items.reduce((a, r) => a + (r.monto_total || 0), 0)
              return (
                <div key={key} className="vs-fade-item" style={{ marginBottom: 6, animationDelay: `${gi * 50}ms` }}>
                  <button onClick={() => toggleMonth(key)} className="vs-btn" style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: isCurrent ? `${G}12` : 'none', border: `1px solid ${isCurrent ? G + '40' : BD}`,
                    borderRadius: 10, padding: '12px 14px', cursor: 'pointer', marginBottom: 8,
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: isCurrent ? G : TX, textTransform: 'capitalize' }}>{monthLabel(key)}</span>
                      {isCurrent && <span style={s.badge(G)}>ESTE MES</span>}
                      {isPast && <span style={{ fontSize: 10, color: MU }}>· cerrado</span>}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: GR }}>{usd(subtotal)}</span>
                      <span style={{ color: MU, fontSize: 13, display: 'inline-block', transition: 'transform 0.25s', transform: expanded ? 'rotate(90deg)' : 'none' }}>›</span>
                    </span>
                  </button>
                  <div className="vs-accordion" style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}>
                    <div>
                      {items.map(r => (
                        <div key={r.id} className="vs-card" style={{ ...s.card, marginBottom: 10 }}>
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
                              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: GR }}>{r.monto_total ? usd(r.monto_total) : '—'}</div>
                              <div style={s.badge(r.estado === 'confirmada' ? GR : r.estado === 'completada' ? OC : MU)}>{r.estado}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                            <button onClick={async () => { await api.delete(`/api/reservaciones/${r.id}`); loadAll() }}
                              style={{ ...s.btnGhost, color: RD, borderColor: RD + '40' }}>Eliminar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
            {reservaciones.length === 0 && <Empty msg="No hay reservaciones" />}
          </div>
        )}

        {/* ── FINANZAS TAB ── */}
        {tab === 'finanzas' && (
          <div>
            {/* Sub-tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${BD}`, marginBottom: 16, padding: '0 16px' }}>
              {([['ingresos', 'Ingresos'], ['fijos', 'Gastos Fijos'], ['gastos', 'Variables'], ['caja', 'Caja Chica']] as [FinTab, string][]).map(([key, lbl]) => (
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
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: GR }}>{usd(ingresos.reduce((a, f) => a + f.monto, 0))}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setModal('csv')} className="vs-btn" style={s.btnSm('#1a1a1a', G)}>↑ Airbnb</button>
                      <button onClick={() => setModal('ingreso')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Agregar</button>
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
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: RD }}>{usd(gastosFijos.reduce((a, g) => a + g.monto, 0))}</div>
                    </div>
                    <button onClick={() => setModal('gasto_fijo')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Agregar</button>
                  </div>
                  {gastosFijos.filter(g => !isPagadoEstePeriodo(g.ultimo_pago)).length > 0 && (
                    <div style={{ ...s.lbl, color: RD, marginBottom: 8 }}>
                      {gastosFijos.filter(g => !isPagadoEstePeriodo(g.ultimo_pago)).length} pendientes de pago este mes
                    </div>
                  )}
                  {[...gastosFijos].sort((a, b) => (a.dia_cobro ?? 99) - (b.dia_cobro ?? 99)).map(g => {
                    const pagado = isPagadoEstePeriodo(g.ultimo_pago)
                    return (
                      <div key={g.id} style={{ ...s.card, marginBottom: 10, borderLeft: `3px solid ${pagado ? GR : G}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 15, fontWeight: 600 }}>{g.nombre}</span>
                              <span style={s.badge(pagado ? GR : G)}>{pagado ? 'Pagado' : 'Pendiente'}</span>
                            </div>
                            <div style={{ fontSize: 12, color: MU }}>{g.categoria}{g.dia_cobro ? ` · día ${g.dia_cobro}` : ''}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: RD }}>{usd(pagado && g.ultimo_monto_pagado ? g.ultimo_monto_pagado : g.monto)}</div>
                              {pagado && g.ultimo_monto_pagado != null && g.ultimo_monto_pagado !== g.monto && (
                                <div style={{ fontSize: 11, color: MU }}>Est: {usd(g.monto)}</div>
                              )}
                            </div>
                            <button onClick={async () => { await api.delete(`/api/gastos-fijos/${g.id}`); loadAll() }}
                              style={{ background: 'none', border: 'none', color: RD + '80', cursor: 'pointer', fontSize: 18 }}>×</button>
                          </div>
                        </div>
                        <button onClick={async () => {
                          if (pagado) { await api.patch(`/api/gastos-fijos/${g.id}/despagar`); loadAll() }
                          else { setPagandoGasto(g); setModal('pagar_gasto_fijo') }
                        }}
                          className="vs-btn" style={{ ...s.btnSm(pagado ? '#1a1a1a' : GR, pagado ? MU : '#000'), width: '100%', marginTop: 10 }}>
                          {pagado ? 'Marcar como pendiente' : '✓ Marcar como pagado'}
                        </button>
                      </div>
                    )
                  })}
                  {gastosFijos.length === 0 && <Empty msg="Sin gastos fijos registrados" />}
                </>
              )}

              {/* GASTOS VARIABLES */}
              {finTab === 'gastos' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: AM }}>{usd(gastos.reduce((a, f) => a + f.monto, 0))}</div>
                    <button onClick={() => setModal('gasto')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Agregar</button>
                  </div>
                  {gastos.map(f => <FinanzaRow key={f.id} f={f} onDelete={() => { api.delete(`/api/finanzas/${f.id}`).then(() => loadAll()) }} />)}
                  {gastos.length === 0 && <Empty msg="Sin gastos variables" />}
                </>
              )}

              {/* CAJA CHICA */}
              {finTab === 'caja' && (
                <>
                  <div style={{ ...s.card, textAlign: 'center', marginBottom: 16, background: 'linear-gradient(135deg,#111,#1a1400)' }}>
                    <div style={s.lbl}>Saldo de Caja Chica</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 40, color: cajaChicaBalance >= 0 ? G : RD, lineHeight: 1.1 }}>
                      {usd(cajaChicaBalance)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <button onClick={() => setModal('caja_ingreso')} className="vs-btn" style={{ ...s.btn(GR, '#000'), flex: 1 }}>+ Agregar fondos</button>
                    <button onClick={() => setModal('caja_gasto')} className="vs-btn" style={{ ...s.btn(AM, '#000'), flex: 1 }}>− Registrar gasto</button>
                  </div>
                  <div style={s.lbl}>Movimientos</div>
                  {cajaChicaMovs.map(f => <FinanzaRow key={f.id} f={f} onDelete={() => { api.delete(`/api/finanzas/${f.id}`).then(() => loadAll()) }} />)}
                  {cajaChicaMovs.length === 0 && <Empty msg="Sin movimientos de caja chica" />}
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
                    <span style={{ color: AM, fontSize: 13 }}>−{usd(resumen.gastos_variables_mes)}</span>
                  </div>
                  <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Ganancia Neta</span>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: resumen.ganancia_neta >= 0 ? G : RD, fontWeight: 600 }}>
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
              <button onClick={() => setModal('mantenimiento')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Nuevo</button>
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
                          className="vs-btn" style={{ ...s.btn(GR, '#000'), padding: '8px 14px', fontSize: 18 }}>✓</button>
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
              <button onClick={() => setModal('compra')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Agregar</button>
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
                          className="vs-btn" style={{ ...s.btn(GR, '#000'), padding: '8px 14px', fontSize: 18 }}>✓</button>
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

        {/* ── INVENTARIO TAB ── */}
        {tab === 'inventario' && (
          <div style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...s.lbl, marginBottom: 0 }}>{inventario.length} artículos</span>
              <button onClick={() => setModal('inventario')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Agregar</button>
            </div>

            {inventario.filter(i => i.estado === 'faltante').length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ ...s.lbl, color: RD }}>⚠ Faltantes</div>
                {inventario.filter(i => i.estado === 'faltante').map(i => (
                  <InventarioRow key={i.id} i={i}
                    onEstado={async e => { await api.patch(`/api/inventario/${i.id}/estado?estado=${e}`); loadAll() }}
                    onDelete={async () => { await api.delete(`/api/inventario/${i.id}`); loadAll() }} />
                ))}
              </div>
            )}

            {Object.entries(
              inventario.filter(i => i.estado !== 'faltante').reduce((acc: Record<string, InventarioItem[]>, i) => {
                (acc[i.categoria] ??= []).push(i); return acc
              }, {})
            ).sort(([a], [b]) => a.localeCompare(b)).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={s.lbl}>{cat} ({items.length})</div>
                {items.map(i => (
                  <InventarioRow key={i.id} i={i}
                    onEstado={async e => { await api.patch(`/api/inventario/${i.id}/estado?estado=${e}`); loadAll() }}
                    onDelete={async () => { await api.delete(`/api/inventario/${i.id}`); loadAll() }} />
                ))}
              </div>
            ))}

            {inventario.length === 0 && <Empty msg="Sin artículos en inventario" />}
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
          ['inventario', '▤', 'Inventario'],
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
        <Modal onClose={() => { setModal(null); setCsvResult(null); setCsvFile(null); setPagandoGasto(null) }}>
          {/* CSV Import */}
          {modal === 'csv' && (
            <div>
              <ModalTitle>Importar Airbnb CSV</ModalTitle>
              <p style={{ fontSize: 13, color: MU, marginBottom: 16 }}>Descarga el reporte de Airbnb en formato CSV desde Reservaciones → Historial de transacciones → Exportar.</p>
              <input ref={csvRef} type="file" accept=".csv" onChange={e => setCsvFile(e.target.files?.[0] ?? null)}
                style={{ ...s.inp, padding: '8px', color: MU, marginBottom: 12 }} />
              {csvResult && <div style={{ padding: '10px 12px', background: csvResult.startsWith('✓') ? GR + '15' : RD + '15', borderRadius: 8, fontSize: 13, color: csvResult.startsWith('✓') ? GR : RD, marginBottom: 12 }}>{csvResult}</div>}
              <button onClick={importCSV} disabled={!csvFile || csvLoading} className="vs-btn vs-btn-gold" style={{ ...s.btn(), width: '100%', opacity: csvFile ? 1 : 0.5 }}>
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

          {/* Caja Chica */}
          {modal === 'caja_ingreso' && pid && (
            <FormFinanza pid={pid} tipo="ingreso" categoriaFija="Caja Chica" onSaved={() => { setModal(null); loadAll() }} />
          )}
          {modal === 'caja_gasto' && pid && (
            <FormFinanza pid={pid} tipo="gasto" categoriaFija="Caja Chica" onSaved={() => { setModal(null); loadAll() }} />
          )}

          {/* Nuevo Gasto Fijo */}
          {modal === 'gasto_fijo' && pid && (
            <FormGastoFijo pid={pid} onSaved={() => { setModal(null); loadAll() }} />
          )}

          {/* Nueva Compra */}
          {modal === 'compra' && pid && (
            <FormCompra pid={pid} onSaved={() => { setModal(null); loadAll() }} />
          )}

          {/* Nuevo Artículo de Inventario */}
          {modal === 'inventario' && pid && (
            <FormInventario pid={pid} onSaved={() => { setModal(null); loadAll() }} />
          )}

          {/* Marcar Gasto Fijo como Pagado */}
          {modal === 'pagar_gasto_fijo' && pagandoGasto && (
            <FormPagarGastoFijo gasto={pagandoGasto} onSaved={() => { setModal(null); setPagandoGasto(null); loadAll() }} />
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
          {f.comprobante_nombre && <div style={{ fontSize: 11, color: OC, marginTop: 2 }}>📎 {f.comprobante_nombre}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: isIngreso ? GR : AM }}>
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

function FormFinanza({ pid, tipo, categoriaFija, onSaved }: { pid: number; tipo: string; categoriaFija?: string; onSaved: () => void }) {
  const [v, setV] = useState({ descripcion: '', categoria: categoriaFija ?? (tipo === 'ingreso' ? 'Renta' : 'Mantenimiento'), monto: '', fecha: new Date().toISOString().split('T')[0], notas: '' })
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
      <ModalTitle>{categoriaFija ? (tipo === 'ingreso' ? 'Agregar Fondos — Caja Chica' : 'Registrar Gasto — Caja Chica') : tipo === 'ingreso' ? 'Nuevo Ingreso' : 'Nuevo Gasto'}</ModalTitle>
      <label style={lbl}>Descripción *</label>
      <input required style={inp} placeholder={categoriaFija ? 'Ej: Reparación triturador de alimentos' : undefined} value={v.descripcion} onChange={e => setV({ ...v, descripcion: e.target.value })} />
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
      {!categoriaFija && (
        <>
          <label style={lbl}>Categoría</label>
          <select style={inp} value={v.categoria} onChange={e => setV({ ...v, categoria: e.target.value })}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
        </>
      )}
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

function InventarioRow({ i, onEstado, onDelete }: { i: InventarioItem; onEstado: (estado: string) => void; onDelete: () => void }) {
  const color = i.estado === 'faltante' ? RD : i.estado === 'dañado' ? AM : GR
  return (
    <div style={{ background: C1, border: `1px solid ${BD}`, borderRadius: 10, padding: '12px 14px', marginBottom: 8, borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{i.articulo}</span>
            {i.cantidad > 1 && <span style={{ fontSize: 12, color: MU }}>×{i.cantidad}</span>}
          </div>
          {i.notas && <div style={{ fontSize: 12, color: MU }}>{i.notas}</div>}
          <div style={{ fontSize: 12, color: MU, marginTop: 2 }}>
            {i.costo ? `$${i.costo.toLocaleString()}` : ''}
            {i.ubicacion ? ` · ${i.ubicacion}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <select value={i.estado} onChange={e => onEstado(e.target.value)}
            style={{ background: color + '20', color, border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600 }}>
            <option value="disponible">Disponible</option>
            <option value="faltante">Faltante</option>
            <option value="dañado">Dañado</option>
          </select>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', color: RD + '60', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      </div>
    </div>
  )
}

function FormInventario({ pid, onSaved }: { pid: number; onSaved: () => void }) {
  const [v, setV] = useState({ articulo: '', categoria: 'Herramientas', cantidad: '1', estado: 'disponible', costo: '', ubicacion: '', notas: '' })
  const [loading, setLoading] = useState(false)
  const inp: React.CSSProperties = { width: '100%', background: '#0f0f0f', border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
  const lbl: React.CSSProperties = { fontSize: 11, color: MU, display: 'block', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      await api.post('/api/inventario', {
        propiedad_id: pid,
        articulo: v.articulo,
        categoria: v.categoria,
        cantidad: parseInt(v.cantidad) || 1,
        estado: v.estado,
        costo: v.costo ? parseFloat(v.costo) : null,
        ubicacion: v.ubicacion || null,
        notas: v.notas || null,
      })
      onSaved()
    } finally { setLoading(false) }
  }
  return (
    <form onSubmit={submit}>
      <ModalTitle>Nuevo Artículo de Inventario</ModalTitle>
      <label style={lbl}>Artículo *</label>
      <input required style={inp} placeholder="Ej: Llave Trox" value={v.articulo} onChange={e => setV({ ...v, articulo: e.target.value })} />
      <label style={lbl}>Notas</label>
      <input style={inp} placeholder="Para qué sirve, detalles..." value={v.notas} onChange={e => setV({ ...v, notas: e.target.value })} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={lbl}>Cantidad</label>
          <input type="number" min="1" style={inp} value={v.cantidad} onChange={e => setV({ ...v, cantidad: e.target.value })} />
        </div>
        <div>
          <label style={lbl}>Costo (opcional)</label>
          <input type="number" step="0.01" style={inp} placeholder="0.00" value={v.costo} onChange={e => setV({ ...v, costo: e.target.value })} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={lbl}>Categoría</label>
          <select style={inp} value={v.categoria} onChange={e => setV({ ...v, categoria: e.target.value })}>
            {['Herramientas', 'Cocina', 'Blancos', 'Alberca', 'Limpieza', 'Electrónica', 'Mobiliario', 'Jardín', 'Otro'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Estado</label>
          <select style={inp} value={v.estado} onChange={e => setV({ ...v, estado: e.target.value })}>
            <option value="disponible">Disponible</option>
            <option value="faltante">Faltante</option>
            <option value="dañado">Dañado</option>
          </select>
        </div>
      </div>
      <label style={lbl}>Ubicación (opcional)</label>
      <input style={inp} placeholder="Ej: Bodega, Cocina, Alberca" value={v.ubicacion} onChange={e => setV({ ...v, ubicacion: e.target.value })} />
      <button type="submit" disabled={loading} style={{ background: G, color: BG, border: 'none', padding: 14, borderRadius: 10, width: '100%', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}

function FormPagarGastoFijo({ gasto, onSaved }: { gasto: GastoFijo; onSaved: () => void }) {
  const [porVeces, setPorVeces] = useState(false)
  const [monto, setMonto] = useState(String(gasto.monto))
  const [costoUnitario, setCostoUnitario] = useState(String(gasto.monto))
  const [veces, setVeces] = useState('1')
  const [loading, setLoading] = useState(false)
  const inp: React.CSSProperties = { width: '100%', background: '#0f0f0f', border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
  const lbl: React.CSSProperties = { fontSize: 11, color: MU, display: 'block', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }
  const total = porVeces ? (parseFloat(costoUnitario) || 0) * (parseInt(veces) || 0) : (parseFloat(monto) || 0)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      let url = `/api/gastos-fijos/${gasto.id}/pagar?monto_real=${total}`
      if (porVeces) url += `&detalle=${encodeURIComponent(`${veces}x $${costoUnitario}`)}`
      await api.patch(url)
      onSaved()
    } finally { setLoading(false) }
  }
  return (
    <form onSubmit={submit}>
      <ModalTitle>Marcar como Pagado</ModalTitle>
      <p style={{ fontSize: 13, color: MU, marginBottom: 16 }}>{gasto.nombre} — confirma cuánto llegó realmente (puede diferir del estimado, como agua, luz o limpieza).</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" onClick={() => setPorVeces(false)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${!porVeces ? G : BD}`, background: !porVeces ? G + '15' : 'none', color: !porVeces ? G : MU, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Monto único</button>
        <button type="button" onClick={() => setPorVeces(true)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${porVeces ? G : BD}`, background: porVeces ? G + '15' : 'none', color: porVeces ? G : MU, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Por veces pagado</button>
      </div>

      {!porVeces ? (
        <>
          <label style={lbl}>Monto pagado (MXN) *</label>
          <input required autoFocus type="number" step="0.01" style={inp} value={monto} onChange={e => setMonto(e.target.value)} />
        </>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={lbl}>Costo por servicio *</label>
              <input required autoFocus type="number" step="0.01" style={inp} value={costoUnitario} onChange={e => setCostoUnitario(e.target.value)} />
            </div>
            <div>
              <label style={lbl}>¿Cuántas veces? *</label>
              <input required type="number" min="1" style={inp} value={veces} onChange={e => setVeces(e.target.value)} />
            </div>
          </div>
          <div style={{ ...inp, background: '#0d0d0d', color: MU, marginBottom: 16, textAlign: 'center' }}>
            Total: <span style={{ color: G, fontWeight: 700 }}>{usd(total)}</span>
          </div>
        </>
      )}

      <button type="submit" disabled={loading} style={{ background: GR, color: '#000', border: 'none', padding: 14, borderRadius: 10, width: '100%', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Guardando...' : '✓ Confirmar Pago'}
      </button>
    </form>
  )
}
