export const metadata = {
  title: 'Tentang Kami — Tiffanny Models Academy Jakarta Selatan & Bintaro',
  description: 'Kenali lebih dekat Tiffanny Models Academy. Didirikan oleh Nadira Tiffanny, TMA adalah akademi model profesional terbaik di Jakarta Selatan dan Bintaro, Indonesia. Pelatihan catwalk, posing, personal branding.',
  openGraph: {
    title: 'Tentang Tiffanny Models Academy — Jakarta Selatan & Bintaro',
    description: 'Akademi model profesional terbaik di Jakarta Selatan & Bintaro. Pelatihan catwalk, foto posing, dan personal branding.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://tiffannymodelsacademy.com/about' },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
