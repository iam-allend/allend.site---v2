export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  replied_at: string | null;
  created_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type MessageFilter = 'all' | 'unread' | 'replied';