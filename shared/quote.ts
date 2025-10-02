export interface Quote {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message?: string | null;
  files?: { url: string; name: string }[] | null;
  created_at?: string;
}
