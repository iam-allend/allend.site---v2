import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong';
  hover?: boolean;
  neonBorder?: boolean;
}

export default function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hover = false,
  neonBorder = false 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        variant === 'default' ? 'glass' : 'glass-strong',
        hover && 'hover-lift cursor-pointer',
        neonBorder && 'border-2 border-primary/20',
        className
      )}
    >
      {children}
    </div>
  );
}