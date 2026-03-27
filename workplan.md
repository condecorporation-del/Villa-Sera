# WORKPLAN — Villa Sera Website
## Los Cabos, México | Ultra-Luxury Private Villa

**Propietario/Admin:** Alexis  
**Villa:** Villa Sera (Sera Holding)  
**Ubicación:** Los Cabos, Baja California Sur, México  
**WhatsApp:** [+52 624 217 5935](https://wa.me/526242175935)  
**Email:** villasera@seraholding.com  
**Airbnb:** [Ver listado](https://www.airbnb.mx/rooms/1583142544563137626)

---

## OBJETIVO

Crear una página web moderna de ultra-lujo que refleje la experiencia exclusiva de Villa Sera, convierta visitas en reservas directas (evitando comisiones de Airbnb), y posicione la villa como destino premium en Los Cabos.

---

## REFERENCIAS — Top Luxury Villa Websites

| Sitio | Lección clave |
|---|---|
| [lvhglobal.com/cabo](https://lvhglobal.com/cabo) | Fotografía cinematográfica, servicios detallados, CTAs claros |
| [oneandonlyresorts.com](https://www.oneandonlyresorts.com) | Hero fullscreen, paleta crema/dorado/negro, editorial luxury |
| [aman.com](https://www.aman.com) | Minimalismo extremo, naturaleza como protagonista, mucho espacio |
| [hauteretreats.com](https://hauteretreats.com/mexico-luxury-villas-for-rent-and-resorts/los-cabos-villas/) | Estilo editorial, énfasis en experiencias, contacto directo |
| [caboconnections.com](https://caboconnections.com) | Servicios incluidos destacados, WhatsApp/contacto siempre visible |

**Patrones identificados en los mejores del mercado:**
- Fotos/video a pantalla completa (fullscreen hero)
- Paleta: blanco arena + dorado + negro profundo
- Tipografía serif para títulos (elegancia), sans-serif para cuerpo
- Videos ambientales en loop (piscina, atardecer, mar)
- Servicios con iconografía minimalista
- Testimonios de huéspedes
- CTA de WhatsApp/contacto siempre flotante y visible
- Botón o badge de Airbnb para social proof

---

## SERVICIOS DE LA VILLA

| Servicio | Descripción |
|---|---|
| Chef Privado | Menú personalizado, cenas bajo las estrellas, desayunos gourmet |
| Mayordomo | Servicio , gestión de solicitudes, atención personalizada |
| Yates | Tours al Arco, snorkel, pesca deportiva, sunset cruises |
| Masajes & Spa | Terapeutas certificados en la comodidad de la villa |
| Actividades | ATV, paddleboard, kayak, whale watching, excursiones locales |
| Concierge | Reservas en restaurantes, transporte, experiencias exclusivas |

---

## STACK TECNOLÓGICO

```
Framework:      Next.js 15 (App Router)
Styling:        Tailwind CSS + shadcn/ui
Animaciones:    Framer Motion (scroll reveals, transiciones suaves)
Imágenes:       next/image (optimización automática + lazy loading)
Formularios:    React Hook Form
i18n:           next-intl (internacionalización nativa para Next.js)
Deploy:         Vercel (free tier, CDN global)
Idiomas:        Español (ES) + Inglés (EN) — bilingüe
Reservas:       WhatsApp directo + Airbnb (booking channels)
```

---

## IDENTIDAD VISUAL

> La paleta se deriva directamente de la arquitectura real de la villa:
> terracota profundo, columnas blancas, interiores dorados y el azul del Mar de Cortés.

| Elemento | Especificación |
|---|---|
| **Color fondo** | Crema cálida `#F8F4EF` |
| **Color oscuro** | Negro profundo `#0D0D0D` |
| **Terracota villa** | `#A0342A` — el rojo icónico de la fachada |
| **Dorado cálido** | `#C9A84C` — CTAs, líneas decorativas, highlights |
| **Azul Mar de Cortés** | `#1E6B8C` — uso puntual para accents |
| **Tipografía títulos** | Cormorant Garamond — serif elegante, evoca lujo colonial |
| **Tipografía cuerpo** | Inter — limpia, legible, moderna |
| **Estilo foto** | Atardeceres dorados, columnas blancas, azul intenso del mar |
| **Espaciado** | Generoso — mucho respiro entre elementos |
| **Animaciones** | Sutiles — fade-in on scroll, transiciones lentas (0.6s) |

---

## ARQUITECTURA DE PÁGINAS

```
/                     → Home (Landing principal)
/servicios            → Todos los servicios con detalle
/galeria              → Galería completa de fotos
/experiencias         → Chef, Yate, Masajes, Actividades
/contacto             → Formulario + WhatsApp + Airbnb
```

---

## ESTRUCTURA HOME PAGE (sección por sección)

### NAVBAR (sticky, translúcido sobre el hero)
- Logo "Villa Sera" tipográfico en dorado
- Links: Servicios | Galería | Experiencias | Contacto
- Botón "Reservar" (dorado, prominente)
- En mobile: menú hamburguesa

---

### SECCIÓN 1 — Hero (100vh, fullscreen)
- **Video o foto principal** de la villa (piscina infinita + vista al Mar de Cortés)
- Logo centrado en serif dorado
- Tagline: *"Una experiencia privada sin igual en Los Cabos"*
- CTA primario: **"Reservar vía WhatsApp"**
- CTA secundario: **"Ver en Airbnb"** (badge sutil)
- Overlay oscuro suave para legibilidad

---

### SECCIÓN 2 — Bienvenida a Villa Sera
- Texto editorial corto y elegante (2-3 párrafos)
- 3 fotos en grid asimétrico: vista exterior | sala | habitación principal
- Datos clave: Los Cabos, México · Privacidad Total · Staff Dedicado

---

### SECCIÓN 3 — Servicios Estrella (6 cards)
```
┌──────────────┬──────────────┬──────────────┐
│  Chef        │  Mayordomo   │    Yates     │
│  Privado     │              │              │
├──────────────┼──────────────┼──────────────┤
│  Masajes     │ Actividades  │  Concierge   │
│  & Spa       │              │              │
└──────────────┴──────────────┴──────────────┘
```
Cada card: ícono minimalista + título + descripción corta + link "Más info"

---

### SECCIÓN 4 — Galería Inmersiva
- Grid masonry con fotos de la villa
- Categorías: Exteriores | Interiores | Piscina | Recámaras | Vistas
- Lightbox al hacer click (zoom + navegación)
- Badge: **"Ver más en Airbnb"** (link al listing)

---

### SECCIÓN 5 — Experiencias Destacadas
Tres cards horizontales grandes (foto izquierda + texto derecho, alternado):

1. **Chef Privado** — Menús personalizados, ingredientes locales frescos, cenas bajo las estrellas en Los Cabos
2. **Yate Privado** — Explora el Arco, snorkel en aguas cristalinas, pesca deportiva, sunsets desde el mar
3. **Masajes & Bienestar** — Terapeutas certificados, tratamientos en la villa, experiencia spa sin salir de casa

---

### SECCIÓN 6 — Por qué Villa Sera
Fondo oscuro (`#0D0D0D`), texto en blanco y dorado:

```
PRIVACIDAD       LUJO            SERVICIO         UBICACIÓN
Tu villa,        Detalles        Staff             Corazón de
solo para ti     que importan    dedicado 24/7     Los Cabos
```

---

### SECCIÓN 7 — Testimonios
- 3-5 quotes de huéspedes anteriores (de Airbnb o directos)
- Estilo minimalista: comillas grandes en dorado, nombre/origen del huésped
- Rating stars (basado en Airbnb reviews)
- Link sutil: *"Leer más reviews en Airbnb"*

---

### SECCIÓN 8 — Booking & Contacto
Dos opciones de reserva lado a lado:

**Reserva Directa** (recomendada)
- WhatsApp: +52 624 217 5935
- Email: villasera@seraholding.com
- Sin comisiones de plataforma

**Reserva vía Airbnb**
- [Airbnb Listing](https://www.airbnb.mx/rooms/1583142544563137626)
- Pago seguro, reviews verificadas

Formulario de contacto: Nombre · Email · Fechas · N° huéspedes · Servicios deseados · Mensaje

---

### FOOTER
- Logo Villa Sera
- Links de navegación
- Contacto: WhatsApp | Email | Airbnb
- Derechos reservados — Sera Holding

---

## COMPONENTE FLOTANTE — WhatsApp Button
```
Posición: fixed bottom-right
Siempre visible en todas las páginas
Ícono WhatsApp + texto "Reservar ahora"
Color: verde WhatsApp (#25D366)
Animación: pulse suave
```

---

## FASES DE DESARROLLO

### FASE 1 — Setup & Base (Día 1)
- [ ] Inicializar proyecto Next.js 15 + Tailwind CSS
- [ ] Instalar dependencias: shadcn/ui, framer-motion, **next-intl**
- [ ] Configurar i18n: rutas `/es` y `/en`, archivos `messages/es.json` y `messages/en.json`
- [ ] Configurar paleta de colores y tipografías en Tailwind
- [ ] Crear componentes base: `Navbar` (con selector ES|EN), `Footer`, `WhatsAppButton`
- [ ] Setup de fuentes: Cormorant Garamond + Inter (Google Fonts)

### FASE 2 — Hero & Identidad Visual (Día 1-2)
- [ ] Hero section con foto/video fullscreen
- [ ] Overlay + tipografía + CTAs
- [ ] Animaciones de entrada (framer-motion)
- [ ] Navbar sticky translúcido

### FASE 3 — Secciones de Contenido (Día 2-4)
- [ ] Sección Bienvenida con grid de fotos
- [ ] Grid de Servicios (6 cards)
- [ ] Galería Inmersiva con lightbox
- [ ] Experiencias Destacadas (cards horizontales)
- [ ] Sección "Por qué Villa Sera" (fondo oscuro)
- [ ] Testimonios

### FASE 4 — Booking & Contacto (Día 4-5)
- [ ] Sección de reservas: WhatsApp directo + Airbnb link
- [ ] Formulario de contacto
- [ ] Botón WhatsApp flotante (siempre visible)
- [ ] Footer completo

### FASE 5 — Refinamiento (Día 5-6)
- [ ] Responsive design mobile-first
- [ ] Optimización de imágenes (WebP, lazy loading)
- [ ] Animaciones scroll-reveal en todas las secciones
- [ ] SEO: meta tags, Open Graph, sitemap
- [ ] Pruebas en iOS/Android

### FASE 6 — Deploy (Día 7)
- [ ] Deploy en Vercel
- [ ] Configurar dominio personalizado (si disponible)
- [ ] Pruebas finales de performance (Lighthouse > 90)
- [ ] Analytics (Vercel Analytics o Google Analytics)

---

## CANALES DE RESERVA

| Canal | URL / Contacto | Prioridad |
|---|---|---|
| WhatsApp Directo | [+52 624 217 5935](https://wa.me/526242175935) | ⭐ Principal |
| Email | villasera@seraholding.com | ⭐ Principal |
| Airbnb | [Ver listado](https://www.airbnb.mx/rooms/1583142544563137626) | Secundario (social proof + backup) |

---

## INVENTARIO DE FOTOS — Asignación por Sección

> **25 fotos disponibles de alta resolución** (1.0–3.4 MB c/u). Calidad profesional, fotografía de nivel mundial.

### HERO PRINCIPAL — La foto que vende todo
| Archivo | Descripción | Uso |
|---|---|---|
| `CasaSergio233.jpg` | **⭐ HERO #1** — Atardecer espectacular desde la terraza de la villa: arcos blancos, tumbonas, piscina y El Arco de Cabo al fondo. IMAGEN ESTRELLA | Hero fullscreen |
| `CasaSergio238.jpg` | **⭐ HERO #2** — Mesa de cena servida bajo los arcos al atardecer con El Arco visible. Perfecta para chef/dining | Hero alternativo o sección chef |

### EXTERIORES & UBICACIÓN
| Archivo | Descripción | Uso |
|---|---|---|
| `exterior 1.jpg` | Villa iluminada de noche, fachada terracota con arcos, base de piedra — IMPRESIONANTE | Sección "La Villa" o galería |
| `CasaSergio272.jpg` | Mismo ángulo nocturno de la fachada (duplicado de exterior 1) | Galería |
| `CasaSergio126.jpg` | Fachada de día — arcos blancos sobre terracota, columnas, palmeras — ICÓNICA | Sección bienvenida |
| `CasaSergio121.jpg` | Vista desde el mar — villa terracota destacada entre acantilados | Sección ubicación |
| `CasaSergio115.jpg` | Panorámica aérea de la costa de Los Cabos | Sección ubicación / fondo |
| `CasaSergio115+.jpg` | Similar aérea de la costa | Galería |
| `CasaSergio139+.jpg` | **Drone con El Arco al fondo y villa marcada** — muestra ubicación privilegiada | Sección "¿Por qué Villa Sera?" |

### PLAYA PRIVADA
| Archivo | Descripción | Uso |
|---|---|---|
| `CasaSergio180.jpg` | Escalera de piedra bajando a la cala privada con palmeras y el mar | Sección servicios/actividades |
| `CasaSergio181.jpg` | Palmeras enmarcando la cala privada — vista íntima | Galería / fondo sección |
| `CasaSergio182.jpg` | Vista aérea de la cala privada con velero al fondo | Sección yates/actividades |

### INTERIORES
| Archivo | Descripción | Uso |
|---|---|---|
| `livingroom villa serena.jpg` | Sala principal con paredes doradas, arcos, vista al mar al fondo — warmth y lujo | Sección bienvenida / galería |
| `diningroom1.jpg` | Comedor interior: candelabro de hierro forjado, paredes doradas, arcos con vista al mar | Sección chef privado |
| `diningroom2.jpg` | Terraza comedor al atardecer (similar a CasaSergio238) | Galería |

### RECÁMARAS
| Archivo | Descripción | Uso |
|---|---|---|
| `master room 1.jpg` | **Master Suite** — cama con arco de acceso, vista al Mar de Cortés al amanecer | Sección recámaras / galería |
| `masteroom2.jpg` | Segunda master: madera, silla roja, cuarto de baño contiguo visible | Galería recámaras |
| `bedroom 2.jpg` | Cama de hierro forjado con dosel, terraza con vista al mar — romántica | Galería recámaras |
| `bedroom 3.jpg` | Recámara adicional | Galería |
| `bedroom 4.jpg` | Recámara adicional | Galería |

### BAÑOS & CLOSET
| Archivo | Descripción | Uso |
|---|---|---|
| `bathroom1.jpg` | Baño con tina de mármol, paredes doradas, esculturas artesanales mexicanas | Galería |
| `bathroom 2.jpg` | Baño secundario | Galería |
| `baño 2.jpg` | Baño | Galería |
| `baño 3.jpg` | Baño | Galería |
| `closet1.jpg` | Closet/vestidor | Galería (opcional) |

---

### MAPA DE FOTOS → SECCIONES DEL SITIO

```
HERO                  →  CasaSergio233.jpg (sunset panorámica con arcos)
NAVBAR LOGO FONDO     →  CasaSergio126.jpg (fachada de día)
BIENVENIDA GRID       →  livingroom + master room 1 + CasaSergio121
EXTERIOR NOCHE        →  exterior 1.jpg
CHEF / COMEDOR        →  CasaSergio238.jpg + diningroom1.jpg
PLAYA PRIVADA         →  CasaSergio180 + CasaSergio182
UBICACIÓN             →  CasaSergio139+ (drone con El Arco)
RECÁMARAS             →  master room 1 + bedroom 2 + masteroom2
GALERÍA COMPLETA      →  Todas las 25 fotos en grid masonry
```

---

## SISTEMA BILINGÜE (ES / EN)

### Arquitectura de rutas
```
/es                   → Home en Español (default)
/en                   → Home en Inglés

/es/servicios         → Servicios
/en/services          → Services

/es/galeria           → Galería
/en/gallery           → Gallery

/es/experiencias      → Experiencias
/en/experiences       → Experiences

/es/contacto          → Contacto
/en/contact           → Contact
```

### Implementación con `next-intl`
- Archivos de traducción en `/messages/es.json` y `/messages/en.json`
- Todo el texto del sitio centralizado en esos archivos — fácil de mantener y actualizar
- El selector de idioma aparece en la Navbar (banderita 🇲🇽 / 🇺🇸 o simplemente ES | EN)
- URL default: español (`/`) redirige a `/es` — inglés accesible desde el toggle

### Selector de idioma
- Posición: esquina superior derecha del Navbar
- Estilo: `ES | EN` — texto minimal, sin banderas (más limpio para marca de lujo)
- Al cambiar idioma, la URL cambia y el contenido se traduce instantáneamente
- La preferencia se recuerda en el navegador

### Contenido a traducir (prioridad)
| Sección | ES | EN |
|---|---|---|
| Navbar links | Servicios, Galería, Experiencias, Contacto, Reservar | Services, Gallery, Experiences, Contact, Book Now |
| Hero tagline | "Una experiencia privada sin igual en Los Cabos" | "An Unrivaled Private Experience in Los Cabos" |
| Hero CTA | "Reservar vía WhatsApp" | "Book via WhatsApp" |
| Servicios | Chef Privado, Mayordomo, Yates... | Private Chef, Butler, Yachts... |
| Sección contacto | Nombre, Fechas, Huéspedes, Mensaje | Name, Dates, Guests, Message |
| Footer | Todos los derechos reservados | All rights reserved |

### SEO bilingüe
- Meta tags en ambos idiomas (`hreflang`)
- Título ES: *"Villa Sera — Villa de Lujo Privada en Los Cabos"*
- Título EN: *"Villa Sera — Private Luxury Villa in Los Cabos"*
- Descripción ES: *"Villa privada en Los Cabos con chef, mayordomo, playa privada y yates. Reserva directa."*
- Descripción EN: *"Private luxury villa in Los Cabos with private chef, butler, beach & yachts. Direct booking."*

---

## ASSETS PENDIENTES

- [ ] **Logo** de Villa Sera (si existe) — o crear uno tipográfico con Cormorant Garamond
- [ ] **Video** de la villa o atardecer (si existe — ideal para hero en loop, 15-30 seg)
- [ ] **Testimonios** de huéspedes (3-5 quotes — pueden tomarse de Airbnb reviews)
- [ ] **Dominio** — ¿villaserana.com, villaseranacabo.com, o similar?
- [x] **Idioma** — Bilingüe: Español + Inglés ✅
- [ ] **Fotos de servicios** — Chef cocinando, masajista en acción, yate (si hay)

---

## NOTAS IMPORTANTES

1. **Reservas directas vs Airbnb** — El sitio web debe incentivar la reserva directa (sin comisión del 15-20% de Airbnb), pero mantener Airbnb como canal secundario para credibilidad y reviews.

2. **Mobile-first es crítico** — La mayoría de los clientes de lujo descubren la villa por Instagram/WhatsApp y navegan desde iPhone. El diseño en móvil es igual de importante que en desktop.

3. **Velocidad de carga** — Fotos mal optimizadas destruyen conversiones. Todas las imágenes se convertirán a WebP con lazy loading.

4. **Fotografía de calidad** — El sitio vale exactamente lo que valen las fotos. Si se puede invertir en una sesión fotográfica profesional, el ROI es enorme.

5. **SEO Local** — Optimizar para búsquedas como "villa privada Los Cabos", "villa con chef privado Cabo", "luxury villa rental Los Cabos".

6. **Bilingüe desde el día 1** — La arquitectura `next-intl` debe configurarse al inicio del proyecto. Añadirla después es costoso. Todo el texto va en archivos JSON de traducción, nunca hardcodeado en los componentes.

7. **Audiencia EN = mercado principal** — Los clientes de Los Cabos que más pagan son norteamericanos. La versión en inglés debe ser impecable. Priorizar traducción profesional (no solo Google Translate) para textos de servicios y hero.

---

*Última actualización: Marzo 2026 — Sera Holding*
