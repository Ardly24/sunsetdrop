
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/api-auth";

export async function PATCH() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 },
      );
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "All notifications marked as read.",
        updatedCount: result.count,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    return NextResponse.json(
      { message: "Unable to update notifications." },
      { status: 500 },
    );
  }
}
