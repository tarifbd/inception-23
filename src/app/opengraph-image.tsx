import { ImageResponse } from 'next/og';

export const alt = 'Inception 23 - Advisory, Consulting and Business Solutions';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f8fafc',
          color: '#12051f',
          padding: '70px 76px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              width: 70,
              height: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #dbe4ec',
              borderRadius: 12,
              background: '#ffffff',
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            i23
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 34, fontWeight: 800 }}>INCEPTION 23</div>
            <div style={{ marginTop: 7, color: '#64748b', fontSize: 18, letterSpacing: 3 }}>
              CLEAR THINKING. BETTER WORK.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 980 }}>
          <div style={{ color: '#0783a3', fontSize: 22, fontWeight: 700 }}>ADVISORY / CONSULTING / SOLUTIONS</div>
          <div style={{ marginTop: 20, fontSize: 68, lineHeight: 1.04, fontWeight: 800 }}>
            Practical systems for clearer business execution.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#475569', fontSize: 19 }}>
          <div style={{ width: 160, height: 5, background: '#0891b2' }} />
          Technology · Management · Finance · Legal · Events · Creative
        </div>
      </div>
    ),
    size,
  );
}
