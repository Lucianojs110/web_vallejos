import {
  CALCULATOR_API,
  GET_QUANTITIES_API,
  GET_ACCESORIES_API,
  GET_PVC_API,
} from "../config/constants";
import type { IAccesory } from "../types/accesories";
import type { IProductCatalogResponse as Product } from "../types/ICatalog";
import type { QuantityRequest } from "../types/quantityRequest";
import type { StructureOption } from "../types/structureOption";

export const getStructuresList = async () => {
  const response = await fetch(CALCULATOR_API, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data as StructureOption[];
};

export const getQuantitiesProducts = async (
  quantitiesRequest: QuantityRequest[]
) => {
  const response = await fetch(GET_QUANTITIES_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quantitiesRequest),
  });

  const data = (await response.json()) as Product[];
  return data;
};

export const getAccesoriesProducts = async () => {
  const response = await fetch(GET_ACCESORIES_API, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await response.json()) as IAccesory[];
  return data;
};

export const getPvcProducts = async () => {
  const response = await fetch(GET_PVC_API, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await response.json()) as Product[];
  return data;
};
