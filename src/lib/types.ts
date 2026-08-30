export type SearchRequestRow = {
  id: string;
  user_id?: string;
  city: string;
  budget_max: number | null;
  bedrooms: number | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export type SearchRunRow = {
  id: string;
  search_request_id: string;
  status: string;
  listings_scanned: number;
  matches_found: number;
  log: string | null;
  started_at: string;
  finished_at: string | null;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  plan: string | null;
  notification_email: boolean;
  notification_matches: boolean;
  created_at: string;
};
