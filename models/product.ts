export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  position?: number;
  image?: string;
  brand?: string;
  category?: string;
  color?: string;
  sizes?: string[];
  description?: string;
  season?: string;
  createdAt?: { seconds?: number } | number;
}

export type ProductMaybe = Partial<Product> & { id?: string };
