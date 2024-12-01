import React from "react";
import PaymentWithDecidir from "./paymentsType/PaymentWithDecidir";
import { formatCurrency } from "../../utils/formatter";
import { getCountTotalPriceWithIvaAndDiscount } from "../../stores/cart";

import PaymentWithCash from "./paymentsType/PaymentWithCash";
import PaymentWithTransferencia from "./paymentsType/PaymentWithTransferencia";
import PaymentWithCuentaCorriente from "./paymentsType/PaymentWithCuentaCorriente";
import { getCheckout } from "../../stores/checkout";
const PaymentStep = ({
  data,
}: {
  data: { apiKey: string; urlDecidir: string };
}) => {
  const countTotalPriceWithIvaAndDiscount =
    getCountTotalPriceWithIvaAndDiscount();

  const checkout = getCheckout();

  console.log(checkout);

  const user: any = {};

  const [paymentMethod, setPaymentMethod] = React.useState("tarjeta");

  return (
    <div className="selector-pyment-method">
      <div className="card-form__inner">
        <p className="card-input__label">
          Total a Pagar{" "}
          <span className={`font-bold`}>
            {formatCurrency(countTotalPriceWithIvaAndDiscount)}
          </span>
        </p>

        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <div
            className="inline-flex items-center cursor-pointer"
            onClick={() => setPaymentMethod("efectivo")}
          >
            <label
              className="relative flex cursor-pointer items-center rounded-full p-3"
              htmlFor="efectivo"
              data-ripple-dark="true"
            >
              <input
                id="efectivo"
                name="paymentMethod"
                type="radio"
                checked={paymentMethod === "efectivo"}
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-yellow-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-yellow-500 checked:before:bg-yellow-500 hover:before:opacity-10"
              />
              <div
                className={`pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-yellow-500  transition-opacity ${
                  paymentMethod === "efectivo" ? "opacity-100" : "opacity-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </div>
            </label>
            <label
              className="mt-px cursor-pointer select-none font-light text-gray-700"
              htmlFor="efectivo"
            >
              Pago en efectivo
            </label>
          </div>
          <div
            className="inline-flex items-center cursor-pointer"
            onClick={() => setPaymentMethod("tarjeta")}
          >
            <label
              className="relative flex cursor-pointer items-center rounded-full p-3"
              htmlFor="tarjeta"
              data-ripple-dark="true"
            >
              <input
                id="tarjeta"
                name="paymentMethod"
                type="radio"
                checked={paymentMethod === "tarjeta"}
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-yellow-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-yellow-500 checked:before:bg-yellow-500 hover:before:opacity-10"
              />
              <div
                className={`pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-yellow-500  transition-opacity ${
                  paymentMethod === "tarjeta" ? "opacity-100" : "opacity-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </div>
            </label>
            <label
              className="mt-px cursor-pointer select-none font-light text-gray-700"
              htmlFor="tarjeta"
            >
              Tarjeta
            </label>
          </div>
          <div
            className="inline-flex items-center cursor-pointer"
            onClick={() => setPaymentMethod("transferencia")}
          >
            <label
              className="relative flex cursor-pointer items-center rounded-full p-3"
              htmlFor="transferencia"
              data-ripple-dark="true"
            >
              <input
                id="transferencia"
                name="paymentMethod"
                type="radio"
                checked={paymentMethod === "transferencia"}
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-yellow-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-yellow-500 checked:before:bg-yellow-500 hover:before:opacity-10"
              />
              <div
                className={`pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-yellow-500  transition-opacity ${
                  paymentMethod === "transferencia"
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </div>
            </label>
            <label
              className="mt-px cursor-pointer select-none font-light text-gray-700"
              htmlFor="transferencia"
            >
              Transferencia
            </label>
          </div>
          {user?.userData?.cuentaCorriente === "S" && (
            <div
              className="inline-flex items-center cursor-pointer"
              onClick={() => setPaymentMethod("cc")}
            >
              <label
                className="relative flex cursor-pointer items-center rounded-full p-3"
                htmlFor="cc"
                data-ripple-dark="true"
              >
                <input
                  id="cc"
                  name="paymentMethod"
                  type="radio"
                  checked={paymentMethod === "cc"}
                  className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-yellow-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-yellow-500 checked:before:bg-yellow-500 hover:before:opacity-10"
                />
                <div
                  className={`pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-yellow-500  transition-opacity ${
                    paymentMethod === "cc" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                  </svg>
                </div>
              </label>

              <label
                className="mt-px cursor-pointer select-none font-light text-gray-700"
                htmlFor="cc"
              >
                Cuenta Corriente
              </label>
            </div>
          )}
        </div>
      </div>

      <div>
        {paymentMethod === "tarjeta" && (
          <PaymentWithDecidir
            apikey={data.apiKey}
            urlDecidir={data.urlDecidir}
          />
        )}

        {paymentMethod === "efectivo" && <PaymentWithCash />}

        {paymentMethod === "transferencia" && <PaymentWithTransferencia />}

        {paymentMethod === "cc" && <PaymentWithCuentaCorriente />}
      </div>
    </div>
  );
};

export default PaymentStep;
