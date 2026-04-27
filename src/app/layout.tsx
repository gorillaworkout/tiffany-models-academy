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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://tiffannymodelsacademy.com'),
  title: {
    default: 'Tiffanny Models Academy — Sekolah Model Profesional Jakarta Selatan & Bintaro',
    template: '%s | Tiffanny Models Academy',
  },
  description: 'Tiffanny Models Academy (TMA) adalah akademi model profesional terbaik di Jakarta Selatan & Bintaro. Kursus modeling, catwalk, foto posing, personal branding. Kelas reguler, private, e-book. Daftar sekarang!',
  keywords: [
    'modeling academy', 'sekolah model', 'kursus model',
    'model Jakarta Selatan', 'model Bintaro', 'model Tangerang Selatan',
    'model Jakarta', 'model Indonesia',
    'belajar jadi model', 'catwalk training', 'runway training', 'modeling class',
    'akademi model Indonesia', 'kelas model hijab', 'hijab model academy',
    'foto posing', 'personal branding model', 'modeling school Indonesia',
    'TMA', 'Tiffanny Models Academy', 'Tiffany Models Academy',
    'kursus catwalk', 'sekolah modeling', 'kursus modeling Jakarta',
    'model profesional', 'fashion model Indonesia',
    'model training Jakarta Selatan', 'model training Bintaro',
    'kelas modeling pemula', 'private class model',
    'e-book modeling', 'buku panduan model', 'tips menjadi model',
    'model hijab Indonesia', 'modeling academy near me', 'model academy terbaik',
    'kursus model terdekat', 'sekolah model Jakarta', 'les model',
    'modeling Jakarta Selatan', 'modeling Bintaro', 'modeling Tangerang',
    'academy model Indonesia', 'pelatihan model profesional',
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
    title: 'Tiffanny Models Academy — Sekolah Model Profesional #1 di Jakarta Selatan & Bintaro',
    description: 'Akademi model profesional di Jakarta Selatan & Bintaro. Kurikulum 16 modul, pelatihan catwalk, foto posing, personal branding. Kelas reguler, private, dan e-book. Daftar sekarang!',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tiffanny Models Academy — Sekolah Model Profesional di Jakarta Selatan & Bintaro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiffanny Models Academy — Sekolah Model Jakarta Selatan & Bintaro',
    description: 'Akademi model profesional di Jakarta Selatan & Bintaro. Daftar kursus modeling sekarang!',
    images: ['/images/og-image.jpg'],
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
    google: 'bVZmGxIgVutWwWdBISpnW9Yym3ZCsGhdiAbb20s3-w4',
  },
  alternates: {
    canonical: 'https://tiffannymodelsacademy.com',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
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
