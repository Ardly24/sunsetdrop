import { ID } from "./common";

export type BusinessType =
  | "RESTAURANT"
  | "BAKERY"
  | "SUPERMARKET"
  | "GROCERY_STORE"
  | "OTHER";

export interface Business {
  id: ID;
  name: string;
  email: string;
  phone: string;
  description?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessLocation {
  id: ID;
  businessId: ID;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

