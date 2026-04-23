export const metadata = {
  title: 'Tentang Kami — Tiffanny Models Academy',
  description: 'Kenali lebih dekat Tiffanny Models Academy. Didirikan oleh Nadira Tiffanny, TMA adalah akademi model profesional dengan visi menjadi yang terbaik di Indonesia. Cabang di Jakarta dan Bandung.',
  openGraph: {
    title: 'Tentang Tiffanny Models Academy',
    description: 'Akademi model profesional terbaik di Indonesia. Pelatihan catwalk, foto posing, dan personal branding.',
    images: [{ url: '/images/tma-group.jpg' }],
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
