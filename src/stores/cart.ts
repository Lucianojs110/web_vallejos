import { map } from "nanostores";
import { getProductsByCodes } from "../services";
import type { IProductCart } from "../types/ICart";
import type { IProductCatalogResponse } from "../types/ICatalog";

const cartStorageKey = "cart-storage";

const initStore = () => {
  if (typeof localStorage !== "undefined") {
    const persistState = localStorage.getItem(cartStorageKey);
    if (persistState) {
      const state = JSON.parse(persistState) as IProductCart[];

      return state;
    }
  }

  return {};
};

export const cartItems = map<Record<string, IProductCart | null>>(initStore());

export const syncDataCart = async () => {
  const codes = Object.values(cartItems.get())
    .filter((item) => item?.code)
    .map((item) => item?.code || "");
  const products = (await getProductsByCodes(
    codes
  )) as IProductCatalogResponse[];

  Object.values(cartItems.get()).map((item) => {
    const product = products.find(
      (product) => product.code === item?.code || ""
    );

    if (product) {
      cartItems.setKey(product.id, {
        id: product.id,
        code: product.code,
        name: product.name,
        slug: product.slug,
        priceWithIvaAndDiscount: product.priceWithIvaAndDiscount,
        priceWithIva: product.priceWithIva,
        mainImage: product.mainImage,
        stock: product.stock,
        weight: product.weight,
        quantity: item?.quantity || 1,
        acopio: item?.acopio || 0,
        date: item?.date || new Date(),
      });
    } else {
      cartItems.setKey(item?.id || "", null);
    }
  });
};

export const getCountItems = () => {
  return Object.values(cartItems.get())
    .filter((item) => item !== null)
    .reduce((acc: number, item: any) => acc + item.quantity, 0);
};

export const getTotalTn = () => {
  return Math.ceil(
    Object.values(cartItems.get())
      .filter((item) => item !== null)
      .reduce(
        (acc: number, item: any) => acc + item.quantity * item.weight,
        0
      ) / 1000
  );
};

export const getCountTotalPriceWithIvaAndDiscount = () => {
  return Object.values(cartItems.get())
    .filter((item) => item !== null)
    .reduce(
      (acc: number, item: any) =>
        acc + item.quantity * item.priceWithIvaAndDiscount,
      0
    );
};

export const getCountTotalPriceWithIva = () => {
  return Object.values(cartItems.get())
    .filter((item) => item !== null)
    .reduce(
      (acc: number, item: any) => acc + item.quantity * item.priceWithIva,
      0
    );
};

export const addProductToCart = (product: IProductCart, quantity = 1) => {
  const existingEntry = cartItems.get()[product.id];
  if (existingEntry) {
    cartItems.setKey(product.id, {
      ...existingEntry,
      quantity: existingEntry.quantity + 1,
    });
  } else {
    cartItems.setKey(product.id, {
      ...product,
      quantity,
      acopio: 0,
      date: new Date(),
    });
  }
  localStorage.setItem(cartStorageKey, JSON.stringify(cartItems.get()));
};

export const removeProductFromCart = (productId: string) => {
  cartItems.setKey(productId, null);
  localStorage.setItem(cartStorageKey, JSON.stringify(cartItems.get()));
};

export const updateProductQuantity = (productId: string, quantity: number) => {
  const existingEntry = cartItems.get()[productId];
  if (existingEntry) {
    cartItems.setKey(productId, {
      ...existingEntry,
      quantity: quantity || 1,
      acopio: existingEntry.acopio > quantity ? quantity : existingEntry.acopio,
    });
  }
  localStorage.setItem(cartStorageKey, JSON.stringify(cartItems.get()));
};

export const updateProductAcopio = (productId: string, acopio: number) => {
  const existingEntry = cartItems.get()[productId];
  if (existingEntry) {
    cartItems.setKey(productId, {
      ...existingEntry,
      acopio:
        acopio > existingEntry.quantity
          ? existingEntry.quantity
          : acopio > 0
          ? acopio
          : 0,
    });
  }
  localStorage.setItem(cartStorageKey, JSON.stringify(cartItems.get()));
};

export const clearCart = () => {
  cartItems.set({});
  localStorage.setItem(cartStorageKey, JSON.stringify(cartItems.get()));
};

syncDataCart();
