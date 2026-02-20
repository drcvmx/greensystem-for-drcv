export interface Brand {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  mobile_banner_url?: string;
  likes_count: number;
  created_at: string;
}

export interface Product {
  id: string;
  brand_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
  created_at: string;
}
