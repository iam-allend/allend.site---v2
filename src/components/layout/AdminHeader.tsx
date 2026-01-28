'use client';

import { Bell } from 'lucide-react';

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="glass border-b border-white/10 p-4 lg:p-6 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Breadcrumb / Title - We'll make this dynamic later */}
        <div className="flex-1">
          <h2 className="text-xl font-bold hidden lg:block">
            Welcome back, {user.name.split(' ')[0]}!
          </h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative glass p-2 rounded-lg hover:glass-strong transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs text-black flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* View Site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 glass px-4 py-2 rounded-lg hover:glass-strong transition-all text-sm">
            <span>View Site</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </header>
  );
}