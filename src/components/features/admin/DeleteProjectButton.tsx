'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProject } from '@/lib/actions/project.actions';
import { useRouter } from 'next/navigation';

interface DeleteProjectButtonProps {
  projectId: string;
  projectTitle: string;
}

export default function DeleteProjectButton({
  projectId,
  projectTitle,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteProject(projectId);

      if (result.success) {
        router.refresh();
        setShowConfirm(false);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 glass rounded-lg hover:bg-red-500/20 transition-all"
        title="Delete"
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => !isDeleting && setShowConfirm(false)}
        >
          <div
            className="glass-strong rounded-2xl p-8 max-w-md w-full border-2 border-red-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Delete Project?</h2>
              <p className="text-gray-400">
                Are you sure you want to delete{' '}
                <span className="text-white font-semibold">"{projectTitle}"</span>?
              </p>
              <p className="text-sm text-red-400 mt-2">
                This action can be undone from the database.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 glass rounded-lg font-semibold hover:glass-strong transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}