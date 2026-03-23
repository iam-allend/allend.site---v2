'use client';

import { useState } from 'react';
import { Download, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface CVPreviewProps {
  cvUrl: string | null;
  fileName?: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

export default function CVPreview({ 
  cvUrl, 
  fileName, 
  showDelete = false,
  onDelete 
}: CVPreviewProps) {
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!cvUrl) {
    return (
      <div className="glass-strong rounded-xl p-8 text-center">
        <div className="text-gray-400 mb-2">No CV uploaded yet</div>
        <p className="text-sm text-gray-500">Upload your CV to preview it here</p>
      </div>
    );
  }

  const handleDownload = () => {
    setShowDownloadConfirm(true);
  };

  const confirmDownload = () => {
    // Open in new tab for download
    window.open(cvUrl, '_blank');
    setShowDownloadConfirm(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="glass-strong rounded-xl overflow-hidden">
        {/* PDF Preview */}
        <div className="relative bg-black/30">
          <iframe
            src={`${cvUrl}#toolbar=0&navpanes=0`}
            className="w-full h-96 border-0"
            title="CV Preview"
          />
          
          {/* Overlay with actions */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">
                {fileName || 'Current CV'}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="glass hover:glass-strong"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(cvUrl, '_blank')}
                  className="glass hover:glass-strong"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full
                </Button>

                {showDelete && onDelete && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDelete}
                    className="glass hover:glass-strong text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* File Info */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-gray-400">
            CV is ready for download. Visitors can download it from your homepage and about page.
          </div>
        </div>
      </div>

      {/* Download Confirmation Dialog */}
      <AlertDialog open={showDownloadConfirm} onOpenChange={setShowDownloadConfirm}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Download CV?</AlertDialogTitle>
            <AlertDialogDescription>
              Your CV will be opened in a new tab. You can then save it to your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass hover:glass-strong">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDownload}
              className="bg-primary text-black hover:bg-primary/90"
            >
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this CV?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The CV file will be permanently deleted from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass hover:glass-strong">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}