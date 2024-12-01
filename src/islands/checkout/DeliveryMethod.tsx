import React, { useEffect, useState } from "react";
import CheckBox from "../CheckBox/CheckBox";
import NextButton from "./NextButton";
import {
  getCitySelected,
  getShipmentChecked,
  getShipmentId,
  setCitySelected,
  setShipmentChecked,
  setShipmentId,
  setDataPersonReceiver,
  getCheckout,
} from "../../stores/checkout";
import type { IShipment } from "../../types/IShipment";
import {
  getCountTotalPriceWithIvaAndDiscount,
  getTotalTn,
} from "../../stores/cart";

import { formatCurrency, formatDate } from "./../../utils/formatter";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import SelectDropDownMenu from "./../DropDown/Dropdown";

const getMultipleDay = (day: number) => {
  switch (day) {
    case 0:
      return 24;
    case 6:
      return 48;
    default:
      return 0;
  }
};
const DeliveryMethod = ({ shipments }: { shipments: IShipment[] }) => {
  const [startDate, setStartDate] = useState(() => {
    let now = new Date();
    now.setHours(8);
    now.setMinutes(30);
    if (now.getDay() === 0 || now.getDay() === 6) {
      now = new Date(
        now.getTime() + getMultipleDay(now.getDay()) * 60 * 60 * 1000
      );
    }
    return now;
  });
  const checkout = getCheckout();
  const shipmentChecked = getShipmentChecked();
  const citySelected = getCitySelected();
  const shipmentId = getShipmentId() as string;

  console.log(checkout);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (citySelected) {
      setOpen(false);
      setShipmentId(
        shipments.find((shipment: IShipment) => shipment.city === citySelected)
          ?.id || "",
        shipments.find((shipment: IShipment) => shipment.city === citySelected)
          ?.set_hours || false
      );
    }
  }, [citySelected]);

  return (
    <div className={`pb-10`}>
      <div className={`min-h-[40vh] flex flex-col gap-4 pb-4`}>
        {/* {JSON.stringify(shipments)} */}

        <div className={`flex gap-8 justify-center pt-4 pb-4`}>
          <div className={`flex flex-col gap-2 text-center items-center`}>
            <div>Retirar en local</div>
            <CheckBox
              isChecked={!shipmentChecked}
              setChecked={() => {
                setShipmentChecked(!shipmentChecked);
              }}
            />
          </div>
          <div className={`flex flex-col gap-2 text-center items-center`}>
            <div>Solicitar envio</div>
            <CheckBox
              isChecked={shipmentChecked}
              setChecked={() => {
                setShipmentChecked(!shipmentChecked);
              }}
            />
          </div>
        </div>

        {shipmentChecked && (
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
        )}
        {shipmentChecked && (
          <div>
            <p className="mb-4 text-center">Seleccionar metodo de envio</p>
            <div
              className={`flex flex-col gap-2 max-w-[450px]`}
              style={{ margin: "0 auto" }}
            >
              {shipments
                .filter((shipment: IShipment) => shipment.city === citySelected)
                .map((shipment: IShipment) => (
                  <div
                    className={`flex ${
                      shipmentId === shipment.id
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100"
                    }  hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white rounded-md cursor-pointer justify-between items-center`}
                    key={shipment.id}
                    onClick={() =>
                      setShipmentId(shipment.id, shipment.set_hours)
                    }
                  >
                    <div style={{ flex: 0.8 }}>
                      <div>
                        <p className="block px-4 py-2 ">{shipment.title}</p>
                      </div>
                      <div>
                        <p className="block px-4 py-2 ">
                          {shipment.description}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="block px-4 py-2 ">
                        {calcShipmentAmount(shipment, shipmentId)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className={`flex md:flex-row flex-col gap-2`}>
          <div>
            <span>Nombre de quien recibe el pedido</span>
            <input
              id="nameReceiver"
              type="text"
              maxLength={300}
              className={`border-2 border-gray-300 rounded-md p-2 w-full`}
            />
          </div>
          <div>
            <span>Celular de quien recibe</span>
            <input
              id="phoneReceiver"
              type="text"
              maxLength={300}
              className={`border-2 border-gray-300 rounded-md p-2 w-full`}
            />
          </div>
        </div>

        <div>
          <span>Direccion de envio</span>
          <input
            id="address"
            type="text"
            maxLength={300}
            className={`border-2 border-gray-300 rounded-md p-2 w-full`}
          />
        </div>
        <div className="md:flex gap-2 items-center">
          <div>
            <span>Seleccionar fecha de entrega</span>
          </div>
          <DatePicker
            selected={startDate}
            startDate={startDate}
            onChange={(date: any) => {
              setStartDate(date);
            }}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy HH:mm"
            //exclude sunday
            filterDate={(date: any) =>
              date.getDay() !== 0 && date.getDay() !== 6
            }
            excludeTimes={[
              new Date(2021, 0, 1, 0, 0),
              new Date(2021, 0, 1, 0, 30),
              new Date(2021, 0, 1, 1, 0),
              new Date(2021, 0, 1, 1, 30),
              new Date(2021, 0, 1, 2, 0),
              new Date(2021, 0, 1, 2, 30),
              new Date(2021, 0, 1, 3, 0),
              new Date(2021, 0, 1, 3, 30),
              new Date(2021, 0, 1, 4, 0),
              new Date(2021, 0, 1, 4, 30),
              new Date(2021, 0, 1, 5, 0),
              new Date(2021, 0, 1, 5, 30),
              new Date(2021, 0, 1, 6, 0),
              new Date(2021, 0, 1, 6, 30),
              new Date(2021, 0, 1, 7, 0),
              new Date(2021, 0, 1, 7, 30),
              new Date(2021, 0, 1, 8, 0),
              new Date(2021, 0, 1, 19, 0),
              new Date(2021, 0, 1, 19, 30),
              new Date(2021, 0, 1, 20, 0),
              new Date(2021, 0, 1, 20, 30),
              new Date(2021, 0, 1, 21, 0),
              new Date(2021, 0, 1, 21, 30),
              new Date(2021, 0, 1, 22, 0),
              new Date(2021, 0, 1, 22, 30),
              new Date(2021, 0, 1, 23, 0),
              new Date(2021, 0, 1, 23, 30),
            ]}
            showTimeSelect={checkout.shipmentWithHours}
            customInput={
              <div>
                <div
                  className={`border-2 border-gray-300 rounded-md p-2 w-full hover:cursor-pointer`}
                >
                  {formatDate(startDate.getTime())}
                </div>
              </div>
            }
          />
        </div>
      </div>
      <NextButton
        step={3}
        onClick={() => {
          const nameReceiver = document.getElementById(
            "nameReceiver"
          ) as HTMLInputElement;
          const phoneReceiver = document.getElementById(
            "phoneReceiver"
          ) as HTMLInputElement;

          setDataPersonReceiver({
            name: nameReceiver.value,
            phone: phoneReceiver.value,
          });
        }}
      />
    </div>
  );
};

export default DeliveryMethod;
function calcShipmentAmount(
  shipment: IShipment,
  shipmentId: String
): React.ReactNode {
  const totalAmount = getCountTotalPriceWithIvaAndDiscount();
  const totalTn = getTotalTn();
  if (shipment.free_from && totalAmount >= shipment.free_from_amount) {
    return (
      <span
        className={`${
          shipmentId === shipment.id ? "text-green-300" : "text-green-700"
        }`}
      >
        Gratis
      </span>
    );
  }

  if (shipment.pay_for_km) {
    const total =
      shipment.amount_per_tn * shipment.kms * totalTn + shipment.amount;
    return formatCurrency(total);
  }

  return formatCurrency(shipment.amount);
}
