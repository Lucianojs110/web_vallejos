import type { IProductDetailResponse } from "./IProducDetail";

export interface IAccesory {
  id: string;
  nombre: string;
  tipo: string;
  productListResult: IProductDetailResponse[];
}
