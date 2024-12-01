import type { IBrandDetail } from "./IBrand";

export interface IMenuElement {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;
}

export interface INavigationMenu {
  type: string;
  count: number;
  elements: IMenuElement[];
}

export interface IProductCatalogResponse {
  active: boolean;
  benefitPercentDiscount: number;
  brandDetail: any;
  code: string;
  color: string;
  colorDetail: IColor;
  deep: number;
  discount: number;
  height: number;
  id: string;
  isMolduraPvc: boolean;
  isPlacaPvc: boolean;
  mainImage: string;
  model: string;
  name: string;
  performance: string;
  price: number;
  priceDifference: number;
  priceDifferenceWithIva: number;
  priceDifferenceWithIvaAndDiscount: number;
  priceWithIva: number;
  priceWithIvaAndDiscount: number;
  priority: number;
  published: boolean;
  slug: string;
  status: string;
  stock: number;
  weight: number;
  width: number;
  quantity: number;
  descriptionTwo: string;
  descriptionThree: string;
  descriptionFour: string;
}

export interface IColor {
  id: string;
  name: string;
  hex: string;
}

export interface ICatalogResponse {
  menu: INavigationMenu;
  products: IProductCatalogResponse[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface IDataCatalog {
  results: ICatalogResponse;
  search: string;
  page: number;
  line: string;
  subline: string;
  pathname: string;
  sortby: string;
}
