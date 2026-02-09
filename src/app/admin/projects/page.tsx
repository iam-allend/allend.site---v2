import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import Link from 'next/link';
import { Plus, Pencil, ExternalLink } from 'lucide-react';
import DeleteProjectButton from '@/components/features/admin/DeleteProjectButton';

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch all projects with their field and tech count
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      field:fields(title),
      project_technologies(count)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-semibold neon-glow hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="glass-strong rounded-xl p-4">
          <p className="text-sm text-gray-400">Total Projects</p>
          <p className="text-2xl font-bold mt-1">{projects?.length || 0}</p>
        </div>
        <div className="glass-strong rounded-xl p-4">
          <p className="text-sm text-gray-400">Completed</p>
          <p className="text-2xl font-bold mt-1 text-green-400">
            {projects?.filter((p) => p.status === 'COMPLETED').length || 0}
          </p>
        </div>
        <div className="glass-strong rounded-xl p-4">
          <p className="text-sm text-gray-400">Ongoing</p>
          <p className="text-2xl font-bold mt-1 text-blue-400">
            {projects?.filter((p) => p.status === 'ONGOING').length || 0}
          </p>
        </div>
        <div className="glass-strong rounded-xl p-4">
          <p className="text-sm text-gray-400">Featured</p>
          <p className="text-2xl font-bold mt-1 text-purple-400">
            {projects?.filter((p) => p.is_featured).length || 0}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass-strong rounded-2xl overflow-hidden">
        {projects && projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 font-semibold">Title</th>
                  <th className="text-left p-4 font-semibold">Category</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Featured</th>
                  <th className="text-left p-4 font-semibold">Updated</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-gray-400 truncate max-w-xs">
                          {project.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="glass px-2 py-1 rounded text-xs">
                        {project.field?.title || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          project.status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-400'
                            : project.status === 'ONGOING'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {project.is_featured ? (
                        <span className="text-yellow-400">⭐</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 glass rounded-lg hover:glass-strong transition-all"
                            title="View Live"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="p-2 glass rounded-lg hover:glass-strong transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteProjectButton
                          projectId={project.id}
                          projectTitle={project.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">📁</div>
            <p className="text-gray-400 mb-6">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}