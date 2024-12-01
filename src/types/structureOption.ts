export interface StructureOption {
  id: string;
  category: string;
  productList: ProductList[];
  active: boolean;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ProductList {
  productsOptions: ProductsOption[];
  calc: string;
  label: string;
  select: string | null;
  gap: number | null | undefined;
}

export interface ProductsOption {
  code: string;
}

export interface PvcType {
  type: string;
  color: string | null;
  molduraId: string | null;
  width: number;
  deep: number;
}
