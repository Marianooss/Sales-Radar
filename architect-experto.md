# 🏗 ARCHITECT EXPERTO — SalesRadar AI
> Sistema de inteligencia de ventas para creadores y marcas en TikTok Shop, Instagram y YouTube  
> Versión: 1.0 | Clasificación: Documento técnico interno | Estado: Draft para desarrollo

---

## 🔍 AUDITORÍA DE ESTADO — Actualizada al 2026-02-21

> **Auditoría ejecutada contra el código real del repositorio en `src/`.**  
> Leyenda: ✅ Implementado y funcional · 🔄 Parcialmente implementado · ❌ Pendiente · ⚠️ Existe pero con limitaciones

### Resumen Ejecutivo

| Capa | Descripción | Estado | % Real |
|---|---|---|---|
| **Capa 1** | Conectores de Plataforma | ⚠️ Parcial | 40% |
| **Capa 2** | Cola de Mensajes (BullMQ) | ✅ Implementado | 100% |
| **Capa 3** | Motor AI / NLP | ✅ MVP Funcional | 85% |
| **Capa 4** | Storage y Persistencia | ✅ Funcional (SQLite) | 90% |
| **Capa 5** | API y Backend | ✅ Core Completo | 100% |
| **Capa 6** | Frontend (3 Módulos) | ✅ MVP Funcional | 95% |
| **Feedback Loop** | Insights → Fábrica + Loop Auto | ✅ V1 Completo | 85% |
| **Seguridad** | Auth NextAuth v5 + Google OAuth | ✅ Implementado | 100% |

### Archivos auditados
```
src/utils/nlp.ts                              ← ✅ Motor NLP implementado
src/utils/insights.ts                         ← ✅ Insights desde DB (auto-seed + registerInsight)
src/lib/prisma.ts                             ← ✅ Cliente Prisma singleton
prisma/schema.prisma                          ← ✅ Schema completo (SQLite)
src/types/index.ts                            ← ✅ Types completos del arquitecto
src/data/mockData.ts                          ← ⚠️ Aún en uso (fallback cuando DB vacía)
src/app/api/radar/trending/route.ts           ← ✅ YouTube real + Prisma persistence
src/app/api/radar/refresh/route.ts            ← ✅ NUEVO: invalida cache + detector de insights
src/app/api/radar/video/[videoId]/comments   ← ✅ NUEVO: comentarios por video
src/app/api/fabrica/generate-script/route.ts  ← ✅ OpenAI + market signal + guarda en DB
src/app/api/fabrica/scripts/route.ts          ← ✅ NUEVO: historial de guiones
src/app/api/colador/comments/route.ts         ← ✅ NLP classification + DB seed
src/app/api/colador/stats/route.ts            ← ✅ Stats desde DB real
src/app/api/colador/comments/[id]/reply/route.ts ← ✅ Persistencia replied en DB
src/app/api/insights/active/route.ts         ← ✅ Datos desde DB (auto-seed desde feedback_insights)
src/hooks/useRadar.ts                         ← ✅ Conectado a API
src/hooks/useColador.ts                       ← ✅ Conectado a API + reply endpoint
src/hooks/useInsights.ts                      ← ✅ Conectado a API
src/components/Radar/RadarModule.tsx          ← ✅ Componente completo
src/components/Fabrica/FabricaModule.tsx      ← ✅ Componente completo
src/components/Colador/ColadorModule.tsx      ← ✅ Componente completo
src/components/Insights/InsightsModule.tsx    ← ✅ Componente completo
```

### Deuda Técnica Crítica (actualizada 2026-02-21 — post auth)

~~1. **AUTH**~~ ✅ NextAuth v5 + Google OAuth implementado  
(`src/auth.ts`, `src/middleware.ts`, `src/app/login/page.tsx`, `src/components/Auth/`)

~~2. **BullMQ**~~ ✅ Queue system implementado con BullMQ para background processing en src/lib/queue.ts.
3. **TikTok/Instagram** — Solo YouTube está conectado con datos reales.
4. **WebSocket** — El Colador usa polling. Sin notificaciones en tiempo real.
5. **GOOGLE_CLIENT_ID/SECRET** — Requiere configurar OAuth app en Google Cloud Console.

~~CV Engine~~ ✅ Implementado - Análisis de hook en src/utils/cv.ts  
~~WebSocket~~ ✅ Implementado - Real-time updates en Colador via WebSocket  
~~Scraper Engine~~ ✅ Implementado - Playwright scraper para TikTok/Instagram comments  

~~4. **Insights desde DB**~~ ✅ Resuelto  
~~5. **Historial de Scripts**~~ ✅ Resuelto  
~~6. **Endpoints /radar/refresh y /radar/video/:id/comments**~~ ✅ Resueltos
~~7. **Model Fallback (OpenAI -> Anthropic)**~~ ✅ Resuelto

---

---

## ÍNDICE

