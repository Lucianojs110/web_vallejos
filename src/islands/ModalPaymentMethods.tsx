import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import SelectDropDownMenu from "./DropDown/Dropdown";
import type { IShipment } from "../types/IShipment";
import { formatCurrency } from "../utils/formatter";

export default function ModalPaymentMethods({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [citySelected, setCitySelected] = React.useState("Concordia");
  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Metodos de pago
              </ModalHeader>
              <ModalBody onClick={() => onclose()}>
                <div>
                  <div className={`flex flex-col gap-2`}>
                    <p className={`text-base mt-3`}>Tarjetas de crédito</p>
                    <h4 className={`text-sm font-light`}>
                      Hasta 12 cuotas <span className={`text-xs`}>(1)</span>
                    </h4>
                    <div className={`flex items-center gap-3`}>
                      <img
                        src="/images/cards/visa.svg"
                        alt="Tarjeta de crédito visa"
                        className={`w-12 h-auto`}
                        width="40"
                        height="40"
                      />
                      <img
                        src="/images/cards/american.svg"
                        alt="Tarjeta de crédito visa"
                        className={`w-12 h-auto`}
                        width="40"
                        height="40"
                      />
                      <img
                        src="/images/cards/master.svg"
                        alt="Tarjeta de crédito visa"
                        className={`w-12 h-auto`}
                        width="40"
                        height="40"
                      />
                    </div>
                    <h4 className={`text-sm font-light`}>6 cuotas</h4>
                    <div className={`flex items-center gap-3`}>
                      <img
                        src="/images/cards/naranja.svg"
                        alt="Tarjeta de crédito visa"
                        className={`w-12 h-auto`}
                        width="40"
                        height="40"
                      />
                    </div>
                    <h4 className={`text-base mt-3`}>Tarjetas de débito</h4>
                    <div className={`flex items-center gap-3 flex-wrap`}>
                      <img
                        src="/images/cards/visa-debito.svg"
                        alt="Tarjeta de débito visa"
                        className={`w-12 h-auto`}
                        width="40"
                        height="40"
                      />
                      <img
                        src="/images/cards/maestro.svg"
                        alt="Tarjeta de débito maestro"
                        className={`w-12 h-auto`}
                        width="40"
                        height="40"
                      />
                      <img
                        src="/images/cards/cabal-debito.svg"
                        alt="Tarjeta de débito cabal"
                        className={`w-12 h-auto`}
                        width="40"
                        height="40"
                      />
                    </div>
                    <h4 className={`text-base mt-3`}>
                      Efectivo:{" "}
                      <span className={`text-base mt-3`}>
                        {" "}
                        En sucursal o al recibir el pedido
                      </span>
                    </h4>
                    <h4 className={`text-base mt-3`}>Transferencia</h4>
                    <div className={`flex items-center gap-2`}>
                      <img
                        src="/images/cards/bank.svg"
                        alt="Tarjeta de débito cabal"
                        className={`w-12 h-auto`}
                        width="40"
                        height="40"
                      />
                    </div>
                  </div>
                  <div className={`font-extralight text-sm mt-3`}>
                    <p>(1) Tarjetas bancarizadas</p>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
