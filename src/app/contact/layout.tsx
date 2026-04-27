export const metadata = {
  title: 'Hubungi Kami — Tiffanny Models Academy Jakarta Selatan & Bintaro',
  description: 'Hubungi Tiffanny Models Academy. WhatsApp: +6285966445351. Studio di Jakarta Selatan dan Bintaro. Daftar kursus modeling, catwalk, dan foto posing sekarang!',
  openGraph: {
    title: 'Hubungi Tiffanny Models Academy',
    description: 'Kontak TMA untuk informasi kursus modeling. Jakarta Selatan & Bintaro. WA: +6285966445351',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://tiffannymodelsacademy.com/contact' },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
