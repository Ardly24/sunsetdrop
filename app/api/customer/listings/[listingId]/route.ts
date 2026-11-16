
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{
    listingId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams,
) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { listingId } = await params;

    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        status: "ACTIVE",
        quantityAvailable: {
          gt: 0,
        },
        collectionEndsAt: {
          gt: new Date(),
        },
        branch: {
          isActive: true,
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
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Customer listing error:", error);

    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 },
    );
  }
}
