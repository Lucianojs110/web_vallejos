import type { IBrandDetail } from "./IBrand";
import type { IProductCatalogResponse } from "./ICatalog";

export interface IProductDetailResponse {
  id: string;
  useMode: string;
  performance: string;
  name: string;
  descriptionTwo: string;
  descriptionThree: string;
  descriptionFour: string;
  slug: string;
  code: string;
  status: string;
  priority: number;
  EAN: string;
  DUN: string;
  model: string;
  presentation: string;
  discount: number;
  stock: number;
  mainImage: string;
  images: string[];
  detailImages: string[];
  video: string;
  video2: string;
  pdfDocument: string;
  pdfDocument2: string;
  pdfDocumentTitle: string;
  pdfDocumentTitle2: string;
  detailText1: string;
  detailText2: string;
  detailText3: string;
  price: number;
  priceDifference: number;
  priceDifferenceWithIva: number;
  priceDifferenceWithIvaAndDiscount: number;
  priceWithIva: number;
  priceWithIvaAndDiscount: number;
  stackable: boolean;
  brandDetail: IBrandDetail;
  lineDetail: ILineDetail;
  relatedProducts: IProductCatalogResponse[];
  weight: number;
  benefitPercentDiscount: number;
}

interface ILineDetail {
  id: string;
  nombre: string;
  activo: boolean;
  codigo: number;
  foto: string;
  slug: string;
}
