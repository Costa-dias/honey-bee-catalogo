import { createClient } from '@supabase/supabase-js';

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

