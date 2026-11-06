
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import {FoodCategory, ListingType, ListingStatus} from "@/app/generated/prisma/enums";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const payload = await verifySession(token);

    if (!payload || typeof payload.userId !== "string") {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        role: true,
        branch: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user || user.role !== "BUSINESS") {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    if (!user.branch) {
      return NextResponse.json(
        { message: "Business branch not found." },
        { status: 404 }
      );
    }

    const listings = await prisma.listing.findMany({
      where: {
        branchId: user.branch.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Fetch listings error:", error);

    return NextResponse.json(
      { message: "Unable to fetch listings." },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const payload = await verifySession(token);

    if (!payload || typeof payload.userId !== "string") {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
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
        { status: 403 }
      );
    }

    if (!user.branch || !user.branch.isActive) {
      return NextResponse.json(
        { message: "Active business branch not found." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      title,
      category,
      description,
      type,
      originalPrice,
      discountedPrice,
      quantity,
      collectionStart,
      collectionEnd,
      ingredients,
      allergens,
      storageInstructions,
      collectionInstructions,
    } = body;

    if (
      !title?.trim() ||
      !category ||
      !description?.trim() ||
      !allergens?.trim() ||
      !collectionInstructions?.trim() ||
      !quantity ||
      !collectionStart ||
      !collectionEnd
    ) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (!Object.values(FoodCategory).includes(category)) {
      return NextResponse.json(
        { message: "Invalid food category." },
        { status: 400 }
      );
    }

    if (!Object.values(ListingType).includes(type)) {
      return NextResponse.json(
        { message: "Invalid listing type." },
        { status: 400 }
      );
    }

    const parsedQuantity = Number(quantity);
    const startDate = new Date(collectionStart);
    const endDate = new Date(collectionEnd);

    if (
      !Number.isSafeInteger(parsedQuantity) ||
      parsedQuantity < 1 ||
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      endDate <= startDate
    ) {
      return NextResponse.json(
        { message: "Invalid quantity or collection dates." },
        { status: 400 }
      );
    }

    let price = 0;
    let parsedOriginalPrice: number | null = null;

    if (type === "DISCOUNTED") {
      price = Number(discountedPrice);
      parsedOriginalPrice = Number(originalPrice);

      if (
        !Number.isFinite(price) ||
        !Number.isFinite(parsedOriginalPrice) ||
        price <= 0 ||
        parsedOriginalPrice <= 0 ||
        price >= parsedOriginalPrice
      ) {
        return NextResponse.json(
          { message: "Please provide valid discounted pricing." },
          { status: 400 }
        );
      }
    }

    const listing = await prisma.listing.create({
      data: {
        branchId: user.branch.id,
        title: title.trim(),
        category,
        description: description.trim(),
        type,
        price,
        originalPrice: parsedOriginalPrice,
        quantityAvailable: parsedQuantity,
        collectionStartsAt: startDate,
        collectionEndsAt: endDate,
        ingredients: ingredients?.trim() || null,
        allergens: allergens.trim(),
        storageInstructions: storageInstructions?.trim() || null,
        collectionInstructions: collectionInstructions.trim(),
      },
    });

    return NextResponse.json(
      {
        message: "Listing created successfully.",
        listing,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create listing error:", error);

    return NextResponse.json(
      { message: "Unable to create listing." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const payload = await verifySession(token);

    if (!payload || typeof payload.userId !== "string") {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        role: true,
        branch: {
          select: { id: true, isActive: true },
        },
      },
    });

    if (!user || user.role !== "BUSINESS") {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    if (!user.branch || !user.branch.isActive) {
      return NextResponse.json(
        { message: "Active business branch not found." },
        { status: 403 }
      );
    }

    const { id, status } = await request.json();

    if (
      typeof id !== "string" ||
      !Object.values(ListingStatus).includes(status) ||
      !["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED"].includes(status)
    ) {
      return NextResponse.json(
        { message: "Invalid listing ID or status." },
        { status: 400 }
      );
    }

    const result = await prisma.listing.updateMany({
      where: {
        id,
        branchId: user.branch.id,
        status: {
          in: ["ACTIVE", "PAUSED"],
        },
      },
      data: { status },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Listing status updated successfully.",
    });
  } catch (error) {
    console.error("Update listing status error:", error);

    return NextResponse.json(
      { message: "Unable to update listing status." },
      { status: 500 }
    );
  }
}