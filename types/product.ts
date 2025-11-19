export interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  image_url?: string; // Added for Supabase compatibility
  colors?: number | string[];
  category?: string;
  gender?: string;
  age_group?: string;
  description?: string;
  created_at?: string;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  link: string;
}
