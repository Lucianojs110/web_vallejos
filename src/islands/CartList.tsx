import React from "react";
import { useStore } from "@nanostores/react";
import {
  removeProductFromCart,
  updateProductQuantity,
  cartItems,
  getCountTotalPriceWithIvaAndDiscount,
  getCountTotalPriceWithIva,
} from "../stores/cart";
import type { IProductCart } from "../types/ICart";
import { formatCurrency } from "../utils/formatter";

const closeModal = () => {
  const modal = document.getElementById("cart-list");
  if (modal) {
    modal.style.display = "none";
  }
};

export default function CartList() {
  const $cartItems = useStore(cartItems);
  const quantity = Object.values($cartItems)
    .filter((item) => item !== null)
    .reduce((acc: number, item: any) => acc + item.quantity, 0);

  const countTotalPriceWithIva = getCountTotalPriceWithIva();

  const countTotalPriceWithIvaAndDiscount =
    getCountTotalPriceWithIvaAndDiscount();

  return (
    <div
      id="cart-list"
      className={`w-full hidden fixed w-full h-full z-30 pt-16 bg-gray-500 bg-opacity-50 overflow-hidden flex flex-col justify-center items-end`}
    >
      <div
        className={`bg-white shadow-md h-screen  w-3/4 md:w-3/6 lg:w-2/6 flex-1 `}
      >
        {quantity > 0 ? (
          <>
            <div
              className={`flex flex-col gap-3 p-1 pb-6 max-h-[65%] border-1 shadow overflow-y-scroll`}
            >
              {Object.values($cartItems)
                .filter((item) => item !== null)
                .map((product: IProductCart | null) => (
                  <div
                    className={`flex flex-row gap-5 border-2 p-2 w-full`}
                    key={product?.id}
                  >
                    <div className={`flex flex-col gap-2 w-full`}>
                      <a href={`/catalogo/${product?.slug}`}>
                        <div className={`flex flex-row gap-2`}>
                          <img
                            src={product?.mainImage}
                            alt={product?.name}
                            className={`w-16 h-16`}
                          />
                          <div className={`flex flex-col gap-2`}>
                            <span className={`font-light text-xs`}>
                              {product?.name}
                            </span>
                            <span className={`text-gray-500 text-xs`}>
                              sku: {product?.code}
                            </span>
                          </div>
                        </div>
                      </a>
                      <div
                        className={`flex flex-row gap-2 justify-between items-center text-sm`}
                      >
                        <div className={`flex-1`}>
                          <span className={`font-semibold`}>
                            {product?.quantity} x{" "}
                            {formatCurrency(
                              product?.priceWithIvaAndDiscount || 0
                            )}
                          </span>
                        </div>

                        <div className={`flex-1`}>
                          <div className={`flex flex-row justify-evenly gap-2`}>
                            <div
                              className={`p-1 hover:cursor-pointer`}
                              onClick={() =>
                                updateProductQuantity(
                                  product?.id || "",
                                  (product?.quantity || 1) - 1
                                )
                              }
                            >
                              <i>
                                <img src="/images/minus.svg" />
                              </i>
                            </div>
                            <div
                              className={`p-1 hover:cursor-pointer`}
                              onClick={() =>
                                updateProductQuantity(
                                  product?.id || "",
                                  (product?.quantity || 1) + 1
                                )
                              }
                            >
                              <i>
                                <img src="/images/plus.svg" />
                              </i>
                            </div>
                            <div
                              className={`p-1 hover:cursor-pointer`}
                              onClick={() =>
                                removeProductFromCart(product?.id || "")
                              }
                            >
                              <i>
                                <img src="/images/trash.svg" />
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className={`flex flex-col gap-3 p-2 mt-3`}>
              {/* <div className={`flex flex-row justify-between text-sm p-1`}>
                <span className={`font-semibold`}>Hasta 12 cuotas</span>
                <span className={`font-semibold`}>
                  {formatCurrency(countTotalPriceWithIva)}
                </span>
              </div> */}
              <div
                className={`flex flex-row justify-between text-green-700 bg-gray-200 text-base p-1`}
              >
                <span className={`font-bold`}>Contado / 1 pago</span>
                <span className={`font-bold`}>
                  {formatCurrency(countTotalPriceWithIvaAndDiscount)}
                </span>
              </div>
              <div className={`flex flex-row justify-center `}>
                <a
                  href="/checkout"
                  className={` p-3 bg-yellow-600 rounded text-white font-bold text-lg w-full text-center`}
                >
                  <span>Ir a pagar</span>
                </a>
              </div>
              <div className={`flex flex-row justify-center `}>
                <button
                  className={`p-3 bg-yellow-800 rounded text-white font-bold text-base w-full`}
                  onClick={closeModal}
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`flex flex-col gap-6 items-center justify-center h-screen`}
          >
            <div>
              <img src="/images/logo.svg" alt="empty cart" />
            </div>
            <div>
              <span className={`text-2xl font-bold`}>
                Tu carrito está vacío
              </span>
            </div>
            <div>
              <div className={`flex flex-row justify-center`}>
                <button
                  className={`p-3 bg-yellow-800 rounded text-white font-bold text-base w-full`}
                  onClick={closeModal}
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
