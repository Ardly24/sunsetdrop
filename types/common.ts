export type ID = string;

export type UserRole =
  | "CONSUMER"
  | "BUSINESS"
  | "CHARITY"
  | "ADMIN";

  export interface Step {
  number: string;
  title: string;
  description: string;
}