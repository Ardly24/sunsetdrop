
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/api-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 },
      );
    }

    const { id } = await params;

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found." },
        { status: 404 },
      );
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notification.id,
      },
      data: {
        readAt: notification.readAt ?? new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Notification marked as read.",
        notification: updatedNotification,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return NextResponse.json(
      { message: "Unable to update notification." },
      { status: 500 },
    );
  }
}
