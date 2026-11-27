
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/api-auth";

export async function GET() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 },
      );
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.notification.count({
        where: {
          userId,
          readAt: null,
        },
      }),
    ]);

    return NextResponse.json(
      {
        notifications,
        unreadCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch notifications error:", error);

    return NextResponse.json(
      { message: "Unable to fetch notifications." },
      { status: 500 },
    );
  }
}
