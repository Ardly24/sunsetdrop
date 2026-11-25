import { ID } from "./common";

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

export interface CustomerReservation extends Reservation {
  listing: {
    id: ID;
    title: string;
    category: string;
    price: number;
    originalPrice: number;
    images: {
      id: ID;
      url: string;
    }[];
    branch: {
      name: string;
      city: string;
      suburb: string;
      country: string;
      address: string;
      business: {
        name: string;
      };
    };
  };
}


export interface BusinessReservation extends Reservation {
  customer: {
    id: ID;
    fullName: string;
    phone: string;
    email: string;
  };
  listing: {
    id: ID;
    title: string;
    price: number;
    type: "DISCOUNTED" | "DONATION";
    images: {
      id: ID;
      url: string;
    }[];
  };
}

