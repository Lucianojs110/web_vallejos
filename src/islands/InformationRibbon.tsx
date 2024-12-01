import React from "react";
import ModalPaymentMethods from "./ModalPaymentMethods";
import ModalShippings from "./ModalShippings";
import type { IShipment } from "../types/IShipment";

const InformationRibbon = ({ shipments }: { shipments: IShipment[] }) => (
  <div className="bg-yellow-400 w-[100%] p-1 rounded-md">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center content-center justify-center justify-items-center">
      
      <ModalPaymentMethods>
        <span
          className={`flex gap-1 items-center text-base text-left text-white-800 p-2 cursor-pointer`}
        >
          <i>
            <img
              src="/images/cards/bank.svg"
              alt="Metodos de pago"
              className={`w-6 h-6`}
              width="40"
              height="40"
            />{" "}
          </i>
          Formas de pago
        </span>
      </ModalPaymentMethods>

      <ModalShippings shipments={shipments}>
        <span
          className={`flex gap-1 items-center text-base text-left text-white-800 p-2 cursor-pointer`}
        >
          <i>
            <img
              src="/images/truck.svg"
              alt="Camión"
              className={`w-6 h-6`}
              width="40"
              height="40"
            />{" "}
          </i>
          Medios de envio
        </span>
      </ModalShippings>

      <div className="hidden sm:inline">
        <CalculatorLink />
      </div>
    </div>

    <div className="inline-flex sm:hidden items-center content-center justify-center justify-items-center w-[100%]">
      <CalculatorLink />
    </div>
  </div>
);

const CalculatorLink = () => {
  return (
    <a href="/calculadora">
      <span
        className={`flex gap-1 text-base text-left text-white-800 p-2 cursor-pointer`}
      >
        <i>
          <img
            src="/images/calculator.svg"
            alt="Camión"
            className={`w-6 h-6`}
            width="40"
            height="40"
          />{" "}
        </i>
        Calculadora de Materiales
      </span>
    </a>
  );
};

export default InformationRibbon;
