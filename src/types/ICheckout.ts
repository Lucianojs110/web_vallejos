export interface ICheckout {
  acopioChecked: boolean;
  shipmentWithHours?: boolean;
  step: number;
  shipment: boolean;
  shipmentId?: string;
  city?: string;
  address?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientDni?: string;
  clientCuit?: string;
  nameRecipient?: string;
  dataShipment: IDataShipment;
  dataPersonReceiver: IDataPersonReceiver;
  dataClient: IDataClient;

  orderSale: IOrderSale;
  bodyPayment: IBodyPayment;
  cardHolder: ICardHolder;
  lastFourDigits: string;
  amount: number;
}

export interface IOrderSale {}

export interface ICardHolder {
  name: string;
  dni: string;
}

export interface IBodyPayment {
  email: string;
  token: string;
  payment_method_id: number;
  bin: string;
  amount: number;
  installments: number;
  client: string;
}

export interface IDataShipment {
  date: string;
  time: string;
  address: string;
  addressNumber: string;
}

export interface IDataPersonReceiver {
  name: string;
  phone: string;
}

export interface IDataClient {
  name: string;
  phone: string;
  email: string;
  document: string;
  tipoIVA: string;
}
