import { ID } from "./common";

export interface Business {
  id: ID;
  name: string;
  email: string;
  phone: string;
  description?: string;
}