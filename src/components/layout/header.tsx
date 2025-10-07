'use client';

import Link from 'next/link';
import { Logo } from '../icons';

export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold sm:inline-block">MediArm 3D</span>
          </Link>
          <nav className="hidden space-x-4 text-sm font-medium lg:flex">
            <Link href="/reconstruct">Reconstruct</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Auth buttons removed */}
        </div>
      </div>
    </header>
  );
}
