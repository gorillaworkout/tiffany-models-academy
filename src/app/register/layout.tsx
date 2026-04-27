export const metadata = {
  title: 'Daftar Kursus Model Jakarta Selatan & Bintaro — Tiffanny Models Academy',
  description: 'Daftar kursus model di Tiffanny Models Academy Jakarta Selatan & Bintaro. Pilih paket: E-Book, Group Class (16 sesi), atau Private Class. Mulai perjalanan modeling kamu sekarang!',
  openGraph: {
    title: 'Daftar Sekarang — Tiffanny Models Academy',
    description: 'Bergabung dengan TMA Jakarta Selatan & Bintaro. E-Book, Group Class, atau Private Class.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://tiffannymodelsacademy.com/register' },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
