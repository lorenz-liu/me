import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personal Website",
  description: "My personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-white text-black">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <nav className="mb-12 pb-8 border-b border-gray-200">
            <div className="flex gap-6 text-sm">
              <Link href="/" className="hover:text-gray-600 transition-colors">
                home
              </Link>
              <Link href="/blog" className="hover:text-gray-600 transition-colors">
                blog
              </Link>
              <Link href="/work" className="hover:text-gray-600 transition-colors">
                work
              </Link>
              <Link href="/resume" className="hover:text-gray-600 transition-colors">
                resume
              </Link>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
