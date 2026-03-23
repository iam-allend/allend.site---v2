'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import NeonButton from '@/components/shared/NeonButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CVDownloadButtonProps {
  cvUrl: string;
  variant?: 'primary' | 'secondary' | 'ghost'; // ✅ FIXED: Changed from 'outline' to 'ghost'
  magnetic?: boolean;
  className?: string;
}

export default function CVDownloadButton({ 
  cvUrl, 
  variant = 'secondary',
  magnetic = true,
  className = '',
}: CVDownloadButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleDownload = () => {
    // Create invisible link and trigger download
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'CV.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowConfirm(false);
  };

  if (!cvUrl) {
    return null;
  }

  return (
    <>
      <div 
        onClick={handleClick} 
        className={`inline-flex whitespace-nowrap ${className}`}
      >
        <NeonButton variant={variant} magnetic={magnetic}>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Download className="w-4 h-4 flex-shrink-0" />
            <span>Download CV</span>
          </span>
        </NeonButton>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="glass-strong border-white/10 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Download CV?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to download the CV. The file will be opened in a new tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass hover:glass-strong border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDownload}
              className="bg-primary text-black hover:bg-primary/90 neon-glow"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}