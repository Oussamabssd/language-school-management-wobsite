export interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  date_of_birth?: string;
  avatar?: string;
  roles: Role[];
  is_active: boolean;
  must_change_password: boolean;
  groups?: Group[];
  teaching_groups?: Group[];
  teacher_profile?: TeacherProfile;
}

export interface TeacherProfile {
  id: number;
  user_id: number;
  cv_path?: string;
  specialization?: string;
  bio?: string;
  hire_date?: string;
  hourly_rate?: string;
  contract_type: 'full-time' | 'part-time' | 'freelance';
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
}

export interface Language {
  id: number;
  name: string;
  code: string;
}

export interface Level {
  id: number;
  name: string;
  language_id: number;
}

export interface Registration {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejection_reason?: string;
  language?: Language;
  level?: Level;
  reviewer?: User;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface Group {
  id: number;
  name: string;
  level_id: number;
  teacher_id?: number;
  max_students: number;
  academic_year: string;
  status: 'active' | 'inactive' | 'completed';
  level?: Level;
  teacher?: User;
  students?: User[];
  created_at: string;
}

export interface Timetable {
  id: number;
  group_id: number;
  course_id?: number;
  teacher_id: number;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  room?: string;
  academic_year: string;
  is_active: boolean;
  group?: Group;
  teacher?: User;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  file_path?: string | null;
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  group?: Group;
  teacher?: User;
  created_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  author_id: number;
  target_audience: 'all' | 'students' | 'teachers' | 'parents' | 'staff';
  group_id?: number | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_published: boolean;
  published_at?: string | null;
  expires_at?: string | null;
  author?: User;
  group?: Group;
  created_at: string;
}
