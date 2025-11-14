export interface Product {
  id    : string | null;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  categories: string[];
  discount: number | null ;
}

export interface CatalogListResponse{
    lstProducts: Product[]
}