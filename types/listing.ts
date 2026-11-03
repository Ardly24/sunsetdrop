import { ID } from "./common";

export type ListingType = "DISCOUNTED" | "DONATION";

// export interface FoodListing {
//   //id: ID;
//   id: number;
//   title: string;
//   category: string;
//   originalPrice: number;
//   discountedPrice: number;
//   quantity: number;
//   status: ListingStatus;
//   type: ListingType;
// }


export type ListingStatus =
  | "ACTIVE"
  | "PAUSED"
  | "SOLD_OUT"
  | "EXPIRED"
  //| "CANCELLED";

export interface FoodListing {
  id: ID;
  businessId: ID;
  locationId: ID;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  status: ListingStatus;
  type: ListingType;
  collectionStart: string;
  collectionEnd: string;
  createdAt: string;
  updatedAt: string;
}


