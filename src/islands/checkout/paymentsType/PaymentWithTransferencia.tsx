import React from "react";
import { getCountTotalPriceWithIvaAndDiscount } from "../../../stores/cart";
import { formatCurrency } from "../../../utils/formatter";
import NextButton from "../NextButton";

export default function PaymentWithTransferencia() {
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
            Pago con transferencia el monto de{" "}
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
            style={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            CBU: 1910141755014100445050
          </label>
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.3rem", fontWeight: "bold" }}
          >
            Banco Credicoop
          </label>
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.3rem" }}
          >
            La transferencia debe realizarse dentro de las siguientes 24hs.
          </label>
        </div>
        <div className="card-input">
          <label
            htmlFor="CardNumber"
            className="card-input__label"
            style={{ fontSize: "1.3rem" }}
          >
            Deberá enviar el comprobante de la transferencia al siguiente
          </label>
          <a
            href={`https://wa.me/${"3454156077"}`}
            target="_blank"
            rel="noreferrer"
          >
            <label
              htmlFor="CardNumber"
              className="card-input__label hover:cursor-pointer"
              style={{ fontSize: "1.3rem", fontWeight: "bold" }}
            >
              whatsapp: 11 1234 5678
            </label>
          </a>
        </div>
        <NextButton step={5} onClick={() => {}} />
      </div>
    </div>
  );
}
