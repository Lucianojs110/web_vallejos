import React from "react";
import { getCountTotalPriceWithIvaAndDiscount } from "../../../stores/cart";
import { formatCurrency } from "../../../utils/formatter";
import NextButton from "../NextButton";

export default function PaymentWithCash() {
  const countTotalPriceWithIvaAndDiscount =
    getCountTotalPriceWithIvaAndDiscount();
  return (
    <div className="card-form" style={{ textAlign: "center" }}>
      <div id="formPay" className="card-form__inner">
        <div className="card-input">
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.3rem" }}
          >
            Pago en efectivo el monto de{" "}
          </label>
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.3rem" }}
          >
            {formatCurrency(countTotalPriceWithIvaAndDiscount)}
          </label>
        </div>
        <div className="card-input">
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.3rem" }}
          >
            El pago debe realizarse dentro de las siguientes 24hs hábiles.
          </label>
        </div>
        <NextButton step={5} onClick={() => {}} />
      </div>
    </div>
  );
}
