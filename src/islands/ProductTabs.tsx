import React from "react";
import { Tabs, Tab } from "@nextui-org/react";

export default function ProductTabs({
  descripcion,
  modoUso,
  presentation,
  performance,
  peso,
  brand,
  model,
  code,
  pdfDocument,
  pdfDocumentTitle,
  useMode,
  pdfDocument2,
  pdfDocumentTitle2,
  detailText1,
  detailText2,
}) {
  return (
    <div className="container mx-auto px-4">
      <Tabs aria-label="Detalles del producto" variant="underlined" color="primary">
        <Tab title="Descripción" className="!text-xl !font-bold !text-center">
          <div className="w-full max-w-screen-md mx-auto text-lg sm:text-sm">
            <div className="flex gap-2 items-center">
              <span className="text-md font-normal">{descripcion}</span>
            </div>
          </div>
        </Tab>

        <Tab title="Especificaciones" className="!text-xl !font-bold !text-center">
          <div className="w-full max-w-screen-md mx-auto sm:text-sm">
            {presentation?.length > 0 && (
              <div className="flex gap-2 items-center">
                <h3 className="text-lg sm:text-sm font-semibold">Precio por:</h3>
                <span className="text-lg sm:text-sm">{presentation}</span>
              </div>
            )}

            {performance?.length > 0 && (
              <div className="flex gap-2 items-center">
                <h3 className="text-lg sm:text-sm font-semibold">Rendimiento:</h3>
                <span className="text-lg sm:text-sm">{performance}</span>
              </div>
            )}

            {peso?.length > 0 && (
              <div className="flex gap-2 items-center">
                <h3 className="text-lg sm:text-sm font-semibold">Peso:</h3>
                <span className="text-lg sm:text-sm">{peso}</span>
              </div>
            )}

            <div className="flex gap-2 items-center">
              <h3 className="text-lg sm:text-sm font-semibold">Marca:</h3>
              <span className="text-lg sm:text-sm font-light">{brand}</span>
            </div>

            <div className="flex gap-2 items-center">
              <h3 className="text-lg sm:text-sm font-semibold">Modelo:</h3>
              <span className="text-lg sm:text-sm font-light">{model}</span>
            </div>

            <div className="flex gap-2 items-center">
              <h3 className="text-lg sm:text-sm font-semibold">SKU:</h3>
              <span className="text-lg sm:text-sm font-light">{code}</span>
            </div>
          </div>
        </Tab>

        <Tab title="Modo de Uso" className="!text-xl !font-bold !text-center">
          <div className="w-full max-w-screen-md mx-auto text-lg sm:text-sm">
            {pdfDocument?.length > 0 && pdfDocumentTitle?.length > 0 && (
              <div className="flex gap-2 items-center">
                <h3 className="text-lg sm:text-sm font-semibold">{pdfDocumentTitle}:</h3>
                <a href={pdfDocument} target="_blank">
                  <span className="text-lg sm:text-sm text-blue-900 font-semibold">Descargar</span>
                </a>
              </div>
            )}

            {useMode?.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-sm font-semibold">Modo de uso:</h3>
                <div className="text-lg sm:text-sm font-light" dangerouslySetInnerHTML={{ __html: useMode }} />
              </div>
            )}

            {pdfDocument2?.length > 0 && pdfDocumentTitle2?.length > 0 && (
              <div className="flex gap-2 items-center">
                <h3 className="text-lg sm:text-sm font-semibold">{pdfDocumentTitle2}:</h3>
                <a href={pdfDocument2} target="_blank">
                  <span className="text-lg sm:text-sm text-blue-900 font-semibold">Descargar</span>
                </a>
              </div>
            )}

            <div className="my-3">
              <div className="text-lg sm:text-sm font-light" dangerouslySetInnerHTML={{ __html: detailText1 }} />
            </div>

            <div className="my-3">
              <div className="text-lg sm:text-sm font-light" dangerouslySetInnerHTML={{ __html: detailText2 }} />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
