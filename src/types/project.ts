export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  role: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  status: 'ONGOING' | 'COMPLETED' | 'PAUSED';
  project_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  sort_order: number;
  field_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relations
  field?: Field;
  images?: ProjectImage[];
  technologies?: Technology[];
}

export interface Field {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  years: number | null;
  sort_order: number;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface Technology {
  id: string;
  name: string;
  category_id: string | null;
  category?: TechCategory;
}

export interface TechCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  role: string;
  field_id: string;
  status: 'ONGOING' | 'COMPLETED' | 'PAUSED';
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_featured: boolean;
  project_url: string;
  github_url: string;
  technology_ids: string[];
  sort_order: number;
}

// Media Library Types
export interface MediaImage {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  project?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

export interface ImageUploadData {
  file: File;
  alt_text?: string;
  sort_order?: number;
}