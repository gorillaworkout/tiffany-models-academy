export const metadata = {
  title: 'Portfolio — Galeri Model Tiffanny Models Academy',
  description: 'Lihat portfolio dan galeri foto model-model Tiffanny Models Academy. Runway, editorial, dan behind the scenes dari akademi model terbaik di Indonesia.',
  openGraph: {
    title: 'Portfolio Model — Tiffanny Models Academy',
    description: 'Galeri foto model TMA. Runway, editorial, behind the scenes.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://tiffannymodelsacademy.com/portfolio' },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
