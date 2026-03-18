import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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
        <div className="max-w-3xl mx-auto px-6 py-12">
          <nav className="mb-8 border-b pr-3 border-gray-200 flex items-end-safe justify-between">
            <div className="flex mb-2 gap-6 text-lg font-hepta-slab">
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
            <Image
              src="/me.svg"
              alt="Logo"
              width={80}
              height={80}
              priority
            />
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
