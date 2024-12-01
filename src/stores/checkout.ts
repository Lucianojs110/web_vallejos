import { makeStore, useStore } from "statery";
import type {
  ICheckout,
  IDataClient,
  IDataPersonReceiver,
  IDataShipment,
} from "./../types/ICheckout";

const initStore: ICheckout = {
  acopioChecked: false,
  step: 1,
  shipment: true,
  shipmentId: "",
  shipmentWithHours: false,
  city: "Concordia",
  dataShipment: {
    date: "",
    time: "",
    address: "",
    addressNumber: "",
  },
  dataPersonReceiver: {
    name: "",
    phone: "",
  },
  dataClient: {
    name: "",
    phone: "",
    email: "",
    document: "",
    tipoIVA: "C",
  },
  orderSale: {},
  bodyPayment: {
    email: "",
    token: "",
    payment_method_id: 0,
    bin: "",
    amount: 0,
    installments: 0,
    client: "",
  },
  cardHolder: {
    name: "",
    dni: "",
  },
  lastFourDigits: "",
  amount: 0,
};

export const store = makeStore(initStore);

export const state = () => useStore(store);

export const setShipmentId = (
  shipmentId: string,
  shipmentWithHours?: boolean
) => {
  store.set((state: ICheckout) => {
    return { ...state, shipmentId, shipmentWithHours };
  });
};

export const getShipmentId = () => {
  const data: ICheckout = state();
  return data.shipmentId;
};

export const setAcopioChecked = (checked: boolean) => {
  store.set((state: ICheckout) => {
    return { ...state, acopioChecked: checked };
  });
};

export const isAcopioChecked = () => {
  const data: ICheckout = state();
  return data.acopioChecked;
};

export const getShipmentChecked = () => {
  const data: ICheckout = state();
  return data.shipment;
};

export const setShipmentChecked = (shipment: boolean) => {
  store.set((state: ICheckout) => {
    return { ...state, shipment };
  });
};

export const getStep = () => {
  const data: ICheckout = state();
  return data.step;
};

export const setStep = (step: number) => {
  store.set((state: ICheckout) => {
    return { ...state, step };
  });
};

export const getCitySelected = () => {
  const data: ICheckout = state();
  return data.city;
};

export const setCitySelected = (city: string) => {
  store.set((state: ICheckout) => {
    return { ...state, city };
  });
};

export const getDataShipment = () => {
  const data: ICheckout = state();
  return data.dataShipment;
};

export const setDataShipment = (dataShipment: IDataShipment) => {
  store.set((state: ICheckout) => {
    return { ...state, dataShipment };
  });
};

export const getDataPersonReceiver = () => {
  const data: ICheckout = state();
  return data.dataPersonReceiver;
};

export const setDataPersonReceiver = (
  dataPersonReceiver: IDataPersonReceiver
) => {
  store.set((state: ICheckout) => {
    return { ...state, dataPersonReceiver };
  });
};

export const getDataClient = () => {
  const data: ICheckout = state();
  return data.dataClient;
};

export const setDataClient = (dataClient: IDataClient) => {
  store.set((state: ICheckout) => {
    return { ...state, dataClient };
  });
};

export const resetCheckout = () => {
  store.set((state: ICheckout) => {
    return { ...state, ...initStore };
  });
};

export const setCheckout = (checkout: ICheckout) => {
  store.set((state: ICheckout) => {
    return { ...state, ...checkout };
  });
};

export const getCheckout = () => {
  const data: ICheckout = state();
  return data;
};
