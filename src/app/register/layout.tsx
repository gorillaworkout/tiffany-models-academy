export const metadata = {
  title: 'Daftar Kursus Model — Tiffanny Models Academy',
  description: 'Daftar kursus model di Tiffanny Models Academy. Pilih paket: E-Book, Group Class (16 sesi), atau Private Class. Mulai perjalanan modeling kamu sekarang!',
  openGraph: {
    title: 'Daftar Sekarang — Tiffanny Models Academy',
    description: 'Bergabung dengan TMA. E-Book, Group Class, atau Private Class.',
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
