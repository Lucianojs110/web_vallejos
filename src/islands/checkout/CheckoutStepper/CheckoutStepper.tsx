import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

import { getStep, setStep } from "../../../stores/checkout";
import ContactInformation from "../ContactInformation";
import DeliveryMethod from "../DeliveryMethod";
import OrderDetail from "../OrderDetail";
import ReviewAndConfirm from "../ReviewAndConfirm";

import "./CheckoutStepper.css";
import "./Credit-Card.css";
import { getCountItems } from "../../../stores/cart";
import PaymentStep from "../PaymentStep";

const CheckoutStepper = ({ data }) => {
  const totalItems = getCountItems();
  const step = getStep();

  if (totalItems === 0) {
    // redirect to /products
    if (typeof window === "undefined") {
      return null;
    } else {
      window.location.href = "/";
    }
    return null;
  }
  const currentSelect = [step?.toString()];

  return (
    <div
      className={`bg-white shadow-md w-full sm:w-5/6  lg:w-4/6 xl:w-3/6  flex-1 min-h-screen `}
      style={{ margin: "0 auto", borderRadius: "20px", marginBottom: "20px" }}
    >
      <Accordion
        variant="bordered"
        disabledKeys={[2, 3, 4, 5].filter((i) => i > Number(step)).map(String)}
        selectedKeys={currentSelect}
        onSelectionChange={(e) => {
          e?.currentKey && setStep(e?.currentKey);
          setTimeout(function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 100);
        }}
        selectionBehavior="toggle"
        selectionMode="single"
      >
        <AccordionItem
          key="1"
          aria-label="Detalle del pedido"
          title="1. Detalle del pedido"
        >
          <OrderDetail token={data.token} />
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Método de entrega"
          title="2. Método de entrega"
        >
          <DeliveryMethod shipments={data.shipments} />
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Datos personales"
          title="3. Datos personales"
        >
          <ContactInformation />
        </AccordionItem>
        <AccordionItem
          key="4"
          aria-label="Método de pago"
          title="4. Método de pago"
        >
          <PaymentStep data={data} />
        </AccordionItem>
        <AccordionItem
          key="5"
          aria-label="Revisá y confirmá tu compra"
          title="5. Revisá y confirmá tu compra"
        >
          <ReviewAndConfirm />
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CheckoutStepper;
