import React, { useEffect, useState } from "react";
import { CALCULATOR_ACTIONS, CALCULATOR_STEP } from "../../config/constants";
import CalculatorList from "./CalculatorList";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { formatCurrency } from "../../utils";
import type { IColor } from "../../types/IColor";
import CalculatorModal from "./CalculatorModal";
import {addProductToCart} from "../../stores/cart";

const CalculatorLayout = ({ colors }: { colors: IColor[] }) => {
  const [calculator, setCalculator] = useState({});
  const [productsSelected, setProductSelected] = useState({});
  const [color, setColor] = useState(null);

  const [nextDisabled, setNextDisabled] = useState(false);

  const getCurrentCalculator = () =>
    fetch("/api/calculator")
      .then((res) => res.json())
      .then((data: any) => {
        setCalculator(data);
      });

  useEffect(() => {
    getCurrentCalculator();
  }, []);

  useEffect(() => {
    if (calculator) {
      if (
        calculator.step === CALCULATOR_STEP.SELECT_PRODUCT_SCREEN &&
        calculator.action === CALCULATOR_ACTIONS.ADD_MULTIPLE_PRODUCT
      ) {
        const optionsSelected = {};

        calculator?.data?.productList.forEach((p: any[], i) => {
          optionsSelected[`opt-${i}`] = p.productsOptions[0].code;
        });
        setProductSelected(optionsSelected);
      }
    }
  }, [calculator]);

  if (Object.keys(calculator).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CalculatorModal calculator={calculator} colors={colors} setCalculator={setCalculator}/>
      <div className="flex flex-row gap-4 md:p-4 p-1 justify-center">
        <div className="flex md:flex-[0.75] bg-white p-2">
          <CalculatorList
            calculatorList={calculator.structures}
            selectStructure={(id: string) => {
              fetch("/api/calculator", {
                method: "POST",
                body: JSON.stringify({
                  step: CALCULATOR_STEP.STRUCTURES_SCREEN,
                  action: CALCULATOR_ACTIONS.ADD_STRUCTURE,
                  data: {
                    structure_id: id,
                  },
                }),
              }).then((res) => {
                res.json().then((data) => {
                  setCalculator({ ...calculator, ...data });
                });
              });
            }}
          />
        </div>

        <div className="hidden sm:inline-flex flex-[0.25] bg-white p-3 relative h-[500px]">
          <CalculatorDetail calculator={calculator} colors={colors} setCalculator={setCalculator} />
        </div>

        {(calculator &&
          calculator.step === CALCULATOR_STEP.SELECT_PRODUCT_SCREEN &&
          calculator.action === CALCULATOR_ACTIONS.SELECT_MASILLA) ||
        (calculator &&
          calculator.step === CALCULATOR_STEP.SELECT_PRODUCT_SCREEN &&
          calculator.action === CALCULATOR_ACTIONS.SELECT_CINTA) ? (
          <Modal isOpen={true} onClose={() => getCurrentCalculator()}>
            <ModalContent className="p-6">
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-center">Seleccionar opción</h3>
              </ModalHeader>
              <ModalBody className="relative">
                <ScrollShadow className="w-[100%] min-h-[100px] flex flex-col gap-2 md:p-6">
                  {calculator?.data?.productList.map((product: any) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        fetch("/api/calculator", {
                          method: "POST",
                          body: JSON.stringify({
                            step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
                            action: CALCULATOR_ACTIONS.ADD_PRODUCT,
                            data: {
                              product_id: product.id,
                            },
                          }),
                        }).then((res) => {
                          res.json().then((data) => {
                            setCalculator({ ...calculator, ...data });
                          });
                        });
                      }}
                      className="bg-white shadow-md hover:shadow-lg rounded-md h-[80px] hover:cursor-pointer p-2 content-center"
                    >
                      <p className="text-md flex justify-center items-center">
                        {product.title}
                      </p>
                    </div>
                  ))}
                </ScrollShadow>
              </ModalBody>
            </ModalContent>
          </Modal>
        ) : null}

        {calculator &&
        calculator.step === CALCULATOR_STEP.SELECT_PRODUCT_SCREEN &&
        calculator.action === CALCULATOR_ACTIONS.ADD_MULTIPLE_PRODUCT ? (
          <Modal isOpen={true} onClose={() => getCurrentCalculator()}>
            <ModalContent className="md:p-6">
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-center">Seleccionar productos</h3>
              </ModalHeader>
              <ModalBody className="relative">
                <ScrollShadow className="w-[100%] min-h-[100px] flex flex-col gap-3 items-center">
                  {calculator?.data?.productList.map((p: any[], i) => (
                    <Select
                      key={`opt-${i}`}
                      items={p.productsOptions}
                      label={p.label}
                      placeholder={`Seleccionar ${p.label}`}
                      labelPlacement="outside"
                      className="max-w-md"
                      name={`opt-${i}`}
                      defaultValue={p.productsOptions[0].code}
                      defaultSelectedKeys={[p.productsOptions[0].code]}
                      onChange={(value) => {
                        if (!value.target.value) {
                          return;
                        }
                        setProductSelected({
                          ...productsSelected,
                          [value.target.name]: value.target.value,
                        });
                      }}
                    >
                      {(product: any) => (
                        <SelectItem
                          key={product.code}
                          textValue={product.name}
                          value={product.code}
                        >
                          <div className="flex gap-2 items-center">
                            <Avatar
                              alt={product.name}
                              className="flex-shrink-0"
                              size="lg"
                              src={product.mainImage}
                            />
                            <div className="flex flex-col">
                              <span className="text-small">{product.name}</span>
                              <span className="text-tiny text-default-400">
                                {formatCurrency(
                                  product.priceWithIvaAndDiscount
                                )}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                  ))}
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <button
                  disabled={nextDisabled}
                  onClick={() => {
                    setNextDisabled(true);
                    fetch("/api/calculator", {
                      method: "POST",
                      body: JSON.stringify({
                        step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
                        action: CALCULATOR_ACTIONS.ADD_MULTIPLE_PRODUCT,
                        data: {
                          products_id: Object.keys(productsSelected).map(
                            (p) => productsSelected[p]
                          ),
                        },
                      }),
                    }).then((res) => {
                      res.json().then((data) => {
                        setCalculator({ ...calculator, ...data });
                      });
                      setNextDisabled(false);
                    });
                  }}
                  className="bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600 mt-3"
                >
                  Siguiente
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ) : null}

        {calculator &&
        calculator.step === CALCULATOR_STEP.SELECT_PRODUCT_SCREEN &&
        calculator.action === CALCULATOR_ACTIONS.SELECT_WIDTH ? (
          <Modal isOpen={true} onClose={() => getCurrentCalculator()}>
            <ModalContent className="md:p-6">
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-center">Selecconar ancho de tabla</h3>
              </ModalHeader>
              <ModalBody className="relative">
                <ScrollShadow className="w-[100%] min-h-[100px] max-h-[70vh] flex flex-col gap-3">
                  {calculator.data.productList.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-md p-2 hover:cursor-pointer hover:shadow-md"
                      onClick={() => {
                        fetch("/api/calculator", {
                          method: "POST",
                          body: JSON.stringify({
                            step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
                            action: CALCULATOR_ACTIONS.ADD_PRODUCT,
                            data: {
                              product_id: product.id,
                            },
                          }),
                        }).then((res) => {
                          res.json().then((data) => {
                            setCalculator({ ...calculator, ...data });
                          });
                        });
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="text-small">{product.title}</span>
                      </div>
                    </div>
                  ))}
                </ScrollShadow>
              </ModalBody>
            </ModalContent>
          </Modal>
        ) : null}

        {calculator &&
        calculator.step === CALCULATOR_STEP.SELECT_PRODUCT_SCREEN &&
        calculator.action === CALCULATOR_ACTIONS.SELECT_DEEP ? (
          <Modal isOpen={true} onClose={() => getCurrentCalculator()}>
            <ModalContent className="md:p-6">
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-center">Selecconar espesor de tabla</h3>
              </ModalHeader>
              <ModalBody className="relative">
                <ScrollShadow className="w-[100%] min-h-[100px] max-h-[70vh] flex flex-col gap-3">
                  {calculator.data.productList.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-md p-2 hover:cursor-pointer hover:shadow-md"
                      onClick={() => {
                        fetch("/api/calculator", {
                          method: "POST",
                          body: JSON.stringify({
                            step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
                            action: CALCULATOR_ACTIONS.ADD_PRODUCT,
                            data: {
                              product_id: product.id,
                            },
                          }),
                        }).then((res) => {
                          res.json().then((data) => {
                            setCalculator({ ...calculator, ...data });
                          });
                        });
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="text-small">{product.title}</span>
                      </div>
                    </div>
                  ))}
                </ScrollShadow>
              </ModalBody>
            </ModalContent>
          </Modal>
        ) : null}

        {calculator &&
        calculator.step === CALCULATOR_STEP.SELECT_PRODUCT_SCREEN &&
        calculator.action === CALCULATOR_ACTIONS.SELECT_MOLDURA ? (
          <Modal isOpen={true} onClose={() => getCurrentCalculator()}>
            <ModalContent className="md:p-6">
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-center">Selecconar moldura</h3>
              </ModalHeader>
              <ModalBody className="relative">
                <ScrollShadow className="w-[100%] min-h-[100px] max-h-[70vh] flex flex-col gap-3">
                  {calculator.data.productList.map((product) => (
                    <div
                      key={product.code}
                      textValue={product.name}
                      value={product.code}
                      className="border border-gray-200 rounded-md p-2 hover:cursor-pointer hover:shadow-md"
                      onClick={() => {
                        fetch("/api/calculator", {
                          method: "POST",
                          body: JSON.stringify({
                            step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
                            action: CALCULATOR_ACTIONS.ADD_PRODUCT,
                            data: {
                              product_id: product.id,
                            },
                          }),
                        }).then((res) => {
                          res.json().then((data) => {
                            setCalculator({ ...calculator, ...data });
                          });
                        });
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={product.name}
                          className="flex-shrink-0"
                          size="lg"
                          src={product.mainImage}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{product.name}</span>
                          <span className="text-tiny text-default-400">
                            {product.priceWithIvaAndDiscount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollShadow>
              </ModalBody>
            </ModalContent>
          </Modal>
        ) : null}

        {calculator &&
        calculator.step === CALCULATOR_STEP.DIMENSIONS_SCREEN &&
        calculator.action === CALCULATOR_ACTIONS.SET_DIMENSIONS ? (
          <Modal isOpen={true} onClose={() => getCurrentCalculator()}>
            <ModalContent className="md:p-6">
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-center">Ingresar dimensiones</h3>
                <h4 className="text-center">
                  {calculator.data.structure_name}
                </h4>
                <img
                  src={calculator.data.img}
                  alt="Estructura"
                  className="w-[100%] h-[200px] object-cover"
                />
              </ModalHeader>
              <ModalBody className="relative">
                <ScrollShadow className="w-[100%] min-h-[100px] flex flex-col gap-3 items-center">
                  <Input label="Ancho" id="width" />
                  <Input label="Largo" id="height" />
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <button
                  disabled={nextDisabled}
                  onClick={() => {
                    const data = {
                      width: document?.getElementById("width")?.value,
                      height: document?.getElementById("height")?.value,
                    };

                    if (
                      !data.width ||
                      !data.height ||
                      isNaN(data.width) ||
                      isNaN(data.height) ||
                      data.width <= 0 ||
                      data.height <= 0
                    ) {
                      return;
                    }

                    setNextDisabled(true);
                    fetch("/api/calculator", {
                      method: "POST",
                      body: JSON.stringify({
                        step: CALCULATOR_STEP.DIMENSIONS_SCREEN,
                        action: CALCULATOR_ACTIONS.SET_DIMENSIONS,
                        data: {
                          structure_id: calculator.data.structure_id,
                          structure_name: calculator.data.structure_name,
                          img: calculator.data.img,
                          width: data.width,
                          height: data.height,
                        },
                      }),
                    }).then((res) => {
                      res.json().then((data) => {
                        setCalculator({ ...calculator, ...data });
                      });
                      setNextDisabled(false);
                    });
                  }}
                  className="bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600 mt-3"
                >
                  Siguiente
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ) : null}

        {calculator &&
        calculator.step === CALCULATOR_STEP.STRUCTURES_SCREEN &&
        calculator.action === CALCULATOR_ACTIONS.SELECT_COLOR ? (
          <Modal isOpen={true} onClose={() => getCurrentCalculator()}>
            <ModalContent className="md:p-6">
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-center">Seleccionar color</h3>
              </ModalHeader>
              <ModalBody className="relative">
                <ScrollShadow className="w-[100%] min-h-[100px] flex flex-col gap-3 items-center">
                  <Select
                    key={`color`}
                    items={calculator?.colors}
                    label={"Color"}
                    placeholder={`Seleccionar color`}
                    labelPlacement="outside"
                    className="max-w-md"
                    name={`color`}
                    id="color"
                    defaultValue={calculator.colors[0].id}
                    defaultSelectedKeys={calculator.colors[0].id}
                    onChange={(value) => {
                      if (!value.target.value) {
                        return;
                      }
                      setColor(
                        calculator.colors.find(
                          (c) => c.id === value.target.value
                        )
                      );
                    }}
                  >
                    {(color: any) => (
                      <SelectItem
                        key={color.id}
                        textValue={color.title}
                        value={color.id}
                      >
                        <div className="flex gap-2 items-center">
                          <div
                            className={`w-10 h-10 rounded-full border-2 border-x-slate-500`}
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="flex flex-col">
                            <span className="text-small">{color.title}</span>
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </ScrollShadow>

                {color && (
                  <div className="flex justify-center items-center">
                    <div
                      className={`w-10 h-10 rounded-full border-2 border-x-slate-500`}
                      style={{ backgroundColor: color?.hex }}
                    />
                    <span className="text-lg ml-2">{color?.title}</span>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <button
                  disabled={nextDisabled}
                  onClick={() => {
                    if (!color) {
                      return;
                    }
                    setNextDisabled(true);
                    fetch("/api/calculator", {
                      method: "POST",
                      body: JSON.stringify({
                        step: CALCULATOR_STEP.SELECT_PRODUCT_SCREEN,
                        action: CALCULATOR_ACTIONS.ADD_PRODUCT,
                        data: {
                          product_id: color.id,
                        },
                      }),
                    }).then((res) => {
                      res.json().then((data) => {
                        setCalculator({ ...calculator, ...data });
                      });
                      setNextDisabled(false);
                    });
                  }}
                  className="bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600 mt-3"
                >
                  Siguiente
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ) : null}
      </div>
    </>
  );
};

export default CalculatorLayout;

const CalculatorDetail = ({
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
  return (
    <div className="flex flex-col w-[100%] h-[100%] bg-white">
      <div className="shadow-md text-center">
        <h3 className="text-lg">Detalle de calculadora</h3>
      </div>
      {structureList.length === 0 && (
        <div className="w-[100%] h-[100%] text-center items-center flex flex-auto justify-center">
          <span className="text-xl mt-6">No se cargaron estructuras</span>
        </div>
      )}
      <ScrollShadow className="p-6 h-[300px]">
        {structureList.map((structure, i) => (
          <div
            key={`${structure.structure_id}-${i}`}
            className="flex flex-col border-b-orange-200 border-b-1 p-2"
          >
            <div>
              <span className="text-lg text-gray-600">{`${structure.structure_name} \t ${structure.width} x ${structure.height}`}</span>
            </div>
            {structure.type === "pvc" ? (
              <div className="flex flex-row">
                <span className="text-sm text-right text-slate-600">{`${
                  colors.find((c) => c.id === structure.color)?.name
                } `}</span>
                <div
                  style={{
                    background: colors.find((c) => c.id === structure.color)
                      ?.hex,
                    width: "20px",
                    height: "20px",
                  }}
                ></div>
              </div>
            ) : null}
          </div>
        ))}
      </ScrollShadow>
      {structureList.length ? (
        <div className="mt-4 p-3 text-center flex flex-col gap-3">
          <div className="text-center">
            <span className="text-base">{totalPrice}</span>
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
      ) : null}
    </div>
  );
};
