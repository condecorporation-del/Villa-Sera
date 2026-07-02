'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api, logout, checkHealth } from '@/lib/admin-api'

// ── THEME ─────────────────────────────────────────────────
// Villa Sera brand tokens — light, vivid console matching the public site's
// actual cream canvas, with saturated accent colors instead of muted/dark ones
const G = '#CFA23B'        // gold — brand accent, CTAs
const GL = '#E8C874'       // gold light — hover/highlight/gradient top
const BG = '#FAF6EE'       // cream canvas
const C1 = '#FFFFFF'       // card surface (white, elevated via shadow not border)
const C2 = '#F4ECDD'       // surface-2 — inputs / chips / recessed areas
const BD = '#D9C9AA'       // hairline border — stronger so cards read as distinct objects
const TX = '#211A14'       // espresso ink — primary text
const MU = '#5B4D42'       // warm grey-brown — secondary text (darkened further for visibility)
const GR = '#278049'       // vivid meadow green — positive figures (deepened to hold up at small sizes)
const RD = '#D03F2C'       // vivid coral-terracotta — negative/expense
const OC = '#0F8AA8'       // vivid turquoise-ocean — informational accent
const AM = '#C97A0F'       // vivid amber — variable-expense distinction
const SH = '0 1px 3px rgba(33,26,20,0.07), 0 14px 32px -14px rgba(33,26,20,0.26)'
const FONT_DISPLAY = "'Cormorant Garamond', Georgia, serif"

// ── ICONS ─────────────────────────────────────────────────
// A small hand-picked line-icon set (stroke=currentColor) instead of unicode
// glyphs/emoji, which render inconsistently across devices and read as
// pasted-on "stickers" rather than a designed interface.
type IconName = 'home' | 'calendar' | 'wallet' | 'wrench' | 'bag' | 'archive' | 'alert' | 'paperclip' | 'check' | 'close' | 'chevron'
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 2.2 }: { name: IconName; size?: number; color?: string; strokeWidth?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'home':
      return <svg {...common}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" /></svg>
    case 'calendar':
      return <svg {...common}><rect x="3.5" y="5" width="17" height="16" rx="2.2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
    case 'wallet':
      return <svg {...common}><path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h11a1.5 1.5 0 0 1 1.5 1.5V8" /><rect x="3.5" y="8" width="17" height="12" rx="2" /><circle cx="15.5" cy="14" r="1.3" fill={color} stroke="none" /></svg>
    case 'wrench':
      return <svg {...common}><path d="M14.7 6.3a4 4 0 0 0-5.4 4.6L4 16.2V20h3.8l5.3-5.3a4 4 0 0 0 4.6-5.4l-2.6 2.6-2-2Z" /></svg>
    case 'bag':
      return <svg {...common}><path d="M6 8h12l1 12.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5L6 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
    case 'archive':
      return <svg {...common}><rect x="3.5" y="4.5" width="17" height="4.5" rx="1.2" /><path d="M4.5 9v9a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V9" /><path d="M10 13h4" /></svg>
    case 'alert':
      return <svg {...common}><path d="M12 3.5 2.5 20h19L12 3.5Z" /><path d="M12 10v4.2" /><circle cx="12" cy="17" r="0.6" fill={color} stroke="none" /></svg>
    case 'paperclip':
      return <svg {...common}><path d="M17 8.5 9.3 16.2a2.7 2.7 0 1 1-3.8-3.8l7.9-7.9a4.2 4.2 0 1 1 6 6L11 19" /></svg>
    case 'check':
      return <svg {...common}><path d="M4.5 12.5 9.5 17.5 19.5 6.5" /></svg>
    case 'close':
      return <svg {...common}><path d="M5 5l14 14M19 5 5 19" /></svg>
    case 'chevron':
      return <svg {...common}><path d="M9 5.5 15.5 12 9 18.5" /></svg>
  }
}

