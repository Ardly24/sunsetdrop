import { ID } from "./common";

export type ListingType = "DISCOUNTED" | "DONATION";

export type ListingStatus =
  | "ACTIVE"
  | "PAUSED"
  | "SOLD_OUT"
  | "EXPIRED"
  | "CANCELLED";

export interface FoodListing {
  id: ID;
  branchId: ID;
  title: string;
  description: string | null;
  category: string;
  type: ListingType;
  status: ListingStatus;
  price: number | string;
  originalPrice: number | string | null;
  quantityAvailable: number;
  quantitySold: number;
  weightPerItemKg: number | string | null;
  imageUrl: string | null;
  expiresAt: string | null;
  collectionStartsAt: string;
  collectionEndsAt: string;
  ingredients: string | null;
  allergens: string;
  storageInstructions: string | null;
  collectionInstructions: string;
  createdAt: string;
  updatedAt: string;
  images: {
  id: ID;
  fileId: string;
  url: string;
  name: string;
  sortOrder: number;
  createdAt: string;
}[];
}

