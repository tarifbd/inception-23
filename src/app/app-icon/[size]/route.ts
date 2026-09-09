import sharp from 'sharp';
import path from 'node:path';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  if (!['180', '192', '512', 'maskable'].includes(size)) return new Response(null, { status: 404 });
  const pixels = size === 'maskable' ? 512 : Number(size);
  const padding = size === 'maskable' ? 80 : 16;
  const image = await sharp(path.join(process.cwd(), 'public', 'inception23-mark.png'))
    .resize(pixels - padding * 2, pixels - padding * 2, { fit: 'contain', background: '#ffffff' })
    .flatten({ background: '#ffffff' })
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: '#ffffff' })
    .png().toBuffer();
  return new Response(new Uint8Array(image), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
  });
}
