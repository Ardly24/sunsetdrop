import { ID } from "./common";

// export interface Reservation {
//   id: ID;
//   customerName: string;
//   customerEmail: string;
//   listingTitle: string;
//   quantity: number;
//   collectionTime: string;
//   status: ReservationStatus;
// }

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COLLECTED"
  | "CANCELLED";

export interface Reservation {
  id: ID;
  customerId: ID;
  listingId: ID;
  quantity: number;
  collectionTime: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}
