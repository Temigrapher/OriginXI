import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'Origin XI — Same Badge. New Season.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Playfair Display (the shop's headline font), bundled in app/fonts under the SIL Open Font Licence (see OFL.txt there).
// This image is generated once at build time, so the files are read straight from disk.
const loadFont = async (file) => {
  const buf = await readFile(join(process.cwd(), 'app', 'fonts', file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
};

export default async function Image() {
  const [regular, bold] = await Promise.all([loadFont('PlayfairDisplay-Regular.ttf'), loadFont('PlayfairDisplay-Bold.ttf')]);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 44, left: 44, right: 44, bottom: 44, border: '1px solid rgba(201,162,39,0.35)', display: 'flex' }} />
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: '#C9A227', marginBottom: 28, fontFamily: 'Playfair Display' }}>
          ORIGIN XI — 2026/27 SEASON
        </div>
        <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, color: '#F5F1E6', fontFamily: 'Playfair Display', lineHeight: 1.05 }}>
          SAME BADGE.
        </div>
        <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, color: '#C9A227', fontFamily: 'Playfair Display', lineHeight: 1.05 }}>
          NEW SEASON.
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#A69F8E', marginTop: 28, fontFamily: 'Playfair Display' }}>
          Curated. Authenticated. Celebrated.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Playfair Display', data: regular, weight: 400, style: 'normal' },
        { name: 'Playfair Display', data: bold, weight: 700, style: 'normal' },
      ],
    }
  );
}
