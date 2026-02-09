import { supabase } from '../supabase';
import type { Contact } from '@/types/contact';

export async function getAllContacts(filter?: 'all' | 'unread' | 'replied') {
  let query = supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'unread') {
    query = query.eq('is_read', false);
  } else if (filter === 'replied') {
    query = query.not('replied_at', 'is', null);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Contact[];
}

export async function getContactById(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function markAsRead(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function markAsUnread(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .update({ is_read: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function markAsReplied(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .update({ 
      replied_at: new Date().toISOString(),
      is_read: true 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getContactStats() {
  const { data: all } = await supabase
    .from('contacts')
    .select('id', { count: 'exact', head: true });

  const { data: unread } = await supabase
    .from('contacts')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false);

  const { data: replied } = await supabase
    .from('contacts')
    .select('id', { count: 'exact', head: true })
    .not('replied_at', 'is', null);

  return {
    total: all?.length || 0,
    unread: unread?.length || 0,
    replied: replied?.length || 0,
  };
}