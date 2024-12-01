export interface IShipment {
  id: string;
  title: string;
  description: string;
  amount: number;
  active: boolean;
  city: string;
  pay_for_km: boolean;
  amount_per_tn: number;
  kms: number;
  free_from: boolean;
  free_from_amount: number;
  set_hours: boolean;
  order: number;
}
