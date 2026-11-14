-- v2 seed content (from the CV, 2026-11). Run once, after the v2 migration.

insert into public.v2_profile (full_name, headline, intro, about_title, about, occupation, open_to, location, email, socials, available) values (
  'Anur Mustakim',
  '{"id":"Fullstack Web Developer","en":"Fullstack Web Developer"}'::jsonb,
  '{"id":"Saya membangun sistem web dari skema database dan API sampai dashboard admin — HRIS, ERP, manajemen servis, dan platform jurnal.","en":"I build web systems from the database schema and API up to the admin dashboard — HRIS, ERP, service management and journal platforms."}'::jsonb,
  '{"id":"Fullstack web developer yang juga paham *desain* dan *perangkat keras*.","en":"A fullstack web developer who also knows *design* and *hardware*."}'::jsonb,
  '{"id":"Saya berbasis di Semarang dan membangun sistem web dari database dan API hingga antarmuka — termasuk HRIS, ERP, sistem manajemen servis, dan platform penerbitan jurnal. Di luar kode, saya memproduksi konten media sosial (1000+ konten) dan menangani perbaikan perangkat serta instalasi WiFi rumahan.","en":"I''m based in Semarang and build web systems from the database and API through to the interface — including HRIS, ERP, service management systems and a journal publishing platform. Outside code, I produce social media content (1000+ pieces) and handle device repairs and home WiFi installs."}'::jsonb,
  '{"id":"Programmer fullstack di PT Hucle","en":"Fullstack programmer at PT Hucle"}'::jsonb,
  '{"id":"Full-time, kolaborasi, freelance","en":"Full-time, collaboration, freelance"}'::jsonb,
  'Semarang, Indonesia',
  'anurmustakim@gmail.com',
  '{"github":"https://github.com/iam-allend","linkedin":"https://linkedin.com/in/anur-mustakim-465865280"}'::jsonb,
  true
);

insert into public.v2_categories (slug, name, sort) values
  ('web', '{"id":"Web","en":"Web"}'::jsonb, 0),
  ('design', '{"id":"Desain","en":"Design"}'::jsonb, 1),
  ('it', '{"id":"IT support","en":"IT support"}'::jsonb, 2),
  ('other', '{"id":"Lainnya","en":"Other"}'::jsonb, 3);

