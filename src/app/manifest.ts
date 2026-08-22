import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Inception 23',
    short_name: 'Inception 23',
    description: 'Advisory, consulting, technology, legal, finance, event, and creative business solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f9fa',
    theme_color: '#321a40',
    orientation: 'portrait-primary',
    categories: ['business', 'consulting', 'productivity'],
    icons: [
      {
        src: '/inception23-mark.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