// ── TYPES ─────────────────────────────────────────────────
type Tab = 'dashboard' | 'reservas' | 'finanzas' | 'mantenimiento' | 'compras' | 'inventario'
type FinTab = 'ingresos' | 'fijos' | 'gastos' | 'caja'
const NAV_ITEMS: [Tab, IconName, string][] = [
  ['dashboard', 'home', 'Inicio'],
  ['reservas', 'calendar', 'Reservas'],
  ['finanzas', 'wallet', 'Finanzas'],
  ['mantenimiento', 'wrench', 'Manten.'],
  ['compras', 'bag', 'Compras'],
  ['inventario', 'archive', 'Inventario'],
]

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
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
  }
  return d
}
function TrendChart({ data, positiveColor, negativeColor, mutedColor }: { data: { key: string; label: string; ingresos: number; gastos: number }[]; positiveColor: string; negativeColor: string; mutedColor: string }) {
  const nets = data.map(d => d.ingresos - d.gastos)
  const max = Math.max(1, ...nets.map(n => Math.abs(n)))
  const W = 300, H = 74, PADX = 6, PADY = 14
  const stepX = data.length > 1 ? (W - PADX * 2) / (data.length - 1) : 0
  const pts = nets.map((n, i) => ({
    x: PADX + i * stepX,
    y: PADY + (1 - (n / max + 1) / 2) * (H - PADY * 2),
  }))
  const lineColor = nets[nets.length - 1] >= 0 ? positiveColor : negativeColor
  const gid = 'vsGrad'
  const linePath = smoothPath(pts)
  const areaPath = `${linePath} L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`
  return (
    <div style={{ marginTop: 14 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={84} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.32" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={PADX} y1={H / 2} x2={W - PADX} y2={H / 2} stroke={mutedColor} strokeOpacity="0.25" strokeDasharray="3 4" />
        <path d={areaPath} fill={`url(#${gid})`} className="vs-fade-item" style={{ animationDelay: '120ms' }} />
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="vs-fade-item" style={{ animationDelay: '60ms' }} />
        {pts.map((p, i) => {
          const isLast = i === pts.length - 1
          return (
            <circle key={data[i].key} cx={p.x} cy={p.y} r={isLast ? 4 : 2.5}
              fill={isLast ? lineColor : C1} stroke={lineColor} strokeWidth={isLast ? 0 : 1.6}
              className={isLast ? 'vs-live-dot' : ''} />
          )
        })}
      </svg>
      <div style={{ display: 'flex', marginTop: 4 }}>
        {data.map((d, i) => (
          <span key={d.key} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: mutedColor, textTransform: 'capitalize', opacity: i === data.length - 1 ? 1 : 0.65, fontWeight: i === data.length - 1 ? 700 : 500 }}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}
function OccupancyRing({ pct, color, trackColor }: { pct: number; color: string; trackColor: string }) {
  const size = 76, stroke = 7, r = (size - stroke) / 2, c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (clamped / 100) * c}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 20, color }}>
        {Math.round(clamped)}%
      </div>
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
  const proximasReservas = reservaciones
    .filter(r => new Date(r.check_in) > new Date() && r.estado !== 'cancelada')
    .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
    .slice(0, 3)

  // ── STYLES ──────────────────────────────────────────────
  const s = {
    wrap: { minHeight: '100vh', background: BG, color: TX, fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif", paddingBottom: 80 } as React.CSSProperties,
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${BD}`, position: 'sticky' as const, top: 0, background: BG, zIndex: 50 },
    card: { background: C1, border: `1px solid ${BD}`, borderRadius: 14, padding: '16px', boxShadow: SH } as React.CSSProperties,
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${BD}` } as React.CSSProperties,
    btn: (color = G, text = '#231A10') => ({ background: color, color: text, border: 'none', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700 } as React.CSSProperties),
    btnSm: (color = G, text = '#231A10') => ({ background: color, color: text, border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 } as React.CSSProperties),
    btnGhost: { background: C2, border: `1px solid ${BD}`, color: MU, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 } as React.CSSProperties,
    lbl: { fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: MU, marginBottom: 5, display: 'block', fontWeight: 700 },
    inp: { width: '100%', background: C2, border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 15, fontWeight: 500, boxSizing: 'border-box' as const },
    section: { padding: '0 16px' } as React.CSSProperties,
    badge: (c: string) => ({ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: c + '20', color: c, fontWeight: 600 }) as React.CSSProperties,
  }

  return (
    <div className="vs-root vs-wrap-pad" style={s.wrap}>
      {/* Header */}
      <div className="vs-container" style={{ ...s.header, background: `linear-gradient(180deg, ${BG} 0%, ${BG}ee 100%)`, backdropFilter: 'blur(6px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: `1px solid ${BD}`, background: '#0d0b09' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Villa Sera" style={{ width: '100%', height: '230%', objectFit: 'cover', objectPosition: '50% 6%', display: 'block' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, letterSpacing: '0.02em', color: TX, lineHeight: 1.1, whiteSpace: 'nowrap' }}>Villa Será</div>
            <div className="vs-hide-xs" style={{ fontSize: 8.5, letterSpacing: '0.22em', color: G, textTransform: 'uppercase' }}>Administración</div>
          </div>
          <select value={pid ?? ''} onChange={e => changeProp(Number(e.target.value))}
            style={{ background: C2, border: `1px solid ${BD}`, color: TX, padding: '4px 8px', borderRadius: 6, fontSize: 13, marginLeft: 4, maxWidth: 96, textOverflow: 'ellipsis' }}>
            {propiedades.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div className={online ? 'vs-live-dot' : ''} style={{ width: 7, height: 7, borderRadius: '50%', background: online ? GR : RD }} />
            <span className="vs-hide-xs" style={{ fontSize: 11, color: online ? GR : RD }}>{online ? 'online' : 'offline'}</span>
          </div>
          <button onClick={() => { logout(); router.replace('/admin') }} style={s.btnGhost}>Salir</button>
        </div>
      </div>

      {/* ── DESKTOP TOP NAV (tablet/desktop only — see .vs-desktop-nav) ── */}
      <div className="vs-desktop-nav" style={{ borderBottom: `1px solid ${BD}`, background: BG }}>
        <div className="vs-container" style={{ display: 'flex', gap: 28, paddingTop: 2 }}>
          {NAV_ITEMS.map(([key, icon, lbl]) => (
            <button key={key} onClick={() => setTab(key)} className="vs-btn vs-desktop-nav-item" data-active={tab === key}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '13px 2px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
              <Icon name={icon} size={17} color={tab === key ? G : MU} />
              <span style={{ fontSize: 14, color: tab === key ? TX : MU, fontWeight: tab === key ? 700 : 600 }}>{lbl}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="vs-container" style={{ paddingTop: 16 }}>

        {/* ── DASHBOARD TAB ── */}
        {tab === 'dashboard' && resumen && (
          <div className="vs-fade-item" style={s.section}>
            <div className="vs-hero-grid">
            {/* Ganancia neta — headline */}
            <div className="vs-fade-item vs-card vs-card-hover" style={{ ...s.card, textAlign: 'center', marginBottom: 16, background: `radial-gradient(120% 100% at 50% 0%, ${C2} 0%, ${C1} 60%)`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 2, background: `linear-gradient(90deg, transparent, ${G}, transparent)` }} />
              <div style={s.lbl}>Ganancia Neta del Mes</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(34px, 8vw, 56px)', color: gananciaAnimada >= 0 ? G : RD, lineHeight: 1.1 }}>
                {gananciaAnimada < 0 ? '-' : ''}{usd(gananciaAnimada)}
              </div>
              <div style={{ fontSize: 14, color: MU, marginTop: 6, fontWeight: 600 }}>
                {usd(resumen.ingresos_mes)} ingresos − {usd(resumen.gastos_mes)} gastos
              </div>
              <TrendChart data={trendData} positiveColor={GR} negativeColor={RD} mutedColor={MU} />
            </div>

            {/* Ganancia neta anual (YTD) */}
            {resumenAnual && (
              <div className="vs-fade-item vs-card vs-card-hover" style={{ ...s.card, textAlign: 'center', marginBottom: 16, animationDelay: '80ms', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={s.lbl}>Ganancia Neta {resumenAnual.year} (acumulado)</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(26px, 6vw, 38px)', color: gananciaAnualAnimada >= 0 ? G : RD, lineHeight: 1.1 }}>
                  {gananciaAnualAnimada < 0 ? '-' : ''}{usd(gananciaAnualAnimada)}
                </div>
                <div style={{ fontSize: 14, color: MU, marginTop: 6, fontWeight: 600 }}>
                  {usd(resumenAnual.ingresos_anual)} ingresos − {usd(resumenAnual.gastos_variables_anual + resumenAnual.gastos_fijos_anual)} gastos · {resumenAnual.meses_transcurridos} meses
                </div>
              </div>
            )}
            </div>

            {/* KPI grid */}
            <div className="vs-kpi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { lbl: 'Ingresos', val: usd(resumen.ingresos_mes), color: GR },
                { lbl: 'Gastos Fijos', val: usd(resumen.gastos_fijos_mes), color: RD },
                { lbl: 'Gastos Variables', val: usd(resumen.gastos_variables_mes), color: AM },
              ].map(({ lbl, val, color }, i) => (
                <div key={lbl} className="vs-fade-item vs-card vs-card-hover" style={{ ...s.card, textAlign: 'center', animationDelay: `${i * 60}ms` }}>
                  <div style={s.lbl}>{lbl}</div>
                  <div style={{ fontSize: 24, color, fontFamily: FONT_DISPLAY, fontWeight: 600 }}>{val}</div>
                </div>
              ))}
              <div className="vs-fade-item vs-card" style={{ ...s.card, textAlign: 'center', animationDelay: '180ms', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={s.lbl}>Ocupación</div>
                <OccupancyRing pct={resumen.ocupacion_porcentaje} color={OC} trackColor={BD} />
              </div>
            </div>

            {/* Caja Chica quick view */}
            <div onClick={() => { setTab('finanzas'); setFinTab('caja') }}
              className="vs-card-hover" style={{ ...s.card, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={s.lbl}>Caja Chica</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: cajaChicaBalance >= 0 ? G : RD }}>{usd(cajaChicaBalance)}</div>
              </div>
              <Icon name="chevron" size={16} color={MU} />
            </div>

            {/* Upcoming maintenance alerts */}
            {pendientes.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ ...s.lbl, marginBottom: 8 }}>Mantenimientos Pendientes</div>
                {pendientes.slice(0, 3).map(m => (
                  <div key={m.id} className="vs-card-hover" style={{ ...s.card, marginBottom: 8, borderLeft: `3px solid ${m.prioridad === 'alta' ? RD : m.prioridad === 'media' ? G : GR}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{m.titulo}</div>
                        {m.fecha_programada && (
                          <div style={{ fontSize: 13, color: isOverdue(m.fecha_programada) ? RD : MU, marginTop: 2 }}>
                            {isOverdue(m.fecha_programada) ? 'Vencido — ' : ''}{fDateLong(m.fecha_programada)}
                          </div>
                        )}
                      </div>
                      <button onClick={async () => { await api.patch(`/api/mantenimientos/${m.id}/completar`); loadAll() }}
                        className="vs-btn" style={{ ...s.btnSm(GR, '#000'), padding: '4px 10px', display: 'flex' }}><Icon name="check" size={14} color="#000" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Next check-ins */}
            {proximasReservas.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ ...s.lbl, marginBottom: 0 }}>Próximas Reservas</div>
                  <button onClick={() => setTab('reservas')} className="vs-btn" style={{ background: 'none', border: 'none', color: G, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                    Ver todas <Icon name="chevron" size={13} color={G} />
                  </button>
                </div>
                {proximasReservas.map((r, i) => {
                  const diasFaltan = Math.ceil((new Date(r.check_in).getTime() - Date.now()) / 86400000)
                  return (
                    <div key={r.id} className="vs-fade-item vs-card-hover" style={{ ...s.card, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${i * 60}ms` }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 15, fontWeight: 700 }}>{r.huesped_nombre}</span>
                          {r.fuente === 'airbnb' && <span style={s.badge('#ff5a5f')}>Airbnb</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: MU, fontWeight: 600 }}>
                          {fDate(r.check_in)} → {fDate(r.check_out)} · {r.noches} noches
                        </div>
                        <div style={{ fontSize: 11.5, color: G, fontWeight: 700, marginTop: 2 }}>
                          {diasFaltan <= 0 ? 'Llega hoy' : diasFaltan === 1 ? 'Llega mañana' : `En ${diasFaltan} días`}
                        </div>
                      </div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, color: GR }}>{r.monto_total ? usd(r.monto_total) : '—'}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── RESERVAS TAB ── */}
        {tab === 'reservas' && (
          <div className="vs-fade-item" style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ ...s.lbl, marginBottom: 0 }}>{reservaciones.length} reservaciones</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setModal('csv')} className="vs-btn" style={s.btnSm(C2, G)}>↑ Airbnb CSV</button>
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
                      <span style={{ display: 'inline-flex', transition: 'transform 0.25s', transform: expanded ? 'rotate(90deg)' : 'none' }}><Icon name="chevron" size={14} color={MU} /></span>
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
                              <div style={{ fontSize: 14, color: MU }}>{fDate(r.check_in)} → {fDate(r.check_out)} · {r.noches} noches</div>
                              {r.notas && <div style={{ fontSize: 13, color: MU, marginTop: 4 }}>{r.notas}</div>}
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
                  flex: 1, padding: '11px 4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
                  color: finTab === key ? G : MU, borderBottom: finTab === key ? `2px solid ${G}` : '2px solid transparent', fontWeight: finTab === key ? 600 : 400
                }}>{lbl}</button>
              ))}
            </div>

            <div className="vs-fade-item" style={s.section}>
              {/* INGRESOS */}
              {finTab === 'ingresos' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: GR }}>{usd(ingresos.reduce((a, f) => a + f.monto, 0))}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setModal('csv')} className="vs-btn" style={s.btnSm(C2, G)}>↑ Airbnb</button>
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
                      <div key={g.id} className="vs-card-hover" style={{ ...s.card, marginBottom: 10, borderLeft: `3px solid ${pagado ? GR : G}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 15, fontWeight: 600 }}>{g.nombre}</span>
                              <span style={s.badge(pagado ? GR : G)}>{pagado ? 'Pagado' : 'Pendiente'}</span>
                            </div>
                            <div style={{ fontSize: 13, color: MU }}>{g.categoria}{g.dia_cobro ? ` · día ${g.dia_cobro}` : ''}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: RD }}>{usd(pagado && g.ultimo_monto_pagado ? g.ultimo_monto_pagado : g.monto)}</div>
                              {pagado && g.ultimo_monto_pagado != null && g.ultimo_monto_pagado !== g.monto && (
                                <div style={{ fontSize: 11, color: MU }}>Est: {usd(g.monto)}</div>
                              )}
                            </div>
                            <button onClick={async () => { await api.delete(`/api/gastos-fijos/${g.id}`); loadAll() }}
                              style={{ background: 'none', border: 'none', color: RD + '80', cursor: 'pointer', display: 'flex' }}><Icon name="close" size={16} color={RD + '80'} /></button>
                          </div>
                        </div>
                        <button onClick={async () => {
                          if (pagado) { await api.patch(`/api/gastos-fijos/${g.id}/despagar`); loadAll() }
                          else { setPagandoGasto(g); setModal('pagar_gasto_fijo') }
                        }}
                          className="vs-btn" style={{ ...s.btnSm(pagado ? C2 : GR, pagado ? MU : '#000'), width: '100%', marginTop: 10 }}>
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
                  <div className="vs-card-hover" style={{ ...s.card, textAlign: 'center', marginBottom: 16, background: `radial-gradient(120% 100% at 50% 0%, ${C2} 0%, ${C1} 60%)` }}>
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
                <div className="vs-card-hover" style={{ ...s.card, marginTop: 20, background: C2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: MU, fontSize: 13 }}>Ingresos</span>
                    <span style={{ color: GR, fontSize: 14, fontWeight: 600 }}>+{usd(resumen.ingresos_mes)}</span>
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
          <div className="vs-fade-item" style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...s.lbl, marginBottom: 0 }}>{pendientes.length} pendientes</span>
              <button onClick={() => setModal('mantenimiento')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Nuevo</button>
            </div>

            {pendientes.length > 0 && (
              <>
                <div style={s.lbl}>Pendientes</div>
                {pendientes.map(m => (
                  <div key={m.id} className="vs-card-hover" style={{ ...s.card, marginBottom: 10, borderLeft: `3px solid ${m.prioridad === 'alta' ? RD : m.prioridad === 'media' ? G : GR}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>{m.titulo}</span>
                          <span style={s.badge(m.prioridad === 'alta' ? RD : m.prioridad === 'media' ? G : GR)}>{m.prioridad}</span>
                        </div>
                        {m.descripcion && <div style={{ fontSize: 13, color: MU, marginBottom: 4 }}>{m.descripcion}</div>}
                        <div style={{ fontSize: 13, color: isOverdue(m.fecha_programada) ? RD : MU }}>
                          {m.fecha_programada ? (isOverdue(m.fecha_programada) ? 'Vencido: ' : 'Para: ') + fDateLong(m.fecha_programada) : ''}
                          {m.proveedor ? ` · ${m.proveedor}` : ''}
                          {m.recurrente ? ' · ↻ recurrente' : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <button onClick={async () => { await api.patch(`/api/mantenimientos/${m.id}/completar`); loadAll() }}
                          className="vs-btn" style={{ ...s.btn(GR, '#000'), padding: '8px 14px', display: 'flex' }}><Icon name="check" size={16} color="#000" /></button>
                        <button onClick={async () => { await api.delete(`/api/mantenimientos/${m.id}`); loadAll() }}
                          style={{ ...s.btnGhost, color: RD + '80', borderColor: RD + '30', padding: '4px 10px', display: 'flex' }}><Icon name="close" size={14} color={RD + '80'} /></button>
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
                      <Icon name="check" size={12} color={GR} />
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
          <div className="vs-fade-item" style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...s.lbl, marginBottom: 0 }}>{compras.filter(c => c.estado !== 'comprado').length} pendientes</span>
              <button onClick={() => setModal('compra')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Agregar</button>
            </div>

            {compras.filter(c => c.estado !== 'comprado').length > 0 && (
              <>
                <div style={s.lbl}>Por comprar</div>
                {compras.filter(c => c.estado !== 'comprado').map(c => (
                  <div key={c.id} className="vs-card-hover" style={{ ...s.card, marginBottom: 10, borderLeft: `3px solid ${c.prioridad === 'alta' ? RD : c.prioridad === 'media' ? G : GR}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>{c.articulo}</span>
                          <span style={s.badge(c.prioridad === 'alta' ? RD : c.prioridad === 'media' ? G : GR)}>{c.prioridad}</span>
                          {c.categoria && <span style={s.badge(MU)}>{c.categoria}</span>}
                        </div>
                        {c.descripcion && <div style={{ fontSize: 13, color: MU, marginBottom: 4 }}>{c.descripcion}</div>}
                        <div style={{ fontSize: 13, color: MU }}>
                          {c.cantidad ? `Cantidad: ${c.cantidad}` : ''}
                          {c.costo_estimado ? ` · Est: $${c.costo_estimado.toLocaleString()}` : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <button onClick={async () => { await api.patch(`/api/compras/${c.id}/comprar`); loadAll() }}
                          className="vs-btn" style={{ ...s.btn(GR, '#000'), padding: '8px 14px', display: 'flex' }}><Icon name="check" size={16} color="#000" /></button>
                        <button onClick={async () => { await api.delete(`/api/compras/${c.id}`); loadAll() }}
                          style={{ ...s.btnGhost, color: RD + '80', borderColor: RD + '30', padding: '4px 10px', display: 'flex' }}><Icon name="close" size={14} color={RD + '80'} /></button>
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
                      <Icon name="check" size={12} color={GR} />
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
          <div className="vs-fade-item" style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...s.lbl, marginBottom: 0 }}>{inventario.length} artículos</span>
              <button onClick={() => setModal('inventario')} className="vs-btn vs-btn-gold" style={s.btn()}>+ Agregar</button>
            </div>

            {inventario.filter(i => i.estado === 'faltante').length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ ...s.lbl, color: RD, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="alert" size={12} color={RD} /> Faltantes</div>
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

      {/* ── MOBILE BOTTOM NAV (phones only — see .vs-mobile-nav / .vs-desktop-nav) ── */}
      <div className="vs-mobile-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: C1,
        borderTop: `1px solid ${BD}`, zIndex: 100, boxShadow: '0 -6px 20px -10px rgba(42,33,26,0.15)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}>
        <div className="vs-container" style={{ display: 'flex', width: '100%' }}>
          {NAV_ITEMS.map(([key, icon, lbl]) => (
            <button key={key} onClick={() => setTab(key)} className="vs-btn" style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              padding: '9px 2px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3
            }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 22, borderRadius: 8,
                background: tab === key ? `${G}1f` : 'transparent', transition: 'background 0.2s',
              }}>
                <Icon name={icon} size={17} color={tab === key ? G : MU} />
              </span>
              <span style={{ fontSize: 9.5, color: tab === key ? G : MU, fontWeight: tab === key ? 700 : 500 }}>{lbl}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal && (
        <Modal onClose={() => { setModal(null); setCsvResult(null); setCsvFile(null); setPagandoGasto(null) }}>
          {/* CSV Import */}
          {modal === 'csv' && (
            <div>
              <ModalTitle>Importar Airbnb CSV</ModalTitle>
              <p style={{ fontSize: 14, color: MU, marginBottom: 16 }}>Descarga el reporte de Airbnb en formato CSV desde Reservaciones → Historial de transacciones → Exportar.</p>
              <input ref={csvRef} type="file" accept=".csv" onChange={e => setCsvFile(e.target.files?.[0] ?? null)}
                style={{ ...s.inp, padding: '8px', color: MU, marginBottom: 12 }} />
              {csvResult && <div style={{ padding: '10px 12px', background: csvResult.startsWith('✓') ? GR + '15' : RD + '15', borderRadius: 8, fontSize: 14, color: csvResult.startsWith('✓') ? GR : RD, marginBottom: 12 }}>{csvResult}</div>}
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
          <div style={{ fontSize: 13, color: MU }}>{f.categoria} · {fDate(f.fecha)}</div>
          {f.comprobante_nombre && <div style={{ fontSize: 11, color: OC, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="paperclip" size={11} color={OC} /> {f.comprobante_nombre}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: isIngreso ? GR : AM }}>
            {isIngreso ? '+' : '-'}{usd(f.monto)}
          </span>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', color: RD + '60', cursor: 'pointer', display: 'flex' }}><Icon name="close" size={15} color={RD + '60'} /></button>
        </div>
      </div>
    </div>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C1, border: `1px solid ${BD}`, borderRadius: '16px 16px 0 0', boxShadow: '0 -8px 32px -12px rgba(42,33,26,0.25)', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '20px 20px 40px' }}>
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
  const inp: React.CSSProperties = { width: '100%', background: C2, border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
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
  const inp: React.CSSProperties = { width: '100%', background: C2, border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
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
            <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
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
  const inp: React.CSSProperties = { width: '100%', background: C2, border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
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
  const inp: React.CSSProperties = { width: '100%', background: C2, border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
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
      <p style={{ fontSize: 14, color: MU, marginBottom: 16 }}>Gastos que se repiten cada mes (internet, alberca, HOA, limpieza...).</p>
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
  const inp: React.CSSProperties = { width: '100%', background: C2, border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
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
            {i.cantidad > 1 && <span style={{ fontSize: 13, color: MU }}>×{i.cantidad}</span>}
          </div>
          {i.notas && <div style={{ fontSize: 13, color: MU }}>{i.notas}</div>}
          <div style={{ fontSize: 13, color: MU, marginTop: 2 }}>
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
          <button onClick={onDelete} style={{ background: 'none', border: 'none', color: RD + '60', cursor: 'pointer', display: 'flex' }}><Icon name="close" size={15} color={RD + '60'} /></button>
        </div>
      </div>
    </div>
  )
}

function FormInventario({ pid, onSaved }: { pid: number; onSaved: () => void }) {
  const [v, setV] = useState({ articulo: '', categoria: 'Herramientas', cantidad: '1', estado: 'disponible', costo: '', ubicacion: '', notas: '' })
  const [loading, setLoading] = useState(false)
  const inp: React.CSSProperties = { width: '100%', background: C2, border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
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
  const inp: React.CSSProperties = { width: '100%', background: C2, border: `1px solid ${BD}`, color: TX, padding: '10px 12px', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }
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
      <p style={{ fontSize: 14, color: MU, marginBottom: 16 }}>{gasto.nombre} — confirma cuánto llegó realmente (puede diferir del estimado, como agua, luz o limpieza).</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" onClick={() => setPorVeces(false)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${!porVeces ? G : BD}`, background: !porVeces ? G + '15' : 'none', color: !porVeces ? G : MU, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Monto único</button>
        <button type="button" onClick={() => setPorVeces(true)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${porVeces ? G : BD}`, background: porVeces ? G + '15' : 'none', color: porVeces ? G : MU, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Por veces pagado</button>
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
          <div style={{ ...inp, background: C2, color: MU, marginBottom: 16, textAlign: 'center' }}>
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
