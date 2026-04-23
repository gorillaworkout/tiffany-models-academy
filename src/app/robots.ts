import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/modul', '/jadwal', '/api/'],
      },
    ],
    sitemap: 'https://tiffannymodelsacademy.com/sitemap.xml',
  };
}
