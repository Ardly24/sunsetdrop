import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function verifyUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifySession(token);

  if (!payload || typeof payload.userId !== "string") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function verifyRole(requiredRole: "BUSINESS" | "CUSTOMER" | "CHARITY") {
  const user = await verifyUser();

  if (user.role !== requiredRole) {
    redirect("/");
  }

  return user;
}