insert into public.v2_projects (slug, category, status, featured, sort, year, link, title, client, summary, overview, scope, role, period, team, highlights) values
  ('hris', 'web', 'published', true, 0, '2026', null, '{"id":"HRIS","en":"HRIS"}'::jsonb, '{"id":"PT Hucle","en":"PT Hucle"}'::jsonb, '{"id":"Aplikasi HR full-stack","en":"Full-stack HR application"}'::jsonb, '{"id":"Aplikasi HRIS full-stack untuk PT Hucle. Saya mengerjakan frontend dan backend, merancang skema database, dan membangun API untuk modul inti HR.","en":"A full-stack HRIS application for PT Hucle. I work across frontend and backend, designing the database schema and building the APIs for the core HR modules."}'::jsonb, '{"id":"Absensi, karyawan, penggajian, KPI","en":"Attendance, staff, payroll, KPI"}'::jsonb, '{"id":"Programmer fullstack (kontrak)","en":"Fullstack programmer (contract)"}'::jsonb, '{"id":"Sep – Des 2026","en":"Sep – Dec 2026"}'::jsonb, '{"id":"8 orang","en":"8 people"}'::jsonb, '[{"id":"Skema database dan API untuk absensi, manajemen karyawan, penggajian, dan KPI","en":"Database schema and APIs for attendance, employee management, payroll and KPI"},{"id":"Frontend dan backend dalam satu aplikasi web","en":"Frontend and backend within one web application"},{"id":"Pengembangan dan pengujian fitur bersama tim 8 orang","en":"Feature development and testing with a team of 8"}]'::jsonb),
  ('ritecs', 'web', 'published', true, 10, '2025', 'https://ritecs.org', '{"id":"Ritecs.org","en":"Ritecs.org"}'::jsonb, '{"id":"Ritecs","en":"Ritecs"}'::jsonb, '{"id":"Platform penerbitan buku & jurnal","en":"Book & journal publishing platform"}'::jsonb, '{"id":"Ritecs.org dibangun end-to-end: desain UI/UX, arsitektur database, backend, sampai dashboard admin. Platform ini menampung penerbitan buku, jurnal, program awarding, keanggotaan, dan layanan.","en":"Ritecs.org was built end-to-end: UI/UX design, database architecture, backend and the admin dashboard. It covers book publishing, journals, an awards programme, membership and services."}'::jsonb, '{"id":"Jurnal, keanggotaan, awarding, layanan","en":"Journals, membership, awards, services"}'::jsonb, '{"id":"Fullstack developer (magang)","en":"Fullstack developer (internship)"}'::jsonb, '{"id":"Agu – Des 2025","en":"Aug – Dec 2025"}'::jsonb, null, '[{"id":"Modul Penerbitan Buku, Jurnal, Awarding, Keanggotaan, dan Layanan dengan API lengkap","en":"Book Publishing, Journal, Awards, Membership and Services modules with complete APIs"},{"id":"Manajemen anggota dengan CRUD terstruktur dan hak akses berbasis peran","en":"Member management with structured CRUD and role-based access control"},{"id":"Pencarian jurnal langsung lewat API/AJAX","en":"Live journal search over API/AJAX"},{"id":"Optimasi query, validasi input, pencegahan SQL injection & XSS","en":"Query optimisation, input validation, SQL injection & XSS prevention"}]'::jsonb),
  ('servis', 'web', 'published', true, 20, null, null, '{"id":"Sistem Manajemen Servis","en":"Service Management System"}'::jsonb, '{"id":"Proyek web","en":"Web project"}'::jsonb, '{"id":"Pencatatan & pelacakan servis perangkat","en":"Device service tracking"}'::jsonb, null, '{"id":"Tiket servis, status, pelanggan","en":"Service tickets, status, customers"}'::jsonb, null, null, null, '[]'::jsonb),
  ('erp', 'web', 'published', true, 30, null, null, '{"id":"Sistem ERP","en":"ERP System"}'::jsonb, '{"id":"Proyek web","en":"Web project"}'::jsonb, '{"id":"Aplikasi operasional bisnis","en":"Business operations app"}'::jsonb, null, '{"id":"Modul operasional, laporan","en":"Operations modules, reports"}'::jsonb, null, null, null, '[]'::jsonb),
  ('allend', 'web', 'published', false, 40, '2026', null, '{"id":"allend.site","en":"allend.site"}'::jsonb, '{"id":"Proyek pribadi","en":"Personal project"}'::jsonb, '{"id":"Portofolio & CMS sendiri","en":"Own portfolio & CMS"}'::jsonb, '{"id":"Situs ini sendiri: halaman publik dua bahasa dengan tema gelap/terang, dan dashboard admin untuk mengelola proyek, teknologi, pesan masuk, dan pengaturan.","en":"This very site: a bilingual public site with light/dark themes, plus an admin dashboard to manage projects, technologies, incoming messages and settings."}'::jsonb, '{"id":"Next.js, Supabase, Auth","en":"Next.js, Supabase, Auth"}'::jsonb, null, null, null, '[]'::jsonb),
  ('gamelab', 'web', 'published', false, 50, '2022', null, '{"id":"Dashboard Gamelab","en":"Gamelab Dashboard"}'::jsonb, '{"id":"Educa Studio","en":"Educa Studio"}'::jsonb, '{"id":"Dashboard, user & inventaris","en":"Dashboard, users & inventory"}'::jsonb, null, '{"id":"HTML, CSS, JavaScript, PHP","en":"HTML, CSS, JavaScript, PHP"}'::jsonb, '{"id":"Frontend developer (magang)","en":"Frontend developer (internship)"}'::jsonb, '{"id":"Jan – Mar 2022","en":"Jan – Mar 2022"}'::jsonb, null, '[{"id":"Halaman dashboard, sistem manajemen pengguna, dan modul inventaris","en":"Dashboard pages, user management and an inventory module"},{"id":"Layout responsif untuk kompatibilitas lintas platform","en":"Responsive layouts for cross-platform compatibility"}]'::jsonb),
  ('iss-content', 'design', 'published', false, 60, '2023–', null, '{"id":"Konten iPhone Service Solution","en":"iPhone Service Solution content"}'::jsonb, '{"id":"iPhone Service Solution","en":"iPhone Service Solution"}'::jsonb, '{"id":"Feed, materi promosi & reels","en":"Feeds, collateral & reels"}'::jsonb, null, '{"id":"450+ visual, 400+ reels","en":"450+ visuals, 400+ reels"}'::jsonb, null, null, null, '[{"id":"450+ visual feed dan materi promosi: poster, banner, brosur, iklan, daftar harga","en":"450+ feed visuals and collateral: posters, banners, brochures, ads, price lists"},{"id":"400+ video reels untuk Instagram dan TikTok","en":"400+ video reels for Instagram and TikTok"},{"id":"Akun tumbuh 200% dalam 2 tahun","en":"Account grew 200% in 2 years"}]'::jsonb),
  ('wifi', 'it', 'published', false, 70, '2021–25', null, '{"id":"Layanan WiFi Rumahan","en":"Home WiFi Service"}'::jsonb, '{"id":"Usaha sendiri","en":"Own business"}'::jsonb, '{"id":"Instalasi & perawatan jaringan","en":"Network install & maintenance"}'::jsonb, null, '{"id":"Fiber optik, HTB, router","en":"Fibre optic, HTB, routers"}'::jsonb, null, null, null, '[]'::jsonb),
  ('game-3d', 'other', 'published', false, 80, '2022', null, '{"id":"3D Art Game","en":"3D Art Game"}'::jsonb, '{"id":"LKS Kab. Batang","en":"Batang Regency LKS"}'::jsonb, '{"id":"Juara 3 lomba kompetensi siswa","en":"3rd place, student competency contest"}'::jsonb, null, '{"id":"3D, game art","en":"3D, game art"}'::jsonb, null, null, null, '[]'::jsonb),
  ('ar', 'other', 'published', false, 90, '2021', null, '{"id":"Proyek Augmented Reality","en":"Augmented Reality Project"}'::jsonb, '{"id":"BPTIK DIKBUD Jateng","en":"BPTIK DIKBUD Jateng"}'::jsonb, '{"id":"Juara 1 Gelar Karya Siswa & Guru","en":"1st place, student & teacher showcase"}'::jsonb, null, '{"id":"Augmented reality","en":"Augmented reality"}'::jsonb, null, null, null, '[]'::jsonb);

