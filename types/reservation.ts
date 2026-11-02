import { ID } from "./common";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COLLECTED"
  | "CANCELLED"
  | "EXPIRED";

export interface Reservation {
  id: ID;
  listingId: ID;
  consumerId: ID;
  quantity: number;
  status: ReservationStatus;
}