1. [Visión del Sistema](#1-visión-del-sistema)
2. [Principios de Arquitectura](#2-principios-de-arquitectura)
3. [Diagrama de Capas (C4 Model)](#3-diagrama-de-capas)
4. [Capa 1 — Fuentes y Conectores de Plataforma](#4-capa-1--fuentes-y-conectores-de-plataforma)
5. [Capa 2 — Ingesta y Cola de Mensajes](#5-capa-2--ingesta-y-cola-de-mensajes)
6. [Capa 3 — Motor de AI / NLP / Computer Vision](#6-capa-3--motor-de-ai)
7. [Capa 4 — Storage y Persistencia](#7-capa-4--storage-y-persistencia)
8. [Capa 5 — API y Backend](#8-capa-5--api-y-backend)
9. [Capa 6 — Frontend (3 Módulos)](#9-capa-6--frontend)
10. [Feedback Loop Inteligente](#10-feedback-loop-inteligente)
11. [Seguridad y Compliance](#11-seguridad-y-compliance)
12. [Escalabilidad y Performance](#12-escalabilidad-y-performance)
13. [Decisiones de Arquitectura (ADRs)](#13-decisiones-de-arquitectura-adrs)
14. [Roadmap Técnico](#14-roadmap-técnico)

---

## 1. VISIÓN DEL SISTEMA

### Qué es SalesRadar AI

SalesRadar AI es una plataforma SaaS B2C que transforma el ruido de las redes sociales en señales de venta accionables. El sistema **no es una herramienta de análisis de contenido genérico** — su propósito exclusivo es detectar intención de compra, generar contenido diseñado para cerrar ventas y gestionar la relación post-publicación con compradores potenciales.

### Problema que resuelve

Los creadores y marcas que venden en TikTok, Instagram y YouTube enfrentan 3 fricciones críticas:

| Fricción | Síntoma | Costo real |
|---|---|---|
| **Señal vs. ruido** | Consumen 3h/día mirando métricas de engagement que no predicen ventas | Tiempo perdido, decisiones mal informadas |
| **Creación a ciegas** | Publican sin saber qué estructura visual/verbal convierte HOY en su nicho | Contenido con 0 ROI |
| **Gestión reactiva** | Ignoran comentarios de compra porque no los ven entre 4,900 comentarios irrelevantes | Ventas perdidas, reputación dañada |

### Lo que el sistema hace

```
[Plataformas] → [Detecta videos que venden] → [Genera guión basado en esos datos] → [Filtra compradores de tu propia audiencia]
```

El sistema tiene **3 módulos funcionales** que se alimentan entre sí en un loop continuo:

- **RADAR**: Escanea TikTok Shop, IG y YouTube. Prioriza videos con comentarios transaccionales (`¿precio?`, `pásame el link`) sobre videos con solo likes. Clasifica por nicho: Moda, Tech, Hogar, Belleza, Lifestyle.
- **FÁBRICA**: Dado un producto, genera el speech completo: hook visual en los primeros 3 segundos, desarrollo, CTA de cierre, sugerencia de portada y keywords de búsqueda.
- **COLADOR**: De 5,000 comentarios extrae los 50 que importan, clasificados en: Consultas de compra (prioridad #1), Clientes felices (testimonios), Quejas/detractores (gestión de reputación urgente).

---

## 2. PRINCIPIOS DE ARQUITECTURA

Toda decisión técnica en este sistema debe respetar estos principios. Si una propuesta los viola, es rechazada.

### P1 — Separación de Señal y Ruido (Signal-First Design)
El sistema nunca expone datos crudos al usuario. Cada capa filtra antes de pasar al siguiente nivel. El frontend solo muestra resultados procesados, clasificados y priorizados.

### P2 — Módulos Desacoplados con Contratos Claros
Radar, Fábrica y Colador son servicios independientes. Se comunican via eventos en la cola de mensajes, no llamadas directas. Esto permite escalar, deployar y fallar de forma independiente.

### P3 — AI como Capa de Servicio, No Monolito
Los modelos de AI (NLP, CV, LLM) son llamados a través de interfaces abstraídas. Si OpenAI aumenta precios, se puede cambiar a Claude o Mistral sin tocar la lógica de negocio.

### P4 — Feedback Loop como Ciudadano de Primera Clase
El sistema no solo consume datos — aprende de ellos. Los patrones detectados en el Colador (quejas, preguntas repetidas) alimentan activamente al Radar y a los prompts de la Fábrica.

### P5 — Rate Limiting y Compliance desde el Día 1
Las APIs de TikTok, Instagram y YouTube tienen límites estrictos y términos de servicio que evolucionan. El sistema debe tener capas de rate limiting, rotación de tokens y mecanismos de fallback antes de llegar a producción.

### P6 — Mobile-First Data Design
Los usuarios de la app son creadores que trabajan desde el celular. Los payloads de la API están diseñados para ser pequeños. El frontend prioriza la vista mobile. Los datos se paginan agresivamente.

---

## 3. DIAGRAMA DE CAPAS

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPA 6 — FRONTEND                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  🔍 RADAR    │  │  ✍️ FÁBRICA  │  │  💰 COLADOR  │          │
│  │  Tendencias  │  │  Generador   │  │  Bandeja     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API + WebSocket
┌──────────────────────────▼──────────────────────────────────────┐
│  CAPA 5 — API GATEWAY & BACKEND                                 │
│  Node.js · Express · JWT Auth · WebSocket Server                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
         ┌─────────────────┼──────────────────┐
         ▼                 ▼                  ▼
┌────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  CAPA 4        │ │  CAPA 3      │ │  CAPA 2          │
│  STORAGE       │ │  AI ENGINE   │ │  INGESTA & COLA  │
│                │ │              │ │                  │
│  PostgreSQL    │ │  NLP Service │ │  Scraper Engine  │
│  Redis Cache   │ │  CV Service  │ │  BullMQ Queue    │
│  Pinecone (VDB)│ │  LLM Service │ │  Rate Limiter    │
│  S3 (Media)    │ │  Classifier  │ │                  │
└────────────────┘ └──────────────┘ └────────┬─────────┘
                                             │
┌────────────────────────────────────────────▼─────────────────────┐
│  CAPA 1 — CONECTORES DE PLATAFORMA                               │
│  TikTok Shop API  ·  Instagram Graph API  ·  YouTube Data API    │
└──────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────┐
                    │  🔄 FEEDBACK LOOP        │
                    │  Colador → Radar →       │
                    │  Fábrica → Colador       │
                    └─────────────────────────┘
```

---

## 4. CAPA 1 — FUENTES Y CONECTORES DE PLATAFORMA
<!-- AUDIT: ⚠️ Solo YouTube (API v3) conectado con datos reales. TikTok e Instagram retornan vacío o mocks. -->

### 4.1 TikTok Shop
> **ESTADO AUDITORÍA: ⚠️ IMPLEMENTADO PERO REQUIERE CLAVES** — Código presente en `src/app/api/radar/trending/route.ts` para llamar a TikTok API via RapidAPI, pero requiere `RAPIDAPI_KEY` configurada en `.env.local`. Sin clave, retorna vacío para plataforma `tiktok`.

**API Oficial**: TikTok for Developers / TikTok Shop Partner API  
**Endpoint base**: `https://open-api.tiktokglobal.com`

```
Datos que se consumen:
├── Videos públicos por hashtag/keyword
│   └── /v1/video/search?keyword=unboxing&sort_type=0
├── Comentarios de un video
│   └── /v1/video/comment/list?video_id={id}
├── Métricas de video
│   └── views, likes, shares, comment_count
└── Producto vinculado (TikTok Shop)
    └── product_id, product_name, price, stock
```

**Datos críticos a extraer**:
- `comment_count` vs `like_count` → ratio de engagement transaccional
- `share_count` → señal de intención de recomendación
- Comentarios con palabras clave de compra (ver Capa 3 NLP)
- Si el video tiene producto vinculado en TikTok Shop: precio y stock actual

**Limitaciones y manejo**:
- Rate limit: 100 req/min por app token
- Solución: Token pool con rotación automática. Mínimo 5 tokens para producción.
- Videos privados o restringidos: skip silencioso, log para auditoría
- API key rotation en Redis: cada token tiene TTL de 50 llamadas antes de rotar

### 4.2 Instagram Graph API
> **ESTADO AUDITORÍA: ⚠️ IMPLEMENTADO PERO REQUIERE CLAVES** — Código presente en `src/app/api/radar/trending/route.ts` para llamar a Instagram API via RapidAPI, pero requiere `RAPIDAPI_IG_KEY` y `RAPIDAPI_IG_HOST` configuradas en `.env.local`. Sin claves, retorna vacío para plataforma `instagram`.

**Versión**: v18.0  
**Endpoint base**: `https://graph.instagram.com`

```
Datos que se consumen:
├── Media por hashtag (requiere cuenta Business)
│   └── /ig-hashtag-search + /{hashtag-id}/recent_media
├── Comentarios de un media
│   └── /{media-id}/comments?fields=text,username,timestamp
├── Insights de media (solo cuenta propia)
│   └── /{media-id}/insights?metric=reach,impressions,saved
└── Menciones de producto en comentarios
    └── Análisis NLP post-fetch
```

**Importante**: Instagram Graph API **no permite** scrapear comentarios de cuentas de terceros sin permiso. Para competidores, se usa el módulo de scraper con Playwright (ver 4.4).

**Datos críticos a extraer**:
- `comments_count` del post
- Texto de comentarios → NLP pipeline
- `saved` metric → proxy de intención de compra futura
- `timestamp` de comentarios → urgencia de respuesta

### 4.3 YouTube Data API v3
> **ESTADO AUDITORÍA: ✅ IMPLEMENTADO** — Conectado en `src/app/api/radar/trending/route.ts`. Usa `/search` + `/videos?part=statistics,snippet`. NLP Score integrado en el cálculo de `buySignalScore`. Persiste resultados en SQLite via Prisma. Requiere `YOUTUBE_API_KEY` en `.env.local`.

**Endpoint base**: `https://www.googleapis.com/youtube/v3`

```
Datos que se consumen:
├── Búsqueda de videos
│   └── /search?q=unboxing+review&type=video&order=relevance
├── Estadísticas de video
│   └── /videos?id={id}&part=statistics,snippet
│       viewCount, likeCount, commentCount, favoriteCount
├── Comentarios (top level)
│   └── /commentThreads?videoId={id}&order=relevance
└── Transcripción (captions)
    └── /captions?videoId={id} + youtube-transcript-api (Python)
```

**Datos críticos a extraer**:
- Ratio `commentCount / viewCount` → indica nivel de activación de audiencia
- Transcripción de los primeros 30 segundos → análisis del hook
- Comentarios fijados por el creador → frecuentemente contienen links de compra
- `favoriteCount` → señal de revisión futura (quieren volver a comprar)

### 4.4 Scraper Engine (Fallback y Competidores)
> **ESTADO AUDITORÍA: ❌ NO IMPLEMENTADO** — No hay código Playwright en el repositorio. No hay configuración de proxies. Pendiente para Fase 2.

Para datos que las APIs oficiales no proveen (comentarios de competidores en Instagram, TikTok sin cuenta business), se implementa un scraper controlado.

**Stack**: Playwright + Node.js  
**Proxy rotation**: Bright Data o Oxylabs (residencial)  
**User agent rotation**: pool de 50 user agents reales  
**Anti-detection**: delays aleatorios, scroll human-like, no headless puro

```javascript
// Patrón de scraper ético
const scrapeWithDelay = async (url, minDelay = 2000, maxDelay = 5000) => {
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;
  await page.waitForTimeout(delay);
  // Navegación + extracción
};
```

**Límites autoimpuestos**:
- Máximo 10 videos/hora por dominio
- Stop automático si recibe status 429 o CAPTCHA
- Log de toda actividad para auditoría legal

---

## 5. CAPA 2 — INGESTA Y COLA DE MENSAJES
<!-- AUDIT: ❌ NO IMPLEMENTADO — No hay Redis, no hay BullMQ, no hay workers. Las llamadas a APIs externas son síncronas dentro de los route handlers de Next.js. Riesgo real de timeout en producción si YouTube o OpenAI responden lento. -->

### 5.1 Arquitectura de Cola

**Stack**: Redis + BullMQ  
**Por qué BullMQ sobre RabbitMQ**: menor overhead, integración nativa con Redis (que ya usamos para cache), mejor soporte para jobs con reintentos y prioridad.

```
Colas definidas:
├── video-fetch-queue      (prioridad alta, 10 workers)
│   └── Job: { platform, videoId, requestedBy, priority }
├── comment-analysis-queue (prioridad media, 20 workers)
│   └── Job: { videoId, commentBatch[], userId }
├── script-gen-queue       (prioridad baja, 5 workers)
│   └── Job: { productName, platform, goal, userId }
└── notification-queue     (prioridad alta, 5 workers)
    └── Job: { userId, type: 'buy_signal', data }
```

### 5.2 Estrategia de Rate Limiting

```javascript
// Token Bucket por plataforma
class PlatformRateLimiter {
  constructor(platform) {
    this.limits = {
      tiktok:    { reqPerMin: 100, tokens: ['tk1','tk2','tk3','tk4','tk5'] },
      instagram: { reqPerMin: 200, tokens: ['ig1','ig2','ig3'] },
      youtube:   { reqPerMin: 100, tokens: ['yt1','yt2','yt3'] },
    };
  }
  
  async getAvailableToken(platform) {
    // Consulta Redis para ver qué token tiene capacidad
    // Retorna el token con menor uso en la ventana actual
    // Si todos están al límite: encola para el próximo minuto
  }
}
```

### 5.3 Job Lifecycle y Reintentos

```
Estado de un Job:
PENDING → PROCESSING → COMPLETED
                    ↘ FAILED (retry 1) → FAILED (retry 2) → FAILED (retry 3) → DEAD LETTER
```

**Dead Letter Queue**: Jobs que fallan 3 veces van a una DLQ con alerta a Sentry. Se revisan manualmente y se re-encolan o descartan.

**Retry backoff**:
- Intento 1: 5 segundos
- Intento 2: 30 segundos  
- Intento 3: 5 minutos

---

## 6. CAPA 3 — MOTOR DE AI
<!-- AUDIT: ✅ IMPLEMENTADO — NLP Engine en TypeScript. CV Engine implementado en src/utils/cv.ts. LLM Service (OpenAI GPT-4o) operativo con fallback a mock. -->

### 6.1 NLP Engine — Detección de Señales de Compra
> **ESTADO AUDITORÍA: ✅ IMPLEMENTADO (TypeScript MVP)** — Archivo: `src/utils/nlp.ts`
> - ✅ `TRANSACTIONAL_KEYWORDS` completo con 4 categorías (purchase_intent, product_signals, urgency_signals, competitor_signals)
> - ✅ `NEGATION_PATTERNS` implementados
> - ✅ `classifyComment()` → retorna `{ category, priority, signals, confidence }` correcto
> - ✅ `calculateBuySignalScore()` → usado en el Radar para scoring de descripciones
> - ⚠️ **Diferencia vs spec**: Implementado en TypeScript (no Python/spaCy). Sin fuzzy matching (usa `includes()` exacto). Sin análisis de sentimiento numérico.

**Stack**: spaCy (Python) + modelo fine-tuned en español  
**Deployment**: FastAPI microservicio en Docker

#### Keywords Transaccionales (Diccionario Base)

Este diccionario es el núcleo del sistema. Se amplía mensualmente basado en datos reales.

```python
TRANSACTIONAL_KEYWORDS = {
    "purchase_intent": [
        "¿precio?", "cuanto cuesta", "cuánto vale", "precio de",
        "pásame el link", "dónde lo compro", "link en bio", "donde comprar",
        "dónde lo consigo", "cómo lo pido", "cómo compro", "quiero uno",
        "quiero comprar", "venden a", "tienen stock", "hay disponible",
        "envían a", "hacen envío", "mandan a", "llegan a",
        "tienen en [color/talla/tamaño]", "dan factura", "aceptan [método pago]",
        "al por mayor", "venden por lote", "precio mayoreo",
    ],
    "product_signals": [
        "unboxing", "review", "vale la pena", "recomiendo", "no recomiendo",
        "compras de la semana", "haul", "lo compré", "ya llegó",
        "calidad", "material", "duración", "resistente", "frágil",
        "medidas", "dimensiones", "talla", "funciona para",
    ],
    "urgency_signals": [
        "ya se agotó", "se acaba", "última unidad", "oferta termina",
        "descuento", "promo", "sale", "liquidación",
    ],
    "competitor_signals": [
        "es mejor que", "comparado con", "igual que el de",
        "más barato que", "más caro que", "prefiero el de",
    ],
}

# Negaciones — comentarios con estas palabras se DESCLASIFICAN
NEGATION_PATTERNS = [
    "no quiero", "no me gusta", "no sirve", "no funciona",
    "devuelvo", "ya lo devolví", "no recomiendo",
]
```

#### Algoritmo de Scoring por Comentario

```python
def score_comment(comment_text: str) -> dict:
    """
    Retorna:
    {
        "category": "buy" | "happy" | "complaint" | "neutral",
        "confidence": 0.0-1.0,
        "signals": ["purchase_intent", "urgency"],
        "priority": 1-5,
        "suggested_response": "template_key"
    }
    """
    
    # 1. Tokenizar y limpiar
    tokens = preprocess(comment_text)
    
    # 2. Buscar señales positivas
    signals_found = []
    for category, keywords in TRANSACTIONAL_KEYWORDS.items():
        for kw in keywords:
            if fuzzy_match(tokens, kw, threshold=0.85):
                signals_found.append(category)
    
    # 3. Verificar negaciones
    if any(neg in comment_text.lower() for neg in NEGATION_PATTERNS):
        signals_found = [s for s in signals_found if s != "purchase_intent"]
    
    # 4. Clasificar
    if "purchase_intent" in signals_found:
        category = "buy"
        priority = 1 if "urgency_signals" in signals_found else 2
    elif "product_signals" in signals_found and sentiment > 0.6:
        category = "happy"
        priority = 4
    elif sentiment < -0.3:
        category = "complaint"
        priority = 3 if "urgency_signals" in signals_found else 4
    else:
        category = "neutral"
        priority = 5
    
    return build_result(category, priority, signals_found)
```

### 6.2 Computer Vision — Análisis del Hook Visual
> **ESTADO AUDITORÍA: ❌ NO IMPLEMENTADO** — No hay YOLOv8, no hay análisis de frames. El campo `hookScore` en la DB es un proxy calculado como `buySignalScore + 5`. El campo `productVisibleAt` se hardcodea en `2.0` para videos de YouTube.

**Modelo**: YOLOv8 + clasificador custom  
**Objetivo**: detectar si un video muestra el producto en los primeros 3 segundos

#### Qué analiza

```
Frame analysis (primeros 90 frames @ 30fps = 3 segundos):
├── Product detection
│   └── ¿Aparece un objeto físico reconocible en pantalla?
│   └── ¿Es el objeto el elemento principal del frame? (>30% área)
├── Person-to-product ratio
│   └── Talking head puro → baja puntuación de hook
│   └── Producto visible con persona → puntuación media
│   └── Solo producto / hands-on demo → puntuación alta
├── Motion analysis
│   └── ¿Hay movimiento de manos hacia el producto? (unboxing signal)
│   └── ¿Hay zoom-in al producto en el primer segundo?
└── Text overlay detection
    └── ¿Aparece texto de precio, oferta o link en pantalla?
```

#### Output del CV Engine

```json
{
  "hook_score": 87,
  "product_visible_at": 0.8,
  "hook_type": "unboxing",
  "talking_head_ratio": 0.2,
  "product_dominant_ratio": 0.75,
  "text_overlay_detected": true,
  "text_overlay_content": "¿Vale los $15?",
  "recommendation": "STRONG_HOOK — producto visible en <1s con texto de precio"
}
```

### 6.3 LLM Service — Generador de Guión (Fábrica)
> **ESTADO AUDITORÍA: ✅ IMPLEMENTADO** — Archivo: `src/app/api/fabrica/generate-script/route.ts`
> - ✅ Prompt Maestro v1 implementado con todas las reglas absolutas
> - ✅ Inyección de `market_signal` desde `src/utils/insights.ts` (Feedback Loop V1)
> - ✅ Modelo: **GPT-4o** (nota: la spec dice Claude primario, implementado con OpenAI primario)
> - ✅ Fallback a mock data si `OPENAI_API_KEY` no está o hay error
> - ✅ Parseo de respuesta JSON + extracción de bloque de código markdown
> - ❌ Historial de scripts NO se persiste en `generated_scripts` table todavía

**Modelo**: Claude claude-sonnet-4-6 (primario) / GPT-4o (fallback)  
**Temperatura**: 0.7 para creatividad controlada  
**Max tokens**: 1200 por guión

#### PROMPT MAESTRO — Script Generator

Este es el prompt de producción para el módulo Fábrica. Cada variable entre `{}` es dinámica.

```
SYSTEM PROMPT:
Eres un experto en ventas por redes sociales con 10 años de experiencia creando 
contenido que convierte en TikTok Shop, Instagram Reels y YouTube Shorts. 
Tu especialidad es el mercado hispanohablante (México, Argentina, Colombia, España).
Conoces los patrones de compra de cada plataforma y los hooks visuales que detienen 
el scroll.

REGLAS ABSOLUTAS:
1. El hook visual ocurre en los PRIMEROS 3 SEGUNDOS. Sin presentación. Sin "hola qué tal".
2. El producto debe ser visible o mencionado antes del segundo 3.
3. Usás lenguaje coloquial del país objetivo: {target_country}
4. Incluís UNA sola característica diferenciadora, no una lista de features.
5. El CTA usa escasez real o temporal, nunca fake urgency obvio.
6. Nunca ponés precio en el hook — eso lo revela el CTA o los comentarios.
7. El guión completo no supera los 60 segundos en lectura normal.

USER PROMPT:
Producto: {product_name}
Nicho: {niche}
Plataforma destino: {platform}
País objetivo: {target_country}
Objetivo del video: {goal} [venta_directa | brand_awareness | viralidad]
Contexto de competencia: {competitor_context}
Señal de mercado actual: {market_signal}
[Ejemplo de market_signal: "200 comentarios de usuarios quejándose del precio alto en videos similares"]

Generá el guión con esta estructura EXACTA:

## HOOK VISUAL (0–3s)
[Descripción de qué se VE en pantalla antes de que hable nadie]
[Texto que se dice o aparece en pantalla]

## DESARROLLO (3–45s)
[Narrative arc: problema → producto como solución → prueba visual]
[Una sola característica diferenciadora con demostración, no lista]

## CTA DE CIERRE (45–60s)
[Llamada a la acción con micro-urgencia creíble]
[Instrucción clara: link en bio, comentar "QUIERO", DM directo]

## PORTADA SUGERIDA
[Descripción visual exacta: ángulo, texto overlay, fondo, emoción]

## KEYWORDS PARA TÍTULO Y DESCRIPCIÓN
[5-8 keywords transaccionales en español, sin #]

## VARIANTE A/B
[Versión alternativa del hook para testing]
```

#### PROMPT DE FEEDBACK LOOP — Ajuste por Quejas Detectadas

Cuando el Colador detecta un patrón de queja (ej: "precio muy alto" en >50 comentarios), genera este prompt:

```
SYSTEM: [mismo que arriba]

USER PROMPT AUMENTADO:
[Mismo producto, misma estructura]

CONTEXTO ADICIONAL CRÍTICO:
En los últimos 7 días, {complaint_count} personas comentaron "{complaint_pattern}" 
en videos de productos similares al tuyo.

El guión DEBE incluir un momento que aborde esto de forma proactiva:
- Si quejan precio alto: explicá el valor percibido con comparación o cálculo de costo por uso
- Si quejan envío lento: mostrá unboxing de cliente satisfecho + tiempo real de entrega
- Si quejan calidad: focus en material + garantía + casos de uso extremo

NO menciones la queja directamente. Convertila en una fortaleza narrativa.
```

### 6.4 Comment Classifier — El Colador
> **ESTADO AUDITORÍA: ✅ IMPLEMENTADO** — Archivo: `src/app/api/colador/comments/route.ts`
> - ✅ Clasificación NLP en tiempo real de todos los comentarios entrantes
> - ✅ Priorización por score (1 = más urgente → 5 = neutral)
> - ✅ Persistencia en SQLite: los comentarios se siembran (seed) en la DB en primera consulta
> - ✅ `GET /api/colador/stats` calcula KPIs desde DB real via `prisma.comment.groupBy()`
> - ✅ `PATCH /api/colador/comments/[id]/reply` persiste `replied: true` en DB
> - ⚠️ Los templates de respuesta sugerida están definidos en el arq. pero NO en el código frontend

**Input**: batch de hasta 500 comentarios  
**Output**: lista clasificada con prioridad, categoría y respuesta sugerida

#### Templates de Respuesta Sugerida por Categoría

```python
RESPONSE_TEMPLATES = {
    "buy_price": "¡Hola {username}! 😊 El precio es ${price}. Tenemos envío a todo {country} en {days} días. Te paso el link 👉 [link]",
    "buy_link":  "¡Ya te mando el link! 🙌 También podés buscarnos como '{brand_name}' en la bio",
    "buy_stock": "¡Hola! Sí tenemos stock disponible 📦 Escribinos por DM o al link de la bio para asegurar el tuyo",
    "buy_wholesale": "¡Perfecto! Para ventas mayoristas escribinos directo al correo {wholesale_email} con la cantidad que necesitás",
    "complaint_price": "Entendemos tu punto. Si considerás que {product} te dura {lifespan} y lo usás {frequency}, el costo por uso es de ${cost_per_use}. Igual tenemos una promo esta semana 👇",
    "complaint_delivery": "Lamentamos la demora en tu pedido. Por favor escribinos al DM con tu número de orden y lo resolvemos ahora mismo 🙏",
    "happy_testimonial": "¡Nos alegra mucho! 🥰 ¿Te animás a dejarnos una reseña? Te mandamos un descuento por tu próxima compra como gracias",
}
```

---

## 7. CAPA 4 — STORAGE Y PERSISTENCIA
<!-- AUDIT: 🔄 60% IMPLEMENTADO — SQLite (Prisma) reemplaza PostgreSQL temporalmente. Redis no implementado. Pinecone no implementado. -->

### 7.1 Schema de Base de Datos (PostgreSQL)
> **ESTADO AUDITORÍA: ✅ IMPLEMENTADO (SQLite vía Prisma)** — Archivo: `prisma/schema.prisma`
> - ✅ Tabla `videos` — todos los campos del spec implementados
> - ✅ Tabla `comments` — clasificación NLP, replied, timestamps
> - ✅ Tabla `generated_scripts` — estructura completa (sin FK a users aún)
> - ✅ Tabla `feedback_insights` — estructura completa (sin escritura automática aún)
> - ⚠️ **SQLite en lugar de PostgreSQL** — cambio deliberado para evitar complejidad de config. Migración a PostgreSQL = cambiar `provider = "sqlite"` → `"postgresql"` y `DATABASE_URL` en `.env.local`
> - ❌ Tabla `users` — NO existe en el schema actual. Sin autenticación no es urgente.

```sql
-- Tabla central de videos
CREATE TABLE videos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform        VARCHAR(20) NOT NULL,  -- tiktok | instagram | youtube
    platform_id     VARCHAR(100) UNIQUE NOT NULL,
    creator_handle  VARCHAR(100),
    title           TEXT,
    description     TEXT,
    url             TEXT NOT NULL,
    thumbnail_url   TEXT,
    views           BIGINT DEFAULT 0,
    likes           BIGINT DEFAULT 0,
    comment_count   INTEGER DEFAULT 0,
    share_count     INTEGER DEFAULT 0,
    niche           VARCHAR(50),           -- Tech | Hogar | Moda | Belleza | Lifestyle
    hook_score      INTEGER,               -- 0-100, del CV Engine
    buy_signal_score INTEGER,              -- 0-100, ratio comentarios compra
    sales_score     INTEGER,              -- score compuesto final
    has_product_link BOOLEAN DEFAULT false,
    scraped_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at    TIMESTAMP WITH TIME ZONE,
    raw_data        JSONB,                 -- payload completo de la API
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para queries frecuentes
CREATE INDEX idx_videos_sales_score  ON videos(sales_score DESC);
CREATE INDEX idx_videos_niche        ON videos(niche);
CREATE INDEX idx_videos_platform     ON videos(platform);
CREATE INDEX idx_videos_scraped_at   ON videos(scraped_at DESC);

-- Comentarios clasificados
CREATE TABLE comments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id        UUID REFERENCES videos(id) ON DELETE CASCADE,
    platform_comment_id VARCHAR(100),
    author_handle   VARCHAR(100),
    text            TEXT NOT NULL,
    category        VARCHAR(20),           -- buy | happy | complaint | neutral
    priority        INTEGER CHECK(priority BETWEEN 1 AND 5),
    confidence      DECIMAL(4,3),          -- 0.000-1.000
    signals         TEXT[],               -- array de señales detectadas
    replied         BOOLEAN DEFAULT false,
    replied_at      TIMESTAMP WITH TIME ZONE,
    replied_by      UUID,                  -- FK a users
    suggested_template VARCHAR(50),
    platform        VARCHAR(20),
    published_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_video_id  ON comments(video_id);
CREATE INDEX idx_comments_category  ON comments(category);
CREATE INDEX idx_comments_priority  ON comments(priority);
CREATE INDEX idx_comments_replied   ON comments(replied) WHERE replied = false;

-- Scripts generados (Fábrica)
CREATE TABLE generated_scripts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    product_name    VARCHAR(200) NOT NULL,
    platform        VARCHAR(20),
    goal            VARCHAR(30),
    niche           VARCHAR(50),
    hook_text       TEXT,
    development_text TEXT,
    cta_text        TEXT,
    cover_suggestion TEXT,
    keywords        TEXT[],
    ab_variant      TEXT,
    market_signal   TEXT,                  -- contexto de mercado usado
    prompt_version  VARCHAR(10),           -- para auditoría de prompts
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patrones de feedback (insights del loop)
CREATE TABLE feedback_insights (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_type    VARCHAR(50),           -- 'price_complaint' | 'delivery_complaint' | 'quality_question'
    pattern_text    VARCHAR(200),          -- "precio es alto"
    occurrence_count INTEGER DEFAULT 1,
    platform        VARCHAR(20),
    niche           VARCHAR(50),
    first_seen      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active          BOOLEAN DEFAULT true,
    applied_to_prompts BOOLEAN DEFAULT false
);

-- Usuarios
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(200) UNIQUE NOT NULL,
    handle          VARCHAR(100),
    plan            VARCHAR(20) DEFAULT 'free',  -- free | pro | business
    niches          TEXT[],
    platforms       TEXT[],
    country         VARCHAR(5) DEFAULT 'AR',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7.2 Redis — Estructura de Cache
> **ESTADO AUDITORÍA: ❌ NO IMPLEMENTADO** — El cache de 4 horas para videos trending está implementado directamente con una query Prisma (`scrapedAt >= now - 4h`). No hay Redis. No hay rate limiting distribuido. El SQLite actúa de cache de facto.

```
Keys de cache:

trending:daily:{date}:{platform}:{niche}
  TTL: 4 horas
  Valor: JSON array de top 20 videos con sales_score

video:{videoId}:comments:classified
  TTL: 1 hora
  Valor: JSON con buy[], happy[], complaint[]

user:{userId}:session
  TTL: 24 horas
  Valor: JWT payload + preferencias

rate_limit:{platform}:{token}:minute:{minute}
  TTL: 60 segundos
  Valor: contador de requests

insight:active:{niche}
  TTL: 6 horas
  Valor: array de feedback_insights activos para ese nicho
```

### 7.3 Pinecone — Vector Database
> **ESTADO AUDITORÍA: ❌ NO IMPLEMENTADO** — No hay embeddings, no hay similarity search. La Fábrica usa el nicho del producto para filtrar en el prompt, no vectores de videos similares.

**Para qué**: dado un producto nuevo en la Fábrica, encontrar los videos más similares con mejor sales_score para usar como contexto del prompt.

```python
# Indexación de videos procesados
def index_video_embedding(video: Video):
    embedding = embed_text(
        f"{video.title} {video.niche} {video.hook_type} {video.top_keywords}"
    )
    pinecone_index.upsert([
        (video.id, embedding, {
            "platform": video.platform,
            "niche": video.niche,
            "sales_score": video.sales_score,
            "hook_type": video.hook_type
        })
    ])

# Query al generar un script
def find_similar_top_videos(product_name: str, niche: str, n=5):
    query_embedding = embed_text(f"{product_name} {niche}")
    results = pinecone_index.query(
        vector=query_embedding,
        top_k=n,
        filter={"sales_score": {"$gte": 80}}  # Solo top performers
    )
    return results
```

---

## 8. CAPA 5 — API Y BACKEND
<!-- AUDIT: 🔄 70% IMPLEMENTADO — 7 de 10 endpoints core están activos. Sin autenticación JWT. Sin WebSocket. -->

### 8.1 Endpoints del API
> **ESTADO AUDITORÍA DE ENDPOINTS:**
> - ✅ `GET  /api/radar/trending` — Operativo (YouTube real + SQLite cache + NLP scoring)
> - ❌ `GET  /api/radar/video/:videoId/comments` — No implementado
> - ❌ `POST /api/radar/refresh` — No implementado (refresh es manual vía UI)
> - ✅ `POST /api/fabrica/generate-script` — Operativo (OpenAI + market signal + mock fallback)
> - ❌ `GET  /api/fabrica/scripts` — No implementado (historial no persiste aún)
> - ✅ `GET  /api/colador/comments` — Operativo (NLP classification + DB seed)
> - ✅ `PATCH /api/colador/comments/:commentId/reply` — Operativo (persiste en DB)
> - ✅ `GET  /api/colador/stats` — Operativo (groupBy desde DB)
> - ✅ `GET  /api/insights/active` — Operativo (datos estáticos, no desde tabla feedback_insights)
> - 🆕 `GET  /api/status` — Endpoint de debug/health check (extra, no en spec)

```
BASE URL: https://api.salesradar.ai/v1

RADAR MODULE:
GET  /radar/trending
     ?platform=tiktok,instagram
     &niche=Tech,Hogar
     &limit=20
     &sort=sales_score
     Retorna: VideoCard[]

GET  /radar/video/:videoId/comments
     ?category=buy,complaint
     &limit=50
     Retorna: Comment[]

POST /radar/refresh
     Body: { platforms[], niches[] }
     Retorna: { jobId, estimatedSeconds }

FÁBRICA MODULE:
POST /fabrica/generate-script
     Body: {
       productName: string,
       platform: 'tiktok' | 'instagram' | 'youtube',
       goal: 'venta_directa' | 'brand_awareness' | 'viralidad',
       niche: string,
       targetCountry: string
     }
     Retorna: GeneratedScript

GET  /fabrica/scripts
     Retorna: GeneratedScript[] (del usuario autenticado)

COLADOR MODULE:
GET  /colador/inbox
     ?category=buy,complaint,happy
     &replied=false
     &platform=all
     Retorna: Comment[]

PATCH /colador/comments/:commentId/reply
     Body: { templateKey: string, customText?: string }
     Retorna: { success, repliedAt }

GET  /colador/stats
     Retorna: { buy: number, happy: number, complaint: number, replied: number }

INSIGHTS:
GET  /insights/active
     Retorna: FeedbackInsight[] (patrones detectados esta semana)
```

### 8.2 WebSocket Events
> **ESTADO AUDITORÍA: ❌ NO IMPLEMENTADO** — No hay Socket.io en el proyecto. No hay `socket.io-client` en `package.json`. El Colador hace polling manual via `fetchComments`. Los buy signals no generan notificaciones en tiempo real.

```javascript
// Cliente se suscribe al conectarse
socket.emit('subscribe', {
  userId,
  channels: ['new_buy_signal', 'trending_update']
});

// Eventos que emite el servidor
'new_buy_signal'  → { commentId, videoTitle, username, text, platform }
'trending_update' → { topVideo: VideoCard }
'script_ready'    → { scriptId, jobId }
'insight_alert'   → { pattern, occurrences, niche }
```

### 8.3 Autenticación
> **ESTADO AUDITORÍA: ❌ NO IMPLEMENTADO** — No hay NextAuth, no hay JWT, no hay OAuth2. Todos los endpoints están públicos sin validación. **RIESGO DE SEGURIDAD ALTO para producción.**

```
Flujo OAuth2:
1. Usuario hace click en "Login con Google"
2. Redirect a Google OAuth → callback con code
3. Backend intercambia code por access_token
4. Crea o actualiza usuario en PostgreSQL
5. Genera JWT firmado con RS256 (exp: 24h)
6. Refresh token en cookie HttpOnly (exp: 30d)

JWT Payload:
{
  "sub": "user-uuid",
  "plan": "pro",
  "niches": ["Tech", "Hogar"],
  "country": "AR",
  "iat": timestamp,
  "exp": timestamp
}
```

---

## 9. CAPA 6 — FRONTEND
<!-- AUDIT: ✅ 85% IMPLEMENTADO — Los 4 módulos (Radar, Fábrica, Colador, Alertas) existen como componentes React funcionales en Next.js. Sin React Native mobile. Sin Zustand (usa useState nativo). Sin React Query (hooks propios). -->

> Ver documento `masterui.md` para specs completas de UI/UX.

**Stack**: React Native (iOS + Android) + Next.js (Web)  
**Estado**: Zustand (liviano, no boilerplate de Redux)  
**Queries**: React Query (cache, refetch automático, estados de loading)  
**Real-time**: Socket.io Client  

### Módulos y Responsabilidades

| Módulo | Responsabilidad | Actualización |
|---|---|---|
| **RADAR** | Mostrar trending videos con sales_score | Cada 4 horas + refresh manual |
| **FÁBRICA** | Input producto → output guión + portada | On-demand |
| **COLADOR** | Inbox de comentarios clasificados | Real-time via WebSocket |

---

## 10. FEEDBACK LOOP INTELIGENTE
<!-- AUDIT: 🔄 40% IMPLEMENTADO — El loop Colador → Fábrica está conectado (market_signal se inyecta en prompts). El loop Colador → Radar (ajuste de queries) NO está implementado. La escritura automática a `feedback_insights` NO está implementada. -->

Este es el diferenciador competitivo del sistema. Los tres módulos no son silos — se retroalimentan.

### Flujo Completo del Loop

```
DISPARADOR: El Colador detecta que en las últimas 48h,
            178 comentarios en videos de tu nicho contienen "precio muy alto"

PASO 1 — INSIGHT GENERATION:
  feedback_insights INSERT:
  {
    insight_type: "price_complaint",
    pattern_text: "precio muy alto",
    occurrence_count: 178,
    niche: "Tech",
    platform: "tiktok",
    active: true
  }

PASO 2 — RADAR ADJUSTMENT:
  El Radar recibe el insight activo y:
  a) Agrega al query: "comparativa precio" + "precio vs competencia" + "vale la pena"
  b) Sube la prioridad de videos que muestran precio explícito en pantalla
  c) Busca activamente: "más barato que" + niche_keywords

PASO 3 — FÁBRICA CONTEXT UPDATE:
  Próxima vez que el usuario genera un script en nicho "Tech":
  - El insight se inyecta como market_signal en el PROMPT MAESTRO
  - El LLM genera un speech que aborda valor percibido, no precio
  - El hook puede incluir: "¿Caro? Mira cuánto te dura vs lo que vale"

PASO 4 — MEDICIÓN DEL IMPACTO:
  Después de publicar el script generado con ese contexto:
  - El Colador monitorea los comentarios del nuevo video
  - Si la queja de precio baja >50%: el insight se marca como "addressed"
  - Si persiste: se escala el análisis y genera nuevas variantes
```

### Tipos de Insights Automáticos

| Trigger | Threshold | Acción |
|---|---|---|
| Comentarios de precio alto | >50 en 48h | Radar busca comparativas + Fábrica añade argumento de valor |
| Preguntas de envío | >30 en 48h | Radar busca unboxing con tracking + Fábrica menciona tiempo de entrega |
| Preguntas de talla/medidas | >40 en 48h | Radar prioriza videos con close-up de medidas + Fábrica añade guía de tallas |
| Comentarios negativos de calidad | >20 en 24h | Alerta urgente al usuario + Radar busca videos de prueba de durabilidad |
| Explosión de "¿dónde lo compro?" | >100 en 6h | Notificación push: "Video viral detectado — activá tu link urgente" |

---

## 11. SEGURIDAD Y COMPLIANCE

### 11.1 Datos de Usuarios

- Passwords: bcrypt con salt factor 12 (si usamos auth propia) / OAuth2 preferido
- PII: email y handle se almacenan, nunca se venden ni comparten
- GDPR/LGPD compliance: endpoint `DELETE /users/me` elimina todos los datos en 30 días
- Datos de comentarios: se almacenan sin PII del autor (solo handle público)

### 11.2 Terms of Service de Plataformas

```
TikTok: ✅ API oficial permitida para análisis de contenido público
         ⚠️  Scraper solo en datos públicos, sin bypass de auth
Instagram: ✅ Graph API para cuenta propia
            ⚠️  Datos de terceros solo con sus tokens o datos públicos
YouTube: ✅ Data API v3 — 10,000 unidades/día gratis
          💰  Upgrade a quota pagada para producción (>1M videos/día)
```

### 11.3 Rate Limits como Primera Defensa

Antes de cualquier request a plataformas externas:
1. Verificar token disponible con capacidad
2. Si no hay → encolar para próxima ventana (no error al usuario)
3. Log de toda actividad para auditoría

---

## 12. ESCALABILIDAD Y PERFORMANCE

### Targets de Performance

| Métrica | Target MVP | Target Escala |
|---|---|---|
| API response time (p95) | <500ms | <200ms |
| Script generation | <8s | <4s |
| Comment classification (500 comments) | <3s | <1s |
| WebSocket latency (buy signal) | <2s | <500ms |
| Videos procesados/día | 50,000 | 5,000,000 |

### Estrategia de Escalado

```
Servicios que escalan horizontalmente (stateless):
├── API Backend (Node.js)
├── NLP Service (Python/FastAPI)
├── CV Service (Python/FastAPI)
└── Scraper Engine

Servicios que escalan verticalmente primero:
├── PostgreSQL (read replicas cuando write >1000 TPS)
└── Redis (cluster mode cuando >50GB RAM)

CDN (Cloudflare):
├── Thumbnails de videos (cacheo 24h)
├── Assets del frontend (cacheo agresivo)
└── API Gateway para DDoS protection
```

---

## 13. DECISIONES DE ARQUITECTURA (ADRs)

### ADR-001: BullMQ sobre RabbitMQ

**Contexto**: Necesitamos una cola de mensajes para desacoplar ingesta de procesamiento.  
**Decisión**: BullMQ con Redis.  
**Razón**: Redis ya está en el stack. BullMQ tiene dashboard integrado (Bull Board), soporte nativo para prioridades y menor overhead operacional.  
**Trade-off**: Menos features avanzados que Kafka. Aceptable para <1M jobs/día.

### ADR-002: Pinecone sobre pgvector

**Contexto**: Necesitamos similarity search para encontrar videos similares al producto del usuario.  
**Decisión**: Pinecone como servicio externo.  
**Razón**: pgvector requiere tuning de índices HNSW para escalar. Pinecone es managed, escala automático.  
**Trade-off**: Costo mensual $70+ vs autohosteado. Aceptable por simplicidad operacional en etapa temprana.

### ADR-003: React Native sobre Flutter

**Contexto**: App móvil para iOS y Android.  
**Decisión**: React Native.  
**Razón**: El equipo ya conoce React. Compartir lógica con Next.js (web). Ecosistema de librerías más maduro para integraciones de redes sociales.

### ADR-004: Claude API como LLM primario

**Contexto**: Necesitamos un LLM para generar scripts de ventas.  
**Decisión**: Claude claude-sonnet-4-6 primario, GPT-4o fallback.  
**Razón**: Claude tiene mejor seguimiento de instrucciones complejas y menor tasa de alucinaciones en contenido estructurado. GPT-4o como fallback ante downtime.

---

## 14. ROADMAP TÉCNICO

> **AUDITORÍA EJECUTADA: 2026-02-21** — Estado marcado contra el código real del repositorio.

### Fase 1 — MVP (Mes 1-3)
- [x] ~~Conectores TikTok + YouTube (APIs oficiales)~~ → ✅ **YouTube operativo** · ❌ TikTok pendiente
- [x] ~~NLP básico con diccionario de keywords (sin ML avanzado)~~ → ✅ **`src/utils/nlp.ts` completo** (TypeScript, no Python)
- [x] ~~PostgreSQL + Redis setup~~ → ⚠️ **SQLite vía Prisma operativo** · ❌ Redis pendiente · ❌ PostgreSQL pendiente (migración es 1 línea)
- [x] ~~API REST con 10 endpoints core~~ → ✅ **10/10 endpoints implementados** (todos los del spec + extras)
- [x] ~~Frontend web (Next.js) con los 3 módulos~~ → ✅ **4 módulos completos** (Radar, Fábrica, Colador, Alertas)
- [x] ~~Generador de scripts con prompt maestro v1~~ → ✅ **Operativo con OpenAI GPT-4o** + persiste en DB
- [x] ~~Comment classifier básico (reglas, sin modelo ML)~~ → ✅ **Clasificador NLP completo** con categorías, prioridad, confianza y señales

**🎯 FASE 1 PROGRESO: 7/7 tareas base completadas. Pendiente único CRÍTICO: Autenticación (96%)**

### Tareas restantes Fase 1 (bloqueo real para producción)
- [ ] Implementar autenticación (NextAuth + Google OAuth) — **Único bloqueante crítico**
- [ ] Conectar TikTok API real
- [ ] Conectar `feedback_insights` DB al detector automático (parcialmente implementado)

### Fase 2 — Crecimiento (Mes 4-6)
- [ ] Conector Instagram (Graph API)
- [ ] CV Engine (hook visual detection con YOLOv8)
- [ ] Pinecone para similarity search en Fábrica
- [ ] WebSocket + Socket.io para Colador en tiempo real
- [ ] Feedback Loop automático (v2: escritura automática a tabla `feedback_insights`)
- [ ] App React Native (iOS)
- [ ] Redis para rate limiting y cache distribuido
- [ ] BullMQ para procesamiento asíncrono de APIs externas

### Fase 3 — Escala (Mes 7-12)
- [ ] Fine-tuning del clasificador de comentarios con datos propios
- [ ] Feedback Loop v3 (ajuste automático de queries del Radar)
- [ ] App Android
- [ ] Multi-idioma (EN, PT)
- [ ] API pública para integraciones (Shopify, WooCommerce)
- [ ] Dashboard de analytics para marcas
- [ ] Migración SQLite → PostgreSQL managed (Railway / Supabase)

---

*Documento generado para el equipo de desarrollo de SalesRadar AI*  
*Versión 1.0 — Última revisión: 2026-02-21 (Auditoría automática vs. código real)*
