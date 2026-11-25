
import { createHash, randomBytes } from "crypto";

export function generateReservationToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashReservationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
