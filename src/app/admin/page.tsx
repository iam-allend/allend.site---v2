import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/db/supabase';
import Link from 'next/link';


// import AnimatedBackground from '@/components/shared/AnimatedBackground';
import CustomCursor from '@/components/shared/CustomCursor';


import {
  FolderKanban,
  MessageSquare,
  Eye,
  TrendingUp,
} from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  // Fetch stats from database
  const [projectsCount, messagesCount, unreadMessages] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('contacts').select('id', { count: 'exact', head: true }),
    supabase
      .from('contacts')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false),
  ]);

  const stats = [
    {
      title: 'Total Projects',
      value: projectsCount.count || 0,
      icon: FolderKanban,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      href: '/admin/projects',
    },
    {
      title: 'Total Messages',
      value: messagesCount.count || 0,
      icon: MessageSquare,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      href: '/admin/messages',
    },
    {
      title: 'Unread Messages',
      value: unreadMessages.count || 0,
      icon: Eye,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      href: '/admin/messages',
    },
    {
      title: 'Featured Projects',
      value: projectsCount.count || 0,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      href: '/admin/projects',
    },
  ];

  // Fetch recent messages
  const { data: recentMessages } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch recent projects
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (

  <>
  <CustomCursor />
  {/* <AnimatedBackground /> */}

  <main>
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-strong rounded-2xl p-8 border-2 border-primary/20">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="neon-text">{session.user.name}!</span>
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="glass-strong rounded-xl p-6 hover-lift cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Messages</h2>
            <Link
              href="/admin/messages"
              className="text-sm text-primary hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentMessages && recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="glass rounded-lg p-4 hover:glass-strong transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{message.name}</p>
                      <p className="text-xs text-gray-400">{message.email}</p>
                    </div>
                    {!message.is_read && (
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {message.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Projects</h2>
            <Link
              href="/admin/projects"
              className="text-sm text-primary hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentProjects && recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="glass rounded-lg p-4 hover:glass-strong transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {project.description}
                      </p>
                    </div>
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
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FolderKanban className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No projects yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-strong rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/admin/projects/new"
            className="glass rounded-lg p-6 hover:glass-strong hover-lift text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              ➕
            </div>
            <p className="font-medium">Add New Project</p>
          </Link>

          <Link
            href="/admin/media"
            className="glass rounded-lg p-6 hover:glass-strong hover-lift text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              🖼️
            </div>
            <p className="font-medium">Upload Media</p>
          </Link>

          <Link
            href="/admin/settings"
            className="glass rounded-lg p-6 hover:glass-strong hover-lift text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              ⚙️
            </div>
            <p className="font-medium">Site Settings</p>
          </Link>
        </div>
      </div>
    </div>

  </main>
  </>
  );
}