export interface IProductCart {
  id: string;
  name: string;
  slug: string;
  code: string;
  priceWithIvaAndDiscount: number;
  priceWithIva: number;
  mainImage: string;
  stock: number;
  quantity: number;
  acopio: number;
  weight: number;
  // date: Date;
}
