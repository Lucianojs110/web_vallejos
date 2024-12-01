import React from "react";

import {
  getCountItems,
  cartItems,
  getCountTotalPriceWithIvaAndDiscount,
  updateProductAcopio,
  updateProductQuantity,
  removeProductFromCart,
} from "../../stores/cart";
import { useStore } from "@nanostores/react";
import type { IProductCart } from "../../types/ICart";
import { isAcopioChecked } from "../../stores/checkout";
import { formatCurrency } from "../../utils/formatter";

const CheckoutPage = ({ data }: { data: any }) => {
  return (
    <CheckoutContainer>
      <CheckoutStepper />
      <CheckoutDetailContainer />
    </CheckoutContainer>
  );
};

export default CheckoutPage;

const CheckoutContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row gap-8 pb-10 mr-[15%] ml-[15%]">
      {children}
    </div>
  );
};

const CheckoutStepper = () => {
  return (
    <div className="flex flex-1 flex-col items-center h-[auto] gap-6">
      <StepperHeader />
      <StepperBody />
    </div>
  );
};

const StepperHeader = () => {
  return (
    <div className="flex items-center border-1 shadow w-[100%] rounded-lg p-2 h-14 bg-white">
      <span className="font-light text-lg">Paso 1 de 3</span>
    </div>
  );
};

const StepperBody = () => {
  return <ProductListContainer />;
};

const ProductListContainer = () => {
  const $cartItems = useStore(cartItems);

  return (
    <div className="flex flex-col gap-3 w-[100%] overflow-auto">
      {Object.values($cartItems)
        .filter((item) => item !== null)
        .map((product) => (
          <CardItem product={product as IProductCart} key={product?.id} />
        ))}
    </div>
  );
};

const CardItem = ({ product }: { product: IProductCart }) => {
  const isChecked = isAcopioChecked();
  return (
    <div className="flex rounded-lg p-2 border-1 shadow bg-white">
      <div
        className={`flex flex-row gap-5 border-2 p-2 w-full`}
        key={product.id}
      >
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
    </div>
  );
};

const CheckoutDetailContainer = () => {
  return (
    <div className="sticky flex-[0.4]">
      <CheckoutDetail />
    </div>
  );
};

const CheckoutDetail = () => {
  const countTotalPriceWithIvaAndDiscount =
    getCountTotalPriceWithIvaAndDiscount();

  return (
    <div className="sticky top-[100px] bg-white bottom-0 h-auto border-1 shadow w-[100%] rounded-lg p-2 ">
      <div className="flex flex-col justify-between items-center">
        <span className="font-light text-lg">Detalle</span>
        <span className="font-light text-lg">
          {formatCurrency(countTotalPriceWithIvaAndDiscount)}
        </span>
      </div>
    </div>
  );
};
