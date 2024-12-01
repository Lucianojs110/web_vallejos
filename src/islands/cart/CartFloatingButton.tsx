import React from "react";
import { Button, Chip } from "@nextui-org/react";
import CartIcon from "../../icons/CartIcon";

const CartFloatingButton = ({
  onOpen,
  quantity,
  relative,
}: {
  onOpen: Function;
  quantity: number;
  relative: boolean;
}) => {
  if (quantity === 0) return null;

  return (
    <div>
      {/* Botón para escritorio */}
      <Button
  id="cart-floating-button-desktop"
  onClick={() => onOpen()}
  className={`${
    relative
      ? "relative"
      : "fixed right-4 bottom-16 md:right-10 md:bottom-10 z-20"
  } bg-orange-600 shadow-inner  rounded-full p-1 w-[40px] h-[40px] text-white overflow-visible hidden md:flex items-center justify-center`} // Añadí 'flex items-center justify-center' para centrar el icono
>
  <CartIcon />
  {/* Chip con la cantidad */}
  {quantity > 0 && (
    <Chip className="absolute top-[-14px] right-[-8px] text-white" color="success">
      {quantity}
    </Chip>
  )}
</Button>


      {/* Botón para móvil */}

      <div
        id="cart-floating-icon-mobile"
        onClick={() => onOpen()}
        className="relative flex items-center justify-center cursor-pointer md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 fill-current text-gray-600"
          viewBox="0 0 512 512"
        >
          <path
            fill="#999999"
            d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
          />
        </svg>

        {/* Chip que muestra la cantidad, si es necesario */}
        {quantity > 0 && (
          <Chip  className="absolute top-[-18px] right-[-15px] text-white" color="success">
            {quantity}
          </Chip>
        )}
      </div>
    </div>
  );
};

export default CartFloatingButton;
