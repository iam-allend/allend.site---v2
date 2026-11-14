import Link from 'next/link';
import { IconClock, IconEdit, IconFolder, IconMail, IconPlus, IconUser } from '@/components/admin/icons';
import { FrameView, projectFrames } from '@/components/site/ProjectMedia';
import { requireAdmin } from '@/lib/auth';
import { dateTime } from '@/lib/format';
import type { Message, ProjectCard, ProjectStatus } from '@/lib/types';

export default async function DashboardPage() {
  const { db } = await requireAdmin();
  const head = { count: 'exact', head: true } as const;

  const [published, drafts, unread, experiences, recentProjects, recentMessages] = await Promise.all([
    db.from('v2_projects').select('id', head).eq('status', 'published'),
    db.from('v2_projects').select('id', head).eq('status', 'draft'),
    db.from('v2_messages').select('id', head).is('read_at', null).is('archived_at', null),
    db.from('v2_experiences').select('id', head),
    db.from('v2_projects')
      .select('id, slug, category, year, featured, sort, status, title, client, summary, images:v2_project_images(id, bucket, path, width, height, alt, sort)')
      .order('updated_at', { ascending: false })
      .order('sort', { referencedTable: 'images' })
      .limit(1, { referencedTable: 'images' })
      .limit(4),
    db.from('v2_messages').select('id, name, body, read_at, created_at').is('archived_at', null).order('created_at', { ascending: false }).limit(5),
  ]);
  const projects = (recentProjects.data ?? []) as (ProjectCard & { status: ProjectStatus })[];
  const messages = (recentMessages.data ?? []) as Pick<Message, 'id' | 'name' | 'body' | 'read_at' | 'created_at'>[];
  const stats = [
    { href: '/admin/projects?status=published', label: 'Proyek terbit', value: published.count ?? 0, Icon: IconFolder },
    { href: '/admin/projects?status=draft', label: 'Draf', value: drafts.count ?? 0, Icon: IconEdit },
    { href: '/admin/messages', label: 'Pesan belum dibaca', value: unread.count ?? 0, Icon: IconMail, hot: (unread.count ?? 0) > 0 },
    { href: '/admin/history', label: 'Pengalaman kerja', value: experiences.count ?? 0, Icon: IconClock },
  ];

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Ringkasan</h1>
          <p>Semua yang tampil di situs dikelola dari sini.</p>
        </div>
        <Link className="btn solid" href="/admin/projects/new"><IconPlus /> Proyek baru</Link>
      </div>

      <div className="adm-stats">
        {stats.map(({ href, label, value, Icon, hot }) => (
          <Link key={label} className={`adm-stat${hot ? ' hot' : ''}`} href={href}>
            <Icon />
            <b>{value}</b>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <section className="adm-card">
        <div className="card-head">
          <h2>Terakhir diubah</h2>
          <Link className="link" href="/admin/projects">Semua proyek</Link>
        </div>
        <div className="mini-cards">
          {projects.map((p) => (
            <Link key={p.id} className="mini-card" href={`/admin/projects/${p.id}`}>
              <FrameView frame={projectFrames(p, 'id', 1)[0]} />
              <strong>{p.title.id}</strong>
              <span className={`status${p.status === 'published' ? ' on' : ''}`}>{p.status === 'published' ? 'Terbit' : 'Draf'}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="adm-grid">
        <section className="adm-card">
          <div className="card-head">
            <h2>Pesan terbaru</h2>
            <Link className="link" href="/admin/messages">Kotak masuk</Link>
          </div>
          {messages.length === 0 ? (
            <p className="empty-state">Belum ada pesan.</p>
          ) : (
            <ul className="rows">
              {messages.map((m) => (
                <li key={m.id}>
                  <span className="avatar" aria-hidden="true">{m.name[0]?.toUpperCase()}</span>
                  <div className="grow">
                    <strong className={m.read_at ? undefined : 'unread'}>{m.name}</strong>
                    <small>{m.body}</small>
                  </div>
                  <span className="muted hide-sm" style={{ fontSize: 13 }}>{dateTime(m.created_at, 'id')}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <h2>Pintasan</h2>
          <div className="shortcuts">
            <Link href="/admin/profile"><IconUser /> Ganti CV atau foto profil</Link>
            <Link href="/admin/history?exp=new"><IconClock /> Tambah pengalaman</Link>
            <Link href="/admin/skills"><IconFolder /> Atur keahlian</Link>
          </div>
        </section>
      </div>
    </>
  );
}
