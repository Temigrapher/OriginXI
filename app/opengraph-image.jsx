import { ImageResponse } from 'next/og';

export const alt = 'Origin XI — Same Badge. New Season.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 44, left: 44, right: 44, bottom: 44, border: '1px solid rgba(201,162,39,0.35)', display: 'flex' }} />
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: '#C9A227', marginBottom: 28, fontFamily: 'serif' }}>
          ORIGIN XI — 2026/27 SEASON
        </div>
        <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, color: '#F5F1E6', fontFamily: 'serif', lineHeight: 1.05 }}>
          SAME BADGE.
        </div>
        <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, color: '#C9A227', fontFamily: 'serif', lineHeight: 1.05 }}>
          NEW SEASON.
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#A69F8E', marginTop: 28, fontFamily: 'serif' }}>
          Curated. Authenticated. Celebrated.
        </div>
      </div>
    ),
    { ...size }
  );
}
