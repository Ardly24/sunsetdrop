
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/api-auth";
import {
  generateReservationToken,
  hashReservationToken,
} from "@/lib/reservation-token";

export async function POST(request: Request) {
  try {
    const auth = await requireCustomer();

    if (auth.error) {
      return NextResponse.json(
        { error: auth.error.message },
        { status: auth.error.status },
      );
    }

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
        customerId: auth.userId,
      },
      include: {
        listing: {
          select: {
            collectionEndsAt: true,
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

    if (reservation.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Only confirmed reservations can generate QR codes." },
        { status: 400 },
      );
    }

    const expiresAt = reservation.listing.collectionEndsAt;

    if (expiresAt <= new Date()) {
      return NextResponse.json(
        { error: "The collection window has expired." },
        { status: 400 },
      );
    }

    const token = generateReservationToken();
    const tokenHash = hashReservationToken(token);

    const updated = await prisma.reservation.updateMany({
      where: {
        id: reservationId,
        customerId: auth.userId,
        status: "CONFIRMED",
      },
      data: {
        collectionTokenHash: tokenHash,
        collectionTokenExpiresAt: expiresAt,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Unable to generate QR code for this reservation." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        message: "QR token generated successfully.",
        token,
        expiresAt,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Generate reservation QR token error:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating the QR token." },
      { status: 500 },
    );
  }
}
