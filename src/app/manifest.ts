import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Inception 23',
    short_name: 'Inception 23',
    description: 'Advisory, consulting, technology, legal, finance, event, and creative business solutions.',
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f9fa',
    theme_color: '#321a40',
    categories: ['business', 'consulting', 'productivity'],
    icons: [
      { src: '/app-icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/app-icon/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/app-icon/maskable', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Services', url: '/services' },
      { name: 'Contact', url: '/contact' },
    ],
  };
}
