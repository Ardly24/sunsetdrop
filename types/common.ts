import { BusinessType } from "@/app/generated/prisma/enums";
export type ID = string;

export interface Step {
  number: string;
  title: string;
  description: string;
}

export type UserRole =
  | "CUSTOMER"
  | "BUSINESS"
  | "CHARITY"
  | "ADMIN";

export type RegistrationRole = Exclude<UserRole, "ADMIN">;

export interface RegistrationForm {
  role: RegistrationRole;
  fullName: string;
  organisationName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  address?: string;
  city?: string;
  country?: string;
  phone: string;
  suburb?: string;
  website?: string;
  description?: string;
  businessType?: BusinessType | '';
}

