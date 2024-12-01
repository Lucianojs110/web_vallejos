import React from "react";
import { Button } from "@nextui-org/react";
import type { IProductCart } from "../types/ICart";
import { addProductToCart } from "../stores/cart";

export default function ButtonAddToCart({
  product,
}: {
  product: IProductCart;
}) {
  return (
    <Button
      className="bg-orange-500   text-white font-bold w-full text-lg hover:bg-orange-600 rounded-xl"
       style={{ minHeight: "40px" }}
 
      onClick={() => {
        addProductToCart(product);
        setTimeout(() => {
          const cartFloatingButton = document.getElementById(
            "cart-floating-button"
          );

          if (cartFloatingButton) {
            cartFloatingButton.classList.add("animate-pulse");
            setTimeout(() => {
              cartFloatingButton.classList.remove("animate-pulse");
            }, 100);
            cartFloatingButton.click();
          }
        }, 100);
      }}
    >
      AGREGAR
    </Button>
  );
}
