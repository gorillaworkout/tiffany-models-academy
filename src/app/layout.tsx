import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tiffany Models Academy",
  description: "Academy for aspiring models",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="text-2xl font-bold text-gray-900">
                    Tiffany Models Academy
                  </a>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </a>
                  <a href="/register" className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1 flex flex-col justify-center">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
