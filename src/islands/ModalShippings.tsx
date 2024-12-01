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

export default function ModalShippings({
  shipments,
  children,
}: {
  shipments: IShipment[];
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [citySelected, setCitySelected] = React.useState("Concordia");

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} style={{ maxWidth: "900px", width: "90%" }}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center text-4xl text-gray-600 font-bold">
                Medios de envío
              </ModalHeader>
              <ModalBody onClick={() => onclose()} className="text-xl text-gray-600">
                <SelectDropDownMenu
                  {...{
                    optionSelected: citySelected || "",
                    setOptionSelected: setCitySelected,
                    options: shipments.reduce(
                      (acc: string[], shipment: IShipment) => {
                        if (!acc.includes(shipment.city)) {
                          acc.push(shipment.city);
                        }
                        return acc;
                      },
                      []
                    ),
                  }}
                
                />

                <div>
                  <div
                    className="flex flex-col gap-6 mt-6"
                    style={{ margin: "0 auto" }}
                  >
                    {shipments
                      .filter(
                        (shipment: IShipment) => shipment.city === citySelected
                      )
                      .map((shipment: IShipment) => (
                        <div
                          className="flex bg-gray-100 flex-col hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white rounded-md p-6"
                          key={shipment.id}
                        >
                          <div className="flex justify-between items-center text-lg text-gray-600">
                            <div style={{ flex: 1 }}>
                              <div>
                                <p className="block px-4 py-2 font-semibold">
                                  {shipment.title}
                                </p>
                              </div>
                              <div>
                                <p className="block px-4 py-2">
                                  {shipment.description}
                                </p>
                              </div>
                            </div>
                            <div style={{ flex: 0.5 }}>
                              <p className="block text-lg px-4 py-2">
                                {formatCurrency(shipment.amount)}
                                {shipment.pay_for_km && (
                                  <p className="text-base">
                                    {" "}
                                    +{" "}
                                    {formatCurrency(
                                      shipment.amount_per_tn * shipment.kms
                                    )}{" "}
                                    por Tonelada
                                  </p>
                                )}
                              </p>
                            </div>
                          </div>
                          {shipment.free_from && (
                            <div className="self-end p-2">
                              <span className="text-base text-green-600">
                                Envio gratis desde{" "}
                                {formatCurrency(shipment.free_from_amount)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
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
