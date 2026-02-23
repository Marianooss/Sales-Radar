# 🎨 MASTER UI — SalesRadar AI
> Especificaciones completas de diseño e interfaz para los 3 módulos del producto  
> Para: Diseñadores UI/UX, Frontend Developers, Product Manager  
> Stack: React Native (Mobile) + Next.js (Web) · Design System propio

---

## ÍNDICE

1. [Filosofía de Diseño](#1-filosofía-de-diseño)
2. [Design System](#2-design-system)
3. [Estructura de Navegación](#3-estructura-de-navegación)
4. [Top Bar y Navegación Global](#4-top-bar-y-navegación-global)
5. [Módulo RADAR — Especificaciones Completas](#5-módulo-radar)
6. [Módulo FÁBRICA — Especificaciones Completas](#6-módulo-fábrica)
7. [Módulo COLADOR — Especificaciones Completas](#7-módulo-colador)
8. [Pantalla de Insights y Alertas](#8-pantalla-de-insights-y-alertas)
9. [Notificaciones Push](#9-notificaciones-push)
10. [Estados de la Interfaz](#10-estados-de-la-interfaz)
11. [Animaciones y Micro-interacciones](#11-animaciones-y-micro-interacciones)
12. [Responsive y Adaptaciones](#12-responsive-y-adaptaciones)
13. [Accesibilidad](#13-accesibilidad)

---

## 1. FILOSOFÍA DE DISEÑO

### El principio rector: Claridad que Genera Acción

El usuario de SalesRadar está en modo trabajo cuando usa la app. No está explorando. No está entretenido. Está buscando **qué responder, qué crear y qué oportunidad aprovechar**. Cada pantalla debe hacer una sola cosa y hacerla con absoluta claridad.

### Los 4 mandatos de diseño

#### M1 — La métrica que importa siempre visible
El dato más importante de cada pantalla nunca está enterrado. El número de "consultas de compra" siempre está más grande y visible que las views. El "Sales Score" siempre es el primer dato de una tarjeta de video.

#### M2 — La acción siguiente siempre obvia
En cada pantalla hay UNA acción primaria. No 4 botones del mismo peso. Un botón principal (color sólido, tipografía bold) y como máximo uno secundario (outlined, mismo nivel de importancia visual reducido).

#### M3 — El status del sistema siempre presente
El usuario necesita saber que el sistema está trabajando. El indicador LIVE del Radar, el timestamp del último scan, el número de comentarios pendientes en el Colador — siempre a la vista.

#### M4 — Urgencia visual calibrada
El diseño debe comunicar urgencia sin generar ansiedad. Los comentarios de compra con alta prioridad tienen borde de color, no alertas rojas parpadeantes. La jerarquía de colores es: verde (oportunidad de venta), dorado (acción de creación), rojo (alerta urgente). Se usan con intención, no decorativamente.

---

## 2. DESIGN SYSTEM

### 2.1 Paleta de Colores

```
FONDOS:
--bg-primary:     #07090F   /* Fondo principal de toda la app */
--bg-surface:     #0D1220   /* Tarjetas, panels, modales */
--bg-surface-2:   #121929   /* Inputs, elementos secundarios */
--bg-overlay:     rgba(7,9,15,0.85) /* Overlays y drawers */

BORDES:
--border-default:  #1C2A3E
--border-hover:    #2E4460
--border-focus:    #F0B429 (gold)

SEÑALES DE VENTA:
--green:           #00FF88  /* Señal de compra, éxito, live */
--green-dim:       #004D28  /* Fondo de tarjetas buy */
--green-glow:      rgba(0,255,136,0.15)

CREACIÓN Y FÁBRICA:
--gold:            #F0B429  /* Acción principal, badges premium */
--gold-dim:        #8A6515
--gold-muted:      rgba(240,180,41,0.1)

ALERTAS Y QUEJAS:
--red:             #FF4D6A  /* Quejas urgentes, errores */
--red-dim:         #4D0018
--red-muted:       rgba(255,77,106,0.1)

DATOS Y RADAR:
--blue:            #38BDF8  /* Datos, métricas, plataformas */
--blue-dim:        #0C3A52
--blue-muted:      rgba(56,189,248,0.1)

FELICIDAD / FANS:
--amber:           #FBBF24  /* Clientes felices, testimonios */

TEXTO:
--text-primary:    #EFF6FF  /* Texto principal */
--text-secondary:  #8899AA  /* Labels, subtítulos */
--text-tertiary:   #3D5060  /* Placeholders, disabled */

PLATAFORMAS:
--tiktok:          #FF0050
--instagram:       #C13584
--youtube:         #FF0000
```

### 2.2 Tipografía

```
FAMILIA PRINCIPAL:
'DM Mono' para toda la interfaz.
Por qué DM Mono: transmite datos, análisis, tecnología. 
Es legible en tamaños pequeños. Tiene personalidad sin ser decorativa.
Fallback: 'Fira Code', 'Courier New', monospace

ESCALA TIPOGRÁFICA:
--text-hero:    28px / weight 900 / tracking -0.02em   (títulos de sección)
--text-h1:      22px / weight 800 / tracking -0.01em   (títulos de módulo)
--text-h2:      16px / weight 700 / tracking 0.05em    (subtítulos, labels mayúsculas)
--text-body:    13px / weight 400 / line-height 1.6    (cuerpo de texto)
--text-label:   11px / weight 700 / tracking 0.1em     (badges, categorías)
--text-micro:   9px  / weight 700 / tracking 0.15em    (timestamps, IDs)

JERARQUÍA EN NÚMEROS CRÍTICOS:
--text-stat-hero:  28px / weight 900 / color: señal del dato
--text-stat-label: 9px  / weight 700 / uppercase / color: --text-secondary

NUNCA se usa tipografía decorativa. La data es el protagonista.
```

### 2.3 Espaciado

```
Sistema basado en múltiplos de 4px:
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px

Padding interno de tarjetas:   16px-20px
Gap entre tarjetas:            8px-12px
Padding de sección:            16px horizontal, 24px vertical
Padding de pantalla:           16px horizontal
```

### 2.4 Componentes Base

#### Tarjeta de Video (VideoCard)
```
Estructura:
├── Borde izquierdo de color (3px) → color de plataforma
├── Header:
│   ├── Izquierda: [PlatformIcon] [CreatorHandle] [NicheBadge]
│   └── Derecha: [ScoreCircle]
├── Título del video (max 2 líneas)
├── ScoreBar (thin, color según score)
└── Footer:
    ├── [👁 ViewCount]
    ├── [💰 BuyComments] ← destacado en verde
    ├── [⚡ HookType]
    └── [Botones de acción]

ScoreCircle:
  - Diámetro: 52px
  - Número: 22px / weight 900
  - Label "score": 8px / uppercase
  - Color del número y borde: verde si ≥90, dorado si ≥80, azul si <80
```

#### Badge de Categoría
```
Tipografía: 9px / weight 800 / uppercase / tracking 0.05em
Padding: 2px 8px
Border-radius: 20px (pill)
Variantes:
  - buy:       bg: rgba(0,255,136,0.1) / border: rgba(0,255,136,0.4) / color: #00FF88
  - happy:     bg: rgba(251,191,36,0.1) / border: rgba(251,191,36,0.4) / color: #FBBF24
  - complaint: bg: rgba(255,77,106,0.1) / border: rgba(255,77,106,0.4) / color: #FF4D6A
  - neutral:   bg: rgba(136,153,170,0.1) / border: rgba(136,153,170,0.3) / color: #8899AA
  - niche:     bg: rgba(56,189,248,0.1) / border: rgba(56,189,248,0.4) / color: #38BDF8
```

#### Botón Principal (CTA)
```
Alto: 44px (mínimo tapeable en mobile)
Border-radius: 8px
Tipografía: 13px / weight 900 / uppercase / tracking 0.05em

Variante primaria (verde — acción de venta):
  background: linear-gradient(135deg, #00FF88, #00CC6A)
  color: #000
  
Variante secundaria (dorada — creación):
  background: linear-gradient(135deg, #F0B429, #D49E1E)
  color: #000

Variante outline:
  background: transparent
  border: 1px solid --border-default
  color: --text-secondary

Estado loading: shimmer animation (nunca spinner — interrumpe el flujo)
Estado disabled: opacity 0.4
```

#### Input de Texto
```
Alto: 44px (o textarea auto-grow)
Background: --bg-surface-2
Border: 1px solid --border-default
Border-radius: 8px
Padding: 10px 14px
Tipografía: 13px / weight 400
Color: --text-primary
Placeholder: --text-tertiary

Focus:
  border-color: --gold
  box-shadow: 0 0 0 2px rgba(240,180,41,0.15)

Error:
  border-color: --red
  box-shadow: 0 0 0 2px rgba(255,77,106,0.15)
```

### 2.5 Elevaciones y Sombras

```
No se usan sombras convencionales (caja blanca con sombra negra).
En fondo oscuro, la elevación se indica con:

Nivel 0 (fondo):     background: --bg-primary
Nivel 1 (tarjetas):  background: --bg-surface + border 1px
Nivel 2 (modales):   background: --bg-surface + border 1px --border-hover
Nivel 3 (drawers):   background: --bg-surface + border 1px --border-hover + backdrop-blur

Glows para énfasis:
  Verde live:  box-shadow: 0 0 8px rgba(0,255,136,0.4)
  Dorado:      box-shadow: 0 0 8px rgba(240,180,41,0.3)
  Rojo urgente: box-shadow: 0 0 8px rgba(255,77,106,0.4)
```

---

## 3. ESTRUCTURA DE NAVEGACIÓN

### Mapa de pantallas

```
App
├── Auth
│   ├── Onboarding (3 slides)
│   ├── Login (Google OAuth / Email)
│   └── Setup de perfil (nichos, plataformas, país)
│
├── Main (Tab Navigation)
│   ├── [🔍] RADAR
│   │   ├── Feed de videos trending
│   │   ├── Video Detail (comentarios + métricas)
│   │   └── Filtros (drawer bottom)
│   │
│   ├── [✍️] FÁBRICA  
│   │   ├── Input de producto
│   │   ├── Script generado (resultado)
│   │   ├── Historial de scripts
│   │   └── AB Testing view (2 variantes)
│   │
│   ├── [💰] COLADOR
│   │   ├── Inbox (3 categorías)
│   │   ├── Comment detail + respuesta
│   │   └── Stats de la semana
│   │
│   └── [🔔] ALERTAS
│       ├── Insights activos
│       ├── Notificaciones de buy_signal
│       └── Resumen semanal
│
└── Settings
    ├── Perfil y nichos
    ├── Plataformas conectadas
    ├── Templates de respuesta
    └── Plan y billing
```

---

## 4. TOP BAR Y NAVEGACIÓN GLOBAL

### Top Bar (sticky, always visible)

```
Layout horizontal:
├── Izquierda:
│   ├── Logo "SalesRadar" (gradient gold-to-white)
│   └── Subtítulo: "AI · TikTok · IG · YouTube" (9px / --text-secondary)
│
└── Derecha:
    ├── Indicador LIVE:
    │   ├── Dot verde pulsando (6px, glow verde)
    │   ├── Texto "LIVE SCANNING" (9px / verde / weight 700)
    │   └── Timestamp del último scan
    └── Avatar de usuario (30px, tap → Settings)

Background: --bg-surface
Border-bottom: 1px solid --border-default
Height: 56px
```

### Tab Bar (bottom, mobile)

```
3 tabs:
├── [🔍 RADAR]     — label: "Tendencias"
├── [✍️ FÁBRICA]  — label: "Generador"
└── [💰 COLADOR]  — label: "Ventas"

Tab activo:
  border-bottom: 2px solid --gold
  label-color: --gold
  icon-color: --gold

Tab inactivo:
  label-color: --text-secondary

Badge de notificación (en COLADOR):
  Círculo rojo / 16px / número de buy comments sin responder
  Posición: top-right del icono
```

---

## 5. MÓDULO RADAR

### 5.1 Layout General

```
PANTALLA COMPLETA:
├── Top Bar (sticky)
├── Stats Banner (full width)
│   └── 3 métricas clave del día
├── Filtros Row 1: plataformas (chips horizontales)
├── Filtros Row 2: nichos (chips horizontales, scrollable)
└── Lista de VideoCards (scrollable, infinite)
```

### 5.2 Stats Banner

```
Componente de 3 columnas:
┌─────────────────────────────────────────────┐
│  5.1M              23,840          847       │
│  Videos            Con señal       Trending  │
│  escaneados        de compra       ahora     │
└─────────────────────────────────────────────┘

Colores:
- "5.1M":    --blue (datos crudos)
- "23,840":  --gold (procesados y filtrados)
- "847":     --green (oportunidades activas)

Background: gradient de --bg-surface a #0A1A2E
Border: 1px solid rgba(56,189,248,0.3)
Separadores: líneas verticales de 1px --border-default
```

### 5.3 Filtros de Plataforma

```
Row de chips horizontales, scrollable:

[🎵 TikTok] [📸 Instagram] [▶ YouTube]

Chip activo:
  background: rgba(plataforma-color, 0.15)
  border: 1px solid plataforma-color
  color: plataforma-color

Chip inactivo:
  background: --bg-surface
  border: 1px solid --border-default
  color: --text-secondary

Multi-select: se pueden activar varios a la vez.
```

### 5.4 Filtros de Nicho

```
Row de chips: [Todos] [Tech] [Hogar] [Moda] [Belleza] [Lifestyle]
Single-select (uno a la vez).

Chip activo:
  background: rgba(240,180,41,0.15)
  border: 1px solid rgba(240,180,41,0.5)
  color: --gold
```

### 5.5 VideoCard — Especificación Completa

```
┌─────────────────────────────────────────────────┐ ← border-left: 3px solid [platform-color]
│ [🎵] @creador_handle    [Tech]           [98]   │
│                                           score  │
│ Unboxing auriculares inalámbricos                │
│ desde $15 🤯                                     │
│ ─────────────────────────────── ScoreBar ──────  │
│ 👁 2.4M    💰 847 compras    ⚡ Producto <1s     │
│                                                   │
│ [✍️ Generar guión similar] [💬 Ver comentarios]  │
└───────────────────────────────────────────────────┘

ScoreBar:
  Height: 3px
  Background: --border-default (track)
  Fill: verde si score≥90, dorado si ≥80, azul si <80
  Animada: fill desde 0 al valor real al entrar en viewport

Métricas footer:
  👁 [ViewCount]    → color --text-secondary, tamaño 11px
  💰 [BuyComments] → COLOR VERDE, tamaño 11px, weight 700 ← MÁS IMPORTANTE
  ⚡ [HookType]    → color --gold, tamaño 10px

Botones:
  [✍️ Generar guión]: outlined dorado, flex:1
  [💬 Ver comentarios]: outlined azul, flex:1
  Alto: 32px (compacto, está dentro de la tarjeta)
```

### 5.6 Pantalla de Video Detail

```
Se abre al tocar el título o thumbnail.
Full-screen sheet (bottom drawer que sube).

Contenido:
├── Header: título + creador + plataforma + botón de link
├── Métricas expandidas:
│   ├── Views / Likes / Shares / Comment Count
│   └── BUY SIGNAL SCORE (grande, verde)
├── Análisis del Hook:
│   ├── Producto visible en: X segundos
│   ├── Tipo de hook: [Unboxing / Demo / Review / Haul]
│   └── Recomendación: texto de 1-2 líneas
├── Comentarios (preview, top 10):
│   └── Clasificados con badges (buy / happy / complaint)
└── CTA: [✍️ Generar guión basado en este video]
```

---

## 6. MÓDULO FÁBRICA

### 6.1 Layout General

```
PANTALLA:
├── Top Bar
├── Panel de Input (siempre visible arriba)
│   ├── Input de producto
│   ├── Selector de plataforma (3 pills)
│   ├── Selector de objetivo (3 pills)
│   └── Botón GENERAR
└── Área de resultado (scroll debajo)
    ├── Resultado actual (si hay)
    └── Historial (si no hay resultado activo)
```

### 6.2 Panel de Input

```
INPUT DE PRODUCTO:
  Placeholder: "Ej: auriculares inalámbricos con cancelación de ruido"
  Auto-expand: máximo 3 líneas de texto visible
  Debajo del input, en tiempo real: AI sugiere el nicho detectado
  Ej: "🔵 Nicho detectado: Tech" → confirmable con tap

SELECTOR DE PLATAFORMA:
  Row de 3 pills: [🎵 TikTok] [📸 IG] [▶ YouTube]
  Single-select
  La selección cambia el contexto del prompt:
    TikTok:    Videos cortos ≤60s, hook viral, trends de audio
    Instagram: Reels ≤90s, estética de imagen, save-worthy
    YouTube:   Shorts ≤60s o Long form, estructura SEO

SELECTOR DE OBJETIVO:
  Row de 3 pills: [💰 Venta directa] [📣 Marca] [🚀 Viral]
  Single-select

BOTÓN GENERAR:
  Estado inicial: outline / disabled cuando input vacío
  Estado con texto: --gold gradient / texto "🚀 GENERAR GUIÓN VIRAL"
  Estado loading: shimmer animation + texto "⚙️ Analizando mercado..."
  Tiempo de espera: 4-8 segundos (muestra pasos en tiempo real)
```

### 6.3 Animación del Estado Loading

```
Durante la generación, se muestra una secuencia de pasos animados:

⊙ Buscando videos similares en el Radar...     (1.2s)
⊙ Analizando hooks con mayor sales_score...    (1.8s)
⊙ Detectando señales de mercado activas...     (1.0s)
⊙ Generando tu guión de ventas...              (3.0s)
✓ ¡Listo!

Cada paso aparece con fade-in de 0.3s.
El punto ⊙ tiene animación de pulso.
Al completarse, cada ⊙ se convierte en ✓ con micro-animación.
```

### 6.4 Resultado Generado — Especificación de Bloques

```
4 bloques expandibles, colapsados por defecto excepto el primero.

BLOQUE 1: HOOK VISUAL (0–3s) ← siempre expandido
  Header bg: rgba(0,255,136,0.08)
  Header border: 1px solid rgba(0,255,136,0.3)
  Label: "⚡ HOOK VISUAL (0–3s)" / verde / uppercase
  Badge: "CRÍTICO" / verde
  Contenido: texto del hook con formato monospace
  Botón: [📋 Copiar]

BLOQUE 2: DESARROLLO (3–45s)
  Header bg: rgba(240,180,41,0.08)
  Label: "📹 DESARROLLO (3–45s)" / dorado
  Colapsado por defecto, se expande con tap
  Botón: [📋 Copiar]

BLOQUE 3: CTA DE CIERRE (45–60s)
  Header bg: rgba(168,85,247,0.08)
  Label: "💰 CTA DE CIERRE" / #A855F7
  Colapsado por defecto
  Botón: [📋 Copiar]

BLOQUE 4: PORTADA + KEYWORDS
  Dos sub-secciones:
  ├── Portada: descripción visual de la thumbnail
  └── Keywords: chips de tags copiables individualmente
  
BOTÓN PRINCIPAL:
  [📤 Compartir guión completo]
  Genera PDF o texto plano para pasar al equipo o herramienta de edición

BOTÓN SECUNDARIO:
  [🔄 Generar variante A/B]
  Genera 2a versión del hook para testeo
```

### 6.5 Historial de Scripts

```
Lista de scripts generados anteriormente.
Card compacta:

┌──────────────────────────────────────────────┐
│ [🎵] auriculares inalámbricos  [Ver] [Usar]  │
│ Venta directa · Tech · hace 2 días           │
└──────────────────────────────────────────────┘

"Usar": recarga ese script como activo y lo editable
"Ver": solo lectura
```

---

## 7. MÓDULO COLADOR

### 7.1 Layout General

```
PANTALLA:
├── Top Bar
├── Summary Cards (3 categorías con contadores)
├── Info Banner (X de 5,000 comentarios)
├── Lista de Comments (filtrada/ordenada)
└── [Botón flotante] "Responder todos los buy" (si hay >5 sin responder)
```

### 7.2 Summary Cards

```
Row de 3 tarjetas:

┌──────────┐  ┌──────────┐  ┌──────────┐
│    23    │  │    15    │  │     8    │
│  💰 Buy  │  │  ⭐ Fan  │  │ 🚨 Queja │
│ Compra   │  │ Felices  │  │ Urgente  │
└──────────┘  └──────────┘  └──────────┘

Tarjeta activa (filtro aplicado):
  bg: rgba(category-color, 0.15)
  border: 1px solid category-color

Tarjeta inactiva:
  bg: --bg-surface
  border: 1px solid --border-default

Número: 20px / weight 900 / category-color cuando activa
Label: 9px / uppercase

Tap en una tarjeta: filtra la lista al tipo correspondiente.
Tap en tarjeta ya activa: quita el filtro (muestra todos).
```

### 7.3 Info Banner

```
┌────────────────────────────────────────────────────┐
│ Mostrando 46 de 5,000 comentarios     ↑ 0.9% AI   │
└────────────────────────────────────────────────────┘

Izquierda: cantidad filtrada (--text-secondary)
Derecha: porcentaje seleccionado (--green / weight 700)

El porcentaje pequeño comunica: "AI hizo el trabajo duro, vos ves solo lo que importa"
```

### 7.4 Comment Card — Especificación Completa

```
┌─────────────────────────────────────────────────┐ ← bg y border de category
│ [💰 Compra]  [PRIORIDAD #1]  [🎵]   2min ago   │
│ @username                                        │
│ "¿Cuánto cuesta? ¿Tienen envío a Buenos Aires?" │
│                                                   │
│ [💬 Responder → Venta]              [🤖 IA]     │
└───────────────────────────────────────────────────┘

HEADER ROW:
  [Badge de categoría] [Badge de prioridad] [Platform icon] [Timestamp]
  Prioridades:
    Prioridad #1 → verde
    Urgente       → rojo
    Testimonio    → dorado

USERNAME:
  color: --text-secondary / 10px

TEXTO DEL COMENTARIO:
  color: --text-primary / 12px / line-height 1.5

BOTÓN PRIMARIO (según categoría):
  buy:       "💬 Responder → Venta"  → verde
  complaint: "🚨 Atender urgente"    → rojo
  happy:     "⭐ Usar como testimonio" → dorado
  
  Estado respondido: opacidad 50% + texto "✓ Respondido"

BOTÓN [🤖 IA]:
  Abre el template de respuesta sugerida
  outline / --border-default / 10px

Después de responder:
  La card colapsa con animación suave (height 0, opacity 0)
  Aparece debajo de la lista en sección "Respondidos hoy: X"
```

### 7.5 Drawer de Respuesta Asistida

```
Al tocar [🤖 IA] o [💬 Responder → Venta]:

Bottom sheet que sube desde abajo.
Height: 60% de pantalla.

Contenido:
├── Comentario original (pequeño, de referencia)
├── Template sugerido (editable):
│   "¡Hola @username! 😊 El precio es $X con envío incluido..."
│   [Texto editable]
├── Variables a completar destacadas:
│   [precio] [país] [días de envío] → se tocan para completar
├── Selector de template alternativo (si hay más de uno)
└── [Enviar respuesta] [Copiar texto]

IMPORTANTE: El botón "Enviar respuesta" NO conecta con la plataforma en MVP.
Copia el texto al clipboard con confirmación:
"✓ Copiado — Ahora pegalo en TikTok/IG/YouTube"
```

### 7.6 Respuesta en Batch

```
Botón flotante (visible cuando hay ≥5 buy comments sin responder):

Position: bottom-right / 16px del borde
Forma: pill / 48px alto
Contenido: "💰 Responder los 23 compradores"
Color: --green gradient

Al tocar: abre modal de batch response:
  Muestra todos los buy comments
  Template global editable
  [Copiar todos como lista]
  
El batch response genera una lista numerada:
  1. @usuario1: [template personalizado]
  2. @usuario2: [template personalizado]
  ...
  Para pegar uno a uno de forma eficiente.
```

---

## 8. PANTALLA DE INSIGHTS Y ALERTAS

### 8.1 Layout

```
Lista de insight cards ordenadas por urgencia.

Cada insight card:
┌─────────────────────────────────────────────┐
│ 🚨 INSIGHT ACTIVO    Niche: Tech    hace 6h │
│                                              │
│ 178 comentarios mencionan "precio muy alto" │
│ en videos de auriculares esta semana.        │
│ ↑ +340% vs semana anterior                  │
│                                              │
│ Impacto automático:                         │
│ ✓ Radar ajustó filtros (activo)             │
│ ✓ Fábrica recibirá contexto extra           │
│                                              │
│ [Ver videos afectados]  [Generar speech]    │
└─────────────────────────────────────────────┘

Colores por urgencia:
  ALTA:   border rojo / bg rojo muy sutil
  MEDIA:  border dorado / bg dorado muy sutil
  INFO:   border azul / bg azul muy sutil
```

---

## 9. NOTIFICACIONES PUSH

### Tipos y contenido

```
TIPO 1: BUY SIGNAL EXPLOSIVO
  Trigger: video propio supera 20 buy comments en <1 hora
  Mensaje: "💰 23 personas quieren comprar ahora — responde antes de que se enfríen"
  Deep link: COLADOR → filtrado por buy

TIPO 2: VIDEO VIRAL EN TU NICHO
  Trigger: video en tu nicho supera sales_score de 95
  Mensaje: "🔥 Video de [nicho] con 1,200 preguntas de compra — miralo antes que tu competencia"
  Deep link: RADAR → video específico

TIPO 3: INSIGHT NUEVO
  Trigger: nuevo patrón detectado con >50 ocurrencias
  Mensaje: "🧠 Insight: '¿aguanta el agua?' preguntado 89 veces en tu nicho hoy"
  Deep link: INSIGHTS

TIPO 4: RESUMEN SEMANAL (domingo 9pm)
  Mensaje: "📊 Tu semana: 47 compradores contactados · 12 scripts generados · 89 quejas atendidas"
  Deep link: Stats overview
```

---

## 10. ESTADOS DE LA INTERFAZ

### Empty States

```
RADAR vacío (sin resultados con filtros):
  Icono: 🔍 animado
  Título: "Sin videos en este nicho hoy"
  Subtítulo: "Probá con otro nicho o quitá el filtro de plataforma"
  CTA: [Limpiar filtros]

COLADOR vacío (todo respondido):
  Icono: 💰 con check verde
  Título: "¡Bandeja limpia!"
  Subtítulo: "Respondiste todos los comentarios de compra. Buen trabajo."
  Sin CTA — es un estado de logro, no de error.

FÁBRICA sin historial:
  Icono: ✍️
  Título: "Tu primer guión espera"
  Subtítulo: "Escribí el nombre de tu producto y generamos el speech"
  CTA: [Crear primer guión]
```

### Error States

```
Error de conexión:
  Banner top: "Sin conexión · Los datos pueden estar desactualizados"
  Color: naranja (no rojo — no es crítico, la app igual funciona con cache)
  Botón: [Reintentar]

Error de API de plataforma:
  En el video card afectado: badge "Datos desactualizados"
  No rompe la lista. Solo indica dónde hay datos frescos y dónde no.

Error en generación de script:
  Toast bottom: "No pudimos generar el guión — reintentando en 30s"
  El botón vuelve a estado inicial automáticamente.
```

### Loading States

```
PRINCIPIO: Nunca se muestra una pantalla en blanco.
Siempre hay algo visible: skeleton o datos cacheados.

Skeleton para VideoCard:
  Misma estructura que la card real.
  Áreas de texto: rectángulos de --bg-surface-2 con shimmer animation.
  El shimmer va de izquierda a derecha, loop continuo.
  Duración de shimmer: 1.5s por ciclo.

Skeleton para Comment Card:
  Misma estructura.
  3 cards skeleton mientras carga.

Carga de datos del Radar (primera vez del día):
  Banner: "🔍 Escaneando TikTok, Instagram y YouTube..."
  Progress bar thin debajo del banner
  La lista se va populando de arriba hacia abajo a medida que llegan datos.
  (No se espera a tener todo — streaming progresivo)
```

---

## 11. ANIMACIONES Y MICRO-INTERACCIONES

### Principio de animación

Toda animación tiene una razón funcional. No hay efectos decorativos. Las animaciones comunican estado, guían la atención o confirman acciones.

### Catálogo de animaciones

```
ENTRADA DE CARDS (Radar y Colador):
  Al entrar en viewport: translateY(16px) + opacity(0) → normal
  Duración: 300ms / easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
  Stagger: 60ms entre cards consecutivas (efecto cascada suave)

DOT "LIVE" (Top Bar):
  Pulso: scale(1) → scale(0.8) → scale(1)
  Duración: 2s / loop infinito
  Glow que respira al mismo ritmo

SCORE BAR (VideoCard):
  Al entrar en viewport: fill de 0 a [valor real]
  Duración: 800ms / easing: ease-out
  Delay: 200ms después de que la card aparece

GENERACIÓN DE SCRIPT (Fábrica):
  Los pasos de carga aparecen con fade-in secuencial
  Cada ⊙ tiene animación de rotación lenta (1s por ciclo)
  Al completarse: ⊙ → ✓ con scale(1.2) → scale(1) y color change

COMENTARIO RESPONDIDO (Colador):
  Card: opacity 1 → 0.4 + height → 0 en 400ms
  Simultáneo: contador de "Buy" en summary card -1 con animación numérica
  Toast: "✓ Texto copiado" en bottom de pantalla (2s, luego fade out)

NOTIFICACIÓN ENTRANTE (WebSocket):
  Badge en tab COLADOR: aparece con scale(0) → scale(1.2) → scale(1)
  Duración total: 400ms
  Si ya hay número: número hace flip vertical (slot machine effect)

FILTRO ACTIVADO:
  Chip: background fill con transition 200ms
  Lista: fade out → datos nuevos → fade in (300ms)
  Nunca scroll to top automático — el usuario puede estar leyendo

PULL TO REFRESH:
  Custom indicator: logo de SalesRadar que rota 360° mientras carga
  No el spinner genérico del sistema
```

---

## 12. RESPONSIVE Y ADAPTACIONES

### Mobile (principal — 375px a 428px)

```
Configuración base de toda la app.
Todo el diseño está pensado para este breakpoint primero.
1 columna. Scroll vertical. Bottom tabs.
```

### Tablet (768px a 1024px)

```
Layout de 2 columnas en RADAR:
├── Columna izquierda (360px): filtros + stats
└── Columna derecha (resto): lista de video cards (2 columnas de cards)

En COLADOR:
├── Columna izquierda: lista de comments
└── Columna derecha: panel de respuesta (siempre abierto, no drawer)

Navigation: sidebar en lugar de bottom tabs
```

### Desktop Web (1024px+)

```
3 columnas:
├── Sidebar fijo (220px): navegación + insights alert
├── Panel central (flex): contenido del módulo activo
└── Panel derecho (320px, opcional): 
    En Radar: detalle del video seleccionado
    En Fábrica: historial de scripts
    En Colador: panel de respuesta

El módulo COLADOR en desktop:
  Lista de comments a la izquierda.
  Al seleccionar un comment: panel de respuesta a la derecha.
  No drawers — todo visible simultáneamente.
```

---

## 13. ACCESIBILIDAD

### Mínimos no negociables

```
CONTRASTE:
  Todo texto sobre fondo oscuro: mínimo 4.5:1 (WCAG AA)
  Texto crítico (precios, scores, alertas): 7:1 (WCAG AAA)
  
  Verificar especialmente:
  - Texto --text-secondary (#8899AA) sobre --bg-surface (#0D1220) → ratio: 4.8:1 ✓
  - Badges de categoría: texto color sobre rgba background → verificar en implementación

TÁCTIL:
  Todo elemento interactivo: mínimo 44x44px de área táctil
  Espaciado entre elementos interactivos: mínimo 8px

LABELS SEMÁNTICOS:
  Todos los íconos tienen aria-label
  Ej: <button aria-label="Responder comentario de compra de @username">💬</button>
  Contadores dinámicos: aria-live="polite" para updates del Colador

MOVIMIENTO:
  @media (prefers-reduced-motion: reduce):
    Todas las animaciones: duration 0ms o reemplazadas por fade simple
    El dot LIVE: no pulsa, solo muestra color estático
```

---

*Documento de diseño — SalesRadar AI*  
*Toda decisión de diseño en este doc tiene una razón de negocio. Si algo se modifica, documentar el por qué.*
