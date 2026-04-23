export const metadata = {
  title: 'Modul',
  robots: { index: false, follow: false },
};

export default function ModulLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
