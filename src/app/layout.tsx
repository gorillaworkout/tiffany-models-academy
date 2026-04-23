import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationJsonLd, CourseJsonLd, FAQJsonLd } from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tiffannymodelsacademy.com'),
  title: {
    default: 'Tiffany Models Academy — Sekolah Model Profesional di Indonesia',
    template: '%s | Tiffany Models Academy',
  },
  description: 'Tiffanny Models Academy (TMA) adalah akademi model profesional terbaik di Jakarta & Bandung. Kursus modeling, catwalk, foto posing, personal branding. Daftar sekarang! Professional modeling academy in Indonesia.',
  keywords: [
    'modeling academy', 'sekolah model', 'kursus model', 'model Jakarta', 'model Bandung',
    'belajar jadi model', 'catwalk training', 'runway training', 'modeling class',
    'akademi model Indonesia', 'kelas model hijab', 'hijab model academy',
    'foto posing', 'personal branding model', 'modeling school Indonesia',
    'TMA', 'Tiffanny Models Academy', 'kursus catwalk', 'sekolah modeling',
    'model profesional', 'fashion model Indonesia', 'model training Jakarta',
    'model training Bandung', 'kelas modeling pemula', 'private class model',
    'e-book modeling', 'buku panduan model', 'tips menjadi model',
    'model hijab Indonesia', 'modeling academy near me', 'model academy terbaik',
  ],
  authors: [{ name: 'Tiffanny Models Academy' }],
  creator: 'Tiffanny Models Academy',
  publisher: 'Tiffanny Models Academy',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: 'en_US',
    url: 'https://tiffannymodelsacademy.com',
    siteName: 'Tiffanny Models Academy',
    title: 'Tiffanny Models Academy — Sekolah Model Profesional #1 di Indonesia',
    description: 'Akademi model profesional di Jakarta & Bandung. Kurikulum 16 modul, pelatihan catwalk, foto posing, personal branding. Kelas reguler, private, dan e-book. Daftar sekarang!',
    images: [
      {
        url: '/images/tma-group.jpg',
        width: 1200,
        height: 630,
        alt: 'Tiffanny Models Academy — Sekolah Model Profesional di Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiffanny Models Academy — Sekolah Model Profesional di Indonesia',
    description: 'Akademi model profesional di Jakarta & Bandung. Daftar kursus modeling sekarang!',
    images: ['/images/tma-group.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Zzr1rL39y23Zqs5a8NZ7zeetJgvkXPY-l6n4pg3eKmI',
  },
  alternates: {
    canonical: 'https://tiffannymodelsacademy.com',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-black text-white font-sans antialiased selection:bg-white selection:text-black">
        <OrganizationJsonLd />
        <CourseJsonLd />
        <FAQJsonLd />
        {children}
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
