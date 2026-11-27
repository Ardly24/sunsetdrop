import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

export async function GET() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        branch: {
          select: {
            id: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || user.role !== "BUSINESS") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    if (!user.branch || !user.branch.isActive) {
      return NextResponse.json(
        { message: "Active business branch not found." },
        { status: 403 },
      );
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        listing: {
          branchId: user.branch.id,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            type: true,
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        collectionTime: "asc",
      },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Fetch business reservations error:", error);

    return NextResponse.json(
      { message: "Unable to fetch reservations." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        branch: {
          select: {
            id: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || user.role !== "BUSINESS") {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    if (!user.branch || !user.branch.isActive) {
      return NextResponse.json(
        { message: "Active business branch not found." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { reservationId, status } = body;

    if (!reservationId || typeof reservationId !== "string") {
      return NextResponse.json(
        { message: "Valid reservation ID is required." },
        { status: 400 },
      );
    }

    if (status !== "CONFIRMED") {
      return NextResponse.json(
        { message: "Only confirmation is currently allowed." },
        { status: 400 },
      );
    }

    const result = await prisma.reservation.updateMany({
      where: {
        id: reservationId,
        status: "PENDING",
        listing: {
          branchId: user.branch.id,
        },
      },
      data: {
        status: "CONFIRMED",
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          message:
            "Reservation not found, not owned by your business, or cannot be confirmed.",
        },
        { status: 404 },
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: {
        id: true,
        status: true,
        updatedAt: true,
        customerId: true,
        listing: {
          select: {
            title: true,
          },
        },
      },
    });

    if (reservation) {
  try {
    await createNotification({
      userId: reservation.customerId,
      type: "RESERVATION_CONFIRMED",
      title: "Reservation confirmed!",
      message: `Your reservation for ${reservation.listing.title} has been confirmed.`,
      link: "/customer/reservations",
    });
  } catch (error) {
    console.error("Create confirmation notification error:", error);
  }
}

    return NextResponse.json({
      message: "Reservation confirmed successfully.",
      reservation,
    });
  } catch (error) {
    console.error("Update business reservation error:", error);

    return NextResponse.json(
      { message: "Unable to update reservation." },
      { status: 500 },
    );
  }
}