with g as (insert into public.v2_skill_groups (area, title, sort) values
  ('web', '{"id":"Backend","en":"Backend"}'::jsonb, 0),
  ('web', '{"id":"Frontend","en":"Frontend"}'::jsonb, 1),
  ('web', '{"id":"Database","en":"Database"}'::jsonb, 2),
  ('web', '{"id":"Integrasi","en":"Integrations"}'::jsonb, 3),
  ('web', '{"id":"Lainnya","en":"Other"}'::jsonb, 4),
  ('design', '{"id":"Desain & media","en":"Design & media"}'::jsonb, 5),
  ('it', '{"id":"IT support","en":"IT support"}'::jsonb, 6),
  ('soft', '{"id":"Soft skills","en":"Soft skills"}'::jsonb, 7)
  returning id, sort)
insert into public.v2_skills (group_id, name, sort)
select g.id, s.name, s.sort from g join (values
  (0, '{"id":"Laravel","en":"Laravel"}'::jsonb, 0),
  (0, '{"id":"CodeIgniter","en":"CodeIgniter"}'::jsonb, 1),
  (0, '{"id":"PHP","en":"PHP"}'::jsonb, 2),
  (0, '{"id":"Node.js","en":"Node.js"}'::jsonb, 3),
  (0, '{"id":"Next.js","en":"Next.js"}'::jsonb, 4),
  (0, '{"id":"Java","en":"Java"}'::jsonb, 5),
  (0, '{"id":"REST API","en":"REST API"}'::jsonb, 6),
  (0, '{"id":"JWT","en":"JWT"}'::jsonb, 7),
  (1, '{"id":"React","en":"React"}'::jsonb, 0),
  (1, '{"id":"TypeScript","en":"TypeScript"}'::jsonb, 1),
  (1, '{"id":"JavaScript","en":"JavaScript"}'::jsonb, 2),
  (1, '{"id":"HTML","en":"HTML"}'::jsonb, 3),
  (1, '{"id":"CSS","en":"CSS"}'::jsonb, 4),
  (1, '{"id":"Tailwind CSS","en":"Tailwind CSS"}'::jsonb, 5),
  (1, '{"id":"Bootstrap","en":"Bootstrap"}'::jsonb, 6),
  (2, '{"id":"MySQL","en":"MySQL"}'::jsonb, 0),
  (2, '{"id":"PostgreSQL","en":"PostgreSQL"}'::jsonb, 1),
  (2, '{"id":"Supabase","en":"Supabase"}'::jsonb, 2),
  (3, '{"id":"WhatsApp API (Fonnte, Wablas)","en":"WhatsApp API (Fonnte, Wablas)"}'::jsonb, 0),
  (3, '{"id":"Midtrans","en":"Midtrans"}'::jsonb, 1),
  (3, '{"id":"Google OAuth","en":"Google OAuth"}'::jsonb, 2),
  (4, '{"id":"Git & GitHub","en":"Git & GitHub"}'::jsonb, 0),
  (4, '{"id":"WordPress","en":"WordPress"}'::jsonb, 1),
  (4, '{"id":"Kotlin","en":"Kotlin"}'::jsonb, 2),
  (4, '{"id":"Flutter","en":"Flutter"}'::jsonb, 3),
  (5, '{"id":"Figma","en":"Figma"}'::jsonb, 0),
  (5, '{"id":"Illustrator","en":"Illustrator"}'::jsonb, 1),
  (5, '{"id":"Photoshop","en":"Photoshop"}'::jsonb, 2),
  (5, '{"id":"Lightroom","en":"Lightroom"}'::jsonb, 3),
  (5, '{"id":"Canva","en":"Canva"}'::jsonb, 4),
  (5, '{"id":"CapCut","en":"CapCut"}'::jsonb, 5),
  (5, '{"id":"DaVinci Resolve","en":"DaVinci Resolve"}'::jsonb, 6),
  (5, '{"id":"Filmora","en":"Filmora"}'::jsonb, 7),
  (6, '{"id":"Troubleshooting laptop, Android, iPhone","en":"Laptop, Android, iPhone troubleshooting"}'::jsonb, 0),
  (6, '{"id":"Upgrade RAM & SSD","en":"RAM & SSD upgrades"}'::jsonb, 1),
  (6, '{"id":"Thermal paste","en":"Thermal paste"}'::jsonb, 2),
  (6, '{"id":"Instalasi Windows & Linux","en":"Windows & Linux installs"}'::jsonb, 3),
  (6, '{"id":"Perawatan printer","en":"Printer maintenance"}'::jsonb, 4),
  (6, '{"id":"WiFi, router, fiber optik","en":"WiFi, routers, fibre optic"}'::jsonb, 5),
  (7, '{"id":"Kerja sama tim","en":"Teamwork"}'::jsonb, 0),
  (7, '{"id":"Komunikasi","en":"Communication"}'::jsonb, 1),
  (7, '{"id":"Pemecahan masalah","en":"Problem solving"}'::jsonb, 2),
  (7, '{"id":"Kepemimpinan","en":"Leadership"}'::jsonb, 3),
  (7, '{"id":"Mengajar (rating 9/10 dari 10+ siswa)","en":"Teaching (9/10 rating from 10+ students)"}'::jsonb, 4)
) as s(group_sort, name, sort) on s.group_sort = g.sort;

