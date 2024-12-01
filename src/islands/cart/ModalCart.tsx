import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
  Spinner,
} from "@nextui-org/react";

import { useStore } from "@nanostores/react";

import CartFloatingButton from "./CartFloatingButton";

import { useEffect } from "react";
import {
  cartItems,
  getCountTotalPriceWithIvaAndDiscount,
  removeProductFromCart,
  updateProductQuantity,
} from "../../stores/cart";
import type { IProductCart } from "../../types/ICart";
import { formatCurrency } from "../../utils";
import { createBudget } from "../../services/budget.services";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ModalCart({ relative }: { relative: boolean }) {
  const [loader, setLoader] = useState(false);
  const [isModalPresupuestoPdfOpen, setIsModalPresupuestoPdfOpen] =
    useState(false);

  const [pdfUrl, setPdfUrl] = useState("");
  const [budgetNumber, setBudgetNumber] = useState(0);

  const $cartItems = useStore(cartItems);
  const quantity = Object.values($cartItems)
    .filter((item) => item !== null)
    .reduce((acc: number, item: any) => acc + item.quantity, 0);

  const countTotalPriceWithIvaAndDiscount =
    getCountTotalPriceWithIvaAndDiscount();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (quantity === 0 && isOpen) onOpenChange();
  }, [quantity]);

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };
  return (
    <>
      <CartFloatingButton {...{ quantity, onOpen, relative }} />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxHeight: "90vh" }}>

          {(onclose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mi Carrito
              </ModalHeader>
              {quantity > 0 ? (
                <ModalBody>
                  <div
                    className={`flex flex-col gap-3 p-1 max-h-[60%] mb-30 overflow-y-scroll border-1`}
                  >
                    {Object.values($cartItems)
                      .filter((item) => item !== null)
                      .sort((a: any, b: any) =>
                        new Date(a.date) > new Date(b.date) ? -1 : 1
                      )
                      .map((product: IProductCart | null) => (
                        <div
                          className={`flex flex-row gap-4 border-b-1 w-full`}
                          key={product?.id}
                        >
                          <div className={`flex flex-col gap-2 w-full`}>
                            <a href={`/catalogo/${product?.slug}`}>
                              <div className={`flex flex-row gap-2`}>
                                <img
                                  src={product?.mainImage}
                                  alt={product?.name}
                                  className={`w-16 h-16`}
                                />
                                <div className={`flex flex-col gap-2`}>
                                  <span className={`font-light text-xs`}>
                                    {product?.name}
                                  </span>
                                  <span className={`text-gray-500 text-xs`}>
                                    sku: {product?.code}
                                  </span>
                                </div>
                              </div>
                            </a>
                            <div
                              className={`flex flex-row gap-2 justify-between items-center text-sm`}
                            >
                              <div className={`flex-1`}>
                                <span className={`text-xl font-bold`}>
                                  {product?.quantity} x{" "}
                                  {formatCurrency(
                                    product?.priceWithIvaAndDiscount || 0
                                  )}
                                </span>
                              </div>

                              <div className={`flex-1`}>
                                <div
                                  className={`flex flex-row justify-evenly gap-2`}
                                >
                                  {/* Botón para reducir la cantidad */}
                                  <div
                                    className={`p-1 hover:cursor-pointer`}
                                    onClick={() => {
                                      updateProductQuantity(
                                        product?.id || "",
                                        (product?.quantity || 1) - 1
                                      );
                                    }}
                                  >
                                    <i>
                                      <img
                                        src="/images/minus.svg"
                                        alt="Reduce quantity"
                                      />
                                    </i>
                                  </div>

                                  {/* Campo de entrada para editar la cantidad */}
                                  <input
                                    type="number"
                                    value={product?.quantity || 1}
                                    min={1}
                                    onChange={(e) => {
                                      const newQuantity = parseInt(
                                        e.target.value,
                                        10
                                      );
                                      if (newQuantity > 0) {
                                        updateProductQuantity(
                                          product?.id || "",
                                          newQuantity
                                        );
                                      }
                                    }}
                                     className="w-12 text-center border rounded text-xl font-bold"
                                  />

                                  {/* Botón para aumentar la cantidad */}
                                  <div
                                    className={`p-1 hover:cursor-pointer`}
                                    onClick={() => {
                                      updateProductQuantity(
                                        product?.id || "",
                                        (product?.quantity || 1) + 1
                                      );
                                    }}
                                  >
                                    <i>
                                      <img
                                        src="/images/plus.svg"
                                        alt="Increase quantity"
                                      />
                                    </i>
                                  </div>

                                  {/* Botón para eliminar el producto */}
                                  <div
                                    className={`p-1 hover:cursor-pointer`}
                                    onClick={() => {
                                      removeProductFromCart(product?.id || "");
                                    }}
                                  >
                                    <i>
                                      <img
                                        src="/images/trash.svg"
                                        alt="Remove product"
                                      />
                                    </i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className={`flex flex-col gap-3 p-2 mt-3`}>
                    <div
                      className={`flex flex-row justify-between text-green-700 bg-gray-200 text-base p-1`}
                    >
                      <span className={`font-bold text-xl`}>Contado / 1 pago</span>
                      <span className={`font-bold text-xl`}>
                        {formatCurrency(countTotalPriceWithIvaAndDiscount)}
                      </span>
                    </div>
                    <div className="flex flex-col text-center">
                      <Button
                        className={`bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl px-4 py-2 transition duration-300`}
                        disabled={loader}
                      >
                        <a
                          href="/checkout"
                          className={`text-white font-bold text-lg w-full text-center`}
                        >
                          <span>Iniciar orden</span>
                        </a>
                      </Button>
                      <div>
                        <span>ó</span>
                      </div>
                      <Button
                        disabled={loader}
                        className={`bg-orange-400 text-white hover:bg-orange-400 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl px-4 py-2 transition duration-300`}
                        onClick={() => {
                          setLoader(true);
                          createBudget({
                            cliente: "W4",
                            fecha: new Date().toISOString(),
                            articulos: Object.values($cartItems)
                              .filter((item) => item !== null)
                              .map((item, i) => ({
                                articulo: item?.code || "",
                                cantidad: item?.quantity || 0,
                                renglon: i + 1,
                              })),
                          })
                            .then((data) => {
                              onOpenChange();
                              setIsModalPresupuestoPdfOpen(true);
                              setPdfUrl(data.url);
                              setBudgetNumber(data.numero);
                            })
                            .finally(() => {
                              setLoader(false);
                            });
                        }}
                      >
                        <span className={`text-base w-full text-center`}>
                          Generar Presupuesto
                        </span>
                      </Button>
                    </div>
                  </div>

                  {loader ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "45px",
                        left: "calc(50% - 16px)",
                      }}
                    >
                      <Spinner />
                    </div>
                  ) : null}
                </ModalBody>
              ) : null}
            </>
          )}
        </ModalContent>
      </Modal>

      {isModalPresupuestoPdfOpen && !isMobile() && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <button
              onClick={() => setIsModalPresupuestoPdfOpen(false)}
              style={closeButtonStyle}
            >
              Cerrar
            </button>
            <div
              style={{
                width: "90%",
                height: "90%",
                overflow: "auto",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <Document file={pdfUrl}>
                <Page
                  pageNumber={1}
                  scale={1.0}
                  // width={isMobile() ? window.innerWidth : undefined}
                />
              </Document>
            </div>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = `presupuesto_${budgetNumber}.pdf`;
                link.click();
              }}
              style={downloadButtonStyle}
            >
              Descargar PDF
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "4px",
  width: "90%",
  height: "90vh",
  maxWidth: "700px",
  position: "relative",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
};

const downloadButtonStyle = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
};
