import React from "react";
import { useStore } from "@nanostores/react";
import {
  removeProductFromCart,
  updateProductAcopio,
  updateProductQuantity,
  cartItems,
  getCountTotalPriceWithIvaAndDiscount,
  getCountTotalPriceWithIva,
} from "../../stores/cart";
import type { IProductCart } from "../../types/ICart";
import { formatCurrency } from "../../utils/formatter";

import { isAcopioChecked, setAcopioChecked } from "../../stores/checkout";
import CheckBox from "../CheckBox/CheckBox";
import NextButton from "./NextButton";

import { LoginModal } from "../LoginForm";
import { useDisclosure } from "@nextui-org/react";

export default function OrderDetail({ token = null }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const isChecked = isAcopioChecked();
  const $cartItems = useStore(cartItems);

  // const countTotalPriceWithIva = getCountTotalPriceWithIva();
  const countTotalPriceWithIvaAndDiscount =
    getCountTotalPriceWithIvaAndDiscount();

  return (
    <>
      <div className={`flex flex-col gap-3 p-1 border-1 shadow`}>
        <div className={`flex justify-between items-center`}>
          <span className={`font-light text-lg`}></span>
          <div className={`flex justify-end items-center`}>
            <span className={`font-extralight pr-4`}>Habilitar acopio</span>
            <CheckBox
              isChecked={isChecked}
              setChecked={() => {
                if (!token) {
                  onOpenChange();
                  return;
                }

                setAcopioChecked(!isChecked);
              }}
            />
          </div>
        </div>
        {Object.values($cartItems)
          .filter((item) => item !== null)
          .map((product) =>
            CheckProductDetail(product as IProductCart, isChecked)
          )}
      </div>

      <div className={`sticky bg-white bottom-0`}>
        <div className={`flex flex-col gap-3 p-2 mt-3`}>
          <div
            className={`flex flex-row justify-between text-green-700 bg-gray-200 text-base p-1`}
          >
            <span className={`font-bold`}>Contado / 1 pago</span>
            <span className={`font-bold`}>
              {formatCurrency(countTotalPriceWithIvaAndDiscount)}
            </span>
          </div>
          {/* <div className={`flex flex-row justify-between text-sm p-1`}>
            <span className={`font-semibold`}>Hasta 12 cuotas</span>
            <span className={`font-semibold`}>
              {formatCurrency(countTotalPriceWithIva)}
            </span>
          </div> */}
        </div>

        <NextButton step={2} onClick={() => {}} />
      </div>

      <LoginModal
        {...{ isOpen, onOpenChange, setLoading, setError, loading, error }}
      />
    </>
  );
}

function CheckProductDetail(product: IProductCart, isChecked: boolean) {
  return (
    <div className={`flex flex-row gap-5 border-2 p-2 w-full`} key={product.id}>
      <div className={`flex flex-col gap-2 w-full`}>
        <div className={`flex flex-row gap-2 justify-between`}>
          <a href={`/catalogo/${product.slug}`}>
            <img
              src={product.mainImage}
              alt={product.name}
              className={`w-16 h-16`}
            />
          </a>
          <a href={`/catalogo/${product.slug}`}>
            <div className={`flex flex-col gap-2`}>
              <span className={`font-light text-xs`}>{product.name}</span>
              <span className={`text-gray-500 text-xs`}>
                sku: {product.code}
              </span>
            </div>
          </a>
          <div
            className={`p-1 hover:cursor-pointer`}
            onClick={() => removeProductFromCart(product.id)}
          >
            <i>
              <img src="/images/trash.svg" />
            </i>
          </div>
        </div>

        <div
          className={`flex flex-row gap-2 justify-between items-center text-sm`}
        >
          <div className={`flex-1`}>
            <div>
              <span className={`font-bold`}>
                Cantidad:{"  "}
                {product.quantity} x{" "}
                {formatCurrency(product.priceWithIvaAndDiscount)}
              </span>
            </div>
            <div>
              <span className={`font-semibold`}>
                Sub total:{"   "}
                {formatCurrency(
                  product.priceWithIvaAndDiscount * product.quantity
                )}
              </span>
            </div>
          </div>

          <div className={`flex-[0.5]`}>
            <div className={`flex justify-evenly gap-2`}>
              <div
                className={`p-1 hover:cursor-pointer`}
                onClick={() =>
                  updateProductQuantity(product.id, product.quantity - 1)
                }
              >
                <i>
                  <img src="/images/minus.svg" />
                </i>
              </div>
              <div
                className={`p-1 hover:cursor-pointer`}
                onClick={() =>
                  updateProductQuantity(product.id, product.quantity + 1)
                }
              >
                <i>
                  <img src="/images/plus.svg" />
                </i>
              </div>
            </div>
          </div>
        </div>

        {/* acopio */}
        {isChecked && (
          <>
            <span className={`w-full border`}></span>
            <div
              className={`flex flex-row gap-2 justify-between items-center text-sm`}
            >
              <div className={`flex-1`}>
                <span className={`font-light`}>
                  Acopiar:{"  "}
                  {product.acopio}
                </span>
              </div>

              <div className={`flex-[0.5]`}>
                <div className={`flex justify-evenly gap-2`}>
                  <div
                    className={`p-1 hover:cursor-pointer`}
                    onClick={() =>
                      updateProductAcopio(product.id, product.acopio - 1)
                    }
                  >
                    <i>
                      <img src="/images/minus.svg" />
                    </i>
                  </div>
                  <div
                    className={`p-1 hover:cursor-pointer`}
                    onClick={() =>
                      updateProductAcopio(product.id, product.acopio + 1)
                    }
                  >
                    <i>
                      <img src="/images/plus.svg" />
                    </i>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
