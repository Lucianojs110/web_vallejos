import React from "react";
import { getCountTotalPriceWithIva } from "../../../stores/cart";
import { formatCurrency } from "../../../utils/formatter";
import NextButton from "../NextButton";

export default function PaymentWithCuentaCorriente() {
  const countTotalPriceWithIva = getCountTotalPriceWithIva();
  const user: any = {};

  return (
    <div className="card-form" style={{ textAlign: "center" }}>
      <div id="formPay" className="card-form__inner">
        <div className="card-input">
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.3rem" }}
          >
            Pagar con cuenta corriente
          </label>
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.1rem" }}
          >
            Limite hábilitado: {formatCurrency(user?.userData?.credito || 0)}
          </label>
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.1rem" }}
          >
            Deuda pendiente: {formatCurrency(user?.userData?.deuda || 0)}
          </label>
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.1rem", fontWeight: "bold" }}
          >
            Crédito disponible:{" "}
            {formatCurrency(
              (user?.userData?.credito || 0) - (user?.userData?.deuda || 0)
            )}
          </label>
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.2rem" }}
          >
            Monto a debitar
          </label>
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            {formatCurrency(countTotalPriceWithIva)}
          </label>
        </div>

        <NextButton step={5} onClick={() => {}} />
      </div>
    </div>
  );
}
