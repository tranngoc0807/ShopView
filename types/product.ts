export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  colors?: number;
  category: string;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  link: string;
}
