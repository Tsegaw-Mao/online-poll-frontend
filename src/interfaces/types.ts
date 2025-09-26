export interface User {
  id: number;
  username: string;
  password?: string;
}

export interface Option {
  id: number;
  text: string;
  vote_count: number;
}

export interface Poll {
  id: number;
  title: string;
  description?: string;
  expiry_date: string;
  created_at: string;
  created_by: number;
  options?: Option[];
}

export interface PollsResponse {
  polls: Poll[];
}