# 🌊 Pozo Solidario

Una plataforma de sorteos solidarios semanales. Transparente, viral, emocionante.

## Stack

- **Next.js 15** (App Router)
- **TailwindCSS + Framer Motion**
- **MongoDB + Mongoose**
- **Mercado Pago** (Checkout Pro)
- **Gemini 2.5 Flash** (IA)
- **Vercel + Vercel Cron**

## Setup rápido

### 1. Cloná el repo

```bash
git clone https://github.com/tuuser/pozo-solidario
cd pozo-solidario
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Completá el archivo `.env.local`:

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | URI de conexión a MongoDB Atlas |
| `MP_ACCESS_TOKEN` | Access token de Mercado Pago |
| `MP_PUBLIC_KEY` | Public key de Mercado Pago |
| `GEMINI_API_KEY` | API key de Google AI Studio |
| `NEXT_PUBLIC_BASE_URL` | URL del sitio (ej: https://pozosolidario.com) |
| `ADMIN_SECRET` | Clave para el panel admin (inventala) |
| `CRON_SECRET` | Clave para el cron job (inventala) |
| `NEXT_PUBLIC_PRICE_PER_NUMBER` | Precio por número en ARS (default: 1000) |

### 3. Configurar Mercado Pago

1. Creá una cuenta en [mercadopago.com.ar](https://mercadopago.com.ar)
2. Accedé a **Tus integraciones → Credenciales**
3. Copiá el **Access Token** (producción o test)
4. Configurá el webhook en MP: `https://tupagina.com/api/webhooks/mercadopago`

### 4. Configurar MongoDB Atlas

1. Creá un cluster gratuito en [mongodb.com/atlas](https://mongodb.com/atlas)
2. Creá un usuario con contraseña
3. Copiá la URI de conexión

### 5. Configurar Gemini

1. Accedé a [aistudio.google.com](https://aistudio.google.com)
2. Creá una API key
3. Configurá la variable `GEMINI_API_KEY`

### 6. Deploy en Vercel

```bash
npm run build  # verificar que compila
vercel deploy
```

En Vercel, configurá las mismas variables de entorno.

El cron job está configurado en `vercel.json` para ejecutarse los **martes a las 00:00 UTC** (21:00 ART).

## Estructura del proyecto

```
pozo-solidario/
├── app/
│   ├── page.tsx           # Homepage
│   ├── gracias/page.tsx   # Página post-pago
│   ├── admin/page.tsx     # Panel admin
│   └── api/
│       ├── ai/            # IA Gemini
│       ├── causes/        # CRUD causas
│       ├── draw/          # Cron sorteo
│       ├── participation/ # Pagos MP
│       ├── pool/          # Estado del pozo
│       ├── prizes/        # Premios
│       ├── referrals/     # Sistema viral
│       ├── votes/         # Votación causas
│       ├── winners/       # Ganadores
│       └── webhooks/      # Webhook MP
├── components/
│   ├── sections/          # Hero, Causes, Prizes, Winners, Share
│   ├── AIAssistant.tsx    # Chat IA
│   ├── ParticipationModal.tsx
│   ├── MyNumbers.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── mongodb.ts         # Conexión DB
│   ├── mercadopago.ts     # Integración MP
│   ├── pool.ts            # Lógica del pozo
│   ├── utils.ts           # Helpers
│   └── week.ts            # Week ID
└── models/index.ts        # Modelos Mongoose
```

## Panel Admin

Accedé a `/admin` con la `ADMIN_SECRET` configurada.

Funciones:
- ✅ Aprobar/rechazar causas
- 🎁 Agregar premios de la semana
- 📊 Ver participaciones
- 🎯 Ejecutar sorteo manual (idempotente)

## Flujo del sorteo

1. **Todos los martes 21:00 ART** → Vercel Cron ejecuta `/api/draw`
2. Se consulta **Random.org** para obtener el número ganador
3. Se guardan los ganadores en MongoDB
4. Se reinician los votos para la siguiente semana
5. El resultado aparece automáticamente en la sección "Ganadores"

## Sistema viral

- Cada usuario tiene un `visitorId` único en `localStorage`
- Se genera un código de referido único por usuario
- Por cada 10 conversiones desde tu link → 1 número gratis
- Todo sin registro ni contraseña

## Transparencia

- Sorteos con Random.org (verificables)
- División del pozo 50/40/10 visible en tiempo real
- Donaciones documentadas con comprobantes
- Panel de ganadores público con número ganador

---

Hecho con ❤️ para ayudar causas reales.
