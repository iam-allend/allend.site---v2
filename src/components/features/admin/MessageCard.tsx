'use client';

import { useState } from 'react';
import { Contact } from '@/types/contact';
import { formatDistanceToNow } from 'date-fns';
import { Mail, MailOpen, Reply, Trash2, CheckCircle } from 'lucide-react';
import { toggleReadStatus, replyToMessage } from '@/lib/actions/contact.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import DeleteMessageButton from './DeleteMessageButton';

interface MessageCardProps {
  message: Contact;
}

export default function MessageCard({ message }: MessageCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleToggleRead() {
    setIsUpdating(true);
    const result = await toggleReadStatus(message.id, message.is_read);
    
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    
    setIsUpdating(false);
  }

  async function handleReply() {
    // Mark as replied
    const result = await replyToMessage(message.id);
    
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    }

    // Open email client
    const emailSubject = encodeURIComponent(`Re: ${message.subject || 'Your message'}`);
    const emailBody = encodeURIComponent(`Hi ${message.name},\n\nThank you for your message.\n\n---\nOriginal message:\n${message.message}`);
    window.location.href = `mailto:${message.email}?subject=${emailSubject}&body=${emailBody}`;
  }

  return (
    <div
      className={`glass-strong rounded-xl p-6 transition-all hover:scale-[1.01] ${
        !message.is_read ? 'border-2 border-primary/30' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{message.name}</h3>
            {!message.is_read && (
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                New
              </span>
            )}
            {message.replied_at && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Replied
              </span>
            )}
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>
              <a href={`mailto:${message.email}`} className="hover:text-primary transition-colors">
                {message.email}
              </a>
            </p>
            {message.subject && <p className="font-medium text-gray-300">{message.subject}</p>}
            <p>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleRead}
            disabled={isUpdating}
            className="p-2 glass rounded-lg hover:glass-strong transition-all"
            title={message.is_read ? 'Mark as unread' : 'Mark as read'}
          >
            {message.is_read ? (
              <MailOpen className="w-4 h-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleReply}
            className="p-2 glass rounded-lg hover:glass-strong transition-all"
            title="Reply via email"
          >
            <Reply className="w-4 h-4" />
          </button>
          <DeleteMessageButton messageId={message.id} />
        </div>
      </div>

      {/* Message Preview/Full */}
      <div className="glass rounded-lg p-4">
        <p className={`text-gray-300 whitespace-pre-wrap ${!isExpanded && 'line-clamp-3'}`}>
          {message.message}
        </p>
        {message.message.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary text-sm mt-2 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
}