import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllContacts, getContactStats } from '@/lib/db/queries/contacts';
import MessageCard from '@/components/features/admin/MessageCard';
import { Inbox, Mail, CheckCircle, Filter } from 'lucide-react';
import Link from 'next/link';

interface MessagesPageProps {
  searchParams: Promise<{
    filter?: 'all' | 'unread' | 'replied';
  }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user) {
    redirect('/login');
  }

  const filter = params.filter || 'all';
  const messages = await getAllContacts(filter);
  const stats = await getContactStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-400 mt-1">Manage contact form messages</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-strong rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Inbox className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="glass-strong rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-blue-400">{stats.unread}</p>
            </div>
          </div>
        </div>
        <div className="glass-strong rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Replied</p>
              <p className="text-2xl font-bold text-green-400">{stats.replied}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <div className="flex gap-2">
          <Link
            href="/admin/messages"
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all'
                ? 'glass-strong border-2 border-primary/30 text-primary'
                : 'glass hover:glass-strong'
            }`}
          >
            All ({stats.total})
          </Link>
          <Link
            href="/admin/messages?filter=unread"
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'unread'
                ? 'glass-strong border-2 border-primary/30 text-primary'
                : 'glass hover:glass-strong'
            }`}
          >
            Unread ({stats.unread})
          </Link>
          <Link
            href="/admin/messages?filter=replied"
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'replied'
                ? 'glass-strong border-2 border-primary/30 text-primary'
                : 'glass hover:glass-strong'
            }`}
          >
            Replied ({stats.replied})
          </Link>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))
        ) : (
          <div className="glass-strong rounded-2xl p-16 text-center">
            <div className="text-6xl mb-4 opacity-50">📭</div>
            <p className="text-gray-400 text-lg mb-2">No messages found</p>
            <p className="text-gray-500 text-sm">
              {filter === 'unread' && "You're all caught up! No unread messages."}
              {filter === 'replied' && 'No replied messages yet.'}
              {filter === 'all' && 'No messages received yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}