insert into public.v2_experiences (role, organization, kind, area, started_on, ended_on, on_home, summary, highlights) values
  ('{"id":"Programmer Fullstack","en":"Fullstack Programmer"}'::jsonb, 'PT Hucle', '{"id":"Kontrak","en":"Contract"}'::jsonb, 'web', '2026-09-01', '2026-12-31', true, '{"id":"Aplikasi HRIS: skema database dan API untuk absensi, karyawan, penggajian, KPI. Tim 8 orang.","en":"HRIS app: database schema and APIs for attendance, staff, payroll, KPI. Team of 8."}'::jsonb, '[{"id":"Membangun aplikasi web HRIS full-stack, frontend dan backend","en":"Building a full-stack HRIS web app, frontend and backend"},{"id":"Skema database dan API: absensi, karyawan, penggajian, KPI","en":"Database schema and APIs: attendance, staff, payroll, KPI"},{"id":"Pengembangan dan pengujian fitur dalam tim 8 orang","en":"Feature development and testing in a team of 8"}]'::jsonb),
  ('{"id":"Programmer Fullstack","en":"Fullstack Programmer"}'::jsonb, 'Ritecs', '{"id":"Magang","en":"Internship"}'::jsonb, 'web', '2025-08-01', '2025-12-31', true, '{"id":"Membangun Ritecs.org end-to-end: UI/UX, database, backend, dan dashboard admin.","en":"Built Ritecs.org end-to-end: UI/UX, database, backend and admin dashboard."}'::jsonb, '[{"id":"Ritecs.org end-to-end: UI/UX, arsitektur database, backend, dashboard admin","en":"Ritecs.org end-to-end: UI/UX, database architecture, backend, admin dashboard"},{"id":"Modul Penerbitan Buku, Jurnal, Awarding, Keanggotaan, Layanan dengan API lengkap","en":"Book Publishing, Journal, Awards, Membership, Services modules with full APIs"},{"id":"CRUD dan hak akses berbasis peran; pencegahan SQL injection & XSS","en":"CRUD and role-based access; SQL injection & XSS prevention"}]'::jsonb),
  ('{"id":"Desainer Grafis & Teknisi Perangkat","en":"Graphic Designer & Device Technician"}'::jsonb, 'iPhone Service Solution', '{"id":"Paruh waktu","en":"Part-time"}'::jsonb, 'design', '2023-07-01', null, true, '{"id":"Konten visual dan reels; akun tumbuh 200% dalam 2 tahun. Perbaikan ponsel dan laptop.","en":"Visual content and reels; the account grew 200% in 2 years. Phone and laptop repairs."}'::jsonb, '[{"id":"450+ visual feed dan materi promosi, 400+ reels untuk Instagram & TikTok","en":"450+ feed visuals and collateral, 400+ reels for Instagram & TikTok"},{"id":"Akun tumbuh 200% dalam 2 tahun","en":"Account grew 200% in 2 years"},{"id":"Perbaikan Android, iPhone, laptop; upgrade RAM & disk; Windows/Linux","en":"Android, iPhone, laptop repair; RAM & disk upgrades; Windows/Linux"}]'::jsonb),
  ('{"id":"Tutor Kursus","en":"Course Tutor"}'::jsonb, 'Eduprima Indonesia', '{"id":"Freelance","en":"Freelance"}'::jsonb, 'design', '2023-06-01', null, false, '{"id":"Mengajar desain grafis & pemrograman web untuk 10+ siswa, rating kepuasan rata-rata 9/10.","en":"Teaching graphic design & web programming to 10+ students, average satisfaction 9/10."}'::jsonb, '[]'::jsonb),
  ('{"id":"Layanan WiFi Rumahan","en":"Home WiFi Service"}'::jsonb, 'Wiraswasta', '{"id":"Freelance","en":"Freelance"}'::jsonb, 'it', '2021-01-01', '2025-12-31', false, '{"id":"Internet rumahan dengan fiber optik, HTB, dan router; pemasangan dan troubleshooting koneksi pelanggan.","en":"Home internet over fibre, HTB and routers; installation and connection troubleshooting for customers."}'::jsonb, '[]'::jsonb),
  ('{"id":"Frontend Web Developer","en":"Frontend Web Developer"}'::jsonb, 'Educa Studio Gamelab', '{"id":"Magang","en":"Internship"}'::jsonb, 'web', '2022-01-01', '2022-03-31', false, '{"id":"Dashboard, manajemen pengguna, dan modul inventaris (HTML, CSS, JavaScript, PHP) dengan layout responsif.","en":"Dashboard, user management and inventory module (HTML, CSS, JavaScript, PHP) with responsive layouts."}'::jsonb, '[]'::jsonb);

