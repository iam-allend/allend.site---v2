export interface User {
  id: string;
  email: string;
  full_name: string;
  nickname: string | null;
  phone: string | null;
  birthday: string | null;
  country: string | null;
  address: string | null;
  avatar_url: string | null;
  role: 'ADMIN' | 'VIEWER';
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  full_name: string;
  nickname: string;
  phone: string;
  birthday: string;
  country: string;
  address: string;
  avatar?: File | null;
}

export interface CVUploadData {
  cv_file: File;
}