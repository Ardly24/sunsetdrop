import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifySession(token);

  if (!payload || typeof payload.userId !== "string") {
    return null;
  }

  return payload.userId;
}