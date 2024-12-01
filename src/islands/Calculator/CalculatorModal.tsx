import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ScrollShadow,
} from "@nextui-org/react";
import type { IColor } from "../../types/IColor";
import ChevronUpIcon from "../../icons/ChevronUpIcon";
import {addProductToCart} from "../../stores/cart.ts";
import {CALCULATOR_STEP} from "../../config/constants.ts";

const CalculatorModal = ({
  calculator,
  colors,
                           setCalculator
}: {
  calculator: any;
  colors: IColor[];
  setCalculator: any
}) => {
  if (!calculator) {
    return <div>Loading...</div>;
  }

  const { structureList, totalPrice } = calculator;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = () => {
    if (structureList.length === 0) {
      return;
    }
    onOpen();
  };

  if (structureList.length === 0) return null
  return (
    <>
      <div
        className="visible md:hidden fixed bottom-0 left-0 right-0 pb-8 bg-lime-300"
        onClick={() => handleOpen()}
      >
        <div className="shadow-md text-center flex flex-row justify-between p-2">
          <div></div>
          <div>
            <h3 className="text-lg">Detalle de calculadora</h3>
          </div>
          <ChevronUpIcon />
        </div>

          <div className="text-center pt-6">
            <span className="text-lg">{totalPrice}</span>
          </div>

      </div>
      <Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detalle de calculadora
              </ModalHeader>
              <ModalBody>
                <ScrollShadow className="p-1 mh-[300px]">
                  {structureList.map((structure, i) => (
                    <div
                      key={`${structure.structure_id}-${i}`}
                      className="flex flex-col border-b-orange-200 border-b-1 p-2"
                    >
                      <div>
                        <span className="text-lg text-gray-600">{`${structure.structure_name} \t ${structure.width} x ${structure.height}`}</span>
                      </div>
                      {structure.type === "pvc" ? (
                        <div className="flex flex-row g-4">
                          <div>
                            <span className="text-sm text-slate-600 pr-2">{`${
                              colors.find((c) => c.id === structure.color)?.name
                            } `}</span>
                          </div>
                          <div
                            style={{
                              background: colors.find(
                                (c) => c.id === structure.color
                              )?.hex,
                              width: "20px",
                              height: "20px",
                            }}
                          ></div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <div className="mt-4 p-3 text-center flex flex-col gap-3 w-[100%]">
                  <div className="text-center">
                    <span className="text-lg">{totalPrice}</span>
                  </div>
                  <div>
                    <Button color="primary" size="lg"
                            onClick={(e) => {
                              calculator.productList.forEach((product: any[], i) => {
                                addProductToCart(product, product.quantity)
                              })
                              // END_SCREEN
                              fetch("/api/calculator", {
                                method: "POST",
                                body: JSON.stringify({
                                  step: CALCULATOR_STEP.END_SCREEN
                                }),
                              }).then((res) => {
                                res.json().then((data) => {
                                  setCalculator({ ...calculator, ...data });
                                  const buttonModalCart = document.getElementById("cart-floating-button");
                                  buttonModalCart?.click();
                                });
                              });
                              e.preventDefault();
                            }}
                    >
                      Cargar al carrito
                    </Button>
                  </div>
                  <div>
                    <span>O segui cargando estructuras</span>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CalculatorModal;
