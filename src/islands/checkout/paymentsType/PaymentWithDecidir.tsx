import React, { useEffect } from "react";
import { setStep } from "../../../stores/checkout";
import {
  getCountTotalPriceWithIva,
  getCountTotalPriceWithIvaAndDiscount,
} from "../../../stores/cart";
import { formatCurrency } from "../../../utils/formatter";

export default function PaymentWithDecidir({
  apikey,
  urlDecidir,
}: {
  apikey: string;
  urlDecidir: string;
}) {
  const countTotalPriceWithIvaAndDiscount =
    getCountTotalPriceWithIvaAndDiscount();

  const countTotalPriceWithIva = getCountTotalPriceWithIva();

  const [tarjetType, setTarjetType] = React.useState(1);
  const [paymentMethodId, setPaymentMethodId] = React.useState(0);

  const sdkResponseHandler = (
    status: number,
    response: { error: string | any[]; id: any }
  ) => {
    console.log("respuesta", response);
    if (status == 422) {
      var step1Error = false;
      for (var i = 0; i < response.error.length; i++) {
        if (
          response.error[i].param.match(
            /^installment\d{1,2}|periodicity|installments|amount$/
          )
        ) {
          step1Error = true;
        }

        if (response.error[i].param == "expiry_date") {
          document
            .querySelectorAll('select[data-decidir^="card_expiration"]')
            .forEach((ddl) => ddl.classList.add("errorBox"));
        } else if (response.error[i].param == "amount") {
          document
            .querySelectorAll('input[data-decidir^="amount"]')
            .forEach((ipt) => ipt.classList.add("errorBox"));
        } else {
          let elem = document.querySelector(
            `[data-decidir="${response.error[i].param}"]`
          );
          if (elem) {
            elem.classList.add("errorBox");
          }
        }
      }

      //   if (step1Error) {
      //     goToWizardStep(1);
      //   }
    } else {
      const paymentToken = document.querySelector("#paymentToken");
      if (paymentToken) {
        /** @ts-ignore */
        paymentToken.value = response.id;
        setStep(5);
      }
    }
  };

  const addEvent = (
    el: Element,
    eventName: string,
    handler: { call: (arg0: any) => void }
  ) => {
    if (el.addEventListener) {
      /** @ts-ignore */
      el.addEventListener(eventName, handler);
    } else {
      /** @ts-ignore */
      el.attachEvent("on" + eventName, function () {
        handler.call(el);
      });
    }
  };

  useEffect(() => {
    /** @ts-ignore */
    const { Decidir } = window;
    if (!Decidir) return;
    const decidir = new Decidir(urlDecidir, true);
    decidir.setPublishableKey(apikey);
    const payform = document.querySelector("#payform");

    const sendForm = (event: { preventDefault: () => void }) => {
      event.preventDefault();

      document
        .querySelectorAll("[data-decidir]")
        .forEach((el) => el.classList.remove("errorBox"));

      decidir.createToken(payform, sdkResponseHandler);

      return false;
    };

    var input = document.getElementById("CardNumber");

    if (input)
      input.addEventListener("input", function (e) {
        var value = e.target.value;

        // Eliminar todos los caracteres que no sean dígitos
        var cleanValue = value.replace(/\D/g, "");

        // Agregar espacios cada 4 dígitos
        var formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, "$1 ");

        // Establecer el valor formateado en el campo de entrada
        if (input) input.value = formattedValue;
      });

    if (payform) {
      addEvent(payform, "submit", sendForm);
    }
    /** @ts-ignore */
  }, [window["Decidir"]]);

  return (
    <div className="card-form">
      <div id="formPay" className="card-form__inner">
        {/* Crédito o Debito */}
        <div className="card-input">
          <label htmlFor="CardNumber" className="card-input__label">
            Tipo de tarjeta
          </label>
          <select
            className="card-input__input"
            defaultValue={1}
            onChange={(e) => {
              setTarjetType(parseInt(e.target.value));
            }}
          >
            <option value="1">Crédito</option>
            <option value="2">Débito</option>
          </select>
        </div>

        {/* Tarjetas */}

        <div className="card-input">
          <label htmlFor="CardNumber" className="card-input__label">
            Seleccionar tarjeta
          </label>

          {tarjetType === 2 ? (
            <select
              id="payment_method_id"
              data-decidir="payment_method_id"
              className="card-input__input"
            >
              <option value="31">Visa Debito</option>
              <option value="106">Maestro</option>
            </select>
          ) : (
            <select
              id="payment_method_id"
              data-decidir="payment_method_id"
              className="card-input__input"
              onChange={(e) => {
                setPaymentMethodId(parseInt(e.target.value));
              }}
            >
              <option value="1">Visa</option>
              <option value="104">Mastercard</option>
              <option value="111">American Express</option>
              <option value="24">Naranja</option>
            </select>
          )}
        </div>

        <div className="card-input">
          <label htmlFor="CardNumber" className="card-input__label">
            Cantidad de cuotas
          </label>
          <select
            id="installments"
            data-decidir="installments"
            className="card-input__input"
          >
            <option value="1">
              1 cuota de {formatCurrency(countTotalPriceWithIvaAndDiscount)}
            </option>
            <option value="3">
              3 cuotas de {formatCurrency((countTotalPriceWithIva * 0.85) / 3)}{" "}
              - Total{` ${formatCurrency(countTotalPriceWithIva * 0.85)}`}
            </option>
            <option value="6">
              6 cuotas de {formatCurrency((countTotalPriceWithIva * 0.9) / 6)} -
              Total{` ${formatCurrency(countTotalPriceWithIva * 0.9)}`}
            </option>
            {paymentMethodId !== 24 && (
              <option value="12">
                12 cuotas de {formatCurrency(countTotalPriceWithIva / 12)} -
                Total
                {` ${formatCurrency(countTotalPriceWithIva)}`}
              </option>
            )}
          </select>
        </div>

        <form id="payform">
          <input type="hidden" name="paymentToken" id="paymentToken" value="" />

          <div id="card_data">
            <div id="divShowBin" style={{ display: "none" }}>
              Bin: <span id="spnCardBin" style={{ fontWeight: "bold" }}></span>
            </div>
            <div id="divShowMarcaTarjeta" style={{ display: "none" }}>
              Marca Tarjeta:{" "}
              <span id="spnMarcaTarjeta" style={{ fontWeight: "bold" }}></span>
            </div>

            <div className="card-form__row" style={{ gap: "10px" }}>
              <div className="card-input">
                <label htmlFor="CardNumber" className="card-input__label">
                  N&uacute;mero de Tarjeta
                </label>
                <div id="boxCardNumber">
                  <input
                    type="text"
                    id="CardNumber"
                    data-decidir="card_number"
                    placeholder="•••• •••• •••• ••••"
                    autoComplete="off"
                    className="card-input__input"
                    size={20}
                    maxLength={19}
                  />
                </div>
              </div>

              <div id="divCardExpirationDateDDLs" className="card-input">
                <label
                  htmlFor="CardExpirationMonth"
                  className="card-input__label"
                >
                  Mes
                </label>
                <select
                  id="CardExpirationMonth"
                  data-decidir="card_expiration_month"
                  className="card-input__input"
                >
                  <option>MM</option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
              <div id="divCardExpirationDateDDLs" className="card-input">
                <label
                  htmlFor="CardExpirationMonth"
                  className="card-input__label"
                >
                  Año
                </label>
                <select
                  id="CardExpirationYear"
                  data-decidir="card_expiration_year"
                  className="card-input__input"
                >
                  <option>AAAA</option>
                  <option value="24">2024</option>
                  <option value="25">2025</option>
                  <option value="26">2026</option>
                  <option value="27">2027</option>
                  <option value="28">2028</option>
                  <option value="29">2029</option>
                  <option value="30">2030</option>
                  <option value="31">2031</option>
                  <option value="32">2032</option>
                  <option value="33">2033</option>
                  <option value="34">2034</option>
                  <option value="35">2035</option>
                </select>
              </div>
            </div>

            <div className="card-input">
              <label htmlFor="CardHolderName" className="card-input__label">
                Nombre (Iguales a la tarjeta)
              </label>
              <input
                type="text"
                id="CardHolderName"
                data-decidir="card_holder_name"
                placeholder="Ingrese su nombre"
                className="card-input__input"
              />
            </div>

            <div>
              <div className="card-form__row" style={{ gap: "16px" }}>
                <div className="card-input">
                  <label
                    htmlFor="CardHolderIdentification"
                    className="card-input__label"
                  >
                    DNI
                  </label>
                  <input
                    type="text"
                    data-decidir="card_holder_doc_number"
                    size={20}
                    id="CardHolderIdentification"
                    placeholder="••••••••"
                    maxLength={10}
                    className="card-input__input"
                  />
                </div>

                <div style={{ float: "left" }} className="card-input">
                  <label
                    htmlFor="CardSecurityCode"
                    className="card-input__label"
                  >
                    CVC
                  </label>
                  <input
                    type="text"
                    size={3}
                    maxLength={3}
                    id="CardSecurityCode"
                    data-decidir="security_code"
                    placeholder="•••"
                    className="card-input__input"
                  />
                  <button
                    id="CardSecurityCodeHelper"
                    type="button"
                    tabIndex={-1}
                    style={{ display: "none" }}
                  >
                    ?
                  </button>
                </div>
              </div>
            </div>

            <div className="row" style={{ display: "block" }}>
              <div className="card-input" style={{ display: "none" }}>
                <label htmlFor="TipoDni" className="card-input__label">
                  Tipo Doc.
                </label>
                <select
                  id="CardHolderIdentificationType"
                  data-decidir="card_holder_doc_type"
                  className="card-input__input"
                >
                  {/* <option value=""></option> */}
                  <option value="dni">DNI</option>
                  <option value="lc">LC</option>
                </select>
              </div>
            </div>
            <div
              className={`relative hover:cursor-pointer p-3 w-full bg-[#2196F3] rounded text-center`}
            >
              <input
                type="submit"
                name=""
                id="ButtonPay"
                className={`w-full text-white text-md font-semibold`}
                value="Continuar"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
