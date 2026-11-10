import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  FoodCategory,
  ListingType,
  ListingStatus,
} from "@/app/generated/prisma/enums";
import { getSessionUserId } from "@/lib/api-auth";
import imagekit from "@/lib/imagekit";

export async function GET() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    if (!user.branch) {
      return NextResponse.json(
        { message: "Business branch not found." },
        { status: 404 },
      );
    }

    await prisma.listing.updateMany({
      where: {
        branchId: user.branch.id,
        expiresAt: {
          lte: new Date(),
        },
        status: {
          in: ["ACTIVE", "PAUSED"],
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    const listings = await prisma.listing.findMany({
      where: {
        branchId: user.branch.id,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
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
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    if (!user.branch || !user.branch.isActive) {
      return NextResponse.json(
        { message: "Active business branch not found." },
        { status: 403 },
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
      expiresAt,
      ingredients,
      allergens,
      storageInstructions,
      collectionInstructions,
      photos,
    } = body;

    if (
      !title?.trim() ||
      !category ||
      !description?.trim() ||
      !allergens?.trim() ||
      !collectionInstructions?.trim() ||
      !quantity ||
      !collectionStart ||
      !collectionEnd ||
      !expiresAt
    ) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(photos) ||
      photos.length > 5 ||
      photos.some(
        (photo) =>
          !photo ||
          typeof photo.fileId !== "string" ||
          typeof photo.url !== "string" ||
          typeof photo.name !== "string",
      )
    ) {
      return NextResponse.json(
        { message: "Invalid listing photos." },
        { status: 400 },
      );
    }

    if (!Object.values(FoodCategory).includes(category)) {
      return NextResponse.json(
        { message: "Invalid food category." },
        { status: 400 },
      );
    }

    if (!Object.values(ListingType).includes(type)) {
      return NextResponse.json(
        { message: "Invalid listing type." },
        { status: 400 },
      );
    }

    const parsedQuantity = Number(quantity);
    const startDate = new Date(collectionStart);
    const endDate = new Date(collectionEnd);
    const expiryDate = new Date(expiresAt);

    if (
      !Number.isSafeInteger(parsedQuantity) ||
      parsedQuantity < 1 ||
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      Number.isNaN(expiryDate.getTime()) ||
      endDate <= startDate ||
      expiryDate.getTime() <= Date.now()
    ) {
      return NextResponse.json(
        { message: "Invalid quantity or collection dates." },
        { status: 400 },
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
          { status: 400 },
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
        expiresAt: expiryDate,
        ingredients: ingredients?.trim() || null,
        allergens: allergens.trim(),
        storageInstructions: storageInstructions?.trim() || null,
        collectionInstructions: collectionInstructions.trim(),
        images: {
          create: photos.map(
            (
              photo: { fileId: string; url: string; name: string },
              index: number,
            ) => ({
              fileId: photo.fileId,
              url: photo.url,
              name: photo.name,
              sortOrder: index,
            }),
          ),
        },
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Listing created successfully.",
        listing,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create listing error:", error);

    return NextResponse.json(
      { message: "Unable to create listing." },
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
          select: { id: true, isActive: true },
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

    const { id, status } = await request.json();

    if (
      typeof id !== "string" ||
      !Object.values(ListingStatus).includes(status) ||
      !["ACTIVE", "PAUSED", "SOLD_OUT", "EXPIRED", "CANCELLED"].includes(status)
    ) {
      return NextResponse.json(
        { message: "Invalid listing ID or status." },
        { status: 400 },
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
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Listing status updated successfully.",
    });
  } catch (error) {
    console.error("Update listing status error:", error);

    return NextResponse.json(
      { message: "Unable to update listing status." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
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

    const {
      id,
      title,
      description,
      price,
      originalPrice,
      quantityAvailable,
      photos,
    } = await request.json();

    if (
      !Array.isArray(photos) ||
      photos.length > 5 ||
      photos.some(
        (photo) =>
          !photo ||
          typeof photo.fileId !== "string" ||
          typeof photo.url !== "string" ||
          typeof photo.name !== "string",
      )
    ) {
      return NextResponse.json(
        { message: "Invalid listing photos." },
        { status: 400 },
      );
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        { message: "Invalid listing details." },
        { status: 400 },
      );
    }

    const listing = await prisma.listing.findFirst({
      where: {
        id,
        branchId: user.branch.id,
        status: {
          in: ["ACTIVE", "PAUSED"],
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found or cannot be edited." },
        { status: 404 },
      );
    }

    const currentImages = await prisma.listingImage.findMany({
      where: { listingId: id },
      select: { fileId: true },
    });

    //const currentFileIds = new Set(currentImages.map((image) => image.fileId));
    const photoIds = photos.map((photo: { fileId: string }) => photo.fileId);

    if (new Set(photoIds).size !== photoIds.length) {
      return NextResponse.json(
        { message: "Duplicate photos are not allowed." },
        { status: 400 },
      );
    }

    const submittedFileIds = new Set(photoIds);
    const removedPhotoIds = currentImages
      .filter((image) => !submittedFileIds.has(image.fileId))
      .map((image) => image.fileId);

    const parsedQuantity = Number(quantityAvailable);
    const parsedPrice = Number(price);
    const parsedOriginalPrice =
      originalPrice === "" || originalPrice === null
        ? null
        : Number(originalPrice);

    if (
      !Number.isSafeInteger(parsedQuantity) ||
      parsedQuantity < listing.quantitySold ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      return NextResponse.json(
        { message: "Invalid price or quantity." },
        { status: 400 },
      );
    }

    if (
      listing.type === "DISCOUNTED" &&
      (!Number.isFinite(parsedOriginalPrice) ||
        parsedOriginalPrice === null ||
        parsedPrice <= 0 ||
        parsedOriginalPrice <= parsedPrice)
    ) {
      return NextResponse.json(
        { message: "Please provide valid discounted pricing." },
        { status: 400 },
      );
    }

    const updatedListing = await prisma.$transaction(async (tx) => {
  await tx.listing.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description.trim(),
      price: listing.type === "DONATION" ? 0 : parsedPrice,
      originalPrice:
        listing.type === "DONATION" ? null : parsedOriginalPrice,
      quantityAvailable: parsedQuantity,
    },
  });

  // Replace the listing's database image records.
  await tx.listingImage.deleteMany({
    where: { listingId: id },
  });

  if (photos.length > 0) {
    await tx.listingImage.createMany({
      data: photos.map(
        (
          photo: { fileId: string; url: string; name: string },
          index: number,
        ) => ({
          listingId: id,
          fileId: photo.fileId,
          url: photo.url,
          name: photo.name,
          sortOrder: index,
        }),
      ),
    });
  }

  return tx.listing.findUniqueOrThrow({
    where: { id },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
});

if (removedPhotoIds.length > 0) {
  const deletionResults = await Promise.allSettled(
  removedPhotoIds.map((fileId) =>
    imagekit.files.delete(fileId),
  ),
);

deletionResults.forEach((result, index) => {
  if (result.status === "rejected") {
    console.error(
      `Failed to delete ImageKit file ${removedPhotoIds[index]}:`,
      result.reason,
    );
  }
});
}
    return NextResponse.json({
      message: "Listing updated successfully.",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Update listing error:", error);

    return NextResponse.json(
      { message: "Unable to update listing." },
      { status: 500 },
    );
  }
}
