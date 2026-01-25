## 🗺️ ROUTES MAP

### **Public Routes:**

```
GET  /                           → Homepage
GET  /about                      → About page
GET  /portfolio                  → Portfolio listing (filterable)
GET  /portfolio/[slug]           → Project detail with gallery
GET  /contact                    → Contact page with form
GET  /blog                       → Blog listing (Phase 5)
GET  /blog/[slug]                → Blog post (Phase 5)
```

### **Admin Routes (Protected):**

```
GET  /admin                      → Dashboard
GET  /admin/projects             → Projects management
GET  /admin/projects/new         → Create new project
GET  /admin/projects/[id]/edit   → Edit project
GET  /admin/media                → Media library
GET  /admin/profile              → Edit profile & CV
GET  /admin/messages             → Contact form inbox
GET  /admin/settings             → Site settings
```

### **API Routes:**

```
POST /api/auth/[...nextauth]     → NextAuth handlers
GET  /api/projects               → Fetch projects (with filters)
POST /api/projects               → Create project
PUT  /api/projects/[id]          → Update project
DELETE /api/projects/[id]        → Delete project
POST /api/contact                → Submit contact form
POST /api/upload                 → Upload images
GET  /api/technologies           → Fetch tech stack
```
