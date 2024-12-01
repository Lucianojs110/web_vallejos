import React, { useState } from "react";
import SelectDropDownMenu from "./DropDown/Dropdown";
import type { IShipment } from "../types/IShipment";
import { formatCurrency } from "../utils/formatter";
import ChevronDownIcon from "../icons/ChevronDownIcon";
import ChevronUpIcon from "../icons/ChevronUpIcon";

export default function Shippings({ shipments }: { shipments: IShipment[] }) {
  // Inicializar la ciudad seleccionada con la primera ciudad disponible
  const [citySelected, setCitySelected] = React.useState<string | null>(null);

  // Estado para manejar la expansión/collapse de cada sección
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Maneja la expansión o colapso de una sección específica
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md mt-4">
      {/* Selector de ciudad con etiqueta predeterminada */}
      <div className="mb-10 flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-600 text-center mb-4">
          Seleccione una localidad para ver los envíos disponibles
        </h2>
        <SelectDropDownMenu
          {...{
            optionSelected: citySelected || "",
            setOptionSelected: setCitySelected,
            options: [
              "Seleccione la localidad",
              ...shipments.reduce((acc: string[], shipment: IShipment) => {
                if (!acc.includes(shipment.city)) {
                  acc.push(shipment.city);
                }
                return acc;
              }, []),
            ],
            placeholder: "Seleccione la localidad",
          }}
        />
      </div>

     

      {/* Mostrar los envíos correspondientes a la ciudad seleccionada */}
      <div className="flex flex-col gap-6 mt-6 mb-10" style={{ margin: "0 auto" }}>
        {shipments
          .filter((shipment: IShipment) => shipment.city === citySelected) // Filtrar por ciudad seleccionada
          .map((shipment: IShipment) => (
            <div
              className="flex bg-gray-100 flex-col hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white rounded-md p-6"
              key={shipment.id}
            >
              <div className="flex justify-between items-center text-lg text-gray-600">
                <div style={{ flex: 1 }}>
                  <p className="block px-4 py-2 font-semibold">
                    {shipment.title}
                  </p>
                  <p className="block px-4 py-2">{shipment.description}</p>
                </div>
                <div style={{ flex: 0.5 }}>
                  <p className="block text-lg px-4 py-2">
                    {formatCurrency(shipment.amount)}
                    {shipment.pay_for_km && (
                      <p className="text-base">
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

<br />

       {/* Sección de información adicional con textos colapsables */}
      <div className="bg-white rounded-lg max-w-3xl mx-auto mt-15">
        {[
          {
            title: "SEGURIDAD AL ENTREGAR PEDIDOS",
            content: (
              <p className="text-gray-700">
                Para evitar ESTAFAS, al momento de recibir su compra ES
                OBLIGATORIO presentar DNI y el COMPROBANTE DE COMPRA. Y para
                evitar reclamos y malos entendidos le recordamos que es
                RESPONSABILIDAD DEL CLIENTE CONTROLAR LA CALIDAD Y CANTIDAD de
                los artículos EN EL MOMENTO. Luego no se aceptan reclamos de
                ningún tipo debido a no poder corroborarse. Si la compra fue
                abonada con tarjetas se entrega al titular de la misma
                únicamente.
              </p>
            ),
          },
          {
            title: "ENVÍOS A DOMICILIO EN ZONA CIUDAD",
            content: (
              <p className="text-gray-700">
                LOS ENVÍOS A DOMICILIO NO INCLUYEN LA DESCARGA. El costo del
                mismo es solo para llevar el pedido hasta el domicilio
                indicado, por lo cual SE DEBE TENER DOS PERSONAS PARA
                DESCARGAR. Los pedidos se entregan según lo indicado al pie
                del comprobante de compra (Nota de venta).
              </p>
            ),
          },
          {
            title: "DÍAS Y HORARIOS DE REPARTO CONCORDIA",
            content: (
              <p className="text-gray-700">
                En zona ciudad y zonas aledañas de lunes a viernes de 8 a 12 y
                15 a 18 hs. En ZONA CIUDAD se entregan en el rango de 1 hora
                desde la hora elegida por el cliente. Los pedidos en ZONAS
                ALEDAÑAS tienen un rango de 2 horas desde la hora elegida.
              </p>
            ),
          },
          {
            title: "ENVÍOS A OTRAS CIUDADES",
            content: (
              <p className="text-gray-700">
                Se entregan en el domicilio indicado al hacer la compra de 9 a
                17 hs. Si por algún motivo no se puede entregar le avisaremos
                por mensaje de WhatsApp de la suspensión y quedará para la
                semana siguiente. En el caso que no se pueda descargar el
                pedido por no haber gente para realizarlo, se dejará en
                nuestro local en Concordia para ser retirado por el cliente o
                se cobrará el nuevo envío. TODOS LOS PEDIDOS DEBEN ESTAR PAGOS
                24 HS ANTES DEL DÍA DE LA ENTREGA.
              </p>
            ),
          },
          {
            title: "ENTREGAS EN DIAS DE LLUVIA",
            content: (
              <p className="text-gray-700">
                LOS DIAS DE LLUVIA LOS HORARIOS DE ENTREGA NO SE TIENEN EN
                CUENTA, se entregan a medida que el tiempo lo permite. Si
                recibe un aviso por WhatsApp de la suspensión del servicio,
                debe indicarnos nueva fecha de entrega. Los pedidos que no se
                entreguen quedarán suspendidos hasta que nos informe nuevo día
                y horario de entrega. Para los envíos a Federación, Chajarí,
                San Salvador y Gral. Campos quedarán para la siguiente semana.
              </p>
            ),
          },
          {
            title: "SUSPENSIÓN DE LAS ENTREGAS",
            content: (
              <p className="text-gray-700">
                Recibirá un mensaje avisando de la suspensión del servicio de
                envíos.
              </p>
            ),
          },
        ].map((section) => (
          <div key={section.title} className="mb-4">
            <h3
              className="text-xl font-bold text-gray-700 cursor-pointer flex items-center justify-between"
              onClick={() => toggleSection(section.title)}
            >
              {section.title}
              {/* Icono que indica si está expandido o colapsado */}
              {expandedSection === section.title ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-500 transition-transform duration-300 transform rotate-180" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform duration-300" />
              )}
            </h3>
            {/* Contenido que se expande o colapsa */}
            <div
              className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                expandedSection === section.title ? "max-h-screen" : "max-h-0"
              }`}
            >
              <div className="mt-2">{section.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
