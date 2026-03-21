'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col gap-1.5 p-2 z-[60] relative -ml-2"
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-black transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-6 h-0.5 bg-black transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-0.5 bg-black transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      <div
        className={`md:hidden fixed inset-0 bg-white/95 z-50 flex items-center justify-center transition-opacity duration-[800ms] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div className="flex flex-col gap-8 text-3xl font-hepta-slab font-extralight">
          <Link href="/" className="hover:text-gray-600 transition-colors" onClick={() => setIsOpen(false)}>
            home
          </Link>
          <Link href="/blog" className="hover:text-gray-600 transition-colors" onClick={() => setIsOpen(false)}>
            blog
          </Link>
          <Link href="/work" className="hover:text-gray-600 transition-colors" onClick={() => setIsOpen(false)}>
            work
          </Link>
          <Link href="/resume" className="hover:text-gray-600 transition-colors" onClick={() => setIsOpen(false)}>
            resume
          </Link>
        </div>
      </div>
    </>
  );
}
