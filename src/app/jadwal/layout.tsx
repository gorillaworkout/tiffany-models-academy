export const metadata = {
  title: 'Jadwal',
  robots: { index: false, follow: false },
};

export default function JadwalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
