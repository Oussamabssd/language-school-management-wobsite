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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
