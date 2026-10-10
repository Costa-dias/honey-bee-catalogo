import { createClient } from '@supabase/supabase-js';

// Capture the redirect marker before createClient starts Supabase Auth
// initialization, so the React listener can recover even if the SDK event
// fires before AuthProvider mounts.
export const recoveryLinkAtStartup = (() => {
  if (typeof window === 'undefined') return false;

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const queryParams = new URLSearchParams(window.location.search);

  return hashParams.get('type') === 'recovery' || queryParams.get('recovery') === '1';
})();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Basket = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type StockMovement = {
  id: string;
  product_name: string;
  movement_type: 'entrada' | 'saida';
  quantity: number;
  notes: string;
  recorded_at: string;
};

