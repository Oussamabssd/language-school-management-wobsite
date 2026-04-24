export interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  roles: Role[];
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
