import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalContent } from "@nextui-org/react";

export default function PaymentMethodModal({
  paymentMethods = [], // Asignamos un valor por defecto vacío
}: {
  paymentMethods?: { title: string; id: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        <span className="text-xl font-bold">VER TODOS LOS MEDIOS DE PAGO</span>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        style={{ maxWidth: "900px", width: "90%" }}
      >
        <ModalContent>
          <ModalBody
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div className="mt-4  rounded p-1">
              <h2 className="text-3xl text-center ont-bold text-gray-500">
                Medios de pago
              </h2>
              <br />
              <div className="flex flex-col gap-2">
                {/* Contenedor de las imágenes de las tarjetas */}
                <div className="flex gap-3 justify-center items-center">
                  <img
                    src="/images/cards/cuota.png"
                    alt="Tarjeta de crédito visa"
                    className="w-15 h-10"
                  />

                  {/* Barra vertical */}
                  <div className="border-l border-gray-300 h-full mx-4"></div>

                  {/* Contenedor del texto a la derecha */}
                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-gray-500">
                      EN 3, 6 Y 12 CUOTAS FIJAS CON TARJETAS DE CRÉDITO
                    </p>
                    <span className="text-md text-gray-500">
                      A PRECIO DE LISTA (no se hace el descuento por pago
                      contado). Cada producto tiene precio de contado y de
                      lista, en los presupuestos figuran los dos precios,
                      contado y para crédito.
                    </span>
                  </div>
                </div>

                {/* Barra separadora sutil */}
                <hr className="my-4 border-t border-gray-200" />

                {/* Contenedor de las imágenes de las tarjetas */}
                <div className="flex gap-3 justify-center items-center">
                  <img
                    src="/images/cards/visa.svg"
                    alt="Tarjeta de crédito visa"
                    className="w-15 h-10"
                  />
                  <img
                    src="/images/cards/american.svg"
                    alt="Tarjeta de crédito American Express"
                    className="w-15 h-10"
                  />
                  <img
                    src="/images/cards/master.svg"
                    alt="Tarjeta de crédito Mastercard"
                    className="w-15 h-10"
                  />

                  {/* Barra vertical */}
                  <div className="border-l border-gray-300 h-full mx-4"></div>

                  {/* Contenedor del texto a la derecha */}
                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-gray-500">
                      HASTA 12 CUOTAS FIJAS
                    </p>
                    <span className="text-md text-gray-500">
                      Tarjetas de crédito Visa, Mastercard, Nativa, Cabal y AMEX
                      bancarizadas A PRECIO DE LISTA (no se hace descuento por
                      pago contado) cada producto tiene precio de contado y de
                      lista, en los presupuestos figuran los dos precios contado
                      y para crédito.
                    </span>
                  </div>
                </div>

                {/* Barra separadora sutil */}
                <hr className="my-4 border-t border-gray-200" />

                <div className="flex gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/cards/naranja.svg"
                      alt="Tarjeta de crédito naranja"
                      className="w-40 h-20"
                    />
                  </div>

                  {/* Barra vertical */}
                  <div className="border-l border-gray-300 h-full mx-4"></div>

                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-gray-500">
                      EN 6 CUOTAS FIJAS CON NARANJA X
                    </p>
                    <span className="text-md text-gray-500">
                      A PRECIO DE LISTA (no se hace el descuento por pago
                      contado). Cada producto tiene precio de contado y de
                      lista, en los presupuestos figuran los dos precios,
                      contado y para crédito.
                    </span>
                  </div>
                </div>

                {/* Barra separadora sutil */}
                <hr className="my-4 border-t border-gray-200" />

                <div className="flex items-center gap-4 p-4">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/cards/visa-debito.svg"
                        alt="Tarjeta de débito visa"
                        className="w-15 h-10"
                      />
                      <img
                        src="/images/cards/maestro.svg"
                        alt="Tarjeta de débito maestro"
                        className="w-15 h-10"
                      />
                      <img
                        src="/images/cards/cabal-debito.svg"
                        alt="Tarjeta de débito cabal"
                        className="w-15 h-10"
                      />
                    </div>

                    {/* Barra vertical */}
                    <div className="border-l border-gray-300 h-full mx-4"></div>

                    <div className="flex flex-col">
                      <p className="text-lg font-bold text-gray-500">
                        TARJETAS DE DEBITO
                      </p>
                      <span className="text-md text-gray-500">
                        Tarjetas de crédito Visa, Mastercard y AMEX
                        bancarizadas.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barra separadora sutil */}
                <hr className="my-4 border-t border-gray-200" />

                <div className="flex items-center gap-4 p-4">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/cards/banco.png"
                        alt="Tarjeta de débito visa"
                        className="w-15 h-10"
                      />
                    </div>

                    {/* Barra vertical */}
                    <div className="border-l border-gray-300 h-full mx-4"></div>

                    <div className="flex flex-col">
                      <p className="text-lg font-bold text-gray-500">
                        TRANSFERENCIA BANCARIA
                      </p>
                      <span className="text-md text-gray-500">
                        Banco: 191 - Credicoop - SUC: 141 - Concordia.
                      </span>
                      <span className="text-md text-gray-500">
                        Cuenta: 004450/5
                      </span>
                      <span className="text-md text-gray-500">
                        Denominación: VALLEJOS CRISTIAN DAVID
                      </span>
                      <span className="text-md text-gray-500">
                        CBU: 1910141755014100445050
                      </span>
                      <span className="text-md text-gray-500">
                        Alias: VALLEJOSMATERIALES{" "}
                      </span>
                      <span className="text-md text-gray-500">
                        No realice pagos sin tener nota de venta o factura. Los
                        presupuestos cambian sin previo aviso.{" "}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barra separadora sutil */}
                <hr className="my-4 border-t border-gray-200" />

                <div className="flex items-center gap-4 p-4">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/cards/efectivo.png"
                        alt="Tarjeta de débito visa"
                        className="w-15 h-10"
                      />
                    </div>
                    {/* Barra vertical */}
                    <div className="border-l border-gray-300 h-full mx-4"></div>
                    <div className="flex flex-col">
                      <p className="text-lg font-bold text-gray-500">
                        EFECTIVO
                      </p>
                      <span className="text-md text-gray-500">
                        En sucursal o al recibir el pedido. En Concordia, puede
                        hacer su compra y pagar en efectivo al recibir el pedido
                        dentro de las 24 hs.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barra separadora sutil */}
                <hr className="my-4 border-t border-gray-200" />

                <div className="flex items-center gap-4 p-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col">
                      <p className="text-lg font-bold text-gray-500 ">
                        SEGURIDAD EN PAGOS CON TARJETAS
                      </p>
                      <span className="text-md text-gray-500">
                        Los pagos con tarjetas requieren la validación de la
                        identidad del titular de la tarjeta según Art. 37 de la
                        Ley 25067. Por lo que SOLO PUEDE RECIBIR EL PEDIDO EL
                        TITULAR DE LA TARJETA, DEBE PRESENTAR DNI, COMPROBANTE
                        DE COMPRA Y LA TARJETA UTILIZADA. O no se entregará el
                        pedido.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col">
                      <p className="text-lg font-bold text-gray-500">
                        INFORMAR UN PAGO
                      </p>
                      <span className="text-md text-gray-500">
                        Para informar un pago por transferencia se debe enviar
                        por WhatsApp el comprobante de pago y el Nº de Nota de
                        Venta o Factura que se está abonando. La NOTA DE VENTA
                        se descarga automáticamente en el dispositivo que se
                        hizo la compra y LA FACTURA se envía al correo indicado
                        al hacer la compra.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
