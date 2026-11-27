import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

export async function GET() {
  try {
    const auth = await requireCustomer();

    if (auth.error) {
      return NextResponse.json(
        { error: auth.error.message },
        { status: auth.error.status },
      );
    }

    const userId = auth.userId;

    const reservations = await prisma.reservation.findMany({
      where: {
        customerId: userId,
      },
      include: {
        listing: {
          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
            branch: {
              include: {
                business: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.error("Fetch reservations error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching reservations." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireCustomer();

    if (auth.error) {
      return NextResponse.json(
        { error: auth.error.message },
        { status: auth.error.status },
      );
    }

    const userId = auth.userId;
    const body = await request.json();
    const { reservationId } = body;

    if (!reservationId || typeof reservationId !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid reservation ID." },
        { status: 400 },
      );
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        customerId: userId,
      },
      select: {
        id: true,
        listingId: true,
        quantity: true,
        status: true,
        listing: {
          select: {
            title: true,
            branch: {
              select: {
                userId: true,
              },
            },
          },
        },
        customer: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found." },
        { status: 404 },
      );
    }

    if (
      reservation.status !== "PENDING" &&
      reservation.status !== "CONFIRMED"
    ) {
      return NextResponse.json(
        { error: "This reservation can no longer be cancelled." },
        { status: 400 },
      );
    }

    const cancelled = await prisma.$transaction(async (tx) => {
      const result = await tx.reservation.updateMany({
        where: {
          id: reservationId,
          customerId: userId,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
        data: {
          status: "CANCELLED",
        },
      });

      if (result.count === 0) {
        return false;
      }

      await tx.listing.update({
        where: {
          id: reservation.listingId,
        },
        data: {
          quantityAvailable: {
            increment: reservation.quantity,
          },
        },
      });

      return true;
    });

    if (!cancelled) {
      return NextResponse.json(
        {
          error:
            "This reservation has already been cancelled or can no longer be cancelled.",
        },
        { status: 409 },
      );
    }

    try {
  await createNotification({
    userId: reservation.listing.branch.userId,
    type: "RESERVATION_CANCELLED",
    title: "Reservation cancelled",
    message: `${reservation.customer.fullName} cancelled their reservation for ${reservation.listing.title}.`,
    link: "/business/reservations",
  });
} catch (error) {
  console.error("Create cancellation notification error:", error);
}

    return NextResponse.json(
      {
        message: "Reservation cancelled successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Cancel reservation error:", error);

    return NextResponse.json(
      { error: "Something went wrong while cancelling the reservation." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireCustomer();

    if (auth.error) {
      return NextResponse.json(
        { error: auth.error.message },
        { status: auth.error.status },
      );
    }

    const userId = auth.userId;

    const body = await request.json();
    const { listingId, quantity, collectionTime } = body;

    if (
      !listingId ||
      typeof listingId !== "string" ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      typeof collectionTime !== "string"
    ) {
      return NextResponse.json(
        { error: "Please provide valid reservation details." },
        { status: 400 },
      );
    }

    const parsedCollectionTime = new Date(collectionTime);

    if (Number.isNaN(parsedCollectionTime.getTime())) {
      return NextResponse.json(
        { error: "Please provide a valid collection time." },
        { status: 400 },
      );
    }

    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        status: "ACTIVE",
        branch: {
          isActive: true,
        },
      },
      select: {
        id: true,
        title: true,
        quantityAvailable: true,
        collectionStartsAt: true,
        collectionEndsAt: true,
        branch: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "This listing is no longer available." },
        { status: 404 },
      );
    }

    if (quantity > listing.quantityAvailable) {
      return NextResponse.json(
        {
          error: `Only ${listing.quantityAvailable} items are currently available.`,
        },
        { status: 400 },
      );
    }

    if (
      parsedCollectionTime < listing.collectionStartsAt ||
      parsedCollectionTime > listing.collectionEndsAt ||
      parsedCollectionTime <= new Date()
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a valid collection time within the collection window.",
        },
        { status: 400 },
      );
    }

    const customer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
        fullName: true,
      },
    });

    if (!customer || customer.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Only customer accounts can make reservations." },
        { status: 403 },
      );
    }

    const reservation = await prisma.$transaction(async (tx) => {
      const stockUpdate = await tx.listing.updateMany({
        where: {
          id: listingId,
          status: "ACTIVE",
          quantityAvailable: {
            gte: quantity,
          },
          collectionStartsAt: {
            lte: parsedCollectionTime,
          },
          collectionEndsAt: {
            gte: parsedCollectionTime,
          },
        },
        data: {
          quantityAvailable: {
            decrement: quantity,
          },
        },
      });

      if (stockUpdate.count === 0) {
        return null;
      }

      return await tx.reservation.create({
        data: {
          customerId: userId,
          listingId,
          quantity,
          collectionTime: parsedCollectionTime,
        },
      });
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Sorry, this listing no longer has enough stock available." },
        { status: 409 },
      );
    }

    try {
      await createNotification({
        userId: listing.branch.userId,
        type: "RESERVATION_CREATED",
        title: "New reservation received",
        message: `${customer.fullName} reserved ${quantity} item(s) of ${listing.title}.`,
        link: "/business/reservations",
      });
    } catch (error) {
      console.error("Create reservation notification error:", error);
    }

    return NextResponse.json(
      {
        message: "Reservation created successfully.",
        reservation,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create reservation error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating the reservation." },
      { status: 500 },
    );
  }
}
