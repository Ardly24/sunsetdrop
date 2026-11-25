
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/api-auth";
import { hashReservationToken } from "@/lib/reservation-token";

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 },
      );
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
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 },
      );
    }

    if (!user.branch || !user.branch.isActive) {
      return NextResponse.json(
        { message: "Active business branch not found." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { token } = body;

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      return NextResponse.json(
        { message: "Invalid QR code." },
        { status: 400 },
      );
    }

    const tokenHash = hashReservationToken(token);
    const now = new Date();

    const result = await prisma.reservation.updateMany({
      where: {
        collectionTokenHash: tokenHash,
        collectionTokenExpiresAt: {
          gt: now,
        },
        status: "CONFIRMED",
        listing: {
          branchId: user.branch.id,
        },
      },
      data: {
        status: "COLLECTED",
        collectedAt: now,
        collectionTokenHash: null,
        collectionTokenExpiresAt: null,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          message:
             "This QR code is invalid, expired, or has already been used. Please ask the customer to generate a new one."
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "Collection verified successfully.",
      status: "COLLECTED",
      collectedAt: now,
    });
  } catch (error) {
    console.error("Verify reservation QR error:", error);

    return NextResponse.json(
      { message: "Unable to verify QR code." },
      { status: 500 },
    );
  }
}
