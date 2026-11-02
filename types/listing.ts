import { ID } from "./common";

export type ListingType = "DISCOUNTED" | "DONATION";

export type ListingStatus =
  | "ACTIVE"
  | "SOLD_OUT"
  | "EXPIRED"
  | "PAUSED"
  | "CANCELLED";

export interface FoodListing {
  id: ID;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  quantityAvailable: number;
  type: ListingType;
  status: ListingStatus;
}