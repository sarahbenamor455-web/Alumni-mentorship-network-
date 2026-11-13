export interface MentorUser {
  id: number;
  name: string;
  role: 'student' | 'alumni';
  industry: string | null;
  bio: string | null;
  created_at: string;
  relevance: number;
  schedule: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchResponse {
  data: MentorUser[];
  pagination: Pagination;
}

export interface FilterOptions {
  roles: string[];
  industries: string[];
  days: string[];
  timeSlots: string[];
}

export interface SearchParams {
  q: string;
  role: string;
  industry: string;
  day: string;
  timeSlot: string;
  sort: string;
  page: number;
  limit: number;
}