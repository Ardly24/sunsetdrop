import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export async function requireCustomer() {
  const userId = await getSessionUserId();

  if (!userId) {
    return {
      userId: null,
      error: {
        message: "Unauthorized. Please log in.",
        status: 401,
      },
    };
  }

  const customer = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!customer || customer.role !== "CUSTOMER") {
    return {
      userId: null,
      error: {
        message: "Only customer accounts can access this resource.",
        status: 403,
      },
    };
  }

  return {
    userId,
    error: null,
  };
}