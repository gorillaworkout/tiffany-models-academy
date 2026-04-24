export const metadata = {
  title: 'Hubungi Kami — Tiffanny Models Academy',
  description: 'Hubungi Tiffanny Models Academy. WhatsApp: +6285133524900. Lokasi studio di Jakarta dan Bandung. Daftar kursus modeling sekarang!',
  openGraph: {
    title: 'Hubungi Tiffanny Models Academy',
    description: 'Kontak TMA untuk informasi kursus modeling. Jakarta & Bandung.',
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
