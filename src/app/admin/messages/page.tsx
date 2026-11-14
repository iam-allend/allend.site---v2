import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionButton } from '@/components/admin/AdminForm';
import { IconArchive, IconReply, IconTrash } from '@/components/admin/icons';
import { ADMIN_PAGER_LABELS } from '@/components/admin/labels';
import { Pager } from '@/components/Pager';
import { deleteMessage, setMessageArchived, setMessageRead } from '@/app/admin/actions';
import { requireAdmin } from '@/lib/auth';
import { pageParams } from '@/lib/content';
import { copy } from '@/lib/copy';
import { dateTime } from '@/lib/format';
import type { Message } from '@/lib/types';

export const metadata: Metadata = { title: 'Pesan' };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ box?: string; page?: string; per?: string }> }) {
  const { db } = await requireAdmin();
  const query = await searchParams;
  const archived = query.box === 'archive';
  const { page, per } = pageParams(query.page, query.per);

  let list = db
    .from('v2_messages')
    .select('id, topic, name, email, organization, body, read_at, archived_at, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * per, page * per - 1);
  list = archived ? list.not('archived_at', 'is', null) : list.is('archived_at', null);
  const { data, count } = await list;
  const messages = (data ?? []) as Message[];
  const total = count ?? 0;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Pesan</h1>
          <p>Dari formulir kontak. Klik untuk membaca, balas langsung lewat email pengirim.</p>
        </div>
      </div>

      <nav className="tabs" aria-label="Kotak">
        <Link href="/admin/messages" aria-current={!archived ? 'page' : undefined}>Kotak masuk</Link>
        <Link href="/admin/messages?box=archive" aria-current={archived ? 'page' : undefined}>Arsip</Link>
      </nav>

      {messages.length === 0 ? (
        <p className="empty-state">{archived ? 'Arsip kosong.' : 'Tidak ada pesan baru.'}</p>
      ) : (
        <div className="adm-card flush">
          {messages.map((m) => (
            <details key={m.id} className={`msg${m.read_at ? '' : ' unread'}`} data-row>
              <summary>
                <span className="dot" />
                <span className="avatar" aria-hidden="true">{m.name[0]?.toUpperCase()}</span>
                <span className="grow">
                  <b>{m.name}</b> <span className="status">{copy.contact.topics[m.topic].id}</span>
                  <small>{m.body}</small>
                </span>
                <time dateTime={m.created_at}>{dateTime(m.created_at, 'id')}</time>
              </summary>
              <div className="body">
                <p className="meta"><a href={`mailto:${m.email}`}>{m.email}</a>{m.organization ? ` · ${m.organization}` : ''}</p>
                <p>{m.body}</p>
                <div className="actions">
                  <a className="btn sm solid" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: pesan dari allend.site')}`}><IconReply /> Balas</a>
                  <ActionButton action={setMessageRead.bind(null, m.id, !m.read_at)} label={m.read_at ? 'Tandai belum dibaca' : 'Tandai dibaca'} done="Status pesan diubah." />
                  <ActionButton action={setMessageArchived.bind(null, m.id, !archived)} label={archived ? 'Kembalikan' : 'Arsipkan'} done={archived ? 'Pesan dikembalikan.' : 'Pesan diarsipkan.'} icon={<IconArchive />} className="icon-btn" />
                  <ActionButton action={deleteMessage.bind(null, m.id)} label="Hapus" done="Pesan dihapus." icon={<IconTrash />} className="icon-btn danger" confirm={`Hapus permanen pesan dari ${m.name}?`} />
                </div>
              </div>
            </details>
          ))}
        </div>
      )}

      <Pager path="/admin/messages" params={{ box: archived ? 'archive' : undefined }} page={page} per={per} pages={Math.max(1, Math.ceil(total / per))} total={total} labels={ADMIN_PAGER_LABELS} />
    </>
  );
}
