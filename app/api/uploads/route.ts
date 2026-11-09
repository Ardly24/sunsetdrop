import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import imagekit from "@/lib/imagekit";

//export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Check authentication
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    // Check business role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "BUSINESS") {
      return NextResponse.json(
        { error: "Only businesses can upload photos." },
        { status: 403 }
      );
    }

    // Get uploaded photos
    const formData = await request.formData();
    const entries = formData.getAll("photos");

    if (
      entries.length === 0 ||
      entries.length > 5 ||
      entries.some((entry) => !(entry instanceof File))
    ) {
      return NextResponse.json(
        { error: "Please upload between 1 and 5 photos." },
        { status: 400 }
      );
    }

    const photos = entries as File[];

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    for (const photo of photos) {
      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json(
          { error: "Only JPEG, PNG, and WebP images are allowed." },
          { status: 400 }
        );
      }

      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Each image must not exceed 5 MB." },
          { status: 400 }
        );
      }
    }

    // Upload photos to ImageKit
    const uploadedPhotos = await Promise.all(
      photos.map(async (photo) => {
        const result = await imagekit.files.upload({
          file: photo,
          fileName: `${Date.now()}-${photo.name}`,
        });

        return {
          fileId: result.fileId,
          url: result.url,
          name: result.name,
        };
      })
    );

    return NextResponse.json({ photos: uploadedPhotos });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { error: "Something went wrong while uploading photos." },
      { status: 500 }
    );
  }
}