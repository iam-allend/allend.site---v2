import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
  className?: string;
}

export default function NeonButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  magnetic = false,
  className,
  ...props
}: NeonButtonProps) {
  const baseStyles = 'rounded-lg font-semibold transition-all duration-300';
  
  const variantStyles = {
    primary: 'bg-primary text-black neon-glow hover:scale-105',
    secondary: 'glass hover:glass-strong',
    ghost: 'border border-white/10 hover:border-primary/50 hover:text-primary',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        magnetic && 'magnetic',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}