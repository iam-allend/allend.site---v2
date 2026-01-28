import Link from 'next/link';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { href: '#work', label: 'Work' },
      { href: '#about', label: 'About' },
      { href: '#contact', label: 'Contact' },
      { href: '#blog', label: 'Blog' },
    ],
    social: [
      { href: 'https://github.com/iam-allend', label: 'GitHub', icon: Github },
      { href: '#', label: 'LinkedIn', icon: Linkedin },
      { href: '#', label: 'Instagram', icon: Instagram },
      { href: 'mailto:anurmustakim@gmail.com', label: 'Email', icon: Mail },
    ],
  };

  return (
    <footer className="relative px-6 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold neon-text mb-4">ALLEND.</h3>
            <p className="text-gray-400 max-w-md mb-6">
              Full Stack Developer & Designer crafting digital experiences in Semarang, Indonesia.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass p-3 rounded-lg hover:glass-strong hover:scale-110 transition-all"
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
          <p>
            © {currentYear} Anur Mustakim. Crafted with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}