insert into public.v2_education (program, institution, started_on, ended_on, grade, highlights, sort) values
  ('{"id":"D3 Teknik Informatika","en":"Diploma (D3) in Informatics Engineering"}'::jsonb, 'Universitas Dian Nuswantoro', '2023-07-01', '2026-08-31', '3.86 / 4.00', '[{"id":"Fokus pengembangan web: PHP, Laravel, CodeIgniter, MySQL, PostgreSQL, API, JWT","en":"Web development focus: PHP, Laravel, CodeIgniter, MySQL, PostgreSQL, APIs, JWT"},{"id":"Kepala Divisi Multimedia, Himpunan Mahasiswa Teknik Informatika (D3)","en":"Head of Multimedia, Informatics Engineering Student Association (D3)"}]'::jsonb, 0),
  ('{"id":"Rekayasa Perangkat Lunak","en":"Software Engineering"}'::jsonb, 'SMK Negeri 1 Kandeman', '2020-03-01', '2023-03-31', null, '[{"id":"Juara 1 Proyek Augmented Reality, BPTIK DIKBUD Jateng (2021)","en":"1st place, Augmented Reality project, BPTIK DIKBUD Central Java (2021)"},{"id":"Juara 3 3D Art Game, LKS Kabupaten Batang (2022)","en":"3rd place, 3D Art Game, Batang Regency LKS (2022)"},{"id":"Delegasi Kab. Batang, SMK Digital Bootcamp Kemendikbud (Bali, 2022)","en":"Batang Regency delegate, SMK Digital Bootcamp (Bali, 2022)"},{"id":"Penghargaan Siswa Berprestasi, angkatan 2020/2023","en":"Outstanding Student Award, class of 2020/2023"}]'::jsonb, 1);
