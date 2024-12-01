import { API_ENDPOINT, BASE_URL } from "../config/constants";
import type { IProductCatalogResponse as Product } from "../types/ICatalog";

export const getContribuyente = async (cuit: string) => {
  try {
    const resp = await fetch(`${API_ENDPOINT}/api/v1/contribuyente/${cuit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const apiResponse: any = await resp.json();
    return apiResponse;
  } catch (e) {
    return null;
  }
};

export const configDataResponse = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/v1/settings/config`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
  return {};
};

export const getProduct = async (slug: string) => {
  const resp = await fetch(`${API_ENDPOINT}/api/v1/product/slug/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await resp.json();
};

export const getProducts = async (
  filter: any,
  sortBy: string,
  sortOrder: string,
  page: number,
  search: string
) =>
  fetch(`${API_ENDPOINT}/catalog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageNumber: page,
      pageSize: 12,
      search: search,
      filter,
      sortBy,
      sortOrder,
      onlyActives: true,
    }),
  }).then((res) => res.json());

export const logout = async () => {
  try {
    const resp = await fetch(`/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie":
          "token-auth; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    });
    return await resp.json();
  } catch (e) {
    return null;
  }
};

export const getProductsByCodes = async (codes: string[]) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/v1/cart/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codes: codes,
      }),
    });

    const data = (await response.json()) as Product[];
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const shipmentsResponse = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/v1/shipments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
  return [];
};

export const getGroupBySlug = async (slug: string) => {
  const resp = await fetch(`${API_ENDPOINT}/api/v1/groups/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await resp.json();
};

export const getAllGroups = async () => {
  const resp = await fetch(`${API_ENDPOINT}/api/v1/groups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await resp.json();
};

export const getQuantities = async (products: any[]) => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/api/v1/calculator/get-quantities`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
      }
    );
    console.log(response);
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return [];
};

export const getCalculatorList = async () => {
  const resp = await fetch(`${API_ENDPOINT}/api/v1/calculator`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await resp.json();
};

export const getPvcList = async () => {
  const resp = await fetch(`${API_ENDPOINT}/api/v1/calculator/pvc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await resp.json();
};

export const getCalculator = async (calculator_cart_id: string) => {
  try {
    const resp = await fetch(`${BASE_URL}/api/calculator`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        calculator_cart_id: calculator_cart_id,
      },
    });

    return await resp.json();
  } catch (e) {
    return null;
  }
};

export const getColors = async () => {
  const resp = await fetch(`${API_ENDPOINT}/api/v1/colors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await resp.json();
};

export const getFeaturedProductsPage1 = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/catalog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 4,
        sortBy: "name",
        sortOrder: "asc",
        published: true,
        activo: true,
        filter: [
          {
            featured: true,
          },
        ],
      }),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const getFeaturedProductsPage2 = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/catalog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: 2,
        pageSize: 4,
        sortBy: "name",
        sortOrder: "asc",
        published: true,
        activo: true,
        filter: [
          {
            featured: true,
          },
        ],
      }),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

