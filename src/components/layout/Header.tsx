'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // Check if link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold neon-text hover:scale-110 transition-transform"
          >
            ALLEND<span className="text-primary">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors relative group",
                    active 
                      ? "text-primary font-semibold" 
                      : "text-gray-400 hover:text-primary"
                  )}
                >
                  {link.label}
                  <span 
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}

            {/* Language Switcher */}
            <div className="glass px-3 py-1 rounded-full flex gap-2">
              <button className="px-3 py-1 rounded-full bg-primary text-black text-sm font-medium transition-all">
                EN
              </button>
              <button className="px-3 py-1 rounded-full text-gray-400 text-sm font-medium hover:text-white transition-colors">
                ID
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden glass p-2 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 glass-strong rounded-lg p-4 space-y-3">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block py-2 transition-colors",
                    active 
                      ? "text-primary font-semibold" 
                      : "text-gray-400 hover:text-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex gap-2 pt-2">
              <button className="flex-1 px-3 py-2 rounded-lg bg-primary text-black text-sm font-medium">
                EN
              </button>
              <button className="flex-1 px-3 py-2 rounded-lg glass text-sm font-medium">
                ID
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}