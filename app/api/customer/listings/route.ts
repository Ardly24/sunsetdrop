import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/api-auth";

export async function GET() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const listings = await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        quantityAvailable: {
          gt: 0,
        },
        collectionEndsAt: {
          gt: new Date(),
        },
        branch: {
          isActive: true,
          business: {
            // Only listings from active business branches.
          },
        },
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            suburb: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
            phone: true,
            business: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Customer listings error:", error);

    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}