import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Pozo Solidario'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          fontFamily: 'serif',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        <p
          style={{
            fontSize: '18px',
            color: 'rgba(74,222,128,0.7)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Sorteo solidario semanal
        </p>

        <h1
          style={{
            fontSize: '96px',
            fontWeight: 400,
            color: 'white',
            margin: 0,
            letterSpacing: '-2px',
            fontStyle: 'italic',
          }}
        >
          Pozo Solidario
        </h1>

        <p
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
          }}
        >
          Comprás un número, ayudás y participás.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '20px',
          }}
        >
          {['50% donaciones', '40% premios', '10% plataforma'].map(item => (
            <span
              key={item}
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.03)',
                padding: '8px 20px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
